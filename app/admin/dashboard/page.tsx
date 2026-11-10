'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchDashboardData = async (selectedRange: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAiSummary = async (force = false) => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/summary${force ? '?force=true' : ''}`, {
        method: force ? 'POST' : 'GET',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setAiSummary(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI summary:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  useEffect(() => {
    fetchAiSummary(false);
  }, []);

  const overview = data?.overview || {};
  const popularPages = (data?.popularPages || []).slice(0, 5);
  const sources = (data?.sources || []).slice(0, 5);
  const recentLeads = (data?.recentLeads || []).slice(0, 4);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const totalSecs = Math.round(Number(seconds));
    if (totalSecs < 60) return `${totalSecs}s`;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  return (
    <AdminLayout title="Overview">
      {/* Top Controls: Filter Pills */}
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
            Business Performance
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            First-party audience telemetry, inbound leads, and AI synthesis
          </p>
        </div>

        <div className="admin-filter-pills" style={{ display: 'inline-flex', gap: 4 }}>
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`admin-filter-pill ${range === pill.id ? 'is-active' : ''}`}
              onClick={() => setRange(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Essential Compact KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {/* 1. Visitors */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Visitors
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.unique_visitors || overview.total_visitors || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Unique audience
          </span>
        </div>

        {/* 2. Sessions */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sessions
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.total_sessions || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Total browsing visits
          </span>
        </div>

        {/* 3. Page Views */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Page Views
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.total_pageviews || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Total page impressions
          </span>
        </div>

        {/* 4. Leads */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Leads
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#0066FF' }}>
            {overview.contact_submissions || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Inbound inquiries
          </span>
        </div>

        {/* 5. Conversion Rate */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Conversion Rate
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#10b981' }}>
            {overview.conversion_rate || '0.00'}%
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Session-to-inquiry
          </span>
        </div>

        {/* 6. Avg Engagement Time */}
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Avg Engagement Time
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {formatDuration(overview.avg_session_duration || 0)}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Average dwell time
          </span>
        </div>
      </div>

      {/* AI Business Summary Card */}
      <div
        className="admin-card"
        style={{
          padding: '20px 22px',
          marginBottom: 22,
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
          borderColor: 'rgba(0, 102, 255, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#0066FF',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.03em',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              AI BUSINESS SUMMARY
            </span>
            {aiSummary?.cached && (
              <span style={{ fontSize: 11, color: 'var(--text-muted, #64748b)' }}>
                • Persistent Cache (Zero API Cost)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchAiSummary(true)}
            disabled={isAiLoading}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary, #0f172a)',
              cursor: isAiLoading ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: isAiLoading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {isAiLoading ? 'Analyzing...' : 'Refresh Insights'}
          </button>
        </div>

        <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary, #0f172a)', margin: '0 0 10px' }}>
          {aiSummary?.headline || 'Analyzing platform audience trajectory and conversion telemetry...'}
        </p>

        {aiSummary?.insights && (
          <ul style={{ margin: '0 0 12px 18px', padding: 0, fontSize: 13.5, color: 'var(--text-secondary, #334155)', lineHeight: 1.6 }}>
            {aiSummary.insights.map((pt: string, idx: number) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {pt}
              </li>
            ))}
          </ul>
        )}

        {aiSummary?.recommended_action && (
          <div
            style={{
              padding: '8px 12px',
              background: 'rgba(0, 102, 255, 0.05)',
              borderLeft: '3px solid #0066FF',
              borderRadius: '0 6px 6px 0',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary, #0f172a)',
            }}
          >
            <strong style={{ color: '#0066FF', marginRight: 6 }}>Next Action:</strong>
            {aiSummary.recommended_action}
          </div>
        )}
      </div>

      {/* Two Column Layout: Top Performing Pages & Traffic Sources */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 18,
          marginBottom: 22,
        }}
      >
        {/* Top 5 Performing Pages */}
        <div className="admin-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                Top Performing Pages
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
                Ranked by unique visitors and qualified lead generation
              </p>
            </div>
            <Link
              href="/admin/analytics"
              style={{ fontSize: 12, fontWeight: 600, color: '#0066FF', textDecoration: 'none' }}
            >
              All Pages →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 600 }}>Page</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Visitors</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Leads</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Avg Dwell</th>
                </tr>
              </thead>
              <tbody>
                {popularPages.length > 0 ? (
                  popularPages.map((p: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 6px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                          {p.page_url === '/' ? 'Home (/)' : p.page_url}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px', fontWeight: 600 }}>
                        {p.unique_visitors || p.visitors || 0}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px' }}>
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 700,
                            background: p.leads > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.1)',
                            color: p.leads > 0 ? '#059669' : '#64748b',
                          }}
                        >
                          {p.leads || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px', color: 'var(--text-muted, #64748b)' }}>
                        {formatDuration(p.avg_time || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted, #64748b)' }}>
                      No pageviews recorded yet for this timeframe.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="admin-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                Traffic Sources
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
                Primary channels driving audience discovery
              </p>
            </div>
            <Link
              href="/admin/analytics"
              style={{ fontSize: 12, fontWeight: 600, color: '#0066FF', textDecoration: 'none' }}
            >
              Details →
            </Link>
          </div>

          <div>
            {sources.length > 0 ? (
              sources.map((src: any, idx: number) => {
                const totalSessions = overview.total_sessions || 1;
                const pct = Math.min(100, Math.round(((src.sessions || 1) / totalSessions) * 100));
                return (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{src.source}</span>
                      <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
                        {src.sessions} visits ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 6,
                        background: 'var(--border-color, #e2e8f0)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: idx === 0 ? '#0066FF' : idx === 1 ? '#38bdf8' : '#818cf8',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted, #64748b)', fontSize: 13 }}>
                Direct visits represent your baseline acquisition channel.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Inbound Leads Preview */}
      <div className="admin-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
              Recent Inquiries
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
              Latest form submissions with form source attribution
            </p>
          </div>
          <Link
            href="/admin/leads"
            style={{ fontSize: 12, fontWeight: 600, color: '#0066FF', textDecoration: 'none' }}
          >
            Manage All Leads →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 8px', fontWeight: 600 }}>Lead</th>
                <th style={{ textAlign: 'left', padding: '8px 8px', fontWeight: 600 }}>Interested Service</th>
                <th style={{ textAlign: 'left', padding: '8px 8px', fontWeight: 600 }}>Source Page</th>
                <th style={{ textAlign: 'left', padding: '8px 8px', fontWeight: 600 }}>Traffic Channel</th>
                <th style={{ textAlign: 'right', padding: '8px 8px', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length > 0 ? (
                recentLeads.map((ld: any) => (
                  <tr key={ld.id}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{ld.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>{ld.email}</div>
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                      {ld.interested_service || 'Custom Development'}
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted, #64748b)' }}>
                      <code>{ld.source_page || ld.first_landing_page || '/'}</code>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: 'rgba(0, 102, 255, 0.08)',
                          color: '#0066FF',
                        }}
                      >
                        {ld.traffic_source || 'Direct'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                      <Link
                        href={`/admin/leads?id=${ld.id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#0066FF',
                          textDecoration: 'none',
                          border: '1px solid rgba(0, 102, 255, 0.25)',
                          borderRadius: 6,
                          padding: '4px 8px',
                        }}
                      >
                        Inspect Journey
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted, #64748b)' }}>
                    No leads received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
