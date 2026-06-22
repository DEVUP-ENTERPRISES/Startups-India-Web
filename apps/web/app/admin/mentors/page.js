'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '@/lib/api';

const STATUS_COLORS = {
  pending:  { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  approved: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  rejected: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  matched:  { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  closed:   { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
};

const s = {
  page:   { padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title:  { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  sub:    { fontSize: '13px', color: '#64748b', marginTop: '2px' },
  tabs:   { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab:    (a) => ({ padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: a ? '#0f172a' : '#fff', color: a ? '#fff' : '#64748b', boxShadow: a ? 'none' : '0 1px 3px rgba(0,0,0,0.07)', transition: 'all 0.15s' }),
  toolbar:{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' },
  select: { padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' },
  table:  { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  th:     { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td:     { padding: '13px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  badge:  (st) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', background: STATUS_COLORS[st]?.bg || '#f1f5f9', color: STATUS_COLORS[st]?.text || '#334155', border: `1px solid ${STATUS_COLORS[st]?.border || '#e2e8f0'}` }),
  statRow:{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  stat:   (bg) => ({ padding: '14px 20px', background: bg, borderRadius: '10px', flex: '1', minWidth: '110px' }),
  statN:  { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  statL:  { fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' },
};

function StatusSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', color: '#0f172a', background: '#fff', cursor: 'pointer' }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function AdminMentorsPage() {
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [appTotal, setAppTotal] = useState(0);
  const [reqTotal, setReqTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    const [appRes, reqRes] = await Promise.all([
      apiGet(`/api/v1/admin/mentors/applications${qs}`),
      apiGet(`/api/v1/admin/mentors/requests${qs}`),
    ]);
    if (appRes.data) { setApplications(appRes.data.items || []); setAppTotal(appRes.data.total || 0); }
    if (reqRes.data) { setRequests(reqRes.data.items || []); setReqTotal(reqRes.data.total || 0); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateAppStatus(id, status) {
    await apiPatch(`/api/v1/admin/mentors/applications/${id}`, { status });
    fetchAll();
  }

  async function updateReqStatus(id, status) {
    await apiPatch(`/api/v1/admin/mentors/requests/${id}`, { status });
    fetchAll();
  }

  const pendingApps = applications.filter(a => a.status === 'pending').length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Mentor Management</h1>
          <p style={s.sub}>{appTotal} applications · {reqTotal} find-mentor requests</p>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statRow}>
        <div style={s.stat('#eff6ff')}><div style={s.statN}>{appTotal}</div><div style={s.statL}>Total Applications</div></div>
        <div style={s.stat('#fef3c7')}><div style={s.statN}>{pendingApps}</div><div style={s.statL}>Pending Review</div></div>
        <div style={s.stat('#dcfce7')}><div style={s.statN}>{applications.filter(a => a.status === 'approved').length}</div><div style={s.statL}>Approved</div></div>
        <div style={s.stat('#f5f3ff')}><div style={s.statN}>{reqTotal}</div><div style={s.statL}>Find-Mentor Requests</div></div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={s.tab(tab === 'applications')} onClick={() => { setTab('applications'); setStatusFilter(''); }}>
          Become a Mentor ({appTotal})
        </button>
        <button style={s.tab(tab === 'requests')} onClick={() => { setTab('requests'); setStatusFilter(''); }}>
          Find a Mentor ({reqTotal})
        </button>
      </div>

      {/* Filter */}
      <div style={s.toolbar}>
        <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {(tab === 'applications'
            ? ['pending', 'approved', 'rejected']
            : ['pending', 'matched', 'closed']
          ).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading...</div>
      ) : tab === 'applications' ? (
        <table style={s.table}>
          <thead>
            <tr>{['Name', 'Email', 'Role / Company', 'Expertise', 'Availability', 'Status', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No applications found.</td></tr>
            ) : applications.map(a => (
              <tr key={a._id}>
                <td style={s.td}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{a.fullName}</div>
                  {a.phone && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.phone}</div>}
                </td>
                <td style={s.td}>{a.email}</td>
                <td style={s.td}>
                  <div>{a.currentRole}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.company}</div>
                </td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(a.expertise || []).slice(0, 3).map((e, i) => (
                      <span key={i} style={{ fontSize: '10px', padding: '2px 6px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '100px' }}>{e}</span>
                    ))}
                  </div>
                </td>
                <td style={s.td}>{a.availability}</td>
                <td style={s.td}><span style={s.badge(a.status)}>{a.status}</span></td>
                <td style={s.td}>
                  <StatusSelect value={a.status} options={['pending', 'approved', 'rejected']} onChange={val => updateAppStatus(a._id, val)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>{['Name', 'Email', 'Area of Interest', 'Message', 'Status', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No requests found.</td></tr>
            ) : requests.map(r => (
              <tr key={r._id}>
                <td style={s.td}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{r.name}</div>
                  {r.phone && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.phone}</div>}
                </td>
                <td style={s.td}>{r.email}</td>
                <td style={s.td}>{r.area}</td>
                <td style={s.td}>
                  <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: '#64748b' }} title={r.message}>
                    {r.message || '—'}
                  </div>
                </td>
                <td style={s.td}><span style={s.badge(r.status)}>{r.status}</span></td>
                <td style={s.td}>
                  <StatusSelect value={r.status} options={['pending', 'matched', 'closed']} onChange={val => updateReqStatus(r._id, val)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
