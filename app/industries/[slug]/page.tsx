import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  INDUSTRIES_DATA,
  getIndustryBySlug,
} from '@/data/industriesData';
import IndustryDetailPage from '@/components/IndustryDetailPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

  const displayName = industry.name.toLowerCase().includes('website')
    ? industry.name
    : `${industry.name} Websites`;

  return {
    title: `${displayName} — Industries We Serve | SPANYX`,
    description: industry.heroIntro,
  };
}

export default async function IndustrySlugPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const industry = slug ? getIndustryBySlug(slug) : undefined;

  if (!industry) {
    notFound();
  }

  return <IndustryDetailPage industry={industry} />;
}

