'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AreaTimelineChart } from '@/components/admin/Charts';

export default function TrafficAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    fetch(`/api/admin/dashboard?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      });
  }, [range]);

  const overview = data?.overview || {};
  const timeline = data?.timeline || [];

  return (
    <AdminLayout title="Website Traffic Telemetry">
      <div className="admin-filter-bar">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Traffic Volume &amp; Engagement Health</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Visitor sessions, bounce rates, and navigation volume</p>
        </div>

        <div className="admin-filter-pills">
          {['today', '7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              type="button"
              className={`admin-filter-pill ${range === r ? 'is-active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r === 'today' ? 'Today' : `Last ${r}`}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Sessions</span>
          <span className="admin-kpi-value">{overview.total_sessions || 0}</span>
          <span className="admin-kpi-subtext">Active visits</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Unique Visitors</span>
          <span className="admin-kpi-value" style={{ color: '#1d5cff' }}>{overview.unique_visitors || 0}</span>
          <span className="admin-kpi-subtext">First-party</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Bounce Rate</span>
          <span className="admin-kpi-value">{overview.bounce_rate || '0.0'}%</span>
          <span className="admin-kpi-subtext">&lt; 10s single-page visits</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Avg Duration</span>
          <span className="admin-kpi-value">{overview.avg_session_duration || 0}s</span>
          <span className="admin-kpi-subtext">Time spent per session</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Daily Session &amp; Visitor Curves</h3>
            <p className="admin-card-desc">Comparative graph of total sessions vs unique individuals</p>
          </div>
        </div>
        <AreaTimelineChart data={timeline} height={300} />
      </div>
    </AdminLayout>
  );
}

