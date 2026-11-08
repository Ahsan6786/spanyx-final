'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'Engineering');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [authorName, setAuthorName] = useState(initialData?.author_name || 'Spanyx Engineering Team');
  const [authorRole, setAuthorRole] = useState(initialData?.author_role || 'Core Architecture');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Auto-generate slug from title if slug was not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setFeaturedImage(json.url);
      } else {
        setErrorMessage(json.error || 'Failed to upload image');
      }
    } catch {
      setErrorMessage('Network error during image upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper toolbar insertion into content textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blogContentTextarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    const updated = content.substring(0, start) + replacement + content.substring(end);
    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 20);
  };

  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please write some content for the article.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      tags: tags.trim(),
      author_name: authorName.trim(),
      author_role: authorRole.trim(),
      featured_image: featuredImage.trim() || null,
      status: finalStatus,
    };

    try {
      const url = isEditing ? `/api/admin/blogs/${initialData.id}` : '/api/admin/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/admin/blogs');
      } else {
        setErrorMessage(json.error || 'Failed to save blog post');
      }
    } catch {
      setErrorMessage('Network error while saving post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Top action header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/admin/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--admin-text-sub, #64748b)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--admin-card-bg, #ffffff)',
              border: '1px solid var(--admin-border, #e2e8f0)',
            }}
          >
            ← Back to Articles
          </Link>
          <span style={{ fontSize: 13, color: 'var(--admin-text-sub, #94a3b8)' }}>
            {isEditing ? 'Editing Article' : 'Drafting New Article'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--admin-card-bg, #ffffff)',
              border: '1px solid var(--admin-border, #e2e8f0)',
              color: 'var(--admin-text, #060e24)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('draft')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('published')}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: '#0071e3',
              border: 'none',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 113, 227, 0.4)',
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Editor Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showPreview ? '1fr 1fr' : '2fr 1fr',
          gap: 24,
        }}
        className="admin-charts-grid-2-1"
      >
        {/* Left: Content & Writing Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--admin-text-sub, #64748b)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Next-Generation Architecture: Moving Beyond Monoliths"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{
                width: '100%',
                fontSize: 18,
                fontWeight: 700,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border, #e2e8f0)',
                background: 'var(--admin-card-bg, #ffffff)',
                color: 'var(--admin-text, #060e24)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--admin-text-sub, #64748b)' }}>URL Slug:</span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-slug"
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--admin-border, #e2e8f0)',
                  background: 'transparent',
                  color: '#0071e3',
                }}
              />
            </div>
          </div>

          {/* Excerpt Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--admin-text-sub, #64748b)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              Short Summary / Excerpt
            </label>
            <textarea
              rows={3}
              placeholder="A concise description displayed on blog index cards and social previews..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              style={{
                width: '100%',
                fontSize: 13.5,
                lineHeight: 1.5,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border, #e2e8f0)',
                background: 'var(--admin-card-bg, #ffffff)',
                color: 'var(--admin-text, #060e24)',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Full Markdown / Content Editor Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--admin-text-sub, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Article Content (Markdown Supported) *
              </label>

              {/* Formatting Helper Buttons */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { label: 'H2', pre: '\n## ', suf: '\n' },
                  { label: 'H3', pre: '\n### ', suf: '\n' },
                  { label: 'B', pre: '**', suf: '**' },
                  { label: 'I', pre: '*', suf: '*' },
                  { label: 'Quote', pre: '\n> ', suf: '\n' },
                  { label: 'Code', pre: '\n```\n', suf: '\n```\n' },
                  { label: 'Bullet', pre: '\n* ', suf: '' },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertFormatting(btn.pre, btn.suf)}
                    style={{
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 4,
                      background: 'var(--admin-border, #f1f5f9)',
                      border: '1px solid var(--admin-border, #e2e8f0)',
                      color: 'var(--admin-text, #334155)',
                      cursor: 'pointer',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              id="blogContentTextarea"
              rows={16}
              placeholder="Write your article in markdown or formatted text...&#10;&#10;## 1. Introduction&#10;Your detailed technical narrative here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                fontSize: 14,
                lineHeight: 1.6,
                padding: '14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border, #e2e8f0)',
                background: 'var(--admin-card-bg, #ffffff)',
                color: 'var(--admin-text, #060e24)',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, monospace',
              }}
            />
          </div>
        </div>

        {/* Right: Metadata, Cover Image & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Publishing Status Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--admin-text, #060e24)',
                margin: '0 0 14px',
              }}
            >
              Publication Controls
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginTop: 4,
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    background: 'var(--admin-card-bg, #ffffff)',
                    color: 'var(--admin-text, #060e24)',
                    fontSize: 13,
                  }}
                >
                  <option value="draft">Draft (Hidden from public site)</option>
                  <option value="published">Published (Live on /blog)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginTop: 4,
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    background: 'var(--admin-card-bg, #ffffff)',
                    color: 'var(--admin-text, #060e24)',
                    fontSize: 13,
                  }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Architecture">Architecture</option>
                  <option value="AI &amp; Cloud">AI &amp; Cloud</option>
                  <option value="Security">Security &amp; Compliance</option>
                  <option value="Case Studies">Case Studies</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                  TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Cloud, Performance"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginTop: 4,
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    background: 'var(--admin-card-bg, #ffffff)',
                    color: 'var(--admin-text, #060e24)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Featured Image Cover Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--admin-text, #060e24)',
                margin: '0 0 14px',
              }}
            >
              Cover / Featured Image
            </h4>

            {featuredImage ? (
              <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: '2px dashed var(--admin-border, #cbd5e1)',
                  borderRadius: 8,
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: 'var(--admin-card-bg, #fafafa)',
                  marginBottom: 12,
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.6"
                  style={{ margin: '0 auto 8px' }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ fontSize: 12.5, color: 'var(--admin-text-sub, #64748b)', margin: '0 0 10px' }}>
                  {isUploading ? 'Uploading image...' : 'Upload cover or paste image URL'}
                </p>
                <label
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: 6,
                    background: '#0071e3',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                OR IMAGE URL
              </label>
              <input
                type="text"
                placeholder="https://... or /span/back-square.png"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  marginTop: 4,
                  fontSize: 12,
                  border: '1px solid var(--admin-border, #e2e8f0)',
                  background: 'var(--admin-card-bg, #ffffff)',
                  color: 'var(--admin-text, #060e24)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Author Details Card */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--admin-text, #060e24)',
                margin: '0 0 14px',
              }}
            >
              Author Attribution
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                  AUTHOR NAME
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginTop: 4,
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    background: 'var(--admin-card-bg, #ffffff)',
                    color: 'var(--admin-text, #060e24)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-sub, #64748b)' }}>
                  ROLE / DEPARTMENT
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginTop: 4,
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    background: 'var(--admin-card-bg, #ffffff)',
                    color: 'var(--admin-text, #060e24)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Pane when toggled */}
      {showPreview && (
        <div className="admin-card" style={{ marginTop: 28, padding: 32 }}>
          <div style={{ borderBottom: '1px solid var(--admin-border, #e2e8f0)', paddingBottom: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase' }}>
              Live Reader Preview
            </span>
          </div>

          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-block',
                background: '#eff6ff',
                color: '#0071e3',
                padding: '4px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {category}
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--admin-text, #060e24)', margin: '0 0 16px', lineHeight: 1.25 }}>
              {title || 'Untitled Post'}
            </h1>
            {excerpt && (
              <p style={{ fontSize: 17, color: 'var(--admin-text-sub, #475569)', fontStyle: 'italic', margin: '0 0 24px', lineHeight: 1.5 }}>
                {excerpt}
              </p>
            )}
            {featuredImage && (
              <div style={{ width: '100%', height: 320, borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
                <img
                  src={featuredImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: 'var(--admin-text, #1e293b)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {content || 'Start typing in the editor above to preview content...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

