'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicThemeColor() {
  const pathname = usePathname();

  useEffect(() => {
    const updateTheme = () => {
      // Determine page-specific theme color & status bar appearance
      let color = '#ffffff';
      let statusBarStyle: 'default' | 'black-translucent' = 'default';

      if (pathname.startsWith('/admin')) {
        const isDark =
          typeof document !== 'undefined' &&
          (document.documentElement.classList.contains('dark') ||
            document.body.classList.contains('dark') ||
            pathname.includes('/login'));

        if (pathname.startsWith('/admin/login') || isDark) {
          color = '#090a0f';
          statusBarStyle = 'black-translucent';
        } else {
          color = '#ffffff';
          statusBarStyle = 'default';
        }
      } else {
        // Public pages (landing, about, careers, blog, industries, legal)
        color = '#ffffff';
        statusBarStyle = 'default';
      }

      // 1. Update or create <meta name="theme-color">
      let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMeta);
      }
      themeMeta.content = color;

      // 2. Update or create <meta name="apple-mobile-web-app-status-bar-style">
      let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement | null;
      if (!appleMeta) {
        appleMeta = document.createElement('meta');
        appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(appleMeta);
      }
      appleMeta.content = statusBarStyle;

      // 3. Keep documentElement and body background seamless to prevent white/dark safe area notches
      document.documentElement.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
    };

    updateTheme();

    // Listen to attribute mutations (e.g., admin toggling dark/light theme)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class' || m.attributeName === 'data-theme') {
          updateTheme();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

