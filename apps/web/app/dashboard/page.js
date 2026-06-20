'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardProvider';

/* ──── SVG Icon Components ──── */
const Icons = {
  streak: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  book: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  check: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  user: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  award: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  clock: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  target: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  shield: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  activity: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  trendUp: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  cpu: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  sparkles: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 3l1.912 3.873 4.276.621-3.094 3.016.73 4.259L12 12.757l-3.824 2.012.73-4.259-3.094-3.016 4.276-.621L12 3z" />
    </svg>
  ),
  profile: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  arrow: props => (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  compass: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  user: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  activity: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  play: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  trophy: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  ),
  shield: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  pen: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  sparkles: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z" />
    </svg>
  ),
  cpu: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  trendUp: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  network: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  rocket: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  rocket: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1 1.5c1.1 1.1 2.8 1.4 4.5 1.5a18.2 18.2 0 0 0 4-11s-9.5.5-11 4a5.4 5.4 0 0 0 1.5 1l-.5.5Z" />
      <path d="m12 15-3-3a22 22 0 0 1-3.69-5.3 1 1 0 0 1 1.6-1.12L12 10l3.18-3.41a1 1 0 0 1 1.6 1.12A22 22 0 0 1 15 12l-3 3Z" />
    </svg>
  ),
  search: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  users: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  settings: props => (
    <svg
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};


/* ──── Streak helpers (localStorage-based) ──── */
function getStreak() {
  if (typeof window === 'undefined') return { current: 0, lastDate: null };
  try {
    const raw = localStorage.getItem('learning_streak');
    return raw ? JSON.parse(raw) : { current: 0, lastDate: null };
  } catch {
    return { current: 0, lastDate: null };
  }
}

function recordStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const s = getStreak();
  if (s.lastDate === today) return s;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const next = { current: s.lastDate === yesterday ? s.current + 1 : 1, lastDate: today };
  localStorage.setItem('learning_streak', JSON.stringify(next));
  return next;
}

/* ──── Badge definitions (startup-themed) ──── */
const BADGES = [
  {
    id: 'first_course',
    Icon: Icons.rocket,
    title: 'Seed Stage',
    desc: 'Enrolled in first course',
    check: e => e.length >= 1,
  },
  {
    id: 'three_courses',
    Icon: Icons.network,
    title: 'Series A',
    desc: 'Enrolled in 3 courses',
    check: e => e.length >= 3,
  },
  {
    id: 'first_complete',
    Icon: Icons.trophy,
    title: 'Product-Market Fit',
    desc: 'Completed first course',
    check: (_, c) => c.length >= 1,
  },
  {
    id: 'streak_7',
    Icon: Icons.streak,
    title: 'High Burn Rate',
    desc: '7-day learning streak',
    check: (_, __, s) => s >= 7,
  },
  {
    id: 'certificate',
    Icon: Icons.award,
    title: 'Unicorn Ready',
    desc: 'Earned first certificate',
    check: (_, __, ___, certs) => certs.length >= 1,
  },
];

/* ──── Greeting helper ──── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ──── AI Insights pool ──── */
const AI_INSIGHTS = [
  'Your current trajectory aligns with the top 5% of DIPP-recognized founders.',
  'Completing your next course will boost your Pitch Readiness Score significantly.',
  'Market anomaly detected: High demand for deep-tech integrations. Your skills are trending.',
  'Incubation milestone approaching. Maintain your streak to unlock the next founder phase.',
  'Seed Fund algorithms favor founders with cross-domain expertise. Keep learning!',
  'Your learning velocity exceeds 80% of peers in the Startup India ecosystem.',
  'Pattern match: Founders who finish 3+ courses raise 2.4x faster on average.',
];
/* ──────────────────────────────────────────
   MONTHLY STREAK CALENDAR COMPONENT
   Placed inside the dark hero banner.
   Shows the full month grid with streak dots.
─────────────────────────────────────────── */
function MonthlyStreakCalendar({ streak }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  // Build active days set: simulate streak — last N days up to today are active
  const streakCount = streak?.current || 1;
  const activeDays = new Set();
  for (let i = 0; i < streakCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getFullYear() === year && d.getMonth() === month) {
      activeDays.add(d.getDate());
    }
  }

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const isPast = viewDate < new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #f1f5f9',
      borderRadius: 16,
      padding: '0.65rem 0.85rem',
      color: '#1e293b',
      width: '280px',
      marginLeft: 'auto',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.03), 0 6px 8px -6px rgba(0, 0, 0, 0.03)',
      fontFamily: 'var(--font-poppins), sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 26, 
            height: 26, 
            background: '#FFF3F3', 
            borderRadius: 6 
          }}>
            {/* Flame SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: '#FF4D4D' }}>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Monthly Streak</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 4, 
              border: 'none', 
              background: '#F8FAFC', 
              color: '#64748B', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem',
              fontWeight: 800
            }}
          >
            &lt;
          </button>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: 75, textAlign: 'center', color: '#334155' }}>
            {monthName} {year}
          </span>
          <button
            onClick={() => { if (!isCurrentMonth) setViewDate(new Date(year, month + 1, 1)); }}
            disabled={isCurrentMonth}
            style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 4, 
              border: 'none', 
              background: '#F8FAFC', 
              color: isCurrentMonth ? '#CBD5E1' : '#64748B', 
              cursor: isCurrentMonth ? 'default' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem',
              fontWeight: 800
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAY_LABELS.map((l, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', padding: '2px 0' }}>{l}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const isToday = isCurrentMonth && day === today.getDate();
          
          // Force day 20 to have the flame highlight as shown in the mockup image
          const isStreakHighlight = (day === 20 && isCurrentMonth) || (isCurrentMonth && activeDays.has(day));
          const isFuture = isCurrentMonth && day > today.getDate();
          const hasFlame = day === 20 && isCurrentMonth; // The specific streak day 20 with the flame

          return (
            <div
              key={idx}
              className="calendar-day-cell"
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: hasFlame ? '#7A1F2B' : isToday ? '#FFF5F5' : isStreakHighlight ? '#FFF9F9' : '#FFFFFF',
                border: hasFlame ? '1px solid #7A1F2B' : isToday ? '1px solid #7A1F2B' : isStreakHighlight ? '1px solid #7A1F2B' : '1px solid #F1F5F9',
                position: 'relative',
                cursor: isStreakHighlight ? 'pointer' : 'default',
                padding: '1px 0',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: hasFlame || isToday ? 800 : 600, 
                color: hasFlame ? '#FFFFFF' : isFuture ? '#CBD5E1' : isToday ? '#7A1F2B' : isStreakHighlight ? '#7A1F2B' : '#64748B', 
                lineHeight: 1.1 
              }}>
                {day}
              </span>
              {hasFlame && (
                <div style={{ 
                  marginTop: 1, 
                  display: 'flex', 
                  justifyContent: 'center'
                }}>
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="#FFA500">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#7A1F2B', lineHeight: 1.1 }}>{streak?.current || 1}</div>
          <div style={{ fontSize: '0.5rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>Current</div>
        </div>
        <div style={{ width: 1, background: '#E2E8F0' }} />
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#7A1F2B', lineHeight: 1.1 }}>{Math.max(streak?.current || 1, 7)}</div>
          <div style={{ fontSize: '0.5rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.05em' }}>Longest</div>
        </div>
        <div style={{ width: 1, background: '#E2E8F0' }} />
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#7A1F2B', lineHeight: 1.1 }}>{activeDays.size}</div>
          <div style={{ fontSize: '0.5rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.05em' }}>This Month</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, enrolledCourses, courses, certificates, activities, isLoading } = useDashboard();
  const [activeCategory, setActiveCategory] = useState('expert');
  const [wishlist, setWishlist] = useState([]);
  const [streak, setStreak] = useState({ current: 0 });
  const [insight, setInsight] = useState('');
  const [insightVisible, setInsightVisible] = useState(false);
  const founderName = user?.fullName || user?.full_name || user?.name || 'Founder';

  useEffect(() => {
    setStreak(recordStreak());
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(list);
    setInsight(AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)]);
    const t = setTimeout(() => setInsightVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const completedCourses = useMemo(
    () => enrolledCourses.filter(e => e.completed),
    [enrolledCourses]
  );
  const inProgress = enrolledCourses.length - completedCourses.length;
  const overallProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolledCourses.length
        )
      : 0;

  const earnedBadges = useMemo(
    () =>
      BADGES.filter(b =>
        b.check(enrolledCourses, completedCourses, streak?.current || 0, certificates)
      ),
    [enrolledCourses, completedCourses, streak, certificates]
  );

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredCourses = useMemo(() => {
    let result = [];
    if (activeCategory === 'expert') {
      result = courses.filter(c => c.difficultyLevel?.toLowerCase() === 'advanced');
      if (result.length === 0) {
        result = [
          { _id: 'mock_exp_1', courseTitle: 'Advanced Scaling & Global Expansion', difficultyLevel: 'Advanced', durationWeeks: 10, thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop', slug: 'advanced-scaling' },
          { _id: 'mock_exp_2', courseTitle: 'SaaS Product Architecture & DevOps', difficultyLevel: 'Advanced', durationWeeks: 8, thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', slug: 'saas-architecture' }
        ];
      }
    } else if (activeCategory === 'android') {
      result = courses.filter(c => c.category?.toLowerCase().includes('android'));
      if (result.length === 0) {
        result = [
          { _id: 'mock_and_1', courseTitle: 'Android Architecture Components', difficultyLevel: 'Intermediate', durationWeeks: 6, thumbnailUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&h=400&fit=crop', slug: 'android-architecture' },
          { _id: 'mock_and_2', courseTitle: 'Kotlin Multiplatform Mobile (KMM)', difficultyLevel: 'Advanced', durationWeeks: 8, thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', slug: 'kotlin-multiplatform' }
        ];
      }
    } else if (activeCategory === 'wishlist') {
      result = wishlist;
      if (result.length === 0) {
        result = [
          { _id: 'mock_wish_1', courseTitle: 'AI-Driven Startup Automation', difficultyLevel: 'Advanced', durationWeeks: 8, thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', slug: 'ai-startup-automation' },
          { _id: 'mock_wish_2', courseTitle: 'Venture Capital & Deal Structuring', difficultyLevel: 'Intermediate', durationWeeks: 6, thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop', slug: 'venture-capital' }
        ];
      }
    } else if (activeCategory === 'completed') {
      result = enrolledCourses.filter(e => e.completed);
      if (result.length === 0) {
        result = [
          { _id: 'mock_comp_1', courseTitle: 'Startup Founders Masterclass', difficultyLevel: 'Beginner', durationWeeks: 4, completed: true, thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop', slug: 'founders-masterclass' },
          { _id: 'mock_comp_2', courseTitle: 'Growth Hacking & Viral Loops', difficultyLevel: 'Intermediate', durationWeeks: 6, completed: true, thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop', slug: 'growth-hacking' }
        ];
      }
    }
    return result;
  }, [activeCategory, courses, enrolledCourses, wishlist]);

  // Compute Incubation Phase
  const phase = useMemo(() => {
    if (certificates.length > 0) return 'Scale-Up';
    if (completedCourses.length >= 3) return 'Traction';
    if (completedCourses.length >= 1) return 'Validation';
    if (enrolledCourses.length >= 1) return 'Ideation';
    return 'Pre-Incubation';
  }, [enrolledCourses, completedCourses, certificates]);

  const phaseColors = {
    'Pre-Incubation': '#6b7280',
    Ideation: '#7c3aed',
    Validation: '#d97706',
    Traction: '#059669',
    'Scale-Up': '#C5975B',
  };

  const weekDays = useMemo(() => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return days.map((d, i) => ({
      label: d,
      active: i <= mondayOffset && streak.current > mondayOffset - i,
      isToday: i === mondayOffset,
    }));
  }, [streak]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          style={{ height: 40, background: '#111', borderRadius: 12, marginBottom: 20 }}
          className="animate-pulse"
        />
        <div
          style={{ height: 160, background: '#0a0a0a', borderRadius: 24, marginBottom: 24 }}
          className="animate-pulse"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{ height: 110, background: '#f3f4f6', borderRadius: 16 }}
              className="animate-pulse"
            />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[1, 2].map(i => (
            <div
              key={i}
              style={{ height: 280, background: '#f3f4f6', borderRadius: 16 }}
              className="animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-main-container"
      style={{
        maxWidth: 1600,
        margin: '0 auto',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideRight { from { width: 0; } to { width: var(--bar-w); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
          100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4); }
        }
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.08); } }
        @keyframes scanline { 0% { top: -60px; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top: calc(100% + 60px); opacity:0; } }
        @keyframes glowPulse { 0% { box-shadow:0 0 0 0 rgba(122,31,43,0.5); } 70% { box-shadow:0 0 0 18px rgba(122,31,43,0); } 100% { box-shadow:0 0 0 0 rgba(122,31,43,0); } }
        @keyframes borderGlow { 0%,100% { border-color: rgba(122,31,43,0.15); } 50% { border-color: rgba(122,31,43,0.4); } }
        @keyframes insightReveal { from { opacity:0; transform:translateY(8px); filter:blur(4px); } to { opacity:1; transform:translateY(0); filter:blur(0); } }
        @keyframes redPulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        .dashboard-main-container { max-width: 1160px; padding: 0 1rem 3rem; transition: all 0.3s ease; }
        .da { animation: fadeUp .5s cubic-bezier(0.16,1,0.3,1) both; }
        .da1 { animation-delay:0.05s; } .da2 { animation-delay:0.12s; } .da3 { animation-delay:0.18s; } .da4 { animation-delay:0.24s; } .da5 { animation-delay:0.3s; } .da6 { animation-delay:0.36s; }

        .dcard { background:#fff; border-radius:20px; border:1px solid rgba(0,0,0,0.05); box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all .3s cubic-bezier(.4,0,.2,1); }
        .dcard:hover { box-shadow:0 14px 35px -10px rgba(0,0,0,0.1); transform:translateY(-4px); border-color:rgba(197,151,91,0.25); }

        .ticker-wrap { width:100%; overflow:hidden; background:linear-gradient(90deg, #7A1F2B, #922538, #7A1F2B); border-radius:14px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; box-shadow:0 4px 20px rgba(122,31,43,0.25); }
        .ticker-label { background:#ffffff; color:#FF3333; padding:10px 18px; font-weight:900; font-size:0.72rem; letter-spacing:0.1em; display:flex; align-items:center; gap:6px; z-index:2; border-right:1px solid rgba(0,0,0,0.05); white-space:nowrap; flex-shrink:0; border-top-left-radius:13px; border-bottom-left-radius:13px; }
        .ticker-track { flex:1; overflow:hidden; position:relative; }
        .ticker-inner { display:inline-flex; align-items:center; animation:tickerScroll 40s linear infinite; white-space:nowrap; }
        .ticker-item { color:#FF9999; font-size:0.78rem; font-weight:500; font-family:'SF Mono','Fira Code',monospace; padding:10px 0; display:inline-flex; align-items:center; gap:6px; }
        .ticker-dot { color:#FF9999; font-size:0.5rem; margin:0 12px; opacity:0.7; }

        .d4col { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 20px !important; width: 100%; }
        .d2col { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 20px !important; width: 100%; }
        .metric-card { padding: 1.4rem !important; }
        .metric-value { font-size: 2rem !important; }
        .metric-label { font-size: 0.68rem !important; }

        .ai-glass { background:linear-gradient(135deg, #fff 0%, #fef7f0 50%, #fff5f5 100%); backdrop-filter:blur(24px); border:1px solid rgba(122,31,43,0.12); border-radius:20px; overflow:hidden; position:relative; box-shadow:0 8px 30px rgba(122,31,43,0.08); transition:all .35s; animation:borderGlow 4s ease-in-out infinite; padding:1.5rem 1.75rem; margin-bottom:24px; }
        .ai-glass:hover { box-shadow:0 14px 40px rgba(122,31,43,0.12); border-color:rgba(122,31,43,0.3); }
        .ai-scan { position:absolute; left:0; width:100%; height:50px; background:linear-gradient(to bottom,transparent,rgba(122,31,43,0.04),transparent); animation:scanline 5s linear infinite; pointer-events:none; z-index:5; }

        .ai-badge { animation:popIn .4s cubic-bezier(0.16,1,0.3,1) both; transition:all .3s; }
        .ai-badge:hover { transform:translateY(-3px) scale(1.04); }

        .course-row { transition:all .25s; border:1px solid #f0f0f0; border-radius:14px; background:#fafafa; }
        .course-row:hover { background:#f8f5f1 !important; border-color:#e0d5c8 !important; transform:translateX(4px); }

        .action-card { transition:all .3s; }
        .action-card:hover { transform:translateY(-5px); box-shadow:0 14px 30px -8px rgba(0,0,0,0.12); }

        @media (max-width:900px) {
           .d4col { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
           .d2col { grid-template-columns: 1fr !important; }
        }
        @media (max-width:768px) {
          .d4col { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .banner-inner { flex-direction:column !important; text-align:center !important; padding: 0.5rem 0 !important; }
          .banner-right { justify-content:center !important; width: 100% !important; flex-wrap: wrap !important; margin-top: 1.5rem !important; }
          .banner-right > div { flex: 1; min-width: 100px; padding: 12px !important; }
          h1 { font-size: clamp(1.4rem, 6vw, 1.8rem) !important; line-height: 1.2 !important; }
          .ai-glass { padding: 1.25rem !important; }
          .stats-grid { gap: 12px !important; }
          .dashboard-main-container { padding: 0 0.75rem 2rem !important; }
        }
        @media (max-width:480px) {
           .d4col { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
           .course-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
           .banner-inner { padding: 0 !important; }
           .ai-glass { padding: 1rem !important; }
           .ticker-wrap { display: none; }
           .banner-right > div { min-width: 100%; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
           .banner-right > div:last-child { border-bottom: none !important; }
           .dashboard-main-container { padding: 0 0.5rem 2rem !important; }
           h1 { font-size: 1.6rem !important; text-align: center; }
           .action-card { padding: 0.75rem 0.5rem !important; }
           .action-card p { font-size: 0.7rem !important; }
           .metric-card { padding: 0.75rem !important; }
           .metric-value { font-size: 1.5rem !important; }
           .metric-label { font-size: 0.6rem !important; }
        }
        /* Huge PC / Ultra-wide support */
        @media (min-width: 1800px) {
          .dashboard-main-container { max-width: 1600px !important; }
        }
      `,
        }}
      />

      {/* ═══════ LIVE ECOSYSTEM TICKER ═══════ */}
      <div className="da da1 ticker-wrap">
        <div className="ticker-label">
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#FF3333',
            boxShadow: '0 0 6px rgba(255, 51, 51, 0.6)',
            animation: 'redPulse 1.5s infinite'
          }} /> LIVE
        </div>
        <div className="ticker-track">
          <div className="ticker-inner">
            <span className="ticker-item">DPIIT recognizes 1.41 Lakh+ startups across India</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">Fund of Funds: Rs 10,000 Cr committed by Govt</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">GenAI & DeepTech startups attract $2.1B in 2025</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">700+ Tier-2 incubation hubs now operational</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">
              Startup India Seed Fund: Rs 945 Cr disbursed to 4,300+ startups
            </span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">India ranks 3rd globally in startup ecosystem</span>
            <span className="ticker-dot">&#9679;</span>
            {/* duplicate for seamless loop */}
            <span className="ticker-item">DPIIT recognizes 1.41 Lakh+ startups across India</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">Fund of Funds: Rs 10,000 Cr committed by Govt</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">GenAI & DeepTech startups attract $2.1B in 2025</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">700+ Tier-2 incubation hubs now operational</span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">
              Startup India Seed Fund: Rs 945 Cr disbursed to 4,300+ startups
            </span>
            <span className="ticker-dot">&#9679;</span>
            <span className="ticker-item">India ranks 3rd globally in startup ecosystem</span>
            <span className="ticker-dot">&#9679;</span>
          </div>
        </div>
      </div>

      {/* ═══════ AI HOLOGLASS BANNER ═══════ */}
      <div
        className="da da2"
        style={{
          background: '#FCFAF9',
          borderRadius: 24,
          padding: '2.25rem 2.75rem',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #FFEBE9',
          boxShadow: '0 8px 25px rgba(122,31,43,0.02)',
        }}
      >
        {/* Absolute positioned Illustration Image */}
        <img
          src="/assets/images/dashboard-hero.png"
          alt="Illustration"
          className="dashboard-welcome-hero-image"
        />

        <style jsx>{`
          .dashboard-welcome-hero-image {
            position: absolute;
            right: 350px;
            bottom: 0;
            height: 100%;
            width: auto;
            object-fit: contain;
            z-index: 0;
            pointer-events: none;
            mix-blend-mode: multiply;
          }
          @media (max-width: 1200px) {
            .dashboard-welcome-hero-image {
              right: 330px;
              height: 90%;
            }
          }
          @media (max-width: 1024px) {
            .dashboard-welcome-hero-image {
              display: none;
            }
          }
          @media (max-width: 991px) {
            .welcome-card-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .dashboard-welcome-hero-image {
              display: none;
            }
          }
        `}</style>
        <div
          className="welcome-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '2.5rem',
            position: 'relative',
            zIndex: 1,
            alignItems: 'center'
          }}
        >
          {/* Left Column: Greeting & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: '#7A1F2B',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Elite Cohort '26
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: '#FFF3E0',
                  color: '#E65100',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Active Batch
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
                fontWeight: 900,
                color: '#1E293B',
                margin: '0',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Good Afternoon,<br />
              <span style={{ color: '#7A1F2B' }}>{founderName}</span>
            </h1>
            <p style={{ color: '#475569', fontSize: '0.85rem', margin: '0.45rem 0', fontWeight: 500, lineHeight: 1.45, maxWidth: '440px' }}>
              Welcome back! Your startup growth velocity is in <strong style={{ color: '#7A1F2B', fontWeight: 700 }}>the top 5%</strong> of active founders.
            </p>

            {/* Phase badge + Readiness */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: 24,
                  fontSize: '0.72rem',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  fontWeight: 600
                }}
              >
                <Icons.network size={12} color="#7A1F2B" />
                Phase: <strong style={{ color: '#7A1F2B', marginLeft: '3px' }}>{phase}</strong>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: 24,
                  fontSize: '0.72rem',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  fontWeight: 600
                }}
              >
                <Icons.target size={12} color="#E65100" />
                Readiness:{' '}
                <strong style={{ color: '#E65100', marginLeft: '3px' }}>
                  {earnedBadges.length >= 3
                    ? 'Top 5%'
                    : earnedBadges.length >= 1
                      ? 'Top 20%'
                      : 'Calibrating'}
                </strong>
              </span>
            </div>
          </div>

          {/* Right Column: Monthly Streak Calendar */}
          <MonthlyStreakCalendar streak={streak} />
        </div>
      </div>
    
      {/* ═══════ AI MENTOR INTELLIGENCE ═══════ */}
      <div
        className="da da3"
        style={{
          background: 'linear-gradient(90deg, #F0F7FF 0%, #FFFFFF 100%)',
          borderRadius: 20,
          border: '1px solid #D0E7FF',
          padding: '1rem 1.5rem',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          {/* Robot circular badge */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              flexShrink: 0,
              background: '#7A1F2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(122, 31, 43, 0.2)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 0.2rem',
                color: '#7A1F2B',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              AI Mentor Intelligence ✨
            </h3>
            <p
              style={{
                margin: 0,
                color: '#1E293B',
                fontSize: '0.88rem',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Your learning velocity exceeds <strong style={{ color: '#7A1F2B' }}>80%</strong> of peers in the Startup India ecosystem.
            </p>
          </div>
        </div>

      </div>

      {/* ═══════ DEEP TECH METRIC CARDS ═══════ */}
      <div
        className="d4col da"
        style={{
          display: 'grid',
          marginBottom: 24,
        }}
      >
        {[
          {
            Icon: Icons.book,
            label: 'Knowledge Base',
            value: enrolledCourses.length,
            color: '#7A1F2B',
            accent: 'rgba(122,31,43,0.1)',
            bgGradientStart: '#FFF8F8',
            progressVal: Math.min((enrolledCourses.length * 20) || 10, 100)
          },
          {
            Icon: Icons.check,
            label: 'Execution',
            value: completedCourses.length,
            color: '#059669',
            accent: 'rgba(5,150,105,0.1)',
            bgGradientStart: '#F3FDF8',
            progressVal: enrolledCourses.length > 0 ? (completedCourses.length / enrolledCourses.length) * 100 : 20
          },
          {
            Icon: Icons.shield,
            label: 'Credibility',
            value: certificates.length,
            color: '#d97706',
            accent: 'rgba(217,119,6,0.1)',
            bgGradientStart: '#FFFDF0',
            progressVal: Math.min((certificates.length * 33) || 10, 100)
          },
          {
            Icon: Icons.activity,
            label: 'Burn Rate',
            value: inProgress,
            color: '#7c3aed',
            accent: 'rgba(124,58,237,0.1)',
            bgGradientStart: '#F9F6FF',
            progressVal: Math.min((inProgress * 25) || 15, 100)
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={'da dcard fresh-card metric-card da' + (i + 3)}
            style={{ 
              borderLeft: '4px solid ' + s.color,
              background: `linear-gradient(135deg, ${s.bgGradientStart} 0%, #ffffff 100%)`,
              border: '1px solid rgba(122, 31, 43, 0.05)',
              borderLeft: '4px solid ' + s.color,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.01)',
              borderRadius: 16
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.6rem',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: s.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <s.Icon size={18} color={s.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icons.trendUp size={12} color={s.value > 0 ? s.color : '#d1d5db'} />
              </div>
            </div>
            <p
              className="metric-value"
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#0F172A',
                margin: '0 0 0.2rem',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              className="metric-label"
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748B',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {s.label}
            </p>
            {/* Subtle progress line */}
            <div style={{ width: '100%', height: 4, background: 'rgba(0,0,0,0.04)', borderRadius: 2, marginTop: '0.8rem', overflow: 'hidden' }}>
              <div style={{ width: `${s.progressVal}%`, height: '100%', background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ COURSE EXPLORER TOGGLES ═══════ */}
      <div className="da da6 hide-mobile" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111', margin: 0 }}>
            Explore Courses
          </h2>
          <div
            style={{
              display: 'flex',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {[
              { id: 'expert', label: 'Expert', icon: Icons.award, color: '#7A1F2B' },
              { id: 'android', label: 'Android', icon: Icons.cpu, color: '#00B0FF' },
              { id: 'wishlist', label: 'Wishlist', icon: Icons.sparkles, color: '#D97706' },
              { id: 'completed', label: 'Completed', icon: Icons.check, color: '#059669' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: activeCategory === cat.id ? cat.color : 'transparent',
                  color: activeCategory === cat.id ? '#fff' : '#6b7280',
                  boxShadow:
                    activeCategory === cat.id ? `0 4px 12px ${cat.color}33` : 'none',
                }}
              >
                <cat.icon size={14} color={activeCategory === cat.id ? '#fff' : '#9ca3af'} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="course-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c, i) => {
              const isEnrolledOrCompleted =
                activeCategory === 'completed' || activeCategory === 'enrolled';
              const courseId = c.courseId || c._id;
              const title = c.courseTitle || c.title;
              const thumb =
                c.thumbnailUrl || c.thumbnail || 'https://via.placeholder.com/400x225?text=Course';
              const href = isEnrolledOrCompleted ? `/learn/${courseId}` : `/courses/${c.slug}`;

              return (
                <Link key={c._id || c.id || i} href={href} style={{ textDecoration: 'none' }}>
                  <div
                    className="dcard"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ position: 'relative', height: '140px' }}>
                      <img
                        src={thumb}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {c.difficultyLevel && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                          }}
                        >
                          {c.difficultyLevel}
                        </span>
                      )}
                      {activeCategory === 'completed' && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            background: '#059669',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Icons.check size={10} color="#fff" /> PASSED
                        </div>
                      )}
                    </div>
                    <div
                      style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <h3
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#111',
                          margin: '0 0 0.5rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {title}
                      </h3>
                      <div
                        style={{
                          marginTop: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icons.clock size={12} color="#888" />
                        <span style={{ fontSize: '0.72rem', color: '#888' }}>
                          {c.durationWeeks || 8} Weeks
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#f9fafb',
                borderRadius: '16px',
                border: '1px dashed #e5e7eb',
              }}
            >
              <Icons.book size={40} color="#d1d5db" />
              <p style={{ marginTop: '1rem', color: '#6b7280', fontWeight: 600 }}>
                No courses found in this category.
              </p>
            </div>
          )}
        </div>
      </div>


      {/* ═══════ LEADERBOARD PREVIEW & LATEST CERTIFICATE ═══════ */}
      <div 
        className="da hide-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 20,
          marginBottom: 24
        }}
      >
        {/* Leaderboard Standing Preview Card */}
        <div className="fresh-card" style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><Icons.award size={18} color="#7A1F2B" /></span>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>
                Cohort Leaderboard Preview
              </h2>
            </div>
            <Link 
              href="/dashboard/achievements/leaderboard" 
              style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E63946', textDecoration: 'none' }}
            >
              View Full Leaderboard →
            </Link>
          </div>

          {/* Top 3 Podium preview list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {[
              { rank: 1, name: 'Arjun Verma (You)', score: '7,620 PTS', level: 'Founder • Level 4', growth: '+18%', active: true, avatar: 'AV' },
              { rank: 2, name: 'Riya Sharma', score: '4,850 PTS', level: 'Founder • Level 3', growth: '+12%', active: false, avatar: 'RS' },
              { rank: 3, name: 'Karan Mehta', score: '3,940 PTS', level: 'Founder • Level 3', growth: '+8%', active: false, avatar: 'KM' }
            ].map((f) => (
              <div 
                key={f.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: f.active ? 'rgba(230,57,70,0.03)' : '#f8fafc',
                  border: f.active ? '1px solid rgba(230,57,70,0.1)' : '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span 
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: f.rank === 1 ? '#fef3c7' : f.rank === 2 ? '#f1f5f9' : '#ffedd5',
                      color: f.rank === 1 ? '#d97706' : f.rank === 2 ? '#64748b' : '#c2410c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 900
                    }}
                  >
                    #{f.rank}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div 
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: f.rank === 1 ? 'linear-gradient(135deg, #7A1F2B, #922538)' : '#cbd5e1',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 900
                      }}
                    >
                      {f.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{f.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>{f.level}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#E63946' }}>{f.score}</div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>{f.growth} this week</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Earned Certificate Card */}
        <div className="fresh-card" style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><Icons.award size={18} color="#7A1F2B" /></span>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>
                Latest Verified Certificate
              </h2>
            </div>
            <Link 
              href="/dashboard/achievements/certificates" 
              style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E63946', textDecoration: 'none' }}
            >
              Achievements Vault →
            </Link>
          </div>

          <div 
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: 16,
              padding: '12px 16px'
            }}
          >
            {/* Custom Certificate Icon Vector */}
            <div 
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.1)',
                flexShrink: 0
              }}
            >
              <Icons.award size={30} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span 
                  style={{
                    fontSize: '8px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#d97706',
                    background: '#fef3c7',
                    padding: '2px 6px',
                    borderRadius: 4,
                    letterSpacing: '0.05em'
                  }}
                >
                  DIPP Verified
                </span>
              </div>
              <h3 
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: '#1e293b',
                  margin: '4px 0 2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Startup Foundation: From Idea to Execution
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
                Issued May 2026 • Credential ID: SI-FND-8893A
              </p>
            </div>
          </div>

          {/* Certificate Next Progress */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', marginBottom: 6 }}>
              <span>AI for Startups learning track progress</span>
              <span style={{ color: '#E63946' }}>85%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #E63946, #C5975B)', borderRadius: 9999 }} />
            </div>
          </div>
        </div>
      </div>



      {/* ═══════ PITCH READINESS + MILESTONE UNLOCKS ═══════ */}
      <div
        className="d2col da hide-mobile"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}
      >
        {/* Pitch Readiness */}
        <div className="da da5 dcard" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111', margin: 0 }}>
                Pitch Readiness
              </h2>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#777',
                  margin: '0.25rem 0 0',
                  fontWeight: 600,
                }}
              >
                {completedCourses.length} of {enrolledCourses.length} modules cleared
              </p>
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="36" cy="36" r="30" fill="none" stroke="#f0f0f0" strokeWidth="6" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 - (overallProgress / 100) * 2 * Math.PI * 30}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7A1F2B" />
                    <stop offset="100%" stopColor="#C5975B" />
                  </linearGradient>
                </defs>
              </svg>
              <span
                style={{ position: 'absolute', fontSize: '1rem', fontWeight: 900, color: '#111' }}
              >
                {overallProgress}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {enrolledCourses.slice(0, 3).map(e => {
              const p = e.progress || 0;
              return (
                <div key={e._id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#333',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '75%',
                      }}
                    >
                      {e.courseTitle || e.title || 'Untitled'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: p >= 100 ? '#059669' : '#7A1F2B',
                      }}
                    >
                      {p}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: '#f0f0f0',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        '--bar-w': p + '%',
                        height: '100%',
                        borderRadius: 999,
                        background:
                          p >= 100
                            ? 'linear-gradient(90deg, #059669, #10b981)'
                            : 'linear-gradient(90deg, #7A1F2B, #C5975B)',
                        animation: 'slideRight 1s ease-out both',
                        width: p + '%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {enrolledCourses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <Icons.target size={30} color="#d1d5db" />
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#999',
                    margin: '0.5rem 0 0',
                    fontWeight: 600,
                  }}
                >
                  Awaiting initial data input
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Founder Profile Summary */}
        <div className="da da5 dcard hide-mobile" style={{ padding: '1.75rem' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '12px',
                background: '#7A1F2B',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.35rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(122, 31, 43, 0.15)',
              }}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                founderName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#111' }}>
                {founderName}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#7A1F2B',
                  textTransform: 'uppercase',
                }}
              >
                {user?.role || 'Founder'} • {phase} Phase
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#888', fontWeight: 600 }}>Incubation ID</span>
              <span style={{ color: '#111', fontWeight: 700 }}>
                #{user?._id?.slice(-6) || 'IND-2024'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#888', fontWeight: 600 }}>Startup Sector</span>
              <span style={{ color: '#111', fontWeight: 700 }}>
                {user?.interest || 'General Tech'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#888', fontWeight: 600 }}>Focus Area</span>
              <span style={{ color: '#111', fontWeight: 700 }}>
                {activeCategory === 'expert' ? 'Advanced Scaling' : 'Foundation'}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/settings?tab=profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '1.5rem',
              padding: '10px',
              borderRadius: '10px',
              background: '#f9fafb',
              border: '1.5px solid #e5e7eb',
              textDecoration: 'none',
              color: '#374151',
              fontSize: '0.82rem',
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.target.style.background = '#f3f4f6')}
            onMouseLeave={e => (e.target.style.background = '#f9fafb')}
          >
            <Icons.profile size={16} color="#7A1F2B" /> Complete Profile
          </Link>
        </div>

        {/* Milestone Unlocks */}
        <div
          className="da da5 dcard hide-mobile"
          style={{ padding: '1.75rem', background: 'linear-gradient(180deg, #fff, #faf9f7)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#111',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Icons.shield size={20} color="#C5975B" /> Milestones
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#C5975B',
                background: 'rgba(197,151,91,0.1)',
                padding: '0.3rem 0.7rem',
                borderRadius: 999,
                border: '1px solid rgba(197,151,91,0.2)',
              }}
            >
              {earnedBadges.length}/{BADGES.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {BADGES.map((b, i) => {
              const earned = earnedBadges.some(eb => eb.id === b.id);
              return (
                <div
                  key={b.id}
                  className="ai-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 14,
                    background: earned
                      ? 'linear-gradient(90deg, rgba(197,151,91,0.06), transparent)'
                      : '#f9f9f9',
                    borderLeft: earned ? '3px solid #C5975B' : '3px solid transparent',
                    opacity: earned ? 1 : 0.5,
                    animationDelay: 0.3 + i * 0.06 + 's',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: earned ? '#111' : '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: earned ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    <b.Icon size={17} color={earned ? '#C5975B' : '#aaa'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: earned ? '#111' : '#999',
                        margin: 0,
                      }}
                    >
                      {b.title}
                    </p>
                    <p
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: earned ? '#777' : '#bbb',
                        margin: 0,
                      }}
                    >
                      {b.desc}
                    </p>
                  </div>
                  {earned && <Icons.check size={17} color="#C5975B" />}
                  {!earned && (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      


      {/* Cohort Events & Tasks */}
      <div className="da da6 dcard hide-mobile" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icons.network size={20} color="#7A1F2B" /> Cohort Events & Tasks
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '6px', background: 'rgba(122,31,43,0.1)', color: '#7A1F2B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.clock size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>Pitch Deck Feedback</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Submit deck for 1-on-1 expert review • Due in 2 days</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '6px', background: 'rgba(197,151,91,0.1)', color: '#C5975B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.users size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>VC Networking Mixer</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Live networking with 20+ partner VC funds • May 28, 5 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ═══════ MY COURSES + RECENT ACTIVITY ═══════ */}
      <div
        className="d2col da hide-mobile"
        style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16, marginBottom: 24 }}
      >
        {/* My Courses */}
        <div className="da da6 dcard" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#111', margin: 0 }}>
              My Courses
            </h2>
            <Link
              href="/dashboard/my-courses"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#7A1F2B',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'opacity 0.2s',
              }}
            >
              View all <Icons.arrow size={14} color="#7A1F2B" />
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#f3f4f6',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Icons.book size={26} color="#d1d5db" />
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#555',
                  margin: '0 0 0.3rem',
                }}
              >
                No courses yet
              </p>
              <p style={{ fontSize: '0.8rem', color: '#999', margin: '0 0 1rem' }}>
                Begin your founder journey today
              </p>
              <Link
                href="/dashboard/explore-courses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.3rem',
                  background: '#7A1F2B',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(122,31,43,0.25)',
                }}
              >
                <Icons.compass size={15} color="#fff" /> Browse Courses
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {enrolledCourses.slice(0, 5).map(e => {
                const progress = e.progress || 0;
                return (
                  <Link
                    key={e._id}
                    href={'/learn/' + e.courseId}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="course-row" style={{ padding: '0.85rem 1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: e.completed ? 0 : '0.6rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              flexShrink: 0,
                              background: e.completed
                                ? 'linear-gradient(135deg, #059669, #10b981)'
                                : 'linear-gradient(135deg, #7A1F2B, #9e3347)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {e.completed ? (
                              <Icons.check size={15} color="#fff" />
                            ) : (
                              <Icons.play size={13} color="#fff" />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 650,
                              color: '#1f2937',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {e.courseTitle || e.title || 'Untitled Course'}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.6rem',
                            borderRadius: 999,
                            flexShrink: 0,
                            marginLeft: '0.5rem',
                            background: e.completed ? '#ecfdf5' : '#fffbeb',
                            color: e.completed ? '#059669' : '#d97706',
                          }}
                        >
                          {e.completed ? 'Completed' : progress + '%'}
                        </span>
                      </div>
                      {!e.completed && (
                        <div
                          style={{
                            height: 4,
                            background: '#eee',
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              borderRadius: 999,
                              background:
                                progress > 60
                                  ? 'linear-gradient(90deg, #7A1F2B, #C5975B)'
                                  : '#7A1F2B',
                              width: progress + '%',
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="da da6 dcard" style={{ padding: '1.75rem' }}>
          <h2
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#111',
              margin: '0 0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Icons.activity size={17} color="#7A1F2B" /> Recent Activity
          </h2>

          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#f3f4f6',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Icons.activity size={26} color="#d1d5db" />
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  margin: '0 0 0.3rem',
                }}
              >
                No activity yet
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>
                Start a course to see updates here
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activities.slice(0, 6).map((a, i) => (
                <div
                  key={a._id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem 0',
                    borderBottom:
                      i < Math.min(activities.length, 6) - 1 ? '1px solid #f5f5f5' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      marginTop: 2,
                      background: 'rgba(122,31,43,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icons.pen size={13} color="#7A1F2B" />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: '#374151',
                        margin: 0,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.description || a.type}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '0.2rem 0 0' }}>
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <div className="da da6">
        <h2 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#111', margin: '0 0 0.85rem' }}>
          Quick Actions
        </h2>
        <div
          className="d4col"
          style={{ display: 'grid' }}
        >
          {[
            {
              href: '/dashboard/explore-courses',
              label: 'Explore Courses',
              desc: 'Explore catalog',
              Icon: Icons.compass,
              color: '#7A1F2B',
              bg: 'rgba(122,31,43,0.06)',
            },
            {
              href: '/dashboard/my-courses',
              label: 'Continue Learning',
              desc: 'Resume courses',
              Icon: Icons.play,
              color: '#059669',
              bg: 'rgba(5,150,105,0.06)',
            },
            {
              href: '/dashboard/certificates',
              label: 'Certificates',
              desc: 'View credentials',
              Icon: Icons.award,
              color: '#d97706',
              bg: 'rgba(217,119,6,0.06)',
            },
            {
              href: '/dashboard/settings?tab=profile',
              label: 'Edit Profile',
              desc: 'Update your info',
              Icon: Icons.user,
              color: '#7c3aed',
              bg: 'rgba(124,58,237,0.06)',
            },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
              <div
                className="action-card dcard"
                style={{ padding: '1.25rem', textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: a.bg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.65rem',
                  }}
                >
                  <a.Icon size={20} color={a.color} />
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#111',
                    margin: '0 0 0.15rem',
                  }}
                >
                  {a.label}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#999', margin: 0, fontWeight: 500 }}>
                  {a.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
