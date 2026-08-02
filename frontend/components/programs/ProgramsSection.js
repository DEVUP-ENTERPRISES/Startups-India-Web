'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Zap, GraduationCap, Check, ArrowRight } from 'lucide-react';

const programs = [
  {
    id: 'pre-incubation',
    badge: 'Foundation',
    badgeColors: 'bg-slate-100 text-slate-700 border-slate-200',
    title: 'Pre-Incubation',
    duration: '1 Month',
    description: 'Transform your idea into a viable business concept with structured guidance, mentorship, and early-stage validation.',
    features: ['Idea Validation', 'Market Research', 'Business Model Design', 'Prototype Development'],
    icon: Lightbulb,
    iconColors: 'bg-indigo-50 text-indigo-600',
    isFeatured: false,
    href: '/programs/pre-incubation',
  },
  {
    id: 'incubation',
    badge: 'Most Popular',
    badgeColors: 'bg-red-50 text-[#E53935] border-red-200',
    title: 'Incubation',
    duration: '3 Months',
    description: 'Build and launch your startup with comprehensive support, expert mentorship, legal backing, and early funding access.',
    features: ['Expert Mentorship', 'Dedicated Workspace', 'Legal Support', 'Funding Access'],
    icon: Rocket,
    iconColors: 'bg-red-100 text-[#E53935]',
    isFeatured: false,
    href: '/programs/incubation',
  },
  {
    id: 'accelerator',
    badge: 'Advanced',
    badgeColors: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Accelerator',
    duration: '3 Months',
    description: 'Fast-track your growth with intensive training, global investor connections, and proven scaling strategies.',
    features: ['Growth Strategy', 'Investor Network', 'Market Expansion', 'Team Building'],
    icon: Zap,
    iconColors: 'bg-blue-50 text-blue-600',
    isFeatured: false,
    href: '/programs/accelerator',
  },
  {
    id: 'masterclasses',
    badge: 'COMING SOON',
    badgeColors: 'bg-red-600 text-white border-red-700',
    title: 'Master Classes',
    duration: 'COMING SOON',
    description: 'Exclusive cinematic learning experience featuring industry legends. Enroll now for the waitlist.',
    features: ['Elite Mentor Sessions', 'Founders Network', 'Global Scaling', 'Advanced Certification'],
    icon: GraduationCap,
    iconColors: 'bg-red-50 text-red-600',
    isFeatured: true,
    href: '/programs/master-classes',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.12 } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' } 
  },
};

const ProgramCard = ({ prog, variants }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      variants={variants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group flex flex-col p-6 lg:p-8 rounded-[16px] backdrop-blur-[12px] transition-all duration-300 ease-out hover:-translate-y-[6px] relative z-10 overflow-hidden ${
        prog.isFeatured 
          ? 'bg-[linear-gradient(135deg,rgba(229,57,53,0.08),rgba(229,57,53,0.02))] border border-[#E53935]/30 shadow-[0_10px_40px_rgba(229,57,53,0.12)] hover:shadow-[0_15px_50px_rgba(229,57,53,0.2)] hover:border-[#E53935]/50'
          : 'bg-white/70 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:bg-white/90 hover:border-black/[0.12]'
      }`}
    >
      {/* Interactive Cursor Glow (Spotlight) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 hidden md:block"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(229,57,53,0.07), transparent 40%)`
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Row: Icon & Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors duration-300 ${prog.iconColors} ${prog.isFeatured ? 'shadow-sm' : ''}`}>
            <prog.icon size={22} strokeWidth={2.5} />
          </div>
          <div className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border ${prog.badgeColors}`}>
            {prog.badge}
          </div>
        </div>

        {/* Title & Duration */}
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-[22px] font-bold text-[#111111]">{prog.title}</h3>
          <span className="text-xs font-semibold text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-md whitespace-nowrap ml-2">
            {prog.duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#6B7280] text-[14px] leading-relaxed mb-6 flex-grow">
          {prog.description}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {prog.features.map((feat, i) => (
            <li key={i} className="flex items-start text-[14px] font-medium text-[#4B5563]">
              <Check className={`w-[18px] h-[18px] shrink-0 mr-2.5 mt-0.5 ${prog.isFeatured ? 'text-[#E53935]' : 'text-[#6B7280]'}`} strokeWidth={3} />
              <span className="leading-snug">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Link 
          href={prog.href} 
          className={`mt-auto w-full py-3.5 rounded-xl flex items-center justify-center space-x-2 text-[14px] font-bold transition-all duration-300 ${
            prog.isFeatured 
              ? 'bg-[#E53935] text-white hover:bg-[#D32F2F] shadow-md shadow-[#E53935]/20' 
              : 'border border-gray-300 text-[#111111] hover:border-[#E53935]/40 hover:bg-[#E53935]/5'
          }`}
        >
          <span>Explore Program</span>
          <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
        </Link>
      </div>
    </motion.div>
  );
};

export default function ProgramsSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFFFF] to-[#F9FAFB] py-[100px] px-6 lg:px-10 overflow-hidden">
      
      {/* Soft Radial Accent (Light Red Tint) */}
      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'rgba(229,57,53,0.05)',
          filter: 'blur(120px)'
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-[60px]"
        >
          <h2 className="font-display text-[#111111] text-4xl md:text-[44px] font-bold tracking-tight leading-tight mb-5">
            Empowering Startups at Every Stage with{' '}
            <span className="text-[#E53935]">Tailored Programs</span>{' '}
            Designed for Success
          </h2>
          <p className="text-[#6B7280] text-lg leading-relaxed">
            Whether you're just starting out or ready to scale, our comprehensive programs provide the mentorship, resources, and network you need to transform your vision into reality.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {programs.map((prog) => (
            <ProgramCard key={prog.id} prog={prog} variants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
