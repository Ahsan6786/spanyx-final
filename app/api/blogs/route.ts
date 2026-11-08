import { NextRequest, NextResponse } from 'next/server';
import { getPublishedBlogs, getBlogStats } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const { blogs, total } = getPublishedBlogs({ category, search, limit, offset });
    const stats = getBlogStats();

    return NextResponse.json({
      success: true,
      blogs,
      total,
      published_count: stats.published_posts,
    });
  } catch (err: any) {
    console.error('Failed to fetch published blogs:', err);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

