'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Sparkles, 
  Cpu, 
  Lightbulb, 
  Building, 
  Rocket, 
  Milestone, 
  Handshake, 
  Atom, 
  Coins 
} from 'lucide-react';
import styles from './PartnersSlider.module.css';

const partnersData = [
  {
    name: 'T-Hub',
    desc: "India's pioneering innovation ecosystem enabler",
    logoUrl: '/assets/images/logos/t_hub.png'
  },
  {
    name: 'WE Hub',
    desc: 'Empowering & incubating women entrepreneurs',
    logoUrl: '/assets/images/logos/we_hub.png'
  },
  {
    name: 'T-Works',
    desc: "India's largest prototyping & makerspace cell",
    logoUrl: '/assets/images/logos/t_works.png'
  },
  {
    name: 'TSIC',
    desc: 'Telangana State Innovation Cell platform',
    logoUrl: '/assets/images/logos/tsic.png'
  },
  {
    name: 'MSME',
    desc: 'Ministry of MSME, Government of India support',
    logoUrl: '/assets/images/logos/msme.png'
  },
  {
    name: 'Startup India',
    desc: 'National initiative for building growth startups',
    logoUrl: '/assets/images/logos/startup_india.png'
  },
  {
    name: 'Incubators',
    desc: 'Access to 50+ partner incubation enablers',
    icon: <Milestone size={22} strokeWidth={1.8} />
  },
  {
    name: 'Corporate Partners',
    desc: 'Industry-leading corporate enabler grid',
    icon: <Handshake size={22} strokeWidth={1.8} />
  },
  {
    name: 'Innovation Labs',
    desc: 'State-of-the-art technical coworking spaces',
    icon: <Atom size={22} strokeWidth={1.8} />
  },
  {
    name: 'Investor Network',
    desc: 'Growth mentoring, venture capital & angel enablers',
    icon: <Coins size={22} strokeWidth={1.8} />
  }
];

// Duplicate the array once to enable seamless infinite loops
const marqueeList = [...partnersData, ...partnersData];

export default function PartnersSlider() {
  return (
    <section className={styles.sectionWrapper}>
      {/* Background Ambience & Noise */}
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.vignetteEdges} aria-hidden="true" />

      <div className={styles.container}>
        
        {/* Top Header Label Badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badgeLine} />
          <div className={styles.pillBadge}>Ecosystem Partners</div>
          <div className={styles.badgeLine} />
        </div>

        {/* Cinematic Heading & Subtext */}
        <motion.h2 
          className={styles.mainTitle}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Our Innovation Support Network
        </motion.h2>

        <motion.p 
          className={styles.subtext}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          Collaborating with innovation enablers, startup ecosystems, incubators, industry partners, and growth organizations to accelerate student innovation across India.
        </motion.p>

        {/* Flowing Card Rail Wrapper */}
        <div className={styles.sliderOuter}>
          <div className={styles.sliderTrack}>
            {marqueeList.map((partner, index) => (
              <div key={index} className={styles.partnerCard}>
                <div className={styles.iconCircle}>
                  {partner.logoUrl ? (
                    <img 
                      src={partner.logoUrl} 
                      alt={`${partner.name} logo`} 
                      className={styles.partnerLogo} 
                    />
                  ) : (
                    partner.icon
                  )}
                </div>
                <h4 className={styles.partnerName}>
                  {partner.name}
                </h4>
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
