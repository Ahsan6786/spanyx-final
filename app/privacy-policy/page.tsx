import type { Metadata } from 'next';
import UnifiedLegalPage from '@/components/UnifiedLegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — SPANYX',
  description:
    'Learn how Spanyx collects, uses, and protects information submitted through our website and business inquiry channels.',
};

export default function PrivacyPolicyPage() {
  return <UnifiedLegalPage initialTab="privacy" />;
}
