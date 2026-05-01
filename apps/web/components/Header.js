'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import '../styles/header.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Programs', href: '/programs' },
    { label: 'Events', href: '/events' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Investors', href: '/investors' },
    { label: 'Market Access', href: '/market-access' },
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
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.label}
              <ChevronRight size={18} />
            </Link>
          ))}
          
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
