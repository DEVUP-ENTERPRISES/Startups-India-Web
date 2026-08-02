'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const { data } = await apiGet(`/api/v1/admin/payments?${params}`);
    if (data) {
      setPayments(data.payments || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefund = async id => {
    if (!confirm('Process refund for this payment?')) return;
    await apiPost(`/api/v1/admin/payments/${id}/refund`);
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
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Payments</h1>
        <span style={{ fontSize: 13, color: '#64748b' }}>{total} transactions</span>
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
          <option value="succeeded">Succeeded</option>
          <option value="created">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
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
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 500 }}>
                    {p.userId?.fullName || p.userId?.email || '-'}
                  </td>
                  <td style={{ color: '#64748b' }}>{p.courseId?.title || '-'}</td>
                  <td style={{ fontWeight: 700 }}>₹{(p.amount / 100).toLocaleString()}</td>
                  <td>
                    <span className="badge badge-gray">{p.provider}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${p.status === 'succeeded' ? 'badge-green' : p.status === 'refunded' ? 'badge-red' : p.status === 'failed' ? 'badge-red' : 'badge-yellow'}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {p.status === 'succeeded' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleRefund(p._id)}>
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No payments found
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
    </div>
  );
}
