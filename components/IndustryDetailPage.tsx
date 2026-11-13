'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { IndustryDetail } from '@/data/industriesData';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import Footer from '@/components/Footer';

const OPTIMIZED_INDUSTRY_WEBP = new Set([
  '/industries/jobs-recruiters.png',
  '/industries/news-blogs-publications.png',
  '/industries/real-estate.png',
]);

interface GrowthSolutionCard {
  title: string;
  items: string[];
}

const FALLBACK_GROWTH_SOLUTIONS: GrowthSolutionCard[] = [
  {
    title: 'Domain Strategy',
    items: [
      'Comprehensive Technology Audit',
      'In-depth Market & Competitor Research',
      'Tailored Architecture Roadmap',
      'User Journey & Funnel Optimization',
      'Integration Feasibility Assessment',
      'Scalability & Governance Blueprint',
    ],
  },
  {
    title: 'Custom Engineering',
    items: [
      'Headless High-Speed Architecture',
      'Secure Multi-Tenant Cloud Database',
      'Robust REST & GraphQL APIs',
      'Third-Party Ecosystem Connectors',
      'Automated Data Pipelines',
      'High-Availability Microservices',
    ],
  },
  {
    title: 'Design & Creative',
    items: [
      'Distinct Brand Identity & Aesthetics',
      'Accessible Mobile-First UI Systems',
      'High-Conversion User Experience',
      'Interactive Micro-Animations',
      'Clean Dashboard & Portal Layouts',
      'Visual Data Representation',
    ],
  },
  {
    title: 'Audience Acquisition',
    items: [
      'High-Intent Organic Search Architecture',
      'Targeted Digital Ad Campaign Funnels',
      'Conversion Rate Optimization (CRO)',
      'Automated Multi-Channel Outreach',
      'Referral & Loyalty Growth Loops',
      'Domain Authority Thought Leadership',
    ],
  },
  {
    title: 'Telemetry & Analytics',
    items: [
      'Real-Time Operational Dashboards',
      'User Behavior & Drop-off Telemetry',
      'Conversion Funnel Diagnostics',
      'System Performance Monitoring (APM)',
      'Customer Retention & Cohort Metrics',
      'Revenue Attribution Modeling',
    ],
  },
  {
    title: 'Security & Compliance',
    items: [
      'End-to-End Data Encryption at Rest & Transit',
      'Role-Based Granular Access Control',
      'Comprehensive Vulnerability Auditing',
      'Regulatory Compliance Conformance',
      'Automated Disaster Recovery Backups',
      'Zero-Trust Network Architecture',
    ],
  },
  {
    title: 'Workflow Automation',
    items: [
      'Automated Customer Communication Sequences',
      'Third-Party Accounting & ERP Sync',
      'Scheduled Invoice & Statement Generation',
      'Exception Handling & Alert Desks',
      'Operational Task Routing Rules',
      'Self-Service Customer Support Hubs',
    ],
  },
  {
    title: 'Scale & Monetization',
    items: [
      'Multi-Branch & Regional Expansion Support',
      'Flexible Subscription & Paywall Tiers',
      'Partner API Ecosystem & Monetization',
      'Automated Payment Gateway Routing',
      'White-Label Portal Capabilities',
      'Enterprise SLA & High-Availability Upgrades',
    ],
  },
];

interface IndustryDetailPageProps {
  industry: IndustryDetail;
}

export default function IndustryDetailPage({
  industry,
}: IndustryDetailPageProps) {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenContact = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    contactOverlayRef.current?.openFrom(e.currentTarget);
  };

  const displayName = industry.name.toLowerCase().includes('website')
    ? industry.name
    : `${industry.name} Websites`;

  const growthCards =
    industry.growthSolutions && industry.growthSolutions.length > 0
      ? industry.growthSolutions
      : FALLBACK_GROWTH_SOLUTIONS;

  return (
    <div className="sdp-page apple-page-root">
      {/* Dynamic Island Navigation Bar */}
      <DynamicIslandNav onOpenContact={(btn) => contactOverlayRef.current?.openFrom(btn)} />

      {/* 1. TOP HEADER */}
      <header className="sdp-header">
        <div className="sdp-header-inner">
          <div className="sdp-header-left">
            <Link
              href="/industries"
              className="sdp-circle-back-btn"
              title="Back to Industries We Serve"
              aria-label="Back to Industries We Serve"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 3.5L5.5 8L10 12.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="sdp-header-right">
            <button
              type="button"
              className="sdp-nav-contact-btn"
              onClick={handleOpenContact}
            >
              <span>Contact Us</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4M12 4H5.5M12 4V10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="sdp-main">
        {/* ============================================================
            A. HERO SECTION
            ============================================================ */}
        <section className="sdp-hero" aria-labelledby="sdp-hero-title">
          <div className="sdp-container">
            <div className="sdp-hero-grid">
              <div className="sdp-hero-copy">
                <h1 className="sdp-hero-category-title" id="sdp-hero-title">
                  {displayName}
                </h1>

                <p className="sdp-hero-headline">{industry.heroHeadline}</p>

                <p className="sdp-hero-intro">{industry.heroIntro}</p>

                <div className="sdp-hero-actions">
                  <button
                    type="button"
                    className="sdp-btn-primary"
                    onClick={handleOpenContact}
                  >
                    <span>Start a Conversation</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 12L12 4H5.5M12 4V10.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="sdp-hero-visual">
                <div className="sdp-visual-stage">
                  <div className="sdp-visual-frame">
                    {OPTIMIZED_INDUSTRY_WEBP.has(industry.image) ? (
                      <picture>
                        <source
                          srcSet={industry.image.replace(/\.(png|jpe?g)$/i, '.webp')}
                          type="image/webp"
                        />
                        <img
                          src={industry.image}
                          alt={`${industry.name} — SPANYX Architecture`}
                          className="sdp-visual-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                    ) : (
                      <img
                        src={industry.image}
                        alt={`${industry.name} — SPANYX Architecture`}
                        className="sdp-visual-img"
                        loading="eager"
                        decoding="async"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            B. ABOUT THE INDUSTRY (Split Lead & Editorial Body)
            ============================================================ */}
        <section className="sdp-section sdp-about-section">
          <div className="sdp-container">
            <div className="sdp-about-wrap">
              <div className="sdp-about-header">
                <h2 className="sdp-about-headline">
                  {industry.aboutHeadline}
                </h2>
              </div>

              <div className="sdp-about-columns">
                <div className="sdp-about-lead-col">
                  <div className="sdp-about-lead-card">
                    <p className="sdp-about-lead">{industry.aboutLead}</p>
                  </div>
                </div>

                <div className="sdp-about-body-col">
                  {industry.aboutBody.map((paragraph, idx) => (
                    <p key={idx} className="sdp-about-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ============================================================
            D. GROWTH-DRIVEN SOLUTIONS (8 Bespoke Domain Black Cards)
            ============================================================ */}
        <section
          className="growth-solutions-section"
          aria-labelledby="growth-solutions-title"
        >
          <div className="sdp-container">
            <div className="growth-solutions-header">
              <h2
                className="growth-solutions-heading"
                id="growth-solutions-title"
              >
                Spanyx Growth-Driven Solutions
              </h2>
            </div>

            <div className="growth-solutions-grid">
              {growthCards.map((card, idx) => (
                <div key={idx} className="growth-solution-card">
                  <h3 className="growth-solution-title">{card.title}</h3>
                  <ul className="growth-solution-list">
                    {card.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="growth-solution-item">
                        <span className="growth-bullet" aria-hidden="true">
                          •
                        </span>
                        <span className="growth-item-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="growth-solutions-cta-wrap">
              <button
                type="button"
                className="growth-solutions-cta-btn"
                onClick={handleOpenContact}
              >
                <span>Start a Conversation</span>
                <svg
                  width="16"
                  height="16"
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

        {/* ============================================================
            E. FREQUENTLY ASKED QUESTIONS (Smooth Accordion, Black Active/Hover)
            ============================================================ */}
        {industry.faqs && industry.faqs.length > 0 && (
          <section className="ind-faq-section" aria-labelledby="ind-faq-title">
            <div className="sdp-container">
              <div className="ind-faq-container">
                <div className="ind-section-header ind-faq-header">
                  <h2 className="ind-section-title" id="ind-faq-title">
                    Frequently Asked Questions
                  </h2>
                  <p className="ind-section-subtitle">
                    Key insights into our engineering approach, system integration, and security protocols for {industry.name}.
                  </p>
                </div>

                <div className="ind-faq-list">
                  {industry.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`ind-faq-item ${isOpen ? 'is-open' : ''}`}
                      >
                        <button
                          type="button"
                          className="ind-faq-button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                        >
                          <span className="ind-faq-question">{faq.question}</span>
                          <span className="ind-faq-icon" aria-hidden="true">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M4 6L8 10L12 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>
                        <div
                          className="ind-faq-collapse"
                          aria-hidden={!isOpen}
                        >
                          <div className="ind-faq-answer-inner">
                            <div className="ind-faq-answer">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Atmospheric Footer & Contact Overlay */}
      <Footer
        onOpenContact={(buttonEl) => contactOverlayRef.current?.openFrom(buttonEl)}
      />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
