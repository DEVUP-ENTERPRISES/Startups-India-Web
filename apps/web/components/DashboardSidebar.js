'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from '@/lib/auth';
import Icon from '@/components/Icon';
import { getGrantConfig, listMyApplications } from '@/lib/grants';

export default function DashboardSidebar({
  user,
  isPro = false,
  isOpen = false,
  onClose = () => {},
}) {
  const pathname = usePathname();
  const [openSectionId, setOpenSectionId] = useState(null);

  const mentorNavigation = [
    {
      id: 'mentor-home',
      label: 'Dashboard',
      path: '/dashboard/mentor',
      icon: 'dashboard',
      items: [],
    },
    {
      id: 'mentor-mentees',
      label: 'My Mentees',
      path: '/dashboard/mentor/mentees',
      icon: 'profile',
      items: [],
    },
    {
      id: 'mentor-profile',
      label: 'My Profile',
      path: '/dashboard/mentor/profile',
      icon: 'settings',
      items: [],
    },
    // 'Sessions' and 'Availability' are intentionally absent: there is no session
    // model or endpoint behind them, and availability is a single field edited on
    // the profile page. Linking to pages that 404 is worse than not linking.
  ];

  const investorNavigation = [
    { id: 'investor-home', label: 'Dashboard', path: '/dashboard/investor', icon: 'dashboard', items: [] },
    { id: 'investor-profile', label: 'My Profile', path: '/dashboard/investor/profile', icon: 'settings', items: [] },
  ];

  // The grant menu title is set by the admin (grant.ui.sidebarLabel). Held in
  // state rather than imported as a constant so renaming it in Admin Settings
  // takes effect without a redeploy.
  const [grantLabel, setGrantLabel] = useState('Apply for Startup Funding');

  useEffect(() => {
    let cancelled = false;
    getGrantConfig()
      .then(({ data }) => {
        if (!cancelled && data?.sidebarLabel) setGrantLabel(data.sidebarLabel);
      })
      .catch(() => {}); // keep the default label if config is unreachable
    return () => {
      cancelled = true;
    };
  }, []);

  // The founder's furthest phase in the grant journey (0-based), used to unlock
  // sidebar phases: Idea Evaluation opens only once an idea is accepted (phase 1).
  // Comes straight from the backend (currentPhase) — no phase logic is duplicated
  // here. Students only; mentors/investors don't have a grant journey.
  const [grantPhase, setGrantPhase] = useState(0);
  useEffect(() => {
    if (user?.role === 'mentor' || user?.role === 'investor') return;
    let cancelled = false;
    listMyApplications()
      .then(({ data }) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setGrantPhase(Math.max(...data.map(a => a.currentPhase ?? 0)));
      })
      .catch(() => {}); // no application yet → everything past phase 1 stays locked
    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  const studentNavigation = [
    {
      id: 'main',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      items: [],
    },
    // Sits directly under Dashboard: it's the primary journey, not a footnote.
    {
      id: 'grants',
      // Label is admin-configurable (grant.ui.sidebarLabel). grantLabel falls back
      // to the default until the config request resolves, so the item never
      // flashes as blank.
      label: grantLabel,
      isDropdown: true,
      icon: 'award',
      items: [
        { id: 'grant-apply', label: 'Apply for Funding', path: '/dashboard/grants', icon: 'explore' },
        {
          id: 'grant-applications',
          label: 'My Applications',
          path: '/dashboard/grants/applications',
          icon: 'courses',
        },
      ],
    },
    {
      id: 'courses',
      label: 'Courses',
      isDropdown: true,
      isLocked: true,
      icon: 'courses',
      items: [
        { id: 'explore', label: 'Explore Courses', path: '/dashboard/explore-courses', icon: 'explore' },
        {
          id: 'enrolled',
          label: 'Enrolled Courses',
          path: '/dashboard/my-courses',
          icon: 'courses',
        },
        { id: 'wishlist', label: 'Wishlist', path: '/dashboard/wishlist', icon: 'wishlist' },
        {
          id: 'completed',
          label: 'Completed Courses',
          path: '/dashboard/completed',
          icon: 'completed',
        },
      ],
    },
    {
      id: 'learning-experience',
      label: 'Learning Experience',
      isDropdown: true,
      isLocked: true,
      icon: 'explore',
      items: [
        { id: 'live', label: 'Live Classes', path: '/dashboard/learning/live', icon: 'explore' },
        {
          id: 'recorded',
          label: 'Recorded Classes',
          path: '/dashboard/learning/recorded',
          icon: 'courses',
        },
        {
          id: 'notes',
          label: 'Notes / Bookmarks',
          path: '/dashboard/learning/notes',
          icon: 'wishlist',
        },
      ],
    },
    {
      id: 'assessments',
      label: 'Assessments',
      isDropdown: true,
      isLocked: true,
      icon: 'results',
      items: [
        { id: 'quiz', label: 'Quizzes', path: '/dashboard/assessment/quiz' },
        { id: 'assignment', label: 'Assignments', path: '/dashboard/assessment/assignments' },
        { id: 'exam', label: 'Exams', path: '/dashboard/assessment/exam' },
        { id: 'results', label: 'Results', path: '/dashboard/assessment/results' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      isDropdown: true,
      isLocked: true,
      icon: 'stats',
      items: [
        {
          id: 'progress-overview',
          label: 'Progress Overview',
          path: '/dashboard/analytics/progress',
          icon: 'dashboard',
        },
        {
          id: 'performance',
          label: 'Performance Analytics',
          path: '/dashboard/analytics/performance',
          icon: 'results',
        },
        {
          id: 'learning-time',
          label: 'Learning Time',
          path: '/dashboard/analytics/learning-time',
          icon: 'calendar',
        },
        {
          id: 'skill-graph',
          label: 'Skill Graph',
          path: '/dashboard/analytics/skills',
          icon: 'tracking',
        },
      ],
    },
    {
      id: 'achievements',
      label: 'Achievements',
      isDropdown: true,
      isLocked: true,
      icon: 'streak',
      items: [
        {
          id: 'certificates',
          label: 'Certificates',
          path: '/dashboard/achievements/certificates',
          icon: 'award',
        },
        { id: 'badges', label: 'Badges', path: '/dashboard/achievements/badges', icon: 'streak' },
        {
          id: 'leaderboard',
          label: 'Leaderboard',
          path: '/dashboard/achievements/leaderboard',
          icon: 'stats',
        },
      ],
    },
    {
      id: 'community',
      label: 'Community',
      isDropdown: true,
      // Unlocked: the community pages (discussions, groups, doubts) are built
      // and reachable on this branch, so gating them behind a lock hid working
      // features. The remaining locks are for sections that aren't ready yet.
      icon: 'profile',
      items: [
        {
          id: 'discussions',
          label: 'Discussions',
          path: '/dashboard/community/discussions',
          icon: 'explore',
        },
        { id: 'groups', label: 'Groups', path: '/dashboard/community/groups', icon: 'courses' },
        {
          id: 'doubts',
          label: 'Doubts / Q&A',
          path: '/dashboard/community/doubts',
          icon: 'wishlist',
        },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      isDropdown: true,
      isLocked: true,
      icon: 'tracking',
      items: [
        {
          id: 'purchases',
          label: 'My Purchases',
          path: '/dashboard/payments/purchases',
          icon: 'courses',
        },
        {
          id: 'billing',
          label: 'Billing History',
          path: '/dashboard/payments/billing',
          icon: 'stats',
        },
        {
          id: 'subscriptions',
          label: 'Subscriptions',
          path: '/dashboard/payments/subscriptions',
          icon: 'award',
        },
      ],
    },
  ];

  const navigation =
    user?.role === 'mentor' ? mentorNavigation
      : user?.role === 'investor' ? investorNavigation
        : user?.role === 'startup'
          ? studentNavigation.filter(item => !item.isLocked)
          : studentNavigation;

  const isActive = path => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(path + '/');
  };

  useEffect(() => {
    const activeSection = navigation.find(section =>
      section.isDropdown &&
      Array.isArray(section.items) &&
      section.items.some(item => pathname === item.path || pathname.startsWith(item.path + '/'))
    );

    if (activeSection) {
      setOpenSectionId(activeSection.id);
      return;
    }

    if (pathname === '/dashboard') {
      setOpenSectionId(null);
    }
  }, [pathname]);

  const renderIcon = (icon, size = 18, isOpen = false) => {
    const icons = {
      home: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      dashboard: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      courses: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      certificates: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      explore: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      profile: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      wishlist: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      completed: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      settings: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      logout: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
      contact: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      chevron: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      ),
      award: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      streak: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      stats: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      calendar: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      tracking: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      results: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1050,
          display: isOpen ? 'block' : 'none',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />
      <aside className={`premium-sidebar light-theme ${isOpen ? 'mobile-open' : ''}`}>
        {/* Logo and Branding */}
        <div className="sidebar-header">
          <div className="sidebar-header-flex">
            <Link href="/" className="sidebar-home-btn" title="Back to Home" onClick={onClose}>
              {renderIcon('home', 20)}
            </Link>

            <Link href="/dashboard" className="sidebar-logo" onClick={onClose}>
              <img
                src="/assets/images/logo-new.png"
                alt="Startups India Logo"
                className="sidebar-logo-img"
              />
            </Link>
            
            {/* Mobile Close Button */}
            <button className="sidebar-close-btn mobile-only" onClick={onClose}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map(section => {
            const isCollapsible = section.isCollapsible;
            const isDropdown = section.isDropdown;
            const isSectionLink = section.path;
            const isSectionOpen = openSectionId === section.id;

            const headerContent = (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {section.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {renderIcon(section.icon, 20)}
                  </span>
                )}
                <div style={{ padding: 0 }}>{section.label}</div>
              </div>
            );

            const headerStyle = {
              background: isSectionLink && isActive(section.path) ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            };

            return (
              <div key={section.id} className="nav-section">
                {section.label && (
                  isSectionLink ? (
                    <Link
                      href={section.path}
                      className={`nav-section-header-btn ${isActive(section.path) ? 'active' : ''}`}
                      style={headerStyle}
                      onClick={(e) => {
                        onClose();
                        setOpenSectionId(section.id);
                      }}
                    >
                      {headerContent}
                    </Link>
                  ) : (
                    <div
                      className={`nav-section-header-btn ${isCollapsible ? 'collapsible' : ''} ${section.isLocked ? 'locked' : ''}`}
                      onClick={(e) => {
                        if (section.isLocked) {
                          e.preventDefault();
                          return;
                        }
                        if (isCollapsible || isDropdown) {
                          setOpenSectionId(isSectionOpen ? null : section.id);
                        }
                      }}
                      style={{
                        ...headerStyle,
                        cursor: section.isLocked ? 'not-allowed' : 'pointer',
                        opacity: section.isLocked ? 0.6 : 1
                      }}
                    >
                      {headerContent}
                      
                      {section.isLocked ? (
                        <span className="lock-icon" style={{ marginLeft: 'auto', display: 'flex', opacity: 0.5 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      ) : (
                        <>
                          {isCollapsible && (
                            <span className={`chevron-icon ${isSectionOpen ? 'expanded' : ''}`}>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </span>
                          )}
                          {isDropdown && renderIcon('chevron', 16, isSectionOpen)}
                        </>
                      )}
                    </div>
                  )
                )}

                <div
                  className={`nav-items ${!isSectionOpen ? 'collapsed' : ''}`}
                  style={
                    isDropdown
                      ? {
                          overflow: 'hidden',
                          maxHeight: isSectionOpen ? 500 : 0,
                          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }
                      : undefined
                  }
                >
                  {section.items.map(item => {
                    // A thin labelled separator ("The Journey") between the working
                    // links and the phase roadmap.
                    if (item.isDivider) {
                      return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px 4px', fontSize: '10px', fontWeight: 700,
                            letterSpacing: '1.2px', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                          }}
                        >
                          <span>{item.label}</span>
                          <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                        </div>
                      );
                    }

                    // Phase-node styling driven by the founder's real state:
                    //  done      → cleared (green check)
                    //  unlocked  → just opened for them (accent glow) — phase 2
                    //  open      → available now (plain numbered)
                    //  locked    → greyed lock (Coming Soon)
                    //  locked+highlight → the Funding goal, shown in gold
                    const st = item.state;
                    const isLockedRow = st === 'locked';
                    const gold = isLockedRow && item.highlight;

                    const tone = st === 'done'
                      ? { border: '#34d399', color: '#34d399', bg: 'rgba(52,211,153,0.15)' }
                      : st === 'unlocked'
                        ? { border: '#ff6b6b', color: '#fff', bg: 'rgba(230,57,70,0.35)' }
                        : gold
                          ? { border: '#fbbf24', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }
                          : isLockedRow
                            ? { border: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.4)', bg: 'transparent' }
                            : { border: 'rgba(255,255,255,0.55)', color: '#fff', bg: 'transparent' };

                    const bullet = item.phaseNum != null && (
                      <span
                        style={{
                          width: '20px', height: '20px', flexShrink: 0, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 800,
                          border: `1.5px solid ${tone.border}`, color: tone.color, background: tone.bg,
                        }}
                      >
                        {st === 'done'
                          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : item.phaseNum}
                      </span>
                    );

                    if (isLockedRow) {
                      return (
                        <div
                          key={item.id}
                          className="nav-item"
                          style={{
                            cursor: 'not-allowed',
                            opacity: gold ? 0.95 : 0.5,
                            ...(gold ? {
                              background: 'linear-gradient(90deg,rgba(251,191,36,0.16),rgba(251,191,36,0.02))',
                              border: '1px solid rgba(251,191,36,0.4)',
                              borderRadius: '12px',
                            } : {}),
                          }}
                          title={gold ? 'The goal — funding by top VCs & angels' : 'Coming soon'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {bullet || (item.icon && renderIcon(item.icon, 16))}
                            <span className="nav-item-label" style={gold ? { color: '#fbbf24', fontWeight: 700 } : undefined}>
                              {item.label}
                            </span>
                          </div>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gold ? '#fbbf24' : 'currentColor'} strokeWidth="2" style={{ marginLeft: 'auto', opacity: gold ? 1 : 0.7 }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      );
                    }

                    const justUnlocked = st === 'unlocked';
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        prefetch={true}
                        onClick={() => {
                          setOpenSectionId(section.id);
                          onClose();
                        }}
                        style={justUnlocked ? {
                          background: 'linear-gradient(90deg,rgba(230,57,70,0.3),rgba(230,57,70,0.05))',
                          border: '1px solid rgba(255,107,107,0.5)',
                          borderRadius: '12px',
                          boxShadow: '0 4px 16px rgba(230,57,70,0.28)',
                        } : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {bullet || (item.icon && renderIcon(item.icon, 16))}
                          <span className="nav-item-label" style={justUnlocked ? { fontWeight: 700 } : undefined}>
                            {item.label}
                          </span>
                        </div>
                        {justUnlocked ? (
                          <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#fff', background: '#e63946', borderRadius: '100px', padding: '2px 7px' }}>
                            Open
                          </span>
                        ) : item.badge}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Level Up Progress Card */}
        {user?.role !== 'mentor' && user?.role !== 'investor' && (
          <div className="sidebar-level-card">
            <div className="level-card-header">
              <span className="level-rocket" style={{ display: 'flex', alignItems: 'center' }}><Icon name="rocket" size={18} color="#fff" /></span>
              <div className="level-info">
                <span className="level-card-title">Level up your community journey!</span>
                <span className="level-card-sub">You're on Level 3</span>
              </div>
            </div>
            <div className="level-progress-bar-container">
              <div className="level-progress-bar" style={{ width: '62.5%' }}></div>
            </div>
            <div className="level-card-footer">
              <span className="level-xp">750 / 1200 XP</span>
              <Link href="/dashboard/achievements" className="level-btn" onClick={onClose}>
                View My Progress
              </Link>
            </div>
          </div>
        )}

        <div className="sidebar-bottom">
          <div className="bottom-actions">

            <Link href="/dashboard/contact" className="bottom-action" onClick={onClose}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
}
