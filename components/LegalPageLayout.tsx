'use client';

import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import LiquidGlassLegalTabs from '@/components/LiquidGlassLegalTabs';

export interface LegalSectionItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  activeTab: 'privacy' | 'terms';
  sections?: LegalSectionItem[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  subtitle,
  activeTab,
  sections,
  children,
}: LegalPageLayoutProps) {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  const handleJumpToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`legal-page apple-page-root ${isExiting ? 'is-exiting' : ''}`}>
      {/* 1. TOP HEADER (Identical to About and UnifiedLegalPage) */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={handleOpenContact}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={false}
          backHref="/"
        />
      </div>

      <main className="legal-main">
        {/* ============================================================
            HERO SECTION (Centered, Clean, Consistent with Spanyx UI)
            ============================================================ */}
        <section className="legal-hero-section">
          <div className="legal-container">
            <div className="legal-hero-header">
              <h1 className="legal-title">{title}</h1>
              <p className="legal-subtitle">{subtitle}</p>

              {/* Liquid Glass Document Switcher Tabs */}
              <LiquidGlassLegalTabs
                activeTab={activeTab}
                onSelectTab={() => {}}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            LEGAL CONTENT CONTAINER (Centered Reading Column, No Awkward Gaps)
            ============================================================ */}
        <section className={`legal-content-section apple-content-fade ${isExiting ? 'is-exiting' : ''}`}>
          <div className="legal-article-container">
            {/* Quick Navigation Jump Bar (Optional, sleek and horizontal) */}
            {sections && sections.length > 0 && (
              <nav
                className="legal-jump-bar"
                aria-label="Quick Section Navigation"
              >
                <span className="legal-jump-label">Jump to:</span>
                <div className="legal-jump-links">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="legal-jump-link"
                      onClick={(e) => handleJumpToSection(e, sec.id)}
                    >
                      {sec.title}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            {/* Main Legal Content Body */}
            <article className="legal-body" role="document">
              {children}
            </article>

            {/* Bottom Support Callout */}
            <div className="legal-bottom-card">
              <div className="legal-bottom-content">
                <h3 className="legal-bottom-title">Questions or Inquiries?</h3>
                <p className="legal-bottom-desc">
                  If you have questions regarding our terms, privacy practices,
                  or prospective software engagements, reach out to our team.
                </p>
              </div>
              <button
                type="button"
                className="legal-bottom-btn"
                onClick={(e) => handleOpenContact(e.currentTarget)}
              >
                <span>Contact Spanyx</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8H12.5M8.5 4L12.5 8L8.5 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Atmospheric Footer & Contact Overlay */}
      <Footer
        onOpenContact={(btnEl) => contactOverlayRef.current?.openFrom(btnEl)}
      />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
