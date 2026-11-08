import type { Metadata } from 'next';
import UnifiedLegalPage from '@/components/UnifiedLegalPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions — SPANYX',
  description:
    'Review the terms governing the use of the Spanyx website and preliminary business communications.',
};

export default function TermsAndConditionsPage() {
  return <UnifiedLegalPage initialTab="terms" />;
}
