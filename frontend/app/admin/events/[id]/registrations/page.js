'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import Link from 'next/link';

const ADMIN_BASE = `/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}`;

export default function AdminEventRegistrationsPage({ params }) {
  const id = params.id;
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [event, setEvent] = useState(null);

  // Notification modal state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyForm, setNotifyForm] = useState({
    title: '',
    message: '',
    type: 'info',
    deliveryMethods: ['push', 'email'],
  });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Post-CSV-export banner
  const [showCsvBanner, setShowCsvBanner] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const searchParams = new URLSearchParams({ page, limit: 50 });
    if (search) searchParams.set('search', search);
    if (paymentFilter) searchParams.set('paymentStatus', paymentFilter);

    const [{ data: regData }, { data: eventData }] = await Promise.all([
      apiGet(`/api/v1/admin/events/${id}/registrations?${searchParams}`),
      apiGet(`/api/v1/events/${id}`)
    ]);

    if (regData) {
      setRegistrations(regData.registrations || []);
      setTotal(regData.total || 0);
      setPages(regData.pages || 1);
    }
    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [id, page, search, paymentFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Full Name', 'Email', 'Phone', 'College/Company', 'Role', 'City', 'Payment Status', 'Ticket Type', 'Attendance', 'Reg Date'];
    const rows = registrations.map(r => [
      `"${r.fullName || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phoneNumber || ''}"`,
      `"${r.collegeCompany || ''}"`,
      `"${r.roleProfession || ''}"`,
      `"${r.city || ''}"`,
      `"${r.paymentStatus || ''}"`,
      `"${r.ticketType || ''}"`,
      `"${r.attendanceStatus || ''}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `event_registrations_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show post-export banner
    setShowCsvBanner(true);
    setTimeout(() => setShowCsvBanner(false), 15000);
  };

  const [recounting, setRecounting] = useState(false);
  const recount = async () => {
    setRecounting(true);
    const { data, error } = await apiPost(`/api/v1/admin/events/${id}/recount`);
    setRecounting(false);
    if (error) {
      alert(error.message || 'Recount failed');
      return;
    }
    alert(`Counts recalculated: ${data?.total ?? 0} total registration(s).`);
    load();
  };

  const openNotifyModal = () => {
    setNotifyForm({
      title: event ? `Update: ${event.title}` : 'Event Update',
      message: '',
      type: 'info',
      deliveryMethods: ['push', 'email'],
    });
    setSendResult(null);
    setShowNotifyModal(true);
    setShowCsvBanner(false);
  };

  const toggleDeliveryMethod = (method) => {
    setNotifyForm(prev => {
      const methods = prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter(m => m !== method)
        : [...prev.deliveryMethods, method];
      return { ...prev, deliveryMethods: methods };
    });
  };

  const handleSendNotification = async () => {
    if (!notifyForm.title || !notifyForm.message) return;
    if (notifyForm.deliveryMethods.length === 0) return;

    // Confirmation for large groups
    if (total > 10) {
      const methods = notifyForm.deliveryMethods.map(m => m === 'email' ? 'Email' : 'In-App').join(' + ');
      if (!confirm(`You are about to send ${methods} notifications to ${total} registrants. Continue?`)) return;
    }

    setSending(true);
    setSendResult(null);

    const { data, error } = await apiPost(`/api/v1/admin/events/${id}/notify-registrants`, notifyForm);

    setSending(false);

    if (data) {
      setSendResult({ success: true, ...data });
    } else {
      setSendResult({ success: false, error: error || 'Failed to send notifications' });
    }
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
        <div>
          <Link href={`${ADMIN_BASE}/events`} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', marginBottom: 4, display: 'inline-block' }}>
            ← Back to Events
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
            Registrations: {event ? event.title : 'Loading...'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={recount} disabled={recounting} title="Recalculate registration counts from actual records">
            {recounting ? 'Recounting…' : 'Recount'}
          </button>
          <button className="btn btn-secondary" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-primary" onClick={openNotifyModal}>
            📢 Send Notification
          </button>
        </div>
      </div>

      {/* Post-CSV-Export Banner */}
      {showCsvBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            border: '1px solid #c7d2fe',
            borderRadius: 12,
            padding: '14px 20px',
            marginBottom: 20,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>📥</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#3730a3' }}>CSV Exported Successfully!</div>
              <div style={{ fontSize: 13, color: '#4338ca' }}>
                Want to notify these {total} registrants via email or in-app notification?
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={openNotifyModal}
              style={{ background: '#4338ca', borderColor: '#4338ca' }}
            >
              📢 Send Notification
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowCsvBanner(false)}
              style={{ background: 'transparent', border: '1px solid #a5b4fc', color: '#4338ca' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input 
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setPage(1)}
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, flex: 1, maxWidth: 300 }}
        />
        <select
          value={paymentFilter}
          onChange={e => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
        >
          <option value="">All Payment Status</option>
          <option value="Free">Free</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <button className="btn btn-secondary" onClick={() => setPage(1)}>Apply Filters</button>
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
                <th>Registrant</th>
                <th>Contact</th>
                <th>Company/College</th>
                <th>Payment</th>
                <th>Ticket</th>
                <th>Attendance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{reg.fullName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.roleProfession || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{reg.email}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.phoneNumber || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{reg.collegeCompany || '-'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.city || '-'}</div>
                  </td>
                  <td>
                    <span className={`badge ${reg.paymentStatus === 'Completed' ? 'badge-green' : reg.paymentStatus === 'Free' ? 'badge-blue' : 'badge-orange'}`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td>{reg.ticketType}</td>
                  <td>
                    <span className={`badge ${reg.attendanceStatus === 'Attended' ? 'badge-green' : 'badge-gray'}`}>
                      {reg.attendanceStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No registrations found
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

      {/* Notification Modal */}
      {showNotifyModal && (
        <div className="admin-modal-overlay" onClick={() => !sending && setShowNotifyModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 560 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h2>📢 Send Notification to Registrants</h2>
              <button className="admin-modal-close" onClick={() => !sending && setShowNotifyModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Target Info Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 20 }}>🎯</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#166534' }}>
                    Target: Event Registrants
                  </div>
                  <div style={{ fontSize: 12, color: '#15803d' }}>
                    {total} registrant{total !== 1 ? 's' : ''} for "{event?.title || 'this event'}"
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="admin-form-group">
                <label>Title *</label>
                <input
                  value={notifyForm.title}
                  onChange={e => setNotifyForm({ ...notifyForm, title: e.target.value })}
                  placeholder="Notification title..."
                  disabled={sending}
                />
              </div>

              {/* Message */}
              <div className="admin-form-group">
                <label>Message *</label>
                <textarea
                  value={notifyForm.message}
                  onChange={e => setNotifyForm({ ...notifyForm, message: e.target.value })}
                  placeholder="Write your message to all registrants..."
                  rows={5}
                  disabled={sending}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Type + Delivery Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="admin-form-group">
                  <label>Notification Type</label>
                  <select
                    value={notifyForm.type}
                    onChange={e => setNotifyForm({ ...notifyForm, type: e.target.value })}
                    disabled={sending}
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="announcement">📢 Announcement</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Delivery Method</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6 }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: sending ? 'not-allowed' : 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        margin: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={notifyForm.deliveryMethods.includes('push')}
                        onChange={() => toggleDeliveryMethod('push')}
                        disabled={sending}
                      />
                      🔔 In-App Notification
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: sending ? 'not-allowed' : 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        margin: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={notifyForm.deliveryMethods.includes('email')}
                        onChange={() => toggleDeliveryMethod('email')}
                        disabled={sending}
                      />
                      ✉️ Email
                    </label>
                  </div>
                </div>
              </div>

              {/* Delivery method warning */}
              {notifyForm.deliveryMethods.length === 0 && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#991b1b',
                    marginTop: 8,
                  }}
                >
                  ⚠️ Please select at least one delivery method.
                </div>
              )}

              {/* Send Result */}
              {sendResult && (
                <div
                  style={{
                    marginTop: 16,
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: sendResult.success
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                      : '#fef2f2',
                    border: sendResult.success ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  }}
                >
                  {sendResult.success ? (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 6 }}>
                        ✅ Notifications Sent Successfully!
                      </div>
                      <div style={{ fontSize: 13, color: '#15803d', display: 'flex', gap: 16 }}>
                        {sendResult.pushed > 0 && (
                          <span>🔔 {sendResult.pushed} in-app</span>
                        )}
                        {sendResult.emailed > 0 && (
                          <span>✉️ {sendResult.emailed} emails sent</span>
                        )}
                        <span>👥 {sendResult.notified} total registrants</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#991b1b' }}>
                      ❌ {sendResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNotifyModal(false)}
                disabled={sending}
              >
                {sendResult?.success ? 'Close' : 'Cancel'}
              </button>
              {!sendResult?.success && (
                <button
                  className="btn btn-primary"
                  onClick={handleSendNotification}
                  disabled={sending || !notifyForm.title || !notifyForm.message || notifyForm.deliveryMethods.length === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: (sending || !notifyForm.title || !notifyForm.message || notifyForm.deliveryMethods.length === 0) ? 0.6 : 1,
                  }}
                >
                  {sending ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>📢 Send to {total} Registrant{total !== 1 ? 's' : ''}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
