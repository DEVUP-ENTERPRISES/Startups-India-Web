'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/navbar.css';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Home', href: '/' },
    { 
      label: 'About Us', 
      href: '/about', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'About Us', href: '/about' },
        { label: 'Team', href: '/team' }
      ]
    },
    { 
      label: 'Our Programs', 
      href: '/programs', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Pre-Incubation', href: '/programs/pre-incubation' },
        { label: 'Incubation', href: '/programs/incubation' },
        { label: 'Growth Programs', href: '/programs/growth' }
      ]
    },
    { label: 'Events', href: '/events' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Investors', href: '/investors' },
    { label: 'Market Access', href: '/market-access' },
    { label: 'Source', href: '/source' },
  ];

  return (
    <motion.nav 
      className="hero-navbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <div className="navbar-menu-horizontal">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className="navbar-item"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + (index * 0.03), ease: "easeOut" }}
              onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={`navbar-link-horizontal ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
                {item.dropdownItems && (
                  <span className="dropdown-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.dropdownItems && (
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      className="navbar-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <Link
                          key={idx}
                          href={dropdownItem.href}
                          className={`navbar-dropdown-link ${pathname === dropdownItem.href ? 'active' : ''}`}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
