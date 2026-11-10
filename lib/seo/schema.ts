import { SITE_CONFIG } from './siteConfig';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.domain,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logoUrl,
      caption: 'SPANYX Logo',
    },
    image: SITE_CONFIG.defaultOgImage,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: SITE_CONFIG.email,
        contactType: 'customer support',
        availableLanguage: ['en', 'hi'],
      },
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    url: SITE_CONFIG.domain,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    inLanguage: 'en-IN',
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.domain}${item.url}`,
    })),
  };
}

export function buildServiceSchema({
  name,
  description,
  url,
  serviceType,
  image,
}: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  image?: string;
}) {
  const fullUrl = url.startsWith('http') ? url : `${SITE_CONFIG.domain}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${fullUrl}/#service`,
    name,
    description,
    url: fullUrl,
    serviceType: serviceType || name,
    provider: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    ...(image ? { image } : {}),
  };
}

function parseSalaryRange(stipendStr?: string | null): {
  minValue?: number;
  maxValue?: number;
  value?: number;
  unitText: 'MONTH' | 'YEAR';
} | null {
  if (!stipendStr || typeof stipendStr !== 'string') return null;
  const s = stipendStr.trim();

  // If text contains non-numeric phrases like "Competitive Executive Compensation", return null
  if (!/\d/.test(s)) return null;

  // Detect unitText
  const isAnnual = /CTC|year|annum|per annum/i.test(s) || /L|Lakh/i.test(s);
  const unitText: 'MONTH' | 'YEAR' = isAnnual ? 'YEAR' : 'MONTH';

  // Handle Lakh notation: e.g. "₹4.5L - ₹7.0L CTC" or "4.5L"
  if (/L|Lakh/i.test(s)) {
    const lakhMatches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*L/gi)].map((m) =>
      Math.round(parseFloat(m[1]) * 100000)
    );
    if (lakhMatches.length >= 2) {
      return {
        minValue: Math.min(...lakhMatches),
        maxValue: Math.max(...lakhMatches),
        unitText: 'YEAR',
      };
    }
    if (lakhMatches.length === 1) {
      return { value: lakhMatches[0], unitText: 'YEAR' };
    }
  }

  // Handle standard number ranges: e.g. "₹15,000 - ₹22,000 / month"
  const numbers = [...s.matchAll(/\b\d{1,3}(?:,\d{3})+\b|\b\d{4,7}\b/g)].map((m) =>
    parseInt(m[0].replace(/,/g, ''), 10)
  );

  if (numbers.length >= 2) {
    return {
      minValue: Math.min(numbers[0], numbers[1]),
      maxValue: Math.max(numbers[0], numbers[1]),
      unitText,
    };
  }
  if (numbers.length === 1) {
    return { value: numbers[0], unitText };
  }

  return null;
}

export function buildJobPostingSchema({
  title,
  description,
  slug,
  type,
  workplaceType,
  stipend,
  location,
  postedDate,
}: {
  title: string;
  description: string;
  slug: string;
  type?: string;
  workplaceType?: string;
  stipend?: string;
  location?: string;
  postedDate?: string;
}) {
  const isIntern =
    type?.toLowerCase().includes('intern') || title.toLowerCase().includes('intern');
  const isRemote =
    workplaceType?.toLowerCase().includes('remote') ||
    location?.toLowerCase().includes('remote') ||
    true;

  const parsedSalary = parseSalaryRange(stipend);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'SPANYX',
      value: slug,
    },
    datePosted: postedDate || new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    employmentType: isIntern ? 'INTERN' : 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'SPANYX',
      sameAs: SITE_CONFIG.domain,
      logo: SITE_CONFIG.logoUrl,
    },
    ...(isRemote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'India',
          },
        }
      : {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
              addressLocality: location || 'Bangalore',
            },
          },
        }),
    ...(parsedSalary
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: {
              '@type': 'QuantitativeValue',
              ...(parsedSalary.value ? { value: parsedSalary.value } : {}),
              ...(parsedSalary.minValue ? { minValue: parsedSalary.minValue } : {}),
              ...(parsedSalary.maxValue ? { maxValue: parsedSalary.maxValue } : {}),
              unitText: parsedSalary.unitText,
            },
          },
        }
      : {}),
  };
}

export function buildArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  featuredImage,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  featuredImage?: string;
}) {
  const fullUrl = `${SITE_CONFIG.domain}/blog/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${fullUrl}/#article`,
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    headline: title,
    description,
    url: fullUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    datePublished: publishedAt || new Date().toISOString(),
    dateModified: updatedAt || publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: author || 'SPANYX Engineering Team',
    },
    publisher: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    inLanguage: 'en-IN',
    ...(featuredImage
      ? {
          image: {
            '@type': 'ImageObject',
            url: featuredImage.startsWith('http')
              ? featuredImage
              : `${SITE_CONFIG.domain}${featuredImage}`,
          },
        }
      : {
          image: SITE_CONFIG.defaultOgImage,
        }),
  };
}

