'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Award, Gift, Globe, Rocket, Users, Milestone, TrendingUp } from 'lucide-react';
import styles from './ProgramTimeline.module.css';

// ─── Custom Spotlight Card component with magnetic hover translates ───
function SpotlightCard({ children, className = '', magnetic = true }) {
  const cardRef = useRef(null);
  
  // Coordinates LERP refs for ultra-smooth 60fps animations
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const isMobile = useRef(false);
  const animationFrameId = useRef(null);

  // Check if coarse pointer (touch screen/mobile device) on mount
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches;
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const animate = () => {
    if (!isHovered.current) {
      animationFrameId.current = null;
      return;
    }

    const card = cardRef.current;
    if (!card) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    // Dynamic smoothing factor
    const ease = 0.12;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    // Push smooth coordinates to custom CSS variables
    card.style.setProperty('--glow-x', `${currentX.current}px`);
    card.style.setProperty('--glow-y', `${currentY.current}px`);

    if (!isMobile.current) {
      if (magnetic) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const pullX = (currentX.current - centerX) * 0.05;
        const pullY = (currentY.current - centerY) * 0.05;
        card.style.transform = `translateY(-6px) scale(1.01) translate(${pullX}px, ${pullY}px)`;
      } else {
        card.style.transform = 'translateY(-6px) scale(1.01)';
      }
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;

    if (!isHovered.current) {
      isHovered.current = true;
      card.style.setProperty('--glow-a', '1');
      if (!animationFrameId.current) {
        animate();
      }
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    const card = cardRef.current;
    if (!card) return;

    // Reset card transforms and fade out the spotlight glows
    card.style.transform = 'translateY(0px) scale(1) translate(0px, 0px)';
    card.style.setProperty('--glow-a', '0');

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.spotlightCard} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial glow layer positioned behind content */}
      <div className={styles.glowOverlay} aria-hidden="true" />
      
      {/* Crystalline dark glass reflection streak */}
      <div className={styles.borderPulseGlow} aria-hidden="true" />
      
      {children}
    </div>
  );
}


export default function ProgramTimeline() {
  const [sparkles, setSparkles] = useState([]);

  // Generate background sparkles for glowing red particle details (hydration safe)
  useEffect(() => {
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 2,
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 3
    }));
    setSparkles(generated);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  const metricsPhase1 = [
    {
      val: '100+',
      label: 'Colleges',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    },
    {
      val: '6–7',
      label: 'Weeks',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      val: 'Daily',
      label: 'Campus Activations',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </svg>
      )
    }
  ];

  const benefits = [
    {
      title: 'Mentorship Access',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polygon points="19 11 17 13 14 13 16 15 15 18 19 16 23 18 22 15 24 13 21 13 19 11" />
        </svg>
      )
    },
    {
      title: 'Startup Ecosystem Exposure',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      title: 'Incubation Opportunities',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 2C6 2 2 6 2 12c0 2.5 1 4.5 1 4.5s2-1 4.5-1c6 0 10-4 10-10 0-3-1.5-4.5-4.5-4.5z" />
          <path d="M14 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </svg>
      )
    },
    {
      title: 'Investor Networking Support',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: 'Future Funding Guidance',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* Background Grids */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      {/* Sparks particles */}
      <div className={styles.particleOverlay}>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              backgroundColor: '#ff1e1e',
              opacity: 0.2,
              filter: 'blur(1px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.35, 0.1],
              scale: [1, 1.25, 1]
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* Top Header & Main Heading */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className={styles.badgeWrapper}>
            <div className={styles.badgeLine} />
            <div className={styles.pillBadge}>Program Overview</div>
            <div className={styles.badgeLine} />
          </div>
          <h2 className={styles.title}>
            A Multi-Phase <br />
            <span className={styles.titleGradient}>Innovation Ecosystem Initiative</span>
          </h2>
          <p className={styles.subtext}>
            The mission is strategically structured into multiple high-impact phases designed to maximize student engagement, startup exposure, innovation participation, ecosystem collaboration, and founder development.
          </p>
        </motion.div>

        {/* 2-Column Layout Grid */}
        <div className={styles.layoutGrid}>
          
          {/* LEFT SIDE: Vertical Dashed Glowing Timeline Column */}
          <div className={styles.timelineCol}>
            <div className={styles.dashedLine} aria-hidden="true" />
            
            {/* Phase 01 Node */}
            <div className={styles.timelineNode}>
              <div className={styles.nodeCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>
                <span className={styles.nodeLabelText}>Phase</span>
                <span className={styles.nodeLabelNum}>01</span>
              </div>
            </div>

            {/* Phase 02 Node */}
            <div className={styles.timelineNode}>
              <div className={styles.nodeCircle}>
                <Trophy size={24} strokeWidth={1.8} />
              </div>
              <div className={styles.nodeLabel}>
                <span className={styles.nodeLabelText}>Phase</span>
                <span className={styles.nodeLabelNum}>02</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content Cards Column */}
          <motion.div
            className={styles.contentCol}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* PHASE 01 CARD */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className={styles.phaseCard}>
                <div className={styles.cardInner}>
                  <div className={styles.phaseBadge}>Phase 01</div>
                  <h3 className={styles.cardTitle}>Startup Ecosystem Awareness Program</h3>

                  {/* 3 Metric cards grid using SpotlightCard */}
                  <div className={styles.metricGrid}>
                    {metricsPhase1.map((item, idx) => (
                      <SpotlightCard key={idx} className={styles.metricCard} magnetic={false}>
                        <div className={styles.metricIconCircle}>{item.icon}</div>
                        <div className={styles.metricTextWrap}>
                          <span className={styles.metricVal}>{item.val}</span>
                          <span className={styles.metricLabel}>{item.label}</span>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  <p className={styles.bodyText}>
                    In the first phase, startup ecosystem awareness programs will be conducted daily across multiple colleges throughout the state.
                  </p>
                  <p className={`${styles.bodyText} ${styles.paragraphSpace}`}>
                    These high-energy sessions are designed to inspire students, create innovation awareness, and introduce them to entrepreneurship, emerging technologies, startup ecosystems, funding opportunities, and future innovation careers.
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* PHASE 02 CARD (Split: Content Left, 3D Podium Right) */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className={styles.phaseCard}>
                <div className={styles.cardInner}>
                  <div className={styles.phase2Split}>
                    
                    {/* Phase 2 details (Left) */}
                    <div className={styles.p2Left}>
                      <div className={styles.phaseBadge}>Phase 02</div>
                      <h3 className={styles.cardTitle}>State-Level Innovation Hackathon Competition</h3>
                      
                      <div className={styles.subBadge}>
                        <Clock size={16} strokeWidth={2.5} />
                        <span>30-Hour Mega Innovation Hackathon</span>
                      </div>

                      <p className={styles.bodyText}>
                        Following the awareness phase, students from participating colleges and innovators from across the state will compete in a large-scale innovation hackathon designed to identify high-potential ideas, startup-ready teams, and future founders.
                      </p>
                    </div>

                    {/* Prize Podium 3D Concept (Right) */}
                    <div className={styles.prizeRight}>
                      <div className={styles.prizeHeader}>
                        <div className={styles.prizeLine} />
                        <span className={styles.prizeTitle}>Prize Pool</span>
                        <div className={styles.prizeLine} />
                      </div>

                      <div className={styles.podiumContainer}>
                        {/* 2nd Place (Silver) */}
                        <div className={styles.podiumPillar}>
                          <div className={`${styles.medalBadge} ${styles.medalSilver}`}>2</div>
                          <div className={`${styles.pillarBox} ${styles.silverBox}`}>
                            <span className={styles.podiumRank}>2nd Prize</span>
                            <span className={styles.podiumCash}>₹70,000</span>
                          </div>
                        </div>

                        {/* 1st Place (Gold) - Dominates */}
                        <div className={styles.podiumPillar}>
                          <div className={`${styles.medalBadge} ${styles.medalGold}`}>1</div>
                          <div className={`${styles.pillarBox} ${styles.goldBox}`}>
                            <span className={styles.podiumRank}>1st Prize</span>
                            <span className={styles.podiumCash}>₹1,00,000</span>
                          </div>
                        </div>

                        {/* 3rd Place (Bronze) */}
                        <div className={styles.podiumPillar}>
                          <div className={`${styles.medalBadge} ${styles.medalBronze}`}>3</div>
                          <div className={`${styles.pillarBox} ${styles.bronzeBox}`}>
                            <span className={styles.podiumRank}>3rd Prize</span>
                            <span className={styles.podiumCash}>₹50,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* BOTTOM BENEFITS ROW */}
            <motion.div className={styles.benefitsSection} variants={itemVariants}>
              <div className={styles.benefitsTitleWrapper}>
                <div className={styles.benefitsTitleLine} />
                <h4 className={styles.benefitsHeader}>In addition to prizes, selected teams will receive:</h4>
                <div className={styles.benefitsTitleLine} />
              </div>

              <div className={styles.benefitsGrid}>
                {benefits.map((item, idx) => (
                  <SpotlightCard key={idx} className={styles.benefitCard}>
                    <div className={styles.benefitIconCircle}>{item.icon}</div>
                    <p className={styles.benefitText}>{item.title}</p>
                  </SpotlightCard>
                ))}
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
