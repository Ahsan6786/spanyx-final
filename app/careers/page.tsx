import { Metadata } from 'next';
import CareersPageContent from '@/components/CareersPageContent';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { CAREERS_DATA } from '@/data/careersData';

export const metadata: Metadata = {
  title: 'Careers & Internship Opportunities — Software Engineering Squad',
  description:
    'Join the Spanyx engineering squad. Explore full-time roles, fresher engineering positions, and paid software internships in remote and hybrid settings.',
  keywords: [
    'Software Engineering Careers India',
    'Remote Web Developer Jobs',
    'Frontend Developer Internships',
    'Backend Engineer Jobs',
    'Full Stack Engineering Opportunities',
    'AI ML Engineering Internships',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/careers`,
  },
  openGraph: {
    title: 'Careers & Opportunities — SPANYX Engineering Squad',
    description:
      'Join the Spanyx engineering squad. Explore full-time roles, fresher engineering positions, and paid software internships in remote and hybrid settings.',
    url: `${SITE_CONFIG.domain}/careers`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'Careers & Opportunities — SPANYX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers & Opportunities — SPANYX Engineering Squad',
    description:
      'Explore full-time jobs, fresher opportunities, and paid internships at SPANYX.',
    images: ['/span/long1.webp'],
  },
};

export default function CareersPage() {
  const postings = CAREERS_DATA;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Careers & Opportunities', url: '/careers' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_CONFIG.domain}/careers/#webpage`,
    url: `${SITE_CONFIG.domain}/careers`,
    name: 'Careers & Opportunities — SPANYX Engineering Squad',
    description:
      'Explore full-time jobs, fresher opportunities, and paid internships at SPANYX.',
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: postings.map((job, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: job.title,
        url: `${SITE_CONFIG.domain}/careers/${job.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, collectionSchema]} />
      <CareersPageContent />
    </>
  );
}
