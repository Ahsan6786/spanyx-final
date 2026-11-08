'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 15, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = async (page: number, status: string, searchTerm: string) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), pageSize: '15' });
      if (status !== 'All') q.append('status', status);
      if (searchTerm) q.append('search', searchTerm);

      const res = await fetch(`/api/admin/leads?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads(pagination.page, statusFilter, search);
  }, [pagination.page, statusFilter]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <AdminLayout title="Leads &amp; Potential Client Acquisition">
      {/* Filters and Status Tabs */}
      <div className="admin-filter-bar">
        <div className="admin-filter-pills">
          {['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'].map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-filter-pill ${statusFilter === st ? 'is-active' : ''}`}
              onClick={() => {
                setStatusFilter(st);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadLeads(1, statusFilter, search);
          }}
          style={{ display: 'flex', gap: 8 }}
        >
          <input
            type="text"
            placeholder="Search lead name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none',
              minWidth: 260,
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
            Search
          </button>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Inbound Client Pipeline</h3>
            <p className="admin-card-desc">Leads scored automatically based on interaction telemetry &amp; service exploration.</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Work Email</th>
                <th>Company</th>
                <th>Company Size</th>
                <th>Interested Service</th>
                <th>Lead Score</th>
                <th>Status</th>
                <th>Traffic Source</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: 28 }}>
                    {isLoading ? 'Loading inbound leads...' : 'No leads match the filter criteria.'}
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => {
                  let badgeClass = 'admin-badge-low';
                  if (lead.lead_score >= 50) badgeClass = 'admin-badge-high';
                  else if (lead.lead_score >= 25) badgeClass = 'admin-badge-medium';

                  return (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: 700, color: '#060e24' }}>
                        <Link href={`/admin/leads/${lead.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {lead.name}
                        </Link>
                      </td>
                      <td style={{ color: '#64748b' }}>{lead.email}</td>
                      <td>{lead.company || lead.website || '—'}</td>
                      <td>{lead.company_size || '1-10'}</td>
                      <td>{lead.interested_service || 'Custom Development'}</td>
                      <td>
                        <span className={`admin-badge ${badgeClass}`}>
                          {lead.lead_score} pts
                        </span>
                      </td>
                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            fontSize: 12,
                            fontWeight: 600,
                            background: '#ffffff',
                            color: '#060e24',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-blue">{lead.traffic_source || 'Direct'}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b' }}>
                        {lead.created_at?.substring(0, 10)}
                      </td>
                      <td>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: '#1d5cff',
                            textDecoration: 'none',
                          }}
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Showing {leads.length} of {pagination.total} leads (Page {pagination.page} of {pagination.totalPages || 1})
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

