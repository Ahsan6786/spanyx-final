import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type, // 'pageview' | 'heartbeat' | 'event'
      visitor_id,
      session_id,
      page_url,
      page_title,
      referrer,
      device_info,
      utm_params,
      event_data,
      metrics,
    } = body;

    if (!visitor_id || !session_id) {
      return NextResponse.json({ error: 'visitor_id and session_id required' }, { status: 400 });
    }

    const db = getDb();

    // 1. Check Analytics Consent
    const consent = db.prepare(`SELECT analytics FROM consent_records WHERE visitor_id = ?`).get(visitor_id) as any;
    if (!consent || consent.analytics !== 1) {
      return NextResponse.json({ ignored: true, reason: 'Analytics consent not granted' }, { status: 200 });
    }

    const now = new Date().toISOString();

    // 2. Upsert Visitor
    const existingVisitor = db.prepare(`SELECT * FROM analytics_visitors WHERE visitor_id = ?`).get(visitor_id) as any;
    if (existingVisitor) {
      db.prepare(`
        UPDATE analytics_visitors
        SET last_visit_at = ?, updated_at = ?
        WHERE visitor_id = ?
      `).run(now, now, visitor_id);
    } else {
      db.prepare(`
        INSERT INTO analytics_visitors (
          id, visitor_id, first_visit_at, last_visit_at, visit_count,
          device_category, browser, browser_version, os, screen_resolution,
          language, country, region, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        visitor_id,
        now,
        now,
        1,
        device_info?.deviceCategory || 'Desktop',
        device_info?.browser || 'Unknown',
        device_info?.browserVersion || null,
        device_info?.os || 'Unknown',
        device_info?.screenResolution || null,
        device_info?.language || 'en',
        device_info?.country || 'India',
        device_info?.region || null,
        now,
        now
      );
    }

    // 3. Upsert Session
    const existingSession = db.prepare(`SELECT * FROM analytics_sessions WHERE session_id = ?`).get(session_id) as any;
    if (existingSession) {
      const duration = metrics?.sessionDuration || 0;
      const isEngaged = duration > 10 || existingSession.pageviews_count > 1 ? 1 : 0;
      const isBounce = existingSession.pageviews_count <= 1 && duration < 10 ? 1 : 0;

      db.prepare(`
        UPDATE analytics_sessions
        SET ended_at = ?,
            duration_seconds = MAX(duration_seconds, ?),
            pageviews_count = pageviews_count + (CASE WHEN ? = 'pageview' THEN 1 ELSE 0 END),
            exit_page = ?,
            is_bounce = ?,
            is_engaged = ?
        WHERE session_id = ?
      `).run(
        now,
        duration,
        type,
        page_url || existingSession.exit_page,
        isBounce,
        isEngaged,
        session_id
      );
    } else {
      // Determine traffic source
      let source = 'Direct';
      const ref = referrer || '';
      if (utm_params?.utm_source) {
        source = `Campaign: ${utm_params.utm_source}`;
      } else if (ref.includes('google.') || ref.includes('bing.') || ref.includes('duckduckgo.')) {
        source = 'Organic Search';
      } else if (ref.includes('linkedin.') || ref.includes('twitter.') || ref.includes('x.com') || ref.includes('instagram.')) {
        source = 'Social Media';
      } else if (ref) {
        try {
          const domain = new URL(ref).hostname;
          source = `Referral (${domain})`;
        } catch {
          source = 'Referral';
        }
      }

      let referringDomain = null;
      if (ref) {
        try {
          referringDomain = new URL(ref).hostname;
        } catch {}
      }

      db.prepare(`
        INSERT INTO analytics_sessions (
          id, session_id, visitor_id, started_at, ended_at, duration_seconds,
          pageviews_count, entry_page, exit_page, referrer, referring_domain,
          traffic_source, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          is_bounce, is_engaged, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        session_id,
        visitor_id,
        now,
        now,
        0,
        1,
        page_url,
        page_url,
        referrer || null,
        referringDomain,
        source,
        utm_params?.utm_source || null,
        utm_params?.utm_medium || null,
        utm_params?.utm_campaign || null,
        utm_params?.utm_term || null,
        utm_params?.utm_content || null,
        1,
        0,
        now
      );

      // Record Campaign Attribution if UTM exists
      if (utm_params && (utm_params.utm_source || utm_params.utm_campaign)) {
        db.prepare(`
          INSERT INTO campaign_attribution (
            id, session_id, visitor_id, utm_source, utm_medium, utm_campaign,
            utm_term, utm_content, referrer, landing_page, attribution_model, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          session_id,
          visitor_id,
          utm_params.utm_source || null,
          utm_params.utm_medium || null,
          utm_params.utm_campaign || null,
          utm_params.utm_term || null,
          utm_params.utm_content || null,
          referrer || null,
          page_url,
          'last_touch',
          now
        );
      }
    }

    // 4. Record Pageview
    if (type === 'pageview') {
      let pageCategory = 'general';
      if (page_url.includes('/industries/')) pageCategory = 'industry_detail';
      else if (page_url === '/industries') pageCategory = 'industries_directory';
      else if (page_url.includes('/what-we-create/')) pageCategory = 'service_detail';
      else if (page_url.includes('/about')) pageCategory = 'about';
      else if (page_url.includes('/terms') || page_url.includes('/privacy')) pageCategory = 'legal';
      else if (page_url === '/' || page_url === '') pageCategory = 'homepage';

      db.prepare(`
        INSERT INTO analytics_pageviews (
          id, session_id, visitor_id, page_url, page_title, page_category,
          entered_at, exited_at, time_spent_seconds, scroll_depth, previous_page, next_page
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        session_id,
        visitor_id,
        page_url,
        page_title || page_url,
        pageCategory,
        now,
        null,
        0,
        0,
        referrer || null,
        null
      );
    } else if (type === 'heartbeat') {
      // Update dwell time & scroll depth on latest pageview
      const timeSpent = metrics?.timeSpent || 0;
      const scrollDepth = metrics?.scrollDepth || 0;

      db.prepare(`
        UPDATE analytics_pageviews
        SET exited_at = ?,
            time_spent_seconds = MAX(time_spent_seconds, ?),
            scroll_depth = MAX(scroll_depth, ?)
        WHERE id = (
          SELECT id FROM analytics_pageviews
          WHERE session_id = ? AND page_url = ?
          ORDER BY entered_at DESC LIMIT 1
        )
      `).run(now, timeSpent, scrollDepth, session_id, page_url);
    } else if (type === 'event' && event_data) {
      // Record Event
      db.prepare(`
        INSERT INTO analytics_events (
          id, session_id, visitor_id, event_name, event_category,
          element_id, element_text, page_url, metadata_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        session_id,
        visitor_id,
        event_data.name || 'interaction',
        event_data.category || 'general',
        event_data.elementId || null,
        event_data.elementText || null,
        page_url,
        event_data.metadata ? JSON.stringify(event_data.metadata) : null,
        now
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics collector error:', err);
    return NextResponse.json({ error: 'Internal analytics error' }, { status: 500 });
  }
}

