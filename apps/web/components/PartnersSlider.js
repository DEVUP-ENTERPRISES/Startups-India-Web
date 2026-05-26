'use client';

import { motion } from 'framer-motion';

const partners = [
  'T-Hub',
  'WE Hub',
  'T-Works',
  'TSIC',
  'MSME',
  'Incubators',
  'Corporate Partners',
];

export default function PartnersSlider() {
  return (
    <section className="partners-section">
      <div className="section-header">
        <p className="section-tag">Ecosystem Partners</p>
        <h2>Our Innovation Support Network</h2>
      </div>

      <motion.div
        className="partners-slider"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {partners.map((partner, index) => (
          <div key={index} className="partner-card">
            {partner}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
