'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const PHRASES = [
  'real-world exposure',
  'early customers',
  'market pilots',
  'industry connections',
  'validation opportunities',
];

export default function MarketAccessHero() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [animState, setAnimState] = useState('in');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState('out');
      setTimeout(() => {
        setTextIndex(current => (current + 1) % PHRASES.length);
        setAnimState('in');
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = e => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const numParticles = Math.min(Math.floor((width * height) / 12000), 100);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (dist < 80 && (i + j) % 4 === 0) {
              ctx.strokeStyle = `rgba(229, 57, 53, ${0.8 - dist / 100})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 180) * 0.15})`;
            }

            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={`network-hero ${isLoaded ? 'loaded' : ''}`} ref={sectionRef}>
      <canvas ref={canvasRef} className="network-canvas" />
      <div
        className="hero-cursor-glow"
        style={{
          left: `${mousePos.rawX}px`,
          top: `${mousePos.rawY}px`,
        }}
      />
      <div className="hero-content-wrapper">
        <div className="hero-tag-pill fade-in-element">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" style={{ color: '#ef4444' }}>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a10 10 0 0 0 6.64-10l.5-.5A2.12 2.12 0 0 0 12.15 5l-.5.5a10 10 0 0 0-10 6.64l-.5.5Z"/>
            <path d="m12 15-3-3"/>
          </svg>
          <span>WELCOME TO <span style={{ color: '#ef4444' }}>MARKET ACCESS</span></span>
        </div>

        <div className="hero-title-premium fade-in-element" style={{ animationDelay: '0.1s' }}>
          <h1 className="hero-static-line">
            From Idea Validation <br className="mobile-break" /> to
          </h1>
          <div className="rotating-text-container">
            <div className={`dynamic-rotating-line anim-${animState}`}>
              {PHRASES[textIndex]}
            </div>
          </div>
        </div>

        <div className="hero-feature-grid fade-in-element" style={{ animationDelay: '0.2s' }}>
          <div className="feature-card-minimal">
            <div className="feature-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="feature-text-stack">
              <h3>Structured Process</h3>
              <p>Step-by-step guidance</p>
            </div>
          </div>
          <div className="feature-card-minimal">
            <div className="feature-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="feature-text-stack">
              <h3>Industry Partners</h3>
              <p>Top-tier networks</p>
            </div>
          </div>
          <div className="feature-card-minimal">
            <div className="feature-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            </div>
            <div className="feature-text-stack">
              <h3>Validation & Feedback</h3>
              <p>Real-world exposure</p>
            </div>
          </div>
        </div>

        <div className="hero-actions-container fade-in-element" style={{ animationDelay: '0.3s' }}>
          <Link href="/signup" className="no-underline">
            <button className="btn-primary-premium">
              Apply for Market Access
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
