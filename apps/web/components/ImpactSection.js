'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  Award,
  TrendingUp,
  Handshake,
  Globe,
  Building2,
  Calendar,
  IndianRupee,
  Landmark,
  LayoutGrid,
  UserCheck,
  Briefcase,
  Scale,
} from 'lucide-react';
import '../styles/impact-section.css';

const iconMap = {
  users: Users,
  rupee: IndianRupee,
  building: Building2,
  globe: Globe,
  handshake: Handshake,
  briefcase: Briefcase,
  scale: Scale,
  grid: LayoutGrid,
};

const impactMetrics = [
  {
    id: 1,
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Startups Incubated',
    sub: 'Innovative ventures transforming industries',
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    id: 2,
    icon: UserCheck,
    value: 200,
    suffix: '+',
    label: 'Expert Mentors',
    sub: 'Industry leaders guiding you',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    id: 3,
    icon: TrendingUp,
    value: 110,
    prefix: '₹',
    suffix: 'Cr+',
    label: 'Funding Raised',
    sub: 'Capital secured through our network',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 4,
    icon: Landmark,
    value: 120,
    prefix: '₹',
    suffix: 'cr+',
    label: 'Govt. Grants Raised',
    sub: 'Global impact and presence',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 5,
    icon: Building2,
    value: 100,
    suffix: '+',
    label: 'Programs',
    sub: 'Comprehensive training initiatives',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 6,
    icon: Handshake,
    value: 100,
    suffix: '+',
    label: 'Value Partners',
    sub: 'Strategic collaborations worldwide',
    gradient: 'from-teal-400 to-cyan-500',
  },
  {
    id: 7,
    icon: Globe,
    value: 1000,
    suffix: '+',
    label: 'Events',
    sub: 'Networking and learning opportunities',
    gradient: 'from-sky-400 to-blue-400',
  },
  {
    id: 8,
    icon: Calendar,
    value: 100,
    suffix: '+',
    label: 'Corporate Engagements',
    sub: 'Industry partnerships and collaborations',
    gradient: 'from-pink-400 to-rose-400',
  },
];

// Easing function for organic deceleration
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

const AnimatedCounter = ({ value, duration = 1500, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTime;
    let animationFrame;

    const animate = currentTime => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, trigger]);

  return <span>{count.toLocaleString()}</span>;
};

// Framer Motion Variants for Staggered Drop-In
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms stagger between cards
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const MetricCard = ({ metric, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const Icon = metric.icon;

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      className="relative group h-full"
    >
      <div className="impact-card-premium relative h-full transition-all duration-500 rounded-[28px] overflow-hidden">
        
        {/* [Top Row]: Icon & Card Number */}
        <div className="card-top-row">
          <div className="icon-container-premium">
            <div className={`icon-glow-bg bg-gradient-to-br ${metric.gradient} opacity-20`} />
            <Icon className="icon-element !text-white" />
          </div>
          <div className="card-index-premium">
            0{index + 1}
          </div>
        </div>

        {/* [Main Metric] */}
        <div className="metric-value-premium">
          {metric.prefix && <span className="metric-prefix">{metric.prefix}</span>}
          <AnimatedCounter value={metric.value} trigger={isInView} duration={1600} />
          {metric.suffix && <span className="metric-suffix">{metric.suffix}</span>}
        </div>

        {/* [Card Title] */}
        <h3 className="metric-label-premium">
          {metric.label}
        </h3>

        {/* [Description] */}
        <p className="metric-desc-premium">
          {metric.sub}
        </p>

        {/* Subtle Glass Reflection Overlay */}
        <div className="card-reflection-premium" />
      </div>
    </motion.div>
  );
};

export default function ImpactSection() {
  return (
    <section className="impact-section py-20 px-4 relative overflow-hidden bg-[#050505]">
      {/* --- LAYERED BACKGROUND DEPTH --- */}

      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#050505] -z-20" />

      {/* 2. Grid (Opacity Reduced) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      {/* 3. Animated Red Glow behind Heading */}
      <motion.div
        className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-[#E53935] blur-[200px] rounded-[100%] pointer-events-none -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* MAIN CONTENT CONTAINER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="hero-impact-section z-10"
      >
        {/* HEADER */}
        <div className="text-center relative w-full flex flex-col items-center" style={{ marginBottom: '48px' }}>
          <motion.div variants={headerVariants}>
            <div className="impact-badge">
              <TrendingUp size={16} className="text-[#ef4444]" style={{ marginRight: '10px' }} />
              <span className="text-[#ef4444] font-bold tracking-wider uppercase" style={{ fontSize: '13px', letterSpacing: '0.1em' }}>Our Impact</span>
            </div>
          </motion.div>

          <motion.div variants={headerVariants}>
            <h2 className="hero-impact-title">
              Empowering The Next Era of <span className="highlight">Innovation</span>
            </h2>
          </motion.div>

          <motion.div variants={headerVariants}>
            <p className="hero-impact-subtitle">
              Driving transformational growth across the startup landscape with measurable results, capital infusion, and lasting partnerships.
            </p>
          </motion.div>
        </div>

        {/* DOUBLE-ROW INFINITE MARQUEE SECTION */}
        <div className="impact-marquee-wrapper">
          {/* Row 1: Metrics 1-4 */}
          <div className="impact-marquee-track row-1">
            {[...impactMetrics.slice(0, 4), ...impactMetrics.slice(0, 4)].map((metric, index) => (
              <div key={`row1-${metric.id}-${index}`} className="impact-marquee-item">
                <MetricCard metric={metric} index={index % 4} />
              </div>
            ))}
          </div>

          {/* Row 2: Metrics 5-8 */}
          <div className="impact-marquee-track row-2">
            {[...impactMetrics.slice(4, 8), ...impactMetrics.slice(4, 8)].map((metric, index) => (
              <div key={`row2-${metric.id}-${index}`} className="impact-marquee-item">
                <MetricCard metric={metric} index={(index % 4) + 4} />
              </div>
            ))}
          </div>

          {/* Premium Gradient Overlays */}
          <div className="marquee-overlay-left" />
          <div className="marquee-overlay-right" />
        </div>




      </motion.div>
    </section>
  );
}
