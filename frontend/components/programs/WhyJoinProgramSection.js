'use client';

import { motion } from 'framer-motion';

export default function WhyJoinProgramSection() {
  const features = [
    {
      id: 1,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
      title: 'Validate Customer Problems',
      subtitle: '90% Validation Accuracy Rate',
      description: 'Learn systematic approaches to identify real market needs and validate your assumptions before investing time and money. Use proven frameworks to conduct customer interviews, analyze pain points, and ensure product-market fit from day one.',
      highlights: ['Customer Interviews', 'Market Research', 'Pain Point Analysis', 'Problem Validation']
    },
    {
      id: 2,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      title: 'Build Market-Ready MVPs',
      subtitle: 'Ship Products 3x Faster',
      description: 'Master lean development principles to create minimum viable products that resonate with your target audience and attract early adopters. Learn to prioritize features, iterate quickly, and launch with confidence using agile methodologies.',
      highlights: ['Lean Development', 'Feature Prioritization', 'Rapid Prototyping', 'User Testing']
    },
    {
      id: 3,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <path d="M8 10h.01M12 10h.01M16 10h.01"/>
        </svg>
      ),
      title: 'Master Investor Pitching',
      subtitle: '₹50L+ Funding Raised by Alumni',
      description: 'Develop compelling pitch decks and presentation skills that capture investor attention and secure funding for your venture. Practice with real VCs, refine your storytelling, and learn to answer tough questions with confidence.',
      highlights: ['Pitch Deck Creation', 'Storytelling Skills', 'VC Presentations', 'Q&A Mastery']
    },
    {
      id: 4,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      title: 'Connect With Expert Mentors',
      subtitle: '50+ Industry Experts & VCs',
      description: 'Get personalized guidance from successful entrepreneurs and industry leaders who have walked the path you&apos;re on. Access 1-on-1 mentorship sessions, expert office hours, and a vibrant community of founders who support each other.',
      highlights: ['1-on-1 Mentorship', 'Expert Office Hours', 'Peer Community', 'VC Network Access']
    }
  ];

  const metrics = [
    {
      number: '1,000+',
      label: 'Student Founders',
      sublabel: 'Active Community',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      number: '95%',
      label: 'Success Rate',
      sublabel: 'Complete Program',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      number: '₹10Cr+',
      label: 'Funding Raised',
      sublabel: 'By Our Alumni',
      gradient: 'from-red-600 to-rose-700'
    },
    {
      number: '50+',
      label: 'Partner VCs',
      sublabel: 'Ready to Invest',
      gradient: 'from-pink-600 to-red-700'
    }
  ];

  return (
    <section className="why-join-program-section">
      {/* Diagonal Background Elements */}
      <div className="why-join-bg-elements">
        <div className="diagonal-line diagonal-1"></div>
        <div className="diagonal-line diagonal-2"></div>
        <div className="diagonal-line diagonal-3"></div>
      </div>
      
      <div className="why-join-container">
        {/* Section Header */}
        {/* <motion.div
          className="why-join-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">WHY CHOOSE US</div>
          <h2 className="why-join-main-title">
            Join <span className="why-join-gradient-text">1,000+ Student Founders</span><br />
            
          </h2>
        </motion.div> */}

        {/* Asymmetric Magazine Layout */}
        {/* <div className="why-join-magazine-layout">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={`why-join-block why-join-${index + 1}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
             
              <div className="why-join-huge-number">
                <span>0{feature.id}</span>
              </div>

              
              <div className="why-join-panel">
                <div className="panel-glow"></div>
                
                
                <div className="why-join-icon-wrapper">
                  {feature.icon}
                </div>

                
                <div className="why-join-text">
                  <div className="why-join-subtitle">{feature.subtitle}</div>
                  <h3 className="why-join-heading">{feature.title}</h3>
                  <p className="why-join-detail">{feature.description}</p>
                  
                  
                  <div className="why-join-highlights">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="highlight-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                
                <div className="why-join-decorations">
                  <div className="deco-line"></div>
                  <div className="deco-dot"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div> */}

        {/* Metrics Section */}
        <motion.div
          className="metrics-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="metric-card"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="metric-glow"></div>
                <div className="metric-number">{metric.number}</div>
                <div className="metric-label">{metric.label}</div>
                <div className="metric-sublabel">{metric.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      
      </div>
    </section>
  );
}
