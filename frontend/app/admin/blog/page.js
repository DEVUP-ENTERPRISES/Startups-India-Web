'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const { data } = await apiGet(`/api/v1/admin/blog?${params}`);
    if (data) {
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditPost(null);
    setForm({ title: '', slug: '', content: '', excerpt: '', category: '', status: 'draft' });
    setShowModal(true);
  };

  const openEdit = post => {
    setEditPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || '',
      status: post.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) return;
    if (editPost) {
      await apiPatch(`/api/v1/admin/blog/${editPost._id}`, form);
    } else {
      await apiPost('/api/v1/admin/blog', form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this post?')) return;
    await apiDelete(`/api/v1/admin/blog/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div
        className="admin-topbar"
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Blog / CMS</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + New Post
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td style={{ color: '#64748b' }}>{p.category || '-'}</td>
                  <td>{p.author?.fullName || '-'}</td>
                  <td>
                    <span
                      className={`badge ${p.status === 'published' ? 'badge-green' : p.status === 'archived' ? 'badge-gray' : 'badge-yellow'}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.viewCount || 0}</td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No blog posts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>
                Page {page} of {pages}
              </span>
              <div className="pagination-btns">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editPost ? 'Edit Post' : 'New Post'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Slug</label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                />
              </div>
              <div className="admin-form-group">
                <label>Excerpt</label>
                <input
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Content</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editPost ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
