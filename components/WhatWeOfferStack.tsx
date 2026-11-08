'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CapabilityItem {
  title: string;
  description: string;
}

interface WhatWeOfferStackProps {
  capabilities: CapabilityItem[];
}

// Generates relevant, meaningful practical lines for each capability
function getCapabilityHighlights(title: string): string[] {
  // ERP Solutions
  if (title.includes('Daily Work') || title.includes('Task Automation')) {
    return [
      'Eliminate repetitive manual data entry across departments',
      'Instant digital approval workflows with automatic manager alerts',
      'Complete audit trails with time stamps and staff activity logs',
    ];
  }
  if (title.includes('Admin Dashboards') || title.includes('Clear Admin')) {
    return [
      'Live metric cards for attendance, revenue, and active batches',
      'Filterable reports by date range, department, and staff member',
      'Clear visual graphs designed for quick decision-making',
    ];
  }
  if (title.includes('Roles & Permissions')) {
    return [
      'Granular view, edit, and export permissions by user role',
      'Secure password encryption and multi-device session control',
      'Staff members only see tools relevant to their daily duties',
    ];
  }
  if (title.includes('Room') || title.includes('Stock') || title.includes('Resource')) {
    return [
      'Real-time status of room occupancy, equipment, and inventories',
      'Automatic alerts when supplies fall below minimum thresholds',
      'Conflict-free scheduling for halls, rooms, and shared assets',
    ];
  }
  if (title.includes('Emails & Alerts')) {
    return [
      'Instant notification triggers on form submissions and approvals',
      'Scheduled email summaries sent directly to owners and managers',
      'Automated reminder alerts before critical deadlines expire',
    ];
  }
  if (title.includes('Data Import')) {
    return [
      'One-click Excel and CSV data import with automatic error checking',
      'Export custom reports to formatted PDF and Excel anytime',
      'Safe cloud backups ensuring your organizational records are protected',
    ];
  }
  // Business Websites
  if (title.includes('Company Website')) {
    return [
      'Tailored aesthetics reflecting your brand identity and industry leadership',
      'Clear messaging that clearly communicates what your business delivers',
      'Designed for flawless readability across all modern web browsers',
    ];
  }
  if (title.includes('Inquiries')) {
    return [
      'Strategically positioned inquiry forms and phone/chat buttons',
      'Direct WhatsApp and email lead routing to your sales team',
      'Conversion-focused layouts that turn website visitors into clients',
    ];
  }
  if (title.includes('Mobile & Tablet')) {
    return [
      'Fluid responsive layouts tested on real iOS and Android devices',
      'Fast thumb-friendly navigation and lightweight image rendering',
      'Sub-second page load times on 4G and 5G cellular connections',
    ];
  }
  if (title.includes('Content Updates')) {
    return [
      'Intuitive admin dashboard to update texts, banners, and blogs',
      'Zero coding knowledge required to add new projects or services',
      'Instant publishing with automated revision backups',
    ];
  }
  if (title.includes('Google Search') || title.includes('SEO')) {
    return [
      'Clean metadata, OpenGraph tags, and semantic HTML structure',
      'Optimized Core Web Vitals score for higher Google ranking',
      'Automated XML sitemaps and search console indexing setup',
    ];
  }
  if (title.includes('CRM') || title.includes('WhatsApp')) {
    return [
      'Instant lead sync to your internal CRM or Google Sheets',
      'Direct WhatsApp chat trigger with pre-filled inquiry text',
      'Automated confirmation emails sent to prospective clients',
    ];
  }
  // Scroll-Driven Animations
  if (title.includes('Story Sections')) {
    return [
      'Full-bleed visual stages that unfold naturally as users scroll down',
      'Sticky focal points keeping user attention glued to key product perks',
      'Cinematic pacing calibrated for seamless narrative storytelling',
    ];
  }
  if (title.includes('Stacked Card')) {
    return [
      'Layered 3D card perspectives with realistic depth of field',
      'Progressive revelation of features as each card reaches view',
      'Smooth spring physics ensuring zero stutter during fast scrolling',
    ];
  }
  if (title.includes('Product Reveals')) {
    return [
      'Interactive component breakdown showcasing each product layer',
      'Micro-animations highlighting key specs and technical details',
      'Dynamic typography that fades and docks with perfection',
    ];
  }
  if (title.includes('Animated Backgrounds')) {
    return [
      'Subtle ambient gradients and floating particles for visual depth',
      'GPU-accelerated CSS shaders that consume minimal battery power',
      'Refraction glass lenses that displace background graphics live',
    ];
  }
  if (title.includes('Smooth Buttons')) {
    return [
      'Spring-loaded button hover responses with magnetic attraction',
      'Fluid modal pop-ups that expand seamlessly from clicked triggers',
      'Interactive cursor effects and tactile micro-feedback',
    ];
  }
  if (title.includes('Speed & Smoothness')) {
    return [
      'Guaranteed 60 FPS animation performance using transform3d',
      'Eliminated layout thrashing and cumulative layout shifts (CLS)',
      'Optimized asset loading with lazy evaluation and hardware buffers',
    ];
  }
  // Brand & Portfolio
  if (title.includes('Brand Look')) {
    return [
      'Bespoke visual identity expressing your creative perspective',
      'Curated typography pairings and balanced spatial rhythm',
      'Refined color palettes establishing undeniable authority',
    ];
  }
  if (title.includes('Case Study')) {
    return [
      'In-depth project breakdown highlighting strategy and final impact',
      'Before-and-after interactive slider comparisons',
      'Structured layout highlighting client challenge, approach, and results',
    ];
  }
  if (title.includes('Galleries')) {
    return [
      'Ultra-crisp responsive image grids with lossless compression',
      'Full-screen lightbox viewer with keyboard arrow navigation',
      'Silky-smooth lazy loading preventing page stutter during scroll',
    ];
  }
  if (title.includes('Team')) {
    return [
      'Authentic founder and leadership profiles with social links',
      'Interactive company timeline narrating key milestones and growth',
      'Core values section highlighting culture and craftsmanship',
    ];
  }
  if (title.includes('Page Transitions')) {
    return [
      'Seamless view transitions between portfolio pieces without blank flashes',
      'Fluid route prefetching for instant next-page responsiveness',
      'Persistent header navigation across all site sections',
    ];
  }
  if (title.includes('Portfolio Updates')) {
    return [
      'Effortless CMS dashboard to upload new case studies in minutes',
      'Drag-and-drop image reordering and category tagging',
      'One-click draft and publish controls with instant preview',
    ];
  }
  // Web Applications
  if (title.includes('SaaS') || title.includes('Subscription')) {
    return [
      'Automated recurring billing and subscription tier management',
      'Integrated user onboarding flows with interactive walkthroughs',
      'Multi-tenant workspace architecture with data isolation',
    ];
  }
  if (title.includes('Customer & Partner')) {
    return [
      'Dedicated self-service dashboards for clients and partners',
      'Document sharing, ticket tracking, and direct status updates',
      'Clean interface reducing customer support back-and-forth',
    ];
  }
  if (title.includes('AI Features')) {
    return [
      'LLM integration for smart document summarization and insights',
      'Automated semantic search and intelligent suggestion engines',
      'Secure data handling ensuring proprietary inputs remain private',
    ];
  }
  if (title.includes('Databases & APIs')) {
    return [
      'High-throughput PostgreSQL and Redis database architecture',
      'REST and GraphQL endpoints built for sub-50ms response times',
      'Automated rate-limiting and robust data validation pipelines',
    ];
  }
  if (title.includes('Logins & Online Payments')) {
    return [
      'Stripe, Razorpay, and PayPal gateway integration with instant webhooks',
      'OAuth 2.0 social sign-on (Google, Apple, Microsoft) and 2FA',
      'Compliant checkout sessions with automated invoice generation',
    ];
  }
  if (title.includes('Cloud Hosting')) {
    return [
      'Auto-scaling cloud infrastructure handling traffic spikes effortlessly',
      'Automated SSL certificates, DDoS protection, and global CDN caching',
      '24/7 uptime monitoring with real-time error reporting and alerts',
    ];
  }
  // Trading & FinTech
  if (title.includes('Web Trading')) {
    return [
      'Institutional-grade order book and order execution interfaces',
      'Multi-screen customizable trading layouts with saved presets',
      'Ultra-responsive keyboard shortcuts for rapid position entry',
    ];
  }
  if (title.includes('Live Charts')) {
    return [
      'TradingView chart integration with full technical indicator suite',
      'Sub-millisecond WebSocket streaming for tick-by-tick quotes',
      'Multiple timeframe analysis from 1-second ticks to monthly bars',
    ];
  }
  if (title.includes('Trader Performance')) {
    return [
      'Automated trade journaling with win-rate and Sharpe ratio analytics',
      'Visual drawdown curves and daily P&L distribution heatmaps',
      'Behavioral metrics helping traders identify high-edge setups',
    ];
  }
  if (title.includes('Academy') || title.includes('Course')) {
    return [
      'Gated video course modules with progress tracking and quizzes',
      'Exclusive community discord / forum integration for members',
      'Live webinar broadcasting with interactive Q&A chat rooms',
    ];
  }
  if (title.includes('Market Alerts') || title.includes('Signal')) {
    return [
      'Automated webhook triggers for technical breakouts and volume surges',
      'Instant Telegram, SMS, and push notification signal dispatch',
      'Custom scanner algorithms filtering thousands of tickers live',
    ];
  }
  if (title.includes('Member Logins')) {
    return [
      'Tiered subscription memberships with automatic access revocation',
      'Integrated payment gateways supporting credit cards, UPI, and crypto',
      'Strict single-session enforcement preventing unauthorized account sharing',
    ];
  }
  // Default fallback
  return [
    'Engineered with modern, clean, scalable software architecture',
    'Streamlined workflows designed to increase team productivity',
    'Rigorous automated testing ensuring reliable daily operation',
  ];
}

export default function WhatWeOfferStack({
  capabilities,
}: WhatWeOfferStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = capabilities.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Scroll-driven center-lock animation:
  // When scrolling down the page, locks in screen center and cycles through the cards in the stack
  useEffect(() => {
    if (total <= 1) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const totalScrollable = container.offsetHeight - window.innerHeight;

            // Smooth background transition to black when What We Offer section is active
            const isOfferInView =
              rect.top <= window.innerHeight * 0.65 &&
              rect.bottom >= window.innerHeight * 0.15;
            const pageEl = document.querySelector('.sdp-page');
            if (pageEl) {
              if (isOfferInView) {
                pageEl.classList.add('is-offer-dark');
              } else {
                pageEl.classList.remove('is-offer-dark');
              }
            }

            if (totalScrollable > 0) {
              const scrolledPastTop = -rect.top;
              if (scrolledPastTop >= 0 && scrolledPastTop <= totalScrollable) {
                const rawProgress = scrolledPastTop / totalScrollable;
                // Add resting buffer so cards stay calm and don't rush
                const buffer = 0.05;
                const effectiveProgress = Math.max(
                  0,
                  Math.min(1, (rawProgress - buffer) / (1 - buffer * 2))
                );
                const targetIdx = Math.min(
                  total - 1,
                  Math.floor(effectiveProgress * total)
                );
                setActiveIndex(targetIdx);
              } else if (scrolledPastTop < 0) {
                setActiveIndex(0);
              } else {
                setActiveIndex(total - 1);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelector('.sdp-page')?.classList.remove('is-offer-dark');
    };
  }, [total]);

  if (!capabilities || capabilities.length === 0) return null;

  // Rich distinct colors for each card layer matching the reference screenshot
  const cardThemes = [
    { bg: '#f25138', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
    { bg: '#1d4ed8', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
    { bg: '#047857', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
    { bg: '#d97706', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
    { bg: '#7c3aed', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
    { bg: '#0f172a', text: '#ffffff', sub: 'rgba(255, 255, 255, 0.92)' },
  ];

  return (
    <div className="sdp-offer-scroll-track" ref={containerRef}>
      <div className="sdp-offer-sticky-stage">
        {/* Pinned Heading that stays visible throughout the scrolling animation */}
        <div className="sdp-offer-pinned-header">
          <h2 className="sdp-section-heading sdp-offer-pinned-heading">
            What We Offer
          </h2>
        </div>

        {/* 3D Stack Stage */}
        <div className="sdp-offer-stage">
        {capabilities.map((cap, i) => {
          // Relative position in cyclic stack (0 = active front, 1 = 1st behind, 2 = 2nd behind)
          const offset = (i - activeIndex + total) % total;
          const isActive = offset === 0;
          const isStack1 = offset === 1;
          const isStack2 = offset === 2;
          const isVisible = offset <= 2;
          const theme = cardThemes[i % cardThemes.length];
          const highlights = getCapabilityHighlights(cap.title);

          let stackClass = 'sdp-stack-card';
          if (isActive) stackClass += ' is-active';
          else if (isStack1) stackClass += ' is-stack-1';
          else if (isStack2) stackClass += ' is-stack-2';
          else stackClass += ' is-stack-hidden';

          return (
            <article
              key={cap.title}
              className={stackClass}
              style={{
                backgroundColor: theme.bg,
                color: theme.text,
                zIndex: isVisible ? 10 - offset : 1,
              }}
              onClick={() => {
                if (!isActive) setActiveIndex(i);
              }}
              aria-hidden={!isActive}
            >
              {/* Card Inner Content */}
              <div className="sdp-card-inner-wrap">
                <div className="sdp-card-top-bar">
                  <h3 className="sdp-card-title">{cap.title}</h3>
                  <button
                    type="button"
                    className="sdp-circle-next-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    title="Next Capability"
                    aria-label="Next Capability"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <p className="sdp-card-desc" style={{ color: theme.sub }}>
                  {cap.description}
                </p>

                {/* Meaningful Lines Relevant to Title */}
                <ul className="sdp-card-highlights-list">
                  {highlights.map((point) => (
                    <li key={point} className="sdp-card-highlight-item">
                      <span className="sdp-card-highlight-icon">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3.5 8.5L6.5 11.5L12.5 4.5"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="sdp-card-highlight-text">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </div>
);
}
