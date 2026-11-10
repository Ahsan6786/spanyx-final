import type { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';

export const metadata: Metadata = {
  title: {
    absolute: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
  },
  description:
    'Spanyx engineers robust custom web applications, enterprise ERP platforms, AI agent workflows, and mission-critical digital systems for forward-thinking enterprises.',
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  openGraph: {
    title: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
    description:
      'Spanyx engineers robust custom web applications, enterprise ERP platforms, AI agent workflows, and mission-critical digital systems for forward-thinking enterprises.',
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
    description:
      'Spanyx engineers robust custom web applications, enterprise ERP platforms, AI agent workflows, and mission-critical digital systems.',
    images: ['/span/long1.webp'],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
