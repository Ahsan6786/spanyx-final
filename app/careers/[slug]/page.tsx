import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCareerPostings, getCareerPostingBySlug } from '@/lib/db/queries';
import CareerDetailPage from '@/components/CareerDetailPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  const postings = getCareerPostings();
  return postings.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posting = getCareerPostingBySlug(slug);
  if (!posting) {
    return {
      title: 'Opportunity Not Found — SPANYX Careers',
    };
  }

  return {
    title: `${posting.title} — Careers & Opportunities | SPANYX`,
    description: posting.description,
  };
}

export default async function CareerSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const posting = getCareerPostingBySlug(slug);

  if (!posting) {
    notFound();
  }

  // Ensure plain JSON object for RSC-to-Client boundary
  const plainPosting = JSON.parse(JSON.stringify(posting));

  return <CareerDetailPage posting={plainPosting} />;
}
