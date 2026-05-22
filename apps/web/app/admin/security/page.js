'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPatch } from '@/lib/api';

const SEVERITY_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
const SEVERITY_BG   = { critical: 'rgba(239,68,68,0.12)', high: 'rgba(249,115,22,0.12)', medium: 'rgba(234,179,8,0.12)', low: 'rgba(34,197,94,0.12)' };
const TYPE_LABEL    = {
  failed_login: 'Failed Login', brute_force: 'Brute Force', rate_limit: 'Rate Limit',
  suspicious_ip: 'Suspicious IP', token_abuse: 'Token Abuse', invalid_token: 'Invalid Token',
  account_locked: 'Account Locked', permission_denied: 'Permission Denied',
  suspicious_request: 'Suspicious Request', anomaly_detected: 'Anomaly Detected',
};

function SeverityBadge({ sev }) {
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: SEVERITY_BG[sev] || SEVERITY_BG.medium,
      color: SEVERITY_COLOR[sev] || SEVERITY_COLOR.medium,
      border: `1px solid ${SEVERITY_COLOR[sev] || SEVERITY_COLOR.medium}33`,
      textTransform: 'uppercase', letterSpacing: '.5px',
    }}>{sev}</span>
  );
}

function StatCard({ label, value, sub, color = '#6366f1', icon }) {
  return (
    <div style={{
      background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function MiniBarChart({ data, color = '#6366f1' }) {
  if (!data || data.length === 0) return <div style={{ color: '#64748b', fontSize: 13, padding: 16 }}>No data</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          title={`${d._id || d.ip}: ${d.count}`}>
          <div style={{
            width: '100%', height: `${Math.max((d.count / max) * 100, 6)}%`,
            background: `linear-gradient(180deg, ${color}, ${color}77)`,
            borderRadius: 3, transition: 'height .4s ease',
          }} />
        </div>
      ))}
    </div>
  );
}

function LiveDot({ active }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: active ? '#22c55e' : '#64748b',
        boxShadow: active ? '0 0 0 3px rgba(34,197,94,.25)' : 'none',
        display: 'inline-block',
        animation: active ? 'pulse 2s infinite' : 'none',
      }} />
      <span style={{ fontSize: 11, color: active ? '#22c55e' : '#64748b' }}>
        {active ? 'LIVE' : 'PAUSED'}
      </span>
    </span>
  );
}

export default function SecurityCommandCenter() {
  const [summary, setSummary]   = useState(null);
  const [events, setEvents]     = useState([]);
  const [feed, setFeed]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [filter, setFilter]     = useState({ type: '', severity: '', resolved: '' });
  const liveRef = useRef(liveMode);
  liveRef.current = liveMode;

  const fetchData = useCallback(async (p = 1) => {
    const params = new URLSearchParams({ page: p, limit: 30 });
    if (filter.type) params.set('type', filter.type);
    if (filter.severity) params.set('severity', filter.severity);
    if (filter.resolved !== '') params.set('resolved', filter.resolved);

    const [sumRes, evRes, feedRes] = await Promise.all([
      apiGet('/api/v1/admin/observability/security/summary'),
      apiGet(`/api/v1/admin/observability/security/events?${params}`),
      apiGet('/api/v1/admin/observability/security/feed'),
    ]);
    if (sumRes.data) setSummary(sumRes.data);
    if (evRes.data) { setEvents(evRes.data.events || []); setTotal(evRes.data.total || 0); }
    if (feedRes.data) setFeed(Array.isArray(feedRes.data) ? feedRes.data.slice(0, 20) : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  // Live polling every 8 seconds
  useEffect(() => {
    if (!liveMode) return;
    const t = setInterval(() => { if (liveRef.current) fetchData(1); }, 8000);
    return () => clearInterval(t);
  }, [liveMode, fetchData]);

  const handleResolve = async (id) => {
    await apiPatch(`/api/v1/admin/observability/security/events/${id}/resolve`, {});
    fetchData(page);
  };

  const db = summary?.db || {};
  const live = summary?.live || {};

  const criticalCount = db.bySeverity24h?.critical || 0;
  const highCount     = db.bySeverity24h?.high || 0;
  const total24h      = live.total24h || 0;
  const topIps        = db.topIps24h || [];
  const typeBreakdown = Object.entries(db.byType24h || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', padding: '28px 32px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Security Command Center</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Real-time threat monitoring &amp; event tracking</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LiveDot active={liveMode} />
          <button onClick={() => setLiveMode(v => !v)} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)',
            background: liveMode ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.05)',
            color: liveMode ? '#22c55e' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {liveMode ? 'Pause' : 'Resume'} Live
          </button>
          <button onClick={() => fetchData(page)} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)',
            background: 'rgba(99,102,241,.1)', color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: 80 }}>Loading security data…</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
            <StatCard label="Events (24h)" value={total24h} color="#6366f1"
              icon={<><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>} />
            <StatCard label="Critical Threats" value={criticalCount} color="#ef4444"
              sub={criticalCount > 0 ? 'Immediate attention required' : 'No critical threats'}
              icon={<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />
            <StatCard label="High Severity" value={highCount} color="#f97316"
              sub={`${db.criticalUnresolved || 0} unresolved`}
              icon={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />
            <StatCard label="Suspicious IPs" value={topIps.length} color="#a855f7"
              sub="Past 24 hours"
              icon={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></>} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 20, marginBottom: 24 }}>
            {/* Type Breakdown */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 20px' }}>Event Types (24h)</h3>
              {typeBreakdown.length === 0
                ? <div style={{ color: '#64748b', fontSize: 13 }}>No events in the last 24 hours</div>
                : typeBreakdown.map(([type, count]) => {
                    const max = typeBreakdown[0]?.[1] || 1;
                    const pct = Math.round((count / max) * 100);
                    return (
                      <div key={type} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: '#cbd5e1' }}>{TYPE_LABEL[type] || type}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{count}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width .6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Top Suspicious IPs */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 20px' }}>Top Suspicious IPs (24h)</h3>
              {topIps.length === 0
                ? <div style={{ color: '#64748b', fontSize: 13 }}>No suspicious IPs detected</div>
                : topIps.slice(0, 8).map((ip, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: ip.count >= 10 ? '#ef4444' : ip.count >= 5 ? '#f97316' : '#eab308' }} />
                        <code style={{ fontSize: 12, color: '#cbd5e1', fontFamily: 'monospace' }}>{ip._id}</code>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{(ip.types || []).slice(0, 2).join(', ')}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,.1)', padding: '2px 8px', borderRadius: 99 }}>{ip.count}x</span>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Live Feed */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: 0 }}>Live Feed</h3>
                <LiveDot active={liveMode} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: 260 }}>
                {feed.length === 0
                  ? <div style={{ color: '#64748b', fontSize: 12 }}>No recent events</div>
                  : feed.map((e, i) => (
                      <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: SEVERITY_COLOR[e.severity] || '#6366f1', marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>{TYPE_LABEL[e.type] || e.type}</div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>{e.ipAddress} · {e.endpoint}</div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: 0 }}>Security Events</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { key: 'type', label: 'Type', opts: ['', ...Object.keys(TYPE_LABEL)], optLabels: ['All Types', ...Object.values(TYPE_LABEL)] },
                  { key: 'severity', label: 'Severity', opts: ['', 'critical', 'high', 'medium', 'low'], optLabels: ['All Severity', 'Critical', 'High', 'Medium', 'Low'] },
                  { key: 'resolved', label: 'Status', opts: ['', 'false', 'true'], optLabels: ['All Status', 'Unresolved', 'Resolved'] },
                ].map(f => (
                  <select key={f.key}
                    value={filter[f.key]}
                    onChange={e => { setFilter(v => ({ ...v, [f.key]: e.target.value })); setPage(1); }}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: '#0f0f1a', color: '#cbd5e1', fontSize: 12, cursor: 'pointer' }}>
                    {f.opts.map((o, i) => <option key={o} value={o}>{f.optLabels[i]}</option>)}
                  </select>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['Time', 'Type', 'Severity', 'IP Address', 'Email / User', 'Endpoint', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#475569', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No events match the current filters</td></tr>
                  ) : events.map((e) => (
                    <tr key={e._id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 12 }}>{new Date(e.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#cbd5e1', fontWeight: 600 }}>{TYPE_LABEL[e.type] || e.type}</td>
                      <td style={{ padding: '10px 12px' }}><SeverityBadge sev={e.severity} /></td>
                      <td style={{ padding: '10px 12px' }}><code style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{e.ipAddress}</code></td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 12 }}>{e.email || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 11, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.endpoint || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: e.resolved ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', color: e.resolved ? '#22c55e' : '#ef4444' }}>
                          {e.resolved ? 'Resolved' : 'Open'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {!e.resolved && (
                          <button onClick={() => handleResolve(e._id)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(34,197,94,.3)', background: 'rgba(34,197,94,.08)', color: '#22c55e', fontSize: 11, cursor: 'pointer' }}>
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 30 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{total} total events</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer', opacity: page === 1 ? .4 : 1 }}>
                    Prev
                  </button>
                  <span style={{ padding: '6px 14px', color: '#94a3b8', fontSize: 12 }}>Page {page}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page * 30 >= total}
                    style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer', opacity: page * 30 >= total ? .4 : 1 }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
