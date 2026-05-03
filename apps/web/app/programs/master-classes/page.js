'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import WhyJoinProgramSection from '@/components/WhyJoinProgramSection';
import CTAStripSection from '@/components/CTAStripSection';
import ProgramTimelineSection from '@/components/ProgramTimelineSection';
import ModulesSection from '@/components/ModulesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import OutcomesSection from '@/components/OutcomesSection';
import MentorsSection from '@/components/MentorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import DemoClassesSection from '@/components/DemoClassesSection';

// Import all required CSS
import '../../../styles/why-join-program.css';
import '../../../styles/cta-strip.css';
import '../../../styles/program-timeline-responsive.css';
import '../../../styles/modules-section.css';
import '../../../styles/how-it-works.css';
import '../../../styles/outcomes-section.css';
import '../../../styles/mentors-section.css';
import '../../../styles/testimonials-section.css';
import '../../../styles/faq-section.css';
import '../../../styles/demo-classes.css';

export default function MasterClassesPage() {
  return (
    <div className="master-classes-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Background Elements */}
        <div className="hero-floating-bg">
          <motion.div
            className="float-shape float-circle-1"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="float-shape float-circle-2"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="float-shape float-square-1"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="float-shape float-triangle-1"
            animate={{
              rotate: [0, 120, 240, 360],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="container">
          <div className="hero-content-wrapper-new">
            {/* Left Side Cards */}
            <div className="hero-floating-cards left-cards">
              <motion.div
                className="feature-card-float white-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="float-card-title">ADVANCED LEARNING</div>
                <div className="float-card-subtitle">Expert-led master classes</div>
              </motion.div>

              <motion.div
                className="feature-card-float red-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1" />
                    <path d="M3 21h18" />
                  </svg>
                </div>
                <div className="float-card-title">CERTIFIED SKILLS</div>
                <div className="float-card-subtitle">Industry-recognized certifications</div>
              </motion.div>

              <motion.div
                className="feature-card-float white-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <div className="float-card-title">EXPERT GUIDANCE</div>
                <div className="float-card-subtitle">Learn from industry veterans</div>
              </motion.div>
            </div>

            {/* Center Content */}
            <motion.div
              className="hero-center-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="hero-title-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Master Your Skills with <span className="title-underline">Expert-Led</span> Classes
              </motion.h1>

              <motion.p
                className="hero-description-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Elevate your entrepreneurial journey with our comprehensive Master Classes program.
                Gain advanced knowledge, practical skills, and industry insights from seasoned
                professionals. Transform your potential into extraordinary achievements.
              </motion.p>

              <motion.div
                className="hero-actions-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/signup">
                  <button className="btn-hero-primary">
                    <span>Enroll Now</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side Cards */}
            <div className="hero-floating-cards right-cards">
              <motion.div
                className="feature-card-float red-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="float-card-title">NETWORKING</div>
                <div className="float-card-subtitle">Connect with peers & mentors</div>
              </motion.div>

              <motion.div
                className="feature-card-float white-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <div className="float-card-title">HANDS-ON PROJECTS</div>
                <div className="float-card-subtitle">Real-world application experience</div>
              </motion.div>

              <motion.div
                className="feature-card-float red-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="float-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="float-card-title">VIDEO CONTENT</div>
                <div className="float-card-subtitle">High-quality recorded sessions</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Program Section */}
      <WhyJoinProgramSection />

      {/* Program Timeline Section */}
      <ProgramTimelineSection />

      {/* Modules Section */}
      <ModulesSection />

      {/* Demo Classes Section */}
      <DemoClassesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Outcomes Section */}
      {/* <OutcomesSection /> */}

      {/* Mentors Section */}
      <MentorsSection />

      {/* CTA Strip Section */}
      <CTAStripSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
