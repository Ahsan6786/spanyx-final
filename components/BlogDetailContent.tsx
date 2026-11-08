'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactOverlay, { ContactOverlayHandle } from '@/components/ContactOverlay';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;
  category: string;
  tags: string | null;
  read_time_minutes: number;
  status: 'draft' | 'published';
  views: number;
  published_at: string | null;
  created_at: string;
}

interface BlogDetailContentProps {
  blog: BlogItem;
}

export default function BlogDetailContent({ blog }: BlogDetailContentProps) {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const tagsList = blog.tags
    ? blog.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="blog-detail-root apple-page-root" style={{ background: '#ffffff', minHeight: '100vh', color: '#060e24' }}>
      {/* 1. Header with liquid glass navbar */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={handleOpenContact}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={true}
          backHref="/blog"
        />
      </div>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px 100px', boxSizing: 'border-box' }}>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: '#64748b',
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 600 }}>
            Blog
          </Link>
          <span>/</span>
          <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
            {blog.title}
          </span>
        </nav>

        {/* Article Header Meta */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#eff6ff',
                color: '#0071e3',
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {blog.category}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {blog.read_time_minutes} min read
            </span>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {blog.published_at ? blog.published_at.substring(0, 10) : 'Recent Article'}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              color: '#060e24',
              margin: '0 0 18px',
            }}
          >
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p
              style={{
                fontSize: 'clamp(16px, 2.2vw, 18px)',
                lineHeight: 1.6,
                color: '#475569',
                margin: '0 0 24px',
              }}
            >
              {blog.excerpt}
            </p>
          )}

          {/* Author Card & Share Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              borderTop: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#060e24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <picture>
                  {!blog.author_avatar && <source srcSet="/span/small-logo.webp" type="image/webp" />}
                  <img
                    src={blog.author_avatar || '/span/small-logo.png'}
                    alt={blog.author_name}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </picture>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#060e24' }}>
                  {blog.author_name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {blog.author_role || 'Engineering Team'}
                </div>
              </div>
            </div>

            {/* Share Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 9999,
                  border: '1px solid #cbd5e1',
                  background: copied ? '#dcfce7' : '#ffffff',
                  color: copied ? '#15803d' : '#334155',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  display: 'grid',
                  placeItems: 'center',
                  textDecoration: 'none',
                }}
                title="Share on X"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  display: 'grid',
                  placeItems: 'center',
                  textDecoration: 'none',
                }}
                title="Share on LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {blog.featured_image && (
          <div
            style={{
              width: '100%',
              maxHeight: 460,
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: 44,
              boxShadow: '0 12px 40px -10px rgba(6, 14, 36, 0.12)',
            }}
          >
            <img
              src={blog.featured_image}
              alt={blog.title}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Article Body Content */}
        <article
          className="blog-article-content"
          style={{
            fontSize: 16.5,
            lineHeight: 1.8,
            color: '#1e293b',
            whiteSpace: 'pre-wrap',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginBottom: 48,
          }}
        >
          {blog.content}
        </article>

        {/* Tags Row */}
        {tagsList.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 48,
              paddingTop: 20,
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Topics:
            </span>
            {tagsList.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  color: '#334155',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom CTA Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #060e24 0%, #0d1b3e 100%)',
            color: '#ffffff',
            borderRadius: 24,
            padding: 'clamp(28px, 4vw, 44px)',
            textAlign: 'center',
            boxShadow: '0 16px 48px -12px rgba(6, 14, 36, 0.45)',
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: 12,
            }}
          >
            Scale Your Digital Architecture
          </span>
          <h3
            style={{
              fontSize: 'clamp(22px, 3.5vw, 30px)',
              fontWeight: 800,
              margin: '0 0 12px',
              color: '#ffffff',
            }}
          >
            Ready to Engineer Next-Generation Technology?
          </h3>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: 540,
              margin: '0 auto 24px',
            }}
          >
            Whether building high-concurrency enterprise software, AI agents, or modern web systems, Spanyx engineers solutions designed for impact.
          </p>
          <button
            type="button"
            onClick={(e) => handleOpenContact(e.currentTarget)}
            style={{
              height: 48,
              padding: '0 28px',
              borderRadius: 9999,
              background: '#0071e3',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0, 113, 227, 0.45)',
              transition: 'transform 0.18s ease',
            }}
          >
            Start a Conversation →
          </button>
        </div>

        {/* Back to Blog */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/blog"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0071e3',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back to All Articles
          </Link>
        </div>
      </main>

      <Footer onOpenContact={handleOpenContact} />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}

