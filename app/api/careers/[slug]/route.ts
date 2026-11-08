import { NextRequest, NextResponse } from 'next/server';
import { getCareerPostingBySlug } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const posting = getCareerPostingBySlug(slug);

    if (!posting || posting.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found or no longer active' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      posting,
    });
  } catch (error) {
    console.error('Error fetching opportunity detail:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

