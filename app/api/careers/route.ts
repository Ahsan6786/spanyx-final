import { NextRequest, NextResponse } from 'next/server';
import { getCareerPostings } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const posting_type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;

    const postings = getCareerPostings({
      status: 'published',
      category,
      posting_type,
      search,
    });

    return NextResponse.json({
      success: true,
      postings,
    });
  } catch (error) {
    console.error('Error fetching career postings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career opportunities' },
      { status: 500 }
    );
  }
}

