'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
};

export default function AdminMentorsPage() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModal, setDeleteModal] = useState(null); // holds the app being deleted
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const appsRes = await apiGet(`/api/v1/mentors/applications?${params.toString()}`);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);

      const reqsRes = await apiGet('/api/v1/mentors/requests');
      setRequests(Array.isArray(reqsRes.data) ? reqsRes.data : []);
    } catch (err) {
      console.error('Error fetching mentors data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await apiPatch(`/api/v1/mentors/applications/${id}/approve`);
      if (res.error) {
        showToast(res.error.message || 'Failed to approve', 'error');
      } else {
        showToast('Mentor approved! Account created and email sent.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to approve application', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      const res = await apiPatch(`/api/v1/mentors/applications/${rejectModal}/reject`, { reason: rejectReason });
      if (res.error) {
        showToast(res.error.message || 'Failed to reject', 'error');
      } else {
        showToast('Application rejected. Email notification sent.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to reject application', 'error');
    } finally {
      setActionLoading(null);
      setRejectModal(null);
      setRejectReason('');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(deleteModal._id);
    try {
      const res = await apiDelete(`/api/v1/mentors/applications/${deleteModal._id}`);
      if (res.error) {
        showToast(res.error.message || 'Failed to delete', 'error');
      } else {
        showToast(
          deleteModal.status === 'approved'
            ? 'Mentor removed. They no longer appear on the site.'
            : 'Application deleted.',
          'success'
        );
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    } finally {
      setActionLoading(null);
      setDeleteModal(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const s = {
    page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
    tab: (active) => ({ padding: '10px 20px', background: active ? '#1e293b' : '#f1f5f9', color: active ? '#fff' : '#475569', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }),
    filterBar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none', transition: 'border-color 0.2s' },
    filterBtn: (active) => ({ padding: '6px 14px', border: '1px solid', borderColor: active ? '#1e293b' : '#e2e8f0', background: active ? '#1e293b' : '#fff', color: active ? '#fff' : '#475569', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }),
    card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '12px', overflow: 'hidden', transition: 'box-shadow 0.2s' },
    cardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    cardLeft: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1 },
    avatar: (name) => ({ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #e63946, #ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '16px', flexShrink: 0 }),
    cardInfo: { flex: 1 },
    cardName: { fontWeight: '600', color: '#1e293b', fontSize: '15px', margin: 0 },
    cardEmail: { fontSize: '13px', color: '#64748b', margin: '2px 0 0' },
    cardMeta: { display: 'flex', gap: '16px', alignItems: 'center' },
    badge: (status) => ({ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: STATUS_COLORS[status]?.bg || '#f1f5f9', color: STATUS_COLORS[status]?.color || '#475569' }),
    cardDate: { fontSize: '12px', color: '#94a3b8' },
    expandedContent: { padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' },
    detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' },
    detailItem: { background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' },
    detailLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
    detailValue: { fontSize: '14px', color: '#1e293b', fontWeight: '500' },
    expertiseTag: { display: 'inline-block', padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '6px', fontSize: '12px', fontWeight: '500', margin: '2px' },
    actionBar: { display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' },
    approveBtn: { padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'opacity 0.2s' },
    rejectBtn: { padding: '10px 24px', background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' },
    deleteBtn: { padding: '8px 16px', background: '#fff', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
    modalText: { fontSize: '14px', color: '#64748b', marginBottom: '16px' },
    textarea: { width: '100%', minHeight: '100px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
    modalActions: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' },
    cancelBtn: { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    confirmRejectBtn: { padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    toast: (type) => ({ position: 'fixed', bottom: '24px', right: '24px', padding: '14px 24px', borderRadius: '12px', color: '#fff', fontWeight: '600', fontSize: '14px', zIndex: 10000, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', background: type === 'success' ? '#10b981' : '#ef4444', animation: 'slideIn 0.3s ease' }),
    emptyState: { textAlign: 'center', padding: '48px 24px', color: '#94a3b8' },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: '14px 16px', background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', fontWeight: '600' },
    td: { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
    statsRow: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    statCard: (bg) => ({ padding: '16px 20px', background: bg, borderRadius: '10px', flex: '1', minWidth: '140px' }),
    statValue: { fontSize: '24px', fontWeight: '700', color: '#1e293b' },
    statLabel: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={s.modalOverlay} onClick={() => { setRejectModal(null); setRejectReason(''); }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Reject Application</h3>
            <p style={s.modalText}>Provide a reason for rejection. This will be sent to the applicant via email.</p>
            <textarea
              style={s.textarea}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g., Insufficient experience in the required domain..."
            />
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button
                style={s.confirmRejectBtn}
                onClick={handleReject}
                disabled={actionLoading === rejectModal}
              >
                {actionLoading === rejectModal ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div style={s.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>
              {deleteModal.status === 'approved' ? 'Remove this mentor?' : 'Delete this application?'}
            </h3>
            <p style={s.modalText}>
              {deleteModal.status === 'approved' ? (
                <>
                  <strong>{deleteModal.fullName}</strong> will be removed from the public mentors
                  page and lose mentor access. Their user account is kept (downgraded to a normal
                  user), so their other data is preserved. This cannot be undone.
                </>
              ) : (
                <>
                  This permanently deletes <strong>{deleteModal.fullName}</strong>&apos;s application.
                  This cannot be undone.
                </>
              )}
            </p>
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button
                style={s.confirmRejectBtn}
                onClick={handleDelete}
                disabled={actionLoading === deleteModal._id}
              >
                {actionLoading === deleteModal._id
                  ? 'Removing...'
                  : deleteModal.status === 'approved' ? 'Remove Mentor' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Mentor Management</h1>
          <p style={s.subtitle}>Review applications, manage mentors, and handle requests</p>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard('#f0fdf4')}>
          <div style={s.statValue}>{applications.length}</div>
          <div style={s.statLabel}>Total Applications</div>
        </div>
        <div style={s.statCard('#fef3c7')}>
          <div style={s.statValue}>{pendingCount}</div>
          <div style={s.statLabel}>Pending Review</div>
        </div>
        <div style={s.statCard('#dcfce7')}>
          <div style={s.statValue}>{approvedCount}</div>
          <div style={s.statLabel}>Approved</div>
        </div>
        <div style={s.statCard('#fee2e2')}>
          <div style={s.statValue}>{rejectedCount}</div>
          <div style={s.statLabel}>Rejected</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={s.tab(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>
          Mentor Applications
        </button>
        <button style={s.tab(activeTab === 'requests')} onClick={() => setActiveTab('requests')}>
          Find Mentor Requests
        </button>
      </div>

      {activeTab === 'applications' && (
        <>
          {/* Filter Bar */}
          <div style={s.filterBar}>
            <input
              style={s.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
            />
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} style={s.filterBtn(statusFilter === f)} onClick={() => setStatusFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Applications List */}
          {loading ? (
            <div style={s.emptyState}><p>Loading applications...</p></div>
          ) : applications.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>📭</div>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>No applications found</p>
              <p style={{ fontSize: '14px' }}>Try adjusting your filters or search query</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id} style={s.card}>
                <div style={s.cardHeader} onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
                  <div style={s.cardLeft}>
                    <div style={s.avatar()}>
                      {app.profileImage ? (
                        <img
                          src={app.profileImage}
                          alt={app.fullName}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        app.fullName?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <div style={s.cardInfo}>
                      <p style={s.cardName}>{app.fullName}</p>
                      <p style={s.cardEmail}>{app.email} · {app.currentRole} at {app.company}</p>
                    </div>
                  </div>
                  <div style={s.cardMeta}>
                    <span style={s.badge(app.status)}>{STATUS_COLORS[app.status]?.label || app.status}</span>
                    <span style={s.cardDate}>{formatDate(app.createdAt)}</span>
                    <span style={{ fontSize: '18px', color: '#94a3b8', transition: 'transform 0.2s', transform: expandedId === app._id ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                  </div>
                </div>

                {expandedId === app._id && (
                  <div style={s.expandedContent}>
                    {/* Large photo so the admin can actually see the applicant's
                        face before approving. Click to open full size. */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={s.detailLabel}>Profile Photo</div>
                      {app.profileImage ? (
                        <a href={app.profileImage} target="_blank" rel="noopener noreferrer" title="Open full size">
                          <img
                            src={app.profileImage}
                            alt={`${app.fullName} profile`}
                            style={{ marginTop: '6px', width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e5e7eb', cursor: 'zoom-in', display: 'block' }}
                          />
                        </a>
                      ) : (
                        <div style={{ marginTop: '6px', fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>
                          No photo provided
                        </div>
                      )}
                    </div>

                    <div style={s.detailGrid}>
                      <div style={s.detailItem}>
                        <div style={s.detailLabel}>Phone</div>
                        <div style={s.detailValue}>{app.phone || '—'}</div>
                      </div>
                      <div style={s.detailItem}>
                        <div style={s.detailLabel}>Experience</div>
                        <div style={s.detailValue}>{app.experience || '—'}</div>
                      </div>
                      <div style={s.detailItem}>
                        <div style={s.detailLabel}>Availability</div>
                        <div style={s.detailValue}>{app.availability || '—'}</div>
                      </div>
                      <div style={s.detailItem}>
                        <div style={s.detailLabel}>LinkedIn</div>
                        <div style={s.detailValue}>
                          {app.linkedin ? <a href={app.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{app.linkedin}</a> : '—'}
                        </div>
                      </div>
                    </div>

                    {app.bio && (
                      <div style={{ ...s.detailItem, marginTop: '12px' }}>
                        <div style={s.detailLabel}>Professional Bio</div>
                        <div style={{ ...s.detailValue, fontWeight: '400', lineHeight: '1.6' }}>{app.bio}</div>
                      </div>
                    )}

                    {app.expertise && app.expertise.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={s.detailLabel}>Expertise Areas</div>
                        <div style={{ marginTop: '6px' }}>
                          {app.expertise.map((exp, i) => (
                            <span key={i} style={s.expertiseTag}>{exp}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.status === 'rejected' && app.rejectionReason && (
                      <div style={{ ...s.detailItem, marginTop: '12px', background: '#fef2f2', borderLeft: '3px solid #ef4444' }}>
                        <div style={{ ...s.detailLabel, color: '#991b1b' }}>Rejection Reason</div>
                        <div style={{ ...s.detailValue, color: '#991b1b', fontWeight: '400' }}>{app.rejectionReason}</div>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div style={s.actionBar}>
                        <button
                          style={{ ...s.approveBtn, opacity: actionLoading === app._id ? 0.7 : 1 }}
                          onClick={() => handleApprove(app._id)}
                          disabled={actionLoading === app._id}
                        >
                          {actionLoading === app._id ? 'Approving...' : '✓ Approve & Create Account'}
                        </button>
                        <button
                          style={s.rejectBtn}
                          onClick={() => setRejectModal(app._id)}
                          disabled={actionLoading === app._id}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {app.status === 'approved' && (
                      <div style={{ ...s.actionBar, alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                          ✓ Approved on {formatDate(app.approvedAt)} — User account created
                        </span>
                        <button
                          style={s.deleteBtn}
                          onClick={() => setDeleteModal(app)}
                          disabled={actionLoading === app._id}
                        >
                          🗑 Remove Mentor
                        </button>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div style={{ ...s.actionBar, justifyContent: 'flex-end' }}>
                        <button
                          style={s.deleteBtn}
                          onClick={() => setDeleteModal(app)}
                          disabled={actionLoading === app._id}
                        >
                          🗑 Delete Application
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        loading ? (
          <div style={s.emptyState}><p>Loading requests...</p></div>
        ) : requests.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>No mentor requests yet</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>User Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Area of Interest</th>
                <th style={s.th}>Message</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td style={s.td}>{req.name}</td>
                  <td style={s.td}>{req.email}</td>
                  <td style={s.td}>{req.area}</td>
                  <td style={{ ...s.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.message || '—'}</td>
                  <td style={s.td}>
                    <span style={s.badge(req.status)}>{req.status}</span>
                  </td>
                  <td style={s.td}>{formatDate(req.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
