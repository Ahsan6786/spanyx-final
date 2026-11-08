'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { IndustryDetail } from '@/data/industriesData';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import Footer from '@/components/Footer';

interface GrowthSolutionCard {
  title: string;
  items: string[];
}

const GROWTH_SOLUTIONS: GrowthSolutionCard[] = [
  {
    title: 'Strategy',
    items: [
      'Comprehensive Marketing Audit',
      'In-depth Market Research',
      'Tailored Brand Strategy',
      'Customer Journey Mapping',
      'Marketing Funnel Optimization',
      'Content Strategy Development',
    ],
  },
  {
    title: 'Development',
    items: [
      'SEO & Local Search Optimization',
      'Mobile Application Development',
      'Display Advertising',
      'Email Campaigns',
      'SEO for Fintech',
      'Custom CMS & API Architecture',
    ],
  },
  {
    title: 'Design & Creative',
    items: [
      'Distinct Branding & Identity',
      'Social Media Management',
      'UX & UI Design Solutions',
      'Graphic & Visual Design',
      'AR/3D Design Creation',
      'Motion Graphics & Animation',
    ],
  },
  {
    title: 'Digital Marketing',
    items: [
      'SEO (Search Engine Optimization)',
      'Outbound Lead Generation',
      'PR & Media Relations',
      'Targeted Email Marketing',
      'Influencer Marketing Campaigns',
      'Paid Search Campaigns',
    ],
  },
  {
    title: 'Analytics',
    items: [
      'End-to-End Analytics Solutions',
      'Web Analytics Insights',
      'Conversion Rate Optimization',
      'Real-Time Audience Telemetry',
      'User Retention & Attribution',
      'Performance Benchmarking',
    ],
  },
  {
    title: 'PR & Influencer',
    items: [
      'Media & Press Relations',
      'Non-Blockchain Influencer Outreach',
      'Thought Leadership Placements',
      'Digital Press Syndication',
      'Crisis & Reputation Management',
      'Strategic Partner Co-Marketing',
    ],
  },
  {
    title: 'Content & Media',
    items: [
      'Editorial Workflow Architecture',
      'Multi-Channel Content Syndication',
      'High-Impact Video & Audio Podcasts',
      'Interactive Digital Publishing',
      'Automated Newsletter Pipelines',
      'Brand Journalism & Storytelling',
    ],
  },
  {
    title: 'Growth & Monetization',
    items: [
      'Metered & Hard Paywall Models',
      'Reader Subscription Funnels',
      'Programmatic & Direct Ad Tech',
      'Automated Churn Reduction',
      'Subscriber Community Retention',
      'Enterprise Partner Licensing',
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

  const handleOpenContact = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    contactOverlayRef.current?.openFrom(e.currentTarget);
  };

  const displayName = industry.name.toLowerCase().includes('website')
    ? industry.name
    : `${industry.name} Websites`;

  return (
    <div className="sdp-page apple-page-root">
      {/* 1. TOP HEADER: Clean Back Button to /industries on left, Contact on right */}
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
            A. HERO SECTION (Direct, Confident, Clean Typography)
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
                    <img
                      src={industry.image}
                      alt={`${industry.name} — SPANYX Architecture`}
                      className="sdp-visual-img"
                      loading="eager"
                    />
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
            D. GROWTH-DRIVEN SOLUTIONS (8 Black Cards, Sharp Unrounded Corners)
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
              {GROWTH_SOLUTIONS.map((card, idx) => (
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
      </main>

      {/* Atmospheric Footer & Contact Overlay */}
      <Footer
        onOpenContact={(buttonEl) => contactOverlayRef.current?.openFrom(buttonEl)}
      />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
