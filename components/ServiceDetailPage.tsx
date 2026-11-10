'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShowcaseCategoryDetail } from '@/data/whatWeCreateData';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import Footer from '@/components/Footer';
import { assetPreloader } from '@/lib/performance/assetPreloader';

interface ServiceDetailPageProps {
  category: ShowcaseCategoryDetail;
}

export default function ServiceDetailPage({
  category,
}: ServiceDetailPageProps) {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  useEffect(() => {
    if (category.mobileShowcase?.image) {
      assetPreloader.preload(category.mobileShowcase.image, 'idle');
    }
  }, [category.mobileShowcase?.image]);

  const handleOpenContact = (e?: React.MouseEvent<HTMLElement> | HTMLElement) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
      e.stopPropagation();
      contactOverlayRef.current?.openFrom(e.currentTarget);
    } else if (e instanceof HTMLElement) {
      contactOverlayRef.current?.openFrom(e);
    }
  };

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sdp-page">
      {/* Dynamic Island Navigation Bar */}
      <DynamicIslandNav onOpenContact={(btn) => handleOpenContact(btn)} />

      {/* Seamless Top Header: Logo + Back Button on left, Contact on right */}
      <header className="sdp-header">
        <div className="sdp-header-inner">
          {/* Left: Back Button in place of logo */}
          <div className="sdp-header-left">
            <Link
              href="/#what-we-create"
              className="sdp-circle-back-btn"
              title="Back to We Create"
              aria-label="Back to We Create"
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

          {/* Right: Contact Us Button */}
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
        {/* A. HERO SECTION */}
        <section className="sdp-hero" aria-labelledby="sdp-hero-title">
          <div className="sdp-container">
            <div className="sdp-hero-grid">
              <div className="sdp-hero-copy">
                <h1 className="sdp-hero-category-title" id="sdp-hero-title">
                  {category.title}
                </h1>

                <p className="sdp-hero-headline">{category.heroHeadline}</p>

                <p className="sdp-hero-intro">{category.heroIntro}</p>

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
                    {category.video ? (
                      <video
                        src={category.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="sdp-visual-img"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <picture>
                        <source
                          srcSet={category.image.replace(/\.(png|jpe?g)$/i, '.webp')}
                          type="image/webp"
                        />
                        <img
                          src={category.image}
                          alt={`${category.title} — SPANYX Showcase`}
                          className="sdp-visual-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B. ABOUT THE SERVICE */}
        <section className="sdp-section sdp-about-section">
          <div className="sdp-container">
            <div className="sdp-about-wrap">
              <div className="sdp-about-header">
                <h2 className="sdp-about-headline">
                  {category.aboutHeadline}
                </h2>
              </div>

              <div className="sdp-about-columns">
                <div className="sdp-about-lead-col">
                  <div className="sdp-about-lead-card">
                    <p className="sdp-about-lead">{category.aboutLead}</p>
                  </div>
                </div>

                <div className="sdp-about-body-col">
                  {category.aboutBody.map((paragraph, idx) => (
                    <p key={idx} className="sdp-about-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE & DEVICE SHOWCASE SECTION */}
        {category.mobileShowcase && (
          <section
            className="sdp-section sdp-mobile-section"
            aria-label="Device and Mobile Showcase"
          >
            <div className="sdp-container">
              <div className="sdp-mobile-grid">
                <div className="sdp-mobile-copy">
                  <h2 className="sdp-section-heading sdp-mobile-heading">
                    {category.mobileShowcase.heading}
                  </h2>
                  <p className="sdp-mobile-desc">
                    {category.mobileShowcase.description}
                  </p>

                  {category.mobileShowcase.details &&
                    category.mobileShowcase.details.length > 0 && (
                      <ul className="sdp-mobile-points-list">
                        {category.mobileShowcase.details.map((point) => (
                          <li key={point} className="sdp-mobile-point-item">
                            <span className="sdp-mobile-point-icon">
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
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <div className="sdp-mobile-visual">
                  <div className="sdp-mobile-frame">
                    <picture>
                      <source
                        srcSet={category.mobileShowcase.image.replace(/\.(png|jpe?g)$/i, '.webp')}
                        type="image/webp"
                      />
                      <img
                        src={category.mobileShowcase.image}
                        alt={category.mobileShowcase.heading}
                        className="sdp-mobile-img"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WHAT WE OFFER — CLEAN 3 CARDS SECTION */}
        {category.capabilities && category.capabilities.length > 0 && (
          <section
            className="sdp-section sdp-offer-clean-section"
            aria-labelledby="sdp-offer-title"
          >
            <div className="sdp-container">
              <div className="sdp-offer-clean-header">
                <h2 className="sdp-offer-clean-title" id="sdp-offer-title">
                  What We Offer
                </h2>
                {category.capabilitiesIntro && (
                  <p className="sdp-offer-clean-subtitle">
                    {category.capabilitiesIntro}
                  </p>
                )}
              </div>

              <div className="sdp-offer-clean-grid">
                {category.capabilities.slice(0, 3).map((item) => (
                  <div key={item.title} className="sdp-offer-clean-card">
                    <h3 className="sdp-offer-clean-card-title">{item.title}</h3>
                    <p className="sdp-offer-clean-card-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FULL-WIDTH ATMOSPHERIC GRADIENT FOOTER (REFERENCE DESIGN) */}
      <Footer onOpenContact={(buttonEl) => contactOverlayRef.current?.openFrom(buttonEl)} />

      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
