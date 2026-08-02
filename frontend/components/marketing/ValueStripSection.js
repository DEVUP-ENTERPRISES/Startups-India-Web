'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ValueStripSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const collaborations = [
    {
      number: '1',
      title: 'Academia',
      description: 'We help nurture an innovative mindset within academic institutions.',
      gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      textColor: '#ffffff'
    },
    {
      number: '2',
      title: 'Startups Ecosystem',
      description: 'We create launchpads for disruptive ventures and game-changing ideas.',
      gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
      textColor: '#ffffff'
    },
    {
      number: '3',
      title: 'Corporates & International',
      description: 'We propel growth by establishing connections with corporates and cultivating international partnerships.',
      gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      textColor: '#ffffff'
    },
    {
      number: '4',
      title: 'Government',
      description: 'We support public-sector transformation through pioneering solutions and collaborations.',
      gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
      textColor: '#ffffff'
    }
  ];

  return (
    <section className="collaboration-model-section">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="section-header-unified"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="section-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="badge-icon">🤝</span>
            <span className="badge-text">Our Model</span>
          </motion.div>
          
          <motion.h2 
            className="section-title-unified"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Collaboration <span className="title-highlight">Framework</span>
          </motion.h2>
          
          <motion.p 
            className="section-description-unified"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Building bridges across academia, startups, corporates, and government to create a thriving innovation ecosystem
          </motion.p>
        </motion.div>

        {/* Collaboration Cards Grid */}
        <div className="collaboration-grid">
          {collaborations.map((collab, index) => (
            <motion.div
              key={index}
              className="collaboration-card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div 
                className="collaboration-card-inner"
                style={{ background: collab.gradient }}
              >
                <div className="collaboration-number-badge">
                  <span>{collab.number}</span>
                </div>
                
                <h3 className="collaboration-title" style={{ color: collab.textColor }}>
                  {collab.title}
                </h3>
                
                <p className="collaboration-description" style={{ color: collab.textColor }}>
                  {collab.description}
                </p>
                
                <motion.div 
                  className="collaboration-link"
                  animate={{ x: hoveredIndex === index ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: collab.textColor }}
                >
                  <span>Read More</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
