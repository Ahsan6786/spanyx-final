'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function VisitorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/visitors/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDetails(json.data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout title="Visitor Journey">
        <p style={{ color: '#64748b' }}>Loading visitor timeline...</p>
      </AdminLayout>
    );
  }

  if (!details) {
    return (
      <AdminLayout title="Visitor Journey">
        <p style={{ color: '#ef4444' }}>Visitor profile not found.</p>
        <Link href="/admin/analytics/visitors" style={{ color: '#1d5cff' }}>← Back to all visitors</Link>
      </AdminLayout>
    );
  }

  const { visitor, sessions, pageviews, events, consent, lead } = details;

  return (
    <AdminLayout title={`Visitor Journey: ${id.substring(0, 16)}...`}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/analytics/visitors" style={{ fontSize: 13, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
          ← Back to Visitor Directory
        </Link>
      </div>

      {/* Visitor Profile Summary Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Hardware &amp; Acquisition Profile</h3>
            <p className="admin-card-desc">First-party anonymous client telemetry</p>
          </div>
          {lead && (
            <span className="admin-badge admin-badge-high" style={{ padding: '6px 12px', fontSize: 13 }}>
              Associated Lead: {lead.name} ({lead.email})
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Device Category</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#060e24', marginTop: 4 }}>{visitor.device_category || 'Desktop'}</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Browser &amp; OS</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#060e24', marginTop: 4 }}>{visitor.browser || '—'} on {visitor.os || '—'}</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Screen Resolution</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#060e24', marginTop: 4 }}>{visitor.screen_resolution || '—'}</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Visits Recorded</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1d5cff', marginTop: 4 }}>{visitor.visit_count} visits</div>
          </div>
        </div>
      </div>

      {/* Permitted Activity Timeline */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Chronological Pageview &amp; Interaction Stream</h3>
            <p className="admin-card-desc">Detailed browsing path and engagement milestones</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pageviews.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No recorded pageviews.</p>
          ) : (
            pageviews.map((pv: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '14px 18px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', color: '#1d5cff', display: 'grid', placeItems: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13 }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#060e24', fontFamily: 'monospace' }}>
                      {pv.page_url}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {pv.entered_at?.substring(11, 19)} ({pv.entered_at?.substring(0, 10)})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12.5, color: '#64748b' }}>
                    <span>Dwell Time: <strong style={{ color: '#060e24' }}>{pv.time_spent_seconds}s</strong></span>
                    <span>Scroll Depth: <strong style={{ color: pv.scroll_depth >= 75 ? '#059669' : '#060e24' }}>{pv.scroll_depth}%</strong></span>
                    <span>Category: <strong style={{ color: '#1d5cff' }}>{pv.page_category}</strong></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CTA Clicks & Events */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Interactions &amp; Conversion Events</h3>
            <p className="admin-card-desc">Button clicks, overlays, and custom triggers</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Category</th>
                <th>Element Text</th>
                <th>Page Triggered</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                    No interaction events triggered by this visitor.
                  </td>
                </tr>
              ) : (
                events.map((ev: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#1d5cff' }}>{ev.event_name}</td>
                    <td>{ev.event_category}</td>
                    <td>{ev.element_text || '—'}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ev.page_url}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{ev.created_at?.substring(0, 19).replace('T', ' ')}</td>
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

