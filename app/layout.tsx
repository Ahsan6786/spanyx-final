import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieManager from '@/components/cookies/CookieManager';
import VisitorTracker from '@/components/analytics/VisitorTracker';
import DynamicThemeColor from '@/components/DynamicThemeColor';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
    template: '%s | SPANYX',
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.domain }],
  generator: 'Next.js',
  keywords: [
    'Custom Software Development',
    'Enterprise ERP Solutions',
    'Custom Web Applications',
    'AI Agents & LLM Workflows',
    'High-Performance Websites',
    'FinTech Platform Development',
    'Digital Transformation Agency India',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: '/span/long1.webp',
        width: 1200,
        height: 630,
        alt: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPANYX — Custom Software Development & Enterprise Digital Engineering',
    description: SITE_CONFIG.description,
    images: ['/span/long1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/span/small-logo.png',
    apple: '/span/small-logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap"
          rel="stylesheet"
        />
        {/* Preload strictly the actual Largest Contentful Paint (LCP) hero image */}
        <link
          rel="preload"
          as="image"
          href="/span/long1.webp"
          type="image/webp"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/span/short-clean.webp"
          type="image/webp"
          media="(max-width: 767px)"
        />
        <JsonLd schema={[buildOrganizationSchema(), buildWebSiteSchema()]} />
      </head>
      <body>
        <DynamicThemeColor />
        {children}
        <CookieManager />
        <VisitorTracker />
      </body>
    </html>
  );
}

