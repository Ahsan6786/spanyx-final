'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from './ContactSection';

interface FooterProps {
  onOpenContact?: (buttonEl: HTMLElement) => void;
  hideContactForm?: boolean;
}

export default function Footer({ onOpenContact, hideContactForm = false }: FooterProps) {
  const handleContactClick = (e: React.MouseEvent<HTMLElement>) => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      e.preventDefault();
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenContact) {
      e.preventDefault();
      onOpenContact(e.currentTarget);
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!hideContactForm && <ContactSection />}
      <footer className="sp-gradient-footer" aria-label="Spanyx Footer">
      <div className="sp-foot-canvas">
        {/* Top Header Row with Navigation */}
        <div className="sp-foot-top-row">
          <nav className="sp-foot-nav" aria-label="Footer Navigation">
            <Link href="/" className="sp-foot-nav-item">
              Home
            </Link>
            <Link href="/#get-started" className="sp-foot-nav-item">
              Work
            </Link>
            <Link href="/about" className="sp-foot-nav-item">
              About
            </Link>
            <Link href="/industries" className="sp-foot-nav-item">
              Industries
            </Link>
            <Link href="/blog" className="sp-foot-nav-item">
              Blog
            </Link>
            <Link href="/privacy-policy" className="sp-foot-nav-item">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="sp-foot-nav-item">
              Terms &amp; Conditions
            </Link>
            <button
              type="button"
              className="sp-foot-nav-item"
              onClick={() => {
                if (typeof window !== 'undefined' && window.SpanyxConsent?.openPreferences) {
                  window.SpanyxConsent.openPreferences();
                }
              }}
            >
              Cookie Settings
            </button>
            <button
              type="button"
              className="sp-foot-nav-item sp-foot-contact-trigger"
              onClick={handleContactClick}
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Ambient atmospheric sunrise sky transition zone */}
        <div className="sp-foot-ambient-sky" aria-hidden="true" />

        {/* Bottom Section: Giant Spanyx Wordmark & Bottom Controls */}
        <div className="sp-foot-bottom-section">
          <div className="sp-foot-brand-row">
            <div className="sp-foot-wordmark-wrap">
              <h2 className="sp-foot-giant-wordmark">
                Spanyx<span className="sp-foot-copyright-mark">©</span>
              </h2>
            </div>

            <div className="sp-foot-right-meta">
              <div className="sp-foot-meta-divider" aria-hidden="true" />
              <div className="sp-foot-meta-actions">
                <span className="sp-foot-tagline">Code by Spanyx</span>
                <button
                  type="button"
                  className="sp-foot-back-top-btn"
                  onClick={handleScrollToTop}
                >
                  <span>Back to top</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 12.5V3.5M8 3.5L4 7.5M8 3.5L12 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
