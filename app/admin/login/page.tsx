'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@spanyx.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to authenticate.');
        setIsLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('A connection error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: 20 }}>
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#121214',
          border: '1px solid #27272a',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          padding: '40px 32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img
              src="/span/logo.png"
              alt="Spanyx"
              style={{ height: 32, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
            Administrator Sign In
          </h1>
          <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0 }}>
            Enter your credentials to access the Spanyx administration portal.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#f87171',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.04em', marginBottom: 6 }}>
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@spanyx.in"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #3f3f46',
                background: '#18181b',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.04em', marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #3f3f46',
                background: '#18181b',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#1d5cff',
              color: '#ffffff',
              border: 'none',
              padding: '12px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: 6,
              boxShadow: '0 2px 8px rgba(29, 92, 255, 0.3)',
              transition: 'background 0.2s ease',
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          Protected by Spanyx Auth with rate limiting &amp; CSRF protection.
        </div>
      </div>
    </div>
  );
}

