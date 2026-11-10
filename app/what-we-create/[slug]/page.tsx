import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  SHOWCASE_CATEGORIES,
  getCategoryBySlug,
} from '@/data/whatWeCreateData';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema, buildServiceSchema } from '@/lib/seo/schema';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SERVICE_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    serviceType: string;
    keywords: string[];
  }
> = {
  'erp-solutions': {
    title: 'Custom ERP Software Development & Enterprise Management Systems | SPANYX',
    description:
      'Scalable enterprise resource planning (ERP) systems tailored to automate workflows, manage supply chains, unify data, and eliminate operational bottlenecks.',
    serviceType: 'Enterprise Resource Planning Software Development',
    keywords: [
      'Custom ERP Software Development',
      'Enterprise Resource Planning India',
      'Cloud ERP Solutions',
      'Workflow Automation Systems',
      'Custom CRM and ERP Architecture',
    ],
  },
  'business-websites': {
    title: 'Corporate Business Website Design & High-Performance Web Development | SPANYX',
    description:
      'High-conversion corporate websites engineered for lightning-fast speeds, responsive elegance, modern typography, and robust enterprise security.',
    serviceType: 'Corporate Web Design & Development',
    keywords: [
      'Corporate Website Design',
      'Enterprise Web Development',
      'B2B Website Engineering',
      'High Performance Websites',
      'Modern Business Websites',
    ],
  },
  'ai-agents': {
    title: 'Autonomous AI Agents & Enterprise LLM Workflow Automation | SPANYX',
    description:
      'Intelligent autonomous agents, generative AI integrations, and private LLM workflows engineered to execute multi-step operations and elevate productivity.',
    serviceType: 'Artificial Intelligence & Autonomous Agent Engineering',
    keywords: [
      'Autonomous AI Agents',
      'Enterprise LLM Development',
      'Generative AI Integration',
      'Custom AI Solutions India',
      'AI Workflow Automation',
    ],
  },
  'scroll-driven-animations': {
    title: 'Interactive Web Experiences & Scroll-Driven Animation Engineering | SPANYX',
    description:
      'Cutting-edge web experiences, GPU-accelerated GSAP animations, interactive 3D elements, and smooth scroll transitions that captivate users.',
    serviceType: 'Interactive & Motion Frontend Engineering',
    keywords: [
      'Interactive Web Design',
      'GSAP Web Development',
      'Scroll Driven Animations',
      'Creative Frontend Engineering',
      'WebGL and Three.js Experiences',
    ],
  },
  'brand-portfolio-websites': {
    title: 'Brand & Portfolio Website Development for Modern Businesses | SPANYX',
    description:
      'Signature portfolio websites, bespoke brand storytelling platforms, and digital showcases engineered to establish authority and command attention.',
    serviceType: 'Brand & Portfolio Website Development',
    keywords: [
      'Portfolio Website Development',
      'Brand Identity Websites',
      'Creative Showcase Development',
      'Luxury Web Design',
      'High End Brand Portals',
    ],
  },
  'web-applications': {
    title: 'Custom Web Application Development & Scalable SaaS Engineering | SPANYX',
    description:
      'End-to-end custom web applications, SaaS platforms, client portals, and cloud backends architected for resilience, high concurrency, and speed.',
    serviceType: 'Custom Web Application Development',
    keywords: [
      'Custom Web Application Development',
      'SaaS Platform Engineering',
      'Full-Stack Web Development',
      'Cloud Software Architecture',
      'Enterprise Web Portals',
    ],
  },
  'trading-fintech-platforms': {
    title: 'FinTech & Trading Platform Engineering — High-Frequency Architecture | SPANYX',
    description:
      'Ultra-low latency financial interfaces, algorithmic trading dashboards, secure payment rails, and regulatory-grade fintech architectures.',
    serviceType: 'FinTech & Trading Platform Engineering',
    keywords: [
      'FinTech Software Development',
      'Trading Platform Architecture',
      'Financial Technology Solutions',
      'Secure Banking Web Apps',
      'Low Latency Financial Dashboards',
    ],
  },
};

export function generateStaticParams() {
  return SHOWCASE_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return {
      title: 'Service Not Found — SPANYX',
    };
  }

  const seoData = SERVICE_SEO_MAP[slug];
  const rawTitle = seoData?.title || `${category.title} — Custom Software Engineering`;
  const cleanTitle = rawTitle.replace(/\s*\|\s*SPANYX$/i, '');
  const description = seoData?.description || category.heroIntro;
  const canonicalUrl = `${SITE_CONFIG.domain}/what-we-create/${slug}`;

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
          url: category.image || '/span/long1.webp',
          width: 1200,
          height: 630,
          alt: `${category.title} — SPANYX Software Engineering`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | SPANYX`,
      description,
      images: [category.image || '/span/long1.webp'],
    },
  };
}

export default async function WhatWeCreateCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const seoData = SERVICE_SEO_MAP[slug];
  const canonicalUrl = `${SITE_CONFIG.domain}/what-we-create/${slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#what-we-create' },
    { name: category.title, url: canonicalUrl },
  ]);

  const serviceSchema = buildServiceSchema({
    name: category.title,
    description: seoData?.description || category.heroIntro,
    url: canonicalUrl,
    serviceType: seoData?.serviceType || category.title,
    image: category.image ? `${SITE_CONFIG.domain}${category.image}` : undefined,
  });

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, serviceSchema]} />
      <ServiceDetailPage category={category} />
    </>
  );
}
