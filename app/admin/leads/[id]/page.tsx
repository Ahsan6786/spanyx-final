'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [leadData, setLeadData] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLead = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLeadData(json.data);
          setNewStatus(json.data.lead.status);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: id, status: newStatus, notes: statusNotes }),
      });
      if (res.ok) {
        setStatusNotes('');
        await fetchLead();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Lead Profile">
        <p style={{ color: '#64748b' }}>Loading lead profile...</p>
      </AdminLayout>
    );
  }

  if (!leadData) {
    return (
      <AdminLayout title="Lead Profile">
        <p style={{ color: '#ef4444' }}>Lead record not found.</p>
        <Link href="/admin/leads" style={{ color: '#1d5cff' }}>← Back to Leads</Link>
      </AdminLayout>
    );
  }

  const { lead, activities, visitorJourney } = leadData;

  let badgeClass = 'admin-badge-low';
  if (lead.lead_score >= 50) badgeClass = 'admin-badge-high';
  else if (lead.lead_score >= 25) badgeClass = 'admin-badge-medium';

  return (
    <AdminLayout title={`Lead Profile: ${lead.name}`}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/leads" style={{ fontSize: 13, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
          ← Back to Lead Pipeline
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Left Column: Lead Info & Message */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Inquiry Information</h3>
              <p className="admin-card-desc">Submitted via Spanyx Contact Overlay</p>
            </div>
            <span className={`admin-badge ${badgeClass}`} style={{ fontSize: 14, padding: '6px 14px' }}>
              Lead Score: {lead.lead_score} pts
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#060e24', marginTop: 3 }}>{lead.name}</div>
            </div>
            <div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Work Email</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1d5cff', marginTop: 3 }}>
                <a href={`mailto:${lead.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{lead.email}</a>
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Company / Website</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#060e24', marginTop: 3 }}>
                {lead.website ? <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" style={{ color: '#1d5cff' }}>{lead.website}</a> : lead.company || '—'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Company Size</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#060e24', marginTop: 3 }}>{lead.company_size || '1-10'} employees</div>
            </div>
          </div>

          {lead.message && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Project Inquiry / Details</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#1e293b', background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 8 }}>
                {lead.message}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Status & Stage Management */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Deal Progression</h3>
              <p className="admin-card-desc">Update stage &amp; audit notes</p>
            </div>
          </div>

          <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Current Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13.5,
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Activity Notes
              </label>
              <textarea
                rows={3}
                placeholder="Log call outcome, proposal details..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              style={{
                background: '#1d5cff',
                color: '#ffffff',
                border: 'none',
                padding: '10px',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isUpdating ? 'Saving...' : 'Update Lead Status'}
            </button>
          </form>

          {/* Audit trail */}
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Activity History</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {activities.map((act: any, idx: number) => (
                <div key={idx} style={{ fontSize: 12.5, color: '#475569', borderLeft: '2px solid #1d5cff', paddingLeft: 10 }}>
                  <div style={{ fontWeight: 600, color: '#060e24' }}>{act.description}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{act.timestamp?.substring(0, 16).replace('T', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Linked Visitor Pre-Submission Journey */}
      {visitorJourney && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Pre-Submission Browsing History</h3>
              <p className="admin-card-desc">Pages and architectural solutions explored prior to submitting inquiry</p>
            </div>
            {lead.visitor_id && (
              <Link href={`/admin/analytics/visitors/${lead.visitor_id}`} style={{ fontSize: 12.5, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
                Full Visitor Profile →
              </Link>
            )}
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Dwell Time</th>
                <th>Scroll Depth</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {visitorJourney.pageviews?.map((pv: any, idx: number) => (
                <tr key={idx}>
                  <td><span style={{ fontFamily: 'monospace', color: '#1d5cff', fontWeight: 600 }}>{pv.page_url}</span></td>
                  <td>{pv.time_spent_seconds}s</td>
                  <td>{pv.scroll_depth}%</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{pv.entered_at?.substring(0, 19).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

