'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProgramTimelineSection() {
  const [isInView, setIsInView] = useState(false);
  const weeks = [
    {
      week: 'Weeks 1-2',
      title: 'Idea & Problem Validation',
      description: 'Learn to identify real market problems, validate your assumptions through customer interviews, and ensure your idea solves a genuine need.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      highlights: ['Customer Discovery', 'Market Research', 'Problem-Solution Fit']
    },
    {
      week: 'Weeks 3-4',
      title: 'Business Model & Value Prop',
      description: 'Design your business model canvas, craft a compelling value proposition, and identify your revenue streams and key partnerships.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      highlights: ['Business Model Canvas', 'Value Proposition', 'Revenue Strategy']
    },
    {
      week: 'Weeks 5-6',
      title: 'MVP & Marketing',
      description: 'Build your minimum viable product using lean principles, develop go-to-market strategies, and create effective marketing campaigns.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      highlights: ['MVP Development', 'Go-to-Market', 'Growth Hacking']
    },
    {
      week: 'Weeks 7-8',
      title: 'Finance, Legal & Pitch Mastery',
      description: 'Master financial projections, understand legal frameworks, and perfect your investor pitch to secure funding for your venture.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      highlights: ['Financial Modeling', 'Legal Setup', 'Pitch Deck']
    }
  ];

  return (
    <section className="program-timeline-section">
      <div className="timeline-bg-gradient gradient-1"></div>
      <div className="timeline-bg-gradient gradient-2"></div>
      
      <div className="timeline-container">
        {/* Section Header */}
        <motion.div
          className="timeline-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="timeline-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Program Journey</span>
          </div>
          
          <h2 className="timeline-title">
            Your <span className="timeline-highlight">8-Week Transformation</span>
          </h2>
          
          <p className="timeline-subtitle">
            A structured, hands-on curriculum designed to take you from idea to investment-ready startup in just 8 weeks.
          </p>
        </motion.div>

        {/* Timeline Track */}
        <motion.div 
          className={`timeline-track ${isInView ? 'animate-timeline' : ''}`}
          onViewportEnter={() => setIsInView(true)}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Connecting Line */}
          <div className="timeline-line">
            <motion.div
              className="timeline-line-progress"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </div>

          {/* Week Cards */}
          <div className="timeline-weeks">
            {weeks.map((week, index) => (
              <motion.div
                key={index}
                className="week-card-wrapper"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="timeline-dot"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                >
                  <div className="dot-inner"></div>
                  <div className="dot-ring"></div>
                </motion.div>

                {/* Week Card */}
                <div className="week-glass-card">
                  <div className="week-card-glow"></div>
                  
                  <div className="week-icon-wrapper">
                    <div className="week-icon">{week.icon}</div>
                  </div>

                  <div className="week-number">{week.week}</div>
                  <h3 className="week-title">{week.title}</h3>
                  <p className="week-description">{week.description}</p>

                  <div className="week-highlights">
                    {week.highlights.map((highlight, i) => (
                      <div key={i} className="highlight-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="week-number-badge">{String(index + 1).padStart(2, '0')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="timeline-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="curriculum-btn">
            <span>View Detailed Curriculum</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <p className="cta-note">Complete curriculum with weekly milestones & deliverables</p>
        </motion.div>
      </div>
    </section>
  );
}
