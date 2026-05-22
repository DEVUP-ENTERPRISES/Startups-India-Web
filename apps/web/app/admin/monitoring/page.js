'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api';

/* ─── Mini Bar Chart ─── */
function BarChart({ data, label, color, valueKey = 'count', height = 140 }) {
  if (!data || data.length === 0)
    return <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>No data available</div>;
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{label}</h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}>
        {data.map((d, i) => {
          const val = d[valueKey] || 0;
          const h = Math.max((val / max) * 100, 3);
          return (
            <div
              key={i}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>
                {val > 0 ? val : ''}
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${color}, ${color}99)`,
                  borderRadius: 3,
                  minWidth: 4,
                  transition: 'height 0.5s ease',
                }}
                title={`${d._id}: ${val}`}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{data[0]?._id || ''}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{data[data.length - 1]?._id || ''}</span>
      </div>
    </div>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({ data, colors, total, label }) {
  const entries = Object.entries(data || {});
  if (entries.length === 0) return null;
  let cumulative = 0;
  const size = 120;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{label}</h4>
      <svg width={size} height={size} style={{ margin: '0 auto', display: 'block' }}>
        {entries.map(([key, val], i) => {
          const value = typeof val === 'object' ? val.count : val;
          const pct = total > 0 ? value / total : 0;
          const offset = cumulative * circumference;
          cumulative += pct;
          return (
            <circle
              key={key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeDasharray={`${pct * circumference} ${circumference}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
        })}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: 18, fontWeight: 800, fill: '#1e293b' }}
        >
          {total}
        </text>
      </svg>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        {entries.map(([key, val], i) => (
          <span
            key={key}
            style={{
              fontSize: 11,
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: colors[i % colors.length],
                display: 'inline-block',
              }}
            />
            {key}: {typeof val === 'object' ? val.count : val}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: `${color}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── System Card ─── */
function SystemCard({ label, value, unit }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: 8,
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
        {value}{' '}
        {unit && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>{unit}</span>}
      </div>
    </div>
  );
}

/* ─── Graph Card Wrapper ─── */
function GraphCard({ children, style }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function MonitoringPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = useCallback(async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
      setAutoRefresh(false);
      setLoading(false);
      return;
    }
    const { data: result, error } = await apiGet('/api/v1/admin/monitoring');
    if (error?.message === 'Authentication failed' || !localStorage.getItem('access_token')) {
      setAutoRefresh(false);
      setLoading(false);
      return;
    }
    if (result) {
      setData(result);
      setLastRefresh(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-page">
        <p style={{ color: '#64748b' }}>Failed to load monitoring data.</p>
      </div>
    );
  }

  const {
    snapshot: s,
    distributions: dist,
    trends,
    topCourses,
    uptime,
    memoryUsage,
    nodeVersion,
    serverTime,
  } = data;
  const uptimeHrs = Math.floor(uptime / 3600);
  const uptimeMins = Math.floor((uptime % 3600) / 60);
  const memMB = memoryUsage ? Math.round(memoryUsage.heapUsed / 1024 / 1024) : 0;
  const memTotalMB = memoryUsage ? Math.round(memoryUsage.heapTotal / 1024 / 1024) : 0;
  const donutColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="admin-page">
      {/* Header */}
      <div
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0f172a' }}>
            System Monitoring
          </h1>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
            Real-time platform insights &amp; analytics
            {lastRefresh && <span> · Last updated {lastRefresh.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
              style={{ accentColor: '#3b82f6' }}
            />
            Auto-refresh (60s)
          </label>
          <button
            onClick={loadData}
            style={{
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ═══ SYSTEM HEALTH ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          System Health
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          <SystemCard label="Status" value="● Online" />
          <SystemCard label="Uptime" value={`${uptimeHrs}h ${uptimeMins}m`} />
          <SystemCard label="Memory" value={`${memMB} / ${memTotalMB}`} unit="MB" />
          <SystemCard label="Node.js" value={nodeVersion} />
          <SystemCard label="Server Time" value={new Date(serverTime).toLocaleTimeString()} />
          <SystemCard
            label="Heap RSS"
            value={memoryUsage ? Math.round(memoryUsage.rss / 1024 / 1024) : 0}
            unit="MB"
          />
        </div>
      </div>

      {/* ═══ KEY METRICS ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Key Metrics
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 12,
          }}
        >
          <KpiCard
            label="Total Users"
            value={s.totalUsers}
            sub={`+${s.newUsers24h} today · +${s.newUsers7d} this week`}
            color="#3b82f6"
            icon={
              <>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </>
            }
          />
          <KpiCard
            label="Enrollments"
            value={s.totalEnrollments}
            sub={`+${s.enrollments24h} today · +${s.enrollments7d} this week`}
            color="#10b981"
            icon={
              <>
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
              </>
            }
          />
          <KpiCard
            label="Revenue (30d)"
            value={`₹${(s.revenue30d / 100).toLocaleString()}`}
            sub={`${s.revenue30dCount} transactions · ${s.payments24h} today`}
            color="#f59e0b"
            icon={
              <>
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </>
            }
          />
          <KpiCard
            label="Conversion Rate"
            value={`${s.conversionRate}%`}
            sub="Enrollments / Users"
            color="#8b5cf6"
            icon={
              <>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </>
            }
          />
          <KpiCard
            label="Courses"
            value={s.totalCourses}
            sub={`${s.publishedCourses} published · ${s.totalCourses - s.publishedCourses} draft`}
            color="#06b6d4"
            icon={<path d="M4 19.5A2.5 2.5 0 016.5 17H20v-15H6.5A2.5 2.5 0 014 4.5v15z" />}
          />
          <KpiCard
            label="Certificates"
            value={s.totalCertificates}
            sub={`+${s.certs7d} this week`}
            color="#ec4899"
            icon={
              <>
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </>
            }
          />
          <KpiCard
            label="Leads"
            value={s.totalLeads}
            sub={`+${s.newLeads7d} this week`}
            color="#14b8a6"
            icon={
              <>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </>
            }
          />
          <KpiCard
            label="Avg Revenue / Txn"
            value={`₹${(s.avgRevenuePerUser / 100).toLocaleString()}`}
            sub="Per successful payment"
            color="#f97316"
            icon={
              <>
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </>
            }
          />
        </div>
      </div>

      {/* ═══ DAILY TRENDS (30 Days) ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Daily Trends (Last 30 Days)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          <GraphCard>
            <BarChart data={trends.dailySignups} label="Daily User Signups" color="#3b82f6" />
          </GraphCard>
          <GraphCard>
            <BarChart data={trends.dailyEnrollments} label="Daily Enrollments" color="#10b981" />
          </GraphCard>
          <GraphCard>
            <BarChart
              data={trends.dailyRevenue}
              label="Daily Revenue"
              color="#f59e0b"
              valueKey="total"
            />
          </GraphCard>
        </div>
      </div>

      {/* ═══ MONTHLY GROWTH (6 Months) ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Monthly Growth (Last 6 Months)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          <GraphCard>
            <BarChart data={trends.userGrowth} label="User Growth" color="#8b5cf6" height={120} />
          </GraphCard>
          <GraphCard>
            <BarChart
              data={trends.enrollmentGrowth}
              label="Enrollment Growth"
              color="#06b6d4"
              height={120}
            />
          </GraphCard>
          <GraphCard>
            <BarChart
              data={trends.revenueGrowth}
              label="Revenue Growth"
              color="#ec4899"
              valueKey="total"
              height={120}
            />
          </GraphCard>
        </div>
      </div>

      {/* ═══ DISTRIBUTIONS ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Distributions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          <GraphCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart
              data={dist.usersByRole}
              colors={donutColors}
              total={s.totalUsers}
              label="Users by Role"
            />
          </GraphCard>
          <GraphCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart
              data={dist.paymentsByStatus}
              colors={['#10b981', '#f59e0b', '#ef4444', '#94a3b8']}
              total={s.totalPayments}
              label="Payments by Status"
            />
          </GraphCard>
          <GraphCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart
              data={dist.leadsByStatus}
              colors={['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']}
              total={s.totalLeads}
              label="Leads by Status"
            />
          </GraphCard>
        </div>
      </div>

      {/* ═══ TOP COURSES ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Top Courses by Enrollment
        </h2>
        <GraphCard>
          {topCourses && topCourses.length > 0 ? (
            <div>
              {topCourses.map((c, i) => {
                const maxCount = topCourses[0]?.count || 1;
                const pct = (c.count / maxCount) * 100;
                return (
                  <div key={c._id} style={{ marginBottom: 10 }}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                        {i + 1}. {c.title || 'Untitled'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>
                        {c.count} enrollments
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: '#f1f5f9',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`,
                          borderRadius: 3,
                          transition: 'width 0.8s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 20, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
              No enrollment data yet
            </div>
          )}
        </GraphCard>
      </div>

      {/* ═══ QUICK STATS TABLE ═══ */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Platform Summary
        </h2>
        <GraphCard>
          <div className="admin-table-wrap" style={{ margin: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Total</th>
                  <th>Last 24h</th>
                  <th>Last 7d</th>
                  <th>Last 30d</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Users</td>
                  <td>{s.totalUsers}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>+{s.newUsers24h}</td>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>+{s.newUsers7d}</td>
                  <td style={{ color: '#8b5cf6', fontWeight: 600 }}>+{s.newUsers30d}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Enrollments</td>
                  <td>{s.totalEnrollments}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>+{s.enrollments24h}</td>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>+{s.enrollments7d}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Payments</td>
                  <td>{s.totalPayments}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>+{s.payments24h}</td>
                  <td>-</td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>{s.revenue30dCount} txn</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Certificates</td>
                  <td>{s.totalCertificates}</td>
                  <td>-</td>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>+{s.certs7d}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Leads</td>
                  <td>{s.totalLeads}</td>
                  <td>-</td>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>+{s.newLeads7d}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Blog Posts</td>
                  <td>{s.totalBlogPosts}</td>
                  <td colSpan={3} style={{ color: '#64748b' }}>
                    {s.publishedPosts} published · {s.totalBlogPosts - s.publishedPosts} draft
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Events</td>
                  <td>{s.totalEvents}</td>
                  <td colSpan={3} style={{ color: '#64748b' }}>
                    {s.upcomingEvents} upcoming/live
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Testimonials</td>
                  <td>{s.approvedTestimonials + s.pendingTestimonials}</td>
                  <td colSpan={3} style={{ color: '#f59e0b' }}>
                    {s.pendingTestimonials} pending review
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GraphCard>
      </div>
    </div>
  );
}
