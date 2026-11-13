import type { Metadata } from 'next';
import ServicesPageContent from '@/components/ServicesPageContent';
import { SERVICES_LIST } from '@/data/servicesData';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Services & Digital Solutions | SPANYX',
  description:
    'Explore SPANYX digital solutions and custom software: ERP Solutions, Business Websites, AI Agents, Scroll-Driven Animations, Brand Portfolios, Web Apps, and FinTech Platforms.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services`,
  },
  openGraph: {
    title: 'Services & Digital Solutions | SPANYX',
    description:
      'Explore SPANYX digital solutions and custom software: ERP Solutions, Business Websites, AI Agents, Scroll-Driven Animations, Brand Portfolios, Web Apps, and FinTech Platforms.',
    url: `${SITE_CONFIG.domain}/services`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'Services & Digital Solutions — SPANYX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services & Digital Solutions | SPANYX',
    description:
      'Explore SPANYX digital solutions and custom software: ERP Solutions, Business Websites, AI Agents, Scroll-Driven Animations, Brand Portfolios, Web Apps, and FinTech Platforms.',
    images: ['/span/long1.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_CONFIG.domain}/services/#webpage`,
    url: `${SITE_CONFIG.domain}/services`,
    name: 'Services & Engineering Capabilities — SPANYX',
    description:
      'Explore SPANYX software engineering capabilities: ERP Solutions, Business Websites, Autonomous AI Agents, Scroll-Driven Animations, Brand Portfolios, Web Apps, and FinTech Platforms.',
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: SERVICES_LIST.map((srv, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: srv.title,
        url: `${SITE_CONFIG.domain}${srv.href}`,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, collectionSchema]} />
      <ServicesPageContent />
    </>
  );
}
