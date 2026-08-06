'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = e => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const footerLinks = {
    explore: [
      { name: 'Startup Stories', href: '#' },
      { name: 'Funding News', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Founders Directory', href: '#' },
    ],
    community: [
      { name: 'Women Entrepreneurs', href: '#' },
      { name: 'Learning Hub', href: '#' },
      { name: 'Startup Jobs', href: '#' },
      { name: 'Mentorship', href: '#' },
    ],
    resources: [
      { name: 'Startup Guide', href: '#' },
      { name: 'Legal Templates', href: '#' },
      { name: 'Funding Database', href: '#' },
      { name: 'Market Research', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Delete Account', href: '/delete-account' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
    ],
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: 'https://www.linkedin.com/company/startupsindia/',
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: 'https://x.com/startupsindia',
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: 'https://www.instagram.com/startupsindia.in',
    },
    {
      name: 'YouTube',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 8.432v7.136L15.818 12 9.545 8.432z" />
        </svg>
      ),
      href: 'https://www.youtube.com/@startupsindiaofficial',
    },
  ];

  return (
    <footer className="footer-wrapper">
      {/* Newsletter Section */}
      <div className="footer-newsletter-section">
        <div className="footer-container">
          <motion.div
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="newsletter-badge">STAY AHEAD OF THE CURVE</div>
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-description">
              Get exclusive access to free ebooks, industry insights, and the latest trends in web
              development, mobile apps, and cutting-edge technologies.
            </p>

            {newsletterSuccess ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '12px', padding: '16px 24px', marginTop: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p style={{ color: '#22c55e', fontWeight: '600', margin: 0 }}>You're subscribed! Thank you for joining our newsletter.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  <span>Get Free Resources</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}

            <div className="newsletter-microcopy">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>
                Free templates, guides, and founder stories delivered monthly. Unsubscribe anytime.{' '}
                <Link href="/privacy" className="privacy-link">
                  Privacy Policy
                </Link>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <motion.div
              className="footer-brand"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <a href="https://startupsindia.in/" className="footer-logo">
                <div className="footer-logo-text">StartupsIndia</div>
              </a>
              <p className="footer-brand-description">
                Empowering the next generation of Indian entrepreneurs through inspiring stories,
                comprehensive resources, and a thriving community ecosystem.
              </p>

              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections (Direct children of footer-grid) */}
              <motion.div
                className="footer-links-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="footer-column-title">Explore</h3>
                <ul className="footer-links-list">
                  {footerLinks.explore.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="footer-links-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="footer-column-title">Community</h3>
                <ul className="footer-links-list">
                  {footerLinks.community.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="footer-links-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="footer-column-title">Resources</h3>
                <ul className="footer-links-list">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="footer-links-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="footer-column-title">Company</h3>
                <ul className="footer-links-list">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {new Date().getFullYear()} Startups India. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/delete-account">Delete Account</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
              <Link href="/refund">Refund</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
