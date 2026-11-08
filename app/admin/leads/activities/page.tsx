'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function LeadActivitiesPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/leads?pageSize=30')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setLeads(json.leads || []);
      });
  }, []);

  return (
    <AdminLayout title="Lead Pipeline Activities Stream">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Recent Conversion &amp; Outreach Touchpoints</h3>
            <p className="admin-card-desc">Audit stream of inbound contact submissions and deal stage progressions</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leads.map((lead: any) => (
            <div
              key={lead.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: '#060e24' }}>{lead.name}</span>{' '}
                <span style={{ color: '#64748b' }}>from {lead.company || 'Direct'}</span>{' '}
                <span style={{ fontSize: 13, color: '#1d5cff' }}>submitted inquiry ({lead.interested_service || 'Custom Development'})</span>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Traffic Source: {lead.traffic_source} • First Landing: {lead.first_landing_page}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="admin-badge admin-badge-blue">{lead.status}</span>
                <Link href={`/admin/leads/${lead.id}`} style={{ fontSize: 12.5, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
                  Open Lead →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

