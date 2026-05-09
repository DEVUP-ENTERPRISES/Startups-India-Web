'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FileEdit, Users, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import '../styles/how-it-works.css';

const steps = [
  {
    number: '1',
    title: 'Apply Your Startup',
    description: 'Present your startup idea and business vision to begin your entrepreneurial journey.',
    icon: <FileEdit size={24} />,
  },
  {
    number: '2',
    title: 'Join the Ecosystem',
    description: 'Get selected to access mentorship, founder networks, and startup-building resources.',
    icon: <Users size={24} />,
  },
  {
    number: '3',
    title: 'Validate & Build',
    description: 'Refine your business model, product strategy, and market approach with expert guidance.',
    icon: <Zap size={24} />,
  },
  {
    number: '4',
    title: 'Launch, Scale & Raise',
    description: 'Access investors, partnerships, grants, and growth opportunities to scale successfully.',
    icon: <TrendingUp size={24} />,
  },
];

// Node positions as % of axis width (node centres)
const NODE_POSITIONS_PCT = [0, 33.333, 66.666, 100];

export default function HowItWorksSection() {
  const axisRef = useRef(null);
  const [rocketPct, setRocketPct] = useState(0);       // 0–100 %
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!axisRef.current || isMobile) return;
    const rect = axisRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const clamped = Math.max(0, Math.min(rawX, rect.width));
    const pct = (clamped / rect.width) * 100;

    setRocketPct(pct);

    const nearest = NODE_POSITIONS_PCT.reduce((best, pos, idx) =>
      Math.abs(pct - pos) < Math.abs(pct - NODE_POSITIONS_PCT[best]) ? idx : best
    , 0);
    setActiveStep(nearest);
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRocketPct(0);
    setActiveStep(0);
  }, []);

  const handleCardHover = useCallback((idx) => {
    setActiveStep(idx);
    setRocketPct(NODE_POSITIONS_PCT[idx]);
  }, []);

  const nextMobileStep = () => {
    setDirection(1);
    setMobileStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevMobileStep = () => {
    setDirection(-1);
    setMobileStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="how-it-works-modern">
      <div className="startup-journey-section">
        {/* Header */}
        <div className="roadmap-header">
          <motion.span 
            className="section-label-premium mb-3 bg-gradient-to-r from-[#e53935]/20 to-red-600/10 backdrop-blur-md border-red-500/30 !text-red-500 shadow-[0_0_20px_rgba(229,57,53,0.15)] inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(229,57,53,0.15)", "0 0 35px rgba(229,57,53,0.3)", "0 0 20px rgba(229,57,53,0.15)"]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            viewport={{ once: true }}
          >
            THE INSTITUTIONAL PATHWAY
          </motion.span>
          
          <motion.h2 
            className="journey-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Your Startup Journey<br />
            <span className="highlight">Starts Here</span>
          </motion.h2>

          <motion.p
            className="journey-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            From idea validation to funding and scale — we help founders build high-impact startups with mentorship, resources, and investor access.
          </motion.p>
        </div>

        <div className="roadmap-container">
          {!isMobile ? (
            <>
              {/* ── Desktop View: Axis + Cards Grid ── */}
              <div
                className="roadmap-axis"
                ref={axisRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="roadmap-base-line" />
                <div
                  className="roadmap-flame-trail"
                  style={{ width: `${rocketPct}%` }}
                />
                <div
                  className={`rocket-pilot${isHovering ? ' visible' : ''}`}
                  style={{ left: `${rocketPct}%` }}
                >
                  <Rocket size={18} style={{ transform: 'rotate(90deg)' }} />
                </div>

                <div className="roadmap-nodes-wrapper">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`roadmap-node-item${activeStep >= idx ? ' active' : ''}${activeStep === idx ? ' current' : ''}`}
                      onMouseEnter={() => handleCardHover(idx)}
                    >
                      <span className="node-number">{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

                <StaggerContainer>
                  <div className="journey-card-grid">
                    {steps.map((step, idx) => (
                      <StaggerItem key={idx}>
                        <motion.div
                          className={`journey-card${activeStep === idx ? ' focused' : ''}`}
                          onMouseEnter={() => handleCardHover(idx)}
                          whileHover={{ 
                            y: -12,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <div className="step-card-icon">{step.icon}</div>
                          <div className="journey-card-step-label">{step.number}.</div>
                          <h4 className="journey-card-title">{step.title}</h4>
                          <p className="journey-card-desc">{step.description}</p>
                          <div className="journey-card-accent-line" />
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
            </>
          ) : (
            /* ── Mobile View: Carousel Format ── */
            <div className="mobile-carousel-container">
              <div className="mobile-carousel-viewport">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={mobileStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="mobile-carousel-card"
                  >
                    <div className="mobile-card-inner">
                      <div className="mobile-card-header">
                        <div className="mobile-step-pill">STEP {steps[mobileStep].number}</div>
                        <div className="mobile-card-icon">{steps[mobileStep].icon}</div>
                      </div>
                      <h3 className="mobile-card-title !text-white">{steps[mobileStep].title}</h3>
                      <p className="mobile-card-desc !text-white/70">{steps[mobileStep].description}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel Controls */}
              <div className="mobile-carousel-controls">
                <div className="mobile-progress-wrapper">
                  <span className="mobile-progress-text">0{mobileStep + 1}</span>
                  <div className="mobile-progress-track" style={{ position: 'relative' }}>
                    <div 
                      className="mobile-progress-fill" 
                      style={{ width: `${((mobileStep + 1) / steps.length) * 100}%` }}
                    />
                    <div
                      className="rocket-pilot visible"
                      style={{ 
                        left: `${((mobileStep + 1) / steps.length) * 100}%`,
                        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: '28px',
                        height: '28px',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#18181B',
                        border: '1px solid rgba(229, 57, 53, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        zIndex: 10
                      }}
                    >
                      <Rocket size={14} color="#e53935" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  </div>
                  <span className="mobile-progress-text">0{steps.length}</span>
                </div>
                
                <div className="mobile-nav-buttons">
                  <button className="mobile-nav-btn" onClick={prevMobileStep} aria-label="Previous step">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="mobile-nav-btn" onClick={nextMobileStep} aria-label="Next step">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
