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

// Import all required CSS - using relative paths from the new location
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

export default function PreIncubationBlueprintPage() {
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
              ease: "linear"
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
              ease: "easeInOut"
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
              ease: "easeInOut"
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
              ease: "easeInOut"
            }}
          >
            💡
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
              ease: "easeInOut"
            }}
          >
            🎯
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
              ease: "easeInOut"
            }}
          >
            ✨
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
              ease: "easeInOut"
            }}
          >
            🚀
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
              ease: "linear"
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
                <div className="float-card-icon">🎓</div>
                <div className="float-card-title">EXPERT MENTORSHIP</div>
                <div className="float-card-subtitle">Learn from industry leaders</div>
              </motion.div>

              <motion.div 
                className="feature-card-float red-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="float-card-icon">💰</div>
                <div className="float-card-title">FUNDING ACCESS</div>
                <div className="float-card-subtitle">Angles | VCs | Govt Grants</div>
              </motion.div>

              <motion.div 
                className="feature-card-float white-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="float-card-icon">🚀</div>
                <div className="float-card-title">FAST-TRACK PROGRAM</div>
                <div className="float-card-subtitle">4-week intensive Pre Incubation Program</div>
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
                From Zero to Launch: The <span className="title-underline">Blueprint</span>
              </motion.h1>
              
              <motion.p 
                className="hero-description-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transform your startup vision into reality with our comprehensive Pre-Incubation Blueprint. Get the mentorship, idea validation, and MVP support you need to pitch investors and scale your venture. Designed exclusively for student founders and early-stage entrepreneurs.
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
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
                <div className="float-card-icon">📊</div>
                <div className="float-card-title">MARKET VALIDATION</div>
                <div className="float-card-subtitle">Research & customer insights</div>
              </motion.div>

              <motion.div 
                className="feature-card-float white-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="float-card-icon">🤝</div>
                <div className="float-card-title">NETWORKING HUB</div>
                <div className="float-card-subtitle">Connect with 5000+ founders</div>
              </motion.div>

              <motion.div 
                className="feature-card-float red-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="float-card-icon">⚡</div>
                <div className="float-card-title">MVP DEVELOPMENT</div>
                <div className="float-card-subtitle">Build & launch your product</div>
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
