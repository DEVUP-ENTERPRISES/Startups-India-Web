'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/about-hero.css';

const ABOUT_PHRASES = [
  'innovation journey',
  'startup ecosystem',
  'entrepreneurial dream',
  'business transformation',
  'founder roadmap',
];

const ABOUT_STATS = [
  { value: '5000+', label: 'Startups' },
  { value: '200+', label: 'Mentors' },
  { value: '95%', label: 'Success Rate' },
];

export default function AboutHero() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [animState, setAnimState] = useState('in');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const handleStartJourney = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/programs');
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState('out');
      setTimeout(() => {
        setTextIndex(current => (current + 1) % ABOUT_PHRASES.length);
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
    <section className={`about-hero ${isLoaded ? 'loaded' : ''}`} ref={sectionRef}>
      <canvas ref={canvasRef} className="about-hero-canvas" />
      <div
        className="cursor-glow"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
        }}
      />
      <div className="about-hero-content">
        <div className="hero-tag fade-in-element">ABOUT US</div>

        <h1 className={`hero-title ${isLoaded ? 'animate' : ''}`}>
          Building the Future of <br />
          <span className={`highlight-red dynamic-text anim-${animState}`}>
            {ABOUT_PHRASES[textIndex]}
          </span>
        </h1>

        <div className="hero-description fade-in-element" style={{ animationDelay: '0.1s' }}>
          <p>
            We are a startup ecosystem platform connecting founders, innovators, mentors, and
            partners to transform ideas into successful ventures.
          </p>
          <p>
            From the first spark of innovation to scaling real businesses, we're here to support
            your complete entrepreneurial journey.
          </p>
        </div>

        <div className="hero-stats-row fade-in-element" style={{ animationDelay: '0.15s' }}>
          {ABOUT_STATS.map((stat, index) => (
            <div key={index} className="hero-stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-ctas fade-in-element" style={{ animationDelay: '0.2s' }}>
          <button onClick={handleStartJourney} className="hero-btn-primary">
            Start Your Journey
          </button>
          <Link href="/programs" className="hero-btn-secondary">
            View Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
