'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000 };
    let particle = { x: -1000, y: -1000 };
    const trail = [];
    const TRAIL_LENGTH = 15;
    const PRIMARY_COLOR = '#E53935';
    let animationFrameId;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Use clearRect for transparent background so it seamlessly overlays on user's content
      ctx.clearRect(0, 0, width, height);

      const lerpFactor = 0.12;
      
      if (particle.x === -1000 && mouse.x !== -1000) {
        particle.x = mouse.x;
        particle.y = mouse.y;
      } else if (mouse.x !== -1000) {
        particle.x += (mouse.x - particle.x) * lerpFactor;
        particle.y += (mouse.y - particle.y) * lerpFactor;
      }

      const isMobile = window.innerWidth <= 768;

      if (!isMobile && particle.x !== -1000) {
        trail.push({ x: particle.x, y: particle.y });
        if (trail.length > TRAIL_LENGTH) {
          trail.shift();
        }

        for (let i = 0; i < trail.length; i++) {
          const pt = trail[i];
          const progress = i / trail.length;
          const trailSize = 3 * progress;
          
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(trailSize, 0.1), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 57, 53, ${progress * 0.5})`;
          ctx.fill();
        }
      }

      if (particle.x !== -1000) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
        const isIdle = distanceToMouse < 1.0;

        let currentSize = 5;
        if (isIdle) {
          currentSize += Math.sin(Date.now() * 0.003) * 1.5;
        }

        ctx.shadowColor = PRIMARY_COLOR;
        
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 57, 53, 0.5)`;
        ctx.fill();

        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = PRIMARY_COLOR;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}
