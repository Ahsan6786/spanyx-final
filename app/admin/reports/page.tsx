'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function ReportsExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    { id: 'traffic', title: 'Website Traffic Report', desc: 'Complete session logs, duration, engaged visits, bounce flags, and entries/exits.' },
    { id: 'visitors', title: 'Visitor Intelligence Report', desc: 'Unique visitor profiles, device categories, browsers, locations, and visit frequencies.' },
    { id: 'pages', title: 'Page Performance Report', desc: 'Aggregated impressions, unique readers, average dwell time, and scroll depths.' },
    { id: 'services', title: 'Service Interest Report', desc: 'Computed service interest scoring across ERP, Web Apps, AI Agents, and FinTech.' },
    { id: 'sources', title: 'Traffic Source Report', desc: 'Direct, Organic Search, Referral domains, and Social Media channel distribution.' },
    { id: 'devices', title: 'Device & Hardware Report', desc: 'Screen resolutions, operating systems, mobile vs desktop breakdown.' },
    { id: 'consent', title: 'Cookie Consent Audit Report', desc: 'DPDP compliance consent records, category opt-ins, versions, and timestamps.' },
    { id: 'leads', title: 'Inbound Leads Report', desc: 'Contact inquiries, company sizes, lead scores, deal stages, and visitor associations.' },
    { id: 'campaigns', title: 'Campaign Performance Report', desc: 'UTM parameters (source, medium, campaign) and landing page conversions.' },
  ];

  const handleExport = (reportId: string, format: 'csv' | 'xlsx') => {
    setDownloading(`${reportId}_${format}`);
    const url = `/api/admin/reports/export?type=${reportId}&format=${format}`;
    window.location.href = url;
    setTimeout(() => {
      setDownloading(null);
    }, 2000);
  };

  return (
    <AdminLayout title="Intelligence Reports &amp; Data Exports">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Downloadable Analytics &amp; Compliance Reports</h3>
            <p className="admin-card-desc">Generate production-grade CSV or Excel (.xlsx) exports for executive briefings and regulatory records.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {reports.map((rep) => (
            <div
              key={rep.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#060e24', margin: '0 0 6px' }}>{rep.title}</h4>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>{rep.desc}</p>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => handleExport(rep.id, 'csv')}
                  disabled={!!downloading}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#060e24',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {downloading === `${rep.id}_csv` ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport(rep.id, 'xlsx')}
                  disabled={!!downloading}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 6,
                    border: '1px solid #1d5cff',
                    background: '#eff6ff',
                    color: '#1d5cff',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {downloading === `${rep.id}_xlsx` ? 'Exporting...' : 'Export Excel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

