'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}15` }}>
        <svg
          width="22"
          height="22"
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
      <div className="stat-info">
        <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

function TrendChart({ data, label, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count || d.total || 0), 1);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 20,
        flex: 1,
        minWidth: 300,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{label}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
        {data.slice(-20).map((d, i) => {
          const val = d.count || d.total || 0;
          const h = Math.max((val / max) * 100, 4);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: h,
                  background: color,
                  borderRadius: 3,
                  minWidth: 6,
                }}
                title={`${d._id}: ${val}`}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{data.length > 0 ? data[0]._id : ''}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>
          {data.length > 0 ? data[data.length - 1]._id : ''}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboardPro() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: result } = await apiGet('/api/v1/admin/dashboard');
      if (result) setData(result);
      setLoading(false);
    }
    load();
  }, []);

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
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const { overview, recentUsers, recentPayments, usersByRole, enrollmentTrend, revenueTrend } =
    data;

  return (
    <div className="admin-page">
      <div
        className="admin-topbar"
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0f172a' }}>Dashboard</h1>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="admin-stats-grid">
        <StatCard
          label="Total Users"
          value={overview.totalUsers}
          color="#3b82f6"
          icon={
            <>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </>
          }
        />
        <StatCard
          label="Total Courses"
          value={overview.totalCourses}
          color="#8b5cf6"
          icon={<path d="M4 19.5A2.5 2.5 0 016.5 17H20v-15H6.5A2.5 2.5 0 014 4.5v15z" />}
        />
        <StatCard
          label="Enrollments"
          value={overview.totalEnrollments}
          color="#10b981"
          icon={
            <>
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </>
          }
        />
        <StatCard
          label="Revenue"
          value={`₹${(overview.totalRevenue / 100).toLocaleString()}`}
          color="#f59e0b"
          icon={
            <>
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </>
          }
        />
        <StatCard
          label="Certificates"
          value={overview.totalCertificates}
          color="#06b6d4"
          icon={
            <>
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </>
          }
        />
        <StatCard
          label="Active Events"
          value={overview.activeEvents}
          color="#ec4899"
          icon={
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </>
          }
        />
        <StatCard
          label="Leads"
          value={overview.totalLeads}
          color="#14b8a6"
          icon={
            <>
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </>
          }
        />
        <StatCard
          label="Pending Reviews"
          value={overview.pendingTestimonials}
          color="#f97316"
          icon={
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          }
        />
      </div>

      {/* Trend Charts */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <TrendChart data={enrollmentTrend} label="Enrollment Trend (30 days)" color="#10b981" />
        <TrendChart data={revenueTrend} label="Revenue Trend (30 days)" color="#f59e0b" />
      </div>

      {/* User Distribution + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* User Roles */}
        <div
          style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
            Users by Role
          </h3>
          {Object.entries(usersByRole).map(([role, count]) => (
            <div
              key={role}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <span style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>
                {role}
              </span>
              <span
                className={`badge ${role === 'admin' ? 'badge-red' : role === 'mentor' ? 'badge-purple' : role === 'investor' ? 'badge-yellow' : role === 'startup' ? 'badge-green' : role === 'founder' ? 'badge-blue' : 'badge-gray'}`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div
          style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
            Recent Signups
          </h3>
          {(recentUsers || []).map(u => (
            <div
              key={u._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  {u.fullName || 'N/A'}
                </div>
                <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{u.email}</div>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>Recent Payments</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(recentPayments || []).map(p => (
              <tr key={p._id}>
                <td>{p.userId?.fullName || p.userId?.email || '-'}</td>
                <td>{p.courseId?.title || '-'}</td>
                <td style={{ fontWeight: 600 }}>₹{(p.amount / 100).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${p.status === 'succeeded' ? 'badge-green' : p.status === 'refunded' ? 'badge-red' : 'badge-yellow'}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: 12.5 }}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!recentPayments || recentPayments.length === 0) && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
                  No payments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
