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
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const Icon = metric.icon;

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-full"
      style={{ borderRadius: '24px' }}
    >
      {/* Background card with strict inline padding to avoid CSS overrides */}
      <div 
        className="relative h-full flex flex-col transition-all duration-500 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(229,57,53,0.3)]"
        style={{ borderRadius: '24px', padding: '32px' }}
      >
        
        {/* Top: Icon - pushes bottom content down evenly across all cards */}
        <div className="flex justify-between items-start mb-auto relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} p-[1px] shadow-lg`}>
            <div className="w-full h-full rounded-2xl bg-[#000000] flex items-center justify-center relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-20`} />
              <Icon className="w-6 h-6 !text-white relative z-10" />
            </div>
          </div>
          <div className="!text-[#444444] font-mono text-xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">
            0{index + 1}
          </div>
        </div>

        {/* Bottom: Content - Tightly grouped to prevent unequal gaps */}
        <div className="relative z-10 mt-8 flex flex-col">
          {/* Numbers */}
          <div className="flex items-baseline flex-wrap gap-x-1 mb-4">
            {metric.prefix && (
              <span className="text-3xl font-bold !text-white/70">{metric.prefix}</span>
            )}
            <span className="text-5xl font-black !text-white tracking-tighter leading-none">
              <AnimatedCounter value={metric.value} trigger={isInView} duration={1600} />
            </span>
            {metric.suffix && (
              <span className="text-3xl font-bold !text-[#e53935]">{metric.suffix}</span>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-sm md:text-base font-bold !text-white tracking-widest uppercase mt-0 mb-2">
            {metric.label}
          </h3>
          
          {/* Subtitle */}
          <p className="text-sm leading-relaxed font-medium !text-[#9ca3af] m-0">
            {metric.sub}
          </p>
        </div>
        
      </div>
    </motion.div>
  );
};

export default function ImpactSection() {
  return (
    <section id="impact" className="iec-section !pt-20 !pb-24 relative bg-[#000000] overflow-hidden">
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
        className="iec-container relative z-10 w-full flex flex-col items-center"
      >
        {/* HEADER */}
        <div className="text-center relative w-full flex flex-col items-center" style={{ marginBottom: '80px' }}>
          <motion.div variants={headerVariants}>
            <span className="section-label-premium mb-8">
              Our Impact
            </span>
          </motion.div>

          <motion.div variants={headerVariants}>
            <h2 className="font-display text-5xl md:text-6xl font-black tracking-tight leading-[1.1] !text-white max-w-4xl z-10 relative mb-6">
              Empowering The Next Era of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53935] to-[#ff7b72]">
                Innovation
              </span>
            </h2>
          </motion.div>

          <motion.div variants={headerVariants}>
            <p className="text-[#a1a1aa] max-w-[700px] text-xl mx-auto leading-relaxed z-10 font-medium">
              Driving transformational growth across the startup landscape with measurable results, capital infusion, and lasting partnerships.
            </p>
          </motion.div>
        </div>

        {/* GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
