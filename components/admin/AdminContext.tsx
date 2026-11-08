'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface AdminContextType {
  title: string;
  setTitle: (title: string) => void;
  actions: React.ReactNode;
  setActions: (actions: React.ReactNode) => void;
}

const AdminContext = createContext<AdminContextType>({
  title: 'Intelligence Dashboard',
  setTitle: () => {},
  actions: null,
  setActions: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitleState] = useState('Intelligence Dashboard');
  const [actions, setActionsState] = useState<React.ReactNode>(null);

  const setTitle = useCallback((newTitle: string) => {
    setTitleState((prev) => (prev !== newTitle ? newTitle : prev));
  }, []);

  const setActions = useCallback((newActions: React.ReactNode) => {
    setActionsState(newActions);
  }, []);

  const value = useMemo(
    () => ({ title, setTitle, actions, setActions }),
    [title, setTitle, actions, setActions]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}

