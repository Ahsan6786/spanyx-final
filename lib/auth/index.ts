import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'spx_admin_token';
export const SESSION_EXPIRY_DAYS = 7;

// Rate limiting: max 5 failed attempts in 15 minutes per IP
const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export function checkRateLimit(ipAddress: string): { allowed: boolean; remaining: number } {
  const db = getDb();
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const attempts = db.prepare(`
    SELECT COUNT(*) as failed_count
    FROM login_attempts
    WHERE ip_address = ? AND attempted_at >= ? AND success = 0
  `).get(ipAddress, windowStart) as any;

  const failedCount = attempts?.failed_count || 0;
  if (failedCount >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - failedCount };
}

export function recordLoginAttempt(ipAddress: string, email: string, success: boolean) {
  const db = getDb();
  db.prepare(`
    INSERT INTO login_attempts (id, ip_address, email, attempted_at, success)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    ipAddress,
    email,
    new Date().toISOString(),
    success ? 1 : 0
  );
}

export async function authenticateAdmin(email: string, password: string, ipAddress: string, userAgent?: string) {
  const rateLimit = checkRateLimit(ipAddress);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many failed login attempts. Please try again in ${WINDOW_MINUTES} minutes.`,
      rateLimited: true,
    };
  }

  const db = getDb();
  const admin = db.prepare(`SELECT * FROM admins WHERE email = ?`).get(email) as any;

  if (!admin) {
    recordLoginAttempt(ipAddress, email, false);
    return { success: false, error: 'Invalid email or password.' };
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isPasswordValid) {
    recordLoginAttempt(ipAddress, email, false);
    return { success: false, error: 'Invalid email or password.' };
  }

  // Success
  recordLoginAttempt(ipAddress, email, true);

  // Update last login
  const now = new Date();
  db.prepare(`UPDATE admins SET last_login_at = ? WHERE id = ?`).run(now.toISOString(), admin.id);

  // Create session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO admin_sessions (id, token, admin_id, expires_at, created_at, user_agent, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    token,
    admin.id,
    expiresAt,
    now.toISOString(),
    userAgent || null,
    ipAddress
  );

  return {
    success: true,
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

export function verifyAdminSession(token: string | null | undefined) {
  if (!token) return null;
  const db = getDb();
  const now = new Date().toISOString();

  const session = db.prepare(`
    SELECT s.id as session_id, s.token, s.expires_at, a.id as admin_id, a.email, a.name, a.role
    FROM admin_sessions s
    JOIN admins a ON s.admin_id = a.id
    WHERE s.token = ? AND s.expires_at > ?
  `).get(token, now) as any;

  return session || null;
}

export function revokeAdminSession(token: string) {
  const db = getDb();
  db.prepare(`DELETE FROM admin_sessions WHERE token = ?`).run(token);
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

