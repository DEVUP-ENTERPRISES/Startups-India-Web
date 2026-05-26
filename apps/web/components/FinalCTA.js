'use client';

import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="final-cta-section">
      <motion.div
        className="final-cta-box"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Join The Mission</p>

        <h2>
          Be Part of IndiaÔÇÖs Emerging Campus Innovation Movement ­ƒÜÇ
        </h2>

        <p className="cta-description">
          Become a sponsor, partner, college, or student participant and
          help shape the future of innovation & entrepreneurship in India.
        </p>

        <div className="cta-buttons">
          <button className="hero-btn primary">Become Sponsor</button>
          <button className="hero-btn secondary">Student Registration</button>
          <button className="hero-btn secondary">Become Ecosystem Partner</button>
        </div>
      </motion.div>
    </section>
  );
}
