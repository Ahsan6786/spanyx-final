import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getDashboardOverview, getTopPerformingPagesWithLeads, getTrafficSourcesStats, getServiceInterestStats } from '@/lib/db/queries';
import { getCategorizedAiInsights } from '@/lib/ai/gemini';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('force') === 'true';

    const overview = getDashboardOverview();
    const topPages = getTopPerformingPagesWithLeads(8);
    const sources = getTrafficSourcesStats();
    const services = getServiceInterestStats();

    const payload = {
      totalVisitors: overview.unique_visitors || overview.total_visitors || 0,
      totalLeads: overview.contact_submissions || 0,
      conversionRate: overview.conversion_rate || '0.00',
      avgSessionDuration: overview.avg_session_duration || 0,
      topPages: topPages.slice(0, 5),
      topSources: sources.slice(0, 4),
      serviceInterests: services.slice(0, 5),
    };

    const insights = await getCategorizedAiInsights(payload, forceRefresh);

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (err: any) {
    console.error('AI insights API error:', err);
    return NextResponse.json({ error: 'Failed to fetch AI insights.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const overview = getDashboardOverview();
    const topPages = getTopPerformingPagesWithLeads(8);
    const sources = getTrafficSourcesStats();
    const services = getServiceInterestStats();

    const payload = {
      totalVisitors: overview.unique_visitors || overview.total_visitors || 0,
      totalLeads: overview.contact_submissions || 0,
      conversionRate: overview.conversion_rate || '0.00',
      avgSessionDuration: overview.avg_session_duration || 0,
      topPages: topPages.slice(0, 5),
      topSources: sources.slice(0, 4),
      serviceInterests: services.slice(0, 5),
    };

    const insights = await getCategorizedAiInsights(payload, true);

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (err: any) {
    console.error('AI insights regenerate error:', err);
    return NextResponse.json({ error: 'Failed to regenerate AI insights.' }, { status: 500 });
  }
}

