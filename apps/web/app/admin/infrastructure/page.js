'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet } from '@/lib/api';

function GaugeBar({ label, value, max, unit = '', color = '#6366f1', warn = 70, crit = 90 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = pct >= crit ? '#ef4444' : pct >= warn ? '#f97316' : color;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: barColor }}>{value}{unit}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99, transition: 'width .6s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 10, color: '#475569' }}>0</span>
        <span style={{ fontSize: 10, color: '#475569' }}>{max}{unit}</span>
      </div>
    </div>
  );
}

function StatPill({ label, value, color = '#6366f1' }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{label}</div>
    </div>
  );
}

function ServiceBadge({ name, status }) {
  const ok = status === 'connected';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,.03)', borderRadius: 10, border: `1px solid ${ok ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)'}` }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? '#22c55e' : '#ef4444', boxShadow: ok ? '0 0 0 3px rgba(34,197,94,.2)' : 'none' }} />
      <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>{name}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: ok ? '#22c55e' : '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>{status}</span>
    </div>
  );
}

function LatencyBar({ label, ms, max }) {
  const pct = Math.min(100, Math.round((ms / max) * 100));
  const color = ms > 500 ? '#ef4444' : ms > 200 ? '#f97316' : '#22c55e';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: '#94a3b8', width: 32, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width .5s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 56, textAlign: 'right', flexShrink: 0 }}>{ms}ms</span>
    </div>
  );
}

function TopRoutesChart({ routes }) {
  const entries = Object.entries(routes || {}).slice(0, 8);
  const max = entries[0]?.[1] || 1;
  return (
    <div>
      {entries.length === 0
        ? <div style={{ color: '#64748b', fontSize: 13 }}>No requests recorded yet</div>
        : entries.map(([route, count]) => (
            <div key={route} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <code style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{route}</code>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', flexShrink: 0 }}>{count}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${(count / max) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width .5s ease' }} />
              </div>
            </div>
          ))}
    </div>
  );
}

function formatUptime(secs) {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function InfrastructurePage() {
  const [health, setHealth]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null); // from SSE
  const [sseActive, setSseActive] = useState(false);
  const eventSourceRef = useRef(null);

  const fetchHealth = useCallback(async () => {
    const res = await apiGet('/api/v1/admin/observability/health');
    if (res.data) { setHealth(res.data); setLoading(false); }
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  // SSE for live metrics
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${API_BASE}/api/v1/admin/observability/stream`;

    // SSE doesn't support custom headers — use a short-lived fetch to seed data instead,
    // then fall back to 10s polling so auth stays secure (token stays in Authorization header).
    const poll = setInterval(async () => {
      const res = await apiGet('/api/v1/admin/observability/health');
      if (res.data) { setHealth(res.data); setSseActive(true); }
    }, 10000);

    setSseActive(true);
    return () => clearInterval(poll);
  }, []);

  const sys = health?.system || {};
  const mem = sys.memory || {};
  const api = health?.api || {};
  const lat = api.latency || {};
  const services = health?.services || {};
  const cache = health?.cache || {};

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', padding: '28px 32px', fontFamily: 'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Infrastructure Monitor</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              System health · API performance · Service status
              {sseActive && <span style={{ marginLeft: 10, color: '#22c55e', fontSize: 11, fontWeight: 700 }}>● LIVE (10s)</span>}
            </p>
          </div>
        </div>
        <button onClick={fetchHealth} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(34,197,94,.1)', color: '#22c55e', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: 80 }}>Loading infrastructure data…</div>
      ) : (
        <>
          {/* Overall Status Banner */}
          <div style={{
            background: health?.status === 'ok' ? 'rgba(34,197,94,.08)' : health?.status === 'warning' ? 'rgba(234,179,8,.08)' : 'rgba(239,68,68,.08)',
            border: `1px solid ${health?.status === 'ok' ? 'rgba(34,197,94,.3)' : health?.status === 'warning' ? 'rgba(234,179,8,.3)' : 'rgba(239,68,68,.3)'}`,
            borderRadius: 12, padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: health?.status === 'ok' ? '#22c55e' : health?.status === 'warning' ? '#eab308' : '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: health?.status === 'ok' ? '#22c55e' : health?.status === 'warning' ? '#eab308' : '#ef4444' }}>
              System {health?.status === 'ok' ? 'Operational' : health?.status === 'warning' ? 'Degraded (warning)' : 'Degraded'}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              · Uptime: {formatUptime(health?.uptime || 0)}
              · Node: {sys.platform}/{sys.arch}
              · {sys.cpus} CPU cores
              · Last updated: {new Date(health?.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Top Row: Service Status + Process Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, marginBottom: 20 }}>
            {/* Services */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 16px' }}>Services</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ServiceBadge name="MongoDB" status={services.mongodb} />
                <ServiceBadge name="Redis" status={services.redis} />
                <ServiceBadge name="Node.js API" status="connected" />
              </div>
              {cache && Object.keys(cache).length > 0 && (
                <div style={{ marginTop: 20, padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.6px' }}>Cache Stats</div>
                  {Object.entries(cache).slice(0, 4).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{k}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Memory + CPU */}
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 20px' }}>System Resources</h3>
              {mem.totalMB > 0 && (
                <GaugeBar label="RAM Usage" value={mem.usedMB} max={mem.totalMB} unit=" MB" color="#6366f1" />
              )}
              <GaugeBar label="Process Heap" value={mem.processMB?.heapUsed || 0} max={mem.processMB?.heapTotal || 512} unit=" MB" color="#8b5cf6" />
              <GaugeBar label="Process RSS" value={mem.processMB?.rss || 0} max={Math.max(mem.processMB?.rss || 0, 256)} unit=" MB" color="#a855f7" />
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>CPU Load Average</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {(sys.loadAvg || [0, 0, 0]).map((v, i) => (
                    <StatPill key={i} label={['1 min', '5 min', '15 min'][i]} value={v} color={v > sys.cpus ? '#ef4444' : v > sys.cpus * 0.7 ? '#f97316' : '#22c55e'} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* API Performance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 20px' }}>API Latency</h3>
              <LatencyBar label="P50"  ms={lat.p50  || 0} max={Math.max(lat.p99 || 1, 500)} />
              <LatencyBar label="P95"  ms={lat.p95  || 0} max={Math.max(lat.p99 || 1, 500)} />
              <LatencyBar label="P99"  ms={lat.p99  || 0} max={Math.max(lat.p99 || 1, 500)} />
              <LatencyBar label="Avg"  ms={lat.avg  || 0} max={Math.max(lat.p99 || 1, 500)} />
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                <StatPill label="Total Requests"  value={api.requestsTotal ?? '—'} />
                <StatPill label="Error Rate"      value={api.errorRate ?? '—'} color={parseFloat(api.errorRate)>5?'#ef4444':'#22c55e'} />
                <StatPill label="Samples"         value={lat.count ?? '—'} color="#8b5cf6" />
              </div>
            </div>

            <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 20px' }}>Top Endpoints by Traffic</h3>
              <TopRoutesChart routes={api.topRoutes} />
            </div>
          </div>

          {/* Integration Guidance */}
          <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 16px' }}>External Observability Integrations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { name:'Prometheus', desc:'Add prom-client to expose /metrics in OpenMetrics format. Scrape every 15s.', color:'#e6522c', status:'Ready to integrate' },
                { name:'Grafana',    desc:'Connect to Prometheus datasource. Embed dashboards via iframes with secure proxy.', color:'#f97316', status:'Ready to integrate' },
                { name:'Sentry',     desc:'Set SENTRY_DSN env var and add @sentry/node to capture backend exceptions.', color:'#6366f1', status:'Ready to integrate' },
                { name:'OpenTelemetry', desc:'Add @opentelemetry/sdk-node for distributed tracing across API ↔ DB ↔ Redis.', color:'#22c55e', status:'Ready to integrate' },
                { name:'Datadog',    desc:'Add dd-trace package and set DD_API_KEY. APM + logs + infra in one agent.', color:'#6b5ba6', status:'Optional' },
                { name:'ELK Stack',  desc:'Forward structured JSON logs (already produced by logger.js) to Logstash.', color:'#f59e0b', status:'Optional' },
              ].map(tool => (
                <div key={tool.name} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, padding:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:tool.color }} />
                    <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{tool.name}</span>
                    <span style={{ marginLeft:'auto', fontSize:10, color:'#475569', background:'rgba(255,255,255,.05)', padding:'1px 7px', borderRadius:99 }}>{tool.status}</span>
                  </div>
                  <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.5 }}>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
