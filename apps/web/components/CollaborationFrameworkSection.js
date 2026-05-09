'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Rocket, Globe, Landmark, ArrowRight } from 'lucide-react';
import '../styles/collaboration-framework.css';

const pillars = [
  {
    number: '01',
    title: 'Academia',
    tagline: 'Research & Talent Pipeline',
    description:
      'We nurture an innovative mindset within academic institutions through structured workshops, training programs, and deep institutional collaboration.',
    points: [
      'Innovation & entrepreneurship workshops',
      'Faculty development & curriculum integration',
      'Student startup incubation pathways',
    ],
    icon: <GraduationCap size={28} strokeWidth={1.8} />,
  },
  {
    number: '02',
    title: 'Startups Ecosystem',
    tagline: 'Incubation & Acceleration',
    description:
      'We create launchpads for disruptive ventures — supporting startups from ideation to scale with mentorship, funding access, and ecosystem connections.',
    points: [
      '6–12 month structured incubation tracks',
      'Access to 200+ mentors & investor network',
      'Demo days, pitch events & grant programs',
    ],
    icon: <Rocket size={28} strokeWidth={1.8} />,
  },
  {
    number: '03',
    title: 'Corporates & International',
    tagline: 'Partnerships & Global Reach',
    description:
      'We propel growth by establishing meaningful connections with corporates and cultivating international partnerships that open global doors for startups.',
    points: [
      'B2B intros to 100+ corporate partners',
      'International delegation & exchange programs',
      'CSR-backed innovation initiatives',
    ],
    icon: <Globe size={28} strokeWidth={1.8} />,
  },
  {
    number: '04',
    title: 'Government',
    tagline: 'Policy & Ecosystem Support',
    description:
      'We bridge the gap between innovation and policy by working closely with state and central governments to scale high-impact initiatives.',
    points: [
      'Strategic partnership with Startup India & MeitY',
      'Policy advocacy & institutional frameworks',
      'Pan-India ecosystem scale-up programs',
    ],
    icon: <Landmark size={28} strokeWidth={1.8} />,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function CollaborationFrameworkSection() {
  return (
    <section className="collab-section">
      {/* ── Background decorative blobs (help glass effect "pop") ── */}
      <div className="collab-bg-blob collab-bg-blob--1" aria-hidden="true" />
      <div className="collab-bg-blob collab-bg-blob--2" aria-hidden="true" />
      <div className="collab-bg-blob collab-bg-blob--3" aria-hidden="true" />

      <div className="iec-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <motion.div
          className="collab-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="section-label-premium mb-4">
            Our Model
          </div>
          <h2 className="collab-title">
            Collaboration <span className="collab-title-red">Framework</span>
          </h2>
          <p className="collab-subtitle">
            Building bridges across academia, startups, corporates, and government to create a
            thriving innovation ecosystem.
          </p>
        </motion.div>

        {/* ── Card Grid ── */}
        <motion.div
          className="collab-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {pillars.map(pillar => (
            <motion.div
              key={pillar.number}
              variants={cardVariants}
              className="collab-card group"
              whileHover={{ 
                y: -12,
                rotateX: 4,
                rotateY: -2,
                transition: { type: 'spring', stiffness: 400, damping: 20 }
              }}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Shine effect overlay */}
              <div className="collab-card-shine" />

              {/* Step badge */}
              <div className="collab-step-badge">{pillar.number}</div>

              {/* Icon with float animation */}
              <motion.div 
                className="collab-icon"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.4 }
                }}
              >
                {pillar.icon}
              </motion.div>

              {/* Title block */}
              <div className="collab-text">
                <p className="collab-tagline">{pillar.tagline}</p>
                <h3 className="collab-card-title">{pillar.title}</h3>
                <p className="collab-card-desc">{pillar.description}</p>
              </div>

              {/* Bullet points with staggered hover effect */}
              <ul className="collab-points">
                {pillar.points.map((pt, i) => (
                  <motion.li 
                    key={i} 
                    className="collab-point"
                    whileHover={{ x: 6, color: '#dc2626' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="collab-point-dot" aria-hidden="true" />
                    {pt}
                  </motion.li>
                ))}
              </ul>

              {/* Divider */}
              <div className="collab-divider" />

              {/* CTA */}
              <div className="collab-cta">
                <span>Read More</span>
                <motion.svg
                  className="collab-cta-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </motion.svg>
              </div>

              {/* Inner top-edge highlight (glass rim light) */}
              <div className="collab-rim-light" aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom connector ── */}
        <motion.div
          className="collab-connector"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="collab-connector-line" />
          <div className="collab-connector-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            IEC Ecosystem Hub
          </div>
          <div className="collab-connector-line" />
        </motion.div>
      </div>
    </section>
  );
}
