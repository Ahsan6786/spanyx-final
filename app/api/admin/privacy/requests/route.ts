import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { deleteVisitorData } from '@/lib/db/queries';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const requests = db.prepare(`SELECT * FROM data_deletion_requests ORDER BY requested_at DESC`).all();
    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch deletion requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, email, visitor_id, notes } = body;
    const db = getDb();
    const now = new Date().toISOString();

    if (action === 'create') {
      if (!email && !visitor_id) {
        return NextResponse.json({ error: 'Email or visitor_id is required' }, { status: 400 });
      }

      const reqId = 'del_' + crypto.randomUUID().substring(0, 8);
      db.prepare(`
        INSERT INTO data_deletion_requests (id, visitor_id, email, status, requested_at, notes)
        VALUES (?, ?, ?, 'Pending', ?, ?)
      `).run(reqId, visitor_id || null, email || null, now, notes || 'Requested by data principal');

      return NextResponse.json({ success: true, message: 'Deletion request registered', id: reqId });
    }

    if (action === 'process') {
      if (!id) {
        return NextResponse.json({ error: 'Request id is required' }, { status: 400 });
      }

      const reqRecord = db.prepare(`SELECT * FROM data_deletion_requests WHERE id = ?`).get(id) as any;
      if (!reqRecord) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }

      const target = reqRecord.visitor_id || reqRecord.email;
      if (target) {
        deleteVisitorData(target);
      }

      db.prepare(`
        UPDATE data_deletion_requests
        SET status = 'Processed', processed_at = ?, notes = notes || ' [Data purged on ' || ? || ']'
        WHERE id = ?
      `).run(now, now, id);

      return NextResponse.json({ success: true, message: 'Data deleted and request marked as processed' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

