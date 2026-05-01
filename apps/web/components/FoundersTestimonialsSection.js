'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Rocket, Target, Users } from 'lucide-react';
import '../styles/founders-testimonials.css';

const founders = [
  {
    quote:
      'The corporate partnerships we built through IEC opened doors we never thought possible. Our revenue grew ',
    highlight: '5x in just two years.',
    name: 'Arjun Mehta',
    role: 'CO-FOUNDER',
    company: 'EDUTECH PLUS',
    category: 'EdTech',
    stat1: '5X REVENUE',
    stat2: '50+ PARTNERS',
    badge: 'E',
    status: 'SERIES A FUNDING',
  },
  {
    quote:
      "IEC's mentorship program transformed our startup. We went from a pitch deck to raising ",
    highlight: '$3M in seed funding within 8 months.',
    name: 'Priya Sharma',
    role: 'CEO & FOUNDER',
    company: 'HEALTHVENTURE',
    category: 'Healthcare',
    stat1: '$3M RAISED',
    stat2: '400% GROWTH',
    badge: 'H',
    status: 'SEED FUNDING',
  },
  {
    quote:
      'Being part of the IEC ecosystem gave us the network and resources we needed to scale from a small team to a ',
    highlight: 'pan-India presence.',
    name: 'Sneha Reddy',
    role: 'FOUNDER',
    company: 'AGRISMART',
    category: 'AgriTech',
    stat1: 'PAN-INDIA',
    stat2: '10K+ FARMERS',
    badge: 'A',
    status: 'BOOTSTRAPPED',
  },
];

export default function FoundersTestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(c => (c + 1) % founders.length);
  const prev = () => setCurrent(c => (c - 1 + founders.length) % founders.length);

  // Auto-play Carousel (8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 8000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="founders-section-light">
      <div className="iec-container">
        {/* Header */}
        <motion.div
          className="founders-header-minimal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="ecosystem-impact-tag">ECOSYSTEM IMPACT</span>
          <h2 className="founders-title-modern">
            Hear From Our <span className="accent-red">Successful Founders</span>
          </h2>
          <div className="header-underline-minimal"></div>
        </motion.div>

        {/* Testimonial Card */}
        <div className="testimonial-container-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="premium-testimonial-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* LEFT: Content (60%) */}
              <div className="testimonial-content-left">
                <div className="quote-icon-box">
                  <svg
                    width="84"
                    height="36"
                    viewBox="0 0 84 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.9, display: 'block' }}
                    aria-label="IEC quote mark"
                  >
                    {/* Open double-quote in red */}
                    <text
                      x="2"
                      y="32"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      fontSize="44"
                      fontWeight="bold"
                      fill="#E53935"
                    >{'\u201C'}</text>
                    {/* Vertical divider */}
                    <line x1="50" y1="6" x2="50" y2="30" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                    {/* IEC label */}
                    <text
                      x="58"
                      y="24"
                      fontFamily="Inter, Arial, sans-serif"
                      fontSize="13"
                      fontWeight="700"
                      fill="rgba(255,255,255,0.5)"
                      letterSpacing="2"
                    >IEC</text>
                  </svg>
                </div>

                <h3 className="main-testimonial-text !text-white drop-shadow-md">
                  {founders[current].quote}
                  <span className="text-highlight-red !text-[#e53935]">{founders[current].highlight}</span>
                </h3>

                <div className="founder-stats-pills">
                  <div className="stat-pill-glass !text-white">
                    <Rocket size={14} className="accent-red-icon !text-[#e53935]" />
                    <span>{founders[current].stat1}</span>
                  </div>
                  <div className="stat-pill-glass !text-white">
                    <Target size={14} className="accent-red-icon !text-[#e53935]" />
                    <span>{founders[current].stat2}</span>
                  </div>
                </div>

                <div className="founder-profile-info">
                  <div className="author-line-red"></div>
                  <div className="profile-text">
                    <h4 className="profile-name !text-white">{founders[current].name}</h4>
                    <p className="profile-meta !text-gray-300">
                      {founders[current].role},{' '}
                      <span className="company-name-red !text-[#e53935]">{founders[current].company}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Visual Mockup (40%) */}
              <div className="testimonial-visual-right">
                <div className="visual-mock-container">
                  <div className="mock-inner-glass">
                    {/* Simplified UI Mock elements */}
                    <div className="mock-browser-bar">
                      <div className="browser-dot"></div>
                      <div className="browser-dot"></div>
                      <div className="browser-dot"></div>
                    </div>

                    <div className="mock-content-body">
                      {/* Floating Profile Badge */}
                      <div className="floating-badge-accent">
                        <span>{founders[current].badge}</span>
                      </div>
                      <p className="mock-company-title">{founders[current].company}</p>
                      <div className="mock-status-chip">
                        <div className="dot-blink"></div>
                        <span>{founders[current].status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation */}
          <div className="carousel-nav-controls">
            <button className="nav-arrow-btn" onClick={prev}>
              <ChevronLeft size={20} />
            </button>
            <div className="nav-dots-wrapper">
              {founders.map((_, idx) => (
                <div
                  key={idx}
                  className={`nav-dot-indicator ${idx === current ? 'active' : ''}`}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
            <button className="nav-arrow-btn" onClick={next}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
