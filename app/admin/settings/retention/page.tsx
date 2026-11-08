'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function RetentionSettingsPage() {
  const [retentionDays, setRetentionDays] = useState('180');
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunCleanup = async () => {
    if (!confirm(`Run cleanup to delete telemetry records older than ${retentionDays} days?`)) return;
    setIsCleaning(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', retentionDays }),
      });
      const json = await res.json();
      setResult(json);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <AdminLayout title="Data Retention &amp; Automated Cleanup">
      <div className="admin-card" style={{ maxWidth: 650 }}>
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">DPDP Act Data Minimization Policy</h3>
            <p className="admin-card-desc">Configure retention windows and execute automated cleanup of expired telemetry</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Telemetry Retention Period
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <option value="90">90 Days (3 Months)</option>
              <option value="180">180 Days (6 Months — Recommended)</option>
              <option value="365">365 Days (1 Year)</option>
              <option value="730">730 Days (2 Years)</option>
            </select>
          </div>

          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
            Telemetry records (pageviews, session logs, and interaction events) older than the selected retention period are purged to maintain data minimization compliance. Consent records and qualified leads are retained in accordance with statutory accounting and compliance requirements.
          </div>

          <button
            type="button"
            onClick={handleRunCleanup}
            disabled={isCleaning}
            style={{
              background: '#060e24',
              color: '#ffffff',
              border: 'none',
              padding: '11px 20px',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: isCleaning ? 'not-allowed' : 'pointer',
            }}
          >
            {isCleaning ? 'Executing Cleanup...' : 'Execute Retention Cleanup Now'}
          </button>

          {result && (
            <div style={{ padding: 14, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, color: '#065f46', fontSize: 13 }}>
              <strong>Cleanup complete:</strong> Purged {result.deleted_pageviews || 0} pageviews, {result.deleted_events || 0} events, and {result.deleted_sessions || 0} sessions prior to {result.cutoffDate?.substring(0, 10)}.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

