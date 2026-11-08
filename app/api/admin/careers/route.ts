import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getCareerPostings, createCareerPosting, getCareersStats } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const category = url.searchParams.get('category') || undefined;
    const posting_type = url.searchParams.get('type') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const postings = getCareerPostings({
      category,
      posting_type,
      status,
      search,
    });

    const stats = getCareersStats();

    return NextResponse.json({
      success: true,
      postings,
      stats,
    });
  } catch (err: any) {
    console.error('Failed to fetch admin career postings:', err);
    return NextResponse.json({ error: 'Failed to fetch career postings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, posting_type, category, department, work_mode, location, duration, is_paid, stipend, required_skills, eligibility, certificate_available, has_ppo, description, responsibilities, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newPosting = createCareerPosting({
      title: title.trim(),
      posting_type: posting_type || 'internship',
      category: category || (posting_type === 'internship' ? 'Internship Opportunities' : 'Full-Time Jobs'),
      department: department || 'Engineering',
      work_mode: work_mode || 'Remote',
      location: location || 'Remote (India)',
      duration: duration || (posting_type === 'internship' ? '3 Months' : 'Permanent'),
      is_paid: is_paid !== undefined ? (is_paid ? 1 : 0) : 1,
      stipend: stipend || '',
      required_skills: required_skills || '',
      eligibility: eligibility || '',
      certificate_available: certificate_available !== undefined ? (certificate_available ? 1 : 0) : 1,
      has_ppo: has_ppo !== undefined ? (has_ppo ? 1 : 0) : 1,
      description: description || '',
      responsibilities: responsibilities || '',
      status: status || 'published',
    });

    return NextResponse.json({
      success: true,
      posting: newPosting,
    });
  } catch (err: any) {
    console.error('Failed to create career posting:', err);
    return NextResponse.json({ error: 'Failed to create career posting' }, { status: 500 });
  }
}

