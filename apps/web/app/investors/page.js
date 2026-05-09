'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InvestorRegistrationModal from '@/components/InvestorRegistrationModal';
import ScrollToTop from '@/components/ScrollToTop';
import '../../styles/investors.css';
import '../../styles/modal.css';

export default function InvestorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [investors, setInvestors] = useState([]);
  const loading = false;

  const displayInvestors = investors.slice(0, 4);

  // Investment data cards with irregular shapes
  const investmentCards = [
    { type: 'square', label: 'Avg Deal Size', value: '₹2.5Cr', icon: '💰', delay: 0 },
    { type: 'rectangle', label: 'Total Funding', value: '₹100Cr+', icon: '📈', delay: 1.5 },
    { type: 'square', label: 'Success Rate', value: '85%', icon: '🎯', delay: 3 },
    { type: 'rectangle', label: 'Active Deals', value: '45+', icon: '🤝', delay: 4.5 },
    { type: 'square', label: 'ROI Average', value: '3.2x', icon: '💎', delay: 6 },
  ];

  return (
    <div className="investors-page">
      {/* Hero Section */}
      <section className="investors-hero">
        {/* Animated Background */}
        <div className="hero-animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        {/* Floating Grid Pattern with Stars */}
        <div className="hero-grid-pattern"></div>

        <div className="container">
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Strengthening the Startup Ecosystem Through{' '}
              <span className="title-highlight">Investors</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              At Startups India, investors play an important role in supporting innovation, startup
              growth, and entrepreneurial ambition. Our investor network brings together angel
              investors, venture capitalists, and ecosystem partners who contribute through
              structured programs and curated opportunities.
            </motion.p>

            <motion.div
              className="hero-cta-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className="hero-cta-primary">
                Explore Investors
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button className="hero-cta-secondary" onClick={() => setShowModal(true)}>
                Become an Investor
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Active Investors</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">₹100Cr+</div>
                <div className="stat-label">Capital Deployed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">200+</div>
                <div className="stat-label">Startups Funded</div>
              </div>
            </motion.div>
          </div>

          {/* Floating Investment Data Cards */}
          <div className="investment-cards-container">
            {investmentCards.map((card, index) => (
              <motion.div
                key={index}
                className={`investment-card investment-card-${card.type} investment-card-${index + 1}`}
                initial={{ opacity: 0, x: -50, y: 50, rotate: -5 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [-50, 0, 0, 50],
                  y: [50, 0, -30, -80],
                  rotate: [-5, 0, 2, 5],
                }}
                transition={{
                  duration: 4,
                  delay: card.delay,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
              >
                <div className="investment-card-icon">{card.icon}</div>
                <div className="investment-card-value">{card.value}</div>
                <div className="investment-card-label">{card.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role of Investors Section - Premium Dark */}
      <section className="investor-role-premium-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="premium-badge">
              <span className="badge-dot"></span> GLOBAL NETWORK
            </div>

            <h2 className="section-title-premium">
              Role of Investors in Our <br />
              <span className="title-accent">Ecosystem</span>
            </h2>

            <p className="section-subtitle-premium">
              Investors associated with Startups India contribute meaningfully to our startup community
            </p>

            <div className="role-grid-premium">
              <motion.div
                className="role-card-premium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card-icon-premium">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 4 1.5l-1 1z"/><path d="M15 15v5c-1.5 0-3-.5-4-1.5l1-1h4z"/></svg>
                </div>
                <h3 className="role-card-title-premium">Support Innovation</h3>
                <p className="role-card-desc-premium">Fund early-stage innovation and promising startups</p>
              </motion.div>

              <motion.div
                className="role-card-premium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="card-icon-premium">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>
                </div>
                <h3 className="role-card-title-premium">Pitch Sessions</h3>
                <p className="role-card-desc-premium">Participate in curated pitch sessions and demo days</p>
              </motion.div>

              <motion.div
                className="role-card-premium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="card-icon-premium">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3m10-10h-3M5 12H2m14.24-7.24-2.12 2.12m-8.48 8.48-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64"/></svg>
                </div>
                <h3 className="role-card-title-premium">Ecosystem Programs</h3>
                <p className="role-card-desc-premium">Engage through ecosystem programs and events</p>
              </motion.div>

              <motion.div
                className="role-card-premium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="card-icon-premium">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="role-card-title-premium">Strategic Insights</h3>
                <p className="role-card-desc-premium">Contribute strategic insights and market perspectives</p>
              </motion.div>
            </div>

            <div className="membership-box-premium">
              <div className="membership-content">
                <div className="membership-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffb099" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="membership-info">
                  <div className="membership-badge-small">MEMBERSHIP STANDARDS</div>
                  <p className="membership-text">
                    Investor participation is program-led and invitation-based, ensuring quality and alignment.
                  </p>
                </div>
              </div>
              <button className="review-btn-premium">Review Criteria</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investor Onboarding Section - Premium UI */}
      <section className="onboarding-premium-investor">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="premium-badge">
              <span className="badge-dot"></span> INVESTOR LIFECYCLE
            </div>

            <h2 className="section-title-premium" style={{ marginBottom: '16px' }}>
              Investor Onboarding
            </h2>

            <p className="section-subtitle-premium" style={{ textAlign: 'left', margin: '0 0 80px 0', maxWidth: '800px' }}>
              Scale your capital with precision. Follow our streamlined three-phase <br />
              entry into the Equitix ecosystem.
            </p>

            <div className="onboarding-phases-grid">
              {/* Phase 1 */}
              <div className="onboarding-phase">
                <div className="phase-header-premium">
                  <div className="phase-number-premium">1</div>
                  <h3 className="phase-title-premium">Investor Registration</h3>
                </div>
                
                <motion.div 
                  className="onboarding-card-premium"
                  whileHover={{ y: -5 }}
                >
                  <div className="registration-form-mock">
                    <div className="form-field-mock">
                      <div className="form-label-mock">FULL NAME</div>
                      <div className="form-input-mock">Alex Sterling</div>
                    </div>

                    <div className="form-field-mock">
                      <div className="form-label-mock">INVESTOR TYPE</div>
                      <div className="form-select-mock">
                        Venture Capitalist
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>

                    <div className="form-field-mock">
                      <div className="form-label-mock">INVESTMENT FOCUS</div>
                      <div className="form-input-mock">FinTech, SaaS, GreenTech</div>
                    </div>

                    <div className="form-field-mock">
                      <div className="form-label-mock">PREFERRED STARTUP STAGES</div>
                      <div className="form-tags-mock">
                        <span className="form-tag-mock">Seed</span>
                        <span className="form-tag-mock active">Series A</span>
                        <span className="form-tag-mock">Series B+</span>
                      </div>
                    </div>

                    <button 
                      className="apply-btn-premium"
                      onClick={() => setShowModal(true)}
                    >
                      APPLY AS AN INVESTOR
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Phase 2 */}
              <div className="onboarding-phase">
                <div className="phase-header-premium">
                  <div className="phase-number-premium">2</div>
                  <h3 className="phase-title-premium">Internal Review</h3>
                </div>
                
                <motion.div 
                  className="onboarding-card-premium"
                  whileHover={{ y: -5 }}
                >
                  <div className="review-checklist-mock">
                    <div className="review-item-mock">
                      <div className="review-icon-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
                      </div>
                      <div className="review-text-box">
                        <h4>Background Verification</h4>
                        <p>Comprehensive KYC and AML vetting to ensure compliance with global financial standards.</p>
                      </div>
                    </div>

                    <div className="review-item-mock">
                      <div className="review-icon-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div className="review-text-box">
                        <h4>Ecosystem Alignment</h4>
                        <p>Strategic review of investment thesis against our current portfolio of deep-tech ventures.</p>
                      </div>
                    </div>

                    <div className="review-item-mock">
                      <div className="review-icon-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 8.5-4.5 4.5M19 12l-4.5 4.5M14 6l-6 12M5.5 13 10 8.5M5.5 17 10 12.5"/></svg>
                      </div>
                      <div className="review-text-box">
                        <h4>Venture Support</h4>
                        <p>Evaluating potential for mentorship, network access, and direct advisory to early-stage founders.</p>
                      </div>
                    </div>

                    <div className="integrity-box-premium">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <p>Only verified investors are onboarded to maintain ecosystem integrity.</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Phase 3 */}
              <div className="onboarding-phase">
                <div className="phase-header-premium">
                  <div className="phase-number-premium">3</div>
                  <h3 className="phase-title-premium">Profile Live</h3>
                </div>
                
                <motion.div 
                  className="onboarding-card-premium"
                  whileHover={{ y: -5 }}
                >
                  <div className="profile-mock-container">
                    <div className="profile-card-top">
                      <div className="profile-photo-circle">
                        <img 
                          src="/investor-profile-mockup.png" 
                          alt="Profile" 
                          onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'; }}
                        />
                      </div>
                      <div className="profile-info">
                        <h4>Verified Profile <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path fill="#fff" d="m9 12 2 2 4-4"/></svg></h4>
                        <span>ACTIVE PARTNER</span>
                      </div>
                    </div>

                    <div className="status-grid-mock">
                      <div className="status-pill-mock">
                        <span className="label">STATUS</span>
                        <span className="value">Featured</span>
                      </div>
                      <div className="status-pill-mock">
                        <span className="label">NETWORK</span>
                        <span className="value">Tier 1</span>
                      </div>
                    </div>

                    <div className="feature-pill-mock">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7d61" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 18V6l-3.5 7h7L12 6"/></svg>
                      <div>
                        Featured on website
                        <p>Increased visibility to top-tier founders looking for smart capital.</p>
                      </div>
                    </div>

                    <div className="feature-pill-mock" style={{ borderBottom: 'none' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7d61" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M23 12h-4M5 12H1M19.778 4.222l-2.828 2.828M7.05 16.95l-2.828 2.828M19.778 19.778l-2.828-2.828M7.05 7.05 4.222 4.222"/></svg>
                      <div>
                        Highlighted ecosystem association
                        <p>Exclusive badges denoting your standing within the Equitix Prime community.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Note Section - Premium UI */}
      <section className="note-premium-section">
        <div className="container">
          <motion.div
            className="note-card-premium"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="note-lock-icon"
              whileHover="open"
              initial="closed"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff5252">
                {/* Lock Shackle */}
                <motion.path 
                  d="M7 11V7a5 5 0 0 1 10 0v4" 
                  fill="none" 
                  stroke="#ff5252" 
                  strokeWidth="3.5"
                  variants={{
                    closed: { y: 0 },
                    open: { y: -3 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                {/* Lock Body */}
                <rect x="5" y="10" width="14" height="11" rx="2" />
              </svg>
            </motion.div>
            
            <h3 style={{ fontSize: '28px' }}>Important Note on Interaction & Investments</h3>
            <p className="note-subtitle" style={{ fontSize: '14px', marginBottom: '32px' }}>
              Investors do not directly interact with startups through the website.
            </p>

            <ul className="note-list-premium">
              <li>No direct messaging, deal flow, or pitch uploads via the platform</li>
              <li>No funding guarantees or commitments</li>
              <li>
                All investor engagement occurs only through Startups India–managed programs, <br />
                demo days, and curated events
              </li>
            </ul>

            <div className="note-benefits-grid">
              <div className="benefit-box-premium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                COMPLIANCE & TRANSPARENCY
              </div>
              <div className="benefit-box-premium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                STRUCTURED INTERACTIONS
              </div>
              <div className="benefit-box-premium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                QUALITY CONTROL
              </div>
              <div className="benefit-box-premium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                PROFESSIONAL ENGAGEMENT
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investors Grid */}
      {/* Investors Premium Section */}
      <section className="investors-premium-section">
        <div className="container">
          <div className="premium-split-layout">
            <div className="premium-split-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="premium-display-title">Our Verified Investors</h2>
                <p className="premium-display-subtitle">
                  Ecosystem partners supporting the next generation <br /> of startups.
                </p>
              </motion.div>
            </div>

            <div className="premium-split-right">
              <motion.div
                className="investor-cta-card-premium"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                onClick={() => setShowModal(true)}
              >
                <div className="card-badge-top">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>

                <h3 className="card-premium-title">Become an Investor</h3>
                <p className="card-premium-desc">
                  Join our investor network and support the next generation of startups.
                </p>

                <div className="card-premium-list">
                  <div className="card-list-item">
                    <span className="glow-dot"></span>
                    Curated startup exposure
                  </div>
                  <div className="card-list-item">
                    <span className="glow-dot"></span>
                    Verified onboarding
                  </div>
                  <div className="card-list-item">
                    <span className="glow-dot"></span>
                    Ecosystem partnership
                  </div>
                </div>

                <div className="card-premium-action">
                  <button className="register-btn-premium">
                    Register Now
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Who Can Join Section - Premium Overhaul */}
      <section className="who-can-join-premium">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="join-content-wrapper"
          >
            <div className="portal-live-badge-wrapper">
              <div className="portal-live-badge">
                <span className="live-dot"></span>
                INVESTMENT PORTAL LIVE
              </div>
            </div>

            <h2 className="section-title-premium-center">Who Can Join as an Investor?</h2>
            <p className="section-subtitle-premium-center">
              If you support innovation and early-stage entrepreneurship, we welcome you
            </p>

            <div className="join-grid-premium">
              <div className="join-card-premium">
                <div className="join-card-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg>
                </div>
                <h4>Angel Investors</h4>
                <p>High-net-worth individuals providing crucial early-stage capital.</p>
              </div>

              <div className="join-card-premium">
                <div className="join-card-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/><path d="m3 9 18-3"/></svg>
                </div>
                <h4>Venture Capital Firms</h4>
                <p>Institutional funds focused on high-growth technology sectors.</p>
              </div>

              <div className="join-card-premium">
                <div className="join-card-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
                <h4>Corporate Investment Arms</h4>
                <p>Strategic entities driving industrial innovation through M&A.</p>
              </div>

              <div className="join-card-premium full-width-tablet">
                <div className="join-card-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <h4>Family Offices</h4>
                <p>Private wealth management for generational capital preservation.</p>
              </div>

              <div className="join-card-premium full-width-tablet">
                <div className="join-card-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m16 21 2 2 4-4"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 12h18"/></svg>
                </div>
                <h4>Strategic Ecosystem Partners</h4>
                <p>Synergistic collaborators fostering cross-industry growth networks.</p>
              </div>
            </div>

            <div className="commitment-premium-layout">
              <motion.div 
                className="commitment-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3>Our Commitment to Investors</h3>
                <p>
                  We prioritize institutional-grade security and alignment, ensuring our partners 
                  access the most rigorous startup deal flow available.
                </p>
              </motion.div>

              <motion.div 
                className="commitment-right"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                {[
                  "Verified onboarding process",
                  "Professional and compliant ecosystem engagement",
                  "Curated startup exposure through programs",
                  "Long-term ecosystem partnership"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="commitment-item-premium"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      borderColor: "rgba(255, 176, 153, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="check-icon-premium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Subtle background glow */}
              <div className="commitment-bg-glow"></div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && <InvestorRegistrationModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
