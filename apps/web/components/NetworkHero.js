'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Rocket, ArrowRight, Lightbulb, DollarSign, Users } from 'lucide-react';
import '../styles/network-hero.css';

const PHRASES = [
  'Ideas into successful startups',
  'Passion into scalable businesses',
  'Innovation into real-world impact',
  'Vision into entrepreneurial success',
];

const FEATURES = [
  {
    title: 'Idea Validation & Mentorship',
    desc: 'Validate your ideas and get guidance from industry experts.',
    icon: <Lightbulb className="text-red-500" size={24} />
  },
  {
    title: 'Funding & Investor Access',
    desc: 'Connect with investors and secure the funding you need to grow.',
    icon: <DollarSign className="text-red-500" size={24} />
  },
  {
    title: 'Incubation & Market Growth',
    desc: 'Scale your startup with incubation support and go-to-market help.',
    icon: <Users className="text-red-500" size={24} />
  }
];

export default function NetworkHero() {
  const sectionRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x: moveX, y: moveY, rawX: clientX, rawY: clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(current => (current + 1) % PHRASES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="network-hero" ref={sectionRef}>
      {/* Background FX */}
      <div className="hero-background-fx">
        <div className="plexus-mesh" />
        <div className="ambient-glows">
          <div className="glow-1" />
          <div className="glow-2" />
        </div>
        <div className="particles-container">
          {isClient && [...Array(20)].map((_, i) => (
            <motion.div 
              key={i} 
              className="hero-particle"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>
        <div className="bottom-glow-arc" />
      </div>

      {/* Hero Content Wrapper */}
      <motion.div 
        className="hero-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5
        }}
        transition={{ duration: 1 }}
      >
        {/* Top Badge */}
        <motion.div 
          className="hero-tag-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Rocket size={14} className="text-red-500" />
          <span>WELCOME TO <span className="text-red-500">STARTUPSINDIA</span></span>
        </motion.div>

        {/* Subtitle Divider */}
        <motion.div 
          className="hero-subtitle-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="subtitle-line" />
          <span className="hero-subtitle-text">FULLSTACK STARTUP ECOSYSTEM PLATFORM</span>
          <div className="subtitle-line" />
        </motion.div>

        {/* Main Heading */}
        <div className="hero-title-premium">
          <motion.h1 
            className="hero-static-line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Where Founders Transform
          </motion.h1>
          <div className="rotating-text-container">
            <AnimatePresence mode="wait">
              <motion.div 
                key={textIndex}
                className="dynamic-rotating-line"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                {PHRASES[textIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="hero-feature-grid">
          {FEATURES.map((feature, i) => (
            <motion.div 
              key={i}
              className="feature-card-minimal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
            >
              <div className="feature-icon-circle">
                {feature.icon}
              </div>
              <div className="feature-text-stack">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="hero-actions-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link href="/login" className="no-underline">
            <button className="btn-primary-premium">
              Start Your Journey <ArrowRight size={20} />
            </button>
          </Link>
          <Link href="/programs" className="no-underline">
            <button className="btn-secondary-premium">
              Explore Programs <ArrowRight size={20} />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Cursor Responsive Glow */}
      <motion.div 
        className="hero-cursor-glow"
        animate={{ 
          left: mousePosition.rawX,
          top: mousePosition.rawY
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </section>
  );
}
