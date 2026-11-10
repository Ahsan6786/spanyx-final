import type { Metadata } from 'next';
import UnifiedLegalPage from '@/components/UnifiedLegalPage';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data Protection & Privacy Practices',
  description:
    'Learn how Spanyx collects, uses, and protects information submitted through our website and business inquiry channels.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy — SPANYX',
    description:
      'Learn how Spanyx collects, uses, and protects information submitted through our website and business inquiry channels.',
    url: `${SITE_CONFIG.domain}/privacy-policy`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'SPANYX — Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — SPANYX',
    description:
      'Learn how Spanyx collects, uses, and protects information submitted through our website.',
    images: ['/span/long1.webp'],
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <UnifiedLegalPage initialTab="privacy" />
    </>
  );
}
