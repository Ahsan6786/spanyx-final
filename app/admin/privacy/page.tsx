'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function AdminPrivacyPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [cookies, setCookies] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [visitorIdInput, setVisitorIdInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqRes, cookieRes] = await Promise.all([
        fetch('/api/admin/privacy/requests'),
        fetch('/api/admin/cookies'),
      ]);

      if (reqRes.ok) {
        const json = await reqRes.json();
        setRequests(json.requests || []);
      }
      if (cookieRes.ok) {
        const json = await cookieRes.json();
        setCookies(json.cookies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() && !visitorIdInput.trim()) {
      alert('Please provide an email or visitor ID.');
      return;
    }

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
        setMessage('Deletion request registered successfully.');
        await loadData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to permanently purge this data under DPDP guidelines? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/admin/privacy/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process', request_id: requestId }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Privacy & Data Governance">
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
            DPDP Compliance &amp; Consent Governance
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            Consent verification, data deletion workflows, and Indian DPDP Act compliance controls
          </p>
        </div>

        <Link
          href="/admin/settings/retention"
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: '#0066FF',
            textDecoration: 'none',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: 6,
            padding: '6px 12px',
          }}
        >
          Retention Settings →
        </Link>
      </div>

      {/* DPDP Compliance Card */}
      <div
        className="admin-card"
        style={{
          padding: '18px 20px',
          marginBottom: 22,
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11.5,
              fontWeight: 700,
              background: '#10b981',
              color: '#ffffff',
            }}
          >
            DPDP ACTIVE
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
            Zero Third-Party Tracking &amp; Strict Consent Validation
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary, #334155)', margin: 0, lineHeight: 1.55 }}>
          All telemetry is collected directly through first-party HTTP cookies and session identifiers. No client
          fingerprinting is utilized. Data subjects have an enforceable right to consent withdrawal and complete
          record erasure.
        </p>
      </div>

      {/* Two Column: Register Deletion Request & Deletion Queue */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        {/* Register Deletion Form */}
        <div className="admin-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary, #0f172a)' }}>
            Register Data Erasure Request
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
            Initiate a verified DPDP deletion request for a lead or visitor
          </p>

          <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginBottom: 4 }}>
                Lead Email Address
              </label>
              <input
                type="email"
                placeholder="client@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color, #e2e8f0)',
                  fontSize: 13,
                  outline: 'none',
                  background: 'var(--bg-card, #ffffff)',
                  color: 'var(--text-primary, #0f172a)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginBottom: 4 }}>
                Or First-Party Visitor ID
              </label>
              <input
                type="text"
                placeholder="spx_vid_..."
                value={visitorIdInput}
                onChange={(e) => setVisitorIdInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color, #e2e8f0)',
                  fontSize: 13,
                  outline: 'none',
                  background: 'var(--bg-card, #ffffff)',
                  color: 'var(--text-primary, #0f172a)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginBottom: 4 }}>
                Audit Note / Verification Reason
              </label>
              <input
                type="text"
                placeholder="User requested removal via support email"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color, #e2e8f0)',
                  fontSize: 13,
                  outline: 'none',
                  background: 'var(--bg-card, #ffffff)',
                  color: 'var(--text-primary, #0f172a)',
                }}
              />
            </div>

            {message && (
              <div style={{ fontSize: 12.5, color: '#10b981', fontWeight: 600 }}>{message}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                padding: '9px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: isSubmitting ? 'wait' : 'pointer',
                marginTop: 4,
              }}
            >
              {isSubmitting ? 'Registering...' : 'Log Erasure Request'}
            </button>
          </form>
        </div>

        {/* Requests Queue */}
        <div className="admin-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary, #0f172a)' }}>
            Erasure Audit Queue ({requests.length})
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
            Logged DPDP deletion requests and processing status
          </p>

          <div style={{ overflowX: 'auto', maxHeight: 290 }}>
            {requests.length > 0 ? (
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Subject</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r: any) => (
                    <tr key={r.id}>
                      <td style={{ padding: '8px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                          {r.email || r.visitor_id}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)' }}>
                          {new Date(r.requested_at).toLocaleDateString()} {r.notes ? `• ${r.notes}` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            background: r.status === 'Processed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: r.status === 'Processed' ? '#059669' : '#d97706',
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px' }}>
                        {r.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => handleProcessRequest(r.id)}
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 4,
                              padding: '3px 8px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Purge Data
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Purged</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted, #64748b)', fontSize: 13 }}>
                No deletion requests currently pending.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

