'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from '@/lib/auth';

export default function DashboardSidebar({
  user,
  isPro = false,
  isOpen = false,
  onClose = () => {},
}) {
  const pathname = usePathname();
  const [openSectionId, setOpenSectionId] = useState('courses');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigation = [
    {
      id: 'main',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      items: [],
    },
    {
      id: 'courses',
      label: 'Courses',
      isDropdown: true,
      icon: 'courses',
      items: [
        { id: 'explore', label: 'Explore Courses', path: '/dashboard/explore', icon: 'explore' },
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
      icon: 'explore',
      items: [
        {
          id: 'continue',
          label: 'Continue Learning',
          path: '/dashboard/learning/continue',
          icon: 'dashboard',
        },
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
      icon: 'award',
      items: [
        {
          id: 'quizzes',
          label: 'Quizzes',
          path: '/dashboard/assessments/quizzes',
          icon: 'explore',
        },
        {
          id: 'assignments',
          label: 'Assignments',
          path: '/dashboard/assessments/assignments',
          icon: 'courses',
        },
        { id: 'exams', label: 'Exams', path: '/dashboard/assessments/exams', icon: 'award' },
        { id: 'results', label: 'Results', path: '/dashboard/assessments/results', icon: 'streak' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      isDropdown: true,
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

  const isActive = path => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(path + '/');
  };

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
      <aside className={`premium-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Logo and Branding */}
        <div className="sidebar-header">
          <div className="sidebar-header-flex">
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
                      className={`nav-section-header-btn ${isCollapsible ? 'collapsible' : ''}`}
                      onClick={() => {
                        if (isCollapsible || isDropdown) {
                          setOpenSectionId(isSectionOpen ? null : section.id);
                        }
                      }}
                      style={headerStyle}
                    >
                      {headerContent}
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
                      {isDropdown && renderIcon('chevron', isSectionOpen)}
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
                  {section.items.map(item =>
                    item.isAction ? (
                      <button
                        key={item.id}
                        className="nav-item action-button-nav"
                        onClick={() => {
                          if (item.id === 'logout') {
                            onClose();
                            setShowLogoutModal(true);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: 'calc(100% - 24px)',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                        }}
                      >
                        <span className="nav-item-label">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        prefetch={true}
                        onClick={onClose}
                      >
                        <span className="nav-item-label">{item.label}</span>
                        {item.badge}
                      </Link>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="bottom-actions">

            <button
              className="bottom-action"
              onClick={() => {
                onClose();
                setShowLogoutModal(true);
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>

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

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: '36px 32px 28px',
                width: 380,
                maxWidth: '90vw',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                position: 'relative',
                animation: 'logoutModalIn 0.25s ease-out',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#111' }}>
                Sign Out?
              </h3>
              <p style={{ margin: '0 0 28px', fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                Are you sure you want to sign out? You will need to log in again to access your
                dashboard.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: 10,
                    border: '1.5px solid #e5e7eb',
                    background: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.replace('/login');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #7A1F2B, #9B3040)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(122,31,43,0.3)',
                  }}
                  onMouseEnter={e => (e.target.style.opacity = '0.9')}
                  onMouseLeave={e => (e.target.style.opacity = '1')}
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
            @keyframes logoutModalIn {
              from { opacity: 0; transform: scale(0.9) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `,
              }}
            />
          </div>
        )}
      </aside>
    </>
  );
}
