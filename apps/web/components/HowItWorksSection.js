'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FileEdit, UserCheck, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import '../styles/how-it-works.css';

const steps = [
  {
    number: '1',
    title: 'Apply',
    description: 'Submit your startup details for evaluation by our core team.',
    icon: <FileEdit size={24} />,
  },
  {
    number: '2',
    title: 'Get Selected',
    description: 'Pass the screening process to join our exclusive platform.',
    icon: <UserCheck size={24} />,
  },
  {
    number: '3',
    title: 'Build & Mentorship',
    description: 'Work directly with leading industry experts and refine your model.',
    icon: <Zap size={24} />,
  },
  {
    number: '4',
    title: 'Scale & Access Funding',
    description: 'Pitch to investors, secure funding, and scale your growth rapidly.',
    icon: <TrendingUp size={24} />,
  },
];

// Node positions as % of axis width (node centres)
const NODE_POSITIONS_PCT = [0, 33.333, 66.666, 100];

export default function HowItWorksSection() {
  const axisRef = useRef(null);
  const sectionRef = useRef(null);
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

  // Mobile scroll-based progress
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress based on section position in viewport
      // Starts when top is at 80% viewport, ends when bottom is at 20%
      const start = viewportHeight * 0.8;
      const end = viewportHeight * 0.2;
      const progress = 1 - (rect.top - end) / (start - end);
      const clamped = Math.max(0, Math.min(progress, 1)) * 100;
      
      setRocketPct(clamped);
      
      // Sync mobile step with scroll progress
      const currentStep = Math.floor((clamped / 100) * steps.length);
      setMobileStep(Math.min(currentStep, steps.length - 1));
      setActiveStep(Math.min(currentStep, steps.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleMouseMove = useCallback((e) => {
    if (!axisRef.current || isMobile) return;
    const rect = axisRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const clamped = Math.max(0, Math.min(rawX, rect.width));
    const pct = (clamped / rect.width) * 100;

    setRocketPct(pct);

    // Progressive node activation: activate all nodes passed by rocket
    const nearest = NODE_POSITIONS_PCT.reduce((best, pos, idx) =>
      Math.abs(pct - pos) < Math.abs(pct - NODE_POSITIONS_PCT[best]) ? idx : best
    , 0);
    setActiveStep(nearest);
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    // Smoothly return to start or stay at last position? 
    // User said "move from point -> point", implying persistence or intentionality.
    // Let's reset to 0 for a "reset" feel or just leave it. 
    // User said "follows horizontally", let's keep it 0 when leaving for a clean state.
    setRocketPct(0);
    setActiveStep(0);
  }, []);

  const handleCardHover = useCallback((idx) => {
    setActiveStep(idx);
    setRocketPct(NODE_POSITIONS_PCT[idx]);
  }, []);

  const nextMobileStep = () => {
    setDirection(1);
    const next = (mobileStep === steps.length - 1 ? 0 : mobileStep + 1);
    setMobileStep(next);
    setRocketPct(NODE_POSITIONS_PCT[next]);
  };

  const prevMobileStep = () => {
    setDirection(-1);
    const prev = (mobileStep === 0 ? steps.length - 1 : mobileStep - 1);
    setMobileStep(prev);
    setRocketPct(NODE_POSITIONS_PCT[prev]);
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
    <section className="how-it-works-modern" ref={sectionRef}>
      <div className="iec-container">
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
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#9ca3af] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] block mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A Strategic Trajectory for Founders
          </motion.h2>
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
                  style={{ 
                    left: `${rocketPct}%`,
                    transform: `translate(-50%, -50%) rotate(${rocketPct > 0 ? '-15deg' : '-45deg'})`
                  }}
                >
                  <Rocket size={22} className="rocket-icon-svg" />
                </div>

                <div className="roadmap-nodes-wrapper">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`roadmap-node-item${rocketPct >= NODE_POSITIONS_PCT[idx] ? ' active' : ''}${activeStep === idx ? ' current' : ''}`}
                      onMouseEnter={() => handleCardHover(idx)}
                    >
                      <span className="node-number">{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

                <StaggerContainer>
                  <div className="roadmap-cards-grid">
                    {steps.map((step, idx) => (
                      <StaggerItem key={idx}>
                        <motion.div
                          className={`roadmap-step-card-glass${activeStep === idx ? ' focused' : ''}`}
                          onMouseEnter={() => handleCardHover(idx)}
                          animate={{
                            y: activeStep === idx ? -12 : 0,
                            borderColor: activeStep === idx ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.1)",
                          }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="step-card-icon">{step.icon}</div>
                          <h4 className="step-card-title !text-white">{step.title}</h4>
                          <p className="step-card-desc !text-white/70">{step.description}</p>
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

              {/* Carousel Controls matching reference */}
              <div className="mobile-carousel-controls">
                <div className="mobile-progress-wrapper">
                  <span className="mobile-progress-text">0{mobileStep + 1}</span>
                  <div className="mobile-progress-track" style={{ position: 'relative', background: 'rgba(255,255,255,0.05)' }}>
                    <div 
                      className="mobile-progress-fill" 
                      style={{ 
                        width: `${rocketPct}%`,
                        boxShadow: '0 0 15px rgba(239,68,68,0.4)'
                      }}
                    />
                    {/* Rocket Cursor for mobile progress bar */}
                    <div
                      className="rocket-pilot visible"
                      style={{ 
                        left: `${rocketPct}%`,
                        transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        width: '32px',
                        height: '32px',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        background: 'linear-gradient(135deg, #ff5a5a, #ef4444)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        zIndex: 10,
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 0 15px rgba(239,68,68,0.5)'
                      }}
                    >
                      <Rocket size={16} color="#ffffff" />
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
