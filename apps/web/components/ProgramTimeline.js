'use client';

import { motion } from 'framer-motion';

export default function ProgramTimeline() {
  return (
    <section className="timeline-section">
      <div className="section-header">
        <p className="section-tag">Program Overview</p>
        <h2>Innovation Journey Timeline</h2>
      </div>

      <div className="timeline-container">
        <motion.div
          className="timeline-card"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="phase-badge">Phase 1</span>
          <h3>Startup Ecosystem Awareness Program</h3>
          <p>
            High-energy startup awareness sessions across 100+ colleges designed
            to inspire students and introduce entrepreneurship, innovation,
            funding opportunities, and startup ecosystems.
          </p>
        </motion.div>

        <motion.div
          className="timeline-card"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="phase-badge">Phase 2</span>
          <h3>30-Hour Mega Innovation Hackathon</h3>
          <p>
            Students and innovators compete in a large-scale hackathon to build
            real-world solutions, pitch startup ideas, win prizes, and access
            mentorship, incubation & funding opportunities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
