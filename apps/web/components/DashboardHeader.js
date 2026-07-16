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
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pitch Deck Reviewed', message: 'Your Pitch Deck has been reviewed by Mentor Aditi Patel. Check comments!', time: '10 mins ago', isUnread: true },
    { id: 2, title: 'New Course Available', message: 'A new advanced Android module "Kotlin Flows & State" is now live.', time: '2 hours ago', isUnread: true },
    { id: 3, title: 'Upcoming Live Session', message: 'Cohort VC networking event starts tomorrow at 5:00 PM.', time: '5 hours ago', isUnread: true },
    { id: 4, title: 'Quiz Passed!', message: 'Congratulations on passing the "Market Research Fundamentals" quiz.', time: '1 day ago', isUnread: false },
  ]);

  const unreadCount = notifications.filter(n => n.isUnread).length;
  const filteredNotifications = notifications.filter(n => notifFilter === 'all' || n.isUnread);

  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('learning_streak');
      const s = raw ? JSON.parse(raw) : { current: 0 };
      setStreakCount(s.current || 0);
    } catch (e) {
      setStreakCount(0);
    }
  }, []);

  // Global Page Index for Search
  const dashboardPages = [
    { title: 'Dashboard Home', path: '/dashboard', category: 'Module', icon: 'layout' },
    { title: 'Explore Programs', path: '/dashboard/explore-courses', category: 'Module', icon: 'search' },
    { title: 'My Learnings', path: '/dashboard/my-courses', category: 'Module', icon: 'book' },
    { title: 'Assessments & Quizzes', path: '/dashboard/assessment/quiz', category: 'Module', icon: 'target' },
    { title: 'Certificates & Awards', path: '/dashboard/achievements/certificates', category: 'Module', icon: 'award' },
    { title: 'Founder Ecosystem', path: '/dashboard/community/discussions', category: 'Module', icon: 'users' },
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
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationDropdownOpen(false);
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
                placeholder="Search for courses, modules, members..." 
                className="search-input"
                style={{ paddingRight: '50px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
              />
              <span 
                style={{
                  position: 'absolute',
                  right: 16,
                  fontSize: '9.5px',
                  fontWeight: 800,
                  color: '#94a3b8',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '2.5px 6px',
                  borderRadius: 6,
                  pointerEvents: 'none',
                  letterSpacing: '0.05em'
                }}
              >
                ⌘K
              </span>
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
        {/* Daily Streak Pill */}
        <div 
          className="header-streak-pill" 
          title="Daily Learning Streak"
          style={{ marginRight: 8 }}
        >
          <span className="streak-emoji" style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}><Icon name="fire" size={16} color="#ef4444" fill="#ef4444" /></span>
          <span className="streak-text" style={{ fontSize: '11px', fontWeight: 800 }}>{streakCount || 1} Day Streak</span>
        </div>

        {/* Notifications (Desktop only) */}
        <div className="header-notification-container hide-mobile" ref={notificationRef}>
          <button 
            className="header-action-btn" 
            title="Notifications" 
            style={{ marginRight: 8 }}
            onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
          >
            <Icon name="bell" size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {isNotificationDropdownOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header-notif">
                <span className="dropdown-title-notif">
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{ color: '#ef4444', marginLeft: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                      ({unreadCount})
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button 
                    className="notif-action-btn"
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="notif-tabs">
                <button 
                  className={`notif-tab ${notifFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('all')}
                >
                  All ({notifications.length})
                </button>
                <button 
                  className={`notif-tab ${notifFilter === 'unread' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('unread')}
                >
                  Unread <span style={{ color: '#ef4444', marginLeft: '4px', fontWeight: 800 }}>({unreadCount})</span>
                </button>
              </div>

              <div className="notification-list">
                {filteredNotifications.length === 0 ? (
                  <div className="no-notifications">
                    <Icon name="bell" size={24} color="#94a3b8" />
                    <p style={{ marginTop: '8px' }}>No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.isUnread ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));
                      }}
                    >
                      <div className="notif-dot-wrapper">
                        {notif.isUnread && <span className="notif-dot-red" />}
                      </div>
                      <div className="notif-content-body">
                        <span className="notif-title-text">{notif.title}</span>
                        <p className="notif-msg">{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      <button 
                        className="notif-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications(notifications.filter(n => n.id !== notif.id));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="notification-dropdown-footer">
                <button 
                  className="clear-all-notif-btn"
                  onClick={() => setNotifications([])}
                >
                  Clear All Messages
                </button>
              </div>
            </div>
          )}
        </div>

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
            <div className="user-avatar header-avatar-glow">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" />
              ) : (
                initials
              )}
            </div>
            <div className="user-info hide-mobile">
              <span className="user-name" style={{ fontWeight: 700 }}>{activeName}</span>
              <span className="user-role" style={{ color: user?.role === 'mentor' ? '#10b981' : user?.role === 'admin' ? '#6366f1' : '#E63946', fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>{user?.role === 'mentor' ? 'Mentor' : user?.role === 'admin' ? 'Admin' : 'Founder'}</span>
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
          left: 280px;
          right: 0;
          z-index: 999;
          transition: all 0.3s ease;
        }

        .mobile-only { display: none !important; }
        .header-left { display: flex; align-items: center; gap: 24px; }
        .header-actions { display: flex; align-items: center; gap: 16px; }
        
        .header-search { width: 400px; position: relative; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .search-input-wrapper :global(.search-icon) { position: absolute; left: 16px; color: #94a3b8; transition: color 0.3s ease; pointer-events: none; }
        .search-input-wrapper:focus-within :global(.search-icon) { color: #7A1F2B; }
        .search-input { 
          width: 100%; 
          height: 44px; 
          padding: 0 16px 0 48px; 
          border: 1.5px solid #e2e8f0; 
          border-radius: 12px; 
          background: #f8fafc; 
          font-size: 0.9rem; 
          color: #1e293b;
          outline: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .search-input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
        .search-input:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }
        .search-input:focus { 
          background: #fff; 
          border-color: #7A1F2B; 
          box-shadow: 0 0 0 4px rgba(122, 31, 43, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05); 
        }

        .header-action-btn { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; color: #64748b; transition: 0.2s; }
        .header-action-btn:hover { background: #f1f5f9; color: #7A1F2B; }

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

        /* Notification Dropdown styles */
        .header-notification-container {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        
        .notification-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 380px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 15px 50px rgba(0,0,0,0.15);
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .dropdown-header-notif {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .dropdown-title-notif {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }
        
        .notif-action-btn {
          background: none;
          border: none;
          color: #7A1F2B;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .notif-action-btn:hover {
          background: rgba(122, 31, 43, 0.05);
        }
        
        .notif-tabs {
          display: flex;
          border-bottom: 1px solid #f1f5f9;
          background: #f8fafc;
          padding: 0 12px;
        }
        
        .notif-tab {
          flex: 1;
          background: none;
          border: none;
          padding: 10px 0;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          text-align: center;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .notif-tab.active {
          color: #7A1F2B;
          border-bottom-color: #7A1F2B;
        }
        
        .notification-list {
          max-height: 280px;
          overflow-y: auto;
        }
        
        .no-notifications {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .no-notifications p {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 600;
          margin: 0;
        }
        
        .notification-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          gap: 10px;
          text-align: left;
        }
        
        .notification-item:hover {
          background: #f8fafc;
        }
        
        .notification-item.unread {
          background: rgba(122, 31, 43, 0.02);
        }
        
        .notif-dot-wrapper {
          width: 8px;
          display: flex;
          align-items: flex-start;
          padding-top: 6px;
        }
        
        .notif-dot-red {
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px #ef4444;
        }
        
        .notif-content-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        
        .notif-title-text {
          font-size: 0.85rem;
          font-weight: 750;
          color: #1e293b;
        }
        
        .notif-msg {
          font-size: 0.78rem;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }
        
        .notif-time {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
        }
        
        .notif-delete-btn {
          opacity: 0;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0 4px;
        }
        
        .notification-item:hover .notif-delete-btn {
          opacity: 1;
        }
        
        .notif-delete-btn:hover {
          color: #ef4444;
        }
        
        .notification-dropdown-footer {
          padding: 10px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: center;
        }
        
        .clear-all-notif-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }
        
        .clear-all-notif-btn:hover {
          color: #ef4444;
        }
        
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444 !important;
          color: white;
          font-size: 9px;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </header>
  );
}
