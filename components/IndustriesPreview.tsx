'use client';

import React from 'react';
import Link from 'next/link';
import { INDUSTRIES_DATA } from '@/data/industriesData';

interface IndustriesPreviewProps {
  onOpenContact?: (buttonEl: HTMLElement) => void;
}

export default function IndustriesPreview({ onOpenContact }: IndustriesPreviewProps) {
  return (
    <section
      className="industries-preview-section"
      id="industries-preview"
      aria-labelledby="industries-preview-title"
    >
      <div className="industries-preview-container">
        {/* Section Header: Centered Big Bold Title + Simple Subtitle */}
        <div className="landing-section-header industries-preview-header">
          <h2 id="industries-preview-title" className="landing-section-title">
            Industries We Work With
          </h2>
          <p className="industries-preview-subtitle">
            Custom software and web platforms built for your specific field.
          </p>
        </div>

        {/* 16 Industry Cards Grid (Clean, minimal: Icon + Title + Explore) */}
        <div className="industries-grid" aria-label="Industries We Work With">
          {INDUSTRIES_DATA.map((industry) => (
            <Link
              key={industry.id}
              href={`/industries/${industry.slug || industry.id}`}
              className="industry-card"
              id={`home-industry-${industry.id}`}
              title={`View ${industry.name}`}
            >
              <div className="industry-card-icon-wrap">
                <img
                  src={industry.iconSrc}
                  alt={industry.name}
                  className="industry-card-icon"
                  loading="lazy"
                  decoding="async"
                  width={72}
                  height={72}
                />
              </div>

              <h3 className="industry-card-title">{industry.name}</h3>

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

        {/* Explore All Industries Button */}
        <div className="industries-preview-footer">
          <Link href="/industries" className="industries-preview-all-btn">
            <span>Explore All Industries</span>
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
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

