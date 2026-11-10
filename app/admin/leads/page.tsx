'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Lead Detail Drawer
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeadData, setSelectedLeadData] = useState<any>(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [isAiRegenerating, setIsAiRegenerating] = useState(false);

  const loadLeads = async (page: number, status: string, searchTerm: string) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (status !== 'All') q.append('status', status);
      if (searchTerm) q.append('search', searchTerm);

      const res = await fetch(`/api/admin/leads?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
        setPagination(json.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openLeadDrawer = async (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDrawerLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSelectedLeadData(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load lead details:', err);
    } finally {
      setIsDrawerLoading(false);
    }
  };

  const closeLeadDrawer = () => {
    setSelectedLeadId(null);
    setSelectedLeadData(null);
  };

  const handleRegenerateAi = async (leadId: string) => {
    setIsAiRegenerating(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && selectedLeadData) {
          setSelectedLeadData({
            ...selectedLeadData,
            aiAnalysis: json.data,
          });
        }
      }
    } catch (err) {
      console.error('Failed to regenerate AI analysis:', err);
    } finally {
      setIsAiRegenerating(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLeadData?.lead?.id === leadId) {
          setSelectedLeadData({
            ...selectedLeadData,
            lead: { ...selectedLeadData.lead, status: newStatus },
          });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    loadLeads(pagination.page, statusFilter, search);
  }, [pagination.page, statusFilter]);

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

  const lead = selectedLeadData?.lead;
  const ai = selectedLeadData?.aiAnalysis;
  const visitorJourney = selectedLeadData?.visitorJourney || [];

  return (
    <AdminLayout title="Leads">
      {/* Top Filter and Search Bar */}
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
        <div className="admin-filter-pills" style={{ display: 'inline-flex', gap: 4 }}>
          {['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted'].map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-filter-pill ${statusFilter === st ? 'is-active' : ''}`}
              onClick={() => {
                setStatusFilter(st);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="search"
            placeholder="Search lead name, email, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadLeads(1, statusFilter, search);
              }
            }}
            style={{
              padding: '7px 12px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border-color, #e2e8f0)',
              outline: 'none',
              minWidth: 260,
              background: 'var(--bg-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
            }}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Lead</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Selected Service</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Source Page</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Pages</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Time on Site</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Traffic</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => openLeadDrawer(l.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{l.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748b)' }}>
                        {l.email} {l.phone ? `• ${l.phone}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                      {l.interested_service || 'Custom Development'}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted, #64748b)' }}>
                      <code style={{ fontSize: 12 }}>
                        {l.source_page || l.first_landing_page || '/'}
                      </code>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>
                      {l.pages_count || 1}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>
                      {formatDuration(l.total_duration || 0)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: 'rgba(0, 102, 255, 0.08)',
                          color: '#0066FF',
                        }}
                      >
                        {l.traffic_source || 'Direct'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background:
                            l.status === 'Converted'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : l.status === 'Qualified'
                              ? 'rgba(0, 102, 255, 0.12)'
                              : 'rgba(100, 116, 139, 0.1)',
                          color:
                            l.status === 'Converted'
                              ? '#059669'
                              : l.status === 'Qualified'
                              ? '#0066FF'
                              : '#475569',
                        }}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDrawer(l.id);
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
                        Review Lead →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted, #64748b)' }}>
                    {isLoading ? 'Loading inbound leads...' : 'No inquiries recorded matching this filter.'}
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
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total leads)
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
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
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
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

      {/* Detailed Lead Drawer with Full Journey & Gemini Assessment */}
      {selectedLeadId && (
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
          onClick={closeLeadDrawer}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
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
                  {lead?.name || 'Lead Profile'}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
                  {lead?.email} {lead?.phone ? `• ${lead.phone}` : ''}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {lead && (
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: '1px solid var(--border-color, #e2e8f0)',
                      background: 'var(--bg-card, #ffffff)',
                      color: 'var(--text-primary, #0f172a)',
                    }}
                  >
                    {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={closeLeadDrawer}
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
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {isDrawerLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted, #64748b)' }}>
                  Loading lead profile &amp; AI evaluation...
                </div>
              ) : (
                <>
                  {/* Gemini AI Assessment Card */}
                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                      border: '1px solid rgba(0, 102, 255, 0.25)',
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background:
                              ai?.assessment === 'High Potential'
                                ? '#10b981'
                                : ai?.assessment === 'Medium Potential'
                                ? '#0066FF'
                                : '#64748b',
                            color: '#ffffff',
                          }}
                        >
                          AI Assessment: {ai?.assessment || 'High Potential'}
                        </span>
                        {ai?.cached && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted, #64748b)' }}>
                            • Cached
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRegenerateAi(lead.id)}
                        disabled={isAiRegenerating}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-color, #e2e8f0)',
                          borderRadius: 4,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: isAiRegenerating ? 'wait' : 'pointer',
                          color: '#0066FF',
                        }}
                      >
                        {isAiRegenerating ? 'Analyzing...' : 'Re-analyze'}
                      </button>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginBottom: 4 }}>
                      Interested in {ai?.service_interest || lead?.interested_service || 'Custom Development'}
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary, #334155)', margin: '0 0 10px', lineHeight: 1.5 }}>
                      {ai?.behavior_summary || 'The visitor explored the service page before submitting an inquiry.'}
                    </p>

                    <div
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(0, 102, 255, 0.06)',
                        borderLeft: '3px solid #0066FF',
                        borderRadius: '0 4px 4px 0',
                        fontSize: 12.5,
                        color: 'var(--text-primary, #0f172a)',
                      }}
                    >
                      <strong>Next Step:</strong> {ai?.next_action || 'Schedule an initial discovery consultation.'}
                    </div>
                  </div>

                  {/* Lead Attribution Breakdown */}
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary, #0f172a)' }}>
                    Attribution &amp; Source Telemetry
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                      marginBottom: 20,
                      fontSize: 12.5,
                    }}
                  >
                    <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.02)', borderRadius: 6, border: '1px solid var(--border-color, #e2e8f0)' }}>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>FORM SOURCE PAGE</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
                        <code>{lead?.source_page || lead?.first_landing_page || '/'}</code>
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.02)', borderRadius: 6, border: '1px solid var(--border-color, #e2e8f0)' }}>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>FIRST LANDING PAGE</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
                        <code>{lead?.first_landing_page || '/'}</code>
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.02)', borderRadius: 6, border: '1px solid var(--border-color, #e2e8f0)' }}>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>TRAFFIC CHANNEL</div>
                      <div style={{ fontWeight: 600, color: '#0066FF', marginTop: 2 }}>
                        {lead?.traffic_source || 'Direct Discovery'}
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.02)', borderRadius: 6, border: '1px solid var(--border-color, #e2e8f0)' }}>
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>SUBMITTED AT</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
                        {formatDate(lead?.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Message */}
                  {lead?.message && (
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary, #0f172a)' }}>
                        Client Message
                      </h4>
                      <div
                        style={{
                          padding: '12px 14px',
                          background: 'rgba(0, 0, 0, 0.02)',
                          borderRadius: 6,
                          border: '1px solid var(--border-color, #e2e8f0)',
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: 'var(--text-secondary, #334155)',
                        }}
                      >
                        {lead.message}
                      </div>
                    </div>
                  )}

                  {/* Prior Browsing Journey */}
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary, #0f172a)' }}>
                    Visitor Browsing History ({visitorJourney.length} pages viewed)
                  </h4>

                  <div style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border-color, #e2e8f0)' }}>
                    {visitorJourney.length > 0 ? (
                      visitorJourney.map((pv: any, i: number) => (
                        <div key={i} style={{ position: 'relative', marginBottom: 14 }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: -24,
                              top: 4,
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: '#0066FF',
                              border: '2px solid #ffffff',
                            }}
                          />
                          <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>
                            {new Date(pv.entered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
                            {pv.page_title || pv.page_url}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748b)' }}>
                            <code>{pv.page_url}</code> • {pv.time_spent_seconds || 0}s dwell
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--text-muted, #64748b)', fontSize: 12.5 }}>
                        Direct form submission without prior recorded page views.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
