'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CapabilitiesSection() {
  const capabilities = [
    {
      title: 'Expert Mentorship',
      description: 'Connect with industry leaders and successful entrepreneurs',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '👥',
      features: ['1-on-1 Sessions', 'Group Workshops', 'Industry Insights'],
      accentColor: '#667eea'
    },
    {
      title: 'Funding Access',
      description: 'Get connected to investors and funding opportunities',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '💰',
      features: ['Investor Network', 'Pitch Training', 'Demo Days'],
      accentColor: '#f5576c'
    },
    {
      title: 'Technical Resources',
      description: 'Access cutting-edge tools and infrastructure',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '⚡',
      features: ['Cloud Credits', 'Dev Tools', 'API Access'],
      accentColor: '#4facfe'
    },
    {
      title: 'Business Strategy',
      description: 'Develop robust business models and strategies',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '📊',
      features: ['Market Analysis', 'Growth Planning', 'GTM Strategy'],
      accentColor: '#fa709a'
    },
    {
      title: 'Legal Support',
      description: 'Navigate legal complexities with expert guidance',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      icon: '⚖️',
      features: ['Company Setup', 'IP Protection', 'Compliance'],
      accentColor: '#30cfd0'
    },
    {
      title: 'Marketing & Branding',
      description: 'Build a strong brand and reach your audience',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      icon: '🎯',
      features: ['Brand Identity', 'Digital Marketing', 'PR Support'],
      accentColor: '#a8edea'
    }
  ];

  return (
    <section className="capabilities-section">
      <div className="capabilities-bg-gradient"></div>
      <div className="capabilities-grid-pattern"></div>
      
      <div className="container">
        <motion.div 
          className="capabilities-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="capabilities-title">
            Everything you need to <span className="gradient-text">build & scale</span> your startup
          </h2>
          <p className="capabilities-subtitle">
            Comprehensive support across all aspects of your entrepreneurial journey
          </p>
        </motion.div>

        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className="capability-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="capability-card-inner">
                {/* Gradient Background */}
                <div className="capability-gradient" style={{ background: capability.gradient }}></div>
                
                {/* Glass Effect Overlay */}
                <div className="capability-glass"></div>
                
                {/* Glow Effect */}
                <div className="capability-glow" style={{ background: capability.accentColor }}></div>
                
                {/* Content */}
                <div className="capability-content">
                  <div className="capability-icon-wrapper">
                    <span className="capability-icon">{capability.icon}</span>
                  </div>
                  
                  <h3 className="capability-title">{capability.title}</h3>
                  <p className="capability-description">{capability.description}</p>
                  
                  <div className="capability-features">
                    {capability.features.map((feature, idx) => (
                      <div key={idx} className="capability-feature">
                        <div className="feature-dot" style={{ background: capability.accentColor }}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/signup" className="capability-cta">
                    <span>Learn more</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
                
                {/* Border Gradient */}
                <div className="capability-border"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
