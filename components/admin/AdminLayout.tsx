'use client';

import React, { useEffect, useRef } from 'react';
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
  const prevTitleRef = useRef<string>('');
  const prevActionsRef = useRef<React.ReactNode>(null);

  useEffect(() => {
    if (title && prevTitleRef.current !== title) {
      prevTitleRef.current = title;
      setTitle(title);
    }
  }, [title, setTitle]);

  useEffect(() => {
    if (prevActionsRef.current !== actions) {
      prevActionsRef.current = actions;
      setActions(actions || null);
    }
  }, [actions, setActions]);

  useEffect(() => {
    return () => {
      setActions(null);
    };
  }, [setActions]);

  return <>{children}</>;
}
