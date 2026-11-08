import { NextRequest, NextResponse } from 'next/server';
import { revokeAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      revokeAdminSession(token);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete(ADMIN_COOKIE_NAME);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}

