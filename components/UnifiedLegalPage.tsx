'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const PRIVACY_SECTIONS: LegalSectionItem[] = [
  { id: 'privacy-introduction', title: '1. Introduction & Scope' },
  { id: 'privacy-info-collect', title: '2. Information We Collect' },
  { id: 'privacy-how-use', title: '3. How We Use Information' },
  { id: 'privacy-cookies', title: '4. Cookies & First-Party Analytics' },
  { id: 'privacy-security', title: '5. Storage, Security & Retention' },
  { id: 'privacy-sharing', title: '6. Third-Party Service Providers' },
  { id: 'privacy-rights', title: '7. Your Privacy Rights' },
  { id: 'privacy-children', title: '8. Children’s Privacy' },
  { id: 'privacy-updates', title: '9. Updates to this Policy' },
  { id: 'privacy-contact', title: '10. Contact Us' },
];

const TERMS_SECTIONS: LegalSectionItem[] = [
  { id: 'terms-acceptance', title: '1. Acceptance of Terms' },
  { id: 'terms-contracts', title: '2. Website Terms vs. Client Contracts' },
  { id: 'terms-ip', title: '3. Intellectual Property' },
  { id: 'terms-acceptable-use', title: '4. Acceptable Conduct' },
  { id: 'terms-prohibited', title: '5. Prohibited Activities' },
  { id: 'terms-inquiries', title: '6. Inquiries & Project Estimates' },
  { id: 'terms-payments', title: '7. Commercial Terms & Payments' },
  { id: 'terms-confidentiality', title: '8. Confidentiality' },
  { id: 'terms-third-party', title: '9. Third-Party Links' },
  { id: 'terms-disclaimer', title: '10. Disclaimer of Warranties' },
  { id: 'terms-liability', title: '11. Limitation of Liability' },
  { id: 'terms-governing-law', title: '12. Governing Law' },
  { id: 'terms-updates', title: '13. Updates & Contact' },
];

interface UnifiedLegalPageProps {
  initialTab: 'privacy' | 'terms';
}

export default function UnifiedLegalPage({ initialTab }: UnifiedLegalPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);
  const [isCrossFading, setIsCrossFading] = useState(false);
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  const handleSelectTab = (newTab: 'privacy' | 'terms') => {
    if (newTab === activeTab) return;

    // Smooth Apple-like cross-fade without page reload
    setIsCrossFading(true);
    setTimeout(() => {
      setActiveTab(newTab);
      const newUrl = newTab === 'privacy' ? '/privacy-policy' : '/terms-and-conditions';
      window.history.pushState({ tab: newTab }, '', newUrl);
      document.title =
        newTab === 'privacy'
          ? 'Privacy Policy — SPANYX'
          : 'Terms & Conditions — SPANYX';
      setIsCrossFading(false);
    }, 120);
  };

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('terms')) {
        setActiveTab('terms');
      } else {
        setActiveTab('privacy');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const currentSections = activeTab === 'privacy' ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const currentTitle = activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
  const currentSubtitle =
    activeTab === 'privacy'
      ? 'How Spanyx handles personal information when you browse our website, explore our engineering solutions, or reach out to our team.'
      : 'These terms outline the rules and expectations for visiting the Spanyx website and communicating with our team.';

  return (
    <div className="legal-page">
      {/* 1. TOP HEADER (Permanent, stable, zero flicker, no logo, centered back button) */}
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
            HERO SECTION WITH LIQUID GLASS SLIDER
            ============================================================ */}
        <section className="legal-hero-section">
          <div className="legal-container">
            <div className="legal-hero-header">
              <div
                className={`legal-hero-text-wrap ${
                  isCrossFading ? 'is-fading-out' : 'is-fading-in'
                }`}
              >
                <h1 className="legal-title">{currentTitle}</h1>
                <p className="legal-subtitle">{currentSubtitle}</p>
              </div>

              {/* Liquid Glass Interactive Draggable Slider */}
              <LiquidGlassLegalTabs
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            LEGAL CONTENT CONTAINER (100% Smooth Cross-Fade Transition)
            ============================================================ */}
        <section className="legal-content-section">
          <div className="legal-article-container">
            {/* Quick Section Navigation Jump Bar */}
            <nav
              className={`legal-jump-bar ${
                isCrossFading ? 'is-fading-out' : 'is-fading-in'
              }`}
              aria-label="Quick Section Navigation"
            >
              <span className="legal-jump-label">JUMP TO:</span>
              <div className="legal-jump-links">
                {currentSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="legal-jump-link"
                    onClick={(e) => handleJumpToSection(e, sec.id)}
                  >
                    {sec.title.replace(/^\d+\.\s*/, '')}
                  </a>
                ))}
              </div>
            </nav>

            {/* Document Body with Smooth Fade Switcher */}
            <article
              className={`legal-body legal-smooth-content ${
                isCrossFading ? 'is-fading-out' : 'is-fading-in'
              }`}
              role="document"
            >
              {activeTab === 'privacy' ? (
                <div key="privacy-doc">
                  {/* 01. Introduction & Scope */}
                  <section id="privacy-introduction" className="legal-section">
                    <h2 className="legal-section-title">1. Introduction &amp; Scope</h2>
                    <div className="legal-section-body">
                      <p>
                        Spanyx (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides custom
                        software engineering, enterprise platforms, and digital systems. We are
                        committed to handling personal information transparently and with care.
                      </p>
                      <p>
                        This Privacy Policy describes how we collect, process, and safeguard
                        information gathered through our website (<code>spanyx.in</code>) and
                        inbound business inquiry channels. It applies to website visitors and
                        representatives of prospective clients who contact us.
                      </p>
                      <div className="legal-callout">
                        <p className="legal-callout-text">
                          <strong>Contracted Client Services:</strong> Bespoke software
                          engineering deliverables, client source code, production data, and
                          confidential technical specifications for active enterprise clients are
                          governed strictly by separate, mutually executed Master Services
                          Agreements (MSAs), Statements of Work (SOWs), and dedicated Data
                          Protection Addenda.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 02. Information We Collect */}
                  <section id="privacy-info-collect" className="legal-section">
                    <h2 className="legal-section-title">2. Information We Collect</h2>
                    <div className="legal-section-body">
                      <p>
                        We collect only the information necessary to evaluate your project needs,
                        communicate with you, and operate our website reliably.
                      </p>
                      <h3 className="legal-subheading">Information You Provide Voluntarily</h3>
                      <p>
                        When you submit an inquiry through our contact form, meeting scheduler,
                        or direct email, we may collect:
                      </p>
                      <ul className="legal-list">
                        <li><strong>Contact Details:</strong> Your full name and business email address.</li>
                        <li><strong>Organization Information:</strong> Company or institution name, website URL, team size, and industry.</li>
                        <li><strong>Professional Details:</strong> Job designation or role, and phone number (if provided).</li>
                        <li><strong>Project Specifications:</strong> Services of interest, estimated budget range, technical descriptions, and message notes.</li>
                      </ul>
                      <h3 className="legal-subheading">Information Collected Automatically</h3>
                      <p>
                        When you browse our website, our servers and first-party analytics system
                        record standard technical telemetry:
                      </p>
                      <ul className="legal-list">
                        <li><strong>Device &amp; Browser Data:</strong> Browser version, operating system, device category, and screen resolution.</li>
                        <li><strong>Usage Activity:</strong> Visited pages, time spent per page, referring website URL, and campaign attribution parameters (UTM tags).</li>
                        <li><strong>Network Identifiers:</strong> Your IP address is processed for routing; however, for analytics tracking, IP addresses are cryptographically hashed with a salt so that raw IP addresses are not stored in our analytics database.</li>
                      </ul>
                      <p>
                        We do not collect sensitive personal data—such as financial account
                        credentials, government identification numbers, or biometric records—through
                        our public website.
                      </p>
                    </div>
                  </section>

                  {/* 03. How We Use Information */}
                  <section id="privacy-how-use" className="legal-section">
                    <h2 className="legal-section-title">3. How We Use Information</h2>
                    <div className="legal-section-body">
                      <p>We use collected information solely for legitimate operational and business purposes:</p>
                      <ul className="legal-list">
                        <li><strong>Inquiry Response &amp; Scoping:</strong> Reviewing your project requirements to prepare architecture recommendations, feasibility feedback, and commercial proposals.</li>
                        <li><strong>Business Communications:</strong> Corresponding with you regarding scheduling discussions, exploratory calls, or project follow-ups.</li>
                        <li><strong>Website Performance &amp; Security:</strong> Monitoring platform uptime, analyzing aggregated visitor flow, and preventing malicious traffic, spam submissions, or denial-of-service attempts.</li>
                        <li><strong>Internal Quality &amp; Qualification:</strong> Evaluating incoming lead fit to route inquiries to the appropriate technical lead.</li>
                        <li><strong>Legal Compliance:</strong> Satisfying applicable accounting, audit, and legal recordkeeping requirements.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 04. Cookies, Consent & Visitor Tracking */}
                  <section id="privacy-cookies" className="legal-section">
                    <h2 className="legal-section-title">4. Cookies &amp; First-Party Analytics</h2>
                    <div className="legal-section-body">
                      <p>
                        Our website uses first-party cookies and session storage mechanisms designed
                        with privacy in mind:
                      </p>
                      <ul className="legal-list">
                        <li><strong>Essential &amp; Functional Cookies:</strong> Required to maintain secure browsing sessions, preserve user interface states, and manage interactive components like our contact overlay.</li>
                        <li><strong>First-Party Analytics:</strong> We operate an in-house analytics service to evaluate site performance and content engagement. Unlike third-party advertising networks, our analytics do not track your activity across unrelated websites.</li>
                        <li><strong>Consent Management:</strong> An on-site cookie banner allows you to review and customize your preferences for functional and analytics cookies. Your choices are recorded alongside a timestamped, pseudonymous audit record.</li>
                        <li><strong>No Third-Party Advertising Pixels:</strong> We do not deploy cross-site retargeting pixels, behavioral ad beacons, or data broker scripts on <code>spanyx.in</code>.</li>
                      </ul>
                      <p>
                        You can also modify or block cookies at any time through your web browser
                        settings.
                      </p>
                    </div>
                  </section>

                  {/* 05. Storage, Security & Retention */}
                  <section id="privacy-security" className="legal-section">
                    <h2 className="legal-section-title">5. Storage, Security &amp; Retention</h2>
                    <div className="legal-section-body">
                      <p>
                        We apply industry-standard technical and organizational security controls to
                        safeguard collected data:
                      </p>
                      <ul className="legal-list">
                        <li>All communications between your browser and our servers are encrypted using modern Transport Layer Security (HTTPS/TLS).</li>
                        <li>Inquiry data and analytics records are stored in access-controlled databases protected by firewalls and strict authentication protocols.</li>
                        <li>Network IP addresses in visitor tracking tables are cryptographically hashed using SHA-256.</li>
                      </ul>
                      <p>
                        We retain voluntary inquiry records for the duration of our business
                        correspondence and project scoping. Inquiries that do not lead to an active
                        commercial engagement are retained only as long as necessary for business
                        records and are securely deleted upon request.
                      </p>
                    </div>
                  </section>

                  {/* 06. Third-Party Service Providers */}
                  <section id="privacy-sharing" className="legal-section">
                    <h2 className="legal-section-title">6. Third-Party Service Providers</h2>
                    <div className="legal-section-body">
                      <p>
                        <strong>We do not sell, rent, trade, or monetize your personal information under any circumstance.</strong>
                      </p>
                      <p>We share information only with trusted service providers strictly necessary to operate our website and services:</p>
                      <ul className="legal-list">
                        <li><strong>Infrastructure &amp; Hosting:</strong> Reputable cloud hosting and content delivery network (CDN) providers that host our website files, server infrastructure, and databases securely.</li>
                        <li><strong>AI Requirement Processing (Google Gemini API):</strong> Voluntarily submitted project descriptions may be processed server-side via Google Gemini API to assist our engineering team in summarizing technical specifications. No customer data is shared with public ad exchanges or used to train third-party public models.</li>
                        <li><strong>Legal &amp; Regulatory Mandates:</strong> If required by applicable law, lawful judicial process, or statutory disclosure obligations issued by a competent governmental authority in India.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 07. Your Privacy Rights */}
                  <section id="privacy-rights" className="legal-section">
                    <h2 className="legal-section-title">7. Your Privacy Rights</h2>
                    <div className="legal-section-body">
                      <p>
                        Under applicable Indian data protection principles, including the Information
                        Technology Act and the Digital Personal Data Protection Act framework, you
                        have rights regarding your personal information:
                      </p>
                      <ul className="legal-list">
                        <li><strong>Access:</strong> You may request confirmation of whether we hold personal information about you and receive a copy of that information.</li>
                        <li><strong>Correction:</strong> You may request that we rectify inaccurate or incomplete contact records.</li>
                        <li><strong>Erasure:</strong> You may request the deletion of inquiry information you previously submitted through our website.</li>
                        <li><strong>Consent Withdrawal:</strong> You may update your cookie preferences or withdraw consent for non-essential data collection at any time.</li>
                      </ul>
                      <p>
                        To exercise any of these rights, please contact us via our website contact
                        form or email <code>contact@spanyx.in</code>. We will verify and process
                        your request in a timely manner.
                      </p>
                    </div>
                  </section>

                  {/* 08. Children’s Privacy */}
                  <section id="privacy-children" className="legal-section">
                    <h2 className="legal-section-title">8. Children’s Privacy</h2>
                    <div className="legal-section-body">
                      <p>
                        The Spanyx website and software engineering services are intended exclusively
                        for business organizations, institutions, and working professionals. We do
                        not knowingly solicit or collect personal information from individuals under
                        18 years of age. If you believe a minor has submitted information to us, please
                        notify us immediately so we can remove the data.
                      </p>
                    </div>
                  </section>

                  {/* 09. Policy Updates */}
                  <section id="privacy-updates" className="legal-section">
                    <h2 className="legal-section-title">9. Updates to this Policy</h2>
                    <div className="legal-section-body">
                      <p>
                        We may update this Privacy Policy periodically to reflect technical,
                        operational, or regulatory updates. Any changes will be published directly on
                        this page with a revised effective date. Continued use of our website
                        constitutes acknowledgment of the updated policy.
                      </p>
                    </div>
                  </section>

                  {/* 10. Contact Us */}
                  <section id="privacy-contact" className="legal-section">
                    <h2 className="legal-section-title">10. Contact Us</h2>
                    <div className="legal-section-body">
                      <p>
                        If you have questions, feedback, or data requests regarding this Privacy Policy,
                        please reach out to us:
                      </p>
                      <ul className="legal-list">
                        <li><strong>Email:</strong> <code>contact@spanyx.in</code></li>
                        <li><strong>Website:</strong> Interactive Contact Form on <code>spanyx.in</code></li>
                        <li><strong>Entity:</strong> Spanyx (India)</li>
                      </ul>
                    </div>
                  </section>
                </div>
              ) : (
                <div key="terms-doc">
                  {/* 01. Acceptance of Terms */}
                  <section id="terms-acceptance" className="legal-section">
                    <h2 className="legal-section-title">1. Acceptance of Terms</h2>
                    <div className="legal-section-body">
                      <p>
                        By visiting, browsing, or interacting with the Spanyx website (
                        <code>spanyx.in</code>), you agree to comply with and be bound by these
                        Terms &amp; Conditions and our Privacy Policy. If you do not agree with any
                        part of these terms, please discontinue using the website.
                      </p>
                      <p>
                        This website serves as an informational platform presenting Spanyx&apos;s
                        software engineering capabilities, technical architecture solutions, and
                        portfolio work.
                      </p>
                    </div>
                  </section>

                  {/* 02. Website Terms vs. Client Contracts */}
                  <section id="terms-contracts" className="legal-section">
                    <h2 className="legal-section-title">2. Website Terms vs. Client Contracts</h2>
                    <div className="legal-section-body">
                      <p>
                        Browsing this website or submitting an exploratory message through our contact
                        channels does not establish a formal client relationship or obligate Spanyx
                        to deliver engineering services.
                      </p>
                      <div className="legal-callout">
                        <p className="legal-callout-text">
                          <strong>Bespoke Client Agreements:</strong> All commercial software
                          development, system architectures, technical milestones, deliverable
                          acceptance criteria, and ongoing support are governed exclusively by
                          separate, mutually executed written contracts, such as Master Services
                          Agreements (MSAs) and Statements of Work (SOWs).
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 03. Intellectual Property */}
                  <section id="terms-ip" className="legal-section">
                    <h2 className="legal-section-title">3. Intellectual Property</h2>
                    <div className="legal-section-body">
                      <p>
                        All content on this website—including text, graphics, logos, user interface
                        designs, code samples, illustrations, and brand assets—is the intellectual
                        property of Spanyx or utilized under permission. It is protected by copyright,
                        trademark, and applicable intellectual property laws.
                      </p>
                      <p>
                        You are granted a limited, revocable license to view and browse the website
                        for evaluating our software capabilities. You may not copy, reproduce,
                        republish, distribute, or reverse-engineer any component of this website
                        without prior written consent from Spanyx.
                      </p>
                      <p>
                        Client project ownership (including proprietary codebases and digital assets
                        delivered under commercial contract) is established within each client&apos;s
                        individual agreement. Third-party trademarks referenced on this website
                        belong to their respective owners and are displayed strictly for factual
                        portfolio and identification purposes.
                      </p>
                    </div>
                  </section>

                  {/* 04. Acceptable Conduct */}
                  <section id="terms-acceptable-use" className="legal-section">
                    <h2 className="legal-section-title">4. Acceptable Conduct</h2>
                    <div className="legal-section-body">
                      <p>When accessing or communicating through this website, you agree to:</p>
                      <ul className="legal-list">
                        <li>Comply with all applicable local, national, and international laws.</li>
                        <li>Provide accurate, truthful contact and business details when inquiring about prospective projects.</li>
                        <li>Use communication channels exclusively for legitimate commercial, professional, or technical discussions.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 05. Prohibited Activities */}
                  <section id="terms-prohibited" className="legal-section">
                    <h2 className="legal-section-title">5. Prohibited Activities</h2>
                    <div className="legal-section-body">
                      <p>You agree not to engage in any of the following prohibited actions:</p>
                      <ul className="legal-list">
                        <li>Probing, scanning, or testing the vulnerability of our website, servers, or networks without authorization.</li>
                        <li>Injecting malware, viruses, worms, Trojan horses, or any malicious code.</li>
                        <li>Deploying automated scraping engines, data-mining bots, or denial-of-service tools against our infrastructure.</li>
                        <li>Submitting spam, abusive, fraudulent, or unsolicited promotional messages through our contact dialogs.</li>
                        <li>Impersonating another person, organization, or Spanyx team member in communications.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 06. Inquiries & Project Estimates */}
                  <section id="terms-inquiries" className="legal-section">
                    <h2 className="legal-section-title">6. Inquiries &amp; Project Estimates</h2>
                    <div className="legal-section-body">
                      <p>
                        Submitting an inquiry through our contact form allows our team to review your
                        software requirements and initiate exploratory dialogue.
                      </p>
                      <ul className="legal-list">
                        <li>Spanyx reserves the right to review, prioritize, and respond to incoming inquiries at its professional discretion.</li>
                        <li>Preliminary discussions, technical feasibility comments, turnaround timelines, or ballpark estimates provided prior to contracting are non-binding and indicative only until formally specified in a signed Statement of Work.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 07. Commercial Terms & Payments */}
                  <section id="terms-payments" className="legal-section">
                    <h2 className="legal-section-title">7. Commercial Terms &amp; Payments</h2>
                    <div className="legal-section-body">
                      <p>
                        The Spanyx website (<code>spanyx.in</code>) operates as an informational portfolio
                        and inquiry portal. It does not process public e-commerce transactions, consumer
                        purchases, or automated payment processing.
                      </p>
                      <p>
                        All commercial terms—including project pricing structures, payment milestone
                        schedules, invoicing terms, currency, taxes, deliverable acceptance criteria,
                        and cancellation or refund provisions—are governed exclusively by the mutually
                        signed Master Services Agreement (MSA) or Statement of Work (SOW) executed
                        between Spanyx and the client.
                      </p>
                    </div>
                  </section>

                  {/* 08. Confidentiality */}
                  <section id="terms-confidentiality" className="legal-section">
                    <h2 className="legal-section-title">8. Confidentiality</h2>
                    <div className="legal-section-body">
                      <p>
                        We treat proprietary project briefs, architectural concepts, and business
                        details shared by prospective clients with professional care and discretion.
                      </p>
                      <p>
                        For technical reviews requiring the exchange of proprietary source code,
                        internal schemas, or confidential datasets, Spanyx executes formal bilateral
                        Non-Disclosure Agreements (NDAs) prior to detailed discovery.
                      </p>
                    </div>
                  </section>

                  {/* 09. Third-Party Links */}
                  <section id="terms-third-party" className="legal-section">
                    <h2 className="legal-section-title">9. Third-Party Links</h2>
                    <div className="legal-section-body">
                      <p>
                        Our website may contain links to third-party websites, open-source repositories,
                        or external resources for informational context. Spanyx does not control,
                        endorse, or accept responsibility for the content, security, or practices of
                        third-party sites.
                      </p>
                    </div>
                  </section>

                  {/* 10. Disclaimer of Warranties */}
                  <section id="terms-disclaimer" className="legal-section">
                    <h2 className="legal-section-title">10. Disclaimer of Warranties</h2>
                    <div className="legal-section-body">
                      <p>
                        This website and its content are provided on an &quot;as is&quot; and &quot;as
                        available&quot; basis, without warranties of any kind, either express or
                        implied.
                      </p>
                      <p>
                        While we take reasonable steps to maintain accurate, up-to-date information and
                        secure platform performance, Spanyx does not warrant that the website will
                        operate without interruption, delay, or technical errors at all times.
                      </p>
                    </div>
                  </section>

                  {/* 11. Limitation of Liability */}
                  <section id="terms-liability" className="legal-section">
                    <h2 className="legal-section-title">11. Limitation of Liability</h2>
                    <div className="legal-section-body">
                      <p>
                        To the fullest extent permitted by applicable law, Spanyx and its directors,
                        engineers, and representatives shall not be liable for any indirect,
                        incidental, punitive, or consequential damages resulting from your access to,
                        use of, or inability to access this website.
                      </p>
                    </div>
                  </section>

                  {/* 12. Governing Law */}
                  <section id="terms-governing-law" className="legal-section">
                    <h2 className="legal-section-title">12. Governing Law</h2>
                    <div className="legal-section-body">
                      <p>
                        These Terms &amp; Conditions are governed by and construed in accordance with
                        the laws of India. Any disputes arising out of or in connection with your use
                        of this website shall be subject to the exclusive jurisdiction of the competent
                        courts in India.
                      </p>
                    </div>
                  </section>

                  {/* 13. Updates & Contact */}
                  <section id="terms-updates" className="legal-section">
                    <h2 className="legal-section-title">13. Updates &amp; Contact</h2>
                    <div className="legal-section-body">
                      <p>
                        Spanyx reserves the right to amend these Terms &amp; Conditions periodically.
                        Revised terms will be posted directly on this page.
                      </p>
                      <p>
                        If you have questions regarding these terms, please contact us at{' '}
                        <code>contact@spanyx.in</code> or submit an inquiry through our on-site
                        contact form.
                      </p>
                    </div>
                  </section>
                </div>
              )}
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

