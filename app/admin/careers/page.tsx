'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CareerPostingItem, CareerApplicationItem } from '@/lib/db/queries';

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<'postings' | 'applications'>('postings');

  // Postings state
  const [postings, setPostings] = useState<CareerPostingItem[]>([]);
  const [postingFilterType, setPostingFilterType] = useState('All');
  const [postingFilterStatus, setPostingFilterStatus] = useState('All');
  const [postingSearch, setPostingSearch] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isLoadingPostings, setIsLoadingPostings] = useState(true);

  // Applications state
  const [applications, setApplications] = useState<CareerApplicationItem[]>([]);
  const [appFilterType, setAppFilterType] = useState('All');
  const [appFilterExp, setAppFilterExp] = useState('All');
  const [appFilterStatus, setAppFilterStatus] = useState('All');
  const [appSearch, setAppSearch] = useState('');
  const [isLoadingApps, setIsLoadingApps] = useState(true);

  // Modals state
  const [editingPosting, setEditingPosting] = useState<Partial<CareerPostingItem> | null>(null);
  const [isCreatingNewPosting, setIsCreatingNewPosting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplicationItem | null>(null);
  const [appNotes, setAppNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load postings
  const loadPostings = () => {
    setIsLoadingPostings(true);
    let url = '/api/admin/careers?';
    if (postingFilterType !== 'All') url += `type=${postingFilterType}&`;
    if (postingFilterStatus !== 'All') url += `status=${postingFilterStatus}&`;
    if (postingSearch.trim()) url += `search=${encodeURIComponent(postingSearch.trim())}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPostings(data.postings || []);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load postings:', err))
      .finally(() => setIsLoadingPostings(false));
  };

  // Load applications
  const loadApplications = () => {
    setIsLoadingApps(true);
    let url = '/api/admin/careers/applications?';
    if (appFilterType !== 'All') url += `type=${appFilterType}&`;
    if (appFilterExp !== 'All') url += `experience=${appFilterExp}&`;
    if (appFilterStatus !== 'All') url += `status=${appFilterStatus}&`;
    if (appSearch.trim()) url += `search=${encodeURIComponent(appSearch.trim())}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.applications || []);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load applications:', err))
      .finally(() => setIsLoadingApps(false));
  };

  useEffect(() => {
    loadPostings();
  }, [postingFilterType, postingFilterStatus, postingSearch]);

  useEffect(() => {
    loadApplications();
  }, [appFilterType, appFilterExp, appFilterStatus, appSearch]);

  // Handle quick status toggle on posting (publish / pause / close)
  const handleTogglePostingStatus = async (posting: CareerPostingItem, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/careers/${posting.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPostings((prev) =>
          prev.map((p) => (p.id === posting.id ? { ...p, status: newStatus as any } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete posting
  const handleDeletePosting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity posting?')) return;
    try {
      const res = await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPostings((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete posting:', err);
    }
  };

  // Save new / edited posting
  const handleSavePosting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosting) return;

    setIsSaving(true);
    try {
      const isEdit = !isCreatingNewPosting && editingPosting.id;
      const url = isEdit ? `/api/admin/careers/${editingPosting.id}` : '/api/admin/careers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPosting),
      });

      const data = await res.json();
      if (data.success) {
        setEditingPosting(null);
        setIsCreatingNewPosting(false);
        loadPostings();
      } else {
        alert(data.error || 'Failed to save posting');
      }
    } catch (err) {
      console.error('Failed to save posting:', err);
      alert('Error saving posting');
    } finally {
      setIsSaving(false);
    }
  };

  // Update application status & notes
  const handleUpdateAppStatus = async (appId: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/careers/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus as any, notes: notes !== undefined ? notes : a.notes } : a))
        );
        if (selectedApplication && selectedApplication.id === appId) {
          setSelectedApplication({ ...selectedApplication, status: newStatus as any, notes: notes !== undefined ? notes : selectedApplication.notes });
        }
      }
    } catch (err) {
      console.error('Failed to update application:', err);
    }
  };

  return (
    <AdminLayout
      title="Careers &amp; Internship Management"
      actions={
        <button
          type="button"
          onClick={() => {
            setIsCreatingNewPosting(true);
            setEditingPosting({
              title: '',
              posting_type: 'internship',
              category: 'Internship Opportunities',
              department: 'Engineering',
              work_mode: 'Remote',
              location: 'Remote (India)',
              duration: '3 Months',
              is_paid: 1,
              stipend: '₹15,000 - ₹20,000 / month',
              required_skills: '',
              eligibility: 'College students and recent graduates',
              certificate_available: 1,
              has_ppo: 1,
              description: '',
              responsibilities: '',
              status: 'published',
            });
          }}
          className="admin-btn-primary"
          style={{
            padding: '8px 16px',
            background: '#060e24',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Opportunity
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Metric Summary Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Internships</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0071e3', marginTop: 4 }}>{stats.postings.internships}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fresher Roles</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#060e24', marginTop: 4 }}>{stats.postings.freshers}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Full-Time Jobs</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#060e24', marginTop: 4 }}>{stats.postings.jobs}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Applications</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#060e24', marginTop: 4 }}>{stats.applications.total}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Intern Applicants</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0071e3', marginTop: 4 }}>{stats.applications.internships}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>New Applications</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{stats.applications.new}</div>
            </div>
          </div>
        )}

        {/* View Switcher Tabs: Postings vs Candidate Applications */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: 20 }}>
          <button
            type="button"
            onClick={() => setActiveTab('postings')}
            style={{
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              fontSize: 15,
              fontWeight: activeTab === 'postings' ? 700 : 500,
              color: activeTab === 'postings' ? '#0071e3' : '#64748b',
              borderBottom: activeTab === 'postings' ? '2.5px solid #0071e3' : '2.5px solid transparent',
              cursor: 'pointer',
            }}
          >
            Job &amp; Internship Postings ({postings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              fontSize: 15,
              fontWeight: activeTab === 'applications' ? 700 : 500,
              color: activeTab === 'applications' ? '#0071e3' : '#64748b',
              borderBottom: activeTab === 'applications' ? '2.5px solid #0071e3' : '2.5px solid transparent',
              cursor: 'pointer',
            }}
          >
            Candidate Applications ({applications.length})
          </button>
        </div>

        {/* TAB 1: POSTINGS MANAGEMENT */}
        {activeTab === 'postings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={postingFilterType}
                  onChange={(e) => setPostingFilterType(e.target.value)}
                  style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  <option value="All">All Types</option>
                  <option value="internship">Internships Only</option>
                  <option value="fresher">Freshers Only</option>
                  <option value="full_time">Full-Time Jobs Only</option>
                </select>

                <select
                  value={postingFilterStatus}
                  onChange={(e) => setPostingFilterStatus(e.target.value)}
                  style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Search postings..."
                value={postingSearch}
                onChange={(e) => setPostingSearch(e.target.value)}
                style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, minWidth: 240 }}
              />
            </div>

            {/* Postings Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Role Title</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type &amp; Category</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Duration &amp; Comp</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>PPO / Cert</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingPostings ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
                        Loading postings...
                      </td>
                    </tr>
                  ) : postings.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
                        No opportunity postings found.
                      </td>
                    </tr>
                  ) : (
                    postings.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#060e24', fontSize: 14 }}>{p.title}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{p.department} • {p.work_mode}</div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background: p.posting_type === 'internship' ? '#eff6ff' : '#f1f5f9',
                              color: p.posting_type === 'internship' ? '#0071e3' : '#334155',
                            }}
                          >
                            {p.posting_type === 'internship' ? 'Internship' : p.posting_type === 'fresher' ? 'Fresher' : 'Full-Time'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div>{p.duration || 'Flexible'}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{p.stipend || (p.is_paid ? 'Paid' : 'Unpaid')}</div>
                        </td>

                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#475569' }}>
                          {p.posting_type === 'internship' ? (
                            <>
                              <div>PPO: {p.has_ppo ? 'Yes' : 'No'}</div>
                              <div>Cert: {p.certificate_available ? 'Yes' : 'No'}</div>
                            </>
                          ) : (
                            <span>Permanent</span>
                          )}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background:
                                p.status === 'published'
                                  ? '#dcfce7'
                                  : p.status === 'paused'
                                  ? '#fef3c7'
                                  : p.status === 'closed'
                                  ? '#fee2e2'
                                  : '#f1f5f9',
                              color:
                                p.status === 'published'
                                  ? '#15803d'
                                  : p.status === 'paused'
                                  ? '#b45309'
                                  : p.status === 'closed'
                                  ? '#b91c1c'
                                  : '#475569',
                              textTransform: 'capitalize',
                            }}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            {p.status === 'published' ? (
                              <button
                                type="button"
                                onClick={() => handleTogglePostingStatus(p, 'paused')}
                                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#ffffff', fontSize: 12, cursor: 'pointer' }}
                              >
                                Pause
                              </button>
                            ) : p.status === 'paused' ? (
                              <button
                                type="button"
                                onClick={() => handleTogglePostingStatus(p, 'published')}
                                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#ffffff', fontSize: 12, cursor: 'pointer' }}
                              >
                                Publish
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingNewPosting(false);
                                setEditingPosting(p);
                              }}
                              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#ffffff', fontSize: 12, cursor: 'pointer' }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePosting(p.id)}
                              style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff1f2', color: '#b91c1c', fontSize: 12, cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE APPLICATIONS WITH DEDICATED FILTERS */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Dedicated Filters Bar (Crucial User Requirement) */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* 1. Job vs Internship Application Filter */}
                <select
                  value={appFilterType}
                  onChange={(e) => setAppFilterType(e.target.value)}
                  style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600 }}
                >
                  <option value="All">All Application Types</option>
                  <option value="internship">Internship Applications</option>
                  <option value="job">Job Applications</option>
                </select>

                {/* 2. Experience Level Filter */}
                <select
                  value={appFilterExp}
                  onChange={(e) => setAppFilterExp(e.target.value)}
                  style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  <option value="All">All Experience Levels</option>
                  <option value="Student">Students</option>
                  <option value="Fresher">Freshers</option>
                  <option value="Experienced Professional">Experienced Professionals</option>
                </select>

                {/* 3. Status Filter */}
                <select
                  value={appFilterStatus}
                  onChange={(e) => setAppFilterStatus(e.target.value)}
                  style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  <option value="All">All Review Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Search candidates or role..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, minWidth: 240 }}
              />
            </div>

            {/* Applications Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Candidate</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Applied For</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Experience &amp; College</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Links</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingApps ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
                        Loading applications...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
                        No applications found for selected filters.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#060e24', fontSize: 14 }}>{app.applicant_name}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{app.applicant_email}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{app.applicant_phone}</div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#060e24' }}>{app.posting_title}</div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: 4,
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              background: app.posting_type === 'internship' ? '#eff6ff' : '#f1f5f9',
                              color: app.posting_type === 'internship' ? '#0071e3' : '#334155',
                            }}
                          >
                            {app.posting_type === 'internship' ? 'Internship' : 'Job'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0071e3' }}>{app.experience_level}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>
                            {app.current_college_or_company || 'Not specified'} {app.graduation_year ? `(${app.graduation_year})` : ''}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {app.resume_url_or_text && (
                              <a
                                href={app.resume_url_or_text}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#0071e3', textDecoration: 'underline', fontSize: 12 }}
                              >
                                View Resume ↗
                              </a>
                            )}
                            {app.portfolio_or_linkedin && (
                              <a
                                href={app.portfolio_or_linkedin}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#475569', textDecoration: 'underline', fontSize: 12 }}
                              >
                                Portfolio / LinkedIn ↗
                              </a>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            style={{
                              height: 32,
                              padding: '0 8px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              border: '1px solid #cbd5e1',
                              background:
                                app.status === 'shortlisted' || app.status === 'accepted'
                                  ? '#f0fdf4'
                                  : app.status === 'rejected'
                                  ? '#fef2f2'
                                  : '#ffffff',
                              color:
                                app.status === 'shortlisted' || app.status === 'accepted'
                                  ? '#15803d'
                                  : app.status === 'rejected'
                                  ? '#b91c1c'
                                  : '#060e24',
                            }}
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApplication(app);
                              setAppNotes(app.notes || '');
                            }}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Review Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE / EDIT OPPORTUNITY POSTING */}
        {editingPosting && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => setEditingPosting(null)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                maxWidth: 680,
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '28px',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#060e24' }}>
                  {isCreatingNewPosting ? 'Create Opportunity Posting' : 'Edit Opportunity Posting'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPosting(null)}
                  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePosting} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Web Development Intern"
                    value={editingPosting.title || ''}
                    onChange={(e) => setEditingPosting({ ...editingPosting, title: e.target.value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, boxSizing: 'border-box' }}
                  />
                </div>

                {/* Posting Type & Category Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Posting Type
                    </label>
                    <select
                      value={editingPosting.posting_type || 'internship'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setEditingPosting({
                          ...editingPosting,
                          posting_type: val,
                          category: val === 'internship' ? 'Internship Opportunities' : val === 'fresher' ? 'Fresher Opportunities' : 'Full-Time Jobs',
                        });
                      }}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, boxSizing: 'border-box' }}
                    >
                      <option value="internship">Internship Opportunity</option>
                      <option value="fresher">Fresher Opportunity</option>
                      <option value="full_time">Full-Time Job</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Category Pill
                    </label>
                    <select
                      value={editingPosting.category || 'Internship Opportunities'}
                      onChange={(e) => setEditingPosting({ ...editingPosting, category: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, boxSizing: 'border-box' }}
                    >
                      <option value="Internship Opportunities">Internship Opportunities</option>
                      <option value="Fresher Opportunities">Fresher Opportunities</option>
                      <option value="Full-Time Jobs">Full-Time Jobs</option>
                      <option value="Remote Opportunities">Remote Opportunities</option>
                    </select>
                  </div>
                </div>

                {/* Department, Work Mode, Location Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Department
                    </label>
                    <input
                      type="text"
                      value={editingPosting.department || ''}
                      onChange={(e) => setEditingPosting({ ...editingPosting, department: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Work Mode
                    </label>
                    <select
                      value={editingPosting.work_mode || 'Remote'}
                      onChange={(e) => setEditingPosting({ ...editingPosting, work_mode: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingPosting.location || ''}
                      onChange={(e) => setEditingPosting({ ...editingPosting, location: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Internship Duration, Paid/Unpaid, Stipend Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Months"
                      value={editingPosting.duration || ''}
                      onChange={(e) => setEditingPosting({ ...editingPosting, duration: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Compensation
                    </label>
                    <select
                      value={editingPosting.is_paid ? 1 : 0}
                      onChange={(e) => setEditingPosting({ ...editingPosting, is_paid: Number(e.target.value) })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    >
                      <option value={1}>Paid</option>
                      <option value={0}>Unpaid</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Stipend / Salary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹15,000 - ₹20,000 / month"
                      value={editingPosting.stipend || ''}
                      onChange={(e) => setEditingPosting({ ...editingPosting, stipend: e.target.value })}
                      style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Internship Toggles: Certificate & PPO Conversion */}
                <div style={{ display: 'flex', gap: 24, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!editingPosting.certificate_available}
                      onChange={(e) => setEditingPosting({ ...editingPosting, certificate_available: e.target.checked ? 1 : 0 })}
                    />
                    Certificate Available upon Completion
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!editingPosting.has_ppo}
                      onChange={(e) => setEditingPosting({ ...editingPosting, has_ppo: e.target.checked ? 1 : 0 })}
                    />
                    Full-Time Conversion Opportunity (PPO)
                  </label>
                </div>

                {/* Required Skills */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Next.js, TypeScript, REST APIs"
                    value={editingPosting.required_skills || ''}
                    onChange={(e) => setEditingPosting({ ...editingPosting, required_skills: e.target.value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Eligibility Criteria
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. College students or freshers graduating in 2024-2027"
                    value={editingPosting.eligibility || ''}
                    onChange={(e) => setEditingPosting({ ...editingPosting, eligibility: e.target.value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Overview Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingPosting.description || ''}
                    onChange={(e) => setEditingPosting({ ...editingPosting, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Key Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    value={editingPosting.responsibilities || ''}
                    onChange={(e) => setEditingPosting({ ...editingPosting, responsibilities: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                {/* Publishing Status */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Publishing Status
                  </label>
                  <select
                    value={editingPosting.status || 'published'}
                    onChange={(e) => setEditingPosting({ ...editingPosting, status: e.target.value as any })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, boxSizing: 'border-box' }}
                  >
                    <option value="published">Published (Visible on Careers Page)</option>
                    <option value="paused">Paused (Temporarily hidden from applicants)</option>
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="closed">Closed (No longer accepting applications)</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      height: 42,
                      background: '#060e24',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSaving ? 'Saving Opportunity...' : 'Save Opportunity'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPosting(null)}
                    style={{
                      padding: '0 20px',
                      height: 42,
                      background: '#f1f5f9',
                      color: '#334155',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: APPLICATION REVIEW DRAWER / MODAL */}
        {selectedApplication && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => setSelectedApplication(null)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase' }}>
                    Candidate Profile • {selectedApplication.posting_type}
                  </span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0', color: '#060e24' }}>
                    {selectedApplication.applicant_name}
                  </h3>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                    Applied for: <strong>{selectedApplication.posting_title}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* Candidate Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, fontSize: 13, padding: 16, background: '#f8fafc', borderRadius: 10 }}>
                <div>
                  <span style={{ color: '#64748b' }}>Email: </span>
                  <div><strong>{selectedApplication.applicant_email}</strong></div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>Phone: </span>
                  <div><strong>{selectedApplication.applicant_phone}</strong></div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>Experience Level: </span>
                  <div><strong style={{ color: '#0071e3' }}>{selectedApplication.experience_level}</strong></div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>College / Org: </span>
                  <div><strong>{selectedApplication.current_college_or_company || 'N/A'} {selectedApplication.graduation_year ? `(${selectedApplication.graduation_year})` : ''}</strong></div>
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                {selectedApplication.resume_url_or_text && (
                  <a
                    href={selectedApplication.resume_url_or_text}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 38,
                      background: '#060e24',
                      color: '#ffffff',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Open Resume / Portfolio ↗
                  </a>
                )}
                {selectedApplication.portfolio_or_linkedin && (
                  <a
                    href={selectedApplication.portfolio_or_linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 38,
                      background: '#f1f5f9',
                      color: '#334155',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    LinkedIn Profile ↗
                  </a>
                )}
              </div>

              {/* Cover Note */}
              {selectedApplication.cover_note && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                    Candidate Note
                  </label>
                  <div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, lineHeight: 1.55 }}>
                    {selectedApplication.cover_note}
                  </div>
                </div>
              )}

              {/* Status Update & Internal Notes */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Update Review Status
                </label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => handleUpdateAppStatus(selectedApplication.id, e.target.value, appNotes)}
                    style={{ height: 40, flex: 1, padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, fontWeight: 600 }}
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="accepted">Accepted / Offer Extended</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Internal Recruiter Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Add notes about technical interview, communication, or follow-up schedule..."
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateAppStatus(selectedApplication.id, selectedApplication.status, appNotes);
                      setSelectedApplication(null);
                    }}
                    style={{
                      padding: '10px 20px',
                      background: '#060e24',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Save Notes &amp; Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

