'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DynamicIslandNav from './DynamicIslandNav';
import MobileFullscreenMenu from './MobileFullscreenMenu';

interface HeaderProps {
  onOpenContact: (buttonEl: HTMLElement) => void;
  alwaysOpen?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  backHref?: string;
}

export default function Header({
  onOpenContact,
  alwaysOpen = false,
  showBackButton = false,
  showLogo = true,
  backHref = '/',
}: HeaderProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isAdminPage = pathname?.startsWith('/admin');
  const isBlogPage = pathname?.startsWith('/blog');
  const shouldShowLogo = showLogo && !isBlogPage;

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenContact(e.currentTarget);
  };

  const brandGroupClass = ['header-brand-group', !shouldShowLogo && 'has-no-logo'].filter(Boolean).join(' ');
  const mobileMenuBtnClass = ['header-menu-btn', isMobileNavOpen && 'is-active'].filter(Boolean).join(' ');

  return (
    <header className="site-header" id="header">
      {/* Dynamic Island Navigation on all public pages */}
      <DynamicIslandNav onOpenContact={onOpenContact} />

      <div className="header-inner">
        <div className={brandGroupClass}>
          {shouldShowLogo && (
            <a href="/" className="brand-link" aria-label="Spanyx Homepage">
              <picture>
                <source srcSet="/span/logo.webp" type="image/webp" />
                <img
                  src="/span/logo.png"
                  alt="Spanyx - Building Smarter Solutions"
                  className="brand-logo"
                  width={2171}
                  height={724}
                  loading="eager"
                />
              </picture>
            </a>
          )}
          {showBackButton && (
            <a
              href={backHref}
              className="header-back-link"
              aria-label="Back to home"
              title="Back to home"
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
            </a>
          )}
        </div>

        {/* Right Action Group: Mobile Sidebar Button + Contact Us */}
        <div className="header-actions">
          {/* Mobile Sidebar / Hamburger Button */}
          <button
            type="button"
            className={mobileMenuBtnClass}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileNavOpen((prev) => !prev);
            }}
            aria-expanded={isMobileNavOpen}
            aria-label="Toggle Navigation Menu"
            title="Menu"
          >
            <span className="header-menu-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <a
            href="#contact"
            className="btn-contact-nav"
            id="navContactBtn"
            onClick={handleContactClick}
          >
            <span>Contact Us</span>
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
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Menu / Sidebar */}
      <MobileFullscreenMenu
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenContact={onOpenContact}
      />
    </header>
  );
}
