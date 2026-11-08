'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function UnifiedSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'tracking' | 'retention' | 'security'>('profile');
  const [admin, setAdmin] = useState<any>(null);

  // Tracking weights state
  const [weights, setWeights] = useState({
    contact_form_submission: 30,
    schedule_meeting_click: 20,
    service_page_visit: 10,
    multiple_service_pages: 10,
    case_study_interaction: 5,
    repeat_visit: 5,
    high_dwell_time: 5,
  });
  const [weightsSaved, setWeightsSaved] = useState(false);
  const [isSavingWeights, setIsSavingWeights] = useState(false);

  // Retention state
  const [retentionDays, setRetentionDays] = useState('180');
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.authenticated) setAdmin(json.admin);
      });

    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.settings?.lead_scoring_weights) {
          setWeights(json.settings.lead_scoring_weights);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWeights(true);
    setWeightsSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_weights', weights }),
      });
      const json = await res.json();
      if (json.success) {
        setWeightsSaved(true);
        setTimeout(() => setWeightsSaved(false), 3000);
      }
    } finally {
      setIsSavingWeights(false);
    }
  };

  const handleRunCleanup = async () => {
    if (!confirm(`Run cleanup to delete telemetry records older than ${retentionDays} days?`)) return;
    setIsCleaning(true);
    setCleanupResult(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', retentionDays }),
      });
      const json = await res.json();
      setCleanupResult(json);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <AdminLayout title="System &amp; Intelligence Settings">
      {/* Settings Navigation Tabs */}
      <div className="admin-filter-bar" style={{ marginBottom: 24 }}>
        <div className="admin-filter-pills">
          {[
            { id: 'profile', label: 'Admin Profile' },
            { id: 'tracking', label: 'Tracking & Scoring' },
            { id: 'retention', label: 'Data Retention' },
            { id: 'security', label: 'Security & Access' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-filter-pill ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Admin Profile */}
      {activeTab === 'profile' && (
        <div className="admin-card" style={{ maxWidth: 700 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bootstrap Administrator Account</h3>
              <p className="admin-card-desc">Authentication and identity parameters for Spanyx Intelligence</p>
            </div>
            <span className="admin-badge admin-badge-blue">Superadmin</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--admin-border, #f1f5f9)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-sub, #64748b)' }}>Name</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--admin-text, #060e24)' }}>{admin?.name || 'Administrator'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--admin-border, #f1f5f9)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-sub, #64748b)' }}>Email Address</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--admin-text, #060e24)', fontFamily: 'monospace' }}>{admin?.email || 'admin@spanyx.in'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--admin-border, #f1f5f9)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-sub, #64748b)' }}>Assigned Role</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--admin-text, #060e24)' }}>Platform Superadmin</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, padding: '12px 0' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-sub, #64748b)' }}>Password</span>
              <span style={{ fontSize: 13, color: 'var(--admin-text-sub, #64748b)' }}>Managed securely via Argon2/Bcrypt hash</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tracking & Scoring Weights */}
      {activeTab === 'tracking' && (
        <div className="admin-card" style={{ maxWidth: 760 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Algorithmic Lead Scoring Weights</h3>
              <p className="admin-card-desc">Configure points assigned to visitor actions when calculating commercial readiness</p>
            </div>
          </div>

          <form onSubmit={handleSaveWeights}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {[
                { key: 'contact_form_submission', label: 'Contact Form Submission', desc: 'Direct partnership inquiry submitted via contact modal' },
                { key: 'schedule_meeting_click', label: 'CTA / Project Kickoff Trigger', desc: 'Clicks on Get Started, Let’s Talk, or Schedule Meeting' },
                { key: 'service_page_visit', label: 'Architectural Service Deep-Dive', desc: 'Visiting dedicated service and technical offering detail pages' },
                { key: 'multiple_service_pages', label: 'Multi-Service Exploration', desc: 'Visitor inspected 3 or more distinct technical solutions' },
                { key: 'case_study_interaction', label: 'Industry Case Study Scroll', desc: 'Deep reading of industry architectures' },
                { key: 'repeat_visit', label: 'Returning Visitor Session', desc: 'Repeat sessions within 30 days demonstrating ongoing evaluation' },
                { key: 'high_dwell_time', label: 'High Dwell Time (> 120s)', desc: 'High dwell engagement across technical architecture specs' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--admin-card-bg, #f8fafc)', borderRadius: 8, border: '1px solid var(--admin-border, #f1f5f9)' }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--admin-text, #060e24)' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-sub, #64748b)' }}>{item.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={(weights as any)[item.key]}
                      onChange={(e) => setWeights({ ...weights, [item.key]: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: 64, padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: 13, borderRadius: 6, border: '1px solid var(--admin-border, #cbd5e1)' }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--admin-text-sub, #64748b)' }}>pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="submit"
                disabled={isSavingWeights}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  background: '#0071e3',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  border: 'none',
                  cursor: 'pointer',
                  opacity: isSavingWeights ? 0.6 : 1,
                }}
              >
                {isSavingWeights ? 'Saving Weights...' : 'Save Scoring Weights'}
              </button>
              {weightsSaved && (
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>
                  ✓ Weights updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Data Retention */}
      {activeTab === 'retention' && (
        <div className="admin-card" style={{ maxWidth: 700 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Telemetry Data Retention Policy</h3>
              <p className="admin-card-desc">Configure automated cleanup of stale raw pageviews, sessions and device metrics</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: 13.5, color: 'var(--admin-text-sub, #475569)', lineHeight: 1.6, margin: 0 }}>
              In accordance with data minimization best practices under the DPDP Act 2023 and GDPR, raw telemetry events, pageview dwell intervals, and anonymous device fingerprints should be purged periodically. Aggregated metrics remain intact.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text, #060e24)' }}>Purge records older than:</label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--admin-border, #cbd5e1)', fontSize: 13 }}
              >
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days (Recommended)</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleRunCleanup}
                disabled={isCleaning}
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  background: '#f43f5e',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                  opacity: isCleaning ? 0.6 : 1,
                }}
              >
                {isCleaning ? 'Cleaning Telemetry...' : `Run Manual Retention Purge`}
              </button>
            </div>

            {cleanupResult && (
              <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#166534', fontSize: 13 }}>
                ✓ Purge complete: {cleanupResult.deleted?.sessions || 0} sessions and {cleanupResult.deleted?.pageviews || 0} pageviews purged.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Security & Access */}
      {activeTab === 'security' && (
        <div className="admin-card" style={{ maxWidth: 760 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Production Security Architecture</h3>
              <p className="admin-card-desc">Active security measures protecting Spanyx Admin APIs and visitor records</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                title: '✓ Brute-Force & Rate-Limiting Protection',
                desc: 'Active on /api/admin/auth/login. Enforces maximum 5 failed attempts per IP address within 15 minutes, with audit logging.',
              },
              {
                title: '✓ Cryptographic Session Validation',
                desc: 'Sessions use cryptographically secure random tokens stored with SHA-256 hashes in SQLite and secure HttpOnly, SameSite cookies.',
              },
              {
                title: '✓ Prepared Statements & SQL Injection Prevention',
                desc: '100% of database queries use parameterized prepared statements through Node 22 DatabaseSync. Zero raw string interpolations.',
              },
              {
                title: '✓ Zero-Trust Role Authorization',
                desc: 'Every administrative endpoint rigorously verifies authenticated superadmin tokens before returning telemetry.',
              },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: 14, background: 'var(--admin-card-bg, #f8fafc)', borderRadius: 8, border: '1px solid var(--admin-border, #e2e8f0)' }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 4px', color: 'var(--admin-text, #060e24)' }}>{item.title}</h4>
                <p style={{ fontSize: 12.5, color: 'var(--admin-text-sub, #475569)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

