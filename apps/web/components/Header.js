'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import '../styles/header.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    {
      label: 'Our Programs',
      href: '/programs',
      dropdown: [
        {
          label: 'Pre-Incubation',
          href: '/programs/pre-incubation',
          description: '4-week intensive program for idea validation',
        },
        {
          label: 'Incubation',
          href: '/programs/incubation',
          description: 'Full incubation support for early-stage startups',
        },
        {
          label: 'Master Classes',
          href: '/programs/master-classes',
          description: 'Advanced training and skill development',
        },
      ],
    },
    { label: 'Events', href: '/events' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Investors', href: '/investors' },
    { label: 'Market Access', href: '/market-access' },
    { label: 'Source', href: '/source' },
  ];

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
                    setProgramsDropdownOpen(true);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                    setHoveredNav({
                      left: rect.left - parentRect.left,
                      top: rect.top - parentRect.top,
                      width: rect.width,
                      height: rect.height,
                    });
                  }}
                  onMouseLeave={() => setProgramsDropdownOpen(false)}
                >
                  <button
                    className={`nav-link dropdown-toggle ${pathname.startsWith(item.href) ? 'active' : ''}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`dropdown-arrow ${programsDropdownOpen ? 'rotated' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {programsDropdownOpen && (
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
                            className="dropdown-item"
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
          {menuItems.map((item, index) =>
            item.dropdown ? (
              <div key={index} className="mobile-dropdown-container">
                <div 
                  className={`mobile-nav-item dropdown-header ${mobileDropdowns[item.label] ? 'open' : ''}`}
                  onClick={() => toggleMobileDropdown(item.label)}
                >
                  {item.label}
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: mobileDropdowns[item.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>
                <AnimatePresence>
                  {mobileDropdowns[item.label] && (
                    <motion.div 
                      className="mobile-dropdown-items"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="mobile-dropdown-item"
                          onClick={closeMobileMenu}
                        >
                          <div className="mobile-dropdown-title">{dropdownItem.label}</div>
                          <div className="mobile-dropdown-description">{dropdownItem.description}</div>
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
                className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
                <ChevronRight size={18} />
              </Link>
            )
          )}

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
