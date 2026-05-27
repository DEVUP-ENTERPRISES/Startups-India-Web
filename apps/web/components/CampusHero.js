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

/* ── Floating stat card ── */
function StatCard({ icon, text, subtext }) {
  const isLongText = text && text.length > 10;
  return (
    <div className={styles.floatingCard}>
      <div className={styles.cardIconWrap}>
        <span className={styles.cardIcon}>{icon}</span>
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
            <span className={styles.badgeIcon}>🚀</span>
            <span>
              <span className={styles.badgeHighlight}>StartupsIndia.in</span> Presents
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            <span className={styles.titleWhite}>CAMPUS STARTUP &</span>
            <span className={styles.titleGradient}>INNOVATION MISSION 2026</span>
          </motion.h1>

          {/* Subheading */}
          <motion.h2 className={styles.heroSubtitle} variants={itemVariants}>
            Building India's Next Generation of Innovators, Startup Founders & Future Leaders
          </motion.h2>

          {/* Description */}
          <motion.p className={styles.heroDesc} variants={itemVariants}>
            India's emerging campus innovation ecosystem connecting students, colleges, startups,
            corporates, mentors, incubators, investors, and industry leaders through large-scale
            startup awareness programs, innovation competitions, hackathons, pitching platforms,
            and funding opportunities.
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
            <StatCard icon="📅" text="June – July 2026" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '255px', '--d': '40s', '--delay': '-8s' }}>
            <StatCard icon="🏫" text="100+" subtext="Top Colleges" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '235px', '--d': '40s', '--delay': '-16s' }}>
            <StatCard icon="👨‍🎓" text="35,000+" subtext="Students" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '265px', '--d': '40s', '--delay': '-24s' }}>
            <StatCard icon="🚀" text="6,000+" subtext="Hackathon Participants" />
          </div>
          <div className={styles.orbitTrack} style={{ '--r': '240px', '--d': '40s', '--delay': '-32s' }}>
            <StatCard icon="💡" text="2,000+" subtext="Startup Ideas" />
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
            <div className={styles.brandingIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L4 8V20L14 26L24 20V8L14 2Z" fill="url(#brandGrad1)" stroke="#ff3b3b" strokeWidth="0.5"/>
                <path d="M14 8L9 11V17L14 20L19 17V11L14 8Z" fill="#ff3b3b" opacity="0.3"/>
                <defs>
                  <linearGradient id="brandGrad1" x1="4" y1="2" x2="24" y2="26">
                    <stop stopColor="#1a0505"/>
                    <stop offset="1" stopColor="#2a0a0a"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <span className={styles.brandingName}>StartupsIndia.in</span>
              <span className={styles.brandingSub}>Empowering Indian Startups</span>
            </div>
          </div>
        </div>

        <div className={styles.brandingDivider} />

        <div className={styles.brandingRight}>
          <span className={styles.brandingLabel}>POWERED BY</span>
          <div className={styles.brandingInfo}>
            <div className={styles.brandingIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" fill="url(#brandGrad2)" stroke="#ff3b3b" strokeWidth="0.5"/>
                <path d="M14 6L16 12H22L17 16L19 22L14 18L9 22L11 16L6 12H12L14 6Z" fill="#ff3b3b" opacity="0.4"/>
                <defs>
                  <linearGradient id="brandGrad2" x1="2" y1="2" x2="26" y2="26">
                    <stop stopColor="#1a0505"/>
                    <stop offset="1" stopColor="#2a0a0a"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <span className={styles.brandingName}>Innovation and Entrepreneurship Council</span>
              <span className={styles.brandingSub}>Building Innovation. Empowering Entrepreneurs.</span>
            </div>
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
                            <option value="Title Sponsor">Title Sponsor</option>
                            <option value="Platinum Sponsor">Platinum Sponsor</option>
                            <option value="Gold Sponsor">Gold Sponsor</option>
                            <option value="Silver Sponsor">Silver Sponsor</option>
                            <option value="Event Partner">Event Partner</option>
                            <option value="Other">Other</option>
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
