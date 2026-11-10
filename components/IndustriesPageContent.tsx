'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';

interface IndustryItem {
  id: string;
  name: string;
  iconSrc: string;
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    iconSrc: '/industries/real-estate.svg',
  },
  {
    id: 'jobs-recruiters',
    name: 'Jobs & Recruiters',
    iconSrc: '/industries/jobs-recruiters.svg',
  },
  {
    id: 'matrimonial',
    name: 'Matrimonial',
    iconSrc: '/industries/matrimonial.svg',
  },
  {
    id: 'medical-doctors',
    name: 'Medical & Doctors',
    iconSrc: '/industries/medical-doctors.svg',
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    iconSrc: '/industries/food-beverage.svg',
  },
  {
    id: 'school-education',
    name: 'School & Education',
    iconSrc: '/industries/school-education.svg',
  },
  {
    id: 'tours-travel',
    name: 'Tours & Travel',
    iconSrc: '/industries/tours-travel.svg',
  },
  {
    id: 'b2c',
    name: 'B2C',
    iconSrc: '/industries/b2c.svg',
  },
  {
    id: 'b2b',
    name: 'B2B',
    iconSrc: '/industries/b2b.svg',
  },
  {
    id: 'e-commerce',
    name: 'E-commerce',
    iconSrc: '/industries/e-commerce.svg',
  },
  {
    id: 'banking-finance',
    name: 'Banking & Finance',
    iconSrc: '/industries/banking-finance.svg',
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    iconSrc: '/industries/health-beauty.svg',
  },
  {
    id: 'community-web-design',
    name: 'Community Web Design',
    iconSrc: '/industries/community-web-design.svg',
  },
  {
    id: 'hotels-restaurants',
    name: 'Hotels & Restaurants',
    iconSrc: '/industries/hotels-restaurants.svg',
  },
  {
    id: 'jewelry-fashion',
    name: 'Jewelry & Fashion Accessories',
    iconSrc: '/industries/jewelry-fashion.svg',
  },
  {
    id: 'news-blogs-publications',
    name: 'News, Blogs & Publications',
    iconSrc: '/industries/news-blogs-publications.svg',
  },
];

export default function IndustriesPageContent() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  return (
    <div className="industries-page apple-page-root">
      {/* 1. TOP HEADER WITH EXACT LIQUID GLASS SLIDE NAVBAR (NO LOGO, BACK BUTTON IN FRONT OF CONTACT US) */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={handleOpenContact}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={false}
          backHref="/"
        />
      </div>

      <main className="industries-main">
        {/* ============================================================
            HERO SECTION (Clean, Minimal, Consistent with Spanyx Theme)
            ============================================================ */}
        <section className="industries-hero-section">
          <div className="industries-container">
            <div className="industries-hero-header">
              <h1 className="industries-hero-title">Industries We Serve</h1>
              <p className="industries-hero-subtitle">
                We build custom software and digital platforms designed for businesses across every industry.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            16 INDUSTRIES GRID (Simple, Borderless Cards Matching Reference)
            ============================================================ */}
        <section className="industries-grid-section" aria-label="Industries Grid">
          <div className="industries-container">
            <div className="industries-grid">
              {INDUSTRIES.map((industry) => (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.id}`}
                  className="industry-card"
                  id={industry.id}
                  title={`View ${industry.name}`}
                >
                  <div className="industry-card-icon-wrap">
                    <img
                      src={industry.iconSrc}
                      alt={industry.name}
                      className="industry-card-icon"
                      loading="lazy"
                      decoding="async"
                      width={80}
                      height={80}
                    />
                  </div>

                  <h2 className="industry-card-title">{industry.name}</h2>

                  <div className="industry-card-action">
                    <span>Explore</span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 12L12 4M12 4H5.5M12 4V10.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTTOM ACTION: START A CONVERSATION (Simple, Clean, Centered)
            ============================================================ */}
        <section className="industries-cta-section" aria-label="Start a conversation">
          <div className="industries-container industries-cta-container">
            <button
              type="button"
              className="industries-simple-cta-btn"
              onClick={(e) => handleOpenContact(e.currentTarget)}
            >
              <span>Start a Conversation</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Atmospheric Footer & Contact Overlay */}
      <Footer onOpenContact={(btnEl) => contactOverlayRef.current?.openFrom(btnEl)} />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
