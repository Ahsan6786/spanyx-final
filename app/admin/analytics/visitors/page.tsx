'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function VisitorsAnalyticsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadVisitors = async (page: number, searchTerm: string) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), pageSize: '15' });
      if (searchTerm) q.append('search', searchTerm);
      const res = await fetch(`/api/admin/visitors?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setVisitors(json.visitors || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors(pagination.page, search);
  }, [pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadVisitors(1, search);
  };

  return (
    <AdminLayout title="Visitor Analytics &amp; Profiles">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">All First-Party Visitors</h3>
            <p className="admin-card-desc">Click any visitor ID to inspect their permitted journey, page sequences, and interactions.</p>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Search ID, browser, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                minWidth: 240,
              }}
            />
            <button
              type="submit"
              style={{
                background: '#060e24',
                color: '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Filter
            </button>
          </form>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Visitor ID</th>
                <th>Device</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Location</th>
                <th>Last Acquisition Source</th>
                <th>Total Pages</th>
                <th>Visits</th>
                <th>Consent Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: 28 }}>
                    {isLoading ? 'Loading visitor records...' : 'No visitors found.'}
                  </td>
                </tr>
              ) : (
                visitors.map((v: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <Link
                        href={`/admin/analytics/visitors/${v.visitor_id}`}
                        style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d5cff', textDecoration: 'none' }}
                      >
                        {v.visitor_id.substring(0, 16)}...
                      </Link>
                    </td>
                    <td>{v.device_category || 'Desktop'}</td>
                    <td>{v.browser || '—'}</td>
                    <td>{v.os || '—'}</td>
                    <td>{v.country || 'India'}</td>
                    <td>
                      <span className="admin-badge admin-badge-blue">{v.last_source || 'Direct'}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{v.total_pages || 0}</td>
                    <td>{v.visit_count}</td>
                    <td>
                      <span className="admin-badge admin-badge-low">
                        {v.consent_status || 'not_recorded'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {v.last_visit_at ? v.last_visit_at.substring(0, 16).replace('T', ' ') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Showing {visitors.length} of {pagination.total} visitors (Page {pagination.page} of {pagination.totalPages || 1})
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 ? 0.5 : 1,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= pagination.totalPages ? 0.5 : 1,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

