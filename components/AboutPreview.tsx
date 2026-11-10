'use client';

import React from 'react';
import Link from 'next/link';

interface AboutPreviewProps {
  onOpenContact?: (buttonEl: HTMLElement) => void;
}

const STATS = [
  { value: '50+', label: 'Production Deployments' },
  { value: '99.9%', label: 'Platform Uptime SLA' },
  { value: '10k+', label: 'Daily Active Users' },
  { value: '100%', label: 'On-Time Delivery' },
];

const CLIENT_LOGOS = [
  {
    name: 'TradeMax',
    png: '/partners/trademax.png',
    webp: '/partners/trademax.webp',
  },
  {
    name: 'LTC',
    png: '/partners/ltc.png',
    webp: '/partners/ltc.webp',
  },
  {
    name: 'Rural Immersion',
    png: '/partners/rural-immersion.png',
    webp: '/partners/rural-immersion.webp',
  },
  {
    name: 'Revial',
    webp: '/partners/revial.webp',
  },
  {
    name: 'Academic Research Partner',
    png: '/partners/partner-logo-1.png',
    webp: '/partners/partner-logo-1.webp',
  },
  {
    name: 'Client Partner',
    png: '/partners/logoo.jpg',
    webp: '/partners/logoo.webp',
    contained: true,
  },
];

const VALUES = [
  {
    title: 'Collaboration',
    statement: 'We work closely with you every step of the way to build what you actually need.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Clear Analytics',
    statement: 'Simple dashboards and clear numbers so you always know how your business is doing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Clean Engineering',
    statement: 'Fast, secure, and reliable code that runs smoothly without breaking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: 'Easy to Use',
    statement: 'Simple screens and intuitive tools that anyone on your team can use easily.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
];

export default function AboutPreview({ onOpenContact }: AboutPreviewProps) {
  return (
    <section className="about-preview-section" id="about-preview" aria-labelledby="about-preview-title">
      <div className="about-preview-container">
        {/* Centered Section Header: Bold, Big Heading + Subtitle */}
        <div className="landing-section-header about-preview-header">
          <h2 id="about-preview-title" className="landing-section-title">
            About Us
          </h2>
          <p className="landing-section-lead">
            Simple, reliable software for your team
          </p>
        </div>

        {/* Centered Editorial Copy + CTA */}
        <div className="about-preview-centered-copy">
          <p className="about-preview-lead-desc">
            We build custom software, web platforms, and mobile apps for businesses and universities. We focus on clean code, simple screens, and delivering on time.
          </p>

          <div className="about-preview-action-row">
            <Link href="/about" className="about-preview-cta-btn">
              <span>Learn More About Us</span>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M4 12L12 4M12 4H5.5M12 4V10.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* 4 Scale Metrics Strip */}
        <div className="about-clients-stats-strip about-preview-stats" aria-label="Spanyx Performance & Scale">
          {STATS.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              {idx > 0 && <div className="about-client-stat-divider" aria-hidden="true"></div>}
              <div className="about-client-stat">
                <span className="about-client-stat-num">{stat.value}</span>
                <span className="about-client-stat-label">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4 Core Value Pillars (Full actual size as in About Us page: max-width 1400px) */}
      <div className="about-values-container about-preview-values-container">
        <div className="about-values-grid">
          {VALUES.map((val) => (
            <div key={val.title} className="about-value-card">
              <div className="about-value-card-top">
                <div className="about-value-icon-box">{val.icon}</div>
              </div>
              <div className="about-value-card-content">
                <h3 className="about-value-card-title">{val.title}</h3>
                <p className="about-value-card-statement">{val.statement}</p>
              </div>
              <div className="about-value-card-footer">
                <span className="about-value-card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-preview-container">

        {/* Trusted Partners / Client Logos Grid */}
        <div className="about-preview-clients-wrap">
          <div className="about-preview-clients-header">
            <span className="about-preview-clients-title">Trusted by Leading Organizations &amp; Academic Institutions</span>
          </div>
          <div className="about-clients-logo-grid" aria-label="Our Clients">
            {CLIENT_LOGOS.map((client) => (
              <div key={client.name} className="about-client-logo-card">
                {client.webp && client.png ? (
                  <picture>
                    <source srcSet={client.webp} type="image/webp" />
                    <img
                      src={client.png}
                      alt={client.name}
                      className={`about-client-logo-img ${client.contained ? 'is-contained' : ''}`}
                      loading="lazy"
                      decoding="async"
                      width={240}
                      height={80}
                    />
                  </picture>
                ) : (
                  <img
                    src={client.webp || client.png}
                    alt={client.name}
                    className={`about-client-logo-img ${client.contained ? 'is-contained' : ''}`}
                    loading="lazy"
                    decoding="async"
                    width={240}
                    height={80}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

