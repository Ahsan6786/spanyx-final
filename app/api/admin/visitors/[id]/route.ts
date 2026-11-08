import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getVisitorDetails } from '@/lib/db/queries';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const details = getVisitorDetails(id);

    if (!details) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: details });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch visitor details' }, { status: 500 });
  }
}

