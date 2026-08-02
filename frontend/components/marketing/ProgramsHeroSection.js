'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const floatingPrograms = [
  {
    id: 1,
    title: 'Pre-Incubation',
    subtitle: 'Idea to concept',
    position: 'top-left',
  },
  {
    id: 2,
    title: 'Incubation',
    subtitle: 'Build & launch',
    position: 'top-right',
  },
  {
    id: 3,
    title: 'Growth Programs',
    subtitle: 'Scale & expand',
    position: 'bottom-left',
  },
];

const cardVariants = {
  topLeft: {
    y: [0, -10, 0],
    rotate: -3,
  },
  topRight: {
    y: [0, -12, 0],
    rotate: 3,
  },
  bottomLeft: {
    y: [0, -8, 0],
    rotate: -2,
  },
};

const cardPositions = {
  'top-left': {
    top: '15%',
    left: '5%',
  },
  'top-right': {
    top: '15%',
    right: '5%',
  },
  'bottom-left': {
    bottom: '20%',
    left: '8%',
  },
  'bottom-right': {
    bottom: '20%',
    right: '8%',
  },
};

export default function ProgramsHeroSection() {
  const sectionRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !sectionRef.current) return;

    const handleMouseMove = e => {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setCursorPos({ x, y });
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const section = sectionRef.current;
    section.addEventListener('mousemove', handleMouseMove);
    return () => section.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#000000] overflow-hidden flex items-center justify-center"
    >
      {/* Background Glow Layer */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(229, 57, 53, 0.25) 0%, rgba(229, 57, 53, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cursor Glow Effect */}
      {isHovering && !isMobile && (
        <div
          className="absolute pointer-events-none w-[400px] h-[400px] rounded-full transition-opacity duration-100"
          style={{
            left: cursorPos.x - 200,
            top: cursorPos.y - 200,
            background: 'radial-gradient(circle, rgba(229, 57, 53, 0.15) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating Program Cards */}
      {!isMobile &&
        floatingPrograms.map((program, index) => (
          <motion.div
            key={program.id}
            className="absolute"
            style={cardPositions[program.position]}
            animate={cardVariants[program.position]}
            transition={{
              y: {
                duration: 6 + index,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.5,
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <motion.div
              className="group relative w-[200px] p-4 rounded-[14px] cursor-pointer"
              style={{
                background: 'rgba(20, 20, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              {/* Red Dot Indicator */}
              <div
                className="absolute top-4 left-4 w-2 h-2 rounded-full"
                style={{ background: '#E53935' }}
              />

              {/* Card Content */}
              <div className="mt-2">
                <h4 className="text-[14px] font-semibold text-white mb-1">{program.title}</h4>
                <p className="text-[12px] text-[#9CA3AF]">{program.subtitle}</p>
              </div>

              {/* Hover Glow */}
              <div
                className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(229, 57, 53, 0.15)',
                }}
              />
            </motion.div>
          </motion.div>
        ))}

      {/* Main Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Rocket Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(229, 57, 53, 0.1)',
              border: '1px solid rgba(229, 57, 53, 0.2)',
            }}
          >
            <Rocket size={34} color="#E53935" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Heading with Glow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[64px] font-bold text-white leading-tight mb-4 relative"
          style={{
            fontFamily: 'Inter, Poppins, sans-serif',
            textShadow: '0 0 80px rgba(255, 255, 255, 0.08)',
          }}
        >
          Our Programs
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[16px] text-[#9CA3AF] mb-6 tracking-wide"
          style={{ letterSpacing: '0.02em' }}
        >
          Programs that turn ideas into scalable ventures
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-[60px] h-[2px] mx-auto mb-8 rounded-full relative"
          style={{
            background: '#E53935',
            boxShadow: '0 0 20px rgba(229, 57, 53, 0.5)',
          }}
        />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[280px] sm:w-[320px] px-4 py-3 rounded-[10px] bg-white/5 border border-white/08 text-white placeholder-[#9CA3AF] outline-none transition-all duration-300"
              style={{ padding: '12px 16px' }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(229, 57, 53, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(229, 57, 53, 0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Notify Button */}
          <motion.button
            className="px-5 py-3 rounded-[10px] font-semibold text-white transition-all duration-300"
            style={{
              background: '#E53935',
              padding: '12px 20px',
            }}
            whileHover={{
              y: -2,
              boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Notify Me
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Card Stack */}
      {isMobile && (
        <div className="absolute bottom-10 left-0 right-0 px-6 flex flex-col gap-4 items-center">
          {floatingPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="w-[220px] p-4 rounded-[14px]"
              style={{
                background: 'rgba(20, 20, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#E53935' }}
                />
                <div>
                  <h4 className="text-[14px] font-semibold text-white">{program.title}</h4>
                  <p className="text-[12px] text-[#9CA3AF]">{program.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
