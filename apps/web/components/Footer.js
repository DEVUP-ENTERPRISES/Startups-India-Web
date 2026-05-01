'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = e => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
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
      // { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
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
      name: 'Twitter',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      ),
      href: 'https://twitter.com',
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      href: 'https://www.instagram.com/startupsindia_official',
    },
    {
      name: 'YouTube',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
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

              <div className="footer-certification">
                <div className="cert-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span> 100% Safe & Secure</span>
                </div>
              </div>

              <div className="footer-contact">
                <div className="footer-contact-item">
                  <span className="footer-contact-label">
                    <strong>Call:</strong>
                  </span>
                  <a href="tel:+919014878887" className="footer-contact-text">
                    {' '}
                    9014878887
                  </a>
                </div>
                <div className="footer-contact-item">
                  <span className="footer-contact-label">
                    <strong>Email:</strong>
                  </span>
                  <a href="mailto:info@startupsindia.in" className="footer-contact-text">
                    {' '}
                    info@startupsindia.in
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Links Sections */}
            <div className="footer-links">
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
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {new Date().getFullYear()} Startups India. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <Link href="/privacy">Privacy</Link>
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
