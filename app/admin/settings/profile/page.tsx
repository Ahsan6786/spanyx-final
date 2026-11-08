'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.authenticated) setAdmin(json.admin);
      });
  }, []);

  return (
    <AdminLayout title="Administrator Profile">
      <div className="admin-card" style={{ maxWidth: 600 }}>
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Bootstrap Administrator Account</h3>
            <p className="admin-card-desc">Authentication and role parameters</p>
          </div>
          <span className="admin-badge admin-badge-blue">Superadmin</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              ADMINISTRATOR NAME
            </label>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#060e24' }}>{admin?.name || 'Ahsan Imam Khan'}</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              AUTHORIZED EMAIL
            </label>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1d5cff' }}>{admin?.email || 'ahsanimamkhan06@gmail.com'}</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              ROLE &amp; PERMISSIONS
            </label>
            <div style={{ fontSize: 14, color: '#475569' }}>
              Full access to Analytics, Telemetry, Lead Management, DPDP Compliance, and Data Exports.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

