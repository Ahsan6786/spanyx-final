import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/db/queries';
import BlogDetailContent from '@/components/BlogDetailContent';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog || blog.status !== 'published') {
    return {
      title: 'Article Not Found — SPANYX',
    };
  }

  return {
    title: `${blog.title} — SPANYX Engineering`,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      type: 'article',
      images: blog.featured_image ? [blog.featured_image] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog || blog.status !== 'published') {
    notFound();
  }

  return <BlogDetailContent blog={blog} />;
}

