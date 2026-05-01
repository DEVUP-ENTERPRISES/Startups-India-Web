'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';
import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardProvider';

export default function DashboardHeader({ user, onOpenMobileMenu }) {
  const router = useRouter();
  const { courses } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Global Page Index for Search
  const dashboardPages = [
    { title: 'Dashboard Home', path: '/dashboard', category: 'Module', icon: 'layout' },
    { title: 'Explore Programs', path: '/dashboard/explore', category: 'Module', icon: 'search' },
    { title: 'My Learnings', path: '/dashboard/my-learning', category: 'Module', icon: 'book' },
    { title: 'Assessments & Quizzes', path: '/dashboard/assessments', category: 'Module', icon: 'target' },
    { title: 'Certificates & Awards', path: '/dashboard/certificates', category: 'Module', icon: 'award' },
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
      router.push(`/dashboard/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onOpenMobileMenu}>
          <Icon name="layout" size={24} />
        </button>
        <div className="header-search" ref={searchRef}>
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

          {/* Search Results Dropdown */}
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
      </div>

      <div className="header-actions">
        {/* 1. Notification (Visual Left of the group) */}
        <button className="header-action-btn hide-mobile" title="Notifications">
          <Icon name="bell" size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* 2. Profile Box: Icon then Name (Name is rightmost) */}
        <div className="header-profile-container" ref={profileRef}>
          <div 
            className="header-profile-box" 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              padding: '4px 8px 4px 12px',
              borderRadius: '14px'
            }}
          >
            <div className="user-avatar">
              <Icon name="user" size={22} />
            </div>
            <div className="user-info hide-mobile">
              <span className="user-name">{user?.fullName || user?.name || 'Student'}</span>
              <span className="user-role">Founder</span>
            </div>
          </div>

          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="dropdown-user-name">{user?.fullName || user?.name || 'Student'}</span>
                <span className="dropdown-user-email">{user?.email || 'founder@startupsindia.in'}</span>
              </div>
              <div className="profile-dropdown-divider" />
              <div className="profile-dropdown-links">
                <Link href="/dashboard/settings?tab=profile" className="profile-link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <Icon name="user" size={18} />
                  <span>My Profile</span>
                </Link>
                <Link href="/dashboard/settings?tab=account" className="profile-link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <Icon name="settings" size={18} />
                  <span>Account Settings</span>
                </Link>
                <Link href="/dashboard/settings?tab=notifications" className="profile-link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <Icon name="bell" size={18} />
                  <span>Notifications</span>
                </Link>
                <Link href="/dashboard/settings?tab=privacy" className="profile-link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <Icon name="lock" size={18} />
                  <span>Privacy & Security</span>
                </Link>
              </div>
              <div className="profile-dropdown-divider" />
              <button className="profile-logout-btn" onClick={() => { /* Handle logout */ setIsProfileDropdownOpen(false); }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                <Icon name="logout" size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header-left { display: flex; align-items: center; gap: 20px; flex: 1; }
        .mobile-menu-btn { display: none; background: none; border: none; color: #1e293b; cursor: pointer; padding: 8px; border-radius: 10px; }
        .mobile-menu-btn:hover { background: #f1f5f9; }

        .header-search { flex: 1; max-width: 600px; position: relative; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; z-index: 2; }
        .search-input-wrapper :global(.search-icon) { position: absolute; left: 18px; color: #94a3b8; pointer-events: none; }
        .search-input { width: 100%; height: 50px; padding: 0 20px 0 54px; border-radius: 14px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 0.95rem; font-weight: 600; color: #1e293b; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .search-input:focus { outline: none; border-color: #7A1F2B; background: #fff; box-shadow: 0 0 0 4px rgba(122, 31, 43, 0.05), inset 0 2px 4px rgba(0,0,0,0.02); }

        .search-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; z-index: 100; animation: slideDown 0.2s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .dropdown-header { padding: 12px 16px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; background: #fcfcfd; border-bottom: 1px solid #f8fafc; }
        .dropdown-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; text-decoration: none; transition: 0.2s; border-bottom: 1px solid #f8fafc; }
        .dropdown-item:hover { background: #f8fafc; }
        .item-thumb { width: 40px; height: 40px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .item-icon-box { color: #7A1F2B; display: flex; align-items: center; justify-content: center; }
        .item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .item-title { font-size: 0.85rem; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-meta { font-size: 0.7rem; font-weight: 600; color: #94a3b8; }
        .item-arrow { color: #cbd5e1; transition: 0.2s; }
        .dropdown-item:hover .item-arrow { color: #7A1F2B; transform: translateX(2px); }
        .dropdown-footer { padding: 12px; text-align: center; font-size: 0.8rem; font-weight: 700; color: #7A1F2B; cursor: pointer; transition: 0.2s; }
        .dropdown-footer:hover { background: #fef2f2; }

        /* HEADER ACTIONS - CRITICAL LAYOUT */
        .header-actions { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 16px !important; margin-left: auto !important; padding-right: 0 !important; }
        .header-action-btn { width: 44px; height: 44px; border-radius: 12px; border: none; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; position: relative; color: #64748b; flex-shrink: 0; }
        .header-action-btn:hover { color: #7A1F2B; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .notification-badge { position: absolute; top: -2px; right: -2px; background: #7A1F2B; color: white; font-size: 9px; font-weight: 900; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

        .header-profile-container { position: relative; }
        .header-profile-box { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 10px !important; padding: 4px 8px 4px 12px !important; border-radius: 14px; transition: 0.2s; text-decoration: none; border: 1px solid transparent; flex-shrink: 0 !important; }
        .header-profile-box:hover { background: #f8fafc; border-color: #f1f5f9; }
        
        .profile-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 260px; background: #fff; border-radius: 18px; border: 1px solid #f1f5f9; box-shadow: 0 20px 50px rgba(0,0,0,0.12); z-index: 1000; overflow: hidden; animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .profile-dropdown-header { padding: 20px; display: flex; flex-direction: column; background: #fcfcfd; }
        .dropdown-user-name { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .dropdown-user-email { font-size: 0.75rem; font-weight: 600; color: #94a3b8; }
        .profile-dropdown-divider { height: 1px; background: #f1f5f9; }
        .profile-dropdown-links { padding: 8px; display: flex; flex-direction: column; gap: 2px; }
        .profile-link { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; padding: 12px 14px; border-radius: 12px; text-decoration: none; color: #475569; font-size: 0.88rem; font-weight: 600; transition: 0.2s; }
        .profile-link:hover { background: #f8fafc; color: #7A1F2B; }
        .profile-link :global(svg) { color: #94a3b8; transition: 0.2s; flex-shrink: 0; }
        .profile-link:hover :global(svg) { color: #7A1F2B; }
        .profile-logout-btn { width: 100%; display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; padding: 14px 22px; border: none; background: none; color: #ef4444; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: 0.2s; text-align: left; }
        .profile-logout-btn:hover { background: #fef2f2; }
        
        .user-info { display: flex !important; flex-direction: column !important; align-items: flex-start !important; justify-content: center !important; line-height: 1.2 !important; min-width: 0 !important; }
        .user-name { font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-bottom: 1px; white-space: nowrap; }
        .user-role { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .user-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #7A1F2B, #ef4444); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 1.05rem; box-shadow: 0 4px 12px rgba(122, 31, 43, 0.2); flex-shrink: 0 !important; }
        .header-profile-box:hover .user-avatar { transform: scale(1.04); }

        @media (max-width: 1060px) {
          .mobile-menu-btn { display: flex; }
          .hide-mobile { display: none !important; }
          .header-left { gap: 12px; }
          .header-search { max-width: 260px; }
          .search-input { height: 42px; font-size: 0.85rem; padding: 0 12px 0 42px; }
          .search-input-wrapper :global(.search-icon) { left: 14px; }
          .user-avatar { width: 40px; height: 40px; font-size: 1rem; }
        }

        @media (max-width: 640px) {
          .header-left { gap: 10px; }
          .header-search { max-width: 180px; }
          .search-input { height: 38px; font-size: 0.8rem; padding: 0 8px 0 36px; border-radius: 10px; }
          .search-input-wrapper :global(.search-icon) { left: 10px; }
          .header-actions { gap: 8px !important; }
          .header-profile-box { padding: 4px !important; gap: 6px !important; }
          .profile-dropdown { width: min(260px, calc(100vw - 16px)); right: 0; }
        }

        @media (max-width: 480px) {
          .header-left { gap: 8px; }
          .header-search { max-width: 140px; }
          .search-input { height: 36px; font-size: 0.75rem; border-radius: 8px; }
          .user-avatar { width: 36px; height: 36px; border-radius: 10px; font-size: 0.9rem; }
          .profile-dropdown { right: -8px; }
        }

        @media (max-width: 360px) {
          .header-search { max-width: 110px; }
          .search-input { padding: 0 6px 0 32px; }
        }
      `}</style>
    </header>
  );
}
