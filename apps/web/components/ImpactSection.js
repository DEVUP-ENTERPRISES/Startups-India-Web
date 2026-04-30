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

const MetricCard = ({ metric }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Use Framer Motion's useInView to trigger individual card animations optimally
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const handleMouseMove = e => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // 3D Tilt calculation (Subtle: max ~4 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 }); // Reset to flat
  };

  const Icon = metric.icon;

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group transition-all duration-300 ease-out"
      style={{
        transformStyle: 'preserve-3d',
        // Smooth tilt only applies on desktop when hovered
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      }}
    >
      {/* CARD OUTER WRAPPER - Glass effect with hover glow */}
      <div className="absolute inset-0 bg-white/[0.04] border border-white/[0.08] backdrop-blur-[16px] rounded-[18px] transition-all duration-300 group-hover:border-[#E53935]/40 group-hover:shadow-[0_0_20px_rgba(229,57,53,0.15),0_15px_40px_rgba(0,0,0,0.5)] group-hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)] -z-10" />

      {/* Inner Highlight Layer - Glass effect */}
      <div
        className="absolute inset-0 rounded-[18px] pointer-events-none -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12)',
        }}
        aria-hidden="true"
      />

      {/* Soft Tint - Icon Color Match */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none rounded-[18px] -z-10`}
        aria-hidden="true"
      />

      {/* Interactive Cursor Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 hidden md:block rounded-[18px]"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(229,57,53,0.15), transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Content Container - Centered alignment */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          transform: 'translateZ(30px)',
          minHeight: '240px',
          padding: '24px 20px',
          justifyContent: 'space-between',
        }}
      >
        {/* Gradient Icon - Centered with container */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br ${metric.gradient} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-105 group-hover:rotate-[3deg] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]`}
          >
            <Icon className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Details - Centered */}
        <div className="flex flex-col items-center gap-1">
          {/* Stat Number - Larger, bolder */}
          <div className="flex items-baseline justify-center text-white drop-shadow-sm">
            {metric.prefix && (
              <span className="text-[24px] font-bold mr-1 opacity-90">{metric.prefix}</span>
            )}
            <span className="text-[38px] leading-none font-bold tracking-tight">
              <AnimatedCounter value={metric.value} trigger={isInView} duration={1600} />
            </span>
            {metric.suffix && (
              <span className="text-[24px] font-bold ml-1 opacity-90">{metric.suffix}</span>
            )}
          </div>

          {/* Label - 16px, weight 600 */}
          <h3 className="!text-white opacity-90 font-semibold text-base mt-1 tracking-wide">
            {metric.label}
          </h3>

          {/* Description - 13-14px, #9CA3AF, max-width 85% */}
          <p className="text-[#9CA3AF] text-[13px] leading-relaxed mt-1 max-w-[85%]">
            {metric.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function ImpactSection() {
  return (
    <section id="impact" className="iec-section !pt-12 relative bg-[#050505] overflow-hidden">
      {/* --- LAYERED BACKGROUND DEPTH --- */}

      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#111111] -z-20" />

      {/* 2. Ultra-subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />

      {/* 3. Grid (Opacity Reduced) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />

      {/* 4. Animated Red Glow behind Heading */}
      <motion.div
        className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E53935] blur-[150px] rounded-[100%] pointer-events-none -z-10"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
        <div className="text-center mb-16 md:mb-24 relative w-full flex flex-col items-center">
          <motion.div variants={headerVariants}>
            <span className="inline-block text-[11px] font-bold text-[#E53935] uppercase tracking-wider border border-[#E53935]/40 rounded-full px-4 py-1.5 bg-[#E53935]/[0.06] mb-6 z-10 relative">
              Our Impact
            </span>
          </motion.div>

          <motion.div variants={headerVariants}>
            <h2 className="font-display text-4xl md:text-[44px] font-bold tracking-tight leading-tight !text-white max-w-3xl z-10 relative">
              Our Impact on The{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#E53935] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] filter">
                  Innovation Ecosystem
                </span>
                {/* Micro-Interaction: Soft red pulse strictly under highlight text */}
                <span
                  className="absolute inset-x-0 bottom-0 top-[20%] bg-[#E53935] blur-[20px] opacity-20"
                  aria-hidden="true"
                />
              </span>
            </h2>
          </motion.div>

          <motion.div variants={headerVariants}>
            <p className="mt-5 text-[#A1A1AA] max-w-[600px] text-lg mx-auto leading-relaxed z-10">
              Driving transformation across the startup landscape with measurable results and
              lasting partnerships.
            </p>
          </motion.div>
        </div>

        {/* GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 stats-grid">
          {impactMetrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
