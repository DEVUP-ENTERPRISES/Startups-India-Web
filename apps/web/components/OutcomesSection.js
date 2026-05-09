'use client';

import { motion } from 'framer-motion';

export default function OutcomesSection() {
  const outcomes = [
    {
      id: 1,
      title: 'Build a Validated Startup',
      subtitle: 'From Idea to Market-Ready Product',
      description: 'Complete the program with a validated business model, working prototype, and a clear roadmap to launch. Learn to test assumptions, iterate based on feedback, and build something customers actually want.',
      highlights: ['Business Model Canvas', 'Working MVP', 'Launch Roadmap', 'Customer Validation'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Master Critical Skills',
      subtitle: 'Learn What Takes Years in Just 8 Weeks',
      description: 'Learn customer discovery, MVP development, pitching, and fundraising—skills that take most founders years to develop. Our framework condenses years of startup wisdom into an intensive, hands-on learning experience.',
      highlights: ['Customer Discovery', 'MVP Development', 'Pitch Mastery', 'Fundraising Strategy'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Connect with Real Opportunities',
      subtitle: '50,000+ Entrepreneurs & Growing',
      description: 'Get direct access to investors, incubators, and the StartupsIndia ecosystem of 50,000+ entrepreneurs. Join a vibrant community of founders, mentors, and industry experts who are actively building the future.',
      highlights: ['Investor Network', 'Incubator Access', 'Mentor Connections', 'Peer Community'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Compete for Funding Opportunities',
      subtitle: 'Up to ₹5 Lakhs Seed Funding',
      description: 'Top teams get mentorship, investor access, and a chance to raise seed funding up to ₹5 Lakhs. Present your validated startup to a panel of investors and industry experts on Demo Day and unlock growth capital.',
      highlights: ['Demo Day Pitch', 'Investor Meetings', 'Seed Funding', 'Incubation Support'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    }
  ];

  return (
    <section className="outcomes-section">
      {/* Flowing Background */}
      <div className="outcomes-bg-flow">
        <div className="flow-line flow-1"></div>
        <div className="flow-line flow-2"></div>
      </div>

      <div className="outcomes-container">
        {/* Header */}
        <motion.div
          className="outcomes-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">IMPACT</div>
          <h2 className="outcomes-main-title">
            Real Results.<br />
            <span className="outcomes-gradient-text">Real Impact</span>.
          </h2>
        </motion.div>

        {/* Unique Flowing Stacked Layout */}
        <div className="outcomes-flow-layout">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.id}
              className={`outcome-flow-item flow-item-${index + 1}`}
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              {/* Large Number Badge */}
              <div className="outcome-number-badge">
                <span>0{outcome.id}</span>
              </div>

              {/* Main Content Area */}
              <div className="outcome-content-area">
                {/* Left Side - Icon & Subtitle */}
                <div className="outcome-left">
                  <div className="outcome-icon-large">
                    {outcome.icon}
                  </div>
                  <div className="outcome-subtitle-tag">{outcome.subtitle}</div>
                </div>

                {/* Right Side - Content */}
                <div className="outcome-right">
                  <h3 className="outcome-title-large">{outcome.title}</h3>
                  <p className="outcome-description">{outcome.description}</p>
                  
                  {/* Highlights Flow */}
                  <div className="outcome-highlights-flow">
                    {outcome.highlights.map((highlight, idx) => (
                      <div key={idx} className="highlight-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="outcome-corner-accent"></div>
            </motion.div>
          ))}
        </div>

        {/* Quote Section */}
        <motion.div
          className="outcomes-quote"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="quote-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </div>

          <blockquote className="quote-text">
            "The frameworks taught in this program are exactly what helped us go from idea to our first pilot customer in under 3 months. Every student founder needs this foundation."
          </blockquote>

          <div className="quote-author">
            <div className="author-name">— Mentor from the program</div>
          </div>

          <div className="quote-bg-pattern"></div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="outcomes-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="outcomes-btn">
            <span>See What You'll Build</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
