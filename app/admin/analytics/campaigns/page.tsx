'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CampaignsAnalyticsPage() {
  return (
    <AdminLayout title="Campaign &amp; UTM Attribution">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Marketing Inbound Campaigns</h3>
            <p className="admin-card-desc">First-touch and last-touch attribution tracking via UTM parameters</p>
          </div>
        </div>

        <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: 14 }}>
            Inbound visitors with UTM parameters (e.g. <code>?utm_source=linkedin&amp;utm_campaign=q4_launch</code>) are automatically parsed, attributed to their sessions, and enriched in the Leads report upon contact submission.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

