import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload (base64 or remote URL)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.url) {
        return NextResponse.json({ success: true, url: body.url });
      }
      if (body.data) {
        // Base64 data string
        const matches = body.data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1].split('/')[1] || 'png';
          const filename = `blog_${crypto.randomBytes(8).toString('hex')}.${ext}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

          try {
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            const buffer = Buffer.from(matches[2], 'base64');
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            return NextResponse.json({ success: true, url: `/uploads/blogs/${filename}` });
          } catch {
            // Fallback to storing data URL directly
            return NextResponse.json({ success: true, url: body.data });
          }
        }
      }
    }

    // Handle multipart FormData file upload
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `blog_${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/blogs/${filename}` });
    } catch {
      // Fallback: convert to base64 data URL
      const base64 = buffer.toString('base64');
      const mime = file.type || 'image/jpeg';
      return NextResponse.json({ success: true, url: `data:${mime};base64,${base64}` });
    }
  } catch (err: any) {
    console.error('Failed to upload blog image:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

