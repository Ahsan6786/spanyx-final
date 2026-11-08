import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getCareerApplications, getCareersStats } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const posting_type = url.searchParams.get('type') || undefined;
    const experience_level = url.searchParams.get('experience') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const posting_id = url.searchParams.get('posting_id') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const applications = getCareerApplications({
      posting_type,
      experience_level,
      status,
      posting_id,
      search,
    });

    const stats = getCareersStats();

    return NextResponse.json({
      success: true,
      applications,
      stats,
    });
  } catch (err: any) {
    console.error('Failed to fetch career applications:', err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

