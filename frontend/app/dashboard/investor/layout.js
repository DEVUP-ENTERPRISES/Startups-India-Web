'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/investor-dashboard.css';
import {
  LayoutDashboard, Briefcase, TrendingUp, Users, Calendar, FileText,
  PieChart, User, HelpCircle, Lock, LogOut, Bell, Search, CheckCircle2
} from 'lucide-react';
import { getInvestorProfile } from '@/lib/investors';
import { signOut } from '@/lib/auth';

export default function InvestorLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [toasts, setToasts] = useState([]);
  const [profileData, setProfileData] = useState({
    fullName: 'Investor',
    profileImage: null,
  });

  const LOCKED_TABS = ['deal-flow', 'portfolio', 'meetings', 'diligence', 'analytics'];

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleTabClick = (tabId, isLocked, isLink, path) => {
    if (isLocked) {
      addToast('This section is coming soon for Investors.', 'warning');
      return;
    }
    if (isLink) {
      router.push(path);
    } else {
      router.push(`/dashboard/investor?tab=${tabId}`);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const { data } = await getInvestorProfile();
        if (data && isMounted) {
          setProfileData({
            fullName: data.fullName || 'Investor',
            profileImage: data.profileImage || null,
          });
        }
      } catch (err) {
        console.error('Failed to load profile in layout:', err);
      }
    }
    loadProfile();
    return () => { isMounted = false; };
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isProfileActive = pathname === '/dashboard/investor/profile';
  
  const [activeTab, setActiveTab] = useState('dashboard');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') || 'dashboard');
    }
  }, [pathname]);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, locked: false, isLink: true, path: '/dashboard/investor' },
    { id: 'deal-flow', label: 'Deal Flow & Pitches', icon: Briefcase, locked: true },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp, locked: true },
    { id: 'meetings', label: 'Pitch Calls', icon: Calendar, locked: true },
    { id: 'diligence', label: 'Diligence Notes', icon: FileText, locked: true },
    { id: 'analytics', label: 'Fund Analytics', icon: PieChart, locked: true },
  ];

  const secondaryNavItems = [
    { id: 'profile-link', label: 'My Profile', icon: User, locked: false, isLink: true, path: '/dashboard/investor/profile' },
    { id: 'support', label: 'Help & Support', icon: HelpCircle, locked: false, isLink: true, path: '/dashboard/investor?tab=support' },
  ];

  return (
    <div className="investor-dashboard-root">
      {/* Toast Notifications */}
      <div className="investor-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`investor-toast ${t.type}`}>
            {t.type === 'warning' && <Lock size={15} style={{ flexShrink: 0 }} />}
            {t.type === 'success' && <CheckCircle2 size={15} style={{ flexShrink: 0 }} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── LEFT DEDICATED DARK BURGUNDY SIDEBAR ──────────────────────── */}
      <aside className="investor-sidebar">
        <div>
          <div className="investor-sidebar-brand">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/assets/images/Startupsina logo wight.png"
                alt="Startups India"
                width={160}
                height={45}
                priority
                style={{ width: 'auto', height: '36px', objectFit: 'contain' }}
              />
            </Link>
          </div>

          <div className="investor-nav-section-label">INVESTOR WORKSPACE</div>

          <nav className="investor-nav-group">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = !isProfileActive && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id, item.locked, item.isLink, item.path)}
                  className={`investor-nav-btn ${isActive ? 'active' : ''} ${item.locked ? 'locked' : ''}`}
                >
                  <IconComp size={18} color={isActive ? '#ffffff' : '#d1d5db'} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.locked && (
                    <span className="investor-lock-badge">
                      <Lock size={12} color="#fef08a" />
                      <span>SOON</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="investor-nav-section-label">ACCOUNT</div>

          <nav className="investor-nav-group">
            {secondaryNavItems.map((item) => {
              const IconComp = item.icon;
              const isActive = (item.id === 'profile-link' && isProfileActive) || (item.id === 'support' && !isProfileActive && activeTab === 'support');

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id, item.locked, item.isLink, item.path)}
                  className={`investor-nav-btn ${isActive ? 'active' : ''}`}
                >
                  <IconComp size={18} color={isActive ? '#ffffff' : '#d1d5db'} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="investor-sidebar-footer">
          <div className="investor-avatar-small">
            {profileData.profileImage ? (
              <img src={profileData.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (profileData.fullName || 'I').charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="investor-chip-name">{profileData.fullName}</div>
            <div className="investor-chip-role">Investor</div>
          </div>
          <button onClick={handleLogout} className="investor-logout-btn" title="Log out">
            <LogOut size={16} color="#ffffff" />
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="investor-main-content">
        <header className="investor-header">
          <div>
            <h1 className="investor-header-title">
              {isProfileActive ? 'My Profile' : activeTab === 'dashboard' ? 'Investor Overview' : 'Help & Support'}
            </h1>
            <p className="investor-header-subtitle">
              {isProfileActive ? 'Manage your public credentials, bio and preferences.' : activeTab === 'dashboard' ? 'Manage deals, track portfolio performance and venture metrics.' : 'Direct inquiry desk to Startup India ecosystem admins.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="investor-search-wrapper">
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Search startups, deals..." className="investor-search-input" />
            </div>

            <button className="investor-header-icon-btn" title="Notifications">
              <Bell size={18} color="#64748b" />
            </button>

            <Link href="/dashboard/investor/profile" style={{ textDecoration: 'none' }}>
              <div className="investor-header-user-chip">
                <div className="investor-avatar-header">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (profileData.fullName || 'I').charAt(0).toUpperCase()
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{profileData.fullName}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>Investor</span>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
