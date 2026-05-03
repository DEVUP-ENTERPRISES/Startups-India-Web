'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import '../../../styles/incubation-page.css';

export default function IncubationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startupName: '',
    stage: '',
    industry: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        startupName: '',
        stage: '',
        industry: '',
        message: '',
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="incubation-page">
      {/* Background Elements */}
      <div className="incubation-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="incubation-container">
        {/* Header Section */}
        <motion.div
          className="incubation-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="incubation-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* <span className="badge-icon"></span> */}
            <span className="badge-text">Incubation Phase</span>
          </motion.div>

          <motion.h1
            className="incubation-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Transform Your Startup Into a<br />
            <span className="title-gradient">Market Leader</span>
          </motion.h1>

          <motion.p
            className="incubation-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join our premium 6-month incubation program designed for early-stage startups ready to
            scale. Get access to world-class mentorship, funding opportunities, and resources to
            accelerate your growth.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="incubation-content-grid">
          {/* Left Side - Benefits */}
          <motion.div
            className="incubation-benefits"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="benefits-title">What You'll Get</h3>

            <div className="benefit-item">
              <div className="benefit-icon">
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
              <div className="benefit-content">
                <h4>Expert Mentorship</h4>
                <p>1-on-1 guidance from successful entrepreneurs and industry leaders</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Funding Access</h4>
                <p>Connect with investors and access up to ₹50L in seed funding</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Product Development</h4>
                <p>Technical support and resources to build and scale your MVP</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Market Access</h4>
                <p>Network with 500+ startups and access global market opportunities</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Office Space</h4>
                <p>Access to co-working spaces and infrastructure support</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Legal & Compliance</h4>
                <p>Support with company registration, IP, and regulatory compliance</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            className="incubation-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="form-card">
              <h3 className="form-title">Register Your Interest</h3>
              <p className="form-subtitle">
                Fill out the form below and our team will get back to you within 24 hours
              </p>

              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startupName">Startup Name *</label>
                  <input
                    type="text"
                    id="startupName"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    required
                    placeholder="Your startup name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stage">Startup Stage *</label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="idea">Idea Stage</option>
                    <option value="mvp">MVP Built</option>
                    <option value="early-traction">Early Traction</option>
                    <option value="revenue">Generating Revenue</option>
                    <option value="scaling">Scaling</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="industry">Industry/Sector *</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="fintech">FinTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="agritech">AgriTech</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your startup</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Brief description of your startup, problem you're solving, and why you want to join..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.div
                    className="success-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Application submitted successfully! We'll contact you soon.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="incubation-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="stat-box">
            <div className="stat-number">6</div>
            <div className="stat-label">Months Program</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">₹50L</div>
            <div className="stat-label">Max Funding</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">200+</div>
            <div className="stat-label">Expert Mentors</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">500+</div>
            <div className="stat-label">Startups Network</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
