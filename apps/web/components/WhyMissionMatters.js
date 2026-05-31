'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowDown } from 'lucide-react';
import styles from './WhyMissionMatters.module.css';

// ─── Custom Interactive Skew Card Component with LERP Spotlight ───
function WorkflowCard({ step, label, index }) {
  const cardRef = useRef(null);
  
  // Coordinates LERP refs for smooth 60fps animations
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const isMobile = useRef(false);
  const animationFrameId = useRef(null);

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

    const ease = 0.12;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    // Set custom CSS variables for spot lighting
    card.style.setProperty('--glow-x', `${currentX.current}px`);
    card.style.setProperty('--glow-y', `${currentY.current}px`);

    if (!isMobile.current) {
      // 3D Lift + Slight Scale
      card.style.transform = 'translateY(-10px) scale(1.03)';
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

    card.style.transform = 'translateY(0px) scale(1)';
    card.style.setProperty('--glow-a', '0');

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={styles.workflowCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Radial Spotlight (underneath content) */}
      <div className={styles.glowOverlay} aria-hidden="true" />
      
      {/* Dynamic pulsing border shimmer */}
      <div className={styles.cardShimmer} aria-hidden="true" />
      
      {/* Slanted crystalline background layer */}
      <div className={styles.cardBackgroundPanel} aria-hidden="true" />
      
      {/* Content wrapper: un-skews text elements so they are upright */}
      <div className={styles.cardContent}>
        <div className={styles.stepBadge}>
          <span>{step}</span>
        </div>
        <h3 className={styles.cardLabel}>
          {label}
        </h3>
      </div>
    </motion.div>
  );
}

export default function WhyMissionMatters() {
  const [particles, setParticles] = useState([]);
  const carouselRef = useRef(null);

  // Hydration safe random particles
  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1.5,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 2
    }));
    setParticles(generated);
  }, []);

  // Auto-scroll carousel on mobile
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    if (window.matchMedia('(min-width: 769px)').matches) return;

    let paused = false;
    let raf;

    const step = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const pause = () => { paused = true; };
    const resume = () => { setTimeout(() => { paused = false; }, 1800); };

    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, []);

  const flowSteps = [
    { step: '01', label: 'Idea' },
    { step: '02', label: 'Innovation' },
    { step: '03', label: 'Prototype' },
    { step: '04', label: 'Pitch' },
    { step: '05', label: 'Startup' },
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* Ambient background designs */}
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.edgeLighting} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Floating crimson particle nodes */}
      <div className={styles.particlesContainer}>
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
              backgroundColor: '#ff1e1e',
              opacity: 0.16,
              filter: 'blur(1px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
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
        
        {/* Main Title Headings */}
        <motion.div
          className={styles.titleContainer}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.mainTitle}>
            WHY THIS <br className={styles.mobileBreak} />
            <span className={styles.redGradientTitle}>MISSION MATTERS</span>
          </h2>
        </motion.div>

        {/* Primary Description */}
        <motion.div
          className={styles.descriptionContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.primaryDesc}>
            India has one of the world’s largest student populations and innovation potential, yet access to startup ecosystems, mentorship, innovation exposure, and funding opportunities remains limited inside campuses.
          </p>
        </motion.div>

        {/* Divider Glow Line with traveling dot */}
        <div className={styles.glowLineWrapper}>
          <div className={styles.glowLine} aria-hidden="true">
            <div className={styles.travelingDot} />
          </div>
          {/* Hexagon detailed centerpiece matching screenshot */}
          <div className={styles.centerCenterpiece}>
            <span className={styles.centerDot} />
            <span className={styles.centerDot} />
            <span className={styles.centerDot} />
          </div>
        </div>

        {/* Secondary Highlighted Text */}
        <motion.div
          className={styles.secondaryContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.secondaryDesc}>
            <span className={styles.highlightText}>Campus Startup & Innovation Mission</span> is designed to bridge this gap and create a strong innovation culture where students can move from:
          </p>
        </motion.div>

        {/* Workflow Process Cards Container */}
        <div className={styles.workflowContainer} ref={carouselRef}>
          {flowSteps.map((stepData, idx) => (
            <div key={idx} className={styles.stepWrapper}>
              <WorkflowCard
                step={stepData.step}
                label={stepData.label}
                index={idx}
              />
              
              {/* Connecting neon arrows for flow (not on last card) */}
              {idx < 4 && (
                <div className={styles.connectorWrapper}>
                  {/* Desktop / Tablet horizontal pulse arrow */}
                  <div className={styles.horizontalArrow}>
                    <ChevronRight size={24} strokeWidth={2.5} />
                    <div className={styles.particleLine} />
                  </div>
                  {/* Mobile vertical pulse arrow */}
                  <div className={styles.verticalArrow}>
                    <ArrowDown size={24} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
