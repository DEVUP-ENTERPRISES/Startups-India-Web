'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import '../styles/eco-category.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function Card({ entry, accent }) {
  return (
    <motion.div
      className={`ecocat-card ${entry.isFeatured ? 'ecocat-card-featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="ecocat-card-logo">
        {entry.logo
          ? <img src={entry.logo} alt={entry.name} />
          : <span>{entry.name?.charAt(0)?.toUpperCase()}</span>}
      </div>
      <h3 className="ecocat-card-name">{entry.name}</h3>
      {entry.description && <p className="ecocat-card-desc">{entry.description}</p>}
      {entry.tags?.length > 0 && (
        <div className="ecocat-card-tags">
          {entry.tags.slice(0, 3).map((t, i) => <span key={i} className="ecocat-card-tag">{t}</span>)}
        </div>
      )}
      {entry.website && (
        <div className="ecocat-card-footer" style={{ position: 'relative', zIndex: 10 }}>
          <a href={entry.website.trim().startsWith('http') ? entry.website.trim() : `https://${entry.website.trim()}`} target="_blank" rel="noopener noreferrer" className="ecocat-card-link" style={{ pointerEvents: 'auto' }}>
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

export default function EcoCategoryPage({ config }) {
  const { category, label, accent, bg, border, gradient, heroTitle, heroSub, ctaText, ctaHref, stats, svg } = config;

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/ecosystem`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setEntries(j.data[category] || []);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = useMemo(() => {
    let result = entries;
    if (filterType !== 'All') {
      result = result.filter(e => e.tags?.includes(filterType) || e.type === filterType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [entries, search, filterType]);

  const cssVars = {
    '--cat-accent': accent,
    '--cat-bg': bg,
    '--cat-border': border,
    '--cat-gradient': gradient,
  };

  return (
    <div className="ecocat-page" style={cssVars}>
      {/* HERO */}
      <section className="ecocat-hero">
        <div className="ecocat-hero-bg">
          <div className="ecocat-orb ecocat-orb-1" />
          <div className="ecocat-orb ecocat-orb-2" />
        </div>
        <div className="ecocat-hero-inner">
          {/* Breadcrumb */}
          <div className="ecocat-breadcrumb">
            <Link href="/">Home</Link>
            <span className="ecocat-breadcrumb-sep">/</span>
            <Link href="/ecosystem">Ecosystem</Link>
            <span className="ecocat-breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
          </div>

          {/* Badge */}
          <motion.div className="ecocat-hero-badge" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="ecocat-hero-badge-icon">{svg}</span>
            Our Ecosystem — {label}
          </motion.div>

          {/* Title */}
          <motion.h1 className="ecocat-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <span className="cat-accent">{heroTitle}</span>
          </motion.h1>

          {/* Sub */}
          <motion.p className="ecocat-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            {heroSub}
          </motion.p>

          {/* Stats */}
          {stats && (
            <motion.div className="ecocat-hero-stat-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              {stats.map((s, i) => (
                <div key={i} className="ecocat-stat">
                  <span className="ecocat-stat-num">{s.num}</span>
                  <span className="ecocat-stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      {loading ? (
        <div className="ecocat-loading"><div className="ecocat-spinner" /></div>
      ) : (
        <div className="ecocat-content">
          {/* Filter Bar */}
          <div className="ecocat-filter-bar">
            <select 
              className="ecocat-filter-select"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Associate partners">Associate partners</option>
              <option value="Value partners">Value partners</option>
            </select>
            <div className="ecocat-search">
              <span className="ecocat-search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="ecocat-grid">
            {filtered.length > 0 ? (
              filtered.map(entry => <Card key={entry._id} entry={entry} accent={accent} />)
            ) : (
              <div className="ecocat-empty">
                <div className="ecocat-empty-icon">{svg}</div>
                <p>{search ? `No results for "${search}"` : `No ${label.toLowerCase()} listed yet — check back soon.`}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="ecocat-cta">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Join the {label} Network
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Become part of India's fastest-growing innovation ecosystem.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Link href={ctaHref} className="ecocat-cta-btn">
            {ctaText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </motion.div>
      </div>

      <ScrollToTop />
    </div>
  );
}
