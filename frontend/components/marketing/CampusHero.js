'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import styles from './CampusHero.module.css';

/* ── Floating particle background ── */
function Particles({ count = 30 }) {
  const [particleList, setParticleList] = useState([]);

  useEffect(() => {
    setParticleList(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 12 + 10,
      }))
    );
  }, [count]);

  return (
    <div className={styles.particles} aria-hidden="true">
      {particleList.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── SVG Rocket + Orbital Rings visualisation ── */
function RocketVisual() {
  return (
    <div className={styles.rocketVisual}>
      {/* Orbital rings */}
      <svg className={styles.orbitalRings} viewBox="0 0 500 500" fill="none">
        {/* Outer orbit */}
        <ellipse
          cx="250"
          cy="280"
          rx="220"
          ry="80"
          stroke="rgba(255,59,59,0.12)"
          strokeWidth="0.8"
          strokeDasharray="6 8"
          className={styles.orbitLine}
        />
        {/* Middle orbit */}
        <ellipse
          cx="250"
          cy="270"
          rx="170"
          ry="60"
          stroke="rgba(255,59,59,0.18)"
          strokeWidth="0.8"
          strokeDasharray="4 6"
          className={styles.orbitLineReverse}
        />
        {/* Inner orbit */}
        <ellipse
          cx="250"
          cy="260"
          rx="110"
          ry="40"
          stroke="rgba(255,59,59,0.25)"
          strokeWidth="1"
          className={styles.orbitLine}
        />

        {/* Horizon arc glow */}
        <ellipse
          cx="250"
          cy="340"
          rx="200"
          ry="20"
          fill="url(#horizonGlow)"
        />

        {/* Network nodes on orbits */}
        <circle cx="70" cy="260" r="3" fill="#ff3b3b" opacity="0.6" className={styles.nodeGlow} />
        <circle cx="430" cy="260" r="3" fill="#ff3b3b" opacity="0.6" className={styles.nodeGlow} />
        <circle cx="140" cy="310" r="2.5" fill="#ff3b3b" opacity="0.4" className={styles.nodeGlow} />
        <circle cx="370" cy="310" r="2.5" fill="#ff3b3b" opacity="0.4" className={styles.nodeGlow} />
        <circle cx="250" cy="200" r="2" fill="#ff3b3b" opacity="0.5" className={styles.nodeGlow} />
        <circle cx="180" cy="230" r="2" fill="#ff4d4d" opacity="0.35" className={styles.nodeGlow} />
        <circle cx="320" cy="230" r="2" fill="#ff4d4d" opacity="0.35" className={styles.nodeGlow} />

        {/* Thin connecting lines */}
        <line x1="140" y1="310" x2="250" y2="200" stroke="rgba(255,59,59,0.08)" strokeWidth="0.5" />
        <line x1="370" y1="310" x2="250" y2="200" stroke="rgba(255,59,59,0.08)" strokeWidth="0.5" />
        <line x1="70" y1="260" x2="180" y2="230" stroke="rgba(255,59,59,0.06)" strokeWidth="0.5" />
        <line x1="430" y1="260" x2="320" y2="230" stroke="rgba(255,59,59,0.06)" strokeWidth="0.5" />

        <defs>
          <radialGradient id="horizonGlow">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Rocket SVG */}
      <div className={styles.rocketIcon}>
        <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Exhaust glow */}
          <ellipse cx="50" cy="135" rx="18" ry="5" fill="url(#exhaustGlow)" />
          {/* Exhaust flame */}
          <path
            d="M40 115 L50 138 L60 115"
            fill="url(#flameGrad)"
            className={styles.flame}
          />
          <path
            d="M44 115 L50 130 L56 115"
            fill="url(#flameInner)"
            className={styles.flameInner}
          />
          {/* Rocket body */}
          <path
            d="M50 8 C50 8 30 35 30 75 L30 110 C30 113 33 115 35 115 L65 115 C67 115 70 113 70 110 L70 75 C70 35 50 8 50 8Z"
            fill="url(#bodyGrad)"
            stroke="rgba(255,59,59,0.3)"
            strokeWidth="0.5"
          />
          {/* Window */}
          <circle cx="50" cy="55" r="10" fill="#0a0a0a" stroke="#ff3b3b" strokeWidth="1.5" />
          <circle cx="50" cy="55" r="6" fill="rgba(255,59,59,0.1)" stroke="rgba(255,59,59,0.4)" strokeWidth="0.5" />
          {/* Fins */}
          <path d="M30 95 L18 115 L30 110Z" fill="url(#finGrad)" />
          <path d="M70 95 L82 115 L70 110Z" fill="url(#finGrad)" />
          {/* Detail lines */}
          <line x1="35" y1="80" x2="65" y2="80" stroke="rgba(255,59,59,0.2)" strokeWidth="0.5" />
          <line x1="35" y1="95" x2="65" y2="95" stroke="rgba(255,59,59,0.15)" strokeWidth="0.5" />
          {/* Nose cone highlight */}
          <path
            d="M50 10 C48 18 42 35 40 50"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="bodyGrad" x1="50" y1="8" x2="50" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2a0a0a" />
              <stop offset="50%" stopColor="#1a0505" />
              <stop offset="100%" stopColor="#0f0202" />
            </linearGradient>
            <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="50" y1="115" x2="50" y2="138" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff3b3b" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flameInner" x1="50" y1="115" x2="50" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="exhaustGlow">
              <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ── Stat card SVG icons ── */
const CARD_ICONS = {
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  college: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  students: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  hackathon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  ideas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
    </svg>
  ),
};

/* ── Floating stat card ── */
function StatCard({ iconKey, text, subtext }) {
  const isLongText = text && text.length > 10;
  return (
    <div className={styles.floatingCard}>
      <div className={styles.cardIconWrap}>
        <span className={styles.cardIcon}>{CARD_ICONS[iconKey]}</span>
      </div>
      <span className={`${styles.cardStat} ${isLongText ? styles.cardStatLong : ''}`}>
        {text}
      </span>
      {subtext && <span className={styles.cardLabel}>{subtext}</span>}
    </div>
  );
}

/* ── Main export ── */
export default function CampusHero() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'sponsor', 'college', 'movement'
  const [isSubmitted, setIsSubmitted] = useState(false);

  // States for the 3 different forms
  const [sponsorData, setSponsorData] = useState({
    fullName: '',
    email: '',
    phone: '',
    orgName: '',
    sponsorType: 'Platinum Sponsor',
    message: ''
  });

  const [collegeData, setCollegeData] = useState({
    collegeName: '',
    coordinatorName: '',
    email: '',
    phone: '',
    studentCount: '',
    cityState: ''
  });

  const [movementData, setMovementData] = useState({
    fullName: '',
    role: 'Student',
    email: '',
    phone: '',
    interest: 'Startup Awareness',
    message: ''
  });

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsSubmitted(false);

    // Reset data
    setSponsorData({
      fullName: '',
      email: '',
      phone: '',
      orgName: '',
      sponsorType: 'Platinum Sponsor',
      message: ''
    });
    setCollegeData({
      collegeName: '',
      coordinatorName: '',
      email: '',
      phone: '',
      studentCount: '',
      cityState: ''
    });
    setMovementData({
      fullName: '',
      role: 'Student',
      email: '',
      phone: '',
      interest: 'Startup Awareness',
      message: ''
    });
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSponsorChange = (e) => {
    const { name, value } = e.target;
    setSponsorData(prev => ({ ...prev, [name]: value }));
  };

  const submitSponsor = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCollegeChange = (e) => {
    const { name, value } = e.target;
    setCollegeData(prev => ({ ...prev, [name]: value }));
  };

  const submitCollege = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleMovementChange = (e) => {
    const { name, value } = e.target;
    setMovementData(prev => ({ ...prev, [name]: value }));
  };

  const submitMovement = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section className={styles.heroSection} id="campus-hero">
      {/* ── Background layers ── */}
      <div className={styles.bgEffects} aria-hidden="true">
        <div className={styles.radialGlow1} />
        <div className={styles.radialGlow2} />
        <div className={styles.gridOverlay} />
        <Particles count={28} />
      </div>

      <div className={styles.heroInner}>
        {/* ─── LEFT COLUMN ─── */}
        <motion.div
          className={styles.leftCol}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div className={styles.badge} variants={itemVariants}>
            <span className={styles.badgeIcon}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </span>
            <span>
              <span className={styles.badgeHighlight}>StartupsIndia.in</span> Presents
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            <span className={styles.titleGradient}>Campus100x</span>
            <span className={styles.titleWhite}>Campus Innovation & Startup League</span>
          </motion.h1>

          {/* Subheading */}
          <motion.h2 className={styles.heroSubtitle} variants={itemVariants}>
            100 Colleges | 100 Events | One Innovation Competition to "Building India's Next 1 Million Startup Founders".
          </motion.h2>

          {/* Description */}
          <motion.p className={styles.heroDesc} variants={itemVariants}>
            Campus100x is a structured innovation, entrepreneurship, and startup development
            league designed to engage students across colleges, transform ideas into startups,
            and connect young innovators with industry leaders, mentors, investors,
            and ecosystem partners.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className={styles.ctaGroup} variants={itemVariants}>
            <button
              className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
              onClick={() => handleOpenModal('sponsor')}
            >
              <span>Become Sponsor</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={`${styles.ctaBtn} ${styles.ctaSecondary}`}
              onClick={() => handleOpenModal('college')}
            >
              <span>Register College</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={`${styles.ctaBtn} ${styles.ctaSecondary}`}
              onClick={() => handleOpenModal('movement')}
            >
              <span>Join Innovation Movement</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className={styles.rightCol}>
          <RocketVisual />

          {/* Orbiting stat cards */}
          <div className={styles.orbitTrack} style={{ '--r': '225px', '--d': '40s', '--delay': '0s' }}>
            <StatCard iconKey="calendar" text="July – September 2026" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '255px', '--d': '40s', '--delay': '-8s' }}>
            <StatCard iconKey="college" text="100+" subtext="Top Colleges" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '235px', '--d': '40s', '--delay': '-16s' }}>
            <StatCard iconKey="students" text="50,000+" subtext="Students" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '265px', '--d': '40s', '--delay': '-24s' }}>
            <StatCard iconKey="hackathon" text="6,000+" subtext="Hackathon Participants" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '240px', '--d': '40s', '--delay': '-32s' }}>
            <StatCard iconKey="ideas" text="2,000+" subtext="Startup Ideas" />
          </div>
        </div>
      </div>

      {/* ─── BOTTOM BRANDING STRIP ─── */}
      <motion.div
        className={styles.brandingStrip}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <div className={styles.brandingLeft}>
          <span className={styles.brandingLabel}>PRESENTED BY</span>
          <div className={styles.brandingInfo}>
            <img
              src="/assets/images/logos/Startupsina-logo-wight.png"
              alt="StartupsIndia"
              className={styles.topLogo}
            />
            <span className={styles.brandingSub}>Empowering Indian Startups</span>
          </div>
        </div>

        <div className={styles.brandingDivider} />

        <div className={styles.brandingRight}>
          <span className={styles.brandingLabel}>INITIATIVE BY</span>
          <div className={styles.brandingInfo}>
              <img
                src="/assets/images/logos/I&EC Logo Copy-1.png"
                alt="StartupsIndia"
                className={styles.topLogo}
              />

              <span className={styles.brandingSub}>Building Innovation. Empowering Entrepreneurs.</span>
            </div>
          </div>
      </motion.div>

      {/* Popup Modal with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <motion.div
              className={styles.modalOverlayBlur}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close Button top-right */}
              <button className={styles.closeButton} onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>

              {!isSubmitted ? (
                <>
                  {modalType === 'sponsor' && (
                    <>
                      <h3 className={styles.modalTitle}>
                        Sponsor <span className={styles.redHighlight}>Inquiry Form</span>
                      </h3>
                      <p className={styles.modalSubtitle}>
                        Partner with us to accelerate innovation and connect with the next generation of founders.
                      </p>

                      <form className={styles.modalForm} onSubmit={submitSponsor}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="sponsorFullName" className={styles.formLabel}>Full Name</label>
                            <input
                              type="text"
                              id="sponsorFullName"
                              name="fullName"
                              placeholder="John Doe"
                              value={sponsorData.fullName}
                              onChange={handleSponsorChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="sponsorEmail" className={styles.formLabel}>Email Address</label>
                            <input
                              type="email"
                              id="sponsorEmail"
                              name="email"
                              placeholder="john@example.com"
                              value={sponsorData.email}
                              onChange={handleSponsorChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="sponsorPhone" className={styles.formLabel}>Phone Number</label>
                            <input
                              type="tel"
                              id="sponsorPhone"
                              name="phone"
                              placeholder="+91 98765 43210"
                              value={sponsorData.phone}
                              onChange={handleSponsorChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="sponsorOrgName" className={styles.formLabel}>Organization Name</label>
                            <input
                              type="text"
                              id="sponsorOrgName"
                              name="orgName"
                              placeholder="XYZ Corporation"
                              value={sponsorData.orgName}
                              onChange={handleSponsorChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroupFull}>
                          <label htmlFor="sponsorType" className={styles.formLabel}>Sponsorship Type</label>
                          <select
                            id="sponsorType"
                            name="sponsorType"
                            value={sponsorData.sponsorType}
                            onChange={handleSponsorChange}
                            required
                            className={styles.formInput}
                          >
                            <option value="Title Sponsor">TITLE SPONSOR</option>
                            <option value="Platinum Sponsor">POWERED BY</option>
                            <option value="Gold Sponsor">CO-POWERED BY</option>
                            <option value="Silver Sponsor">INDUSTRY / CATEGORY SPONSOR</option>
                            <option value="Event Partner">ASSOCIATE SPONSOR</option>
                            <option value="Other">OTHER</option>
                          </select>
                        </div>

                        <div className={styles.formGroupFull}>
                          <label htmlFor="sponsorMessage" className={styles.formLabel}>Message</label>
                          <textarea
                            id="sponsorMessage"
                            name="message"
                            placeholder="Tell us about your organization's goals for sponsorship..."
                            value={sponsorData.message}
                            onChange={handleSponsorChange}
                            required
                            className={styles.formTextarea}
                            rows={3}
                          />
                        </div>

                        <div className={styles.formActions}>
                          <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                            Cancel
                          </button>
                          <button type="submit" className={styles.submitButton}>
                            <span>Submit Application</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {modalType === 'college' && (
                    <>
                      <h3 className={styles.modalTitle}>
                        College <span className={styles.redHighlight}>Registration Form</span>
                      </h3>
                      <p className={styles.modalSubtitle}>
                        Register your institution to launch the Campus Innovation Mission.
                      </p>

                      <form className={styles.modalForm} onSubmit={submitCollege}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="collegeName" className={styles.formLabel}>College Name</label>
                            <input
                              type="text"
                              id="collegeName"
                              name="collegeName"
                              placeholder="ABC Institute of Technology"
                              value={collegeData.collegeName}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="coordinatorName" className={styles.formLabel}>Coordinator Name</label>
                            <input
                              type="text"
                              id="coordinatorName"
                              name="coordinatorName"
                              placeholder="Prof. Jane Smith"
                              value={collegeData.coordinatorName}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="collegeEmail" className={styles.formLabel}>Email Address</label>
                            <input
                              type="email"
                              id="collegeEmail"
                              name="email"
                              placeholder="coordinator@college.edu"
                              value={collegeData.email}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="collegePhone" className={styles.formLabel}>Phone Number</label>
                            <input
                              type="tel"
                              id="collegePhone"
                              name="phone"
                              placeholder="+91 98765 43210"
                              value={collegeData.phone}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="studentCount" className={styles.formLabel}>Number of Students</label>
                            <input
                              type="number"
                              id="studentCount"
                              name="studentCount"
                              placeholder="e.g. 500"
                              value={collegeData.studentCount}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="cityState" className={styles.formLabel}>City / State</label>
                            <input
                              type="text"
                              id="cityState"
                              name="cityState"
                              placeholder="Bangalore, Karnataka"
                              value={collegeData.cityState}
                              onChange={handleCollegeChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formActions}>
                          <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                            Cancel
                          </button>
                          <button type="submit" className={styles.submitButton}>
                            <span>Submit Application</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {modalType === 'movement' && (
                    <>
                      <h3 className={styles.modalTitle}>
                        Innovation <span className={styles.redHighlight}>Movement Form</span>
                      </h3>
                      <p className={styles.modalSubtitle}>
                        Be part of India's largest campus startup revolution.
                      </p>

                      <form className={styles.modalForm} onSubmit={submitMovement}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="movementFullName" className={styles.formLabel}>Full Name</label>
                            <input
                              type="text"
                              id="movementFullName"
                              name="fullName"
                              placeholder="John Doe"
                              value={movementData.fullName}
                              onChange={handleMovementChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="movementRole" className={styles.formLabel}>Profession / Role</label>
                            <select
                              id="movementRole"
                              name="role"
                              value={movementData.role}
                              onChange={handleMovementChange}
                              required
                              className={styles.formInput}
                            >
                              <option value="Student">Student</option>
                              <option value="Faculty Coordinator">Faculty Coordinator</option>
                              <option value="Mentor">Mentor</option>
                              <option value="Startup Founder">Startup Founder</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="movementEmail" className={styles.formLabel}>Email Address</label>
                            <input
                              type="email"
                              id="movementEmail"
                              name="email"
                              placeholder="john@example.com"
                              value={movementData.email}
                              onChange={handleMovementChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="movementPhone" className={styles.formLabel}>Phone Number</label>
                            <input
                              type="tel"
                              id="movementPhone"
                              name="phone"
                              placeholder="+91 98765 43210"
                              value={movementData.phone}
                              onChange={handleMovementChange}
                              required
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroupFull}>
                          <label htmlFor="movementInterest" className={styles.formLabel}>Area of Interest</label>
                          <select
                            id="movementInterest"
                            name="interest"
                            value={movementData.interest}
                            onChange={handleMovementChange}
                            required
                            className={styles.formInput}
                          >
                            <option value="Startup Awareness">Startup Awareness</option>
                            <option value="Mentorship">Mentorship</option>
                            <option value="Hackathons & Ideation">Hackathons & Ideation</option>
                            <option value="Incubation Support">Incubation Support</option>
                            <option value="Funding Opportunities">Funding Opportunities</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className={styles.formGroupFull}>
                          <label htmlFor="movementMessage" className={styles.formLabel}>Message</label>
                          <textarea
                            id="movementMessage"
                            name="message"
                            placeholder="Tell us a bit about why you want to join and what you hope to achieve..."
                            value={movementData.message}
                            onChange={handleMovementChange}
                            required
                            className={styles.formTextarea}
                            rows={3}
                          />
                        </div>

                        <div className={styles.formActions}>
                          <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                            Cancel
                          </button>
                          <button type="submit" className={styles.submitButton}>
                            <span>Submit Application</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </>
              ) : (
                <motion.div
                  className={styles.successWrapper}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.successIconWrapper}>
                    <CheckCircle className={styles.successIcon} size={64} />
                  </div>
                  <h3 className={styles.successTitle}>Application Submitted!</h3>
                  <p className={styles.successText}>
                    Thank you for your application. Our team will review your submission and contact you shortly.
                  </p>
                  <button className={styles.successCloseBtn} onClick={handleCloseModal}>
                    Close Window
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
