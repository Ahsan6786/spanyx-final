import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const blog = getBlogById(id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (err: any) {
    console.error('Failed to get blog:', err);
    return NextResponse.json({ error: 'Failed to get blog' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = updateBlog(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Blog not found or could not be updated' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (err: any) {
    console.error('Failed to update blog:', err);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const success = deleteBlog(id);

    if (!success) {
      return NextResponse.json({ error: 'Blog not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err: any) {
    console.error('Failed to delete blog:', err);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}

