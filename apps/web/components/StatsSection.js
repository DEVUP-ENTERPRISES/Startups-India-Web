'use client';

import { motion } from 'framer-motion';

const stats = [
  {
    number: '100+',
    label: 'Top Colleges',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    )
  },
  {
    number: '35,000+',
    label: 'Students',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    number: '6,000+',
    label: 'Hackathon Participants',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    )
  },
  {
    number: '2,000+',
    label: 'Startup Ideas',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
      </svg>
    )
  }
];

export default function StatsSection() {
  return (
    <section className="stats-section-premium">
      {/* Background Matrix/Dotted highlights */}
      <div className="stats-bg-grid" aria-hidden="true" />
      <div className="stats-bg-glow" aria-hidden="true" />

      <div className="stats-container-premium">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card-premium"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* The circular icon container with precise glow */}
            <div className="stat-icon-wrap">
              <span className="stat-icon-svg">{stat.icon}</span>
            </div>

            {/* Subtle red line divider */}
            <div className="stat-card-divider" />

            {/* Core numbers */}
            <h2>{stat.number}</h2>

            {/* Gray label */}
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
