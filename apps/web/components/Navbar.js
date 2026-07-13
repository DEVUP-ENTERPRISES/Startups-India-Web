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
      isMega: true,
      megaHeader: 'About Us',
      dropdownItems: [
        { label: 'About Us', desc: 'Learn more about our mission and vision.', href: '/about', icon: 'ℹ️' },
        { label: 'Team', desc: 'Meet the people behind the ecosystem.', href: '/team', icon: '👥' }
      ]
    },
    { 
      label: 'Our Programs', 
      href: '/programs', 
      hasDropdown: true,
      isMega: true,
      megaHeader: 'Our Programs',
      dropdownItems: [
        { label: 'Pre-Incubation', desc: 'Validate your idea and build a prototype.', href: '/programs/pre-incubation', icon: '🌱' },
        { label: 'Incubation', desc: 'Build your product and get early traction.', href: '/programs/incubation', icon: '🚀' },
        { label: 'Growth Programs', desc: 'Scale your startup with expert guidance.', href: '/programs/growth', icon: '📈' }
      ]
    },
    { label: 'Events', href: '/events' },
    {
      label: 'Ecosystem',
      href: '/ecosystem',
      hasDropdown: true,
      isMega: true,
      megaHeader: 'Our Ecosystem',
      dropdownItems: [
        { label: 'Mentors', desc: 'Startup Mentor Network', href: '/mentors', icon: '🧑‍🏫' },
        { label: 'Investors', desc: 'Startup-Investor Ecosystem', href: '/investors', icon: '💰' },
        { label: 'Corporates', desc: 'Corporate Innovation Programs', href: '/ecosystem#corporates', icon: '🏢' },
        { label: 'Partners', desc: 'Partner Support Network', href: '/ecosystem#partners', icon: '🤝' },
        { label: 'Academia', desc: 'Academic Innovation Hub', href: '/ecosystem#academia', icon: '🎓' },
        { label: 'Startups', desc: 'Startup Growth Enablement', href: '/ecosystem#startups', icon: '🚀' },
        { label: 'Market Access', desc: 'Expand your startup to new markets', href: '/market-access', icon: '🌍' },
        { label: 'Co-Working', desc: 'Shared Workspaces & Labs', href: '/ecosystem#coworking', icon: '💡' },
      ]
    },
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

              {/* Mega Dropdown */}
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
                        <span className="mega-eyebrow">{item.megaHeader || item.label}</span>
                        <Link href={item.href} className="mega-view-all">View All →</Link>
                      </div>
                      <div className="mega-grid">
                        {item.dropdownItems.map((dropItem, idx) => (
                          <Link key={idx} href={dropItem.href} className="mega-item">
                            <span className="mega-item-icon">{dropItem.icon}</span>
                            <span className="mega-item-body">
                              <span className="mega-item-label">{dropItem.label}</span>
                              <span className="mega-item-desc">{dropItem.desc}</span>
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
