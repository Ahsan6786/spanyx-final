import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import {
  getDashboardOverview,
  getTimelineStats,
  getTrafficSourcesStats,
  getDeviceDistribution,
  getPopularPages,
  getServiceInterestStats,
  getLeadsList,
  DateFilter,
} from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '30d';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Compute date filter
    const filter: DateFilter = {};
    const now = new Date();

    if (range === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      filter.startDate = start;
    } else if (range === 'yesterday') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filter.startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
      filter.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (range === '7d') {
      filter.startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === '30d') {
      filter.startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === '90d') {
      filter.startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === 'custom' && startDate) {
      filter.startDate = startDate;
      if (endDate) filter.endDate = endDate;
    }

    const overview = getDashboardOverview(filter);
    const timeline = getTimelineStats(filter);
    const sources = getTrafficSourcesStats(filter);
    const devices = getDeviceDistribution(filter);
    const popularPages = getPopularPages(10, filter);
    const serviceInterests = getServiceInterestStats(filter);
    const recentLeads = getLeadsList(1, 5);

    return NextResponse.json({
      success: true,
      data: {
        overview,
        timeline,
        sources,
        devices,
        popularPages,
        serviceInterests,
        recentLeads: recentLeads.leads,
      },
    });
  } catch (err: any) {
    console.error('Admin dashboard API error:', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics.' }, { status: 500 });
  }
}

