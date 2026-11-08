'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export default function BlogPageContent() {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setBlogs(json.blogs || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load published blogs:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = ['All', 'Engineering', 'Architecture', 'AI & Cloud', 'Case Studies'];

  const filteredBlogs = blogs.filter((b) => {
    const matchCategory =
      selectedCategory === 'All' ||
      b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      !searchQuery.trim() ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.tags && b.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const standardBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  return (
    <div className="blog-page-root apple-page-root" style={{ background: '#ffffff', minHeight: '100vh', color: '#060e24' }}>
      {/* 1. Header with liquid glass navbar & contact trigger */}
      <div className="about-header-wrapper">
        <Header
          onOpenContact={handleOpenContact}
          alwaysOpen={true}
          showBackButton={true}
          showLogo={true}
          backHref="/"
        />
      </div>

      <main style={{ padding: '40px 24px 100px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <h1
            style={{
              fontSize: 'clamp(34px, 5vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#060e24',
              margin: '0 0 16px',
            }}
          >
            Insights on Software, Architecture &amp; Scale
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2.2vw, 18px)',
              lineHeight: 1.6,
              color: '#475569',
              margin: 0,
            }}
          >
            Deep architectural explorations, engineering blueprints, and system design principles from the team building Spanyx digital solutions.
          </p>
        </div>

        {/* Dynamic State: If Loading */}
        {isLoading && (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: '3px solid rgba(0, 113, 227, 0.18)',
                borderTopColor: '#0071e3',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p style={{ fontSize: 14, fontWeight: 600 }}>Loading publications...</p>
          </div>
        )}

        {/* CASE A: No published blogs yet -> Display Premium Clean Coming Soon Section */}
        {!isLoading && blogs.length === 0 && (
          <div
            style={{
              background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: 24,
              padding: 'clamp(48px, 8vw, 80px) clamp(20px, 4vw, 48px)',
              textAlign: 'center',
              boxShadow: '0 12px 40px -12px rgba(6, 14, 36, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -100,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 400,
                height: 200,
                background: 'radial-gradient(ellipse at center, rgba(0, 113, 227, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: '#0071e3',
                background: '#ffffff',
                border: '1px solid rgba(0, 113, 227, 0.2)',
                padding: '6px 16px',
                borderRadius: 9999,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 20,
              }}
            >
              Coming Soon
            </span>

            <h2
              style={{
                fontSize: 'clamp(28px, 4.5vw, 40px)',
                fontWeight: 800,
                color: '#060e24',
                letterSpacing: '-0.025em',
                margin: '0 0 16px',
              }}
            >
              Articles Releasing Soon
            </h2>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: '#64748b',
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              Our architectural case studies and engineering perspectives will be published here.
            </p>
          </div>
        )}

        {/* CASE B: Published blogs exist -> Render full public blog hub */}
        {!isLoading && blogs.length > 0 && (
          <div>
            {/* Filter and Category Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 36,
                paddingBottom: 18,
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              {/* Category selector pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 9999,
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? '#0071e3' : '#e2e8f0',
                      background: selectedCategory === cat ? '#0071e3' : '#ffffff',
                      color: selectedCategory === cat ? '#ffffff' : '#475569',
                      fontSize: 13,
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.16s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
                <input
                  type="text"
                  placeholder="Search articles &amp; topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px 9px 34px',
                    borderRadius: 9999,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#060e24',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* Featured Blog Header Card */}
            {featuredBlog && (
              <div
                style={{
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 24,
                  padding: 'clamp(24px, 4vw, 40px)',
                  marginBottom: 44,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: featuredBlog.featured_image ? '1.2fr 1fr' : '1fr',
                    gap: 32,
                    alignItems: 'center',
                  }}
                  className="admin-charts-grid-2-1"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span
                        style={{
                          background: '#eff6ff',
                          color: '#0071e3',
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 6,
                          textTransform: 'uppercase',
                        }}
                      >
                        {featuredBlog.category}
                      </span>
                      <span style={{ fontSize: 12.5, color: '#64748b' }}>
                        {featuredBlog.read_time_minutes} min read
                      </span>
                      <span style={{ fontSize: 12.5, color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: 12.5, color: '#64748b' }}>
                        {featuredBlog.published_at ? featuredBlog.published_at.substring(0, 10) : 'Recent'}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(24px, 3.2vw, 34px)',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        color: '#060e24',
                        margin: '0 0 14px',
                      }}
                    >
                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {featuredBlog.title}
                      </Link>
                    </h2>

                    {featuredBlog.excerpt && (
                      <p
                        style={{
                          fontSize: 15.5,
                          lineHeight: 1.6,
                          color: '#475569',
                          margin: '0 0 24px',
                        }}
                      >
                        {featuredBlog.excerpt}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: '#060e24',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <picture>
                            {!featuredBlog.author_avatar && <source srcSet="/span/small-logo.webp" type="image/webp" />}
                            <img
                              src={featuredBlog.author_avatar || '/span/small-logo.png'}
                              alt=""
                              width={34}
                              height={34}
                              loading="lazy"
                              decoding="async"
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </picture>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#060e24' }}>
                            {featuredBlog.author_name}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {featuredBlog.author_role || 'Engineering Team'}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: '#0071e3',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Read Full Article</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M4 12L12 4M12 4H5.5M12 4V10.5" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {featuredBlog.featured_image && (
                    <Link
                      href={`/blog/${featuredBlog.slug}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 280,
                        borderRadius: 16,
                        overflow: 'hidden',
                        textDecoration: 'none',
                      }}
                    >
                      <img
                        src={featuredBlog.featured_image}
                        alt={featuredBlog.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Standard Blogs Card Grid */}
            {standardBlogs.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 24,
                }}
              >
                {standardBlogs.map((b) => (
                  <article
                    key={b.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 18,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {b.featured_image && (
                      <Link
                        href={`/blog/${b.slug}`}
                        style={{ display: 'block', width: '100%', height: 180, overflow: 'hidden' }}
                      >
                        <img
                          src={b.featured_image}
                          alt={b.title}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Link>
                    )}

                    <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span
                          style={{
                            background: '#eff6ff',
                            color: '#0071e3',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                          }}
                        >
                          {b.category}
                        </span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>
                          {b.read_time_minutes}m read
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          color: '#060e24',
                          margin: '0 0 10px',
                        }}
                      >
                        <Link href={`/blog/${b.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {b.title}
                        </Link>
                      </h3>

                      {b.excerpt && (
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#64748b', margin: '0 0 16px', flex: 1 }}>
                          {b.excerpt}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 'auto',
                          paddingTop: 12,
                          borderTop: '1px solid #f1f5f9',
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: '#64748b', fontWeight: 500 }}>{b.author_name}</span>
                        <Link
                          href={`/blog/${b.slug}`}
                          style={{
                            color: '#0071e3',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>Read</span>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12L12 4M12 4H5.5M12 4V10.5" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onOpenContact={handleOpenContact} />
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}

