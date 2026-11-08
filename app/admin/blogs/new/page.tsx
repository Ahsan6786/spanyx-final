'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogEditor from '@/components/admin/BlogEditor';

export default function NewBlogPage() {
  return (
    <AdminLayout title="Draft New Article">
      <BlogEditor isEditing={false} />
    </AdminLayout>
  );
}

