import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getLeadsList, updateLeadStatus } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '15', 10);
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const data = getLeadsList(page, pageSize, status, search);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { lead_id, status, notes } = body;

    if (!lead_id || !status) {
      return NextResponse.json({ error: 'lead_id and status are required' }, { status: 400 });
    }

    updateLeadStatus(lead_id, status, notes);
    return NextResponse.json({ success: true, message: 'Lead status updated' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 });
  }
}

