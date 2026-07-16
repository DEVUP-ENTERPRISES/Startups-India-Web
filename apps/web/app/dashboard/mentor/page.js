'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, CalendarClock, Star, TrendingUp, Mail, ArrowRight, AlertCircle, Inbox,
} from 'lucide-react';
import { getMentorDashboard } from '@/lib/mentors';

/**
 * Mentor dashboard.
 *
 * This page is the landing target for every mentor: both login/page.js and
 * DashboardLayoutClient redirect role==='mentor' here, so if it 404s a mentor
 * simply cannot use the product.
 */

const card = {
  padding: '22px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '18px',
};

function Skeleton() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '18px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: '92px', borderRadius: '16px', background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'mShimmer 1.4s infinite' }} />
        ))}
      </div>
      <div style={{ height: '240px', borderRadius: '18px', background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'mShimmer 1.4s infinite' }} />
      <style>{`@keyframes mShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function StatTile({ icon, label, value, tone = '#111827' }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#9ca3af' }}>
        {icon}
        <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
          {label}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: tone, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

function RequestRow({ req }) {
  const person = req.user || {};
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderTop: '1px solid #f5f5f5' }}>
      <div
        style={{
          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
          background: '#fef2f2', color: '#ef4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '14px',
        }}
      >
        {(person.fullName || '?').charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>
          {person.fullName || 'Unknown'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {req.topic || req.message || person.email || '—'}
        </p>
      </div>
      <span
        style={{
          padding: '4px 10px', borderRadius: '100px', flexShrink: 0,
          background: req.status === 'matched' ? '#f0fdf4' : '#fffbeb',
          color: req.status === 'matched' ? '#047857' : '#b45309',
          fontSize: '11.5px', fontWeight: 700,
        }}
      >
        {req.status || 'pending'}
      </span>
    </div>
  );
}

export default function MentorDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: res, error: err } = await getMentorDashboard();
      if (err) {
        setError(err.message || 'Could not load your mentor dashboard.');
        return;
      }
      setData(res);
    })();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
          Mentor profile not ready
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, margin: '0 0 20px' }}>
          {error}
        </p>
        <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.7 }}>
          If your mentor application was only just approved, try signing out and back in.
        </p>
      </div>
    );
  }

  if (!data) return <Skeleton />;

  const { profile = {}, stats = {}, matchedRequests = [], pendingRequests = [] } = data;

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
            background: '#fef2f2', color: '#ef4444', borderRadius: '100px',
            fontSize: '11.5px', fontWeight: 800, letterSpacing: '1px',
            textTransform: 'uppercase', marginBottom: '12px',
          }}
        >
          Mentor
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Welcome back{profile.name ? `, ${profile.name}` : ''}
        </h1>
        <p style={{ margin: 0, fontSize: '14.5px', color: '#6b7280' }}>
          Here&apos;s what&apos;s happening with your mentees.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '18px' }}>
        <StatTile icon={<Users size={15} />} label="Mentees" value={stats.totalMentees ?? 0} />
        <StatTile icon={<CalendarClock size={15} />} label="Upcoming" value={stats.upcomingSessionsCount ?? 0} tone="#1d4ed8" />
        <StatTile icon={<TrendingUp size={15} />} label="Sessions" value={stats.totalSessions ?? 0} />
        <StatTile icon={<Star size={15} />} label="Rating" value={stats.rating ? Number(stats.rating).toFixed(1) : '—'} tone="#b45309" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '16px' }}>
        {/* My mentees */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>My Mentees</h2>
            <Link href="/dashboard/mentor/mentees" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 700, color: '#ef4444', textDecoration: 'none' }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {matchedRequests.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Inbox size={30} color="#d1d5db" style={{ margin: '0 auto 10px' }} />
              <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>
                No mentees matched to you yet.
              </p>
            </div>
          ) : (
            matchedRequests.slice(0, 5).map(r => <RequestRow key={r._id} req={r} />)
          )}
        </div>

        {/* Open requests */}
        <div style={card}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
            Open Requests
          </h2>
          <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: '#9ca3af' }}>
            Founders currently looking for a mentor.
          </p>

          {pendingRequests.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Mail size={30} color="#d1d5db" style={{ margin: '0 auto 10px' }} />
              <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>
                No open requests right now.
              </p>
            </div>
          ) : (
            pendingRequests.slice(0, 5).map(r => <RequestRow key={r._id} req={r} />)
          )}
        </div>
      </div>
    </div>
  );
}
