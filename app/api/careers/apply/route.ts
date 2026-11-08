import { NextRequest, NextResponse } from 'next/server';
import { createCareerApplication, getCareerPostingById } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      posting_id,
      applicant_name,
      applicant_email,
      applicant_phone,
      experience_level,
      current_college_or_company,
      graduation_year,
      portfolio_or_linkedin,
      resume_url_or_text,
      cover_note,
    } = body;

    if (!posting_id || !applicant_name || !applicant_email || !applicant_phone || !experience_level) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields (Name, Email, Phone, Experience Level).' },
        { status: 400 }
      );
    }

    const validLevels = ['Student', 'Fresher', 'Experienced Professional'];
    if (!validLevels.includes(experience_level)) {
      return NextResponse.json(
        { success: false, error: 'Invalid experience level selected.' },
        { status: 400 }
      );
    }

    const posting = getCareerPostingById(posting_id);
    if (!posting) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found.' },
        { status: 404 }
      );
    }

    const appType: 'internship' | 'job' = posting.posting_type === 'internship' ? 'internship' : 'job';

    const application = createCareerApplication({
      posting_id: posting.id,
      posting_title: posting.title,
      posting_type: appType,
      applicant_name: applicant_name.trim(),
      applicant_email: applicant_email.trim().toLowerCase(),
      applicant_phone: applicant_phone.trim(),
      experience_level,
      current_college_or_company: current_college_or_company?.trim(),
      graduation_year: graduation_year?.trim(),
      portfolio_or_linkedin: portfolio_or_linkedin?.trim(),
      resume_url_or_text: resume_url_or_text?.trim(),
      cover_note: cover_note?.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application_id: application.id,
    });
  } catch (error) {
    console.error('Error submitting career application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

