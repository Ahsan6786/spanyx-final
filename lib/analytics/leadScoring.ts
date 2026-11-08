import { getDb } from '@/lib/db';

export interface LeadScoreFactors {
  hasContactFormSubmit: boolean;
  servicePageCount: number;
  hasMeetingClick: boolean;
  hasCaseStudyInteraction: boolean;
  isRepeatVisitor: boolean;
  highDwellTime: boolean;
}

export function calculateLeadScore(factors: LeadScoreFactors): { score: number; breakdown: Record<string, number> } {
  const db = getDb();
  let weights = {
    contact_form_submission: 30,
    schedule_meeting_click: 20,
    service_page_visit: 10,
    multiple_service_pages: 10,
    case_study_interaction: 5,
    repeat_visit: 5,
    high_dwell_time: 5,
  };

  try {
    const setting = db.prepare(`SELECT value FROM system_settings WHERE key = 'lead_scoring_weights'`).get() as any;
    if (setting && setting.value) {
      weights = { ...weights, ...JSON.parse(setting.value) };
    }
  } catch (err) {
    // fallback to default
  }

  const breakdown: Record<string, number> = {};
  let totalScore = 0;

  if (factors.hasContactFormSubmit) {
    breakdown['Contact Form Submission'] = weights.contact_form_submission;
    totalScore += weights.contact_form_submission;
  }

  if (factors.hasMeetingClick) {
    breakdown['Schedule Meeting CTA'] = weights.schedule_meeting_click;
    totalScore += weights.schedule_meeting_click;
  }

  if (factors.servicePageCount > 0) {
    breakdown['Service Page Visit'] = weights.service_page_visit;
    totalScore += weights.service_page_visit;
  }

  if (factors.servicePageCount >= 2) {
    breakdown['Multiple Services Explored'] = weights.multiple_service_pages;
    totalScore += weights.multiple_service_pages;
  }

  if (factors.hasCaseStudyInteraction) {
    breakdown['Case Study / Portfolio Engagement'] = weights.case_study_interaction;
    totalScore += weights.case_study_interaction;
  }

  if (factors.isRepeatVisitor) {
    breakdown['Repeat Visitor'] = weights.repeat_visit;
    totalScore += weights.repeat_visit;
  }

  if (factors.highDwellTime) {
    breakdown['High Dwell Time (Deep Reading)'] = weights.high_dwell_time;
    totalScore += weights.high_dwell_time;
  }

  return { score: totalScore, breakdown };
}

export function getLeadInterestTier(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
}

