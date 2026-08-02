'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await apiGet(`/api/v1/admin/certificates?page=${page}&limit=20`);
    if (data) {
      setCertificates(data.certificates || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevoke = async id => {
    if (!confirm('Revoke this certificate?')) return;
    await apiPost(`/api/v1/admin/certificates/${id}/revoke`);
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
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Certificates</h1>
        <span style={{ fontSize: 13, color: '#64748b' }}>{total} issued</span>
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
                <th>Certificate #</th>
                <th>Student</th>
                <th>Course</th>
                <th>Score</th>
                <th>Status</th>
                <th>Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(c => (
                <tr key={c._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                    {c.certificateNumber}
                  </td>
                  <td>{c.userName || c.userId?.fullName || '-'}</td>
                  <td style={{ color: '#64748b' }}>{c.courseTitle || c.courseId?.title || '-'}</td>
                  <td style={{ fontWeight: 600 }}>{c.overallScore}%</td>
                  <td>
                    <span className={`badge ${c.isVerified ? 'badge-green' : 'badge-red'}`}>
                      {c.isVerified ? 'Verified' : 'Revoked'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(c.completionDate).toLocaleDateString()}
                  </td>
                  <td>
                    {c.isVerified && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(c._id)}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No certificates issued yet
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
