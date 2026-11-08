'use client';

import React, { createContext, useContext, useState } from 'react';

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
  const [title, setTitle] = useState('Intelligence Dashboard');
  const [actions, setActions] = useState<React.ReactNode>(null);

  return (
    <AdminContext.Provider value={{ title, setTitle, actions, setActions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}

