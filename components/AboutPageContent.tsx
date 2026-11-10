'use client';

import React, { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import TeamSection from '@/components/TeamSection';

export default function AboutPageContent() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  return (
    <div className="about-page apple-page-root">
      {/* 1. TOP HEADER WITH EXACT LIQUID GLASS SLIDE NAVBAR (ALWAYS OPEN, NO LOGO, CENTERED BACK BUTTON) */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={handleOpenContact}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={false}
          backHref="/"
        />
      </div>

      <main className="about-main">
        {/* ============================================================
            SECTION 1: HERO SECTION
            ============================================================ */}
        <section className="about-hero-section">
          <div className="about-container">
            <div className="about-hero-header">
              <h1 className="about-hero-title">
                About us
              </h1>
              <p className="about-hero-subtitle">
                Our mission is to bridge the gap between complexity and efficiency,
                ensuring every organization can thrive in a digital-first world.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2: MAKING SOFTWARE BETTER FOR EVERYONE
            Clean Editorial Layout (matching what-we-create/erp-solutions)
            ============================================================ */}
        <section className="about-story-section" aria-labelledby="about-story-title">
          <div className="about-container about-story-container">
            <div className="about-story-editorial">
              <div className="about-story-heading-wrap">
                <h2 id="about-story-title" className="about-story-title">
                  Making software better for everyone
                </h2>
              </div>
              <div className="about-story-body">
                <p className="about-story-paragraph">
                  Spanyx is an independent technology company focused on
                  creating dependable software and digital experiences. We work
                  with educational institutions, organizations, and businesses
                  to turn complex requirements into practical, well-engineered
                  solutions.
                </p>
                <p className="about-story-paragraph">
                  From custom web applications and enterprise management
                  systems to modern digital platforms, we combine thoughtful
                  design, innovative thinking, and strong engineering to solve
                  real-world challenges.
                </p>
                <p className="about-story-paragraph">
                  Our philosophy is simple: understand the problem, build the
                  right solution, and create technology that delivers lasting
                  value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 3: THE MINDS BEHIND SPANYX
            ============================================================ */}
        <TeamSection id="team" />

        {/* ============================================================
            SECTION 4: OUR CLIENTS
            ============================================================ */}
        <section className="about-clients-section" aria-labelledby="about-clients-title">
          <div className="about-container about-clients-container">
            {/* Section Header */}
            <div className="about-clients-header">
              <h2 id="about-clients-title" className="about-clients-title">
                Our Clients
              </h2>
              <p className="about-clients-subtitle">
                Trusted by leading organizations, academic institutions, and high-growth businesses to engineer dependable software solutions.
              </p>
            </div>

            {/* Client Logos Grid (Simple & Borderless like Screenshot) */}
            <div className="about-clients-logo-grid" aria-label="Our Clients">
              <div className="about-client-logo-card">
                <picture>
                  <source srcSet="/partners/trademax.webp" type="image/webp" />
                  <img
                    src="/partners/trademax.png"
                    alt="TradeMax"
                    className="about-client-logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="about-client-logo-card">
                <picture>
                  <source srcSet="/partners/ltc.webp" type="image/webp" />
                  <img
                    src="/partners/ltc.png"
                    alt="LTC"
                    className="about-client-logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="about-client-logo-card">
                <picture>
                  <source srcSet="/partners/rural-immersion.webp" type="image/webp" />
                  <img
                    src="/partners/rural-immersion.png"
                    alt="Rural Immersion"
                    className="about-client-logo-img is-contained"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="about-client-logo-card">
                <img
                  src="/partners/revial.webp"
                  alt="Revial"
                  className="about-client-logo-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="about-client-logo-card">
                <picture>
                  <source srcSet="/partners/partner-logo-1.webp" type="image/webp" />
                  <img
                    src="/partners/partner-logo-1.png"
                    alt="Academic Research Partner"
                    className="about-client-logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="about-client-logo-card">
                <img
                  src="/partners/logoo.jpg"
                  alt="Client Partner"
                  className="about-client-logo-img is-contained"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Impact Scale Numbers Strip */}
            <div className="about-clients-stats-strip">
              <div className="about-client-stat">
                <span className="about-client-stat-num">50+</span>
                <span className="about-client-stat-label">Production Deployments</span>
              </div>
              <div className="about-client-stat-divider" aria-hidden="true"></div>
              <div className="about-client-stat">
                <span className="about-client-stat-num">99.9%</span>
                <span className="about-client-stat-label">Platform Uptime SLA</span>
              </div>
              <div className="about-client-stat-divider" aria-hidden="true"></div>
              <div className="about-client-stat">
                <span className="about-client-stat-num">10k+</span>
                <span className="about-client-stat-label">Daily Active Users</span>
              </div>
              <div className="about-client-stat-divider" aria-hidden="true"></div>
              <div className="about-client-stat">
                <span className="about-client-stat-num">100%</span>
                <span className="about-client-stat-label">On-Time Delivery</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4: OUR CORE VALUES (4 PILLARS)
            Using carddd.png Dark Frosted Glass Cards
            ============================================================ */}
        <section className="about-values-section" aria-labelledby="about-values-title">
          <div className="about-container about-values-container">
            <div className="about-values-header">
              <h2 id="about-values-title" className="about-values-title">Our core values</h2>
              <p className="about-values-subtitle">
                We believe in forging strong relationships with our customers,
                partners, and employees, based on trust and mutual respect.
              </p>
            </div>

            <div className="about-values-grid">
              {/* Card 1: Collaboration */}
              <div className="about-value-card">
                <div className="about-value-card-top">
                  <div className="about-value-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span className="about-value-index">01</span>
                </div>
                <div className="about-value-card-content">
                  <h3 className="about-value-card-title">Collaboration</h3>
                  <p className="about-value-card-statement">
                    We build with purpose, quality, and long-term impact through open teamwork.
                  </p>
                </div>
                <div className="about-value-card-footer">
                  <span className="about-value-card-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 2: Insightful analytics */}
              <div className="about-value-card">
                <div className="about-value-card-top">
                  <div className="about-value-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span className="about-value-index">02</span>
                </div>
                <div className="about-value-card-content">
                  <h3 className="about-value-card-title">Insightful analytics</h3>
                  <p className="about-value-card-statement">
                    Continuously evolving to meet challenges and uncover key opportunities.
                  </p>
                </div>
                <div className="about-value-card-footer">
                  <span className="about-value-card-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 3: Seamless integration */}
              <div className="about-value-card">
                <div className="about-value-card-top">
                  <div className="about-value-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <span className="about-value-index">03</span>
                </div>
                <div className="about-value-card-content">
                  <h3 className="about-value-card-title">Seamless integration</h3>
                  <p className="about-value-card-statement">
                    Committing to the highest engineering standards across every product.
                  </p>
                </div>
                <div className="about-value-card-footer">
                  <span className="about-value-card-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 4: Effortless boards */}
              <div className="about-value-card">
                <div className="about-value-card-top">
                  <div className="about-value-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <span className="about-value-index">04</span>
                </div>
                <div className="about-value-card-content">
                  <h3 className="about-value-card-title">Effortless boards</h3>
                  <p className="about-value-card-statement">
                    Focusing on long-term impact and positive change through intuitive tooling.
                  </p>
                </div>
                <div className="about-value-card-footer">
                  <span className="about-value-card-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Atmospheric Footer & Contact Overlay */}
      <Footer onOpenContact={(btnEl) => contactOverlayRef.current?.openFrom(btnEl)} />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}

