import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/queries';
import BlogDetailContent from '@/components/BlogDetailContent';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo/schema';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const { blogs } = getPublishedBlogs({ limit: 100 });
  return blogs.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog || blog.status !== 'published') {
    return {
      title: 'Article Not Found — SPANYX',
    };
  }

  const title = `${blog.title} — Technical Case Study`;
  const description = blog.excerpt || blog.title;
  const canonicalUrl = `${SITE_CONFIG.domain}/blog/${blog.slug}`;
  const imageUrl = blog.featured_image
    ? blog.featured_image.startsWith('http')
      ? blog.featured_image
      : `${SITE_CONFIG.domain}${blog.featured_image}`
    : `${SITE_CONFIG.domain}/span/long1.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${blog.title} | SPANYX`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at || blog.created_at,
      authors: [blog.author_name || 'SPANYX Engineering'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog || blog.status !== 'published') {
    notFound();
  }

  const canonicalUrl = `${SITE_CONFIG.domain}/blog/${blog.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Engineering Blog', url: '/blog' },
    { name: blog.title, url: canonicalUrl },
  ]);

  const articleSchema = buildArticleSchema({
    title: blog.title,
    description: blog.excerpt || blog.title,
    slug: blog.slug,
    publishedAt: blog.created_at,
    updatedAt: blog.updated_at,
    author: blog.author_name,
    featuredImage: blog.featured_image || undefined,
  });

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, articleSchema]} />
      <BlogDetailContent blog={blog} />
    </>
  );
}
