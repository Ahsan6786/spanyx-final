import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'About Us — Engineering Team & Digital Vision',
  description:
    'Learn how Spanyx builds scalable, resilient software platforms, enterprise applications, and AI integrations designed for measurable business impact.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about`,
  },
  openGraph: {
    title: 'About Spanyx — Engineering Team & Digital Vision',
    description:
      'Learn how Spanyx builds scalable, resilient software platforms, enterprise applications, and AI integrations designed for measurable business impact.',
    url: `${SITE_CONFIG.domain}/about`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'About Spanyx — Engineering Team & Digital Vision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Spanyx — Engineering Team & Digital Vision',
    description:
      'Learn how Spanyx builds scalable, resilient software platforms, enterprise applications, and AI integrations.',
    images: ['/span/long1.webp'],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]);

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_CONFIG.domain}/about/#webpage`,
    url: `${SITE_CONFIG.domain}/about`,
    name: 'About Spanyx — Engineering Team & Digital Vision',
    description:
      'Learn how Spanyx builds scalable, resilient software platforms, enterprise applications, and AI integrations designed for measurable business impact.',
    mainEntity: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, aboutPageSchema]} />
      <AboutPageContent />
    </>
  );
}
