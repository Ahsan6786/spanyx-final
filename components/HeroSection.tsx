'use client';

import React, { useRef } from 'react';
import ServiceGlassCards from './ServiceGlassCards';

interface HeroSectionProps {
  onOpenContact: (buttonEl: HTMLElement) => void;
}

export default function HeroSection({ onOpenContact }: HeroSectionProps) {
  const heroCardRef = useRef<HTMLDivElement>(null);
  const longMockupWrapRef = useRef<HTMLDivElement>(null);
  const shortMockupWrapRef = useRef<HTMLDivElement>(null);

  const isDesktop = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 1024px)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop() || !heroCardRef.current) return;

    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

    if (longMockupWrapRef.current) {
      longMockupWrapRef.current.style.transform = `translate3d(${xPercent * 8}px, ${yPercent * 6}px, 0)`;
    }
    if (shortMockupWrapRef.current) {
      shortMockupWrapRef.current.style.transform = `translate3d(${xPercent * 4}px, ${yPercent * 3}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktop()) return;

    if (longMockupWrapRef.current) {
      longMockupWrapRef.current.style.transform = 'translate3d(0, 0, 0)';
      longMockupWrapRef.current.style.transition =
        'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (shortMockupWrapRef.current) {
      shortMockupWrapRef.current.style.transform = 'translate3d(0, 0, 0)';
      shortMockupWrapRef.current.style.transition =
        'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  };

  const handleMouseEnter = () => {
    if (!isDesktop()) return;

    if (longMockupWrapRef.current) {
      longMockupWrapRef.current.style.transition = 'transform 0.1s ease-out';
    }
    if (shortMockupWrapRef.current) {
      shortMockupWrapRef.current.style.transition = 'transform 0.1s ease-out';
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const targetId = e.currentTarget.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const startY = window.scrollY;
        const destY = Math.max(
          0,
          Math.round(targetElement.getBoundingClientRect().top + startY + 2)
        );
        const diff = destY - startY;
        if (Math.abs(diff) < 2) return;
        const duration = Math.min(820, Math.max(420, Math.abs(diff) * 0.22));
        const startTime = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          window.scrollTo(0, Math.round(startY + diff * ease));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenContact(e.currentTarget);
  };

  return (
    <main>
      <section className="hero-section" id="hero">
        <div className="hero-container">
          {/* Hero Heading */}
          <div className="hero-headline-wrap">
            <h1 className="hero-headline">
              <span className="line-1">ENGINEERING THE NEXT GENERATION</span>
              <span className="line-2">OF DIGITAL TECHNOLOGY</span>
            </h1>
          </div>

          {/* Hero Visual Card */}
          <div
            className="hero-card"
            id="heroCard"
            ref={heroCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            {/* Left Info Block */}
            <div className="hero-card-content">
              <p className="hero-card-description">
                We build reliable software, websites, and digital systems for
                businesses and universities. Delivered on time with clean
                engineering.
              </p>

              {/* Apple-style Glass Cards */}
              <ServiceGlassCards />

              <div className="hero-card-actions">
                <a
                  href="#get-started"
                  className="btn-primary"
                  id="btnGetStarted"
                  onClick={handleAnchorClick}
                >
                  <span>Get Started</span>
                  <svg
                    className="arrow-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <a
                  href="#contact"
                  className="btn-secondary"
                  id="btnContact"
                  onClick={handleContactClick}
                >
                  <span>Contact Us</span>
                </a>
              </div>
            </div>

            {/* Right Visual Mockups Area */}
            <div className="hero-card-mockups">
              {/* Short iPhone Mockup (In Progress screen, sits behind) */}
              <div
                className="mockup-wrap mockup-short-wrap"
                id="shortMockupWrap"
                ref={shortMockupWrapRef}
              >
                <picture>
                  <source media="(max-width: 767px)" srcSet="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                  <source srcSet="/span/short-clean.webp" type="image/webp" />
                  <img
                    src="/span/short-clean.png"
                    alt="Spanyx Project Management in progress iPhone mockup"
                    className="mockup-img mockup-short"
                    loading="eager"
                    fetchPriority="high"
                    width={908}
                    height={1008}
                  />
                </picture>
              </div>

              {/* Long iPhone Mockup (Main screen with 3D ribbon logo, sticks out above card) */}
              <div
                className="mockup-wrap mockup-long-wrap"
                id="longMockupWrap"
                ref={longMockupWrapRef}
              >
                <picture>
                  <source media="(max-width: 767px)" srcSet="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                  <source srcSet="/span/long1.webp" type="image/webp" />
                  <img
                    src="/span/long1.png"
                    alt="Spanyx Software Solutions iPhone mockup"
                    className="mockup-img mockup-long"
                    loading="eager"
                    fetchPriority="high"
                    width={1024}
                    height={1536}
                  />
                </picture>
              </div>
            </div>
          </div>
          {/* /.hero-card */}
        </div>
        {/* /.hero-container */}
      </section>
    </main>
  );
}

