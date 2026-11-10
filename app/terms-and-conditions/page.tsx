import type { Metadata } from 'next';
import UnifiedLegalPage from '@/components/UnifiedLegalPage';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Website & Client Terms of Service',
  description:
    'Review the terms governing the use of the Spanyx website, software services, and preliminary business communications.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/terms-and-conditions`,
  },
  openGraph: {
    title: 'Terms & Conditions — SPANYX',
    description:
      'Review the terms governing the use of the Spanyx website, software services, and preliminary business communications.',
    url: `${SITE_CONFIG.domain}/terms-and-conditions`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'SPANYX — Terms & Conditions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions — SPANYX',
    description:
      'Review the terms governing the use of the Spanyx website and services.',
    images: ['/span/long1.webp'],
  },
};

export default function TermsAndConditionsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms & Conditions', url: '/terms-and-conditions' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <UnifiedLegalPage initialTab="terms" />
    </>
  );
}
