import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getCareerPostingById, updateCareerPosting, deleteCareerPosting } from '@/lib/db/queries';

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
    const posting = getCareerPostingById(id);
    if (!posting) {
      return NextResponse.json({ error: 'Posting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, posting });
  } catch (err: any) {
    console.error('Failed to get career posting:', err);
    return NextResponse.json({ error: 'Failed to retrieve posting' }, { status: 500 });
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

    const updated = updateCareerPosting(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Opportunity posting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, posting: updated });
  } catch (err: any) {
    console.error('Failed to update career posting:', err);
    return NextResponse.json({ error: 'Failed to update opportunity posting' }, { status: 500 });
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
    const success = deleteCareerPosting(id);
    if (!success) {
      return NextResponse.json({ error: 'Posting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Posting deleted successfully' });
  } catch (err: any) {
    console.error('Failed to delete career posting:', err);
    return NextResponse.json({ error: 'Failed to delete posting' }, { status: 500 });
  }
}

