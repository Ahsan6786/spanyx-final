import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const reportType = url.searchParams.get('type') || 'traffic';
    const format = (url.searchParams.get('format') || 'csv').toLowerCase(); // 'csv' | 'xlsx'
    const db = getDb();

    let data: any[] = [];
    let filename = `spanyx_${reportType}_report_${new Date().toISOString().substring(0, 10)}`;

    switch (reportType) {
      case 'traffic':
        data = db.prepare(`
          SELECT
            started_at,
            session_id,
            visitor_id,
            traffic_source,
            entry_page,
            exit_page,
            duration_seconds,
            pageviews_count,
            is_engaged
          FROM analytics_sessions
          ORDER BY started_at DESC
          LIMIT 5000
        `).all();
        break;

      case 'visitors':
        data = db.prepare(`
          SELECT
            visitor_id,
            first_visit_at,
            last_visit_at,
            visit_count,
            device_category,
            browser,
            os,
            country,
            region
          FROM analytics_visitors
          ORDER BY last_visit_at DESC
          LIMIT 5000
        `).all();
        break;

      case 'pages':
        data = db.prepare(`
          SELECT
            page_url,
            page_title,
            page_category,
            COUNT(*) as views,
            COUNT(DISTINCT visitor_id) as unique_visitors,
            ROUND(AVG(time_spent_seconds), 1) as avg_time_spent_sec,
            ROUND(AVG(scroll_depth), 1) as avg_scroll_depth_pct
          FROM analytics_pageviews
          GROUP BY page_url
          ORDER BY views DESC
        `).all();
        break;

      case 'services':
        data = db.prepare(`
          SELECT
            page_url,
            COUNT(*) as views,
            COUNT(DISTINCT visitor_id) as unique_visitors,
            SUM(time_spent_seconds) as total_dwell_seconds
          FROM analytics_pageviews
          WHERE page_url LIKE '%industries%' OR page_url LIKE '%what-we-create%'
          GROUP BY page_url
          ORDER BY views DESC
        `).all();
        break;

      case 'sources':
        data = db.prepare(`
          SELECT
            traffic_source,
            COUNT(*) as sessions,
            COUNT(DISTINCT visitor_id) as visitors,
            ROUND(AVG(duration_seconds), 1) as avg_duration_sec
          FROM analytics_sessions
          GROUP BY traffic_source
          ORDER BY sessions DESC
        `).all();
        break;

      case 'devices':
        data = db.prepare(`
          SELECT
            device_category,
            browser,
            os,
            COUNT(*) as visitor_count
          FROM analytics_visitors
          GROUP BY device_category, browser, os
          ORDER BY visitor_count DESC
        `).all();
        break;

      case 'consent':
        data = db.prepare(`
          SELECT
            consent_id,
            visitor_id,
            necessary,
            functional,
            analytics,
            marketing,
            consent_status,
            consent_version,
            created_at,
            updated_at
          FROM consent_records
          ORDER BY created_at DESC
          LIMIT 5000
        `).all();
        break;

      case 'leads':
        data = db.prepare(`
          SELECT
            id as lead_id,
            name,
            email,
            company,
            website,
            company_size,
            industry,
            interested_service,
            lead_score,
            status,
            traffic_source,
            first_landing_page,
            created_at
          FROM leads
          ORDER BY created_at DESC
        `).all();
        break;

      case 'campaigns':
        data = db.prepare(`
          SELECT
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            landing_page,
            created_at
          FROM campaign_attribution
          ORDER BY created_at DESC
        `).all();
        break;

      default:
        data = [{ message: 'No data available for this report type.' }];
    }

    // Build Worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    if (format === 'xlsx') {
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      });
    } else {
      // Default CSV
      const csv = XLSX.utils.sheet_to_csv(ws);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    }
  } catch (err: any) {
    console.error('Report export error:', err);
    return NextResponse.json({ error: 'Failed to generate report export.' }, { status: 500 });
  }
}

