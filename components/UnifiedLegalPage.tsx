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
  { id: 'privacy-introduction', title: '1. Introduction' },
  { id: 'privacy-info-collect', title: '2. Information We Collect' },
  { id: 'privacy-how-use', title: '3. How We Use Information' },
  { id: 'privacy-cookies', title: '4. Cookies & Analytics' },
  { id: 'privacy-sharing', title: '5. Data Sharing' },
  { id: 'privacy-security', title: '6. Security & Retention' },
  { id: 'privacy-rights', title: '7. Your Rights' },
  { id: 'privacy-children', title: '8. Children’s Privacy' },
  { id: 'privacy-updates', title: '9. Updates to this Policy' },
  { id: 'privacy-contact', title: '10. Contact Us' },
];

const TERMS_SECTIONS: LegalSectionItem[] = [
  { id: 'terms-acceptance', title: '1. Acceptance of Terms' },
  { id: 'terms-contracts', title: '2. Website Terms vs. Client Contracts' },
  { id: 'terms-ip', title: '3. Intellectual Property' },
  { id: 'terms-acceptable-use', title: '4. Acceptable Use' },
  { id: 'terms-prohibited', title: '5. Prohibited Activities' },
  { id: 'terms-inquiries', title: '6. Inquiries & Estimates' },
  { id: 'terms-confidentiality', title: '7. Confidentiality' },
  { id: 'terms-third-party', title: '8. Third-Party Links' },
  { id: 'terms-disclaimer', title: '9. Disclaimer of Warranties' },
  { id: 'terms-liability', title: '10. Limitation of Liability' },
  { id: 'terms-governing-law', title: '11. Governing Law' },
  { id: 'terms-updates', title: '12. Updates & Contact' },
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
                  {/* 01. Introduction */}
                  <section id="privacy-introduction" className="legal-section">
                    <h2 className="legal-section-title">1. Introduction</h2>
                    <div className="legal-section-body">
                      <p>
                        Spanyx (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides
                        custom software engineering, enterprise systems, and digital
                        solutions. We respect your privacy and are committed to handling
                        personal information responsibly and transparently.
                      </p>
                      <p>
                        This Privacy Policy explains how we collect, use, and protect
                        information collected through our website (<code>spanyx.in</code>)
                        and general communication channels. It applies to website visitors
                        and individuals who contact us regarding prospective software
                        projects.
                      </p>
                      <div className="legal-callout">
                        <p className="legal-callout-text">
                          <strong>Client Engagements:</strong> Commercial software development
                          services, technical deliverables, and customer data processing for
                          contracted clients are governed by separate, mutually executed
                          service agreements and project contracts.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 02. Information We Collect */}
                  <section id="privacy-info-collect" className="legal-section">
                    <h2 className="legal-section-title">2. Information We Collect</h2>
                    <div className="legal-section-body">
                      <p>
                        We collect only the information necessary to respond to your
                        inquiries, discuss potential software requirements, and maintain the
                        operation of our website.
                      </p>
                      <h3 className="legal-subheading">Information You Provide Voluntarily</h3>
                      <p>
                        When you reach out to us using our contact form or email, you may
                        provide:
                      </p>
                      <ul className="legal-list">
                        <li>Your full name and work email address.</li>
                        <li>Your company or organization name and website.</li>
                        <li>Company size or team details.</li>
                        <li>Project descriptions, technical requirements, or messages.</li>
                      </ul>
                      <h3 className="legal-subheading">Information Collected Automatically</h3>
                      <p>
                        When you browse our website, standard technical and usage data may
                        be logged automatically, including:
                      </p>
                      <ul className="legal-list">
                        <li>Browser type, device category, and operating system.</li>
                        <li>Pages viewed, referral source, and timestamps.</li>
                        <li>
                          IP address and general regional location derived from network
                          routing.
                        </li>
                      </ul>
                      <p>
                        We do not collect sensitive personal data (such as financial account
                        credentials, biometric records, or government ID numbers) through our
                        public website.
                      </p>
                    </div>
                  </section>

                  {/* 03. How We Use Information */}
                  <section id="privacy-how-use" className="legal-section">
                    <h2 className="legal-section-title">3. How We Use Information</h2>
                    <div className="legal-section-body">
                      <p>We use the information we collect for straightforward business purposes:</p>
                      <ul className="legal-list">
                        <li>To respond to your inquiries and discuss potential projects.</li>
                        <li>To prepare engineering proposals, scoping estimates, or follow-ups.</li>
                        <li>To monitor, secure, and maintain the performance of our website.</li>
                        <li>To prevent spam, abuse, or unauthorized access to our systems.</li>
                        <li>To comply with applicable legal or regulatory obligations.</li>
                      </ul>
                    </div>
                  </section>

                  {/* 04. Cookies & Analytics */}
                  <section id="privacy-cookies" className="legal-section">
                    <h2 className="legal-section-title">4. Cookies &amp; Analytics</h2>
                    <div className="legal-section-body">
                      <p>
                        Our website uses basic functional cookies and technical session
                        tools necessary to display pages properly and support interactive
                        components (such as contact dialogs).
                      </p>
                      <p>
                        We may use privacy-conscious analytics to measure aggregated website
                        traffic, popular pages, and performance metrics. These tools do not
                        build individual advertising profiles. You can manage or disable
                        cookies at any time through your web browser preferences.
                      </p>
                    </div>
                  </section>

                  {/* 05. Data Sharing */}
                  <section id="privacy-sharing" className="legal-section">
                    <h2 className="legal-section-title">5. Data Sharing</h2>
                    <div className="legal-section-body">
                      <p>
                        <strong>We do not sell, rent, or trade your personal information.</strong>
                      </p>
                      <p>We share information only in limited and necessary circumstances:</p>
                      <ul className="legal-list">
                        <li>
                          <strong>Hosting &amp; Infrastructure Providers:</strong> Trusted
                          cloud hosting and infrastructure providers that assist in running
                          and delivering our website securely.
                        </li>
                        <li>
                          <strong>Legal Requirements:</strong> If required to do so by
                          applicable law, regulation, subpoena, or lawful request by public
                          authorities.
                        </li>
                        <li>
                          <strong>Business Transfers:</strong> In connection with any
                          reorganization, merger, or transfer of company assets, where the
                          acquiring party agrees to respect this privacy policy.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* 06. Security & Retention */}
                  <section id="privacy-security" className="legal-section">
                    <h2 className="legal-section-title">6. Security &amp; Retention</h2>
                    <div className="legal-section-body">
                      <p>
                        We implement appropriate technical and organizational safeguards to
                        protect submitted information against unauthorized access, loss, or
                        misuse. While we take reasonable steps to secure communications, no
                        method of internet transmission is completely invulnerable.
                      </p>
                      <p>
                        We retain contact information for as long as needed to fulfill your
                        inquiry, conduct business correspondence, or satisfy lawful
                        recordkeeping obligations. When information is no longer needed, it is
                        securely deleted or removed from active systems.
                      </p>
                    </div>
                  </section>

                  {/* 07. Your Rights */}
                  <section id="privacy-rights" className="legal-section">
                    <h2 className="legal-section-title">7. Your Rights</h2>
                    <div className="legal-section-body">
                      <p>
                        Under applicable Indian laws, including the Information Technology
                        Act and the digital data protection framework, you have rights
                        concerning your personal information:
                      </p>
                      <ul className="legal-list">
                        <li>You may request details on the information we hold about you.</li>
                        <li>You may request corrections to inaccurate or outdated details.</li>
                        <li>
                          You may request that we delete information you previously submitted.
                        </li>
                      </ul>
                      <p>
                        To submit a request, simply reach out to us using the contact form on
                        our website. We will review and address your request promptly.
                      </p>
                    </div>
                  </section>

                  {/* 08. Children’s Privacy */}
                  <section id="privacy-children" className="legal-section">
                    <h2 className="legal-section-title">8. Children’s Privacy</h2>
                    <div className="legal-section-body">
                      <p>
                        Our website and technology solutions are designed for commercial
                        enterprises, academic organizations, and working professionals. We do
                        not knowingly collect personal information from children under 18
                        years of age. If you believe a minor has provided information to us,
                        please contact us so we can delete it.
                      </p>
                    </div>
                  </section>

                  {/* 09. Updates to this Policy */}
                  <section id="privacy-updates" className="legal-section">
                    <h2 className="legal-section-title">9. Updates to this Policy</h2>
                    <div className="legal-section-body">
                      <p>
                        We may update this Privacy Policy from time to time to reflect changes
                        in our operations, technology, or legal requirements. When updates are
                        made, the revised version will be published on this page. Your
                        continued use of the website indicates your awareness of the current
                        policy.
                      </p>
                    </div>
                  </section>

                  {/* 10. Contact Us */}
                  <section id="privacy-contact" className="legal-section">
                    <h2 className="legal-section-title">10. Contact Us</h2>
                    <div className="legal-section-body">
                      <p>
                        If you have questions about this Privacy Policy or how your
                        information is handled, please contact Spanyx through our official
                        website contact form.
                      </p>
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
                        By accessing, browsing, or interacting with the Spanyx website (
                        <code>spanyx.in</code>), you agree to be bound by these Terms &amp;
                        Conditions and our Privacy Policy. If you do not agree with any
                        part of these terms, please discontinue using the website.
                      </p>
                      <p>
                        This website provides information about Spanyx, our engineering
                        capabilities, architectural solutions, and portfolio work.
                      </p>
                    </div>
                  </section>

                  {/* 02. Website Terms vs. Client Contracts */}
                  <section id="terms-contracts" className="legal-section">
                    <h2 className="legal-section-title">
                      2. Website Terms vs. Client Contracts
                    </h2>
                    <div className="legal-section-body">
                      <p>
                        Visiting this website or submitting an inquiry through our contact
                        form does not establish a formal client relationship or bind Spanyx
                        to provide engineering services.
                      </p>
                      <div className="legal-callout">
                        <p className="legal-callout-text">
                          <strong>Formal Service Contracts:</strong> All bespoke software
                          engineering, enterprise software licenses, milestone deliveries,
                          and technical support are governed by separate, mutually agreed
                          written contracts, such as Master Services Agreements (MSAs) and
                          Statements of Work (SOWs).
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 03. Intellectual Property */}
                  <section id="terms-ip" className="legal-section">
                    <h2 className="legal-section-title">3. Intellectual Property</h2>
                    <div className="legal-section-body">
                      <p>
                        All content on this website—including text, graphics, logos, user
                        interface designs, code samples, illustrations, and brand assets—is
                        the property of Spanyx or used under permission. It is protected by
                        copyright, trademark, and intellectual property laws.
                      </p>
                      <p>
                        You are granted a limited license to view and browse the website for
                        evaluating our services. You may not copy, reproduce, modify,
                        distribute, or reverse-engineer any content or components of this
                        website without prior written authorization from Spanyx.
                      </p>
                      <p>
                        Third-party company names, logos, or client trademarks referenced on
                        the site belong to their respective owners and are displayed for
                        factual portfolio reference.
                      </p>
                    </div>
                  </section>

                  {/* 04. Acceptable Use */}
                  <section id="terms-acceptable-use" className="legal-section">
                    <h2 className="legal-section-title">4. Acceptable Use</h2>
                    <div className="legal-section-body">
                      <p>When using this website, you agree to:</p>
                      <ul className="legal-list">
                        <li>Comply with all applicable local, national, and international laws.</li>
                        <li>
                          Provide accurate, truthful information when contacting our team.
                        </li>
                        <li>
                          Use communication channels solely for genuine business inquiries and
                          collaborations.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* 05. Prohibited Activities */}
                  <section id="terms-prohibited" className="legal-section">
                    <h2 className="legal-section-title">5. Prohibited Activities</h2>
                    <div className="legal-section-body">
                      <p>You agree not to engage in any of the following activities:</p>
                      <ul className="legal-list">
                        <li>
                          Attempting to probe, scan, or breach the security of our website,
                          servers, or networks.
                        </li>
                        <li>
                          Introducing malware, viruses, worms, or any malicious code.
                        </li>
                        <li>
                          Engaging in automated scraping, data harvesting, or denial-of-service
                          attacks.
                        </li>
                        <li>
                          Submitting spam, abusive, defamatory, or deceptive content through our
                          contact forms.
                        </li>
                        <li>
                          Impersonating another person or entity when communicating with us.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* 06. Inquiries & Estimates */}
                  <section id="terms-inquiries" className="legal-section">
                    <h2 className="legal-section-title">6. Inquiries &amp; Estimates</h2>
                    <div className="legal-section-body">
                      <p>
                        Submitting a message through our &quot;Talk to us&quot; or contact
                        features allows our team to review your software requirements.
                      </p>
                      <ul className="legal-list">
                        <li>
                          Spanyx reserves the right to prioritize and respond to inquiries at
                          its professional discretion.
                        </li>
                        <li>
                          Any preliminary cost estimates, turnaround times, or technical
                          suggestions provided during exploratory talks are indicative and
                          non-binding until confirmed in a written agreement.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* 07. Confidentiality */}
                  <section id="terms-confidentiality" className="legal-section">
                    <h2 className="legal-section-title">7. Confidentiality</h2>
                    <div className="legal-section-body">
                      <p>
                        We treat proprietary business concepts and project briefs shared by
                        prospective clients with professional care and discretion.
                      </p>
                      <p>
                        For projects requiring the exchange of sensitive technical
                        specifications or proprietary datasets, we execute formal
                        bilateral Non-Disclosure Agreements (NDAs) prior to detailed scoping.
                      </p>
                    </div>
                  </section>

                  {/* 08. Third-Party Links */}
                  <section id="terms-third-party" className="legal-section">
                    <h2 className="legal-section-title">8. Third-Party Links</h2>
                    <div className="legal-section-body">
                      <p>
                        Our website may contain links to external websites, open-source
                        documentation, or third-party resources for informational purposes.
                        Spanyx does not control and is not responsible for the content,
                        security, or policies of external sites.
                      </p>
                    </div>
                  </section>

                  {/* 09. Disclaimer of Warranties */}
                  <section id="terms-disclaimer" className="legal-section">
                    <h2 className="legal-section-title">9. Disclaimer of Warranties</h2>
                    <div className="legal-section-body">
                      <p>
                        This website and its content are provided on an &quot;as is&quot; and
                        &quot;as available&quot; basis, without warranties of any kind, whether
                        express or implied.
                      </p>
                      <p>
                        While we strive to keep information accurate and up to date, Spanyx
                        does not warrant that the website will always be error-free,
                        uninterrupted, or free from server glitches.
                      </p>
                    </div>
                  </section>

                  {/* 10. Limitation of Liability */}
                  <section id="terms-liability" className="legal-section">
                    <h2 className="legal-section-title">10. Limitation of Liability</h2>
                    <div className="legal-section-body">
                      <p>
                        To the fullest extent permitted by applicable law, Spanyx and its
                        representatives shall not be liable for any indirect, incidental, or
                        consequential damages arising from your access to, use of, or
                        inability to use this website.
                      </p>
                    </div>
                  </section>

                  {/* 11. Governing Law */}
                  <section id="terms-governing-law" className="legal-section">
                    <h2 className="legal-section-title">11. Governing Law</h2>
                    <div className="legal-section-body">
                      <p>
                        These Terms &amp; Conditions are governed by and construed in
                        accordance with the laws of India. Any disputes arising out of or
                        relating to your use of this website shall be subject to the
                        jurisdiction of the competent courts in India.
                      </p>
                    </div>
                  </section>

                  {/* 12. Updates & Contact */}
                  <section id="terms-updates" className="legal-section">
                    <h2 className="legal-section-title">12. Updates &amp; Contact</h2>
                    <div className="legal-section-body">
                      <p>
                        We may modify these Terms &amp; Conditions periodically. Revised
                        terms will be posted on this page. If you have questions regarding
                        these terms, please reach out to us using the contact form on our
                        website.
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

