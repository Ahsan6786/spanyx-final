import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'node:crypto';
import { calculateLeadScore } from '@/lib/analytics/leadScoring';
import { analyzeLeadWithGemini } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      company,
      website,
      size,
      message,
      phone,
      industry,
      interested_service,
      job_designation,
      budget,
      preferred_contact_method,
      visitor_id,
      session_id,
      source_page,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // 1. Gather visitor analytics history to compute accurate lead score
    let servicePageCount = 0;
    let hasMeetingClick = false;
    let hasCaseStudyInteraction = false;
    let isRepeatVisitor = false;
    let highDwellTime = false;
    let trafficSource = 'Direct';
    let firstLandingPage = '/';
    let campaignJson = null;

    if (visitor_id) {
      // Check visitor record
      const visitor = db.prepare(`SELECT * FROM analytics_visitors WHERE visitor_id = ?`).get(visitor_id) as any;
      if (visitor && visitor.visit_count > 1) {
        isRepeatVisitor = true;
      }

      // Check session
      if (session_id) {
        const session = db.prepare(`SELECT * FROM analytics_sessions WHERE session_id = ?`).get(session_id) as any;
        if (session) {
          trafficSource = session.traffic_source || 'Direct';
          firstLandingPage = session.entry_page || '/';
          if (session.utm_source || session.utm_campaign) {
            campaignJson = JSON.stringify({
              utm_source: session.utm_source,
              utm_medium: session.utm_medium,
              utm_campaign: session.utm_campaign,
              utm_term: session.utm_term,
              utm_content: session.utm_content,
            });
          }
        }
      }

      // Check pages visited
      const pageviews = db.prepare(`
        SELECT page_url, time_spent_seconds FROM analytics_pageviews WHERE visitor_id = ?
      `).all(visitor_id) as any[];

      const servicePatterns = [/what-we-create/i, /industries\//i, /erp/i, /business-websites/i, /ai-agent/i];
      const matchedServices = new Set<string>();

      for (const pv of pageviews) {
        if (pv.time_spent_seconds > 45) {
          highDwellTime = true;
        }
        for (const pat of servicePatterns) {
          if (pat.test(pv.page_url)) {
            matchedServices.add(pv.page_url);
          }
        }
      }
      servicePageCount = matchedServices.size;

      // Check events
      const events = db.prepare(`
        SELECT event_name, event_category FROM analytics_events WHERE visitor_id = ?
      `).all(visitor_id) as any[];

      for (const ev of events) {
        if (ev.event_name.includes('meeting') || ev.event_name.includes('contact')) {
          hasMeetingClick = true;
        }
        if (ev.event_name.includes('portfolio') || ev.event_name.includes('case_study') || ev.event_name.includes('card')) {
          hasCaseStudyInteraction = true;
        }
      }
    }

    // 2. Compute dynamic lead score
    const scoreResult = calculateLeadScore({
      hasContactFormSubmit: true,
      servicePageCount,
      hasMeetingClick,
      hasCaseStudyInteraction,
      isRepeatVisitor,
      highDwellTime,
    });

    const leadId = 'lead_' + crypto.randomUUID().substring(0, 8);

    // 3. Insert lead record
    const finalSourcePage = source_page ? String(source_page).trim() : firstLandingPage;

    db.prepare(`
      INSERT INTO leads (
        id, visitor_id, session_id, name, email, company, website,
        company_size, industry, interested_service, message, phone,
        job_designation, budget, preferred_contact_method, lead_score,
        status, traffic_source, first_landing_page, source_page, campaign_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      leadId,
      visitor_id || null,
      session_id || null,
      name.trim(),
      email.trim().toLowerCase(),
      company ? company.trim() : null,
      website ? website.trim() : null,
      size || '1-10',
      industry || 'General',
      interested_service || (servicePageCount > 0 ? 'Software Engineering' : 'Custom Software'),
      message ? message.trim() : null,
      phone ? phone.trim() : null,
      job_designation ? job_designation.trim() : null,
      budget || null,
      preferred_contact_method || 'Email',
      scoreResult.score,
      'New',
      trafficSource,
      firstLandingPage,
      finalSourcePage,
      campaignJson,
      now,
      now
    );

    // 4. Log initial lead activity
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, activity_type, description, score_change, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      leadId,
      'form_submission',
      `Lead voluntarily submitted inquiry from ${finalSourcePage}. Initial lead score: ${scoreResult.score}.`,
      scoreResult.score,
      now
    );

    // 5. Asynchronously trigger initial Gemini AI evaluation & cache
    analyzeLeadWithGemini(leadId).catch((err) => {
      console.warn(`Initial background Gemini analysis for ${leadId}:`, err);
    });

    return NextResponse.json({
      success: true,
      lead_id: leadId,
      lead_score: scoreResult.score,
      breakdown: scoreResult.breakdown,
      message: 'Thank you! Your inquiry has been submitted.',
    });
  } catch (err: any) {
    console.error('Lead submission error:', err);
    return NextResponse.json({ error: 'Failed to submit lead inquiry.' }, { status: 500 });
  }
}
