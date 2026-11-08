'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SourcesAnalyticsPage() {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard?range=30d')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSources(json.data.sources || []);
      });
  }, []);

  return (
    <AdminLayout title="Traffic Source &amp; Inbound Channel Analytics">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Inbound Channels</h3>
            <p className="admin-card-desc">Where Spanyx website visitors originate from</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Acquisition Source</th>
                <th>Sessions Generated</th>
                <th>Unique Visitors</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: '#060e24' }}>{s.source}</td>
                  <td><span className="admin-badge admin-badge-blue">{s.sessions} sessions</span></td>
                  <td>{s.visitors} visitors</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

