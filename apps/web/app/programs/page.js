'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Award, BookOpen } from 'lucide-react';
import '../../styles/programs-overview.css';

export default function ProgramsPage() {
  const programs = [
    {
      title: 'Pre-Incubation',
      description:
        '8-week intensive program for idea validation, MVP development, and investor-ready pitch preparation.',
      href: '/programs/pre-incubation',
      icon: Target,
      features: ['Idea Validation', 'MVP Development', 'Mentorship', 'Funding Access'],
      color: 'red',
    },
    {
      title: 'Incubation',
      description:
        'Comprehensive incubation support for early-stage startups with full ecosystem access.',
      href: '/programs/incubation',
      icon: Users,
      features: ['Full Incubation', 'Office Space', 'Legal Support', 'Market Access'],
      color: 'blue',
    },
    {
      title: 'Master Classes',
      description:
        'Advanced training programs with industry experts for skill development and certification.',
      href: '/programs/master-classes',
      icon: Award,
      features: ['Expert Training', 'Certifications', 'Networking', 'Projects'],
      color: 'green',
    },
  ];

  return (
    <div className="programs-overview-page">
      {/* Hero Section */}
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
              Our <span className="highlight">Programs</span>
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Choose the perfect program to accelerate your startup journey. From idea validation to
              scaling, we provide comprehensive support at every stage of your entrepreneurial path.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="programs-grid-section">
        <div className="container">
          <div className="programs-grid">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <motion.div
                  key={index}
                  className={`program-card ${program.color}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="program-icon">
                    <IconComponent size={32} />
                  </div>
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
                    Learn More
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="programs-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <BookOpen size={48} className="cta-icon" />
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of entrepreneurs who have transformed their ideas into successful
              businesses.
            </p>
            <div className="cta-buttons">
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
