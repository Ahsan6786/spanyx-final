'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function TrackingSettingsPage() {
  const [weights, setWeights] = useState({
    contact_form_submission: 30,
    schedule_meeting_click: 20,
    service_page_visit: 10,
    multiple_service_pages: 10,
    case_study_interaction: 5,
    repeat_visit: 5,
    high_dwell_time: 5,
  });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.settings.lead_scoring_weights) {
          setWeights(json.settings.lead_scoring_weights);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'lead_scoring_weights', value: weights }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Lead Scoring &amp; Tracking Configuration">
      <div className="admin-card" style={{ maxWidth: 680 }}>
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Configurable Lead Scoring Weights</h3>
            <p className="admin-card-desc">Adjust the points added to a potential client profile based on observed engagement events</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'contact_form_submission', label: 'Contact Form Submission', desc: 'Voluntary submission of project inquiry form' },
            { key: 'schedule_meeting_click', label: 'Schedule Meeting / Consultation Click', desc: 'Clicks on high-intent conversion action triggers' },
            { key: 'service_page_visit', label: 'Service Page Visit', desc: 'Visiting an architectural solution or industry page' },
            { key: 'multiple_service_pages', label: 'Multiple Distinct Services Explored', desc: 'Visiting 2 or more distinct core solutions' },
            { key: 'case_study_interaction', label: 'Case Study / Portfolio Engagement', desc: 'Interacting with work showcase carousels or cards' },
            { key: 'repeat_visit', label: 'Repeat Returning Visitor', desc: 'Returning to Spanyx across separate sessions' },
            { key: 'high_dwell_time', label: 'Deep Dwell Time (>45s reading)', desc: 'Spent substantial dwell time reading technical details' },
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#060e24' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{item.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1d5cff' }}>+</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={(weights as any)[item.key] || 0}
                  onChange={(e) => setWeights({ ...weights, [item.key]: parseInt(e.target.value, 10) || 0 })}
                  style={{ width: 64, padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700, textAlign: 'center' }}
                />
                <span style={{ fontSize: 12, color: '#64748b' }}>pts</span>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                background: '#1d5cff',
                color: '#ffffff',
                border: 'none',
                padding: '11px 22px',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              {isSaving ? 'Saving Weights...' : 'Save Scoring Weights'}
            </button>
            {saved && <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>Configuration saved successfully!</span>}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

