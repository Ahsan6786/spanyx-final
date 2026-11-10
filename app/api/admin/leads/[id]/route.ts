import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getLeadDetails } from '@/lib/db/queries';
import { analyzeLeadWithGemini } from '@/lib/ai/gemini';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const details = getLeadDetails(id);

    if (!details) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Retrieve cached Gemini AI assessment
    const aiAnalysis = await analyzeLeadWithGemini(id, false);

    return NextResponse.json({
      success: true,
      data: {
        ...details,
        aiAnalysis,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch lead details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Manual re-analysis bypasses cache and regenerates
    const aiAnalysis = await analyzeLeadWithGemini(id, true);

    return NextResponse.json({
      success: true,
      data: aiAnalysis,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to regenerate AI analysis' }, { status: 500 });
  }
}

