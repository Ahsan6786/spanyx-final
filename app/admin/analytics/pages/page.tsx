'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PagesAnalyticsPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    fetch(`/api/admin/dashboard?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPages(json.data.popularPages || []);
      });
  }, [range]);

  return (
    <AdminLayout title="Page-Level Content Analytics">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">All Content &amp; Solution Pages</h3>
            <p className="admin-card-desc">Detailed dwell time, reader retention, and scroll completion per page URL</p>
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

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Total Views</th>
                <th>Unique Readers</th>
                <th>Avg Dwell Time</th>
                <th>Avg Scroll Depth</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#1d5cff', fontWeight: 600 }}>{p.page_url}</span>
                  </td>
                  <td>{p.views}</td>
                  <td>{p.unique_visitors}</td>
                  <td>{p.avg_time}s</td>
                  <td>
                    <span style={{ fontWeight: 600, color: p.avg_scroll >= 75 ? '#059669' : '#060e24' }}>
                      {p.avg_scroll}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

