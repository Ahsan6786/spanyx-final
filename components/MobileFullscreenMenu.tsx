'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface MobileFullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: (buttonEl: HTMLElement) => void;
}

interface MenuItem {
  label: string;
  href: string;
  isContact?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'WORK', href: '/#what-we-create' },
  { label: 'SERVICES', href: '/#what-we-do' },
  { label: 'ABOUT', href: '/about' },
  { label: 'TEAM', href: '/about#team' },
  { label: 'INDUSTRIES', href: '/industries' },
  { label: 'BLOG', href: '/blog' },
  { label: 'CAREERS', href: '/careers' },
  { label: 'CONTACT', href: '#contact', isContact: true },
];

export default function MobileFullscreenMenu({
  isOpen,
  onClose,
  onOpenContact,
}: MobileFullscreenMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while mobile full-screen menu is open on mobile screens only
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }

      const handleResize = () => {
        if (window.innerWidth >= 768) {
          document.body.style.overflow = '';
          onClose();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: MenuItem
  ) => {
    if (item.isContact) {
      e.preventDefault();
      onClose();
      onOpenContact(e.currentTarget);
      return;
    }

    // Anchor on same page handling
    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const hash = item.href.includes('#') ? '#' + item.href.split('#')[1] : '';
      if (hash && window.location.pathname === '/') {
        e.preventDefault();
        document.body.style.overflow = '';
        onClose();
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
        return;
      }
    }

    onClose();
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
    onOpenContact(e.currentTarget);
  };

  return createPortal(
    <div
      className="spx-mobile-fullscreen-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      <div className="spx-mfm-inner">
        {/* Top Header Row: Spanyx Logo (No round border) + Close Button */}
        <div className="spx-mfm-header">
          <Link href="/" onClick={onClose} className="spx-mfm-logo-link" aria-label="Spanyx Home">
            <picture>
              <source srcSet="/span/small-logo.webp" type="image/webp" />
              <img
                src="/span/small-logo.png"
                alt="Spanyx Logo"
                className="spx-mfm-logo-img"
                width={34}
                height={34}
                loading="eager"
              />
            </picture>
          </Link>

          <button
            type="button"
            className="spx-mfm-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Clean Typographic Navigation List without numbering */}
        <nav className="spx-mfm-nav" aria-label="Mobile Navigation">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="spx-mfm-nav-item"
              onClick={(e) => handleItemClick(e, item)}
            >
              <span className="spx-mfm-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider Line */}
        <div className="spx-mfm-divider" />

        {/* High-Contrast "LET'S TALK" / Contact CTA Button */}
        <button
          type="button"
          className="spx-mfm-cta-btn"
          onClick={handleCtaClick}
        >
          <span>LET&apos;S TALK</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Direct Contact & Social Links Section */}
        <div className="spx-mfm-footer">
          <div className="spx-mfm-direct-title">DIRECT CONTACT</div>

          {/* Social Icons Row (Instagram, LinkedIn, X, YouTube, Facebook, Email) */}
          <div className="spx-mfm-social-row">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="spx-mfm-social-btn"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="spx-mfm-social-btn"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="spx-mfm-social-btn"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="spx-mfm-social-btn"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
              </svg>
              <span>YouTube</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="spx-mfm-social-btn"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span>Facebook</span>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@spanyx.in"
              className="spx-mfm-social-btn"
              aria-label="Email"
              title="Email Us"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

