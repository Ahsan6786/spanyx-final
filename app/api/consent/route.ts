import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'node:crypto';
import { getClientIp } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitor_id,
      necessary = 1,
      functional = 0,
      analytics = 0,
      marketing = 0,
      consent_status = 'custom',
      consent_version = '1.0.0',
      policy_version = '2026.1',
    } = body;

    if (!visitor_id) {
      return NextResponse.json({ error: 'visitor_id is required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const clientIp = getClientIp(req);
    // Hash IP for privacy compliance
    const ipHash = crypto.createHash('sha256').update(clientIp + 'spanyx_salt').digest('hex').substring(0, 16);

    // Check if consent record already exists for this visitor
    const existing = db.prepare(`SELECT * FROM consent_records WHERE visitor_id = ?`).get(visitor_id) as any;
    const consentId = existing ? existing.consent_id : 'cst_' + crypto.randomBytes(8).toString('hex');

    const previousCategoriesJson = existing
      ? JSON.stringify({
          necessary: existing.necessary,
          functional: existing.functional,
          analytics: existing.analytics,
          marketing: existing.marketing,
        })
      : null;

    const currentCategoriesJson = JSON.stringify({
      necessary: 1,
      functional: functional ? 1 : 0,
      analytics: analytics ? 1 : 0,
      marketing: marketing ? 1 : 0,
    });

    if (existing) {
      db.prepare(`
        UPDATE consent_records
        SET necessary = ?, functional = ?, analytics = ?, marketing = ?,
            consent_status = ?, consent_version = ?, policy_version = ?,
            user_agent = ?, ip_hash = ?, updated_at = ?
        WHERE visitor_id = ?
      `).run(
        1,
        functional ? 1 : 0,
        analytics ? 1 : 0,
        marketing ? 1 : 0,
        consent_status,
        consent_version,
        policy_version,
        userAgent,
        ipHash,
        now,
        visitor_id
      );
    } else {
      db.prepare(`
        INSERT INTO consent_records (
          id, consent_id, visitor_id, necessary, functional, analytics, marketing,
          consent_status, consent_version, policy_version, user_agent, ip_hash,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        consentId,
        visitor_id,
        1,
        functional ? 1 : 0,
        analytics ? 1 : 0,
        marketing ? 1 : 0,
        consent_status,
        consent_version,
        policy_version,
        userAgent,
        ipHash,
        now,
        now
      );
    }

    // Insert immutable audit log entry
    db.prepare(`
      INSERT INTO consent_audit_logs (
        id, consent_id, visitor_id, action, categories_json, previous_categories_json,
        user_agent, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      consentId,
      visitor_id,
      consent_status,
      currentCategoriesJson,
      previousCategoriesJson,
      userAgent,
      now
    );

    const response = NextResponse.json({
      success: true,
      consent_id: consentId,
      categories: {
        necessary: 1,
        functional: functional ? 1 : 0,
        analytics: analytics ? 1 : 0,
        marketing: marketing ? 1 : 0,
      },
    });

    // Set cookie for server-side consent awareness
    response.cookies.set('spx_consent', consentId, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: any) {
    console.error('Consent error:', err);
    return NextResponse.json({ error: 'Failed to record consent' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const visitor_id = url.searchParams.get('visitor_id');

    if (!visitor_id) {
      return NextResponse.json({ consent: null });
    }

    const db = getDb();
    const record = db.prepare(`SELECT * FROM consent_records WHERE visitor_id = ?`).get(visitor_id);
    return NextResponse.json({ consent: record || null });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read consent' }, { status: 500 });
  }
}

