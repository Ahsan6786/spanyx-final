import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  SHOWCASE_CATEGORIES,
  getCategoryBySlug,
} from '@/data/whatWeCreateData';
import ServiceDetailPage from '@/components/ServiceDetailPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

  return {
    title: `${category.title} — We Create | SPANYX`,
    description: category.heroIntro,
  };
}

export default async function WhatWeCreateCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <ServiceDetailPage category={category} />;
}

