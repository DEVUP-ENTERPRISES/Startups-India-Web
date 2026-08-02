'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api';

const SEVERITY_COLOR = { info: '#6366f1', warning: '#eab308', critical: '#ef4444' };
const SEVERITY_BG    = { info: 'rgba(99,102,241,.12)', warning: 'rgba(234,179,8,.12)', critical: 'rgba(239,68,68,.12)' };
const METHOD_COLOR   = { GET: '#22c55e', POST: '#6366f1', PATCH: '#f97316', PUT: '#f97316', DELETE: '#ef4444' };

function SeverityBadge({ sev }) {
  return (
    <span style={{
      padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: SEVERITY_BG[sev] || SEVERITY_BG.info,
      color: SEVERITY_COLOR[sev] || SEVERITY_COLOR.info,
      textTransform: 'uppercase', letterSpacing: '.5px',
    }}>{sev}</span>
  );
}

function MethodBadge({ method }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 800,
      background: `${METHOD_COLOR[method] || '#64748b'}20`,
      color: METHOD_COLOR[method] || '#64748b',
      fontFamily: 'monospace', letterSpacing: '.5px',
    }}>{method}</span>
  );
}

function StatCard({ label, value, color = '#6366f1' }) {
  return (
    <div style={{
      background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12,
      padding: '18px 22px',
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>{value ?? '-'}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function AuditLogsPage() {
  const [logs, setLogs]       = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState({ severity: '', action: '' });
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchData = useCallback(async (p = 1) => {
    const params = new URLSearchParams({ page: p, limit: 40 });
    if (filter.severity) params.set('severity', filter.severity);
    if (search) params.set('action', search);

    const [logRes, sumRes] = await Promise.all([
      apiGet(`/api/v1/admin/observability/audit-logs?${params}`),
      apiGet('/api/v1/admin/observability/audit-logs/summary'),
    ]);
    if (logRes.data) { setLogs(logRes.data.logs || []); setTotal(logRes.data.total || 0); }
    if (sumRes.data) setSummary(sumRes.data);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  const topActions   = Object.entries(summary?.byAction   || {}).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const topUsers     = (summary?.byUser || []).slice(0, 6);
  const bySeverity   = summary?.bySeverity || {};

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', padding: '28px 32px', fontFamily: 'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Audit Log Center</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>All admin write actions, compliance trail &amp; access history</p>
          </div>
        </div>
        <button onClick={() => fetchData(page)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(99,102,241,.1)', color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: 80 }}>Loading audit logs…</div>
      ) : (
        <>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            <StatCard label="Actions (24h)" value={summary?.total24h ?? '-'} />
            <StatCard label="Actions (7d)"  value={summary?.total7d  ?? '-'} color="#22c55e" />
            <StatCard label="Critical Actions" value={bySeverity.critical || 0} color="#ef4444" />
            <StatCard label="Warnings" value={bySeverity.warning || 0} color="#eab308" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Top Actions */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 18px' }}>Most Frequent Actions (24h)</h3>
              {topActions.map(([action, count]) => {
                const max = topActions[0]?.[1] || 1;
                return (
                  <div key={action} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <code style={{ fontSize: 11, color: '#cbd5e1', fontFamily: 'monospace' }}>{action}</code>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>{count}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${(count/max)*100}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width .5s ease' }} />
                    </div>
                  </div>
                );
              })}
              {topActions.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>No actions in the last 24 hours</div>}
            </div>

            {/* Most Active Admins */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 18px' }}>Most Active Admins (24h)</h3>
              {topUsers.length === 0
                ? <div style={{ color: '#64748b', fontSize: 13 }}>No admin activity in the last 24 hours</div>
                : topUsers.map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#818cf8' }}>
                          {(u._id || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, color: '#cbd5e1' }}>{u._id || 'Unknown'}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,.08)', padding: '2px 10px', borderRadius: 99 }}>{u.count} actions</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Logs Table */}
          <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: 0, flex: 1 }}>Action Log</h3>
              <input
                type="text" placeholder="Search by action…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: '#0f0f1a', color: '#cbd5e1', fontSize: 12, width: 220, outline: 'none' }}
              />
              <select value={filter.severity} onChange={e => { setFilter(v => ({ ...v, severity: e.target.value })); setPage(1); }}
                style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: '#0f0f1a', color: '#cbd5e1', fontSize: 12, cursor: 'pointer' }}>
                <option value="">All Severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['Time','Method','Action','Resource','Admin','IP','Status','Severity',''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#475569', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No audit logs match the filters</td></tr>
                  ) : logs.map(log => (
                    <>
                      <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }}
                        onClick={() => setExpanded(expanded === log._id ? null : log._id)}>
                        <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 11 }}>{new Date(log.createdAt).toLocaleString()}</td>
                        <td style={{ padding: '10px 12px' }}><MethodBadge method={log.method} /></td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.action}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{log.resource}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 12 }}>{log.userEmail || '-'}</td>
                        <td style={{ padding: '10px 12px' }}><code style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{log.ipAddress}</code></td>
                        <td style={{ padding: '10px 12px', color: log.statusCode < 400 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{log.statusCode}</td>
                        <td style={{ padding: '10px 12px' }}><SeverityBadge sev={log.severity} /></td>
                        <td style={{ padding: '10px 12px', color: '#475569', fontSize: 11 }}>{expanded === log._id ? '▲' : '▼'}</td>
                      </tr>
                      {expanded === log._id && (
                        <tr key={`${log._id}-detail`}>
                          <td colSpan={9} style={{ padding: '0 12px 14px 36px', background: 'rgba(99,102,241,.04)' }}>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'pre-wrap', paddingTop: 10 }}>
                              Path: {log.path}{'\n'}
                              RequestId: {log.requestId || '-'}{'\n'}
                              Details: {JSON.stringify(log.details, null, 2)}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {total > 40 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{total} total entries</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                    style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer', opacity: page===1?.4:1 }}>Prev</button>
                  <span style={{ padding: '6px 14px', color: '#94a3b8', fontSize: 12 }}>Page {page}</span>
                  <button onClick={() => setPage(p => p+1)} disabled={page*40>=total}
                    style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer', opacity: page*40>=total?.4:1 }}>Next</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
