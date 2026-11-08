import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug, getBlogById, incrementBlogViews } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    let blog = getBlogBySlug(slug);

    if (!blog) {
      // Also check by ID fallback
      blog = getBlogById(slug);
    }

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Only allow viewing if published, unless accessed with an admin preview query
    const url = new URL(req.url);
    const isPreview = url.searchParams.get('preview') === 'true';

    if (blog.status !== 'published' && !isPreview) {
      return NextResponse.json({ error: 'Blog not published' }, { status: 404 });
    }

    // Increment views asynchronously if public published view
    if (blog.status === 'published' && !isPreview) {
      incrementBlogViews(blog.id);
    }

    return NextResponse.json({ success: true, blog });
  } catch (err: any) {
    console.error('Failed to fetch blog by slug:', err);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

