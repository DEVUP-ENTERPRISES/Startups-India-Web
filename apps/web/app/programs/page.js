'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Award, Rocket, Sparkles } from 'lucide-react';
import '../../styles/programs-overview.css';

export default function ProgramsPage() {
  const programs = [
    {
      title: 'Pre-Incubation',
      description:
        'Transform your vision into a viable business concept. We focus on idea validation, market fit, and building your first MVP with expert guidance.',
      href: '/programs/pre-incubation',
      icon: Target,
      features: ['Idea Validation', 'MVP Development', 'Mentorship', 'Early Funding'],
    },
    {
      title: 'Incubation',
      description:
        'A comprehensive support system for early-stage startups. Gain access to dedicated workspace, legal support, and our vast network of partners.',
      href: '/programs/incubation',
      icon: Users,
      features: ['Full Incubation', 'Strategic Network', 'Legal Support', 'Market Access'],
    },
    {
      title: 'Master Classes',
      description:
        'Exclusive, high-impact training led by industry legends. Deep-dive into scaling strategies, capital raising, and global growth tactics.',
      href: '/programs/master-classes',
      icon: Award,
      features: ['Elite Sessions', 'Certifications', 'Global Network', 'Advanced Skills'],
      isComingSoon: true
    },
  ];

  return (
    <div className="programs-overview-page">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="programs-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Elite <span className="highlight">Programs</span> for Visionary Founders
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Whether you're validating an idea or ready to scale globally, our ecosystem provides the infrastructure, capital, and mentorship you need to win.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMS GRID ────────────────────────────────────────────────── */}
      <section className="programs-grid-section">
        <div className="container">
          <div className="programs-grid">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                className="program-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="program-icon">
                  <program.icon size={30} />
                </div>
                
                {program.isComingSoon && (
                  <span className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-[#E53935] bg-red-50 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}

                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>

                <div className="program-features">
                  {program.features.map((feature, featureIndex) => (
                    <span key={featureIndex} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href={program.href} className="program-link">
                  View Program Details <span><ArrowRight size={16} /></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC CTA SECTION ────────────────────────────────────────── */}
      <section className="programs-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="cta-icon-wrapper">
              <Rocket size={40} />
            </div>
            <h2>Ready to Build the Future?</h2>
            <p>
              Join the elite ecosystem where high-impact ventures are born. Our strategic board is ready to review your vision.
            </p>
            <div className="cta-buttons">
              <Link href="/signup" className="btn-primary-new">
                Start Your Journey
              </Link>
              <Link href="/contact" className="btn-secondary-new">
                Talk to an Advisor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
