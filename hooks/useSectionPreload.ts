'use client';

import { useEffect, useRef } from 'react';
import { assetPreloader } from '@/lib/performance/assetPreloader';

interface SectionPreloadOptions {
  /** Target section element ID or null if ref is used */
  targetId?: string;
  /** Distance in pixels before the section enters viewport to trigger high priority preload */
  rootMargin?: string;
  /** Whether to queue assets as idle immediately on mount if network allows */
  idlePreload?: boolean;
}

/**
 * Hook to intelligently preload assets before a section enters the viewport
 */
export function useSectionPreload(
  assets: string[],
  options: SectionPreloadOptions = {}
) {
  const {
    targetId,
    rootMargin = '600px 0px 400px 0px',
    idlePreload = true,
  } = options;

  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!assets || assets.length === 0) return;

    // Optional background idle preload
    if (idlePreload) {
      assetPreloader.preload(assets, 'idle');
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      assetPreloader.preload(assets, 'normal');
      return;
    }

    const element = targetId
      ? document.getElementById(targetId)
      : targetRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is within rootMargin (approaching viewport) -> boost to high priority
            assetPreloader.preload(assets, 'high');
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [assets, targetId, rootMargin, idlePreload]);

  return targetRef;
}
