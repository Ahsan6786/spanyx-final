'use client';

import React, { useEffect } from 'react';
import { useAdminContext } from './AdminContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title = 'Intelligence Dashboard',
  actions = null,
}: AdminLayoutProps) {
  const { setTitle, setActions } = useAdminContext();

  useEffect(() => {
    if (title) setTitle(title);
    setActions(actions || null);
    return () => {
      setActions(null);
    };
  }, [title, actions, setTitle, setActions]);

  return <>{children}</>;
}
