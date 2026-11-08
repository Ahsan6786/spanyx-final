import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getCookieInventory } from '@/lib/db/queries';
import { getDb } from '@/lib/db';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inventory = getCookieInventory();
    return NextResponse.json({ success: true, inventory });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch cookie inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, provider, category, purpose, expiry, type } = body;

    if (!name || !provider || !category) {
      return NextResponse.json({ error: 'name, provider, and category are required' }, { status: 400 });
    }

    const db = getDb();
    const id = 'cookie_' + name.replace(/[^a-zA-Z0-9_]/g, '_');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO cookie_inventory (id, name, provider, category, purpose, expiry, type, detected, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
      ON CONFLICT(name) DO UPDATE SET
        provider = excluded.provider,
        category = excluded.category,
        purpose = excluded.purpose,
        expiry = excluded.expiry,
        type = excluded.type,
        updated_at = excluded.updated_at
    `).run(id, name, provider, category, purpose || '', expiry || 'Session', type || 'First-party', now);

    return NextResponse.json({ success: true, message: 'Cookie inventory updated' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save cookie item' }, { status: 500 });
  }
}

