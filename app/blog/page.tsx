import type { Metadata } from 'next';
import BlogPageContent from '@/components/BlogPageContent';

export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Publications — SPANYX',
  description:
    'Deep architectural explorations, system design blueprints, and technical case studies from the Spanyx engineering squad.',
  openGraph: {
    title: 'SPANYX Engineering Publications',
    description:
      'Deep architectural explorations, system design blueprints, and technical case studies from the Spanyx engineering squad.',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogPageContent />;
}

