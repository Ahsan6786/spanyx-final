import { Metadata } from 'next';
import CareersPageContent from '@/components/CareersPageContent';

export const metadata: Metadata = {
  title: 'Careers & Internship Opportunities | SPANYX',
  description:
    'Explore full-time jobs, fresher opportunities, and paid internships at SPANYX across web development, backend engineering, UI/UX, AI/ML, and digital marketing.',
};

export default function CareersPage() {
  return <CareersPageContent />;
}

