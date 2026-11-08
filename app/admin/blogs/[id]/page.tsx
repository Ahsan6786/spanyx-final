'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogEditor from '@/components/admin/BlogEditor';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blog');
        return res.json();
      })
      .then((json) => {
        if (json.success && json.blog) {
          setBlog(json.blog);
        } else {
          setError('Article not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Error fetching article');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout title="Edit Article">
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid rgba(0, 113, 227, 0.2)',
              borderTopColor: '#0071e3',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <p style={{ fontSize: 13.5, fontWeight: 600 }}>Loading article details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !blog) {
    return (
      <AdminLayout title="Edit Article">
        <div style={{ padding: 32, textAlign: 'center', background: '#fee2e2', color: '#b91c1c', borderRadius: 12 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{error || 'Article Not Found'}</h3>
          <p style={{ margin: '0 0 16px', fontSize: 13 }}>The requested article could not be loaded or may have been deleted.</p>
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: '#b91c1c',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to All Articles
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editing: ${blog.title}`}>
      <BlogEditor initialData={blog} isEditing={true} />
    </AdminLayout>
  );
}

