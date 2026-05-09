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
import FoundersTestimonialsSection from '@/components/FoundersTestimonialsSection';
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

export default function PreIncubationPage() {
  return (
    <div className="pre-incubation-page">
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
            className="float-icon float-icon-1"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffd700"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </motion.div>
          <motion.div
            className="float-icon float-icon-2"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="2"
            >
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22,8.5 12,15.5 2,8.5" />
              <polyline points="2,15.5 12,8.5 22,15.5" />
              <line x1="12" y1="2" x2="12" y2="8.5" />
            </svg>
          </motion.div>
          <motion.div
            className="float-icon float-icon-3"
            animate={{
              y: [0, -25, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ecdc4"
              strokeWidth="2"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </motion.div>
          <motion.div
            className="float-icon float-icon-4"
            animate={{
              y: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#45b7d1"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </motion.div>
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 2L2 22" />
                  </svg>
                </div>
                <div className="float-card-title">EXPERT MENTORSHIP</div>
                <div className="float-card-subtitle">Learn from industry leaders</div>
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
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="float-card-title">FUNDING ACCESS</div>
                <div className="float-card-subtitle">Angles | VCs | Govt Grants</div>
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
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="float-card-title">FAST-TRACK PROGRAM</div>
                <div className="float-card-subtitle">8-week intensive Pre Incubation Program</div>
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
                Transform Your Startup Vision Into <span className="title-underline">Reality</span>
              </motion.h1>

              <motion.p
                className="hero-description-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join Startupsindia's Pre-Incubation Program, Get the Mentorship, Idea Validation,
                Build Your MVP, Get reach for investment, pitch Investors.Designed exclusively for
                Students founders, early entreprenuers, and early Startups.
              </motion.p>

              <motion.div
                className="hero-actions-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/signup">
                  <button className="btn-hero-primary">
                    <span>Start Your Journey</span>
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <div className="float-card-title">MARKET VALIDATION</div>
                <div className="float-card-subtitle">Research & customer insights</div>
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="float-card-title">NETWORKING HUB</div>
                <div className="float-card-subtitle">Connect with 5000+ founders</div>
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
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="float-card-title">MVP DEVELOPMENT</div>
                <div className="float-card-subtitle">Build & launch your product</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Why Join Program Section - Premium dark glassmorphism */}
      <WhyJoinProgramSection />

      {/* 12. Program Timeline Section - 8-week journey */}
      <ProgramTimelineSection />

      {/* 13. Modules Section - Light theme modules */}
      <ModulesSection />

      {/* Demo Classes Section - Free Demo Videos */}
      <DemoClassesSection />

      {/* 14. How It Works Section - 3-step process */}
      <HowItWorksSection />

      {/* 15. Outcomes Section - Multi-colored impact cards */}
      {/* <OutcomesSection /> */}

      {/* 16. Mentors Section - Light bento grid layout */}
      <MentorsSection />

      {/* 11. CTA Strip Section - Light theme call-to-action */}
      <CTAStripSection />

      {/* 17. Testimonials Section - Pinterest-style testimonials */}
      <FoundersTestimonialsSection />

      {/* 18. FAQ Section - Accordion-style FAQs */}
      <FAQSection />
    </div>
  );
}
