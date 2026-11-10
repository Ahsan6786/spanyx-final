'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getOrCreateVisitorId } from '@/components/cookies/CookieManager';

const SESSION_KEY = 'spx_sid';
const SESSION_TIMESTAMP_KEY = 'spx_sid_ts';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const now = Date.now();
  const lastActive = parseInt(localStorage.getItem(SESSION_TIMESTAMP_KEY) || '0', 10);
  let sid = localStorage.getItem(SESSION_KEY);

  if (!sid || now - lastActive > SESSION_TIMEOUT_MS) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
  }

  localStorage.setItem(SESSION_TIMESTAMP_KEY, String(now));
  return sid;
}

function detectDeviceInfo() {
  if (typeof window === 'undefined') return {};
  const ua = navigator.userAgent;

  let deviceCategory = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceCategory = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceCategory = 'Mobile';
  }

  let browser = 'Other';
  let browserVersion = '';
  if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua)) {
    browser = 'Chrome';
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = 'Safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/edg/i.test(ua)) {
    browser = 'Edge';
  }

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';

  return {
    deviceCategory,
    browser,
    browserVersion,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'en',
    country: 'India', // Default context
  };
}

function extractUtmParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const utm_term = params.get('utm_term');
  const utm_content = params.get('utm_content');

  if (utm_source || utm_medium || utm_campaign) {
    return { utm_source, utm_medium, utm_campaign, utm_term, utm_content };
  }
  return null;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const scrollMilestonesHitRef = useRef<Set<number>>(new Set());

  // Never execute telemetry or scroll listeners inside the administrative portal
  const isAdmin = pathname.startsWith('/admin');

  // Check if visitor has consented to analytics
  const hasAnalyticsConsent = () => {
    if (typeof window === 'undefined' || isAdmin) return false;
    return !!window.SpanyxConsent?.hasConsent('analytics');
  };

  const sendPayload = (data: any) => {
    if (!hasAnalyticsConsent()) return;
    const body = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/collect', body);
    } else {
      fetch('/api/analytics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  };

  // 1. Pageview tracking on route changes
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    pageStartTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    scrollMilestonesHitRef.current.clear();

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const deviceInfo = detectDeviceInfo();
    const utmParams = extractUtmParams();

    sendPayload({
      type: 'pageview',
      visitor_id: visitorId,
      session_id: sessionId,
      page_url: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || '',
      device_info: deviceInfo,
      utm_params: utmParams,
    });

    // Heartbeat every 15s to update active dwell time
    const heartbeatTimer = setInterval(() => {
      if (!hasAnalyticsConsent()) return;
      const dwellSeconds = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      sendPayload({
        type: 'heartbeat',
        visitor_id: visitorId,
        session_id: sessionId,
        page_url: window.location.pathname,
        metrics: {
          timeSpent: dwellSeconds,
          scrollDepth: maxScrollDepthRef.current,
        },
      });
    }, 15000);

    return () => {
      clearInterval(heartbeatTimer);
      // Send final exit dwell time on page unload / navigation
      if (hasAnalyticsConsent()) {
        const finalDwellSeconds = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
        sendPayload({
          type: 'heartbeat',
          visitor_id: visitorId,
          session_id: sessionId,
          page_url: window.location.pathname,
          metrics: {
            timeSpent: finalDwellSeconds,
            scrollDepth: maxScrollDepthRef.current,
          },
        });
      }
    };
  }, [pathname]);

  // 2. Scroll Depth tracking (25%, 50%, 75%, 100%) - 120fps non-blocking RAF
  useEffect(() => {
    if (isAdmin) return;

    let ticking = false;
    let cachedDocHeight = 0;

    const measureDocHeight = () => {
      cachedDocHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    measureDocHeight();
    window.addEventListener('resize', measureDocHeight, { passive: true });

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;
        if (!hasAnalyticsConsent()) return;
        if (cachedDocHeight <= 1) measureDocHeight();

        const scrollTop = window.scrollY || window.pageYOffset || 0;
        const scrollPct = Math.min(100, Math.round((scrollTop / cachedDocHeight) * 100));
        if (scrollPct > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = scrollPct;
        }

        const milestones = [25, 50, 75, 100];
        for (const m of milestones) {
          if (scrollPct >= m && !scrollMilestonesHitRef.current.has(m)) {
            scrollMilestonesHitRef.current.add(m);
            const visitorId = getOrCreateVisitorId();
            const sessionId = getOrCreateSessionId();

            sendPayload({
              type: 'event',
              visitor_id: visitorId,
              session_id: sessionId,
              page_url: window.location.pathname,
              event_data: {
                name: `scroll_${m}`,
                category: 'engagement',
                elementText: `${m}% Scroll Depth`,
                metadata: { milestone: m },
              },
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measureDocHeight);
    };
  }, [isAdmin]);

  // 3. CTA and User Interaction Click Tracking
  useEffect(() => {
    if (isAdmin) return;
    const handleClick = (e: MouseEvent) => {
      if (!hasAnalyticsConsent()) return;

      const target = (e.target as HTMLElement)?.closest(
        'button, a, .industry-card, .btn-contact-nav, .sdp-btn-primary, .growth-solutions-cta-btn'
      ) as HTMLElement | null;

      if (!target) return;

      const text = target.innerText?.trim() || target.getAttribute('title') || target.getAttribute('aria-label') || '';
      const href = target.getAttribute('href') || '';
      const id = target.id || target.className || '';

      const isCta =
        target.classList.contains('btn-contact-nav') ||
        target.classList.contains('sdp-btn-primary') ||
        target.classList.contains('growth-solutions-cta-btn') ||
        target.classList.contains('contact-submit') ||
        href.includes('#contact') ||
        text.toLowerCase().includes('contact') ||
        text.toLowerCase().includes('get started') ||
        text.toLowerCase().includes('conversation') ||
        target.classList.contains('industry-card');

      if (isCta) {
        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();

        sendPayload({
          type: 'event',
          visitor_id: visitorId,
          session_id: sessionId,
          page_url: window.location.pathname,
          event_data: {
            name: 'cta_click',
            category: 'conversion_intent',
            elementId: id,
            elementText: text.substring(0, 60),
            metadata: { href },
          },
        });
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  // 4. Listen for consent updates (starts tracking immediately upon consent grant)
  useEffect(() => {
    if (isAdmin) return;
    const handleConsentUpdated = (e: any) => {
      if (e.detail?.preferences?.analytics) {
        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();
        const deviceInfo = detectDeviceInfo();
        const utmParams = extractUtmParams();

        sendPayload({
          type: 'pageview',
          visitor_id: visitorId,
          session_id: sessionId,
          page_url: window.location.pathname,
          page_title: document.title,
          referrer: document.referrer || '',
          device_info: deviceInfo,
          utm_params: utmParams,
        });
      }
    };

    window.addEventListener('spx-consent-updated', handleConsentUpdated);
    return () => window.removeEventListener('spx-consent-updated', handleConsentUpdated);
  }, []);

  return null;
}

