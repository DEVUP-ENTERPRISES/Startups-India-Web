'use client';

import { motion } from 'framer-motion';

const stats = [
  { number: '100+', label: 'Top Colleges' },
  { number: '35,000+', label: 'Students' },
  { number: '6,000+', label: 'Hackathon Participants' },
  { number: '2,000+', label: 'Startup Ideas' },
];

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h2>{stat.number}</h2>
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
