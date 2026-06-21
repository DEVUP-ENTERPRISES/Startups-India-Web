'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, Home, Info, LayoutGrid, Calendar, Users, Coins, Rocket, ChevronDown, BookOpen, TrendingUp, Zap, GraduationCap, ArrowRight, Globe } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

const SEARCH_DATA = [
  { title: 'Pre-Incubation Program', desc: '8-week intensive startup validation program', href: '/programs/pre-incubation', category: 'Programs', color: '#e63946' },
  { title: 'Incubation Program', desc: 'Full incubation support for early-stage startups', href: '/programs/incubation', category: 'Programs', color: '#e63946' },
  { title: 'Master Classes', desc: 'Elite cinematic learning experience', href: '/programs/master-classes', category: 'Programs', color: '#e63946' },
  { title: 'Growth Programs', desc: 'Scale your startup to the next level', href: '/programs/growth', category: 'Programs', color: '#e63946' },
  { title: 'About Us', desc: 'Our story, mission and vision', href: '/about', category: 'Company', color: '#7c3aed' },
  { title: 'Our Team', desc: 'Meet the leaders behind StartupsIndia', href: '/team', category: 'Company', color: '#7c3aed' },
  { title: 'Mentors', desc: 'Connect with 50+ industry expert mentors', href: '/mentors', category: 'Network', color: '#0ea5e9' },
  { title: 'Investors', desc: 'Investor network and funding access', href: '/investors', category: 'Network', color: '#0ea5e9' },
  { title: 'Events', desc: 'Upcoming startup events and workshops', href: '/events', category: 'Community', color: '#10b981' },
  { title: 'Campus Startup Mission', desc: 'Innovation Mission 2026 — colleges, hackathons & funding', href: '/campus-startup', category: 'Programs', color: '#e63946' },
  { title: 'Market Access', desc: 'Expand your startup to new markets', href: '/market-access', category: 'Resources', color: '#f59e0b' },
  { title: 'Source Hub', desc: 'Resources, guides and templates', href: '/source', category: 'Resources', color: '#f59e0b' },
  { title: 'Sign Up', desc: 'Join the StartupsIndia ecosystem', href: '/signup', category: 'Account', color: '#6366f1' },
  { title: 'Login', desc: 'Access your dashboard', href: '/login', category: 'Account', color: '#6366f1' },
];

const QUICK_LINKS = [
  { title: 'Pre-Incubation', href: '/programs/pre-incubation', color: '#e63946' },
  { title: 'Mentors', href: '/mentors', color: '#0ea5e9' },
  { title: 'Investors', href: '/investors', color: '#10b981' },
  { title: 'Events', href: '/events', color: '#f59e0b' },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // 🧱 TRACK ACTIVE SECTION FOR DROPDOWN HIGHLIGHT
  useEffect(() => {
    if (pathname !== '/about') {
      setCurrentHash('');
      return;
    }

    const sections = ['about-company', 'vision-mission', 'team-profiles'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const newHash = `#${entry.target.id}`;
          setCurrentHash(newHash);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Update hash state when window hash changes
  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = SEARCH_DATA.filter(
      item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Keyboard navigation inside search results
  const handleSearchKeyDown = (e) => {
    const list = searchQuery ? searchResults : QUICK_LINKS;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const item = list[selectedIndex];
      if (item?.href) {
        router.push(item.href);
        setSearchFocused(false);
        setSearchQuery('');
      }
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { 
      label: 'About Us', 
      href: '/about', 
      icon: Info,
      dropdown: [
        {
          label: 'About the Company',
          href: '/about',
          description: 'Learn about the StartupsIndia ecosystem and mission',
        },
        {
          label: 'Vision & Mission',
          href: '/about#vision-mission',
          description: 'Driving innovation and empowering founders nationwide',
        },
        {
          label: 'Team Profiles',
          href: '/about#team-profiles',
          description: 'Meet the leadership, advisers, and core team',
        },
      ]
    },
    { 
      label: 'Our Programs', 
      href: '/programs', 
      icon: LayoutGrid,
      dropdown: [
        {
          label: 'Pre-Incubation',
          href: '/programs/pre-incubation',
          description: '8-week intensive program for idea validation'
        },
        {
          label: 'Incubation',
          href: '/programs/incubation',
          description: 'Full incubation support for early-stage startups'
        },
        {
          label: 'Master Classes',
          href: '/programs/master-classes',
          description: 'Exclusive cinematic learning experience — Enroll now for early access',
        },
        {
          label: 'Campus Startup Mission',
          href: '/campus-startup',
          description: 'Innovation Mission 2026 — colleges, hackathons & funding',
        },
      ]
    },
    { label: 'Events', href: '/events', icon: Calendar },
    {
      label: 'Ecosystem',
      href: '/ecosystem',
      icon: Globe,
      isMega: true,
      dropdown: [
        {
          label: 'Mentors', desc: 'Startup Mentor Network', href: '/mentors',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          )
        },
        {
          label: 'Investors', desc: 'Startup-Investor Ecosystem', href: '/investors',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v2m0 8v2"/>
              <path d="M15.5 9.5A3.5 3.5 0 0 0 9 10c0 1.4.8 2.6 2 3.2L12 14a3 3 0 1 1-3 3"/>
            </svg>
          )
        },
        {
          label: 'Corporates', desc: 'Corporate Innovation Programs', href: '/ecosystem/corporates',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          )
        },
        {
          label: 'Partners', desc: 'Partner Support Network', href: '/ecosystem/partners',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/>
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
            </svg>
          )
        },
        {
          label: 'Academia', desc: 'Academic Innovation Hub', href: '/ecosystem/academia',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 0 2.5 2 6 2s6-2 6-2v-5"/>
            </svg>
          )
        },
        {
          label: 'Startups', desc: 'Startup Growth Enablement', href: '/ecosystem/startups',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          )
        },
        {
          label: 'Co-Working', desc: 'Shared Workspaces & Labs', href: '/ecosystem/coworking',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8m-4-4v4"/>
            </svg>
          )
        },
      ]
    },
    { label: 'Market Access', href: '/market-access', icon: Rocket },
    { label: 'Source', href: '/source', icon: Search },
  ];

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleDropdownItemClick = (e, dropdownItem) => {
    if (dropdownItem.href === '/mentors#become-mentor') {
      e.preventDefault();
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        router.push('/mentors#become-mentor');
      } else {
        router.push(`/login?returnUrl=${encodeURIComponent('/mentors#become-mentor')}`);
      }
    }
    setActiveDropdown(null);
    setOpenDropdown(null);
    closeMobileMenu();
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  useEffect(() => {
    async function checkAuth() {
      const { data } = await getCurrentUser();
      if (data?.user) {
        setUser(data.user);
      }
    }
    checkAuth();
  }, []);

  // 🧱 SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🧱 SCROLL LOCK
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdowns({});
  };

  const toggleMobileDropdown = (label) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      {/* 🌑 OVERLAY */}
      <div className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />

      {/* 🧱 TOP ROW: BRANDING + SEARCH + ACTIONS */}
      <div className="header-top">
        <div className="container">
          <Link href="/" className="header-logo">
            <img
              src="/assets/images/Startupsina-logo-wight.png"
              alt="Startups India Logo"
              className="Startupsina-logo-white-image"
            />
            <div className="logo-fallback">
              <span className="logo-startups">Startups</span>
              <span className="logo-india">India</span>
            </div>
          </Link>

          {/* ⚡ ELITE SEARCH BAR */}
          <div className={`header-search-elite ${searchFocused ? 'focused' : ''}`} ref={searchRef}>
            <div className="search-input-wrap">
              <Search size={16} className="search-icon-left" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search programs, mentors, events..."
                className="search-bar-elite"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                autoComplete="off"
              />
              {searchQuery ? (
                <button className="search-clear-btn" onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }} aria-label="Clear">
                  <X size={14} />
                </button>
              ) : (
                <kbd className="search-kbd">
                  <span>⌘</span>K
                </kbd>
              )}
            </div>

            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  className="search-dropdown-elite"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ── IDLE STATE ── */}
                  {!searchQuery && (
                    <>
                      <p className="search-section-title">Quick Navigate</p>
                      <div className="search-quick-grid">
                        {QUICK_LINKS.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            className={`search-quick-chip ${selectedIndex === i ? 'selected' : ''}`}
                            onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                          >
                            <span className="chip-dot" style={{ background: item.color }} />
                            {item.title}
                          </Link>
                        ))}
                      </div>
                      <div className="search-idle-hint">
                        <Search size={12} style={{ opacity: 0.35 }} />
                        <span>Type to search programs, mentors, investors…</span>
                      </div>
                    </>
                  )}

                  {/* ── TYPING STATE ── */}
                  {searchQuery && searchResults.length > 0 && (
                    <>
                      {Object.entries(groupedResults).map(([cat, items]) => (
                        <div key={cat}>
                          <div className="search-cat-label">{cat}</div>
                          {items.map((item) => {
                            const globalIdx = searchResults.indexOf(item);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`search-result-row ${selectedIndex === globalIdx ? 'selected' : ''}`}
                                onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                              >
                                <span className="result-color-bar" style={{ background: item.color }} />
                                <div className="search-result-text">
                                  <div className="search-result-title">{item.title}</div>
                                  <div className="search-result-desc">{item.desc}</div>
                                </div>
                                <ArrowRight size={13} className="search-result-arrow" />
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                      <div className="search-footer-hint">
                        <span><kbd>↑</kbd><kbd>↓</kbd></span>
                        <span><kbd>↵</kbd> open</span>
                        <span style={{ marginLeft: 'auto' }}><kbd>Esc</kbd> close</span>
                      </div>
                    </>
                  )}

                  {/* ── NO RESULTS ── */}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="search-empty-state">
                      <Search size={26} style={{ opacity: 0.18, marginBottom: '8px' }} />
                      <p>No results for <strong>"{searchQuery}"</strong></p>
                      <span>Try: programs, mentors, events</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="header-actions">
            {user ? (
              <Link href="/dashboard" className="btn-header btn-signin" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-header btn-signin" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Sign in
                </Link>
                <Link href="/signup" className="btn-header btn-signup" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* 🧱 BOTTOM ROW: NAVIGATION links */}
      <nav className="header-bottom">
        <div className="container">
          <div className="nav-links" onMouseLeave={() => setHoveredNav(null)}>
            {/* 🏃‍♂️ SLIDING HIGHLIGHT */}
            <AnimatePresence>
              {hoveredNav !== null && (
                <motion.div
                  className="nav-sliding-highlight"
                  layoutId="nav-highlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    left: hoveredNav.left,
                    top: hoveredNav.top,
                    width: hoveredNav.width,
                    height: hoveredNav.height,
                  }}
                />
              )}
            </AnimatePresence>

            {menuItems.map((item, index) =>
              item.dropdown ? (
                <div
                  key={index}
                  className="nav-dropdown-container"
                  onMouseEnter={(e) => {
                    setOpenDropdown(index);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                    setHoveredNav({
                      left: rect.left - parentRect.left,
                      top: rect.top - parentRect.top,
                      width: rect.width,
                      height: rect.height,
                    });
                  }}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`nav-link dropdown-toggle ${pathname.startsWith(item.href) ? 'active' : ''}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`dropdown-arrow ${openDropdown === index ? 'rotated' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === index && (
                      <motion.div
                        className={item.isMega ? 'eco-mega-dropdown' : 'programs-dropdown'}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        {item.isMega ? (
                          <>
                            <div className="eco-mega-header">
                              <span className="eco-mega-eyebrow">Our Ecosystem</span>
                              <Link href="/ecosystem" className="eco-mega-view-all" onClick={() => setOpenDropdown(null)}>View All →</Link>
                            </div>
                            <div className="eco-mega-grid">
                              {item.dropdown.map((eco, idx) => (
                                <Link
                                  key={idx}
                                  href={eco.href}
                                  className="eco-mega-item"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className="eco-mega-icon-box">
                                    {eco.svg}
                                  </span>
                                  <span className="eco-mega-body">
                                    <span className="eco-mega-label">{eco.label}</span>
                                    <span className="eco-mega-desc">{eco.desc}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className={`dropdown-item ${pathname + currentHash === dropdownItem.href ? 'active' : ''}`}
                              onClick={(e) => handleDropdownItemClick(e, dropdownItem)}
                            >
                              <div className="dropdown-item-title">{dropdownItem.label}</div>
                              <div className="dropdown-item-description">
                                {dropdownItem.description}
                              </div>
                              {dropdownItem.subtext && (
                                <div className="dropdown-item-subtext" style={{ fontSize: '11px', color: '#ff4b5c', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {dropdownItem.subtext}
                                </div>
                              )}
                            </Link>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                    setHoveredNav({
                      left: rect.left - parentRect.left,
                      top: rect.top - parentRect.top,
                      width: rect.width,
                      height: rect.height,
                    });
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE DRAWER (CLEAN) */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <span className="logo-startups">Startups</span>
            <span className="logo-india">India</span>
          </div>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const hasDropdown = !!item.dropdown;
              const isOpen = openSubmenu === item.label;
              
              return (
                <li 
                  key={index} 
                  className={`mobile-nav-wrapper ${hasDropdown ? 'has-submenu' : ''} ${isOpen ? 'open' : ''}`}
                  style={{ '--index': index }}
                >
                  {hasDropdown ? (
                    <>
                      <div className="menu-parent" onClick={() => toggleSubmenu(item.label)}>
                        <span className="menu-left">
                          <Icon size={20} className="menu-icon" />
                          {item.label}
                        </span>
                        <ChevronDown size={18} className="arrow" />
                      </div>
                       <ul className="submenu">
                        {item.dropdown.map((sub, idx) => (
                          <li key={idx}>
                            <Link href={sub.href} onClick={(e) => handleDropdownItemClick(e, sub)} className="submenu-link">
                              <div className="submenu-title">{sub.label}</div>
                              {sub.description && <div className="submenu-desc">{sub.description}</div>}
                              {sub.subtext && (
                                <div className="submenu-subtext" style={{ fontSize: '11px', color: '#ff4b5c', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {sub.subtext}
                                </div>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="menu-left">
                        <Icon size={20} className="menu-icon" />
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mobile-drawer-actions">
            {user ? (
              <Link href="/dashboard" onClick={closeMobileMenu} className="mobile-btn mobile-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu} className="mobile-btn mobile-btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Sign in
                </Link>
                <Link href="/signup" onClick={closeMobileMenu} className="mobile-btn mobile-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
