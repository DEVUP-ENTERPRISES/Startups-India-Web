'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';
import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardProvider';
import { signOut } from '@/lib/auth';

export default function DashboardHeader({ onOpenMobileMenu }) {
  const router = useRouter();
  const { courses, user } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Global Page Index for Search
  const dashboardPages = [
    { title: 'Dashboard Home', path: '/dashboard', category: 'Module', icon: 'layout' },
    { title: 'Explore Programs', path: '/dashboard/explore-courses', category: 'Module', icon: 'search' },
    { title: 'My Learnings', path: '/dashboard/my-learning', category: 'Module', icon: 'book' },
    { title: 'Assessments & Quizzes', path: '/dashboard/assessment', category: 'Module', icon: 'target' },
    { title: 'Certificates & Awards', path: '/dashboard/achievements/certificates', category: 'Module', icon: 'award' },
    { title: 'Founder Ecosystem', path: '/dashboard/ecosystem', category: 'Module', icon: 'users' },
    { title: 'Profile Settings', path: '/dashboard/settings?tab=profile', category: 'Settings', icon: 'user' },
    { title: 'Security & Password', path: '/dashboard/settings?tab=security', category: 'Settings', icon: 'shield' },
    { title: 'Notification Alerts', path: '/dashboard/settings?tab=notifications', category: 'Settings', icon: 'bell' },
    { title: 'Privacy Policy', path: '/dashboard/settings?tab=privacy', category: 'Settings', icon: 'lock' },
    { title: 'Global Settings', path: '/dashboard/settings', category: 'Settings', icon: 'settings' },
  ];

  // Efficient Global Search Algorithm
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      // 1. Search Pages
      const pageResults = dashboardPages.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );

      // 2. Search Courses
      const courseResults = courses.filter(c => {
        const title = (c.courseTitle || c.title || '').toLowerCase();
        const category = (c.category || '').toLowerCase();
        return title.includes(query) || category.includes(query);
      }).map(c => ({
        title: c.courseTitle || c.title,
        path: `/courses/${c.slug}`,
        category: 'Course',
        thumb: c.thumbnailUrl || c.thumbnail,
        icon: 'play-circle'
      }));

      // 3. Merge and Sort (Pages first, then top courses)
      const combined = [...pageResults, ...courseResults].slice(0, 8);

      setResults(combined);
      setIsDropdownOpen(true);
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery, courses]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/dashboard/explore-courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeName = user?.fullName || user?.full_name || user?.name || 'Student';
  const initials = activeName.charAt(0).toUpperCase();

  return (
    <header className="dashboard-header">
      {/* ── Left Side: Logo ── */}
      <div className="header-left">
        {/* Desktop Search (Hidden on Mobile) */}
        <div className="header-search hide-mobile" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Icon name="search" size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for courses, modules..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
              />
            </div>
          </form>

          {isDropdownOpen && results.length > 0 && (
            <div className="search-dropdown">
              <div className="dropdown-header">Top Results</div>
              {results.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={item.path}
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="item-thumb">
                    {item.thumb ? (
                      <img src={item.thumb} alt="" />
                    ) : (
                      <div className="item-icon-box">
                        <Icon name={item.icon || 'file-text'} size={18} />
                      </div>
                    )}
                  </div>
                  <div className="item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-meta">{item.category}</span>
                  </div>
                  <Icon name="chevron-right" size={14} className="item-arrow" />
                </Link>
              ))}
              <div className="dropdown-footer" onClick={handleSearch}>
                View all results for "{searchQuery}"
              </div>
            </div>
          )}
        </div>

        {/* Mobile Logo (Visible on Mobile) */}
        <div className="mobile-header-logo-wrapper mobile-only">
          <Link href="/dashboard" className="mobile-logo-link">
            <img
              src="/assets/images/logo.png"
              alt="Startups India"
              className="mobile-header-logo"
            />
          </Link>
        </div>
      </div>

      {/* ── Right Side: Actions ── */}
      <div className="header-actions">
        {/* Notifications (Desktop only) */}
        <button className="header-action-btn hide-mobile" title="Notifications">
          <Icon name="bell" size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn mobile-only" onClick={onOpenMobileMenu} title="Open Menu">
          <Icon name="list" size={24} />
        </button>

        {/* Profile Dropdown */}
        <div className="header-profile-container" ref={profileRef}>
          <div 
            className="header-profile-box" 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <div className="user-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" />
              ) : (
                initials
              )}
            </div>
            <div className="user-info hide-mobile">
              <span className="user-name">{activeName}</span>
              <span className="user-role">Founder</span>
            </div>
          </div>

          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="dropdown-user-name">{activeName}</span>
                <span className="dropdown-user-email">{user?.email || 'founder@startupsindia.in'}</span>
              </div>
              <div className="profile-dropdown-divider" />
              <div className="profile-dropdown-links">
                <Link href="/dashboard/settings?tab=profile" className="header-profile-link" onClick={() => setIsProfileDropdownOpen(false)}>
                  <div className="link-content">
                    <Icon name="user" size={18} className="link-icon" />
                    <span>My Profile</span>
                  </div>
                </Link>
                <Link href="/dashboard/settings?tab=account" className="header-profile-link" onClick={() => setIsProfileDropdownOpen(false)}>
                  <div className="link-content">
                    <Icon name="settings" size={18} className="link-icon" />
                    <span>Account Settings</span>
                  </div>
                </Link>
                <Link href="/dashboard/settings?tab=notifications" className="header-profile-link" onClick={() => setIsProfileDropdownOpen(false)}>
                  <div className="link-content">
                    <Icon name="bell" size={18} className="link-icon" />
                    <span>Notifications</span>
                  </div>
                </Link>
                <Link href="/dashboard/settings?tab=privacy" className="header-profile-link" onClick={() => setIsProfileDropdownOpen(false)}>
                  <div className="link-content">
                    <Icon name="lock" size={18} className="link-icon" />
                    <span>Privacy & Security</span>
                  </div>
                </Link>
              </div>
              <div className="profile-dropdown-divider" />
              <button className="profile-logout-btn" onClick={async () => { 
                setIsProfileDropdownOpen(false); 
                await signOut();
                window.location.replace('/login');
              }}>
                <div className="link-content">
                  <Icon name="logout" size={18} />
                  <span>Log Out</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Desktop Defaults */
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 80px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: fixed;
          top: 0;
          left: 260px;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .mobile-only { display: none !important; }
        .header-left { display: flex; align-items: center; gap: 24px; }
        .header-actions { display: flex; align-items: center; gap: 16px; }
        
        .header-search { width: 400px; position: relative; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; }
        .search-input-wrapper :global(.search-icon) { position: absolute; left: 16px; color: #94a3b8; }
        .search-input { width: 100%; height: 44px; padding: 0 16px 0 48px; border: 1.5px solid #f1f5f9; border-radius: 12px; background: #f8fafc; font-size: 0.9rem; outline: none; transition: 0.2s; }
        .search-input:focus { background: #fff; border-color: #7A1F2B; box-shadow: 0 0 0 4px rgba(122, 31, 43, 0.05); }

        .header-action-btn { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; color: #64748b; transition: 0.2s; }
        .header-action-btn:hover { background: #f1f5f9; color: #7A1F2B; }
        .notification-badge { position: absolute; top: -2px; right: -2px; background: #7A1F2B; color: white; font-size: 9px; font-weight: 800; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

        .header-profile-box { display: flex; align-items: center; gap: 14px; padding: 8px 16px; border-radius: 10px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .header-profile-box:hover { background: #f8fafc; border-color: #f1f5f9; }
        .user-avatar { width: 44px; height: 44px; border-radius: 8px; background: #7A1F2B; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; overflow: hidden; }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { display: flex; flex-direction: column; line-height: 1.3; }
        .user-name { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
        .user-role { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; }

        .profile-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 360px; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 15px 50px rgba(0,0,0,0.15); overflow: hidden; z-index: 1000; padding: 12px; }
        .profile-dropdown-header { padding: 16px; background: #fcfcfd; display: flex; flex-direction: column; }
        .dropdown-user-name { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
        .dropdown-user-email { font-size: 0.75rem; color: #94a3b8; }
        .profile-dropdown-links { display: flex; flex-direction: column; gap: 8px; }
        .header-profile-link { display: block; padding: 14px 20px; color: #475569; text-decoration: none; font-size: 1rem; font-weight: 600; transition: 0.2s; border-radius: 8px; }
        .header-profile-link:hover { background: #f8fafc; color: #7A1F2B; }
        .link-content { display: flex; align-items: center; gap: 16px; width: 100%; }
        .profile-logout-btn { width: 100%; display: block; padding: 14px 20px; border: none; background: none; color: #ef4444; font-size: 1rem; font-weight: 600; cursor: pointer; transition: 0.2s; text-align: left; border-radius: 8px; margin-top: 8px; }
        .profile-logout-btn:hover { background: #fef2f2; }

        /* ── MOBILE HEADER OVERRIDE (MAX-WIDTH: 768PX) ── */
        @media (max-width: 768px) {
          .dashboard-header {
            height: 60px;
            padding: 0 16px;
            left: 0 !important;
            background: #fff;
            border-bottom: 1px solid #f1f5f9;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            justify-content: space-between;
          }

          .mobile-only { display: flex !important; }
          .hide-mobile { display: none !important; }

          .header-left { gap: 0; display: flex; align-items: center; }
          .mobile-logo-link { display: flex !important; align-items: center; padding-left: 2px; }
          .mobile-header-logo { 
            height: 38px !important; 
            width: auto !important; 
            max-width: 180px !important;
            object-fit: contain !important;
          }

          .header-actions { 
            gap: 10px !important; 
            flex-direction: row !important;
          }

          .mobile-menu-btn {
            background: none;
            border: none;
            color: #374151;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .header-profile-container {
            position: relative;
          }

          .user-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
          }

          .profile-dropdown {
            position: absolute;
            top: calc(100% + 10px) !important;
            right: 0 !important;
            width: 260px !important;
            background: #fff !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
            z-index: 2000 !important;
            overflow: hidden !important;
            display: flex;
            flex-direction: column;
          }

          .header-profile-link {
            display: block !important;
            padding: 14px 20px !important;
            text-align: left !important;
            width: 100%;
            color: #374151;
            text-decoration: none;
            transition: background 0.2s;
          }
          .header-profile-link:hover { background: #f8fafc; }

          .profile-logout-btn {
            display: block !important;
            width: 100%;
            padding: 14px 20px !important;
            text-align: left !important;
            border: none;
            background: none;
            color: #ef4444;
            font-weight: 600;
            cursor: pointer;
          }
        }

        /* Search Dropdown styles */
        .search-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; max-height: 400px; overflow-y: auto; }
        .dropdown-header { padding: 12px 16px; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; background: #fcfcfd; }
        .dropdown-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; text-decoration: none; border-bottom: 1px solid #f8fafc; }
        .dropdown-item:hover { background: #f8fafc; }
        .item-thumb { width: 36px; height: 36px; border-radius: 8px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .item-info { flex: 1; display: flex; flex-direction: column; }
        .item-title { font-size: 0.85rem; font-weight: 600; color: #1e293b; }
        .item-meta { font-size: 0.7rem; color: #94a3b8; }
        .dropdown-footer { padding: 12px; text-align: center; font-size: 0.8rem; color: #7A1F2B; font-weight: 600; cursor: pointer; }
      `}</style>
    </header>
  );
}
