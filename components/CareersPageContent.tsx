'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import { CAREERS_DATA, CareerPostingItem } from '@/data/careersData';

export default function CareersPageContent() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const [selectedCategory, setSelectedCategory] = useState('All Opportunities');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  const categories = [
    'All Opportunities',
    'Internship Opportunities',
    'Fresher Opportunities',
    'Full-Time Jobs',
    'Remote Opportunities',
  ];

  // Hardcoded filtering in memory — 100% independent from admin panel & zero latency
  const postings = useMemo(() => {
    let list = CAREERS_DATA;
    if (selectedCategory !== 'All Opportunities') {
      if (selectedCategory === 'Remote Opportunities') {
        list = list.filter((p) => p.work_mode.toLowerCase().includes('remote'));
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.required_skills.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="careers-page">
      {/* 1. Dedicated Top Navigation with Back Button, Dynamic Island in center, and Contact on right */}
      <header className="careers-top-nav">
        <DynamicIslandNav onOpenContact={handleOpenContact} />
        <div className="careers-top-nav-inner">
          <Link
            href="/"
            className="careers-back-btn"
            title="Back to Home"
            aria-label="Back to Home"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M11.25 3.75L6 9L11.25 14.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className="careers-top-nav-right">
            <button
              type="button"
              className="careers-nav-contact-btn"
              onClick={(e) => handleOpenContact(e.currentTarget)}
            >
              <span>Contact Us</span>
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
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="careers-main-container">
        {/* Top Header Block: Clean, Professional */}
        <div className="careers-hero-header">
          <h1 className="careers-hero-title">Careers &amp; Opportunities</h1>

          <p className="careers-hero-desc">
            Join SPANYX to engineer mission-critical digital systems. We offer
            dedicated internship tracks, fresher engineering pathways, and
            full-time roles across software engineering, architecture, and
            design.
          </p>

          {/* Search Box */}
          <div className="careers-search-wrap">
            <input
              type="text"
              placeholder="Search by role title, skill, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="careers-search-input"
            />
          </div>
        </div>

        {/* Dedicated Category Tabs (Capsule Buttons) */}
        <div className="careers-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`careers-cat-pill ${
                selectedCategory === cat ? 'is-active' : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {postings.length === 0 && (
          <div
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              borderRadius: 0,
              background: '#f8fafc',
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: '0 0 8px',
                color: '#060e24',
              }}
            >
              No openings found in this category
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
              Try selecting another category or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Opportunities');
                setSearchQuery('');
              }}
              style={{
                padding: '10px 22px',
                borderRadius: 9999,
                background: '#060e24',
                color: '#ffffff',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All Opportunities
            </button>
          </div>
        )}

        {/* Opportunities List: Hardcoded Black Cards, White Text, No Rounded Corners, All Remote, Formatted Skills */}
        {postings.length > 0 && (
          <div className="careers-card-grid">
            {postings.map((posting) => (
              <div key={posting.id} className="careers-card">
                <div>
                  {/* Work Mode */}
                  <div className="careers-card-top-row">
                    <span className="careers-card-mode">Remote</span>
                  </div>

                  {/* Title */}
                  <h3 className="careers-card-title">{posting.title}</h3>

                  {/* Description preview */}
                  <p className="careers-card-desc">{posting.description}</p>

                  {/* Required Skills (Only skills required, clean, formatted) */}
                  {posting.required_skills && (
                    <div className="careers-skills-block">
                      <div className="careers-skills-label">
                        Required Skills
                      </div>
                      <div className="careers-skills-chips">
                        {posting.required_skills
                          .split(',')
                          .map((skill, sIdx) => (
                            <span key={sIdx} className="careers-skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions: Details opens full page, Apply Now opens role page with anchor */}
                <div className="careers-card-actions">
                  <Link
                    href={`/careers/${posting.slug}#apply`}
                    className="careers-apply-btn"
                  >
                    Apply Now
                  </Link>

                  <Link
                    href={`/careers/${posting.slug}`}
                    className="careers-details-btn"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Contact Overlay */}
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}
