'use client';

import React, { useState } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookiePreferencesModalProps {
  initialPreferences: CookiePreferences;
  onSave: (preferences: CookiePreferences, status: 'custom' | 'accepted_all' | 'rejected_optional') => void;
  onClose: () => void;
}

export default function CookiePreferencesModal({
  initialPreferences,
  onSave,
  onClose,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);

  const toggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, functional: true, analytics: true, marketing: true };
    setPreferences(all);
    onSave(all, 'accepted_all');
  };

  const handleRejectOptional = () => {
    const optionalRejected = { necessary: true, functional: false, analytics: false, marketing: false };
    setPreferences(optionalRejected);
    onSave(optionalRejected, 'rejected_optional');
  };

  const handleSavePreferences = () => {
    onSave(preferences, 'custom');
  };

  return (
    <div className="spx-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="spx-modal-title">
      <div className="spx-modal-container">
        {/* Modal Header */}
        <div className="spx-modal-header">
          <div>
            <span className="spx-modal-badge">Privacy &amp; Data Rights</span>
            <h2 id="spx-modal-title" className="spx-modal-title">
              Cookie Consent Preferences
            </h2>
          </div>
          <button
            type="button"
            className="spx-modal-close-btn"
            onClick={onClose}
            aria-label="Close preferences modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Modal Intro */}
        <div className="spx-modal-intro">
          <p>
            In compliance with applicable privacy frameworks including India&apos;s Digital Personal Data Protection
            (DPDP) Act, 2023, you have granular control over non-essential data collection. Strictly necessary cookies
            remain active to maintain foundational security, CSRF protection, and session integrity.
          </p>
        </div>

        {/* Cookie Categories List */}
        <div className="spx-modal-categories">
          {/* Category A: Strictly Necessary */}
          <div className="spx-category-card">
            <div className="spx-category-header">
              <div className="spx-category-info">
                <div className="spx-category-title-wrap">
                  <h3 className="spx-category-title">Strictly Necessary Cookies</h3>
                  <span className="spx-badge-always-active">Always Active</span>
                </div>
                <p className="spx-category-purpose">
                  Essential for basic website security, CSRF verification, session authentication, and persisting your
                  privacy preferences. These cookies do not store personally identifiable data.
                </p>
              </div>
              <div className="spx-toggle-wrap">
                <input
                  type="checkbox"
                  id="cat-necessary"
                  checked={true}
                  disabled={true}
                  className="spx-toggle-input"
                  aria-label="Strictly Necessary Cookies (Always Active)"
                />
                <label htmlFor="cat-necessary" className="spx-toggle-label is-locked"></label>
              </div>
            </div>
            <div className="spx-category-meta">
              <span>Provider: Spanyx</span>
              <span>•</span>
              <span>Expires: 365 Days</span>
            </div>
          </div>

          {/* Category B: Functional Cookies */}
          <div className="spx-category-card">
            <div className="spx-category-header">
              <div className="spx-category-info">
                <div className="spx-category-title-wrap">
                  <h3 className="spx-category-title">Functional Cookies</h3>
                </div>
                <p className="spx-category-purpose">
                  Enable enhanced functionality and personalization, such as remembering selected interface theme
                  preferences, language settings, and non-sensitive form state.
                </p>
              </div>
              <div className="spx-toggle-wrap">
                <input
                  type="checkbox"
                  id="cat-functional"
                  checked={preferences.functional}
                  onChange={() => toggle('functional')}
                  className="spx-toggle-input"
                  aria-label="Toggle Functional Cookies"
                />
                <label htmlFor="cat-functional" className="spx-toggle-label"></label>
              </div>
            </div>
            <div className="spx-category-meta">
              <span>Provider: Spanyx</span>
              <span>•</span>
              <span>Expires: 180 Days</span>
            </div>
          </div>

          {/* Category C: Analytics Cookies */}
          <div className="spx-category-card">
            <div className="spx-category-header">
              <div className="spx-category-info">
                <div className="spx-category-title-wrap">
                  <h3 className="spx-category-title">Analytics Cookies</h3>
                </div>
                <p className="spx-category-purpose">
                  Allow first-party telemetry to calculate page dwell time, scroll depth, traffic origins, and user
                  engagement across architectural case studies and service pages.
                </p>
              </div>
              <div className="spx-toggle-wrap">
                <input
                  type="checkbox"
                  id="cat-analytics"
                  checked={preferences.analytics}
                  onChange={() => toggle('analytics')}
                  className="spx-toggle-input"
                  aria-label="Toggle Analytics Cookies"
                />
                <label htmlFor="cat-analytics" className="spx-toggle-label"></label>
              </div>
            </div>
            <div className="spx-category-meta">
              <span>Provider: Spanyx First-Party</span>
              <span>•</span>
              <span>Expires: 365 Days</span>
            </div>
          </div>

          {/* Category D: Marketing Cookies */}
          <div className="spx-category-card">
            <div className="spx-category-header">
              <div className="spx-category-info">
                <div className="spx-category-title-wrap">
                  <h3 className="spx-category-title">Marketing &amp; Attribution Cookies</h3>
                </div>
                <p className="spx-category-purpose">
                  Measure referral campaigns and inbound UTM parameters (source, medium, campaign) to assess the
                  performance of marketing outreach and partnership channels.
                </p>
              </div>
              <div className="spx-toggle-wrap">
                <input
                  type="checkbox"
                  id="cat-marketing"
                  checked={preferences.marketing}
                  onChange={() => toggle('marketing')}
                  className="spx-toggle-input"
                  aria-label="Toggle Marketing Cookies"
                />
                <label htmlFor="cat-marketing" className="spx-toggle-label"></label>
              </div>
            </div>
            <div className="spx-category-meta">
              <span>Provider: Spanyx Attribution</span>
              <span>•</span>
              <span>Expires: 90 Days</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="spx-modal-footer">
          <div className="spx-modal-footer-left">
            <button
              type="button"
              className="spx-cookie-btn spx-cookie-btn-secondary"
              onClick={handleRejectOptional}
            >
              Reject Optional
            </button>
            <button
              type="button"
              className="spx-cookie-btn spx-cookie-btn-secondary"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
          <button
            type="button"
            className="spx-cookie-btn spx-cookie-btn-primary"
            onClick={handleSavePreferences}
          >
            Save My Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

