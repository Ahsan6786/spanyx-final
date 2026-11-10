import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  INDUSTRIES_DATA,
  getIndustryBySlug,
} from '@/data/industriesData';
import IndustryDetailPage from '@/components/IndustryDetailPage';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema, buildServiceSchema } from '@/lib/seo/schema';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const INDUSTRY_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    serviceType: string;
  }
> = {
  'real-estate': {
    title: 'Real Estate Software & Property Portal Development | SPANYX',
    description:
      'High-performance property portals, broker workflow systems, MLS integrations, and automated leasing software engineered for modern real estate enterprises.',
    serviceType: 'Real Estate Software Development',
    keywords: [
      'Real Estate Software Development',
      'Property Portal Engineering',
      'MLS Integration India',
      'Broker Management Systems',
      'PropTech Solutions',
    ],
  },
  'jobs-recruiters': {
    title: 'Recruitment Platform & ATS Job Board Engineering | SPANYX',
    description:
      'Intelligent applicant tracking systems (ATS), AI resume parsing, candidate pipeline workflows, and high-volume job board portals.',
    serviceType: 'Recruitment Software Development',
    keywords: [
      'Recruitment Platform Development',
      'ATS Software Engineering',
      'Job Board Portal Developers',
      'AI Resume Screening Software',
      'Staffing Agency Platforms',
    ],
  },
  'matrimonial': {
    title: 'Custom Matrimonial Platforms & Matchmaking Software Development | SPANYX',
    description:
      'Secure, verified matchmaking engines, privacy-first user profiles, high-concurrency search architectures, and real-time chat platforms.',
    serviceType: 'Matrimonial Platform Engineering',
    keywords: [
      'Matrimonial Platform Development',
      'Matchmaking Software Engineering',
      'Dating and Community Portals',
      'Private Matchmaking Engine',
      'Verified Profile Systems',
    ],
  },
  'medical-doctors': {
    title: 'Healthcare & Clinic Management Software Development | SPANYX',
    description:
      'HIPAA-ready clinical management software, automated patient scheduling, telemedicine portals, and electronic health record (EHR) integrations.',
    serviceType: 'Healthcare Software Engineering',
    keywords: [
      'Healthcare Software Development',
      'Clinic Management Software',
      'Telemedicine Portal Developers',
      'Patient Scheduling Software',
      'EHR EMR Integration Systems',
    ],
  },
  'food-beverage': {
    title: 'Restaurant Ordering & Food Supply Chain Management Systems | SPANYX',
    description:
      'Zero-commission online food ordering platforms, multi-outlet POS syncing, automated kitchen display systems, and inventory tracking software.',
    serviceType: 'Food & Beverage Software Solutions',
    keywords: [
      'Restaurant Ordering System Development',
      'Cloud Kitchen Software',
      'Food Delivery App Engineering',
      'Restaurant POS Integration',
      'Kitchen Management Systems',
    ],
  },
  'school-education': {
    title: 'EdTech Platforms & Student Information Systems (SIS) | SPANYX',
    description:
      'Next-generation virtual classrooms, student information systems, automated fee processing, examination engines, and institutional ERPs.',
    serviceType: 'EdTech & Education Software Engineering',
    keywords: [
      'EdTech Software Development',
      'School Management Systems',
      'Learning Management System LMS',
      'Student Information System SIS',
      'Online Examination Platform',
    ],
  },
  'tours-travel': {
    title: 'Travel Booking Engine & Itinerary Software Engineering | SPANYX',
    description:
      'Multi-currency travel booking engines, dynamic tour itinerary generators, GDS/hotel API integrations, and payment automation for travel operators.',
    serviceType: 'Travel Software & Booking Engine Development',
    keywords: [
      'Travel Booking Engine Development',
      'Tour Operator Software',
      'Flight Hotel API Integration',
      'Travel Agency Portals',
      'Online Travel Agency OTA Software',
    ],
  },
  'b2c': {
    title: 'High-Conversion B2C Digital Platforms & Consumer Portals | SPANYX',
    description:
      'Ultra-fast consumer-facing web platforms, loyalty ecosystems, frictionless customer checkout flows, and personalized digital experiences.',
    serviceType: 'B2C Digital Platform Development',
    keywords: [
      'B2C Portal Development',
      'Consumer Web Applications',
      'Direct to Consumer D2C Platforms',
      'High Conversion Web Systems',
      'Customer Loyalty Software',
    ],
  },
  'b2b': {
    title: 'B2B Wholesale Platforms, Portals & Vendor Management Systems | SPANYX',
    description:
      'Self-service wholesale customer portals, tiered bulk pricing engines, vendor catalogs, automated quotation workflows, and enterprise ERP integrations.',
    serviceType: 'B2B Wholesale Portal Development',
    keywords: [
      'B2B Portal Development',
      'Wholesale Ecommerce Platforms',
      'Vendor Management Systems',
      'Bulk Ordering Systems',
      'Enterprise B2B Web Software',
    ],
  },
  'e-commerce': {
    title: 'Custom E-Commerce Development & High-Volume Storefronts | SPANYX',
    description:
      'Headless ecommerce architectures, high-concurrency checkout engines, sub-second product search, and multi-channel inventory synchronization.',
    serviceType: 'Custom E-Commerce Development',
    keywords: [
      'Custom Ecommerce Development',
      'Headless Commerce Developers',
      'High Volume Online Storefronts',
      'Nextjs Ecommerce Architecture',
      'Multi Vendor Marketplace Development',
    ],
  },
  'banking-finance': {
    title: 'Banking & FinTech Digital Infrastructure Engineering | SPANYX',
    description:
      'Regulatory-compliant financial platforms, automated lending workflows, multi-currency wallets, and bank-grade transaction infrastructure.',
    serviceType: 'Banking & FinTech Software Engineering',
    keywords: [
      'Fintech Software Development',
      'Banking Web Applications',
      'Lending Platform Engineering',
      'Payment Gateway Integration',
      'Financial Dashboard Development',
    ],
  },
  'health-beauty': {
    title: 'Salon, Wellness & Beauty Booking Platform Development | SPANYX',
    description:
      'Interactive service booking calendars, automated client reminders, membership management, and product commerce engines for wellness brands.',
    serviceType: 'Beauty & Wellness Software Development',
    keywords: [
      'Salon Booking Software',
      'Spa Wellness Management System',
      'Appointment Scheduling Software',
      'Beauty Commerce Platform',
      'Client Retention Systems',
    ],
  },
  'community-web-design': {
    title: 'Community & Membership Platform Development | SPANYX',
    description:
      'Engaging community forums, private membership portals, discussion hubs, tiered subscription access, and integrated events software.',
    serviceType: 'Community & Membership Platform Engineering',
    keywords: [
      'Community Platform Development',
      'Membership Portal Software',
      'Private Forum Web Development',
      'Subscription Community Websites',
      'Member Portal Architecture',
    ],
  },
  'hotels-restaurants': {
    title: 'Hospitality Management & Hotel Booking Systems | SPANYX',
    description:
      'Direct hotel room reservation engines, channel manager integrations, guest experience mobile portals, and property management systems (PMS).',
    serviceType: 'Hospitality Software Development',
    keywords: [
      'Hotel Booking Engine Software',
      'Property Management System PMS',
      'Hospitality Web Development',
      'Direct Hotel Reservation Systems',
      'Guest Management Software',
    ],
  },
  'jewelry-fashion': {
    title: 'Luxury Fashion & Jewelry E-Commerce Storefronts | SPANYX',
    description:
      'Ultra-high-definition visual showcases, 360-degree product viewers, bespoke ring/customizer configurators, and luxury brand storefronts.',
    serviceType: 'Luxury Fashion & Jewelry E-Commerce Engineering',
    keywords: [
      'Jewelry Website Design',
      'Luxury Fashion Ecommerce',
      'Product Configurator Development',
      'High End Brand Web Development',
      '360 Product Viewers',
    ],
  },
  'news-blogs-publications': {
    title: 'Digital Publishing Platforms & High-Traffic Media CMS | SPANYX',
    description:
      'Sub-second page speeds, editorial collaboration workflows, automated paywall subscriptions, and ad-tech optimization for digital publications.',
    serviceType: 'Digital Publishing & Media Platform Development',
    keywords: [
      'News Portal Development',
      'High Traffic CMS Engineering',
      'Media Publishing Software',
      'Paywall Subscription Systems',
      'Journalism Editorial Platforms',
    ],
  },
};

export function generateStaticParams() {
  return INDUSTRIES_DATA.map((industry) => ({
    slug: industry.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const industry = slug ? getIndustryBySlug(slug) : undefined;
  if (!industry) {
    return {
      title: 'Industry Not Found — SPANYX',
    };
  }

  const seoData = slug ? INDUSTRY_SEO_MAP[slug] : undefined;
  const displayName = industry.name.toLowerCase().includes('website')
    ? industry.name
    : `${industry.name} Websites`;

  const rawTitle =
    seoData?.title || `${displayName} — Specialized Software Engineering`;
  const cleanTitle = rawTitle.replace(/\s*\|\s*SPANYX$/i, '');
  const description = seoData?.description || industry.heroIntro;
  const canonicalUrl = `${SITE_CONFIG.domain}/industries/${industry.slug}`;

  return {
    title: cleanTitle,
    description,
    keywords: seoData?.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cleanTitle} | SPANYX`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: industry.image || '/span/long1.webp',
          width: 1200,
          height: 630,
          alt: `${industry.name} — SPANYX Software Engineering`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | SPANYX`,
      description,
      images: [industry.image || '/span/long1.webp'],
    },
  };
}

export default async function IndustrySlugPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const industry = slug ? getIndustryBySlug(slug) : undefined;

  if (!industry) {
    notFound();
  }

  const seoData = slug ? INDUSTRY_SEO_MAP[slug] : undefined;
  const canonicalUrl = `${SITE_CONFIG.domain}/industries/${industry.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/industries' },
    { name: industry.name, url: canonicalUrl },
  ]);

  const serviceSchema = buildServiceSchema({
    name: `${industry.name} Software & Web Engineering`,
    description: seoData?.description || industry.heroIntro,
    url: canonicalUrl,
    serviceType: seoData?.serviceType || `${industry.name} Digital Solutions`,
    image: industry.image ? `${SITE_CONFIG.domain}${industry.image}` : undefined,
  });

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, serviceSchema]} />
      <IndustryDetailPage industry={industry} />
    </>
  );
}
