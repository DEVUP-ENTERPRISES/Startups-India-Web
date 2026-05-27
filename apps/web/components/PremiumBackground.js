'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function PremiumBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505] overflow-hidden">
      {/* Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-red-600/10 blur-[120px] rounded-full opacity-60" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-red-900/10 blur-[120px] rounded-full opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-radial-gradient(circle, rgba(255,59,59,0.03) 0%, transparent 70%)" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 59, 59, 0.2) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255, 59, 59, 0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated Particles */}
      {isMounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-red-500/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Cursor Glow */}
      {isMounted && (
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15]"
          animate={{
            x: mousePos.x - 400,
            y: mousePos.y - 400,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 80, mass: 1 }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 59, 59, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      )}

      {/* Subtle Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id="premium-grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FF3B3B" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#FF3B3B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#premium-grid)" />
      </svg>
    </div>
  );
}
