import type { Metadata } from 'next';
import BlogPageContent from '@/components/BlogPageContent';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { getPublishedBlogs } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Publications',
  description:
    'Deep architectural explorations, system design blueprints, and technical case studies from the Spanyx software engineering squad.',
  keywords: [
    'Software Engineering Blog',
    'System Design Case Studies',
    'Nextjs Performance Optimization',
    'Enterprise Architecture Insights',
    'Tech Engineering Articles',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/blog`,
  },
  openGraph: {
    title: 'SPANYX Engineering Blog & Technical Publications',
    description:
      'Deep architectural explorations, system design blueprints, and technical case studies from the Spanyx engineering squad.',
    url: `${SITE_CONFIG.domain}/blog`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'SPANYX Engineering Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPANYX Engineering Blog & Technical Publications',
    description:
      'Deep architectural explorations and technical case studies from the Spanyx engineering squad.',
    images: ['/span/long1.webp'],
  },
};

export default function BlogPage() {
  const { blogs } = getPublishedBlogs({ limit: 100 });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Engineering Blog', url: '/blog' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_CONFIG.domain}/blog/#webpage`,
    url: `${SITE_CONFIG.domain}/blog`,
    name: 'SPANYX Engineering Blog & Technical Publications',
    description:
      'Deep architectural explorations and technical case studies from the Spanyx engineering squad.',
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogs.map((article, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: article.title,
        url: `${SITE_CONFIG.domain}/blog/${article.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, collectionSchema]} />
      <BlogPageContent />
    </>
  );
}
