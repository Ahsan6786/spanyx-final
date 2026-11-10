'use client';

import React, { useEffect } from 'react';
import { assetPreloader } from '@/lib/performance/assetPreloader';

// Landing Page Section Assets in exact DOM order
const STACKED_SHOWCASE_ASSETS = [
  '/cards.webp',
  '/WEBAPPS.webp',
  '/trading.webp',
  '/ai-mockk.webp',
  '/erp.webp',
  '/brand.webp',
  '/websites.webp',
];

const ABOUT_PREVIEW_ASSETS = [
  '/carddd.webp',
  '/partners/trademax.webp',
  '/partners/ltc.webp',
  '/partners/rural-immersion.webp',
  '/partners/revial.webp',
  '/partners/partner-logo-1.webp',
  '/partners/logoo.webp',
];

const INDUSTRIES_PREVIEW_ASSETS = [
  '/industries/real-estate.svg',
  '/industries/banking-finance.svg',
  '/industries/e-commerce.svg',
  '/industries/jobs-recruiters.svg',
  '/industries/health-beauty.svg',
  '/industries/b2c.svg',
  '/industries/community-web-design.svg',
  '/industries/b2b.svg',
  '/industries/matrimonial.svg',
  '/industries/school-education.svg',
  '/industries/hotels-restaurants.svg',
  '/industries/food-beverage.svg',
  '/industries/medical-doctors.svg',
  '/industries/news-blogs-publications.svg',
  '/industries/jewelry-fashion.svg',
  '/industries/tours-travel.svg',
];

/**
 * Intelligent Background Asset Preloader for Landing Page
 *
 * Stage 1 (Initial): Hero rendered immediately.
 * Stage 2 (Idle background): Preload next section (Stacked Showcase cards).
 * Stage 3 (Scroll-aware): Uses IntersectionObserver with 600px rootMargin to prime upcoming sections before arrival.
 */
export default function BackgroundPreloadOrchestrator() {
  useEffect(() => {
    // 1. Stage 2: When the browser finishes initial paint and becomes idle, start preloading the very next section
    const initialIdleTimer = setTimeout(() => {
      assetPreloader.preload(STACKED_SHOWCASE_ASSETS, 'normal');
    }, 600);

    // 2. Stage 3: Setup IntersectionObservers for upcoming sections with 600px lookahead
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const fallbackTimer = setTimeout(() => {
        assetPreloader.preload(ABOUT_PREVIEW_ASSETS, 'idle');
        assetPreloader.preload(INDUSTRIES_PREVIEW_ASSETS, 'idle');
      }, 2000);
      return () => {
        clearTimeout(initialIdleTimer);
        clearTimeout(fallbackTimer);
      };
    }

    const observers: IntersectionObserver[] = [];

    // Observe About Preview section
    const aboutEl = document.getElementById('about-preview');
    if (aboutEl) {
      const obsAbout = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            assetPreloader.preload(ABOUT_PREVIEW_ASSETS, 'high');
            obsAbout.disconnect();
          }
        },
        { rootMargin: '600px 0px 400px 0px' }
      );
      obsAbout.observe(aboutEl);
      observers.push(obsAbout);
    }

    // Observe Industries Preview section
    const industriesEl = document.getElementById('industries-preview');
    if (industriesEl) {
      const obsInd = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            assetPreloader.preload(INDUSTRIES_PREVIEW_ASSETS, 'high');
            obsInd.disconnect();
          }
        },
        { rootMargin: '600px 0px 400px 0px' }
      );
      obsInd.observe(industriesEl);
      observers.push(obsInd);
    }

    // 3. Staggered background preloads for deeper sections if the user is lingering on the page
    const deepIdleTimer = setTimeout(() => {
      assetPreloader.preload(ABOUT_PREVIEW_ASSETS, 'idle');
      assetPreloader.preload(INDUSTRIES_PREVIEW_ASSETS, 'idle');
    }, 2800);

    return () => {
      clearTimeout(initialIdleTimer);
      clearTimeout(deepIdleTimer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return null;
}
