'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';

const ADMIN_BASE = `/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}`;

const ROLE_COLORS = {
  admin: { bg: '#fee2e2', color: '#b91c1c' },
  mentor: { bg: '#ede9fe', color: '#6d28d9' },
  investor: { bg: '#fef3c7', color: '#b45309' },
  startup: { bg: '#d1fae5', color: '#059669' },
  founder: { bg: '#e0f2fe', color: '#0369a1' },
  user: { bg: '#dbeafe', color: '#1d4ed8' },
};

const SOCIAL_ICONS = {
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  twitter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
};

function getSocialIcon(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('linkedin')) return SOCIAL_ICONS.linkedin;
  if (lower.includes('github')) return SOCIAL_ICONS.github;
  if (lower.includes('twitter')) return SOCIAL_ICONS.twitter;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '16px 20px',
        flex: 1,
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: color || '#1e293b' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid #f1f5f9',
          fontWeight: 700,
          fontSize: 14,
          color: '#1e293b',
          background: '#f8fafc',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid #f1f5f9',
        fontSize: 13,
      }}
    >
      <span style={{ color: '#64748b', minWidth: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1e293b', fontWeight: 500, wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value || 0));
  return (
    <div style={{ background: '#f1f5f9', borderRadius: 4, height: 6, width: '100%' }}>
      <div
        style={{
          height: 6,
          borderRadius: 4,
          width: `${pct}%`,
          background: pct === 100 ? '#10b981' : '#3b82f6',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentAdminEmail(payload.email || '');
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet(`/api/v1/admin/users/${id}`);
    if (res.data) setData(res.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleActive = async () => {
    if (!data?.user) return;
    setActionLoading(true);
    await apiPatch(`/api/v1/admin/users/${id}`, { isActive: !data.user.isActive });
    await load();
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this user permanently? This will remove all their enrollments and cannot be undone.'))
      return;
    setActionLoading(true);
    await apiDelete(`/api/v1/admin/users/${id}`);
    router.push(`${ADMIN_BASE}/users`);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner" />
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>User not found.</div>
      </div>
    );
  }

  const { user, enrollments = [], payments = [], quizAttempts = [], certificates = [], stats = {}, profile } = data;
  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.user;
  const isSelf = user.email === currentAdminEmail;

  const socialLinks = Array.isArray(user.socialLinks)
    ? user.socialLinks.filter(l => l.url)
    : typeof user.socialLinks === 'object' && user.socialLinks !== null
      ? Object.entries(user.socialLinks)
          .filter(([, v]) => v)
          .map(([k, v]) => ({ name: k, url: v }))
      : [];

  return (
    <div className="admin-page">
      {/* Top bar */}
      <div
        style={{
          margin: '-28px -28px 24px',
          padding: '14px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={() => router.push(`${ADMIN_BASE}/users`)}
          style={{
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Users
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <span style={{ fontSize: 13, color: '#64748b' }}>User Profile</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {!isSelf && (
            <>
              <button
                className="btn btn-sm"
                style={{
                  background: user.isActive !== false ? '#fef3c7' : '#d1fae5',
                  color: user.isActive !== false ? '#b45309' : '#059669',
                }}
                onClick={handleToggleActive}
                disabled={actionLoading}
              >
                {user.isActive !== false ? 'Deactivate' : 'Activate'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                Delete User
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '24px',
          marginBottom: 20,
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {(user.fullName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: user.isActive !== false ? '#10b981' : '#94a3b8',
              border: '2px solid #fff',
            }}
          />
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#1e293b' }}>
              {user.fullName || 'No name set'}
            </h1>
            <span
              style={{
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: roleStyle.bg,
                color: roleStyle.color,
                textTransform: 'capitalize',
              }}
            >
              {user.role}
            </span>
            <span
              style={{
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: user.isActive !== false ? '#dcfce7' : '#f1f5f9',
                color: user.isActive !== false ? '#15803d' : '#64748b',
              }}
            >
              {user.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{user.email}</div>
          {user.headline && (
            <div style={{ fontSize: 13, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>
              {user.headline}
            </div>
          )}
          {socialLinks.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: 12,
                    textDecoration: 'none',
                    fontWeight: 500,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {getSocialIcon(link.name)}
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick meta */}
        <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>
          <div>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ marginTop: 4 }}>via {user.provider || 'email'}</div>
          {user.phone && <div style={{ marginTop: 4 }}>{user.phone}</div>}
          {(user.city || user.state) && (
            <div style={{ marginTop: 4 }}>
              {[user.city, user.state].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label="Courses Enrolled" value={stats.totalEnrolled ?? enrollments.length} color="#3b82f6" />
        <StatCard label="Courses Completed" value={stats.totalCompleted ?? 0} color="#10b981" />
        <StatCard label="Lessons Completed" value={stats.totalLessonsCompleted ?? 0} color="#8b5cf6" />
        <StatCard label="Certificates" value={stats.totalCertificates ?? certificates.length} color="#f59e0b" />
        <StatCard
          label="Total Spent"
          value={`₹${(stats.totalSpentInr ?? 0).toLocaleString('en-IN')}`}
          color="#ef4444"
          sub="completed payments"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left column */}
        <div>
          {/* Profile Info */}
          <Section title="Profile Information">
            <InfoRow label="Full Name" value={user.fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="City" value={user.city} />
            <InfoRow label="State" value={user.state} />
            <InfoRow label="Role" value={user.role} />
            <InfoRow label="Provider" value={user.provider} />
            <InfoRow
              label="Auth Methods"
              value={(user.authProviders || [user.provider || 'email']).join(', ')}
            />
            <InfoRow
              label="Profile Visibility"
              value={user.privacySettings?.profileVisibility}
            />
            {user.bio && (
              <div style={{ paddingTop: 12, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 4 }}>Bio</span>
                {user.bio}
              </div>
            )}
            {user.missionStatement && (
              <div style={{ paddingTop: 12, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 4 }}>
                  Mission Statement
                </span>
                {user.missionStatement}
              </div>
            )}
          </Section>

          {/* Dynamic Role Profile Information */}
          {profile && profile.dynamicProfileData && Object.keys(profile.dynamicProfileData).length > 0 && (
            <Section title={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Profile Details`}>
              {Object.entries(profile.dynamicProfileData)
                .filter(([k]) => !['profilePhoto', 'resume', 'certificates'].includes(k)) // exclude binary/large files handled separately
                .map(([key, val]) => {
                  const humanKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  
                  let displayVal = val;
                  if (Array.isArray(val)) {
                    displayVal = val.join(', ');
                  } else if (typeof val === 'boolean') {
                    displayVal = val ? 'Yes' : 'No';
                  } else if (typeof val === 'object' && val !== null) {
                    displayVal = JSON.stringify(val);
                  }

                  return <InfoRow key={key} label={humanKey} value={displayVal} />;
                })}
            </Section>
          )}

          {/* Quiz Attempts */}
          {quizAttempts.length > 0 && (
            <Section title={`Quiz Attempts (last ${quizAttempts.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quizAttempts.map((qa, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>
                      {qa.courseId?.title || 'Unknown course'} — {qa.moduleId?.title || 'Unknown module'}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      <span>Score: {qa.score}/{qa.totalQuestions}</span>
                      <span>{qa.percentage?.toFixed(0)}%</span>
                      <span
                        style={{
                          color: qa.passed ? '#059669' : '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        {qa.passed ? 'Passed' : 'Failed'}
                      </span>
                      <span style={{ marginLeft: 'auto' }}>
                        {new Date(qa.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Enrolled Courses */}
          <Section title={`Enrolled Courses (${enrollments.length})`}>
            {enrollments.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                No courses enrolled
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {enrollments.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      background: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', flex: 1 }}>
                        {e.courseId?.title || 'Unknown course'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 10,
                            background: e.completed ? '#dcfce7' : '#f1f5f9',
                            color: e.completed ? '#15803d' : '#64748b',
                            fontWeight: 600,
                          }}
                        >
                          {e.completed ? 'Completed' : e.status}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 10,
                            background:
                              e.paymentStatus === 'paid' || e.paymentStatus === 'completed'
                                ? '#dcfce7'
                                : e.paymentStatus === 'free'
                                  ? '#ede9fe'
                                  : '#fef3c7',
                            color:
                              e.paymentStatus === 'paid' || e.paymentStatus === 'completed'
                                ? '#15803d'
                                : e.paymentStatus === 'free'
                                  ? '#6d28d9'
                                  : '#b45309',
                            fontWeight: 600,
                          }}
                        >
                          {e.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={e.progress} />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: '#94a3b8',
                        marginTop: 4,
                      }}
                    >
                      <span>{e.progress || 0}% progress</span>
                      {e.amountPaid > 0 && (
                        <span>₹{e.amountPaid.toLocaleString('en-IN')} paid</span>
                      )}
                      {e.lastAccessedAt && (
                        <span>
                          Last: {new Date(e.lastAccessedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {e.completedAt && (
                      <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>
                        Completed on {new Date(e.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Payment History */}
          <Section title={`Payment History (${payments.length})`}>
            {payments.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                No payments yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {payments.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                        ₹{(p.amount || 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ color: '#94a3b8', marginTop: 2 }}>
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        background:
                          p.status === 'succeeded'
                            ? '#dcfce7'
                            : p.status === 'failed'
                              ? '#fee2e2'
                              : p.status === 'refunded'
                                ? '#ede9fe'
                                : '#fef3c7',
                        color:
                          p.status === 'succeeded'
                            ? '#15803d'
                            : p.status === 'failed'
                              ? '#b91c1c'
                              : p.status === 'refunded'
                                ? '#6d28d9'
                                : '#b45309',
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Certificates */}
          {certificates.length > 0 && (
            <Section title={`Certificates (${certificates.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {certificates.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#fffbeb',
                      borderRadius: 8,
                      border: '1px solid #fde68a',
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                        {c.courseTitle || 'Certificate'}
                      </div>
                      <div style={{ color: '#94a3b8', marginTop: 2 }}>
                        Issued {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>🏆</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
