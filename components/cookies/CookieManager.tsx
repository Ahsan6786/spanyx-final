'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import CookieConsentBanner from './CookieConsentBanner';
import CookiePreferencesModal, { CookiePreferences } from './CookiePreferencesModal';

const STORAGE_KEY = 'spx_consent_preferences';
const VISITOR_ID_KEY = 'spx_vid';

declare global {
  interface Window {
    SpanyxConsent?: {
      openPreferences: () => void;
      getPreferences: () => CookiePreferences | null;
      hasConsent: (category: keyof CookiePreferences) => boolean;
      getVisitorId: () => string;
    };
  }
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

export default function CookieManager() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const [hasLoaded, setHasLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const saveConsent = useCallback(
    async (
      newPreferences: CookiePreferences,
      status: 'accepted_all' | 'rejected_optional' | 'custom' | 'withdrawn'
    ) => {
      setPreferences(newPreferences);
      setShowBanner(false);
      setShowModal(false);

      if (typeof window !== 'undefined') {
        const payload = {
          preferences: newPreferences,
          status,
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        const visitorId = getOrCreateVisitorId();

        // Dispatch DOM event immediately for real-time reactivity
        window.dispatchEvent(
          new CustomEvent('spx-consent-updated', {
            detail: { preferences: newPreferences, status, visitorId },
          })
        );

        // Transmit to backend consent audit log
        try {
          await fetch('/api/consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitor_id: visitorId,
              necessary: 1,
              functional: newPreferences.functional ? 1 : 0,
              analytics: newPreferences.analytics ? 1 : 0,
              marketing: newPreferences.marketing ? 1 : 0,
              consent_status: status,
              consent_version: '1.0.0',
              policy_version: '2026.1',
            }),
          });
        } catch (err) {
          console.error('Failed to sync consent with backend:', err);
        }
      }
    },
    []
  );

  const handleAcceptAll = useCallback(() => {
    saveConsent(
      { necessary: true, functional: true, analytics: true, marketing: true },
      'accepted_all'
    );
  }, [saveConsent]);

  const handleRejectOptional = useCallback(() => {
    saveConsent(
      { necessary: true, functional: false, analytics: false, marketing: false },
      'rejected_optional'
    );
  }, [saveConsent]);

  const preferencesRef = React.useRef<CookiePreferences>(preferences);
  preferencesRef.current = preferences;

  // 1. Initial mount: read once from localStorage without looping
  useEffect(() => {
    setHasLoaded(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // First time visitor: show banner
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.preferences) {
          setPreferences(parsed.preferences);
        } else {
          setShowBanner(true);
        }
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  // 2. Global window object binding for footer link & runtime checks
  useEffect(() => {
    window.SpanyxConsent = {
      openPreferences: () => setShowModal(true),
      getPreferences: () => preferencesRef.current,
      hasConsent: (category: keyof CookiePreferences) => {
        if (category === 'necessary') return true;
        const currentStored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (!currentStored) return false;
        try {
          const parsed = JSON.parse(currentStored);
          return !!parsed.preferences?.[category];
        } catch {
          return false;
        }
      },
      getVisitorId: getOrCreateVisitorId,
    };
  }, []);

  if (!hasLoaded) return null;

  return (
    <>
      {showBanner && !showModal && (
        <CookieConsentBanner
          onAcceptAll={handleAcceptAll}
          onRejectOptional={handleRejectOptional}
          onOpenPreferences={() => setShowModal(true)}
        />
      )}

      {showModal && (
        <CookiePreferencesModal
          initialPreferences={preferences}
          onSave={saveConsent}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

