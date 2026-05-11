'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, Home, Info, LayoutGrid, Calendar, Users, Coins, Rocket, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();

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

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { 
      label: 'About Us', 
      href: '/about', 
      icon: Info,
      dropdown: [
        {
          label: 'About the Company',
          href: '/about#about-company',
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
      ]
    },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Mentors', href: '/mentors', icon: Users },
    { label: 'Investors', href: '/investors', icon: Coins },
    { label: 'Market Access', href: '/market-access', icon: Rocket },
    { label: 'Source', href: '/source', icon: Search },
  ];

  const [openSubmenu, setOpenSubmenu] = useState(null);

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
            <img src="/assets/images/logo.png" alt="Startups India Logo" className="logo-image" />
            <div className="logo-fallback">
              <span className="logo-startups">Startups</span>
              <span className="logo-india">India</span>
            </div>
          </Link>

          <div className={`header-search ${searchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="search-bar"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button className="search-button" aria-label="Search">
              <Search size={18} />
            </button>
          </div>

          <div className="header-actions">
            {user ? (
              <Link href="/dashboard">
                <button className="btn-header btn-signin">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="btn-header btn-signin">Sign in</button>
                </Link>
                <Link href="/signup">
                  <button className="btn-header btn-signup">Sign Up</button>
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
                        className="programs-dropdown"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            className={`dropdown-item ${pathname + currentHash === dropdownItem.href ? 'active' : ''}`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="dropdown-item-title">{dropdownItem.label}</div>
                            <div className="dropdown-item-description">
                              {dropdownItem.description}
                            </div>
                          </Link>
                        ))}
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
                            <Link href={sub.href} onClick={closeMobileMenu} className="submenu-link">
                              <div className="submenu-title">{sub.label}</div>
                              {sub.description && <div className="submenu-desc">{sub.description}</div>}
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
              <Link href="/dashboard" onClick={closeMobileMenu}>
                <button className="mobile-btn mobile-btn-primary">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu}>
                  <button className="mobile-btn mobile-btn-secondary">Sign in</button>
                </Link>
                <Link href="/signup" onClick={closeMobileMenu}>
                  <button className="mobile-btn mobile-btn-primary">Sign up</button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
