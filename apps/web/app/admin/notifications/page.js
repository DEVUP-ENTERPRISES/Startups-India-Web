'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

// ── Push stats card ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 14,
      padding: '18px 22px',
      minWidth: 0,
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ margin: '8px 0 3px', fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value ?? '—'}</p>
      {sub && <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub}</p>}
    </div>
  );
}

export default function AdminNotificationsPage() {
  // ── In-app notifications state ──
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', target: 'all' });

  // ── Push notification state ──
  const [pushStats, setPushStats]     = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pushSending, setPushSending] = useState(false);
  const [pushResult, setPushResult]   = useState(null);
  const [pushForm, setPushForm] = useState({
    title: '',
    body: '',
    imageUrl: '',
    target: 'all',
    role: 'user',
  });

  // ── Load in-app notifications ──
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await apiGet(`/api/v1/admin/notifications?page=${page}&limit=20`);
    if (data) {
      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page]);

  // ── Load push stats ──
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    const { data } = await apiGet('/api/v1/admin/push/stats');
    if (data) setPushStats(data);
    setStatsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleSend = async () => {
    if (!form.title || !form.message) return;

    // Save to DB
    await apiPost('/api/v1/admin/notifications', form);

    // Also fire live FCM push to the same target
    const isAll = form.target === 'all';
    const pushEndpoint = isAll ? '/api/v1/admin/push/send-all' : '/api/v1/admin/push/send-role';

    await apiPost(pushEndpoint, {
      title: form.title,
      body:  form.message,
      ...(!isAll ? { role: form.target } : {}),
    });

    setShowModal(false);
    setForm({ title: '', message: '', type: 'info', target: 'all' });
    load();
    loadStats();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this notification?')) return;
    await apiDelete(`/api/v1/admin/notifications/${id}`);
    load();
  };

  // ── Send push notification ──
  const handleSendPush = async () => {
    if (!pushForm.title || !pushForm.body) {
      alert('Title and body are required for push notifications.');
      return;
    }
    setPushSending(true);
    setPushResult(null);

    const endpoint = pushForm.target === 'all'
      ? '/api/v1/admin/push/send-all'
      : '/api/v1/admin/push/send-role';

    const payload = {
      title:    pushForm.title,
      body:     pushForm.body,
      imageUrl: pushForm.imageUrl || undefined,
      ...(pushForm.target !== 'all' ? { role: pushForm.role } : {}),
    };

    const { data, error } = await apiPost(endpoint, payload);
    setPushSending(false);

    if (error) {
      setPushResult({ ok: false, msg: error?.message || 'Failed to send push.' });
    } else {
      setPushResult({ ok: true, msg: `Delivered to ${data?.sent ?? 0} device(s). Failed: ${data?.failed ?? 0}.` });
      loadStats();
    }
  };

  const typeColors = {
    info: 'badge-blue',
    warning: 'badge-yellow',
    success: 'badge-green',
    error: 'badge-red',
    announcement: 'badge-purple',
  };

  return (
    <div className="admin-page">
      {/* Top bar */}
      <div className="admin-topbar" style={{
        margin: '-28px -28px 28px',
        padding: '18px 28px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Notifications</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Send In-App Notification
        </button>
      </div>

      {/* ── PUSH NOTIFICATION PANEL ─────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: 18,
        padding: '28px 28px 24px',
        marginBottom: 28,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative blur dot */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(220,38,38,0.2)',
            border: '1px solid rgba(220,38,38,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>Push Notifications</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              Send real-time push to all subscribed users — even when the app is closed
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard
            label="Total Subscribers"
            value={statsLoading ? '...' : (pushStats?.totalSubscribers ?? 0)}
            sub="Devices registered"
            color="#ef4444"
          />
          <StatCard
            label="Users"
            value={statsLoading ? '...' : (pushStats?.byRole?.user ?? 0)}
            sub="role: user"
            color="#6366f1"
          />
          <StatCard
            label="Mentors"
            value={statsLoading ? '...' : (pushStats?.byRole?.mentor ?? 0)}
            sub="role: mentor"
            color="#f59e0b"
          />
          <StatCard
            label="Investors"
            value={statsLoading ? '...' : (pushStats?.byRole?.investor ?? 0)}
            sub="role: investor"
            color="#10b981"
          />
          <StatCard
            label="Admins"
            value={statsLoading ? '...' : (pushStats?.byRole?.admin ?? 0)}
            sub="role: admin"
            color="#8b5cf6"
          />
        </div>

        {/* Push compose form */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '20px 20px 16px',
          border: '1px solid rgba(255,255,255,0.10)',
        }}>
          <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 14 }}>Compose Push</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>
                Title *
              </label>
              <input
                placeholder="e.g. New Course Available!"
                value={pushForm.title}
                onChange={e => setPushForm({ ...pushForm, title: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>
                Send To
              </label>
              <select
                value={pushForm.target}
                onChange={e => setPushForm({ ...pushForm, target: e.target.value })}
                style={inputStyle}
              >
                <option value="all">All Subscribed Users</option>
                <option value="role">Specific Role</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>
              Body *
            </label>
            <textarea
              placeholder="Notification message (keep it punchy, under 100 chars)"
              value={pushForm.body}
              onChange={e => setPushForm({ ...pushForm, body: e.target.value })}
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>
                Image URL (optional)
              </label>
              <input
                placeholder="https://..."
                value={pushForm.imageUrl}
                onChange={e => setPushForm({ ...pushForm, imageUrl: e.target.value })}
                style={inputStyle}
              />
            </div>
            {pushForm.target === 'role' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>
                  Role
                </label>
                <select
                  value={pushForm.role}
                  onChange={e => setPushForm({ ...pushForm, role: e.target.value })}
                  style={inputStyle}
                >
                  <option value="user">Users</option>
                  <option value="mentor">Mentors</option>
                  <option value="investor">Investors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            )}
          </div>

          {/* Result banner */}
          {pushResult && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 600,
              background: pushResult.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${pushResult.ok ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              color: pushResult.ok ? '#6ee7b7' : '#fca5a5',
            }}>
              {pushResult.ok ? '✓ ' : '✗ '}{pushResult.msg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSendPush}
              disabled={pushSending}
              style={{
                padding: '11px 28px',
                borderRadius: 10,
                border: 'none',
                background: pushSending ? 'rgba(220,38,38,0.4)' : 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: pushSending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: pushSending ? 'none' : '0 4px 16px rgba(220,38,38,0.5)',
                transition: 'all 0.2s',
              }}
            >
              {pushSending ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Sending...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send Push Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── IN-APP NOTIFICATIONS TABLE ───────────────────────── */}
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#0f172a' }}>
        In-App Notification History
      </h2>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Type</th>
                <th>Target</th>
                <th>Sent By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n._id}>
                  <td style={{ fontWeight: 600 }}>{n.title}</td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                    {n.message}
                  </td>
                  <td><span className={`badge ${typeColors[n.type] || 'badge-gray'}`}>{n.type}</span></td>
                  <td><span className="badge badge-gray">{n.target}</span></td>
                  <td style={{ color: '#64748b' }}>{n.sentBy?.fullName || 'System'}</td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>{new Date(n.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No in-app notifications sent yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>Page {page} of {pages}</span>
              <div className="pagination-btns">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── In-app notification modal ─── */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Send In-App Notification</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Target</label>
                  <select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}>
                    <option value="all">All Users</option>
                    <option value="user">Users Only</option>
                    <option value="mentor">Mentors</option>
                    <option value="investor">Investors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.07)',
  color: '#fff',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};
