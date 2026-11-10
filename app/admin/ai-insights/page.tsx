'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAiInsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInsights = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/ai/insights${force ? '?force=true' : ''}`, {
        method: force ? 'POST' : 'GET',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setInsights(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights(false);
  }, []);

  const categories = [
    {
      key: 'performance',
      label: 'Performance',
      subtitle: 'Which pages are performing best?',
      color: '#0066FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      data: insights?.performance,
    },
    {
      key: 'leads',
      label: 'Leads',
      subtitle: 'Which services generate the most inquiries?',
      color: '#10b981',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      data: insights?.leads,
    },
    {
      key: 'opportunities',
      label: 'Opportunities',
      subtitle: 'Which pages could generate more leads?',
      color: '#f59e0b',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
      data: insights?.opportunities,
    },
    {
      key: 'recommendations',
      label: 'Recommendations',
      subtitle: 'What concrete step should SPANYX improve next?',
      color: '#8b5cf6',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      data: insights?.recommendations,
    },
  ];

  return (
    <AdminLayout title="AI Insights">
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
            Strategic Intelligence
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            Actionable recommendations synthesized from actual audience navigation and conversions
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {insights?.cached && (
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted, #64748b)',
                background: 'rgba(0,0,0,0.03)',
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-color, #e2e8f0)',
              }}
            >
              Cached (Zero API Cost)
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchInsights(true)}
            disabled={isRefreshing}
            style={{
              background: '#0066FF',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: isRefreshing ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {isRefreshing ? 'Synthesizing with Gemini...' : 'Regenerate Insights'}
          </button>
        </div>
      </div>

      {/* 4 Categorized Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        {categories.map((cat) => {
          const item = cat.data;
          return (
            <div
              key={cat.key}
              className="admin-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `3px solid ${cat.color}`,
              }}
            >
              <div>
                {/* Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: `rgba(${cat.color === '#0066FF' ? '0,102,255' : cat.color === '#10b981' ? '16,185,129' : cat.color === '#f59e0b' ? '245,158,11' : '139,92,246'}, 0.1)`,
                      color: cat.color,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                      {cat.label}
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted, #64748b)', margin: '1px 0 0' }}>
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Insight Title */}
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: '0 0 8px' }}>
                  {item?.title || 'Evaluating telemetry...'}
                </h4>

                {/* Description (1-2 sentences) */}
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary, #334155)', margin: '0 0 14px', lineHeight: 1.55 }}>
                  {item?.description || 'Gathering historical user browsing sessions to detect performance patterns.'}
                </p>

                {/* Supporting Metric Pill */}
                {item?.metric && (
                  <div style={{ marginBottom: 14 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 9px',
                        background: 'rgba(0,0,0,0.03)',
                        borderRadius: 6,
                        border: '1px solid var(--border-color, #e2e8f0)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-primary, #0f172a)',
                      }}
                    >
                      <span style={{ color: cat.color }}>●</span> Supporting Signal: {item.metric}
                    </span>
                  </div>
                )}
              </div>

              {/* Recommended Action */}
              {item?.action && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: `rgba(${cat.color === '#0066FF' ? '0,102,255' : cat.color === '#10b981' ? '16,185,129' : cat.color === '#f59e0b' ? '245,158,11' : '139,92,246'}, 0.06)`,
                    borderLeft: `3px solid ${cat.color}`,
                    borderRadius: '0 6px 6px 0',
                    fontSize: 12.5,
                    color: 'var(--text-primary, #0f172a)',
                    marginTop: 6,
                  }}
                >
                  <strong style={{ color: cat.color, marginRight: 5 }}>Recommended Action:</strong>
                  {item.action}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

