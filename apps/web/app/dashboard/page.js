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
    if (activeCategory === 'expert') {
      return courses.filter(c => c.difficultyLevel?.toLowerCase() === 'advanced');
    }
    if (activeCategory === 'android') {
      return courses.filter(c => c.category?.toLowerCase().includes('android'));
    }
    if (activeCategory === 'wishlist') {
      return wishlist;
    }
    if (activeCategory === 'completed') {
      return enrolledCourses.filter(e => e.completed);
    }
    return enrolledCourses;
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
        .ticker-label { background:linear-gradient(90deg,#5c1520,#7A1F2B); color:#fff; padding:10px 18px; font-weight:800; font-size:0.72rem; letter-spacing:0.1em; display:flex; align-items:center; gap:8px; z-index:2; border-right:1px solid rgba(255,255,255,0.15); white-space:nowrap; flex-shrink:0; }
        .ticker-track { flex:1; overflow:hidden; position:relative; }
        .ticker-inner { display:inline-flex; animation:tickerScroll 40s linear infinite; white-space:nowrap; }
        .ticker-item { color:rgba(255,255,255,0.9); font-size:0.78rem; font-weight:500; font-family:'SF Mono','Fira Code',monospace; padding:10px 0; display:inline-flex; align-items:center; gap:6px; }
        .ticker-dot { color:#C5975B; font-size:0.5rem; margin:0 12px; }

        .ai-glass { background:linear-gradient(135deg, #fff 0%, #fef7f0 50%, #fff5f5 100%); backdrop-filter:blur(24px); border:1px solid rgba(122,31,43,0.12); border-radius:20px; overflow:hidden; position:relative; box-shadow:0 8px 30px rgba(122,31,43,0.08); transition:all .35s; animation:borderGlow 4s ease-in-out infinite; padding:1.5rem 1.75rem; margin-bottom:24px; }
        .ai-glass:hover { box-shadow:0 14px 40px rgba(122,31,43,0.12); border-color:rgba(122,31,43,0.3); }
        .ai-scan { position:absolute; left:0; width:100%; height:50px; background:linear-gradient(to bottom,transparent,rgba(122,31,43,0.04),transparent); animation:scanline 5s linear infinite; pointer-events:none; z-index:5; }

        .ai-badge { animation:popIn .4s cubic-bezier(0.16,1,0.3,1) both; transition:all .3s; }
        .ai-badge:hover { transform:translateY(-3px) scale(1.04); }

        .course-row { transition:all .25s; border:1px solid #f0f0f0; border-radius:14px; background:#fafafa; }
        .course-row:hover { background:#f8f5f1 !important; border-color:#e0d5c8 !important; transform:translateX(4px); }

        .action-card { transition:all .3s; }
        .action-card:hover { transform:translateY(-5px); box-shadow:0 14px 30px -8px rgba(0,0,0,0.12); }

        @media (max-width:1060px) {
          .d4col { grid-template-columns: repeat(2, 1fr) !important; }
          .d2col { grid-template-columns: 1fr !important; }
        }
        @media (max-width:768px) {
          .d4col { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .banner-inner { flex-direction:column !important; text-align:center !important; padding: 1rem !important; }
          .banner-right { justify-content:center !important; width: 100% !important; flex-wrap: wrap !important; margin-top: 1.5rem !important; }
          .banner-right > div { flex: 1; min-width: 100px; padding: 12px !important; }
          h1 { font-size: 1.5rem !important; line-height: 1.2 !important; }
          .ai-glass { padding: 1.25rem !important; }
          .stats-grid { gap: 12px !important; }
          .dashboard-main-container { padding: 1rem 0.75rem 2rem !important; }
        }
        @media (max-width:480px) {
           .d4col { grid-template-columns: 1fr !important; }
           .banner-inner { padding: 0.75rem !important; }
           .ai-glass { padding: 1rem !important; }
           .ticker-wrap { display: none; }
           .banner-right > div { min-width: 100%; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
           .banner-right > div:last-child { border-bottom: none !important; }
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
          <Icons.trendUp size={15} color="#fff" /> LIVE
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
          background: 'linear-gradient(135deg, #7A1F2B 0%, #922538 30%, #5c1520 70%, #3d0e16 100%)',
          borderRadius: 24,
          padding: '2.5rem 2.5rem',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px rgba(122,31,43,0.3)',
        }}
      >
        {/* Animated blobs */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -50,
            width: 280,
            height: 280,
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'blobFloat 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            right: -40,
            width: 240,
            height: 240,
            background: 'radial-gradient(circle, rgba(197,151,91,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'blobFloat 10s ease-in-out infinite reverse',
          }}
        />

        {/* Tech grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            zIndex: 0,
          }}
        />

        <div
          className="banner-inner"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1.5rem 0',
          }}
        >
          <div>
            <div
              style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Live Schedule
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                fontWeight: 900,
                color: '#fff',
                margin: '0 0 0.8rem',
                letterSpacing: '-0.03em',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
              }}
            >
              {`${getGreeting()}, ${founderName}`}
            </h1>

            {/* Phase badge + Readiness */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '7px 16px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <Icons.network size={14} color="#C5975B" />
                Phase: <strong style={{ color: '#C5975B' }}>{phase}</strong>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '7px 16px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <Icons.target size={14} color="#C5975B" />
                Readiness:{' '}
                <strong style={{ color: '#C5975B' }}>
                  {earnedBadges.length >= 3
                    ? 'Top 5%'
                    : earnedBadges.length >= 1
                      ? 'Top 20%'
                      : 'Calibrating'}
                </strong>
              </span>
            </div>
          </div>

          <div />
        </div>
      </div>

      {/* ═══════ AI MENTOR INTELLIGENCE ═══════ */}
      <div className="da da3 ai-glass">
        <div className="ai-scan" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #7A1F2B, #922538)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(122,31,43,0.25)',
            }}
          >
            <Icons.cpu size={26} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: '0 0 0.3rem',
                color: '#7A1F2B',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Icons.sparkles size={13} color="#7A1F2B" /> AI Mentor Intelligence
            </h3>
            <p
              style={{
                margin: 0,
                color: '#555',
                fontSize: '0.92rem',
                fontWeight: 500,
                lineHeight: 1.6,
                opacity: insightVisible ? 1 : 0,
                transform: insightVisible ? 'translateY(0)' : 'translateY(8px)',
                filter: insightVisible ? 'blur(0)' : 'blur(4px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {insight}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════ DEEP TECH METRIC CARDS ═══════ */}
      <div
        className="d4col da"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
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
          },
          {
            Icon: Icons.check,
            label: 'Execution',
            value: completedCourses.length,
            color: '#059669',
            accent: 'rgba(5,150,105,0.1)',
          },
          {
            Icon: Icons.shield,
            label: 'Credibility',
            value: certificates.length,
            color: '#d97706',
            accent: 'rgba(217,119,6,0.1)',
          },
          {
            Icon: Icons.activity,
            label: 'Burn Rate',
            value: inProgress,
            color: '#7c3aed',
            accent: 'rgba(124,58,237,0.1)',
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={'da dcard da' + (i + 3)}
            style={{ padding: '1.4rem', borderLeft: '4px solid ' + s.color }}
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
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#111',
                margin: '0 0 0.2rem',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#888',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ═══════ COURSE EXPLORER TOGGLES ═══════ */}
      <div className="da da6" style={{ marginBottom: 24 }}>
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
              { id: 'expert', label: 'Expert', icon: Icons.award },
              { id: 'android', label: 'Android', icon: Icons.cpu },
              { id: 'wishlist', label: 'Wishlist', icon: Icons.sparkles },
              { id: 'completed', label: 'Completed', icon: Icons.check },
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
                  background: activeCategory === cat.id ? '#7A1F2B' : 'transparent',
                  color: activeCategory === cat.id ? '#fff' : '#6b7280',
                  boxShadow:
                    activeCategory === cat.id ? '0 4px 12px rgba(122, 31, 43, 0.2)' : 'none',
                }}
              >
                <cat.icon size={14} color={activeCategory === cat.id ? '#fff' : '#9ca3af'} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div
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

      {/* ═══════ PITCH READINESS + MILESTONE UNLOCKS ═══════ */}
      <div
        className="d2col da"
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
        <div className="da da5 dcard" style={{ padding: '1.75rem' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2.5px solid #7A1F2B',
                boxShadow: '0 4px 12px rgba(122, 31, 43, 0.1)',
              }}
            >
              <Icons.user size={32} color="#7A1F2B" />
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
          className="da da5 dcard"
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
      </div>

      {/* ═══════ MY COURSES + RECENT ACTIVITY ═══════ */}
      <div
        className="d2col da"
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
                href="/dashboard/explore"
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
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
        >
          {[
            {
              href: '/dashboard/explore',
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
