'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '@/lib/api';

const STATUS_COLORS = {
  pending:  { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  approved: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  rejected: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  reviewed: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  matched:  { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  closed:   { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
};

const s = {
  page:    { padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title:   { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  sub:     { fontSize: '13px', color: '#64748b', marginTop: '2px' },
  tabs:    { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab:     (active) => ({ padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#64748b', boxShadow: active ? 'none' : '0 1px 3px rgba(0,0,0,0.07)', transition: 'all 0.15s' }),
  toolbar: { display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' },
  select:  { padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' },
  table:   { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  th:      { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td:      { padding: '13px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  badge:   (st) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', background: STATUS_COLORS[st]?.bg || '#f1f5f9', color: STATUS_COLORS[st]?.text || '#334155', border: `1px solid ${STATUS_COLORS[st]?.border || '#e2e8f0'}` }),
  statRow: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  stat:    (bg, text) => ({ padding: '14px 20px', background: bg, borderRadius: '10px', flex: '1', minWidth: '110px' }),
  statN:   { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  statL:   { fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' },
  actBtn:  (bg, text, border) => ({ padding: '5px 10px', background: bg, color: text, border: `1px solid ${border}`, borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }),
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

export default function AdminInvestorsPage() {
  const [tab, setTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [explores, setExplores] = useState([]);
  const [regTotal, setRegTotal] = useState(0);
  const [expTotal, setExpTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [regRes, expRes] = await Promise.all([
      apiGet(`/api/v1/admin/investors/requests${statusFilter ? `?status=${statusFilter}` : ''}`),
      apiGet(`/api/v1/admin/investors/explore${statusFilter ? `?status=${statusFilter}` : ''}`),
    ]);
    if (regRes.data) { setRegistrations(regRes.data.items || []); setRegTotal(regRes.data.total || 0); }
    if (expRes.data) { setExplores(expRes.data.items || []); setExpTotal(expRes.data.total || 0); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateRegStatus(id, status) {
    await apiPatch(`/api/v1/admin/investors/requests/${id}`, { status });
    fetchAll();
  }

  async function updateExpStatus(id, status) {
    await apiPatch(`/api/v1/admin/investors/explore/${id}`, { status });
    fetchAll();
  }

  const pending = registrations.filter(r => r.status === 'pending').length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Investor Management</h1>
          <p style={s.sub}>{regTotal} registrations · {expTotal} explore requests</p>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statRow}>
        <div style={s.stat('#eff6ff', '#1d4ed8')}>
          <div style={s.statN}>{regTotal}</div>
          <div style={s.statL}>Total Registrations</div>
        </div>
        <div style={s.stat('#fef3c7', '#d97706')}>
          <div style={s.statN}>{pending}</div>
          <div style={s.statL}>Pending Review</div>
        </div>
        <div style={s.stat('#f0fdf4', '#166534')}>
          <div style={s.statN}>{registrations.filter(r => r.status === 'approved').length}</div>
          <div style={s.statL}>Approved</div>
        </div>
        <div style={s.stat('#f5f3ff', '#6d28d9')}>
          <div style={s.statN}>{expTotal}</div>
          <div style={s.statL}>Explore Requests</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={s.tab(tab === 'registrations')} onClick={() => setTab('registrations')}>
          Investor Registrations ({regTotal})
        </button>
        <button style={s.tab(tab === 'explore')} onClick={() => setTab('explore')}>
          Find Investor Requests ({expTotal})
        </button>
      </div>

      {/* Filter */}
      <div style={s.toolbar}>
        <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {tab === 'registrations'
            ? ['pending', 'approved', 'rejected'].map(o => <option key={o} value={o}>{o}</option>)
            : ['pending', 'reviewed', 'matched', 'closed'].map(o => <option key={o} value={o}>{o}</option>)
          }
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading...</div>
      ) : tab === 'registrations' ? (
        <table style={s.table}>
          <thead>
            <tr>
              {['Name', 'Email', 'Type', 'Organization', 'Ticket Size', 'Focus', 'Status', 'Action'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr><td colSpan={8} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No registrations found.</td></tr>
            ) : registrations.map(r => (
              <tr key={r._id}>
                <td style={s.td}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{r.full_name}</div>
                  {r.location && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.location}</div>}
                </td>
                <td style={s.td}>{r.email}</td>
                <td style={s.td}>{r.investor_type}</td>
                <td style={s.td}>{r.organization_name || '—'}</td>
                <td style={s.td}>{r.ticket_size || '—'}</td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(r.investment_focus || []).slice(0, 2).map((f, i) => (
                      <span key={i} style={{ fontSize: '10px', padding: '2px 6px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '100px' }}>{f}</span>
                    ))}
                  </div>
                </td>
                <td style={s.td}><span style={s.badge(r.status)}>{r.status}</span></td>
                <td style={s.td}>
                  <StatusSelect
                    value={r.status}
                    options={['pending', 'approved', 'rejected']}
                    onChange={val => updateRegStatus(r._id, val)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {['Startup / Name', 'Email', 'Sector', 'Funding Ask', 'Pitch', 'Status', 'Action'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {explores.length === 0 ? (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No explore requests found.</td></tr>
            ) : explores.map(r => (
              <tr key={r._id}>
                <td style={s.td}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{r.startup_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.name}</div>
                </td>
                <td style={s.td}>{r.email}</td>
                <td style={s.td}>{r.sector}</td>
                <td style={s.td}>{r.funding_amount}</td>
                <td style={s.td}>
                  <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: '#64748b' }} title={r.pitch}>
                    {r.pitch || '—'}
                  </div>
                </td>
                <td style={s.td}><span style={s.badge(r.status)}>{r.status}</span></td>
                <td style={s.td}>
                  <StatusSelect
                    value={r.status}
                    options={['pending', 'reviewed', 'matched', 'closed']}
                    onChange={val => updateExpStatus(r._id, val)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
