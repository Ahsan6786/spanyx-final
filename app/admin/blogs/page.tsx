'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBlogManagementPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    total_views: 0,
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [previewBlog, setPreviewBlog] = useState<any>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'all') q.set('status', statusFilter);
      if (searchQuery.trim()) q.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/blogs?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setBlogs(json.blogs || []);
          if (json.stats) setStats(json.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, searchQuery]);

  const handleToggleStatus = async (blog: any) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const headerActions = useMemo(
    () => (
      <Link
        href="/admin/blogs/new"
        className="admin-btn-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 18px',
          borderRadius: 8,
          background: '#0071e3',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: 13.5,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0, 113, 227, 0.35)',
          transition: 'all 0.18s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Write New Article</span>
      </Link>
    ),
    []
  );

  return (
    <AdminLayout
      title="Blog &amp; Content Management"
      actions={headerActions}
    >
      {/* 4 Stat Overview Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Articles</span>
          <span className="admin-kpi-value">{stats.total_posts || 0}</span>
          <span className="admin-kpi-subtext">All content entries</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Published Articles</span>
          <span className="admin-kpi-value" style={{ color: '#059669' }}>
            {stats.published_posts || 0}
          </span>
          <span className="admin-kpi-subtext">Live on /blog</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Drafts</span>
          <span className="admin-kpi-value" style={{ color: '#f59e0b' }}>
            {stats.draft_posts || 0}
          </span>
          <span className="admin-kpi-subtext">Pending review or release</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Article Reads</span>
          <span className="admin-kpi-value" style={{ color: '#0071e3' }}>
            {stats.total_views || 0}
          </span>
          <span className="admin-kpi-subtext">Engagement impressions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="admin-filter-pills">
            {(
              [
                { id: 'all', label: 'All Articles' },
                { id: 'published', label: 'Published' },
                { id: 'draft', label: 'Drafts' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                className={`admin-filter-pill ${statusFilter === p.id ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: 240 }}>
            <input
              type="text"
              placeholder="Search by title, tag, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                fontSize: 13,
                borderRadius: 8,
                border: '1px solid var(--admin-border, #e2e8f0)',
                background: 'var(--admin-card-bg, #ffffff)',
                color: 'var(--admin-text, #060e24)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <Link
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#0071e3',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>View Public Blog</span>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12L12 4M12 4H5.5M12 4V10.5" />
          </svg>
        </Link>
      </div>

      {/* Blog Posts Table */}
      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Cover</th>
                <th>Title &amp; Slug</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Reads</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          border: '2px solid rgba(0, 113, 227, 0.2)',
                          borderTopColor: '#0071e3',
                          borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite',
                        }}
                      />
                      <span>Loading articles...</span>
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
                    <div style={{ maxWidth: 360, margin: '0 auto' }}>
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        style={{ margin: '0 auto 12px', color: '#94a3b8' }}
                      >
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: 'var(--admin-text, #060e24)' }}>
                        No articles found
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--admin-text-sub, #64748b)', margin: '0 0 16px' }}>
                        {statusFilter !== 'all' || searchQuery
                          ? 'Try adjusting your filters or search terms.'
                          : 'Create your first engineering post to display on the public website.'}
                      </p>
                      <Link
                        href="/admin/blogs/new"
                        className="admin-btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 8,
                          background: '#0071e3',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: 13,
                          textDecoration: 'none',
                        }}
                      >
                        Write New Article
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div
                        style={{
                          width: 44,
                          height: 34,
                          borderRadius: 6,
                          overflow: 'hidden',
                          background: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {b.featured_image ? (
                          <img
                            src={b.featured_image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--admin-text, #060e24)', fontSize: 14 }}>
                        <Link href={`/admin/blogs/${b.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {b.title}
                        </Link>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--admin-text-sub, #64748b)', fontFamily: 'monospace', marginTop: 2 }}>
                        /blog/{b.slug}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-blue">{b.category}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--admin-text, #060e24)' }}>
                        {b.author_name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-sub, #64748b)' }}>
                        {b.read_time_minutes} min read
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(b)}
                        title={`Click to ${b.status === 'published' ? 'unpublish' : 'publish'}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 9999,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: b.status === 'published' ? '#dcfce7' : '#fef3c7',
                          color: b.status === 'published' ? '#15803d' : '#b45309',
                          transition: 'all 0.16s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: b.status === 'published' ? '#16a34a' : '#d97706',
                          }}
                        />
                        <span>{b.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text, #060e24)' }}>
                        {b.views || 0}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-sub, #94a3b8)' }}>
                      {b.updated_at ? b.updated_at.substring(0, 10) : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setPreviewBlog(b)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: 'var(--admin-card-bg, #ffffff)',
                            border: '1px solid var(--admin-border, #e2e8f0)',
                            color: 'var(--admin-text, #060e24)',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Quick Preview"
                        >
                          Preview
                        </button>
                        <Link
                          href={`/admin/blogs/${b.id}`}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: '#0071e3',
                            color: '#ffffff',
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                          title="Edit Article"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.title)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewBlog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            boxSizing: 'border-box',
          }}
          onClick={() => setPreviewBlog(null)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#060e24',
              borderRadius: 20,
              maxWidth: 780,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px 32px',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewBlog(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  background: '#eff6ff',
                  color: '#0071e3',
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {previewBlog.category}
              </span>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>
                {previewBlog.read_time_minutes} min read
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: previewBlog.status === 'published' ? '#dcfce7' : '#fef3c7',
                  color: previewBlog.status === 'published' ? '#15803d' : '#b45309',
                }}
              >
                {previewBlog.status.toUpperCase()}
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px', color: '#060e24' }}>
              {previewBlog.title}
            </h1>

            {previewBlog.excerpt && (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#475569', margin: '0 0 20px', fontStyle: 'italic' }}>
                {previewBlog.excerpt}
              </p>
            )}

            {previewBlog.featured_image && (
              <div style={{ width: '100%', height: 260, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
                <img
                  src={previewBlog.featured_image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {previewBlog.content}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 32,
                paddingTop: 20,
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Author: <strong>{previewBlog.author_name}</strong>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link
                  href={`/admin/blogs/${previewBlog.id}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#0071e3',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  Edit in Full Editor
                </Link>
                <button
                  type="button"
                  onClick={() => setPreviewBlog(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#f1f5f9',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

