import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getAllBlogs, createBlog, getBlogStats } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const { blogs, total } = getAllBlogs({ status, category, search, limit, offset });
    const stats = getBlogStats();

    return NextResponse.json({
      success: true,
      blogs,
      total,
      stats,
    });
  } catch (err: any) {
    console.error('Failed to fetch admin blogs:', err);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, slug, category, tags, status, featured_image, author_name, author_role, author_avatar, published_at } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Blog title is required' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Blog content is required' }, { status: 400 });
    }

    const blog = createBlog({
      title: title.trim(),
      slug: slug?.trim() || undefined,
      excerpt: excerpt?.trim() || undefined,
      content: content.trim(),
      featured_image: featured_image?.trim() || null,
      author_name: author_name?.trim() || admin.name || 'Spanyx Engineering Team',
      author_role: author_role?.trim() || 'Core Team',
      author_avatar: author_avatar?.trim() || '/span/small-logo.png',
      category: category?.trim() || 'Engineering',
      tags: tags?.trim() || '',
      status: status === 'published' ? 'published' : 'draft',
      published_at: published_at || undefined,
    });

    return NextResponse.json({ success: true, blog });
  } catch (err: any) {
    console.error('Failed to create blog:', err);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

