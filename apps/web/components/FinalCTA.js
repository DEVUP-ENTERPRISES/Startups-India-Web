'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Building, Network, GraduationCap } from 'lucide-react';
import styles from './FinalCTA.module.css';

// ─── Custom Interactive Glassmorphism Card with LERP Spotlight ───
function CTAActionCard({ icon, title, index }) {
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

    // Push smooth coordinates to custom CSS variables
    card.style.setProperty('--glow-x', `${currentX.current}px`);
    card.style.setProperty('--glow-y', `${currentY.current}px`);

    if (!isMobile.current) {
      // GPU-accelerated lift & scale
      card.style.transform = 'translateY(-8px) scale(1.02)';
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
      className={styles.actionCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background spotlight overlay */}
      <div className={styles.glowOverlay} aria-hidden="true" />
      
      {/* Content layout wrapper */}
      <div className={styles.cardContent}>
        <div className={styles.iconCircle}>
          {icon}
        </div>
        <h4 className={styles.cardTitle}>
          {title}
        </h4>
      </div>
    </motion.div>
  );
}

export default function FinalCTA() {
  const ctaCards = [
    {
      title: 'Become Sponsor',
      icon: <Handshake size={22} strokeWidth={1.8} />
    },
    {
      title: 'Register College',
      icon: <Building size={22} strokeWidth={1.8} />
    },
    {
      title: 'Become Ecosystem Partner',
      icon: <Network size={22} strokeWidth={1.8} />
    },
    {
      title: 'Student Registration',
      icon: <GraduationCap size={22} strokeWidth={1.8} />
    }
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* Ambient backgrounds */}
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Spacious centered glass panel container */}
      <motion.div 
        className={styles.ctaBox}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top uppercase tag badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badgeLine} />
          <div className={styles.pillBadge}>Join The Mission</div>
          <div className={styles.badgeLine} />
        </div>

        {/* Large Heading &constrained subtext */}
        <h2 className={styles.mainTitle}>
          Join India’s Emerging <br />
          <span className={styles.gradientHighlight}>Campus Innovation</span> Movement 🚀
        </h2>

        <p className={styles.subtext}>
          This is your opportunity to become part of a large-scale innovation ecosystem shaping the future of entrepreneurship and startup culture in India.
        </p>

        {/* 4 horizontal cards layout */}
        <div className={styles.cardsGrid}>
          {ctaCards.map((card, idx) => (
            <CTAActionCard
              key={idx}
              title={card.title}
              icon={card.icon}
              index={idx}
            />
          ))}
        </div>

      </motion.div>
    </section>
  );
}
