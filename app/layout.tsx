import type { Metadata } from 'next';
import './globals.css';
import CookieManager from '@/components/cookies/CookieManager';
import VisitorTracker from '@/components/analytics/VisitorTracker';

export const metadata: Metadata = {
  title: 'SPANYX — We Build Technology That Moves You Forward',
  description:
    'We build innovative and scalable software solutions that turn your ideas into real impact.',
  icons: {
    icon: '/span/small-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
        {children}
        <CookieManager />
        <VisitorTracker />
      </body>
    </html>
  );
}

