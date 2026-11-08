import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { runDataRetentionCleanup } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const rows = db.prepare(`SELECT key, value FROM system_settings`).all() as any[];
    const settings: Record<string, any> = {};

    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, key, value, retentionDays } = body;

    const db = getDb();
    const now = new Date().toISOString();

    if (action === 'cleanup') {
      const days = parseInt(retentionDays || '180', 10);
      const result = runDataRetentionCleanup(days);
      return NextResponse.json({ success: true, message: 'Retention cleanup complete', ...result });
    }

    if (key && value !== undefined) {
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      db.prepare(`
        INSERT INTO system_settings (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).run(key, valStr, now);
      return NextResponse.json({ success: true, message: 'Setting saved' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

