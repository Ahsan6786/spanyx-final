'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AreaTimelineChart, HorizontalBarChart } from '@/components/admin/Charts';

export default function UnifiedAnalyticsPage() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async (selectedRange: string) => {
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
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const overview = data?.overview || {};
  const timeline = data?.timeline || [];
  const popularPages = data?.popularPages || [];
  const sources = data?.sources || [];
  const devices = data?.devices?.devices || [];

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const totalSecs = Math.round(Number(seconds));
    if (totalSecs < 60) return `${totalSecs}s`;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  return (
    <AdminLayout title="Analytics">
      {/* Header & Range Filters */}
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
            Audience Traffic &amp; Content Analytics
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            Consolidated telemetry across sessions, pages, acquisition channels, and devices
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

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14,
          marginBottom: 22,
        }}
      >
        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Unique Visitors
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.unique_visitors || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Deduplicated audience
          </span>
        </div>

        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Total Pageviews
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.total_pageviews || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Total page reads
          </span>
        </div>

        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Total Sessions
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.total_sessions || 0}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Browsing visits
          </span>
        </div>

        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Avg Dwell Time
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {formatDuration(overview.avg_session_duration || 0)}
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Time per session
          </span>
        </div>

        <div className="admin-kpi-card" style={{ padding: '16px 18px' }}>
          <span className="admin-kpi-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Bounce Rate
          </span>
          <span className="admin-kpi-value" style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
            {overview.bounce_rate || '0.0'}%
          </span>
          <span className="admin-kpi-subtext" style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
            Single page visits
          </span>
        </div>
      </div>

      {/* Traffic Over Time Chart */}
      <div className="admin-card" style={{ padding: '20px', marginBottom: 22 }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
            Traffic &amp; Visitor Trajectory
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            Daily unique visitors and session volume over the selected timeframe
          </p>
        </div>
        <AreaTimelineChart data={timeline} height={240} />
      </div>

      {/* Content & Channels Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 18,
          marginBottom: 22,
        }}
      >
        {/* Top Pages */}
        <div className="admin-card" style={{ padding: '18px 20px' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
              Page Engagement Breakdown
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
              Pages ranked by total views, unique visitors, and average dwell
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 600 }}>Page URL</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Views</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Visitors</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 600 }}>Avg Dwell</th>
                </tr>
              </thead>
              <tbody>
                {popularPages.length > 0 ? (
                  popularPages.slice(0, 8).map((p: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 6px', maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <code style={{ fontSize: 12 }}>{p.page_url}</code>
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px', fontWeight: 600 }}>
                        {p.views}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px' }}>
                        {p.unique_visitors}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 6px', color: 'var(--text-muted, #64748b)' }}>
                        {formatDuration(p.avg_time || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted, #64748b)' }}>
                      No pageviews recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acquisition Sources */}
        <div className="admin-card" style={{ padding: '18px 20px' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
              Acquisition Channels
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
              Traffic source attribution and session volume
            </p>
          </div>

          <HorizontalBarChart
            items={sources.map((s: any) => ({
              label: s.source,
              value: s.sessions,
              secondary: `${s.visitors} unique visitors`,
            }))}
          />

          {devices.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: 8 }}>
                DEVICE CATEGORY DISTRIBUTION
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {devices.map((d: any, i: number) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text-primary, #0f172a)' }}>
                    <strong>{d.category}:</strong> {d.count} ({Math.round((d.count / (overview.total_visitors || 1)) * 100)}%)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
