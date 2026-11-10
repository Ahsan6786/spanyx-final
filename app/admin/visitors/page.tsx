'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [visitorDetails, setVisitorDetails] = useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const fetchVisitors = async (page = 1, query = search) => {
    setIsLoading(true);
    try {
      const url = `/api/admin/visitors?page=${page}&pageSize=20${query ? `&search=${encodeURIComponent(query)}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setVisitors(json.visitors || []);
          setPagination(json.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 1 });
        }
      }
    } catch (err) {
      console.error('Failed to load visitors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openVisitorDrawer = async (visitorId: string) => {
    setSelectedVisitorId(visitorId);
    setIsDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/visitors/${visitorId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setVisitorDetails(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load visitor details:', err);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeVisitorDrawer = () => {
    setSelectedVisitorId(null);
    setVisitorDetails(null);
  };

  useEffect(() => {
    fetchVisitors(1, search);
  }, [search]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const totalSecs = Math.round(Number(seconds));
    if (totalSecs < 60) return `${totalSecs}s`;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // Compile chronological activity timeline
  const getTimelineItems = () => {
    if (!visitorDetails) return [];
    const items: Array<{ time: string; timestamp: number; title: string; subtitle?: string; badge?: string; type: string }> = [];

    // Pageviews
    (visitorDetails.pageviews || []).forEach((pv: any) => {
      const ts = new Date(pv.entered_at).getTime();
      items.push({
        time: new Date(pv.entered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: ts,
        title: `Visited ${pv.page_title || pv.page_url}`,
        subtitle: `${pv.page_url} • Spent ${formatDuration(pv.time_spent_seconds || 0)}`,
        type: 'pageview',
      });
    });

    // Events (CTAs, clicks)
    (visitorDetails.events || []).forEach((ev: any) => {
      const ts = new Date(ev.created_at).getTime();
      items.push({
        time: new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: ts,
        title: `Triggered ${ev.event_name}`,
        subtitle: `Page: ${ev.page_url}${ev.element_text ? ` • Text: "${ev.element_text}"` : ''}`,
        badge: 'CTA',
        type: 'event',
      });
    });

    // Lead Submission
    if (visitorDetails.lead) {
      const ld = visitorDetails.lead;
      const ts = new Date(ld.created_at).getTime();
      items.push({
        time: new Date(ld.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: ts,
        title: `Submitted Inquiry: ${ld.interested_service || 'Custom Solution'}`,
        subtitle: `${ld.name} (${ld.email})${ld.source_page ? ` from ${ld.source_page}` : ''}`,
        badge: 'Lead Converted',
        type: 'lead',
      });
    }

    // Sort descending by timestamp
    return items.sort((a, b) => b.timestamp - a.timestamp);
  };

  const timelineItems = getTimelineItems();

  return (
    <AdminLayout title="Visitors">
      {/* Top Header & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
            Audience Roster
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
            First-party browsing history and engagement trails (No browser fingerprinting)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="search"
            placeholder="Search by ID, browser, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border-color, #e2e8f0)',
              outline: 'none',
              width: 240,
              background: 'var(--bg-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
            }}
          />
        </div>
      </div>

      {/* Clean Visitor Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Visitor</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>First Visit</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Last Seen</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Pages</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Sessions</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Source</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 ? (
                visitors.map((v) => (
                  <tr
                    key={v.visitor_id}
                    onClick={() => openVisitorDrawer(v.visitor_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#0066FF', fontFamily: 'monospace' }}>
                        {v.visitor_id.substring(0, 16)}...
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748b)' }}>
                        {v.device_category || 'Desktop'} • {v.browser || 'Web Browser'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted, #64748b)' }}>
                      {formatDate(v.first_visit_at)}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                      {formatDate(v.last_visit_at)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>
                      {v.total_pages || 1}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: v.visit_count > 1 ? 'rgba(0, 102, 255, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                          color: v.visit_count > 1 ? '#0066FF' : '#64748b',
                        }}
                      >
                        {v.visit_count || 1}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: '2px 6px',
                          background: 'rgba(0,0,0,0.04)',
                          borderRadius: 4,
                        }}
                      >
                        {v.last_source || 'Direct'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openVisitorDrawer(v.visitor_id);
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-color, #e2e8f0)',
                          borderRadius: 5,
                          padding: '4px 8px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#0066FF',
                          cursor: 'pointer',
                        }}
                      >
                        View Timeline →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted, #64748b)' }}>
                    {isLoading ? 'Loading visitor logs...' : 'No visitors recorded for this criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12.5,
              color: 'var(--text-muted, #64748b)',
            }}
          >
            <span>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total visitors)
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchVisitors(pagination.page - 1)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 5,
                  border: '1px solid var(--border-color, #e2e8f0)',
                  background: 'transparent',
                  cursor: pagination.page > 1 ? 'pointer' : 'default',
                  opacity: pagination.page > 1 ? 1 : 0.4,
                }}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchVisitors(pagination.page + 1)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 5,
                  border: '1px solid var(--border-color, #e2e8f0)',
                  background: 'transparent',
                  cursor: pagination.page < pagination.totalPages ? 'pointer' : 'default',
                  opacity: pagination.page < pagination.totalPages ? 1 : 0.4,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sliding Activity Timeline Drawer */}
      {selectedVisitorId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={closeVisitorDrawer}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              height: '100%',
              background: 'var(--bg-card, #ffffff)',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border-color, #e2e8f0)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                  Visitor Activity Timeline
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0', fontFamily: 'monospace' }}>
                  {selectedVisitorId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeVisitorDrawer}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: 'var(--text-muted, #64748b)',
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {isDetailsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted, #64748b)' }}>
                  Loading chronological timeline...
                </div>
              ) : (
                <>
                  {/* Summary Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 10,
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: 8,
                      marginBottom: 20,
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>Sessions</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary, #0f172a)' }}>
                        {visitorDetails?.sessions?.length || 1}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>Pages Visited</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary, #0f172a)' }}>
                        {visitorDetails?.pageviews?.length || 0}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>Consent Status</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>
                        {visitorDetails?.consent?.consent_status || 'Granted'}
                      </div>
                    </div>
                  </div>

                  {/* Chronological Activity Timeline */}
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 14px', color: 'var(--text-primary, #0f172a)' }}>
                    Chronological Journey
                  </h4>

                  <div style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border-color, #e2e8f0)' }}>
                    {timelineItems.length > 0 ? (
                      timelineItems.map((item, idx) => (
                        <div key={idx} style={{ position: 'relative', marginBottom: 18 }}>
                          {/* Dot on line */}
                          <div
                            style={{
                              position: 'absolute',
                              left: -24,
                              top: 3,
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: item.type === 'lead' ? '#10b981' : item.type === 'event' ? '#f59e0b' : '#0066FF',
                              border: '2px solid #ffffff',
                            }}
                          />
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>
                            {item.time}
                          </div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
                            {item.title}
                            {item.badge && (
                              <span
                                style={{
                                  marginLeft: 6,
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: item.type === 'lead' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: item.type === 'lead' ? '#059669' : '#d97706',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', marginTop: 2 }}>
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 13 }}>
                        No interaction events recorded for this session.
                      </div>
                    )}
                  </div>

                  {/* Technical Environment (Collapsed by default in mental model, clean at bottom) */}
                  <details style={{ marginTop: 24, fontSize: 12, borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: 14 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
                      Technical Environment Details
                    </summary>
                    <div style={{ marginTop: 10, lineHeight: 1.8, color: 'var(--text-secondary, #334155)' }}>
                      <div><strong>Device Category:</strong> {visitorDetails?.visitor?.device_category || 'Desktop'}</div>
                      <div><strong>Browser:</strong> {visitorDetails?.visitor?.browser || 'Unknown'} {visitorDetails?.visitor?.browser_version || ''}</div>
                      <div><strong>Operating System:</strong> {visitorDetails?.visitor?.os || 'Unknown'}</div>
                      <div><strong>Screen Resolution:</strong> {visitorDetails?.visitor?.screen_resolution || 'Standard'}</div>
                      <div><strong>Language:</strong> {visitorDetails?.visitor?.language || 'en'}</div>
                      <div><strong>First Seen:</strong> {formatDate(visitorDetails?.visitor?.first_visit_at)}</div>
                      <div><strong>Last Seen:</strong> {formatDate(visitorDetails?.visitor?.last_visit_at)}</div>
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
