'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AreaTimelineChart, HorizontalBarChart, InteractiveDonutChart } from '@/components/admin/Charts';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  const overview = data?.overview || {};
  const timeline = data?.timeline || [];
  const sources = data?.sources || [];
  const devices = data?.devices || { devices: [], browsers: [] };
  const popularPages = data?.popularPages || [];
  const serviceInterests = data?.serviceInterests || [];
  const recentLeads = data?.recentLeads || [];

  return (
    <AdminLayout title="Executive Overview">
      {/* Date Filter Bar */}
      <div className="admin-filter-bar">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#060e24' }}>Platform Performance Telemetry</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Real-time first-party visitor intelligence and lead acquisition</p>
        </div>

        <div className="admin-filter-pills">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
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

      {/* 8 Primary KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Visitors</span>
          <span className="admin-kpi-value">{overview.total_visitors || 0}</span>
          <span className="admin-kpi-subtext">All recorded sessions</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Unique Visitors</span>
          <span className="admin-kpi-value" style={{ color: '#1d5cff' }}>{overview.unique_visitors || 0}</span>
          <span className="admin-kpi-subtext">First-party deduplicated</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Sessions</span>
          <span className="admin-kpi-value">{overview.total_sessions || 0}</span>
          <span className="admin-kpi-subtext">{overview.engaged_sessions || 0} Engaged</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Returning Visitors</span>
          <span className="admin-kpi-value">{overview.returning_visitors || 0}</span>
          <span className="admin-kpi-subtext">High Brand Affinity</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Avg. Session Duration</span>
          <span className="admin-kpi-value">{overview.avg_session_duration || 0}s</span>
          <span className="admin-kpi-subtext">Dwell time per visit</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Page Views</span>
          <span className="admin-kpi-value">{overview.total_pageviews || 0}</span>
          <span className="admin-kpi-subtext">Content impressions</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Form Submissions</span>
          <span className="admin-kpi-value" style={{ color: '#059669' }}>{overview.contact_submissions || 0}</span>
          <span className="admin-kpi-subtext">Qualified inquiries</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Conversion Rate</span>
          <span className="admin-kpi-value" style={{ color: '#059669' }}>{overview.conversion_rate || '0.00'}%</span>
          <span className="admin-kpi-subtext">Session-to-lead ratio</span>
        </div>
      </div>

      {/* Main Charts Row: Responsive Grid */}
      <div className="admin-charts-grid-2-1">
        {/* Visitors Over Time */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Traffic &amp; Engagement Trajectory</h3>
              <p className="admin-card-desc">Daily unique visitors and active sessions with interactive telemetry inspection</p>
            </div>
          </div>
          <AreaTimelineChart data={timeline} height={260} />
        </div>

        {/* Traffic Sources Interactive Donut */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Traffic Origins</h3>
              <p className="admin-card-desc">Breakdown by acquisition channel</p>
            </div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <InteractiveDonutChart
              items={
                sources.length > 0
                  ? sources.map((s: any) => ({
                      label: s.source,
                      count: s.sessions,
                    }))
                  : [{ label: 'Direct', count: 1 }]
              }
              totalLabel="Sessions"
              size={180}
            />
          </div>
        </div>
      </div>

      {/* Service Interest & Devices: Responsive Grid */}
      <div className="admin-charts-grid-1-1">
        {/* Service Interest Detection */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Service Interest Scoring</h3>
              <p className="admin-card-desc">Algorithmic intent calculated from dwell time, scroll depth, and CTA triggers</p>
            </div>
            <Link href="/admin/analytics/visitors" style={{ fontSize: 12.5, fontWeight: 600, color: '#0071e3', textDecoration: 'none' }}>
              View Telemetry →
            </Link>
          </div>
          <HorizontalBarChart
            items={serviceInterests.slice(0, 5).map((s: any) => ({
              label: s.name,
              value: s.interest_score,
              secondary: `${s.views} views`,
            }))}
          />
        </div>

        {/* Device & Hardware Profiles Interactive Donut */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Device &amp; Environment Profiles</h3>
              <p className="admin-card-desc">Client platforms and screen category share</p>
            </div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <InteractiveDonutChart
              items={
                devices.devices && devices.devices.length > 0
                  ? devices.devices.map((d: any) => ({
                      label: d.category || 'Desktop',
                      count: d.count,
                    }))
                  : [
                      { label: 'Mobile', count: 65, color: '#0071e3' },
                      { label: 'Desktop', count: 35, color: '#38bdf8' },
                    ]
              }
              totalLabel="Devices"
              size={180}
            />
          </div>
        </div>
      </div>

      {/* Popular Pages Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Most Engaging Architectural Pages</h3>
            <p className="admin-card-desc">Top visited solutions, industry showcases, and technical offerings</p>
          </div>
          <Link href="/admin/analytics/pages" style={{ fontSize: 12.5, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
            Full Report →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Views</th>
                <th>Unique Visitors</th>
                <th>Avg Dwell Time</th>
                <th>Avg Scroll Depth</th>
              </tr>
            </thead>
            <tbody>
              {popularPages.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
                    No pageviews recorded yet.
                  </td>
                </tr>
              ) : (
                popularPages.map((page: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#060e24' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#1d5cff' }}>{page.page_url}</span>
                    </td>
                    <td>{page.views}</td>
                    <td>{page.unique_visitors}</td>
                    <td>{page.avg_time}s</td>
                    <td>
                      <span style={{ fontWeight: 600, color: page.avg_scroll >= 75 ? '#059669' : '#060e24' }}>
                        {page.avg_scroll}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Inbound Leads */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Recent Inbound Potential Clients</h3>
            <p className="admin-card-desc">Voluntarily submitted contact inquiries enriched with visitor journey telemetry</p>
          </div>
          <Link href="/admin/leads" style={{ fontSize: 12.5, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
            Manage Leads →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Work Email</th>
                <th>Company</th>
                <th>Interested Service</th>
                <th>Lead Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
                    No contact form submissions recorded yet.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead: any, idx: number) => {
                  let badgeClass = 'admin-badge-low';
                  if (lead.lead_score >= 50) badgeClass = 'admin-badge-high';
                  else if (lead.lead_score >= 25) badgeClass = 'admin-badge-medium';

                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: '#060e24' }}>
                        <Link href={`/admin/leads/${lead.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {lead.name}
                        </Link>
                      </td>
                      <td style={{ color: '#64748b' }}>{lead.email}</td>
                      <td>{lead.company || '—'}</td>
                      <td>{lead.interested_service || 'Custom Development'}</td>
                      <td>
                        <span className={`admin-badge ${badgeClass}`}>
                          {lead.lead_score} pts
                        </span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-blue">{lead.status}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#94a3b8' }}>
                        {lead.created_at?.substring(0, 10)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

