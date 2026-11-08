'use client';

import React, { useState } from 'react';

interface MetricItem {
  id: string;
  tabLabel: string;
  headline: string;
  subheadline: string;
  before: {
    label: string;
    value: string;
    numeric: number; // 0 - 100 for visual bar
    note: string;
  };
  after: {
    label: string;
    value: string;
    numeric: number; // 0 - 100 for visual bar
    note: string;
  };
  highlightDelta: string;
  keyOutcomes: {
    title: string;
    description: string;
  }[];
}

const CATEGORY_DATA: Record<string, MetricItem[]> = {
  'erp-solutions': [
    {
      id: 'processing-time',
      tabLabel: 'Daily Operations',
      headline: '88% Reduction in Manual Routine Work',
      subheadline: 'How custom ERP automation transforms daily business tasks',
      before: {
        label: 'Before Spanyx (Spreadsheets & Paper)',
        value: '4.5 Hours / day',
        numeric: 85,
        note: 'Staff manually entering sales, inventory, and attendance records',
      },
      after: {
        label: 'With Spanyx ERP',
        value: '25 Minutes / day',
        numeric: 15,
        note: 'Automated digital forms, auto-syncing stock, and one-click reports',
      },
      highlightDelta: '88% faster daily workflow',
      keyOutcomes: [
        {
          title: 'Zero Duplicate Entries',
          description: 'All branches and staff share one live cloud database.',
        },
        {
          title: 'Instant Approvals',
          description: 'Managers approve purchases and requests right from their phone.',
        },
        {
          title: 'Automatic Error Checking',
          description: 'Eliminates human calculation mistakes before invoices are sent.',
        },
      ],
    },
    {
      id: 'stock-accuracy',
      tabLabel: 'Inventory & Stock',
      headline: 'Real-Time Stock Accuracy at 99.8%',
      subheadline: 'Eliminating out-of-stock surprises and inventory discrepancies',
      before: {
        label: 'Before Spanyx',
        value: '78% Accuracy',
        numeric: 40,
        note: 'Stock counts updated weekly with frequent discrepancies',
      },
      after: {
        label: 'With Spanyx ERP',
        value: '99.8% Accuracy',
        numeric: 99,
        note: 'Live inventory deduction on every order and shipment',
      },
      highlightDelta: '99.8% live accuracy',
      keyOutcomes: [
        {
          title: 'Low Stock Alerts',
          description: 'Automatic warning emails before vital supplies run out.',
        },
        {
          title: 'Barcode & QR Scanning',
          description: 'Fast phone or scanner check-in for warehouse shipments.',
        },
        {
          title: 'Complete Audit Log',
          description: 'Every item movement is logged with employee name and timestamp.',
        },
      ],
    },
    {
      id: 'monthly-closing',
      tabLabel: 'Monthly Reports',
      headline: 'Monthly Financial Closing in 1 Day (down from 8)',
      subheadline: 'Speed up monthly accounting, billing, and payroll processing',
      before: {
        label: 'Before Spanyx',
        value: '8 Business Days',
        numeric: 80,
        note: 'Hunting down missing receipts, invoices, and mismatched ledgers',
      },
      after: {
        label: 'With Spanyx ERP',
        value: 'Under 24 Hours',
        numeric: 15,
        note: 'Pre-reconciled statements ready for your accountant in one click',
      },
      highlightDelta: '8x faster monthly closing',
      keyOutcomes: [
        {
          title: 'One-Click P&L Reports',
          description: 'Clean financial dashboards exported instantly to PDF or Excel.',
        },
        {
          title: 'Automated Invoicing',
          description: 'Recurring client bills generated and sent automatically.',
        },
        {
          title: 'Payroll Calculation',
          description: 'Auto-calculates staff work hours, leaves, and salary slips.',
        },
      ],
    },
  ],
  'business-websites': [
    {
      id: 'load-speed',
      tabLabel: 'Page Speed',
      headline: 'Sub-Second Page Load Speed (0.6s)',
      subheadline: 'Fast loading websites keep visitors engaged and ranking on Google',
      before: {
        label: 'Average Business Website',
        value: '4.8 Seconds',
        numeric: 80,
        note: 'Heavy templates that take seconds to load on mobile connections',
      },
      after: {
        label: 'Spanyx Custom Website',
        value: '0.62 Seconds',
        numeric: 12,
        note: 'Ultra-lightweight code, modern images, and global edge caching',
      },
      highlightDelta: '8x faster page loads',
      keyOutcomes: [
        {
          title: '99+ Google PageSpeed',
          description: 'Passes every Core Web Vital test for top Google ranking.',
        },
        {
          title: 'Instant Mobile Loading',
          description: 'Pages open instantly even on slower 4G cellular data.',
        },
        {
          title: 'Zero Content Jitter',
          description: 'Smooth, polished loading experience without jumping layouts.',
        },
      ],
    },
    {
      id: 'inquiries',
      tabLabel: 'Customer Inquiries',
      headline: '+320% Increase in Qualified Inquiries',
      subheadline: 'Turning casual website visitors into direct calls and messages',
      before: {
        label: 'Traditional Website',
        value: '1.2% Inquiry Rate',
        numeric: 20,
        note: 'Hard-to-find contact forms and cluttered, confusing pages',
      },
      after: {
        label: 'Spanyx Designed Website',
        value: '4.9% Inquiry Rate',
        numeric: 85,
        note: 'Clear call-to-actions, direct WhatsApp buttons, and fast forms',
      },
      highlightDelta: '+320% client inquiries',
      keyOutcomes: [
        {
          title: 'Direct WhatsApp Routing',
          description: 'One tap opens a pre-filled message directly to your phone.',
        },
        {
          title: 'Clear Value Proposition',
          description: 'Visitors immediately understand what you do in 5 seconds.',
        },
        {
          title: 'Mobile-Optimized Forms',
          description: 'Quick 2-field inquiry forms that visitors actually fill out.',
        },
      ],
    },
    {
      id: 'seo-ranking',
      tabLabel: 'Google Search',
      headline: 'Rank on Page 1 for Core Search Terms',
      subheadline: 'Built with search engine best practices right from day one',
      before: {
        label: 'Before Spanyx',
        value: 'Buried on Page 4+',
        numeric: 15,
        note: 'Missing meta tags, slow speed, and zero schema structure',
      },
      after: {
        label: 'Spanyx SEO Architecture',
        value: 'Top 3 Results',
        numeric: 95,
        note: 'Clean semantic HTML, auto-generated sitemaps, and rich search snippets',
      },
      highlightDelta: 'Top Google Rankings',
      keyOutcomes: [
        {
          title: 'Full Google Search Console Setup',
          description: 'We register and verify your sitemap with Google directly.',
        },
        {
          title: 'Social Share Cards',
          description: 'Links look beautiful when shared on WhatsApp, LinkedIn, and Twitter.',
        },
        {
          title: 'Structured Business Schema',
          description: 'Helps Google display your phone, address, and ratings cleanly.',
        },
      ],
    },
  ],
  'scroll-driven-animations': [
    {
      id: 'session-duration',
      tabLabel: 'Engagement Time',
      headline: '3m 20s Average Visitor Attention',
      subheadline: 'Storytelling that keeps visitors reading until the very end',
      before: {
        label: 'Static Website',
        value: '35 Seconds',
        numeric: 18,
        note: 'Quick skim and bounce after reading the top banner',
      },
      after: {
        label: 'Spanyx Scroll Experience',
        value: '3m 20s On Page',
        numeric: 90,
        note: 'Interactive visual progression that unfolds naturally as they scroll',
      },
      highlightDelta: '5.7x longer session duration',
      keyOutcomes: [
        {
          title: '84% Scroll Completion',
          description: 'Most visitors scroll through to your final call to action.',
        },
        {
          title: 'Memorable Brand Presence',
          description: 'A distinct, award-caliber impression customers remember.',
        },
        {
          title: 'Zero Scrolling Lag',
          description: 'Butter-smooth natural scroll that never hijacks the user trackpad.',
        },
      ],
    },
    {
      id: 'frame-rate',
      tabLabel: 'Smooth 60 FPS',
      headline: 'Locked 60 FPS on Phones and Laptops',
      subheadline: 'Hardware-accelerated animations with zero stutter or overheating',
      before: {
        label: 'Generic Animation Libraries',
        value: '24 - 38 FPS (Jitters)',
        numeric: 35,
        note: 'Slow canvas scripts that drain battery and lag on mobile phones',
      },
      after: {
        label: 'Spanyx GPU Pipeline',
        value: '60 FPS Solid',
        numeric: 98,
        note: 'Pure CSS and GPU transforms that run smoothly on every screen',
      },
      highlightDelta: 'Zero dropped frames',
      keyOutcomes: [
        {
          title: 'Battery Friendly',
          description: 'Optimized rendering that avoids CPU and battery drain.',
        },
        {
          title: 'Full Touch Support',
          description: 'Responds instantly to touch and swipe gestures on phones.',
        },
        {
          title: 'Accessible Mode',
          description: 'Respects visitor preferences for reduced motion automatically.',
        },
      ],
    },
  ],
  'brand-portfolio-websites': [
    {
      id: 'deal-size',
      tabLabel: 'Client Contract Value',
      headline: '3.5x Higher Average Project Values',
      subheadline: 'How premium positioning attracts serious, higher-budget clients',
      before: {
        label: 'Generic Freelance Profile',
        value: 'Small Low-Budget Inquiries',
        numeric: 25,
        note: 'Clients price-shopping and asking for heavy discounts',
      },
      after: {
        label: 'Spanyx Signature Portfolio',
        value: 'Premium Retainer Contracts',
        numeric: 92,
        note: 'Clients confident in paying higher rates for demonstrated excellence',
      },
      highlightDelta: '3.5x higher contract value',
      keyOutcomes: [
        {
          title: 'High-Impact Case Studies',
          description: 'Presents the problem, strategy, and measurable client results.',
        },
        {
          title: 'Editorial Typography',
          description: 'Clean layouts that showcase your work like a published design book.',
        },
        {
          title: 'Effortless Inquiries',
          description: 'Frictionless contact flow designed for busy executives.',
        },
      ],
    },
    {
      id: 'close-rate',
      tabLabel: 'Pitch Win Rate',
      headline: '68% Pitch Close Rate (up from 24%)',
      subheadline: 'When prospects see your portfolio, the trust is already built',
      before: {
        label: 'Before Spanyx',
        value: '24% Win Rate',
        numeric: 30,
        note: 'Needing extensive meetings to prove capability and credibility',
      },
      after: {
        label: 'With Spanyx Portfolio',
        value: '68% Win Rate',
        numeric: 88,
        note: 'Prospective clients arrive already sold on your standard of work',
      },
      highlightDelta: '+183% pitch conversion',
      keyOutcomes: [
        {
          title: 'Live Interactive Demos',
          description: 'Showcase live working prototypes directly in the browser.',
        },
        {
          title: 'Client Video Testimonials',
          description: 'Clean video cards highlighting real client feedback.',
        },
        {
          title: 'Instant Mobile Sharing',
          description: 'Looks immaculate when opened on an executive’s phone.',
        },
      ],
    },
  ],
  'web-applications': [
    {
      id: 'speed-latency',
      tabLabel: 'Speed & Scale',
      headline: '42ms Global API Response Time',
      subheadline: 'High-performance web architecture that never slows down',
      before: {
        label: 'Traditional Backend',
        value: '850ms Latency',
        numeric: 75,
        note: 'Noticeable delay when clicking buttons or submitting data',
      },
      after: {
        label: 'Spanyx Edge System',
        value: '42ms Latency',
        numeric: 10,
        note: 'Instant, optimistic UI updates that feel as fast as a desktop app',
      },
      highlightDelta: '20x faster response time',
      keyOutcomes: [
        {
          title: '25,000+ Concurrent Users',
          description: 'Engineered to handle sudden traffic spikes without crashing.',
        },
        {
          title: 'Real-Time Sync',
          description: 'Live multi-user updates without needing to refresh the page.',
        },
        {
          title: 'Offline Resilience',
          description: 'Gracefully saves user progress even during spotty internet.',
        },
      ],
    },
    {
      id: 'task-completion',
      tabLabel: 'User Experience',
      headline: '96% Workflow Completion Rate',
      subheadline: 'Clean user interfaces that people can use without training',
      before: {
        label: 'Complex Legacy App',
        value: '54% Completion',
        numeric: 45,
        note: 'Users getting confused and abandoning forms halfway through',
      },
      after: {
        label: 'Spanyx Designed App',
        value: '96% Completion',
        numeric: 96,
        note: 'Step-by-step guidance, clear validation, and intuitive design',
      },
      highlightDelta: '+77% completed workflows',
      keyOutcomes: [
        {
          title: 'Fewer Support Tickets',
          description: 'Clear inline error messages resolve confusion immediately.',
        },
        {
          title: 'Zero Training Required',
          description: 'New employees or customers get productive on day one.',
        },
        {
          title: 'Dark / Light Themes',
          description: 'Comfortable to use for hours without eye fatigue.',
        },
      ],
    },
  ],
  'trading-fintech-platforms': [
    {
      id: 'execution-speed',
      tabLabel: 'Execution Speed',
      headline: '16ms Order Execution Speed',
      subheadline: 'Sub-tick precision built for high-frequency financial platforms',
      before: {
        label: 'Standard Broker Portal',
        value: '260ms Latency',
        numeric: 75,
        note: 'Price slippage and delays during fast-moving market hours',
      },
      after: {
        label: 'Spanyx FinTech Engine',
        value: '16ms Execution',
        numeric: 8,
        note: 'Instant order routing and live WebSocket trade execution',
      },
      highlightDelta: '16x faster order execution',
      keyOutcomes: [
        {
          title: 'Zero Price Slippage',
          description: 'Executes trades at the exact price point clicked.',
        },
        {
          title: '120k Ticks / Second',
          description: 'High-throughput stream processing with zero dropped packets.',
        },
        {
          title: 'Bank-Grade Security',
          description: 'AES-256 encryption with multi-factor session validation.',
        },
      ],
    },
    {
      id: 'uptime',
      tabLabel: 'Platform Uptime',
      headline: '99.999% Five-Nines System Reliability',
      subheadline: 'Zero trading halts even during record market volatility spikes',
      before: {
        label: 'Legacy Gateway',
        value: 'Periodic Downtime',
        numeric: 35,
        note: 'Disconnections and frozen screens when volume spikes',
      },
      after: {
        label: 'Spanyx Resilient Grid',
        value: '99.999% Uptime',
        numeric: 99.9,
        note: 'Redundant multi-region failover nodes with instant recovery',
      },
      highlightDelta: '99.999% live uptime',
      keyOutcomes: [
        {
          title: 'Zero Market Halts',
          description: 'Reliable trading access when customers need it most.',
        },
        {
          title: 'Real-Time Portfolio Risk',
          description: 'Calculates margin and risk exposure every millisecond.',
        },
        {
          title: 'Full Audit Compliance',
          description: 'Complete regulatory reporting logs generated automatically.',
        },
      ],
    },
  ],
};

interface ImpactPerformanceGraphProps {
  categorySlug: string;
}

export default function ImpactPerformanceGraph({
  categorySlug,
}: ImpactPerformanceGraphProps) {
  const metrics = CATEGORY_DATA[categorySlug] || CATEGORY_DATA['erp-solutions'];
  const [activeTab, setActiveTab] = useState(0);

  const current = metrics[activeTab] || metrics[0];

  return (
    <div className="spx-impact-card">
      {/* Top Navigation Tabs */}
      <div className="spx-impact-tabs-bar">
        <div className="spx-impact-tabs-list" role="tablist">
          {metrics.map((item, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`spx-impact-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>

        <span className="spx-impact-delta-pill">
          {current.highlightDelta}
        </span>
      </div>

      {/* Main Headline & Subheadline */}
      <div className="spx-impact-main-heading">
        <h3 className="spx-impact-title">{current.headline}</h3>
        <p className="spx-impact-subtitle">{current.subheadline}</p>
      </div>

      {/* Visual Comparison: Previous Approach vs. With Spanyx */}
      <div className="spx-comparison-grid">
        {/* Previous Approach Column */}
        <div className="spx-comparison-col is-before">
          <div className="spx-col-header">
            <span className="spx-col-tag is-before-tag">Previous Approach</span>
            <span className="spx-col-val is-before-val">{current.before.value}</span>
          </div>

          <div className="spx-progress-track">
            <div
              className="spx-progress-fill is-before-fill"
              style={{ width: `${current.before.numeric}%` }}
            />
          </div>

          <p className="spx-col-note">{current.before.note}</p>
        </div>

        {/* With Spanyx Column */}
        <div className="spx-comparison-col is-after">
          <div className="spx-col-header">
            <span className="spx-col-tag is-after-tag">With Spanyx</span>
            <span className="spx-col-val is-after-val">{current.after.value}</span>
          </div>

          <div className="spx-progress-track">
            <div
              className="spx-progress-fill is-after-fill"
              style={{ width: `${current.after.numeric}%` }}
            />
          </div>

          <p className="spx-col-note">{current.after.note}</p>
        </div>
      </div>

      {/* 3 Meaningful Real-World Deliverable Highlights */}
      <div className="spx-outcomes-grid">
        {current.keyOutcomes.map((outcome) => (
          <div key={outcome.title} className="spx-outcome-item">
            <div className="spx-outcome-icon-wrap">
              <svg
                width="16"
                height="16"
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
            </div>
            <div className="spx-outcome-text">
              <h4 className="spx-outcome-title">{outcome.title}</h4>
              <p className="spx-outcome-desc">{outcome.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
