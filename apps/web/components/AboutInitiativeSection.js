'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Rocket } from 'lucide-react';
import styles from './AboutInitiativeSection.module.css';

// ─── Premium Spotlight Card component with hardware-accelerated magnetic hover translations ───
function SpotlightCard({ children, className = '' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // High-end Magnetic pull calculation relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pullX = (x - centerX) * 0.06; 
    const pullY = (y - centerY) * 0.06;

    // Apply translation alongside slight vertical hovering state
    card.style.transform = `translateY(-6px) translate(${pullX}px, ${pullY}px)`;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
    card.style.setProperty('--glow-a', '1');
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'translateY(0px) translate(0px, 0px)';
    card.style.setProperty('--glow-a', '0');
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.spotlightCard} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export default function AboutInitiativeSection() {
  const [particles, setParticles] = useState([]);

  // Generate background red particle coordinates on mounting to guarantee hydration safety
  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2.5,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 3
    }));
    setParticles(generated);
  }, []);

  // framer-motion settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const bridgeCards = [
    {
      num: '01',
      title: 'Students & Startups',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Colleges & Industry',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Ideas & Execution',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Innovation & Funding Opportunities',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    }
  ];

  const checklistItems = [
    {
      num: '01',
      text: 'Access 200+ Premium Industry Mentors for 1-on-1 guidance.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      num: '02',
      text: 'Gain Seed Funding & Grants (Up to ₹10 Lakhs) to scale.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      num: '03',
      text: 'Dedicated In-Campus Incubation & coworking workspaces.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
          <path d="M9 22V12h6v10" />
          <path d="M8 7h2v2H8zm6 0h2v2h-2z" />
        </svg>
      )
    },
    {
      num: '04',
      text: 'Hands-on Bootcamps & National Hackathons for active learning.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      num: '05',
      text: 'DPIIT Recognition & fast-track Incorporation support.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      num: '06',
      text: 'Get $100K+ worth of free SaaS credits and developer tools.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      )
    },
    {
      num: '07',
      text: 'Exclusive Demo Days with active VCs and corporate partners.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.aboutSection}>
      {/* Background Ambience/High-tech grids */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      {/* Floating Sparkles Array */}
      <div className={styles.particleOverlay}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#ff3b3b',
              opacity: 0.22,
              filter: 'blur(1.5px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.12, 0.42, 0.12],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* Top Header Pill & Main Title */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className={styles.badgeWrapper}>
            <div className={styles.badgeLine} />
            <div className={styles.pillBadge}>About The Initiative</div>
            <div className={styles.badgeLine} />
          </div>
          <h2 className={styles.title}>
            Building India’s Future <br />
            <span className={styles.titleGradient}>Startup & Innovation Ecosystem</span>
          </h2>
          <p className={styles.subtext}>
            Campus Startup & Innovation Mission 2026 is a large-scale innovation and entrepreneurship initiative designed to transform campuses into innovation-driven startup ecosystems.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <motion.div
          className={styles.layoutGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* LEFT SIDE Wrapper Card (Bridging Gaps + Bottom Description) */}
          <div className={styles.leftWrapper}>
            <div className={styles.columnHeader}>
              <span className={styles.dotBadge} aria-hidden="true" />
              <h3 className={styles.columnTitle}>The mission aims to bridge the gap between:</h3>
            </div>

            {/* 4 Connected Cards aligned horizontally */}
            <div className={styles.bridgeGrid}>
              {bridgeCards.map((card, idx) => (
                <SpotlightCard key={idx} className={styles.bridgeCard}>
                  <div className={styles.iconCircle}>{card.icon}</div>
                  <div className={styles.cardLine} />
                  <div className={styles.bridgeNumber}>{card.num}</div>
                  <p className={styles.bridgeCardTitle}>{card.title}</p>
                  
                  {/* Glowing Arrow Indicator between Cards (desktop only) */}
                  {idx < 3 && (
                    <div className={styles.gapConnector} aria-hidden="true">
                      <ChevronRight size={13} strokeWidth={3} />
                    </div>
                  )}
                </SpotlightCard>
              ))}
            </div>

            {/* Bottom Glass Description Card with highly visible Rocket circle */}
            <div className={styles.bottomCard}>
              <div className={styles.dottedCircle} aria-hidden="true">
                <Rocket className={styles.rocketSvg} size={28} strokeWidth={1.8} />
              </div>
              <p className={styles.bottomText}>
                Campus Startup & Innovation Mission 2026 is a large-scale innovation and entrepreneurship initiative designed to transform campuses into innovation-driven startup ecosystems. By connecting key elements of success, we empower young founders to build businesses with global impact.
              </p>
            </div>

            {/* Beautiful, High-Tech glowing growth graph/waveform illustration below bottomCard */}
            <div className={styles.illustrationWrapper}>
              <svg width="100%" height="80" viewBox="0 0 500 80" fill="none" preserveAspectRatio="none" className={styles.waveSvg}>
                <defs>
                  <linearGradient id="wave-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wave-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255, 59, 59, 0.2)" />
                    <stop offset="35%" stopColor="rgba(255, 59, 59, 1)" />
                    <stop offset="60%" stopColor="rgba(255, 59, 59, 0.7)" />
                    <stop offset="85%" stopColor="rgba(255, 59, 59, 1)" />
                    <stop offset="100%" stopColor="rgba(255, 59, 59, 0.2)" />
                  </linearGradient>
                </defs>
                {/* Glowing fill beneath wave */}
                <path d="M 0,80 C 40,25 90,60 130,42 C 170,25 210,75 250,55 C 290,35 330,68 370,48 C 410,28 460,70 500,45 L 500,80 Z" fill="url(#wave-glow)" />
                {/* Glowing wave path */}
                <path d="M 0,80 C 40,25 90,60 130,42 C 170,25 210,75 250,55 C 290,35 330,68 370,48 C 410,28 460,70 500,45" stroke="url(#wave-line)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* RIGHT SIDE Wrapper Card (Checklist Rows) */}
          <div className={styles.rightWrapper}>
            <div className={styles.columnHeader}>
              <span className={styles.dotBadge} aria-hidden="true" />
              <h3 className={styles.columnTitle}>This initiative creates a connected ecosystem where students can:</h3>
            </div>

            {/* 7 Horizontal Checklist Row Cards */}
            <div className={styles.checklistCol}>
              {checklistItems.map((item, idx) => (
                <div key={idx} className={styles.checkRow}>
                  <div className={styles.checkIconCircle}>{item.icon}</div>
                  <span className={styles.checklistNumber}>{item.num}</span>
                  <span className={styles.checkText}>{item.text}</span>
                  <div className={styles.chevronRight}>
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
