'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import '../styles/network-hero.css';

const PHRASES = [
  'startup journey',
  'business idea',
  'funding roadmap',
  'entrepreneurial vision',
  'innovation pathway',
];

const FLOATING_STATS = [
  { value: '5000+', label: 'Startups' },
  { value: '200+', label: 'Mentors' },
  { value: '24/7', label: 'Support' },
];

export default function NetworkHero() {
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



  return (
    <section className={`network-hero ${isLoaded ? 'loaded' : ''}`} ref={sectionRef}>
      <div className="hero-content-wrapper">
        <div className="hero-tag fade-in-element">EXPERT MENTORSHIP</div>

        <h1 className={`hero-title ${isLoaded ? 'animate' : ''}`}>
          Start your innovation and <br />
          <span className={`highlight-red dynamic-text anim-${animState}`}>
            {PHRASES[textIndex]}
          </span>
        </h1>

        <div className="hero-pills fade-in-element" style={{ animationDelay: '0.1s' }}>
          <div className="hero-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Fast-Track Programs
          </div>
          <div className="hero-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
             Expert Mentors Network
          </div>
          <div className="hero-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
           
            Grants & Funding Support
          </div>
        </div>

        <div className="hero-ctas fade-in-element" style={{ animationDelay: '0.2s' }}>
          <Link href="/programs" className="hero-btn-primary">
            Start Your Journey
          </Link>
          <Link href="/programs" className="hero-btn-secondary">
            View Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
