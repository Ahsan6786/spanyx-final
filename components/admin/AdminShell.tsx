'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminContext } from './AdminContext';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { title, actions } = useAdminContext();

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('spx_admin_authed') !== 'true';
    }
    return true;
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('spx_admin_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('spx_admin_theme', nextTheme);
  };

  // Background non-blocking session check
  useEffect(() => {
    let isCancelled = false;

    fetch('/api/admin/auth/me')
      .then((res) => {
        if (!res.ok) {
          sessionStorage.removeItem('spx_admin_authed');
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (isCancelled) return;
        if (data && data.authenticated) {
          sessionStorage.setItem('spx_admin_authed', 'true');
          setIsLoading(false);
        } else {
          sessionStorage.removeItem('spx_admin_authed');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        if (!isCancelled) {
          sessionStorage.removeItem('spx_admin_authed');
          router.push('/admin/login');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('spx_admin_authed');
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const navSections = [
    {
      title: 'BUSINESS PLATFORM',
      items: [
        {
          href: '/admin/dashboard',
          label: 'Overview',
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
          href: '/admin/analytics',
          label: 'Analytics',
          icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        },
        {
          href: '/admin/visitors',
          label: 'Visitors',
          icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        },
        {
          href: '/admin/leads',
          label: 'Leads',
          icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        },
        {
          href: '/admin/ai-insights',
          label: 'AI Insights',
          icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
          badge: 'AI',
        },
        {
          href: '/admin/blogs',
          label: 'Content',
          icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
        },
        {
          href: '/admin/privacy',
          label: 'Privacy',
          icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        },
        {
          href: '/admin/settings',
          label: 'Settings',
          icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: theme === 'dark' ? '#090a0f' : '#f8fafc',
          color: theme === 'dark' ? '#f1f5f9' : '#060e24',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 38,
              height: 38,
              border: '3px solid rgba(29, 92, 255, 0.18)',
              borderTopColor: '#1d5cff',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              margin: '0 auto 14px',
            }}
          />
          <p style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8' }}>
            Loading Spanyx Intelligence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body" data-theme={theme}>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="admin-layout">
        {/* Pitch Black Sidebar - Stays Persistently Mounted Without Flickering */}
        <aside className={`admin-sidebar ${isMobileMenuOpen ? 'is-mobile-open' : ''}`}>
          {/* Spanyx Logo Header */}
          <div className="admin-brand">
            <Link
              href="/admin/dashboard"
              className="admin-brand-link"
              title="Spanyx Admin Dashboard"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <picture>
                <source srcSet="/span/logo.webp" type="image/webp" />
                <img src="/span/logo.png" alt="Spanyx" className="admin-sidebar-logo" width={140} height={46} decoding="async" />
              </picture>
            </Link>

            {/* Close button for mobile drawer */}
            <button
              type="button"
              className="admin-mobile-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="admin-nav">
            {navSections.map((sec, secIdx) => (
              <div key={secIdx} className="admin-nav-section">
                <div className="admin-nav-section-title">{sec.title}</div>
                <ul className="admin-nav-list">
                  {sec.items.map((item, itemIdx) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
                    return (
                      <li key={itemIdx} className={`admin-nav-item ${isActive ? 'is-active' : ''}`}>
                        <Link
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                          <span className="admin-nav-label">{item.label}</span>
                          {(item as any).badge && (
                            <span className="admin-nav-badge">{(item as any).badge}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Dedicated Sign Out in Sidebar */}
          <div className="admin-sidebar-footer">
            <button
              type="button"
              onClick={handleLogout}
              className="admin-sidebar-signout-btn"
              title="Sign Out of Admin"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-main">
          {/* Topbar: Mobile Hamburger + Title + Custom Actions + Dark/Light Mode */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="admin-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                </svg>
              </button>

              <div className="admin-page-title-wrap">
                <h1 className="admin-page-title">{title}</h1>
              </div>
            </div>

            <div className="admin-topbar-actions">
              {actions}

              <button
                type="button"
                onClick={toggleTheme}
                className="admin-theme-toggle-btn"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                    </svg>
                    <span className="theme-toggle-text">Light</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="theme-toggle-text">Dark</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

