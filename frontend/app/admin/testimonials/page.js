'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    status: 'pending',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const { data } = await apiGet(`/api/v1/admin/testimonials?${params}`);
    if (data) {
      setTestimonials(data.testimonials || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', role: '', company: '', content: '', rating: 5, status: 'pending' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.content) return;
    if (editItem) {
      await apiPatch(`/api/v1/admin/testimonials/${editItem._id}`, form);
    } else {
      await apiPost('/api/v1/admin/testimonials', form);
    }
    setShowModal(false);
    load();
  };

  const handleStatusChange = async (id, status) => {
    await apiPatch(`/api/v1/admin/testimonials/${id}`, { status });
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this testimonial?')) return;
    await apiDelete(`/api/v1/admin/testimonials/${id}`);
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
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Testimonials</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Testimonial
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
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
                <th>Name</th>
                <th>Role / Company</th>
                <th>Content</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td style={{ color: '#64748b' }}>
                    {[t.role, t.company].filter(Boolean).join(' @ ') || '-'}
                  </td>
                  <td
                    style={{
                      maxWidth: 250,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#475569',
                    }}
                  >
                    {t.content}
                  </td>
                  <td>
                    {'★'.repeat(t.rating)}
                    {'☆'.repeat(5 - t.rating)}
                  </td>
                  <td>
                    <span
                      className={`badge ${t.status === 'approved' ? 'badge-green' : t.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {t.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(t._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusChange(t._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {t.status !== 'pending' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(t._id, 'pending')}
                        >
                          Reset
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No testimonials yet
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
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>
                        {n} Star{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Role</label>
                  <input
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Founder"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Company</label>
                  <input
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
