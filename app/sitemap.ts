import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { SHOWCASE_CATEGORIES } from '@/data/whatWeCreateData';
import { INDUSTRIES_DATA } from '@/data/industriesData';
import { getCareerPostings, getPublishedBlogs } from '@/lib/db/queries';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  // 1. Static Core Public Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Service Pages (What We Create)
  const serviceRoutes: MetadataRoute.Sitemap = SHOWCASE_CATEGORIES.map(
    (category) => ({
      url: `${baseUrl}/what-we-create/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  // 3. Dynamic Industry Pages
  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES_DATA.map(
    (industry) => ({
      url: `${baseUrl}/industries/${industry.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  // 4. Dynamic Career Opportunities
  let careerRoutes: MetadataRoute.Sitemap = [];
  try {
    const postings = getCareerPostings({ status: 'published' });
    careerRoutes = postings.map((posting) => ({
      url: `${baseUrl}/careers/${posting.slug}`,
      lastModified: posting.updated_at
        ? new Date(posting.updated_at)
        : posting.created_at
        ? new Date(posting.created_at)
        : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching career postings for sitemap:', err);
  }

  // 5. Dynamic Published Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { blogs } = getPublishedBlogs({ limit: 100 });
    blogRoutes = blogs.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : article.published_at
        ? new Date(article.published_at)
        : article.created_at
        ? new Date(article.created_at)
        : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching blog articles for sitemap:', err);
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...careerRoutes,
    ...blogRoutes,
  ];
}

