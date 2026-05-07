'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import '../styles/network-hero.css';

const PHRASES = [
  'Startups That Solve Real Problems',
  'Businesses With Global Potential',
  'Innovations That Create Impact',
  'Ventures That Shape The Future',
];

const FLOATING_STATS = [
  { value: '5000+', label: 'STARTUPS SUPPORTED' },
  { value: '200+', label: 'EXPERT MENTORS' },
  { value: '95%', label: 'SUCCESS RATE' },
];

export default function NetworkHero() {
  const sectionRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x: moveX, y: moveY });
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
      <motion.div 
        className="hero-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="hero-tag"
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            boxShadow: ["0 0 10px rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0.2)", "0 0 10px rgba(255,255,255,0.1)"]
          }}
          transition={{ 
            opacity: { delay: 0.2 },
            x: { delay: 0.2 },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          STARTUP ECOSYSTEM PLATFORM
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Empowering Founders To Build
        </motion.h1>

        <motion.div 
          className="h-[1.1em] relative block w-full text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="hero-rotating-text highlight-red"
            >
              {PHRASES[textIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="hero-pills"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {['Idea Validation & Mentorship', 'Funding & Investor Access', 'Incubation & Market Growth'].map((pill, i) => (
            <motion.div 
              key={pill}
              className="hero-pill"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              {i === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
              {i === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
              {i === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
              {pill}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/programs" className="hero-btn-primary">
              Start Your Journey
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/programs" className="hero-btn-secondary">
              Explore Programs
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Parallax Circles */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]"
        animate={{ 
          x: mousePosition.x * -1,
          y: mousePosition.y * -1
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]"
        animate={{ 
          x: mousePosition.x * 1.5,
          y: mousePosition.y * 1.5
        }}
      />
    </section>
  );
}
