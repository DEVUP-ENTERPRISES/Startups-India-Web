'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '../../styles/admin-panel.css';

const navSections = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: 'grid' },
      { id: 'monitoring', label: 'Monitoring', href: '/admin/monitoring', icon: 'activity' },
    ],
  },
  {
    title: 'Management',
    items: [
      { id: 'users', label: 'Users', href: '/admin/users', icon: 'users' },
      { id: 'courses', label: 'Courses', href: '/admin/courses', icon: 'book' },
      { id: 'enrollments', label: 'Enrollments', href: '/admin/enrollments', icon: 'clipboard' },
      { id: 'payments', label: 'Payments', href: '/admin/payments', icon: 'credit-card' },
      { id: 'certificates', label: 'Certificates', href: '/admin/certificates', icon: 'award' },
    ],
  },
  {
    title: 'Content',
    items: [
      { id: 'articles', label: 'Sources / Articles', href: '/admin/articles', icon: 'edit' },
      { id: 'events', label: 'Events', href: '/admin/events', icon: 'calendar' },
      { id: 'testimonials', label: 'Testimonials', href: '/admin/testimonials', icon: 'star' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'leads', label: 'Leads / CRM', href: '/admin/leads', icon: 'target' },
      { id: 'notifications', label: 'Notifications', href: '/admin/notifications', icon: 'bell' },
      { id: 'settings', label: 'Settings', href: '/admin/settings', icon: 'settings' },
    ],
  },
];

function NavIcon({ name, size = 18 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const icons = {
    grid: (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    users: (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    book: (
      <svg {...props}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    clipboard: (
      <svg {...props}>
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    'credit-card': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    award: (
      <svg {...props}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    edit: (
      <svg {...props}>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    calendar: (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    star: (
      <svg {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    target: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    bell: (
      <svg {...props}>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    settings: (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    chevron: (
      <svg {...props}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    'chevron-right': (
      <svg {...props}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    'log-out': (
      <svg {...props}>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    search: (
      <svg {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    activity: (
      <svg {...props}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      setIsAdmin(true);
      return;
    }

    async function verifySession() {
      const token = localStorage.getItem('access_token');
      const adminFlag = localStorage.getItem('admin_session');
      const expiry = Number(localStorage.getItem('admin_session_expiry') || '0');

      // 24hr session expired — force re-login
      if (!adminFlag || (expiry > 0 && Date.now() > expiry)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_session_expiry');
        localStorage.removeItem('refresh_token');
        router.replace('/admin/login');
        setChecking(false);
        return;
      }

      // Try refreshing access token if missing or expired
      if (!token) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const API_BASE =
              process.env.NEXT_PUBLIC_API_BASE_URL ||
              process.env.NEXT_PUBLIC_API_URL ||
              'http://localhost:5000';
            const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
              credentials: 'include',
            });
            const json = await res.json();
            if (res.ok && json.data?.session?.access_token) {
              localStorage.setItem('access_token', json.data.session.access_token);
              if (json.data.session.refresh_token) {
                localStorage.setItem('refresh_token', json.data.session.refresh_token);
              }
              setIsAdmin(true);
              setChecking(false);
              return;
            }
          } catch {
            /* fall through to redirect */
          }
        }
        router.replace('/admin/login');
        setChecking(false);
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    }

    verifySession();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAdmin) return null;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_session_expiry');
    localStorage.removeItem('refresh_token');
    router.push('/admin/login');
  };

  const activeId =
    navSections.flatMap(s => s.items).find(i => pathname.startsWith(i.href))?.id || 'dashboard';

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 15h6" />
            </svg>
          </div>
          <div>
            <div className="sidebar-brand-text">StartupIndia</div>
            <div className="sidebar-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map(section => (
            <div key={section.title}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => router.push(item.href)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">
                    <NavIcon name={item.icon} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-item"
            onClick={() => setShowLogoutModal(true)}
            style={{ color: '#f87171' }}
          >
            <span className="nav-icon">
              <NavIcon name="log-out" />
            </span>
            <span className="nav-label">Logout</span>
          </button>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            <NavIcon name={collapsed ? 'chevron-right' : 'chevron'} />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: '#1e1e2e',
              borderRadius: 16,
              padding: '36px 32px 28px',
              width: 380,
              maxWidth: '90vw',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.08)',
              animation: 'adminLogoutIn 0.25s ease-out',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(239,68,68,0.2))',
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
                stroke="#f87171"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
              Sign Out of Admin?
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>
              Are you sure you want to sign out? Your admin session will be ended.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
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
            @keyframes adminLogoutIn {
              from { opacity: 0; transform: scale(0.9) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `,
            }}
          />
        </div>
      )}

      <main
        className="admin-main"
        style={{
          marginLeft: collapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-width)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
