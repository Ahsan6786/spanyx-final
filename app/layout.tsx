import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieManager from '@/components/cookies/CookieManager';
import VisitorTracker from '@/components/analytics/VisitorTracker';
import DynamicThemeColor from '@/components/DynamicThemeColor';

export const metadata: Metadata = {
  title: 'SPANYX — We Build Technology That Moves You Forward',
  description:
    'We build innovative and scalable software solutions that turn your ideas into real impact.',
  icons: {
    icon: '/span/small-logo.png',
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

