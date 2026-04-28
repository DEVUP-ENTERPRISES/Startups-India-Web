'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Sprout,
  Handshake,
  Rocket,
  Target,
  Star,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Zap,
  Coins,
  Library,
  UserCheck,
} from 'lucide-react';
import '../../styles/about-modern.css';
import TeamSection from '@/components/TeamSection';
import AboutHero from '@/components/AboutHero';
import EcosystemImpactRoadmap from '@/components/EcosystemImpactRoadmap';
import '../../styles/ecosystem-roadmap.css';

export default function AboutUs() {
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = e => {
      const cards = document.querySelectorAll(
        '.icon-box, .card, .feature-card, .about-card, .mission-card, .approach-card, .what-card, .impact-roadmap-card, .hero-stat-item, .stat-item'
      );
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        // Keep old vars for other card types if needed
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <AboutHero />

      <div className="about-page">
        {/* Who We Are - Dark */}
        <section className="who-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="section-header">
                <div className="section-label">Our Story</div>
                <h2 className="section-title">Who We Are</h2>
              </div>

              <div className="who-content">
                <p className="who-description">
                  Startups India is a startup ecosystem platform built to support the complete
                  entrepreneurial journey—from the first spark of an idea to building and scaling a
                  real startup. We exist to connect founders, innovators, students, mentors, and
                  ecosystem partners under one collaborative platform where learning turns into
                  execution.
                </p>
                <div className="who-highlight">
                  <p>
                    We strongly believe that great startups are not built in isolation. They grow
                    when the right guidance, opportunities, and ecosystem support come together at
                    the right time.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Stand For - Light */}
        <section className="stand-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">Our Values</div>
                <h2 className="section-title">What We Stand For</h2>
                <p className="section-description">
                  At Startups India, we stand for innovation, entrepreneurship, and impact.
                </p>
              </div>

              <div className="stand-grid">
                <div className="icon-box">
                  <div className="stand-icon">
                    <Lightbulb size={24} />
                  </div>
                  <h3>Ideas are Encouraged</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Sprout size={24} />
                  </div>
                  <h3>Innovation is Nurtured</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Handshake size={24} />
                  </div>
                  <h3>Founders are Supported</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Rocket size={24} />
                  </div>
                  <h3>Startups are Built with Clarity</h3>
                </div>
              </div>

              <div className="stand-statement">
                <p>
                  We are not just a service provider—we are an <strong>ecosystem enabler</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do - Dark */}
        <section className="what-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">Our Services</div>
                <h2 className="section-title">What We Do as a Startup Ecosystem Platform</h2>
                <p className="section-description">
                  We help founders and aspiring entrepreneurs at every stage by providing structured
                  support and real-world exposure.
                </p>
              </div>

              <div className="what-grid">
                <div className="what-card">
                  <div className="what-number">01</div>
                  <h3>For Startup Ideas & Innovation</h3>
                  <ul>
                    <li>Help individuals identify real-world problems</li>
                    <li>Support idea validation and innovation thinking</li>
                    <li>Guide founders to convert ideas into viable startup concepts</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">02</div>
                  <h3>For Founders & Entrepreneurs</h3>
                  <ul>
                    <li>Provide mentorship from experienced professionals</li>
                    <li>Offer structured programs like pre-incubation and incubation</li>
                    <li>Help founders understand business models, markets, and execution</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">03</div>
                  <h3>For Early-Stage Startups</h3>
                  <ul>
                    <li>Support product-market fit and go-to-market strategy</li>
                    <li>Prepare startups for pitching and fundraising</li>
                    <li>Enable connections with investors and ecosystem partners</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">04</div>
                  <h3>For Students & Institutions</h3>
                  <ul>
                    <li>Create startup awareness and entrepreneurial mindset</li>
                    <li>Conduct workshops, bootcamps, and ecosystem programs</li>
                    <li>Bridge the gap between academics and real startup exposure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Light */}
        <section className="mission-section">
          <div className="container">
            <div>
              <div className="mission-grid">
                <div className="mission-card">
                  <div className="mission-icon">
                    <Target size={24} />
                  </div>
                  <h3>Our Mission</h3>
                  <p>
                    To empower founders and innovators with the right mindset, skills, mentorship,
                    and ecosystem access so they can build sustainable and impactful startups.
                  </p>
                </div>

                <div className="mission-card">
                  <div className="mission-icon">
                    <Star size={24} />
                  </div>
                  <h3>Our Vision</h3>
                  <p>
                    To build a strong, inclusive, and future-ready startup ecosystem that supports
                    innovation, job creation, and economic growth—especially among students and
                    first-time founders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EcosystemImpactRoadmap />

        {/* Our Approach - Light */}
        <section className="approach-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">Our Methodology</div>
                <h2 className="section-title">Our Approach</h2>
                <p className="section-description">Our approach is simple and practical</p>
              </div>

              <div className="approach-grid">
                <div className="approach-card">
                  <div className="approach-icon">
                    <Target size={24} />
                  </div>
                  <h3>Learn by Doing</h3>
                  <p>Not just theory</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Users size={24} />
                  </div>
                  <h3>Founder-First Mindset</h3>
                  <p>Your success is our priority</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Zap size={24} />
                  </div>
                  <h3>Execution Over Ideas</h3>
                  <p>Action drives results</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Handshake size={24} />
                  </div>
                  <h3>Community-Driven Growth</h3>
                  <p>We grow together</p>
                </div>
              </div>

              <div className="approach-statement">
                <p>
                  Every program, event, and initiative is designed to deliver{' '}
                  <strong>real outcomes</strong>, not just certificates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Dark */}
        <section className="why-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">Why Us</div>
                <h2 className="section-title">Why Startups India</h2>
              </div>

              <div className="why-grid">
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>Clear focus on founders, innovation, and startup ideas</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>Practical ecosystem-driven programs</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>Strong mentor and partner network</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>Long-term support beyond one-time events</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>Community that grows together</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment - Light */}
        <section className="commitment-section">
          <div className="container">
            <motion.div
              className="commitment-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Our Commitment</h2>
              <p>
                At Startups India, we are committed to helping people believe in their ideas, build
                with confidence, and grow with the ecosystem.
              </p>
              <p>
                Whether you are a student exploring entrepreneurship, a founder validating an idea,
                or a startup ready to scale—we are here to support your journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <TeamSection />

        {/* CTA Section - Dark */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Have an Idea? A Vision? A Startup Dream?</h2>
              <p>
                Join our ecosystem and take your first step toward building something meaningful.
              </p>
              <button className="cta-button">Join Our Ecosystem</button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
