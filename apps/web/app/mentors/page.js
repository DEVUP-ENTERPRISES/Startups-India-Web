'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  TrendingUp,
  GraduationCap,
  Network,
  Target,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Star,
  BriefcaseBusiness,
  Building2,
  Briefcase,
  Search
} from 'lucide-react';
import MentorRegistrationModal from '@/components/MentorRegistrationModal';
import ExploreMentorsModal from '@/components/ExploreMentorsModal';
import ScrollToTop from '@/components/ScrollToTop';
import '../../styles/mentors-final.css';
import '../../styles/mentors-sections.css';
import '../../styles/modal.css';

export default function MentorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [mentors, setMentors] = useState([]);
  const loading = false;

  const defaultMentors = [
    {
      id: 1,
      full_name: 'Bharat Bhushan Rallapalli',
      current_role: '(Retd) IB Office GoI and FOUNDER & MANAGING DIRECTOR',
      company: 'PRAGMA EDUCATION',
      expertise: ['Startup Mentor', 'Life Skills Coach', 'Political Strategist'],
      experience: '8+ years',
      previous_companies: ['Government of India'],
      profile_image: '/assets/images/Bhushan-pragma.jpg',
      rating: 4.9,
      total_mentees: 120,
      total_sessions: 450,
    },
    {
      id: 2,
      full_name: 'Raghunatha Chary',
      current_role: 'FOUNDER | MENTOR | AUTHOR',
      company: 'RevFirst Systems',
      expertise: ['Startup Mentor', 'Revenue Strategy', 'GTM Design'],
      experience: '10+ years',
      previous_companies: ['Teleperformance Global Services Ltd'],
      profile_image: '/assets/images/Raghunatha-Chary.jpg',
      rating: 4.9,
      total_mentees: 95,
      total_sessions: 380,
    },
    {
      id: 3,
      full_name: 'Dr.Venugopal Gandham',
      current_role: 'GLOBAL IT DIRECTOR',
      company: 'Teleperformance Global Services Ltd',
      expertise: ['Cyber Security Expert', 'AI Driven Expert', 'Team Management'],
      experience: '10+ years',
      previous_companies: ['IT Infrastructure'],
      profile_image: '/assets/images/Dr.Venugopal Gandham.jpg',
      rating: 4.9,
      total_mentees: 110,
      total_sessions: 420,
    },
    {
      id: 4,
      full_name: 'Raghu Vasishth',
      current_role: 'ADVOCATE',
      company: 'Supreme Court of India',
      expertise: ['Criminal Law', 'Labor Law', 'Legal Aid'],
      experience: '14+ years',
      previous_companies: ['Legal Services'],
      profile_image: '/assets/images/raghu-vasishth.jpg',
      rating: 4.9,
      total_mentees: 85,
      total_sessions: 340,
    },
    {
      id: 5,
      full_name: 'Avinash Tilekar',
      current_role: 'Business Model Expert',
      company: 'Startups India',
      expertise: ['Business Planning', 'Market Strategy', 'Scaling'],
      experience: '12+ years',
      previous_companies: ['Strategy Consultant'],
      profile_image: '/assets/images/Avinash Tilekar.jpg',
      rating: 4.8,
      total_mentees: 70,
      total_sessions: 280,
    },
    {
      id: 6,
      full_name: 'Ravi Tilekar',
      current_role: 'Pre-incubation Specialist',
      company: 'Startups India',
      expertise: ['Entrepreneurship', 'Idea Validation', 'Mindset'],
      experience: '10+ years',
      previous_companies: ['Incubation Lead'],
      profile_image: '/assets/images/Ravi Tilekar.jpg',
      rating: 4.9,
      total_mentees: 90,
      total_sessions: 320,
    },
    {
      id: 7,
      full_name: 'Vishwaraj Saude',
      current_role: 'Product & Tech Advisor',
      company: 'Innovation Lab',
      expertise: ['Product Management', 'Tech Strategy', 'MVP Development'],
      experience: '8+ years',
      previous_companies: ['Tech Lead'],
      profile_image: '/assets/images/Vishwaraj.jpg',
      rating: 4.7,
      total_mentees: 65,
      total_sessions: 240,
    },
    {
      id: 8,
      full_name: 'Vijay',
      current_role: 'Operations Head',
      company: 'Startups India',
      expertise: ['Operations', 'Supply Chain', 'Logistics'],
      experience: '15+ years',
      previous_companies: ['Logistics Expert'],
      profile_image: '/assets/images/Vijay.jpg',
      rating: 4.9,
      total_mentees: 150,
      total_sessions: 600,
    },
  ];

  const displayMentors = mentors.length > 0 ? mentors : defaultMentors;

  return (
    <div className="mentors-page">
      {/* Hero Section */}
      <section className="mentors-hero">
        {/* Animated Background */}
        <div className="hero-animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        {/* Floating Grid Pattern with Stars */}
        <div className="hero-grid-pattern"></div>

        <div className="container">
          <div className="hero-content">
            {/* <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Expert Mentorship
            </motion.div> */}

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Building a Strong <span className="title-highlight">Mentor Network</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At Startups India, mentors are a vital part of our startup ecosystem. They bring
              industry experience, strategic insight, and practical knowledge that strengthen
              founders, innovators, and startup programs.
            </motion.p>

            <motion.div
              className="hero-cta-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="hero-cta-primary">
                Find Your Mentor
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button className="hero-cta-secondary" onClick={() => setShowModal(true)}>
                Become a Mentor
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Expert Mentors</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Mentees Guided</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2000+</div>
                <div className="stat-label">Sessions Delivered</div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Role of Mentors Section */}
      <section className="role-section">
        <div className="container">
          <motion.div
            className="role-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <div className="impact-badge">ECOSYSTEM IMPACT</div>
            <h2>
              Role of Mentors in Our
              <span className="highlight-red">Ecosystem</span>
            </h2>
            <p className="section-subtitle">
              Mentors associated with Startups India contribute meaningfully to our startup
              community
            </p>
          </motion.div>

          <div className="role-grid">
            {/* Support Founders */}
            <motion.div
              className="role-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'backOut' }}
              viewport={{ once: true }}
            >
              <div className="role-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                  <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                  <circle cx="12" cy="10" r="2"></circle>
                  <line x1="8" y1="2" x2="8" y2="4"></line>
                  <line x1="16" y1="2" x2="16" y2="4"></line>
                </svg>
              </div>
              <h3>Support Founders</h3>
              <p>
                Guide founders through curated programs and initiatives designed to accelerate
                growth and operational excellence.
              </p>
            </motion.div>

            {/* Share Expertise */}
            <motion.div
              className="role-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'backOut' }}
              viewport={{ once: true }}
            >
              <div className="role-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.5 2C11.5 2 13 3.5 13 5.5v0c0 .8-.3 1.5-.8 2.1L10.5 10H14c2.2 0 4 1.8 4 4v0c0 2.2-1.8 4-4 4h-4l-3 3v-3H6c-2.2 0-4-1.8-4-4v0c0-2.2 1.8-4 4-4h1l1.5-2.3c-.5-.6-.8-1.3-.8-2.1v0C7.7 3.5 9.2 2 11.2 2h-1.7Z"></path>
                  <circle cx="10" cy="6" r="1" fill="#22d3ee"></circle>
                </svg>
              </div>
              <h3>Share Expertise</h3>
              <p>
                Contribute during workshops and events, translating complex industry insights into
                actionable strategies for emerging talent.
              </p>
            </motion.div>

            {/* Strengthen Innovation */}
            <motion.div
              className="role-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'backOut' }}
              viewport={{ once: true }}
            >
              <div className="role-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.5-1 1.35-2.35L12 15Z"></path>
                  <path d="M12 15v5s1-.5 2.35-1.35L9 12Z"></path>
                </svg>
              </div>
              <h3>Strengthen Innovation</h3>
              <p>
                Support pre-incubation and incubation initiatives to foster disruptive technologies
                and sustainable business models.
              </p>
            </motion.div>

            {/* Ecosystem Advisors */}
            <motion.div
              className="role-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: 'backOut' }}
              viewport={{ once: true }}
            >
              <div className="role-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 11 11 13 15 9"></polyline>
                </svg>
              </div>
              <h3>Ecosystem Advisors</h3>
              <p>
                Act as role models and strategic advisors, shaping the long-term vision and ethical
                standards of the startup landscape.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mentor Onboarding Process */}
      <section className="onboarding-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title-center">Mentor Onboarding Process</h2>
            <p className="section-subtitle-center">
              Join our verified mentor network in three simple steps
            </p>

            <div className="onboarding-steps">
              {/* Step 01 */}
              <motion.div
                className="onboarding-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-header-meta">
                  <motion.div className="step-icon-premium" whileHover={{ rotate: 15 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </motion.div>
                  <span className="step-label-top">Step 01</span>
                </div>
                <div className="step-content">
                  <h3>
                    Mentor <br />
                    Registration
                  </h3>
                  <ul className="premium-list">
                    {[
                      'Full name & contact details',
                      'Professional background',
                      'Area of expertise & years of experience',
                      'LinkedIn / professional profile',
                    ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                  <button className="step-action-btn-premium" onClick={() => setShowModal(true)}>
                    Apply to Become a Mentor
                  </button>
                </div>
              </motion.div>

              {/* Step 02 */}
              <motion.div
                className="onboarding-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-header-meta">
                  <motion.div className="step-icon-premium" whileHover={{ rotate: 15 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </motion.div>
                  <span className="step-label-top">Step 02</span>
                </div>
                <div className="step-content">
                  <h3>
                    Internal Review <br />& Approval
                  </h3>
                  <ul className="premium-list">
                    {[
                      {
                        icon: (
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        ),
                        text: 'Relevant experience evaluation',
                      },
                      {
                        icon: <circle cx="12" cy="12" r="10"></circle>,
                        text: 'Domain knowledge assessment',
                      },
                      {
                        icon: <path d="M12 2L2 7l10 5 10-5-10-5z"></path>,
                        text: 'Ecosystem contribution potential',
                      },
                    ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    className="priority-review-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="priority-header">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      PRIORITY REVIEW
                    </div>
                    <p className="priority-text">
                      Only approved mentors are onboarded into our ecosystem.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Step 03 */}
              <motion.div
                className="onboarding-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="step-header-meta">
                  <motion.div className="step-icon-premium" whileHover={{ rotate: 15 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </motion.div>
                  <span className="step-label-top">Step 03</span>
                </div>
                <div className="step-content">
                  <h3>
                    Profile Creation <br />& Listing
                  </h3>
                  <ul className="premium-list">
                    {[
                      {
                        icon: <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>,
                        text: 'Verified mentor profile created',
                      },
                      {
                        icon: <circle cx="12" cy="12" r="10"></circle>,
                        text: 'Featured on website & ecosystem materials',
                      },
                      {
                        icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>,
                        text: 'Showcased to strengthen network diversity',
                      },
                    ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    className="listing-preview-block"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="avatar-group-listing">
                      <img
                        className="avatar-listing"
                        src="/assets/images/Bhushan-pragma.jpg"
                        alt="Mentor"
                      />
                      <img
                        className="avatar-listing"
                        src="/assets/images/Raghunatha-Chary.jpg"
                        alt="Mentor"
                      />
                      <img
                        className="avatar-listing"
                        src="/assets/images/Dr.Venugopal Gandham.jpg"
                        alt="Mentor"
                      />
                      <div className="avatar-plus-listing">+</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Mentors Grid */}
      <section className="mentors-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Expert Mentors</h2>
            <p className="section-subtitle">Industry leaders ready to guide your startup journey</p>
          </div>

          {loading ? (
            <div className="loading-state">Loading mentors...</div>
          ) : (
            <>
              <div className="mentors-grid-elite">
                {/* Show 4 Mentor Cards */}
                {displayMentors.slice(0, 4).map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    className="mentor-card-elite"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mentor-card-inner">
                      {/* Front Face */}
                      <div className="mentor-card-front">
                        <div className="card-header-elite">
                          <div className="mentor-avatar-elite">
                            <img src={mentor.profile_image} alt={mentor.full_name} />
                          </div>
                          <div className="rating-badge-elite">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {mentor.rating}
                          </div>
                        </div>

                        <div className="card-body-elite">
                          <h3 className="mentor-name-elite">{mentor.full_name}</h3>
                          <p className="mentor-role-elite">{mentor.current_role}</p>
                          <div className="company-badge-elite">{mentor.company}</div>

                          <div className="expertise-tags-elite">
                            {mentor.expertise.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="tag-elite">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="mentor-meta-elite">
                            <div className="languages-elite">
                              <span className="language-tag">English</span>
                              <span className="language-tag">Hindi</span>
                              <span className="language-tag">Telugu</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Back Face - Premium Redesign */}
                      <div className="mentor-card-back">
                        {/* Subtle ambient glow behind */}
                        <div className="back-ambient-glow" />
                        
                        {/* Top: Rating & Close/Flip */}
                        <div className="back-top-bar">
                          <div className="rating-pill-glass">
                            <Star size={14} className="star-icon-red" fill="currentColor" />
                            <span>{mentor.rating || '4.9'}</span>
                          </div>
                          <div className="flip-icon-glass">
                            {/* Close SVG */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </div>
                        </div>

                        {/* Middle: About Section */}
                        <div className="back-middle-section">
                          <div className="section-header-pill">
                            {/* User SVG */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>About Mentor</span>
                          </div>
                          <p className="mentor-bio-short">
                            {mentor.current_role?.length > 120 
                              ? mentor.current_role.substring(0, 120) + '...' 
                              : mentor.current_role}
                          </p>
                          
                          <div className="back-divider" />
                          
                          <div className="section-header-pill">
                            <Briefcase size={16} className="text-[#ef4444]" />
                            <span>Expertise</span>
                          </div>
                          <div className="expertise-tags-premium">
                            {mentor.expertise?.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="tag-glass-pill">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action Area */}
                        <div className="back-action-area">
                          <div className="secondary-actions">
                            <a 
                              href={mentor.linkedin_url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="action-btn-glass"
                            >
                              {/* Linkedin SVG */}
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                              </svg>
                              <span>LinkedIn Profile</span>
                            </a>
                            <button className="action-btn-glass">
                              {/* Calendar SVG */}
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              <span>Book a Session</span>
                            </button>
                          </div>
                          
                          <button className="primary-cta-glow">
                            <span>View Full Profile</span>
                            <ArrowRight size={18} className="cta-arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Explore Mentors Button */}
              {/* <motion.div
              className="explore-mentors-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button 
                className="explore-mentors-btn"
                onClick={() => setShowExploreModal(true)}
              >
                <div className="btn-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="btn-content">
                  <span className="btn-title">Explore All Mentors</span>
                  <span className="btn-subtitle">View our complete mentor network</span>
                </div>
                <svg className="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </motion.div> */}

              {/* Second Row - Full Hero CTA */}
              <div className="bmc-inline-wrapper">
                <div className="bmc-dot-pattern"></div>
                <div className="bmc-gradient-orb"></div>
                <div className="bmc-inner">
                  <motion.div
                    className="opportunity-badge"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    OPPORTUNITY
                  </motion.div>

                  <motion.h2
                    className="bmc-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Become a Mentor
                  </motion.h2>

                  <motion.p
                    className="bmc-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Share your expertise and shape the future of startups
                  </motion.p>

                  <motion.div
                    className="bmc-features"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    viewport={{ once: true }}
                  >
                    {[
                      {
                        label: 'Flexible Schedule',
                        icon: (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Ecosystem Recognition',
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Impact Innovation',
                        icon: (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                            <path d="M9 12H4s.5-1 1.35-2.35L12 15Z" />
                            <path d="M12 15v5s1-.5 2.35-1.35L9 12Z" />
                          </svg>
                        ),
                      },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="bmc-feature-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="bmc-icon-circle">{feature.icon}</div>
                        <span>{feature.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.button
                    className="bmc-register-btn"
                    onClick={() => setShowModal(true)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    REGISTER NOW
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Who Can Apply Section */}
      <section className="who-can-apply-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="wca-title">Who Can Apply as a Mentor?</h2>
            <p className="wca-subtitle">
              If you have knowledge to share and want to contribute to the ecosystem, we welcome you
            </p>

            {/* Top row — 3 cards */}
            <div className="apply-grid-top">
              {[
                {
                  label: 'Entrepreneurs & Startup Founders',
                  icon: (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.5-1 1.35-2.35L12 15Z" />
                      <path d="M12 15v5s1-.5 2.35-1.35L9 12Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Industry Professionals',
                  icon: (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
                {
                  label: 'Corporate Leaders',
                  icon: (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="apply-card-dark"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(220,38,38,0.5)' }}
                >
                  <div className="apply-icon-dark">{item.icon}</div>
                  <h4 className="apply-label-dark">{item.label}</h4>
                </motion.div>
              ))}
            </div>

            {/* Bottom row — 2 wider cards */}
            <div className="apply-grid-bottom">
              {[
                {
                  label: 'Subject Matter Experts',
                  icon: (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ),
                },
                {
                  label: 'Advisors with Relevant Experience',
                  icon: (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="apply-card-dark"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(220,38,38,0.5)' }}
                >
                  <div className="apply-icon-dark">{item.icon}</div>
                  <h4 className="apply-label-dark">{item.label}</h4>
                </motion.div>
              ))}
            </div>

            {/* Commitment Block */}
            <motion.div
              className="commitment-dark"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="commitment-dark-left">
                <div className="commitment-badge">INSTITUTIONAL STANDARD</div>
                <h3 className="commitment-heading">
                  Our Commitment to
                  <br />
                  Mentors
                </h3>
                <div className="commitment-underline" />
              </div>
              <div className="commitment-dark-right">
                {[
                  'Professional onboarding and recognition',
                  'Clear role definition',
                  'Structured engagement opportunities',
                  'Long-term association within the ecosystem',
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    className="commitment-dark-item"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="commitment-dark-check">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title-center">
              Don't Just Take Our <span style={{ color: '#dc2626' }}>Word for it!</span>
            </h2>
            <p className="section-subtitle-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Hear what the community is saying about us
            </p>

            <div className="testimonials-grid">
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <svg
                  className="quote-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="testimonial-text">
                  "I spent great time talking with Meenakshi! We talked a lot about UX writing and
                  she gave me feedback about my portfolio. I gained valuable insights into the user
                  research process and received some..."
                </p>
                <div className="testimonial-author">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Alfiana Velasco"
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <h4 className="author-name">Alfiana Velasco</h4>
                    <p className="author-role">BA Hons, University of Barcelona</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <svg
                  className="quote-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="testimonial-text">
                  "I had a fantastic conversation with Alex! I learned a lot about the user
                  experience design process and received some constructive feedback on my portfolio.
                  Can't wait to..."
                </p>
                <div className="testimonial-author">
                  <img
                    src="https://randomuser.me/api/portraits/women/32.jpg"
                    alt="Musele Saria"
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <h4 className="author-name">Musele Saria</h4>
                    <p className="author-role">BSc(Hons), University of Montreal</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <svg
                  className="quote-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="testimonial-text">
                  "I had an amazing conversation with Alex! I gained valuable insights into the UX
                  Design process and received constructive feedback on my portfolio..."
                </p>
                <div className="testimonial-author">
                  <img
                    src="https://randomuser.me/api/portraits/men/45.jpg"
                    alt="Chutoe Saris"
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <h4 className="author-name">Chutoe Saris</h4>
                    <p className="author-role">Br(pt), University of Ottawa</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <svg
                  className="quote-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="testimonial-text">
                  "Just had a super fun chat with Meenakshi! Learned a ton about the UX design
                  process and got really constructive feedback on my portfolio."
                </p>
                <div className="testimonial-author">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Sarah Johnson"
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <h4 className="author-name">Sarah Johnson</h4>
                    <p className="author-role">MSc Design, Stanford University</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && <MentorRegistrationModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {/* Explore Mentors Modal */}
      <AnimatePresence>
        {showExploreModal && <ExploreMentorsModal onClose={() => setShowExploreModal(false)} />}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
