'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { HorizontalBarChart } from '@/components/admin/Charts';

export default function ServicesAnalyticsPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard?range=30d')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setServices(json.data.serviceInterests || []);
      });
  }, []);

  return (
    <AdminLayout title="Service Interest &amp; Offering Telemetry">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Comparative Service Interest Scoring</h3>
            <p className="admin-card-desc">Computed from page dwell time, repeat reading, and CTA clicks</p>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <HorizontalBarChart
            items={services.map((s) => ({
              label: s.name,
              value: s.interest_score,
              secondary: `${s.views} views, ${s.cta_clicks} CTA clicks`,
            }))}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Service Category</th>
              <th>Total Views</th>
              <th>Total Dwell Time</th>
              <th>Avg Scroll Depth</th>
              <th>CTA Triggers</th>
              <th>Interest Score</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s: any, idx: number) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: '#060e24' }}>{s.name}</td>
                <td>{s.views}</td>
                <td>{Math.round(s.total_time_seconds / 60)} mins</td>
                <td>{s.avg_scroll}%</td>
                <td><span className="admin-badge admin-badge-blue">{s.cta_clicks} CTAs</span></td>
                <td><strong style={{ color: '#1d5cff', fontSize: 15 }}>{s.interest_score} pts</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

