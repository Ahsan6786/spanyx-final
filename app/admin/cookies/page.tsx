'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function CookieManagementAdminPage() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (pageNumber: number, searchTerm: string) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({ page: String(pageNumber), pageSize: '15' });
      if (searchTerm) q.append('search', searchTerm);
      const res = await fetch(`/api/admin/cookies?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(page, search);
  }, [page]);

  const overview = data?.overview || {};
  const records = data?.records || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };

  return (
    <AdminLayout title="Cookie Consent &amp; Privacy Management">
      {/* Overview Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total Consent Records</span>
          <span className="admin-kpi-value">{overview.total_records || 0}</span>
          <span className="admin-kpi-subtext">All visitor submissions</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Accepted All Rate</span>
          <span className="admin-kpi-value" style={{ color: '#059669' }}>
            {overview.acceptance_rate || 0}%
          </span>
          <span className="admin-kpi-subtext">{overview.accepted_all || 0} full opt-ins</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Rejected Optional</span>
          <span className="admin-kpi-value" style={{ color: '#64748b' }}>
            {overview.rejected_optional || 0}
          </span>
          <span className="admin-kpi-subtext">Strictly necessary only</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Custom Preferences</span>
          <span className="admin-kpi-value" style={{ color: '#1d5cff' }}>
            {overview.custom || 0}
          </span>
          <span className="admin-kpi-subtext">Granular opt-ins</span>
        </div>
      </div>

      {/* Category Adoption Strip */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Category-Wise Consent Opt-In Rates</h3>
            <p className="admin-card-desc">DPDP Act Granular Consent Distribution</p>
          </div>
          <Link href="/admin/cookies/inventory" style={{ fontSize: 13, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
            View Cookie Inventory →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Strictly Necessary', rate: 100, color: '#060e24', desc: 'Always active (Security & Auth)' },
            { label: 'Functional', rate: overview.category_rates?.functional || 0, color: '#1d5cff', desc: 'Theme & UX Preferences' },
            { label: 'Analytics', rate: overview.category_rates?.analytics || 0, color: '#059669', desc: 'Telemetry & Pageviews' },
            { label: 'Marketing', rate: overview.category_rates?.marketing || 0, color: '#d97706', desc: 'Campaign Attribution' },
          ].map((cat, idx) => (
            <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#060e24' }}>{cat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: cat.color, margin: '6px 0 2px' }}>{cat.rate}%</div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Audit Records Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Consent Records &amp; Audit Trail</h3>
            <p className="admin-card-desc">Individual consent transactions recorded with IP hash and versioning</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              loadData(1, search);
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              type="text"
              placeholder="Search consent ID or visitor..."
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
                <th>Consent ID</th>
                <th>Visitor ID</th>
                <th>Necessary</th>
                <th>Functional</th>
                <th>Analytics</th>
                <th>Marketing</th>
                <th>Consent Status</th>
                <th>Policy Ver</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
                    {isLoading ? 'Loading records...' : 'No consent records found.'}
                  </td>
                </tr>
              ) : (
                records.map((r: any) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1d5cff' }}>{r.consent_id}</span>
                    </td>
                    <td>
                      <Link href={`/admin/analytics/visitors/${r.visitor_id}`} style={{ fontFamily: 'monospace', color: 'inherit', textDecoration: 'none' }}>
                        {r.visitor_id.substring(0, 14)}...
                      </Link>
                    </td>
                    <td><span className="admin-badge admin-badge-high">Active</span></td>
                    <td>
                      <span className={`admin-badge ${r.functional ? 'admin-badge-high' : 'admin-badge-low'}`}>
                        {r.functional ? 'Granted' : 'Denied'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${r.analytics ? 'admin-badge-high' : 'admin-badge-low'}`}>
                        {r.analytics ? 'Granted' : 'Denied'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${r.marketing ? 'admin-badge-high' : 'admin-badge-low'}`}>
                        {r.marketing ? 'Granted' : 'Denied'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-blue">{r.consent_status}</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{r.policy_version}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {r.created_at?.substring(0, 19).replace('T', ' ')}
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
            Showing {records.length} of {pagination.total} records
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                opacity: page <= 1 ? 0.5 : 1,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                opacity: page >= pagination.totalPages ? 0.5 : 1,
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

