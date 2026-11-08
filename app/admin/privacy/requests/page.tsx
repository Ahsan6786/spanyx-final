'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PrivacyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [visitorIdInput, setVisitorIdInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/admin/privacy/requests');
      if (res.ok) {
        const json = await res.json();
        setRequests(json.requests || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/privacy/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          email: emailInput.trim() || undefined,
          visitor_id: visitorIdInput.trim() || undefined,
          notes: notesInput.trim() || undefined,
        }),
      });
      if (res.ok) {
        setEmailInput('');
        setVisitorIdInput('');
        setNotesInput('');
        setMessage('Deletion request registered.');
        await loadRequests();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to permanently purge this visitor or lead data? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/admin/privacy/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process', id: requestId }),
      });
      if (res.ok) {
        await loadRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Data Subject Rights &amp; Deletion Requests">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">DPDP Act (2023) Right to Erasure</h3>
            <p className="admin-card-desc">Process and fulfill visitor requests to delete analytics sessions, pageviews, and lead history.</p>
          </div>
        </div>

        {/* New Deletion Request Form */}
        <form onSubmit={handleCreateRequest} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Register Data Erasure Request</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Data Principal Email</label>
              <input
                type="email"
                placeholder="client@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Or Anonymous Visitor ID</label>
              <input
                type="text"
                placeholder="vid_..."
                value={visitorIdInput}
                onChange={(e) => setVisitorIdInput(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Reason / Notes</label>
              <input
                type="text"
                placeholder="e.g. Consent withdrawal request"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || (!emailInput && !visitorIdInput)}
            style={{
              background: '#060e24',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Registering...' : 'Log Deletion Request'}
          </button>
          {message && <span style={{ marginLeft: 12, fontSize: 13, color: '#059669', fontWeight: 600 }}>{message}</span>}
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Target Identifier</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Processed At</th>
                <th>Audit Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
                    {isLoading ? 'Loading requests...' : 'No data deletion requests recorded.'}
                  </td>
                </tr>
              ) : (
                requests.map((r: any) => (
                  <tr key={r.id}>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1d5cff' }}>{r.id}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.email || r.visitor_id}</td>
                    <td>
                      <span className={`admin-badge ${r.status === 'Processed' ? 'admin-badge-high' : 'admin-badge-medium'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.requested_at?.substring(0, 16).replace('T', ' ')}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.processed_at ? r.processed_at.substring(0, 16).replace('T', ' ') : '—'}</td>
                    <td style={{ fontSize: 12.5, maxWidth: 220 }}>{r.notes || '—'}</td>
                    <td>
                      {r.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => handleProcessRequest(r.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Execute Purge
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Purged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

