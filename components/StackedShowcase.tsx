'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SHOWCASE_CATEGORIES,
  ShowcaseCategoryDetail,
} from '@/data/whatWeCreateData';

gsap.registerPlugin(ScrollTrigger);

export type ShowcaseCategory = ShowcaseCategoryDetail;

interface StackedShowcaseProps {
  onOpenContact: (buttonEl: HTMLElement) => void;
}

export default function StackedShowcase({
  onOpenContact,
}: StackedShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dimOverlaysRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    if (!section || !pinWrap) return;

    const total = SHOWCASE_CATEGORIES.length;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.set(card, {
          zIndex: idx + 1,
          yPercent: idx === 0 ? 0 : 112,
          y: 0,
          scale: 1,
          transformOrigin: 'center top',
        });
      });

      dimOverlaysRef.current.forEach((overlay) => {
        if (!overlay) return;
        gsap.set(overlay, { opacity: 0 });
      });

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinWrap,
          start: 'top top',
          end: () => `+=${window.innerHeight * (isMobile ? total * 0.44 : total - 0.35)}`,
          scrub: isMobile ? 0.45 : 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawStep = self.progress * (total - 0.65);
            const nextIdx = Math.min(
              total - 1,
              Math.max(0, Math.round(rawStep))
            );
            setActiveIndex((prev) => (prev !== nextIdx ? nextIdx : prev));
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;

      for (let i = 1; i < total; i++) {
        const stepLabel = `card-${i}`;
        tl.addLabel(stepLabel, i - 1);

        const currentCard = cardsRef.current[i];
        if (currentCard) {
          tl.to(
            currentCard,
            {
              yPercent: 0,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power2.inOut',
            },
            stepLabel
          );
        }

        for (let j = 0; j < i; j++) {
          const prevCard = cardsRef.current[j];
          const prevOverlay = dimOverlaysRef.current[j];
          const depth = i - j;

          const yOffset = (isMobile ? -14 : -19) * depth;
          const scaleVal = 1 - (isMobile ? 0.034 : 0.044) * depth;
          const dimVal = Math.min(0.58, depth * 0.13);

          if (prevCard) {
            tl.to(
              prevCard,
              {
                y: yOffset,
                scale: scaleVal,
                duration: 1,
                ease: 'power2.inOut',
              },
              stepLabel
            );
          }

          if (prevOverlay) {
            tl.to(
              prevOverlay,
              {
                opacity: dimVal,
                duration: 1,
                ease: 'power2.inOut',
              },
              stepLabel
            );
          }
        }
      }

      tl.to({}, { duration: 0.35 });
    }, section);

    // Check if URL landed with #what-we-create or #get-started (navigation only, NOT on refresh)
    let timer: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined') {
      const navEntry = window.performance?.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming | undefined;
      const isReload =
        navEntry?.type === 'reload' ||
        // @ts-ignore fallback for legacy browsers
        window.performance?.navigation?.type === 1;

      // On refresh, never auto-scroll down to We create; stay on Hero section
      if (!isReload) {
        const hash = window.location.hash;
        if (hash === '#what-we-create' || hash === '#get-started') {
          timer = setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    }

    return () => {
      ctx.revert();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const scrollToCard = (targetIndex: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const total = SHOWCASE_CATEGORIES.length;
    const totalTimelineDuration = total - 1 + 0.35;
    const targetProgress =
      targetIndex === 0 ? 0 : targetIndex / totalTimelineDuration;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleContactTrigger = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenContact(e.currentTarget);
  };

  const activeCategory = SHOWCASE_CATEGORIES[activeIndex];

  return (
    <section
      className="showcase-section"
      id="what-we-create"
      ref={sectionRef}
      aria-label="We Create — Selected Work"
    >
      <div id="get-started" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', pointerEvents: 'none' }} />
      <div className="showcase-pin-wrap" ref={pinWrapRef}>
        <div className="showcase-stage">
          {/* LEFT COLUMN: Clean Heading, Pure Glassmorphic Category Buttons & Action */}
          <div className="showcase-left">
            <div className="showcase-title-block">
              <h2 className="showcase-heading">
                <span className="showcase-heading-line1">We</span>{' '}
                <span className="showcase-heading-line2">create</span>
              </h2>

              <nav
                className="showcase-cat-nav"
                aria-label="Showcase categories"
              >
                {SHOWCASE_CATEGORIES.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`showcase-cat-btn ${
                        isActive ? 'is-active' : ''
                      }`}
                      onClick={() => scrollToCard(idx)}
                    >
                      <span className="showcase-cat-label">{cat.title}</span>
                    </button>
                  );
                })}
              </nav>

              <a
                href="#contact"
                className="showcase-all-link"
                id="showcaseStartProjectBtn"
                onClick={handleContactTrigger}
              >
                <span>Start a project</span>
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
              </a>
            </div>
          </div>

          {/* CENTER COLUMN: Stacked Cards & Centered Project Caption */}
          <div className="showcase-center">
            <div className="showcase-mobile-header">
              <h2 className="showcase-mobile-heading">We create</h2>
            </div>

            <div className="showcase-stack-viewport">
              <div
                className="showcase-ambient-layer showcase-ambient-layer-2"
                aria-hidden="true"
              />
              <div
                className="showcase-ambient-layer showcase-ambient-layer-1"
                aria-hidden="true"
              />

              <div className="showcase-cards-container">
                {SHOWCASE_CATEGORIES.map((cat, idx) => (
                  <article
                    key={cat.id}
                    className="showcase-card"
                    ref={(el) => {
                      cardsRef.current[idx] = el as HTMLDivElement | null;
                    }}
                    aria-label={cat.title}
                  >
                    <div className="showcase-card-inner">
                      {cat.video ? (
                        <video
                          src={cat.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="showcase-card-img"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          src={cat.image}
                          alt={`${cat.title} — SpanyX project showcase`}
                          className="showcase-card-img"
                          loading="eager"
                        />
                      )}

                      <div
                        className="showcase-card-dim"
                        ref={(el) => {
                          dimOverlaysRef.current[idx] = el;
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="showcase-caption-bar">
              <div className="showcase-caption-center" key={activeCategory.id}>
                <h3 className="showcase-caption-title">
                  {activeCategory.title}
                </h3>
                <p className="showcase-caption-sub">
                  {activeCategory.subtitle}
                </p>
                <Link
                  href={`/what-we-create/${activeCategory.slug}`}
                  className="showcase-discover-mobile"
                >
                  <span>Discover More</span>
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
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Discover More Button */}
          <div className="showcase-right">
            <Link
              href={`/what-we-create/${activeCategory.slug}`}
              className="showcase-see-all-card showcase-discover-btn"
              aria-label={`Discover more about ${activeCategory.title}`}
            >
              <span className="showcase-see-all-label">Discover More</span>
              <span className="showcase-discover-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 12L12 4M12 4H5.5M12 4V10.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
