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
    {
      label: 'Ecosystem',
      href: '/ecosystem',
      hasDropdown: true,
      isMega: true,
      ecosystemItems: [
        { label: 'Mentors', desc: 'Startup Mentor Network', href: '/mentors', icon: '🧑‍🏫' },
        { label: 'Investors', desc: 'Startup-Investor Ecosystem', href: '/investors', icon: '💰' },
        { label: 'Corporates', desc: 'Corporate Innovation Programs', href: '/ecosystem#corporates', icon: '🏢' },
        { label: 'Partners', desc: 'Partner Support Network', href: '/ecosystem#partners', icon: '🤝' },
        { label: 'Academia', desc: 'Academic Innovation Hub', href: '/ecosystem#academia', icon: '🎓' },
        { label: 'Startups', desc: 'Startup Growth Enablement', href: '/ecosystem#startups', icon: '🚀' },
        { label: 'Co-Working', desc: 'Shared Workspaces & Labs', href: '/ecosystem#coworking', icon: '💡' },
      ]
    },
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
              onMouseEnter={() => (item.hasDropdown || item.isMega) && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={`navbar-link-horizontal ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
                {(item.dropdownItems || item.isMega) && (
                  <span className="dropdown-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                )}
              </Link>

              {/* Mega Dropdown — Ecosystem */}
              {item.isMega && (
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      className="navbar-mega-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mega-header">
                        <span className="mega-eyebrow">Our Ecosystem</span>
                        <Link href="/ecosystem" className="mega-view-all">View All →</Link>
                      </div>
                      <div className="mega-grid">
                        {item.ecosystemItems.map((eco, idx) => (
                          <Link key={idx} href={eco.href} className="mega-item">
                            <span className="mega-item-icon">{eco.icon}</span>
                            <span className="mega-item-body">
                              <span className="mega-item-label">{eco.label}</span>
                              <span className="mega-item-desc">{eco.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Regular Dropdown */}
              {item.dropdownItems && !item.isMega && (
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
