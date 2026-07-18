'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';

// Investor admin — mirror of the mentor admin page, adapted for investor fields
// and the /api/v1/investors/applications endpoints.
const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
};

export default function AdminInvestorsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
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
      const res = await apiGet(`/api/v1/investors/applications?${params.toString()}`);
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching investors data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await apiPatch(`/api/v1/investors/applications/${id}/approve`);
      if (res.error) showToast(res.error.message || 'Failed to approve', 'error');
      else { showToast('Investor approved! Account created and email sent.', 'success'); fetchData(); }
    } catch (err) {
      showToast('Failed to approve application', 'error');
    } finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      const res = await apiPatch(`/api/v1/investors/applications/${rejectModal}/reject`, { reason: rejectReason });
      if (res.error) showToast(res.error.message || 'Failed to reject', 'error');
      else { showToast('Application rejected. Email notification sent.', 'success'); fetchData(); }
    } catch (err) {
      showToast('Failed to reject application', 'error');
    } finally { setActionLoading(null); setRejectModal(null); setRejectReason(''); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(deleteModal._id);
    try {
      const res = await apiDelete(`/api/v1/investors/applications/${deleteModal._id}`);
      if (res.error) showToast(res.error.message || 'Failed to delete', 'error');
      else {
        showToast(deleteModal.status === 'approved' ? 'Investor removed. They no longer appear on the site.' : 'Application deleted.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    } finally { setActionLoading(null); setDeleteModal(null); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const s = {
    page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0' },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none' },
    filterBtn: (active) => ({ padding: '6px 14px', border: '1px solid', borderColor: active ? '#1e293b' : '#e2e8f0', background: active ? '#1e293b' : '#fff', color: active ? '#fff' : '#475569', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }),
    card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '12px', overflow: 'hidden' },
    cardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    cardLeft: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1 },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #e63946, #ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '16px', flexShrink: 0, backgroundSize: 'cover' },
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
    tag: { display: 'inline-block', padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '6px', fontSize: '12px', fontWeight: '500', margin: '2px' },
    actionBar: { display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' },
    approveBtn: { padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    rejectBtn: { padding: '10px 24px', background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    deleteBtn: { padding: '8px 16px', background: '#fff', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
    modalText: { fontSize: '14px', color: '#64748b', marginBottom: '16px' },
    textarea: { width: '100%', minHeight: '100px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
    modalActions: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' },
    cancelBtn: { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    confirmBtn: { padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    toast: (type) => ({ position: 'fixed', bottom: '24px', right: '24px', padding: '14px 24px', borderRadius: '12px', color: '#fff', fontWeight: '600', fontSize: '14px', zIndex: 10000, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', background: type === 'success' ? '#10b981' : '#ef4444' }),
    emptyState: { textAlign: 'center', padding: '48px 24px', color: '#94a3b8' },
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
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}

      {rejectModal && (
        <div style={s.modalOverlay} onClick={() => { setRejectModal(null); setRejectReason(''); }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Reject Application</h3>
            <p style={s.modalText}>Provide a reason for rejection. This will be sent to the applicant via email.</p>
            <textarea style={s.textarea} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g., Does not meet our current criteria..." />
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button style={s.confirmBtn} onClick={handleReject} disabled={actionLoading === rejectModal}>{actionLoading === rejectModal ? 'Rejecting...' : 'Confirm Reject'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div style={s.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{deleteModal.status === 'approved' ? 'Remove this investor?' : 'Delete this application?'}</h3>
            <p style={s.modalText}>
              {deleteModal.status === 'approved'
                ? <><strong>{deleteModal.fullName}</strong> will be removed from the public investors page and lose investor access. Their user account is kept (downgraded to a normal user). This cannot be undone.</>
                : <>This permanently deletes <strong>{deleteModal.fullName}</strong>&apos;s application. This cannot be undone.</>}
            </p>
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button style={s.confirmBtn} onClick={handleDelete} disabled={actionLoading === deleteModal._id}>
                {actionLoading === deleteModal._id ? 'Removing...' : deleteModal.status === 'approved' ? 'Remove Investor' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Investor Management</h1>
          <p style={s.subtitle}>Review investor applications, approve or reject, and manage listed investors</p>
        </div>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard('#f0fdf4')}><div style={s.statValue}>{applications.length}</div><div style={s.statLabel}>Total Applications</div></div>
        <div style={s.statCard('#fef3c7')}><div style={s.statValue}>{pendingCount}</div><div style={s.statLabel}>Pending Review</div></div>
        <div style={s.statCard('#dcfce7')}><div style={s.statValue}>{approvedCount}</div><div style={s.statLabel}>Approved</div></div>
        <div style={s.statCard('#fee2e2')}><div style={s.statValue}>{rejectedCount}</div><div style={s.statLabel}>Rejected</div></div>
      </div>

      <div style={s.filterBar}>
        <input style={s.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or organization..." />
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} style={s.filterBtn(statusFilter === f)} onClick={() => setStatusFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.emptyState}><p>Loading applications...</p></div>
      ) : applications.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>No applications found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your filters or search query</p>
        </div>
      ) : (
        applications.map(app => (
          <div key={app._id} style={s.card}>
            <div style={s.cardHeader} onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
              <div style={s.cardLeft}>
                <div style={{ ...s.avatar, ...(app.profileImage ? { background: `url(${app.profileImage}) center/cover` } : {}) }}>
                  {!app.profileImage && (app.fullName?.charAt(0)?.toUpperCase() || '?')}
                </div>
                <div style={s.cardInfo}>
                  <p style={s.cardName}>{app.fullName}</p>
                  <p style={s.cardEmail}>{app.email} · {app.investorType}{app.organizationName ? ` at ${app.organizationName}` : ''}</p>
                </div>
              </div>
              <div style={s.cardMeta}>
                <span style={s.badge(app.status)}>{STATUS_COLORS[app.status]?.label || app.status}</span>
                <span style={s.cardDate}>{formatDate(app.createdAt)}</span>
                <span style={{ fontSize: '18px', color: '#94a3b8', transform: expandedId === app._id ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
              </div>
            </div>

            {expandedId === app._id && (
              <div style={s.expandedContent}>
                <div style={s.detailGrid}>
                  <div style={s.detailItem}><div style={s.detailLabel}>Phone</div><div style={s.detailValue}>{app.phone || '—'}</div></div>
                  <div style={s.detailItem}><div style={s.detailLabel}>Investor Type</div><div style={s.detailValue}>{app.investorType || '—'}</div></div>
                  <div style={s.detailItem}><div style={s.detailLabel}>Ticket Size</div><div style={s.detailValue}>{app.ticketSize || '—'}</div></div>
                  <div style={s.detailItem}><div style={s.detailLabel}>LinkedIn</div><div style={s.detailValue}>{app.linkedin ? <a href={app.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>View</a> : '—'}</div></div>
                </div>

                {app.bio && <div style={{ ...s.detailItem, marginTop: '12px' }}><div style={s.detailLabel}>Bio</div><div style={{ ...s.detailValue, fontWeight: '400', lineHeight: '1.6' }}>{app.bio}</div></div>}

                {app.investmentFocus?.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={s.detailLabel}>Investment Focus</div>
                    <div style={{ marginTop: '6px' }}>{app.investmentFocus.map((x, i) => <span key={i} style={s.tag}>{x}</span>)}</div>
                  </div>
                )}
                {app.preferredStages?.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={s.detailLabel}>Preferred Stages</div>
                    <div style={{ marginTop: '6px' }}>{app.preferredStages.map((x, i) => <span key={i} style={s.tag}>{x}</span>)}</div>
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
                    <button style={{ ...s.approveBtn, opacity: actionLoading === app._id ? 0.7 : 1 }} onClick={() => handleApprove(app._id)} disabled={actionLoading === app._id}>
                      {actionLoading === app._id ? 'Approving...' : '✓ Approve & Create Account'}
                    </button>
                    <button style={s.rejectBtn} onClick={() => setRejectModal(app._id)} disabled={actionLoading === app._id}>✕ Reject</button>
                  </div>
                )}
                {app.status === 'approved' && (
                  <div style={{ ...s.actionBar, alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#166534', fontSize: '13px', fontWeight: '500' }}>✓ Approved on {formatDate(app.approvedAt)} — User account created</span>
                    <button style={s.deleteBtn} onClick={() => setDeleteModal(app)} disabled={actionLoading === app._id}>🗑 Remove Investor</button>
                  </div>
                )}
                {app.status === 'rejected' && (
                  <div style={{ ...s.actionBar, justifyContent: 'flex-end' }}>
                    <button style={s.deleteBtn} onClick={() => setDeleteModal(app)} disabled={actionLoading === app._id}>🗑 Delete Application</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
