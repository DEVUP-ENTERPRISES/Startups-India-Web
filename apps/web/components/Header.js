'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, Home, Info, LayoutGrid, Calendar, Users, Coins, Rocket, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import '../styles/header.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { 
      label: 'About Us', 
      href: '/about', 
      icon: Info,
      hasSubmenu: true,
      submenu: [
        { label: 'About Us', href: '/about' },
        { label: 'Team', href: '/team' }
      ]
    },
    { 
      label: 'Our Programs', 
      href: '/programs', 
      icon: LayoutGrid,
      hasSubmenu: true,
      submenu: [
        { label: 'Pre-Incubation', href: '/programs/pre-incubation' },
        { label: 'Incubation', href: '/programs/incubation' }
      ]
    },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Mentors', href: '/mentors', icon: Users },
    { label: 'Investors', href: '/investors', icon: Coins },
    { label: 'Market Access', href: '/market-access', icon: Rocket },
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      {/* 🌑 OVERLAY */}
      <div 
        className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu} 
      />

      {/* 🧱 TOP ROW: BRANDING + SEARCH + ACTIONS */}
      <div className="header-top">
        <div className="container">
          <Link href="/" className="header-logo">
            <img
              src="/assets/images/logo.png"
              alt="Startups India Logo"
              className="logo-image"
            />
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
                  <button className="btn-header btn-signup">Apply Now</button>
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
          <div className="nav-links">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href} 
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
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
              const isOpen = openSubmenu === item.label;
              
              return (
                <li 
                  key={index} 
                  className={`mobile-nav-wrapper ${item.hasSubmenu ? 'has-submenu' : ''} ${isOpen ? 'open' : ''}`}
                  style={{ '--index': index }}
                >
                  {item.hasSubmenu ? (
                    <>
                      <div className="menu-parent" onClick={() => toggleSubmenu(item.label)}>
                        <span className="menu-left">
                          <Icon size={20} className="menu-icon" />
                          {item.label}
                        </span>
                        <ChevronDown size={18} className="arrow" />
                      </div>
                      <ul className="submenu">
                        {item.submenu.map((sub, idx) => (
                          <li key={idx}>
                            <Link href={sub.href} onClick={closeMobileMenu} className="submenu-link">
                              {sub.label}
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
                      <ChevronRight size={18} />
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
                  <button className="mobile-btn mobile-btn-primary">Apply Now</button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
