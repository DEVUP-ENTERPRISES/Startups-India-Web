'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Play, Rocket, Users, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import '../styles/startup-hero-premium.css';

const RotatingText = () => {
  const words = [
    "Startups That Solve Real Problems",
    "Businesses With Global Potential",
    "Innovations That Create Impact",
    "Ventures That Shape The Future"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rotating-text-wrapper">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="rotating-text"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const StatCounter = ({ value, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div className="stat-card-premium" ref={ref}>
      <span className="stat-value-premium">
        {count}{suffix}
      </span>
      <span className="stat-label-premium">{label}</span>
    </div>
  );
};

export default function StartupHeroPremium() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <section className="premium-hero-wrapper">
      {/* Dynamic Background */}
      <div className="hero-bg-effects">
        <div className="mesh-grid" />
        <div className="hero-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 10 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
        <motion.div 
          className="cursor-glow"
          animate={{
            x: mousePos.x - 300,
            y: mousePos.y - 300,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100, mass: 0.5 }}
          style={{
            position: 'fixed',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </div>

      <motion.div 
        className="hero-content-premium"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="hero-badge-premium">
          <Zap size={14} className="text-red-500" />
          <span>New:</span> Access ₹50L+ in Startup Credits
        </motion.div>

        {/* Main Title */}
        <div className="hero-title-main">
          <motion.span variants={itemVariants} className="hero-static-line">
            Empowering Founders To Build
          </motion.span>
          <RotatingText />
        </div>

        {/* Description */}
        <motion.p variants={itemVariants} className="hero-description-premium">
          StartupsIndia is a full-stack startup ecosystem platform helping students, founders, entrepreneurs, and innovators transform ideas into scalable businesses. 
          <br /><br />
          From idea validation and mentorship to funding access, incubation, networking, and market growth — we provide the ecosystem, resources, and strategic support needed to build successful startups.
        </motion.p>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="hero-stats-row">
          <StatCounter value="5000" label="Startups" suffix="+" />
          <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
          <StatCounter value="200" label="Mentors" suffix="+" />
          <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
          <StatCounter value="95" label="Success Rate" suffix="%" />
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="hero-actions-premium">
          <Link href="/login" className="no-underline">
            <button className="btn-primary-hero">
              Start Your Journey
              <ArrowRight size={20} />
            </button>
          </Link>
          <button className="btn-secondary-hero">
            View Programs
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
