'use client';

import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StackedShowcase from '@/components/StackedShowcase';
import Footer from '@/components/Footer';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';

export default function HomePage() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  useEffect(() => {
    // Disable automatic browser scroll restoration on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const navEntry = window.performance?.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined;
    const isReload =
      navEntry?.type === 'reload' ||
      // @ts-ignore fallback for legacy browsers
      window.performance?.navigation?.type === 1;

    // On page reload/refresh, always scroll straight to top Hero section
    if (isReload) {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  return (
    <>
      <div className="page-wrapper apple-page-root">
        <Header onOpenContact={handleOpenContact} />
        <HeroSection onOpenContact={handleOpenContact} />
      </div>
      <StackedShowcase onOpenContact={handleOpenContact} />
      <Footer onOpenContact={handleOpenContact} />
      <ContactOverlay ref={contactOverlayRef} />
    </>
  );
}
