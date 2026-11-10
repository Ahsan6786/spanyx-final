import type { Metadata } from 'next';
import IndustriesPageContent from '@/components/IndustriesPageContent';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { INDUSTRIES_DATA } from '@/data/industriesData';

export const metadata: Metadata = {
  title: 'Industries We Serve — Specialized Software Engineering',
  description:
    'Explore specialized software engineering, portals, and cloud solutions engineered for 16 core industry sectors: Real Estate, FinTech, Higher Education, E-Commerce, Healthcare, and more.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/industries`,
  },
  openGraph: {
    title: 'Industries We Serve — Specialized Software Engineering | SPANYX',
    description:
      'Specialized software engineering and custom technology solutions engineered for 16 core industry sectors.',
    url: `${SITE_CONFIG.domain}/industries`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'Industries We Serve — SPANYX Software Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industries We Serve — Specialized Software Engineering | SPANYX',
    description:
      'Specialized software engineering and custom technology solutions engineered for 16 core industry sectors.',
    images: ['/span/long1.webp'],
  },
};

export default function IndustriesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Industries We Serve', url: '/industries' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_CONFIG.domain}/industries/#webpage`,
    url: `${SITE_CONFIG.domain}/industries`,
    name: 'Industries We Serve — Specialized Software Engineering',
    description:
      'Explore specialized software engineering, portals, and cloud solutions engineered for 16 core industry sectors.',
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: INDUSTRIES_DATA.map((ind, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: ind.name,
        url: `${SITE_CONFIG.domain}/industries/${ind.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, collectionSchema]} />
      <IndustriesPageContent />
    </>
  );
}
