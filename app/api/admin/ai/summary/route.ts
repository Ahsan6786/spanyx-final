import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getDashboardOverview, getTopPerformingPagesWithLeads, getTrafficSourcesStats } from '@/lib/db/queries';
import { getDashboardAiSummary } from '@/lib/ai/gemini';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('force') === 'true';

    const overview = getDashboardOverview();
    const topPages = getTopPerformingPagesWithLeads(5);
    const sources = getTrafficSourcesStats();

    const metrics = {
      totalVisitors: overview.unique_visitors || overview.total_visitors || 0,
      totalLeads: overview.contact_submissions || 0,
      conversionRate: parseFloat(overview.conversion_rate || '0'),
      topPages: topPages.map((p: any) => ({
        page_url: p.page_url,
        visitors: p.visitors,
        leads: p.leads,
      })),
      sources: sources.slice(0, 5).map((s: any) => ({
        source: s.source,
        count: s.sessions,
      })),
    };

    const summary = await getDashboardAiSummary(metrics, forceRefresh);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    console.error('AI summary API error:', err);
    return NextResponse.json({ error: 'Failed to generate AI summary.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Manual regenerate endpoint
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const overview = getDashboardOverview();
    const topPages = getTopPerformingPagesWithLeads(5);
    const sources = getTrafficSourcesStats();

    const metrics = {
      totalVisitors: overview.unique_visitors || overview.total_visitors || 0,
      totalLeads: overview.contact_submissions || 0,
      conversionRate: parseFloat(overview.conversion_rate || '0'),
      topPages: topPages.map((p: any) => ({
        page_url: p.page_url,
        visitors: p.visitors,
        leads: p.leads,
      })),
      sources: sources.slice(0, 5).map((s: any) => ({
        source: s.source,
        count: s.sessions,
      })),
    };

    const summary = await getDashboardAiSummary(metrics, true);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    console.error('AI regenerate summary error:', err);
    return NextResponse.json({ error: 'Failed to regenerate summary.' }, { status: 500 });
  }
}

