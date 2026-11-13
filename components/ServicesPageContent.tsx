'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import { SERVICES_LIST } from '@/data/servicesData';

export default function ServicesPageContent() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const handleOpenContact = (buttonEl?: HTMLElement) => {
    if (buttonEl) {
      contactOverlayRef.current?.openFrom(buttonEl);
    } else {
      const fallbackBtn = document.querySelector('.sdp-nav-contact-btn') as HTMLElement;
      contactOverlayRef.current?.openFrom(fallbackBtn || document.body);
    }
  };

  return (
    <div className="services-page apple-page-root">
      {/* 1. TOP HEADER WITH LIQUID GLASS NAVIGATION */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={(buttonEl) => handleOpenContact(buttonEl)}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={false}
          backHref="/"
        />
      </div>

      <main className="services-main">
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section className="services-hero-section" aria-labelledby="services-hero-title">
          <div className="services-container">
            <div className="services-hero-header">
              <h1 className="services-hero-title" id="services-hero-title">
                Services &amp; Digital Solutions
              </h1>
              <p className="services-hero-subtitle">
                We build custom software, modern business websites, and intelligent digital systems tailored to help your company run efficiently and grow.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            7 SERVICES GRID (Generous spacing, perfectly fitted images, concise copy)
            ============================================================ */}
        <section className="services-grid-section" aria-label="Services Catalog">
          <div className="services-container">
            <div className="services-grid">
              {SERVICES_LIST.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="service-card"
                  title={`View ${service.title}`}
                >
                  {/* Service Visual Preview Frame (Exact 4:3 fit) */}
                  <div className="service-card-visual">
                    <picture>
                      <source srcSet={service.webpImage} type="image/webp" />
                      <img
                        src={service.image}
                        alt={`${service.title} — SPANYX Service`}
                        className="service-card-img"
                        loading="lazy"
                        decoding="async"
                        width={1444}
                        height={1088}
                      />
                    </picture>
                  </div>

                  {/* Concise Service Card Content */}
                  <div className="service-card-body">
                    <h2 className="service-card-title">{service.title}</h2>
                    <p className="service-card-desc">{service.subtitle}</p>

                    <div className="service-card-action">
                      <span>Explore</span>
                      <svg
                        width="14"
                        height="14"
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
                  </div>
                </Link>
              ))}
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
