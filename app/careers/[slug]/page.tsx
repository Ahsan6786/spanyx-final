import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CAREERS_DATA, getHardcodedCareerPostingBySlug } from '@/data/careersData';
import CareerDetailPage from '@/components/CareerDetailPage';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema, buildJobPostingSchema } from '@/lib/seo/schema';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return CAREERS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posting = getHardcodedCareerPostingBySlug(slug);
  if (!posting) {
    return {
      title: 'Opportunity Not Found — SPANYX Careers',
    };
  }

  const title = `${posting.title} — Careers & Opportunities`;
  const description =
    posting.description?.length > 155
      ? `${posting.description.substring(0, 152)}...`
      : posting.description;
  const canonicalUrl = `${SITE_CONFIG.domain}/careers/${posting.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | SPANYX`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: '/span/long1.webp',
          width: 1200,
          height: 630,
          alt: `${posting.title} — SPANYX Careers`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SPANYX`,
      description,
      images: ['/span/long1.webp'],
    },
  };
}

export default async function CareerSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const posting = getHardcodedCareerPostingBySlug(slug);

  if (!posting) {
    notFound();
  }

  const canonicalUrl = `${SITE_CONFIG.domain}/careers/${posting.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Careers', url: '/careers' },
    { name: posting.title, url: canonicalUrl },
  ]);

  const fullHtmlDescription = [
    posting.description ? `<p>${posting.description}</p>` : '',
    posting.responsibilities
      ? `<p><strong>Key Responsibilities:</strong><br/>${posting.responsibilities.replace(/\n/g, '<br/>')}</p>`
      : '',
    posting.required_skills
      ? `<p><strong>Required Skills:</strong><br/>${posting.required_skills}</p>`
      : '',
    posting.eligibility
      ? `<p><strong>Eligibility:</strong><br/>${posting.eligibility}</p>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const jobPostingSchema = buildJobPostingSchema({
    title: posting.title,
    description: fullHtmlDescription || posting.description || posting.title,
    slug: posting.slug,
    type: posting.posting_type,
    workplaceType: posting.work_mode,
    stipend: posting.stipend || undefined,
    location: posting.location,
    postedDate: posting.created_at,
  });

  // Ensure plain JSON object for RSC-to-Client boundary
  const plainPosting = JSON.parse(JSON.stringify(posting));

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, jobPostingSchema]} />
      <CareerDetailPage posting={plainPosting} />
    </>
  );
}
