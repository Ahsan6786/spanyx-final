'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SecuritySettingsPage() {
  return (
    <AdminLayout title="Security &amp; Access Controls">
      <div className="admin-card" style={{ maxWidth: 700 }}>
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Production Security Architecture</h3>
            <p className="admin-card-desc">Active security measures protecting Spanyx Admin APIs and visitor records</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#060e24' }}>
              ✓ Brute-Force &amp; Rate-Limiting Protection
            </h4>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Active on <code>/api/admin/auth/login</code>. Enforces a maximum of 5 failed attempts per IP address within 15 minutes, with audit logging in <code>login_attempts</code>.
            </p>
          </div>

          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#060e24' }}>
              ✓ Cryptographic Password Hashing
            </h4>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
              All administrative passwords are salted and hashed using <code>bcryptjs</code> with 12 rounds. Passwords are never stored in plaintext or logged.
            </p>
          </div>

          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#060e24' }}>
              ✓ HTTP-Only, SameSite Session Cookies
            </h4>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Admin authentication tokens (<code>spx_admin_token</code>) are restricted from client-side JavaScript access via HTTP-only flags, preventing XSS-based token theft.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

