'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import '../../styles/ecosystem.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  {
    key: 'startup',
    label: 'Startups',
    href: '/ecosystem/startups',
    desc: 'Early-stage ventures building the future',
    color: '#ef4444',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
  },
  {
    key: 'corporate',
    label: 'Corporates',
    href: '/ecosystem/corporates',
    desc: 'Enterprise partners driving innovation programs',
    color: '#6366f1',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
  {
    key: 'partner',
    label: 'Partners',
    href: '/ecosystem/partners',
    desc: 'Strategic alliances that amplify impact',
    color: '#10b981',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
      </svg>
    ),
  },
  {
    key: 'academia',
    label: 'Academia',
    href: '/ecosystem/academia',
    desc: 'Research institutions and universities',
    color: '#f59e0b',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 0 2.5 2 6 2s6-2 6-2v-5"/>
      </svg>
    ),
  },
  {
    key: 'coworking',
    label: 'Co-Working',
    href: '/ecosystem/coworking',
    desc: 'Shared spaces fueling collaboration',
    color: '#a855f7',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
      </svg>
    ),
  },
];

function EcosystemCard({ entry }) {
  return (
    <motion.div
      className={`eco-card ${entry.isFeatured ? 'eco-card-featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="eco-card-logo">
        {entry.logo ? (
          <img src={entry.logo} alt={entry.name} />
        ) : (
          <span className="eco-card-logo-placeholder">{entry.name?.charAt(0) || '?'}</span>
        )}
      </div>
      <h3 className="eco-card-name">{entry.name}</h3>
      {entry.description && <p className="eco-card-desc">{entry.description}</p>}
      {entry.tags?.length > 0 && (
        <div className="eco-card-tags">
          {entry.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="eco-card-tag">{tag}</span>
          ))}
        </div>
      )}
      {entry.website && (
        <div className="eco-card-footer" style={{ position: 'relative', zIndex: 10 }}>
          <a href={entry.website.trim().startsWith('http') ? entry.website.trim() : `https://${entry.website.trim()}`} target="_blank" rel="noopener noreferrer" className="eco-card-link" style={{ pointerEvents: 'auto' }}>
            Visit Website
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      )}
    </motion.div>
  );
}

function CategorySection({ category, entries }) {
  return (
    <section className="eco-category-section" id={category.key}>
      <div className="eco-section-header">
        <div className="eco-section-icon" style={{ '--cat-color': category.color }}>
          {category.svg}
        </div>
        <div className="eco-section-meta">
          <h2>{category.label}</h2>
          <p>{category.desc}</p>
        </div>
        <div className="eco-section-line" />
        <Link href={category.href} className="eco-section-link">
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
      <div className="eco-card-grid">
        {entries.length > 0 ? (
          entries.slice(0, 4).map((entry) => <EcosystemCard key={entry._id} entry={entry} />)
        ) : (
          <div className="eco-empty">No {category.label.toLowerCase()} listed yet — check back soon.</div>
        )}
      </div>
    </section>
  );
}

export default function EcosystemPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/ecosystem`)
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => setData({ startup: [], corporate: [], partner: [], academia: [], coworking: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ecosystem-page">
      {/* HERO */}
      <section className="eco-hero">
        <div className="eco-hero-bg">
          <div className="eco-orb eco-orb-1" />
          <div className="eco-orb eco-orb-2" />
          <div className="eco-orb eco-orb-3" />
        </div>
        <div className="eco-hero-content">
          <motion.div className="eco-hero-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eco-badge-dot" />
            India's Innovation Ecosystem
          </motion.div>
          <motion.h1 className="eco-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            Our <span className="gradient-text">Ecosystem</span>
          </motion.h1>
          <motion.p className="eco-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            A thriving network of startups, corporates, academia, and partners — united to build the next generation of innovation.
          </motion.p>
          <motion.div className="eco-stats-bar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="eco-stat"><div className="eco-stat-num">500+</div><div className="eco-stat-label">Startups</div></div>
            <div className="eco-stat-divider" />
            <div className="eco-stat"><div className="eco-stat-num">200+</div><div className="eco-stat-label">Mentors</div></div>
            <div className="eco-stat-divider" />
            <div className="eco-stat"><div className="eco-stat-num">150+</div><div className="eco-stat-label">Investors</div></div>
            <div className="eco-stat-divider" />
            <div className="eco-stat"><div className="eco-stat-num">80+</div><div className="eco-stat-label">Partners</div></div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY QUICK NAV */}
      <div className="eco-cat-nav">
        {CATEGORIES.map(cat => (
          <Link key={cat.key} href={cat.href} className="eco-cat-nav-item" style={{ '--cat-color': cat.color }}>
            <span className="eco-cat-nav-icon">{cat.svg}</span>
            <span>{cat.label}</span>
          </Link>
        ))}
        <Link href="/mentors" className="eco-cat-nav-item" style={{ '--cat-color': '#3b82f6' }}>
          <span className="eco-cat-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <span>Mentors</span>
        </Link>
        <Link href="/investors" className="eco-cat-nav-item" style={{ '--cat-color': '#10b981' }}>
          <span className="eco-cat-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </span>
          <span>Investors</span>
        </Link>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="eco-loading"><div className="eco-spinner" /></div>
      ) : (
        <div className="eco-main">
          {CATEGORIES.map(cat => (
            <CategorySection key={cat.key} category={cat} entries={data?.[cat.key] || []} />
          ))}

          {/* MENTORS LINK */}
          <section className="eco-link-section">
            <motion.div className="eco-link-card mentors-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="eco-link-card-glow" />
              <div className="eco-link-card-body">
                <div className="eco-link-card-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Mentor Network
                </div>
                <h2 className="eco-link-card-title">World-Class Mentors</h2>
                <p className="eco-link-card-desc">Connect with 200+ industry veterans who guide startups from idea to scale.</p>
              </div>
              <div className="eco-link-card-cta">
                <Link href="/mentors" className="eco-link-btn">Explore Mentors <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              </div>
            </motion.div>
          </section>

          {/* INVESTORS LINK */}
          <section className="eco-link-section">
            <motion.div className="eco-link-card investors-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="eco-link-card-glow" />
              <div className="eco-link-card-body">
                <div className="eco-link-card-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Investor Network
                </div>
                <h2 className="eco-link-card-title">Startup-Investor Ecosystem</h2>
                <p className="eco-link-card-desc">Access 150+ angel investors and VCs actively seeking high-growth startups.</p>
              </div>
              <div className="eco-link-card-cta">
                <Link href="/investors" className="eco-link-btn">Explore Investors <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              </div>
            </motion.div>
          </section>
        </div>
      )}

      {/* CTA */}
      <section className="eco-cta">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Be Part of the Ecosystem</motion.h2>
        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Whether you are a startup, corporate, institution, or investor — there is a place for you here.
        </motion.p>
        <motion.div className="eco-cta-buttons" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Link href="/programs" className="eco-cta-btn-primary">Join Our Programs <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          <Link href="/about" className="eco-cta-btn-secondary">Learn More About Us</Link>
        </motion.div>
      </section>

      <ScrollToTop />
    </div>
  );
}
