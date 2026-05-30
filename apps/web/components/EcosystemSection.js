'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, IndianRupee, Building2, Globe, Scale, Handshake, Rocket } from 'lucide-react';

export default function EcosystemSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const capabilities = [
    {
      title: 'Mentorship & Guidance',
      description:
        'Connect with industry experts and successful entrepreneurs who provide strategic guidance for your startup journey',
      icon: Users,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: '200+ Mentors',
      feature: 'Weekly Sessions',
    },
    {
      title: 'Funding Access Infrastructure & Resources',
      description:
        'Get connected with investors, VCs, and funding opportunities to fuel your growth and scale your business',
      icon: IndianRupee,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: '₹125Cr+ Raised',
      feature: 'Investor Network',
    },
    {
      title: 'Infrastructure & Resources',
      description:
        'Access world-class workspace, technology infrastructure, and essential resources for your operations',
      icon: Building2,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: '24/7 Access',
      feature: 'Premium Facilities',
    },
    {
      title: 'Market Access',
      description:
        'Expand your reach with our network of corporates, partners, and market opportunities across industries',
      icon: Globe,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stats: '100+ Partners',
      feature: 'Global Network',
    },
    {
      title: 'Legal & Compliance',
      description:
        'Navigate regulatory requirements with expert legal support and compliance guidance from day one',
      icon: Scale,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: 'Expert Support',
      feature: 'Full Compliance',
    },
    {
      title: 'Community & Networking',
      description:
        'Join a vibrant community of founders, innovators, and change-makers building the future together',
      icon: Handshake,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      stats: '1000+ Members',
      feature: 'Active Community',
    },
  ];

  return (
    <section className="ecosystem-section" ref={sectionRef}>
      <div className="container">
        {/* Section Header - Unified Style */}
        <motion.div
          className="section-header-unified"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="section-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="badge-icon">
              <Rocket size={16} />
            </span>
            <span className="badge-text">Our Ecosystem</span>
          </motion.div>

          <motion.h2
            className="section-title-unified"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Everything You Need to <span className="title-highlight">Succeed</span>
          </motion.h2>

          <motion.p
            className="section-description-unified"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A full-stack platform designed to accelerate your startup journey with comprehensive
            support and resources
          </motion.p>
        </motion.div>

        {/* Advanced Capabilities Grid */}
        <div className="ecosystem-grid-advanced">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className="ecosystem-card-advanced"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div
                className="ecosystem-card-glow"
                style={{
                  background: capability.gradient,
                  opacity: hoveredIndex === index ? 0.15 : 0,
                }}
              ></div>

              <div className="ecosystem-card-content">
                <div
                  className="ecosystem-icon-advanced"
                  style={{ background: 'linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%)' }}
                >
                  {React.createElement(capability.icon, { size: 28, color: '#ffffff' })}
                </div>

                <div className="ecosystem-badges">
                  <span className="ecosystem-badge-stat">{capability.stats}</span>
                  <span className="ecosystem-badge-feature">{capability.feature}</span>
                </div>

                <h3 className="ecosystem-title-advanced">{capability.title}</h3>
                <p className="ecosystem-description-advanced">{capability.description}</p>

                <motion.div
                  className="ecosystem-arrow"
                  animate={{ x: hoveredIndex === index ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
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
