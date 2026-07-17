'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FinalCTASection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [status, setStatus] = useState({ state: 'idle', message: '' });

  // Previously console.logged only, so every signup was thrown away. Routed to
  // the same public inquiry endpoint, which records a Lead and notifies admin.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });

    const { apiPost } = await import('@/lib/api');
    const { error } = await apiPost('/api/v1/public/inquiry', {
      name,
      email,
      program: 'Newsletter / Get Started',
      message: 'Signed up via the homepage call-to-action.',
    });

    if (error) {
      setStatus({ state: 'error', message: error.message || 'Something went wrong. Please try again.' });
      return;
    }

    setStatus({ state: 'sent', message: "You're on the list — we'll be in touch shortly." });
    setName('');
    setEmail('');
  };

  const benefits = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      text: 'Exclusive startup resources'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      text: 'Early access to program updates'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      text: 'Invites to workshops & events'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      text: 'Connect with founding teams'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Community Members' },
    { number: '500+', label: 'Startups Launched' },
    { number: '100+', label: 'Events Hosted' }
  ];

  return (
    <section className="final-cta-section">
      {/* Background Elements */}
      <div className="final-cta-bg">
        <div className="cta-gradient cta-gradient-1"></div>
        <div className="cta-gradient cta-gradient-2"></div>
        <div className="cta-gradient cta-gradient-3"></div>
      </div>

      <div className="final-cta-container">
        {/* Main CTA Card */}
        <motion.div
          className="final-cta-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="final-cta-header">
            <motion.div
              className="final-cta-icon"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </motion.div>

            <motion.h2
              className="final-cta-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ready to Turn Your Idea<br />
              <span className="final-cta-highlight">Into Reality?</span>
            </motion.h2>

            <motion.p
              className="final-cta-description"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join thousands of aspiring founders in our community. Get exclusive startup resources, early access to program updates, and invites to workshops and events.
            </motion.p>
          </div>

          {/* Newsletter Form */}
          <motion.form
            className="final-cta-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>
            {status.state !== 'idle' && status.message && (
              <p
                role="status"
                style={{
                  margin: '0 0 12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  background: status.state === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                  color: status.state === 'error' ? '#fca5a5' : '#6ee7b7',
                }}
              >
                {status.message}
              </p>
            )}

            <button type="submit" className="form-submit" disabled={status.state === 'sending'}>
              <span>{status.state === 'sending' ? 'Joining…' : 'Join Our Community'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.form>

          {/* Benefits Grid */}
          <motion.div
            className="final-cta-benefits"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <span className="benefit-text">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="final-cta-stats"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item-cta">
                <div className="stat-number-cta">{stat.number}</div>
                <div className="stat-label-cta">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="contact-info-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="contact-info-card">
            <div className="contact-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="contact-card-content">
              <div className="contact-card-label">Email Us</div>
              <div className="contact-card-value">hello@startupsindia.com</div>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="contact-card-content">
              <div className="contact-card-label">Call Us</div>
              <div className="contact-card-value">+91 98765 43210</div>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="contact-card-content">
              <div className="contact-card-label">Visit Us</div>
              <div className="contact-card-value">Bangalore, India</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
