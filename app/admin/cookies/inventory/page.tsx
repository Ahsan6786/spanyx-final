'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function CookieInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    provider: 'Spanyx',
    category: 'Strictly Necessary',
    purpose: '',
    expiry: '365 days',
    type: 'First-party Cookie',
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadInventory = async () => {
    try {
      const res = await fetch('/api/admin/cookies/inventory');
      if (res.ok) {
        const json = await res.json();
        setInventory(json.inventory || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAddCookie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/cookies/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({
          name: '',
          provider: 'Spanyx',
          category: 'Strictly Necessary',
          purpose: '',
          expiry: '365 days',
          type: 'First-party Cookie',
        });
        await loadInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Cookie Inventory &amp; Categorization">
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/cookies" style={{ fontSize: 13, fontWeight: 600, color: '#1d5cff', textDecoration: 'none' }}>
          ← Back to Cookie Management
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Verified Spanyx Cookie Catalog</h3>
            <p className="admin-card-desc">Accurately mapped cookies and storage keys deployed on the Spanyx website.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: '#1d5cff',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showAddForm ? 'Cancel' : '+ Register Cookie'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCookie} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Register New Cookie / Storage Item</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Cookie / Key Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. spx_custom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Provider *</label>
                <input
                  type="text"
                  required
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
                >
                  <option>Strictly Necessary</option>
                  <option>Functional</option>
                  <option>Analytics</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Purpose &amp; Description</label>
              <input
                type="text"
                placeholder="Explain why this cookie is placed and what data it processes"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#060e24',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save Cookie
            </button>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Expiry</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d5cff' }}>{item.name}</span>
                  </td>
                  <td>{item.provider}</td>
                  <td>
                    <span className="admin-badge admin-badge-blue">{item.category}</span>
                  </td>
                  <td style={{ fontSize: 13, maxWidth: 300 }}>{item.purpose}</td>
                  <td>{item.expiry}</td>
                  <td>{item.type}</td>
                  <td>
                    <span className="admin-badge admin-badge-high">Detected</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

