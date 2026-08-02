'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ userId: '', courseId: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await apiGet(`/api/v1/admin/enrollments?page=${page}&limit=20`);
    if (data) {
      setEnrollments(data.enrollments || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!form.userId || !form.courseId) return;
    await apiPost('/api/v1/admin/enrollments', form);
    setShowModal(false);
    setForm({ userId: '', courseId: '' });
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
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Enrollments</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Manual Enroll
        </button>
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
                <th>Student</th>
                <th>Course</th>
                <th>Payment</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e._id}>
                  <td style={{ fontWeight: 500 }}>
                    {e.userId?.fullName || e.userId?.email || '-'}
                  </td>
                  <td style={{ color: '#64748b' }}>{e.courseId?.title || '-'}</td>
                  <td>
                    <span
                      className={`badge ${e.paymentStatus === 'completed' || e.paymentStatus === 'paid' ? 'badge-green' : e.paymentStatus === 'free' ? 'badge-blue' : 'badge-yellow'}`}
                    >
                      {e.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${e.progress || 0}%`,
                            height: '100%',
                            background: '#10b981',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{e.progress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${e.completed ? 'badge-green' : 'badge-blue'}`}>
                      {e.completed ? 'Complete' : 'Active'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>
                Page {page} of {pages} ({total} total)
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
              <h2>Manual Enrollment</h2>
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
                <label>User ID</label>
                <input
                  placeholder="Enter user MongoDB ID"
                  value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Course ID</label>
                <input
                  placeholder="Enter course MongoDB ID"
                  value={form.courseId}
                  onChange={e => setForm({ ...form, courseId: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Enroll User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
