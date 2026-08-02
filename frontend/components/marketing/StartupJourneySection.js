'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StartupJourneySection() {
  const steps = [
    {
      number: '01',
      title: 'Ideation & Validation',
      subtitle: 'Transform Your Vision',
      description: 'Start with a problem worth solving. Conduct market research, identify your target audience, and validate your idea through customer interviews and surveys.',
      details: [
        'Market research & competitor analysis',
        'Customer discovery interviews',
        'Problem-solution fit validation',
        'MVP concept development'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: '#667eea'
    },
    {
      number: '02',
      title: 'Business Planning',
      subtitle: 'Build Your Foundation',
      description: 'Create a comprehensive business plan outlining your business model, revenue streams, financial projections, and go-to-market strategy.',
      details: [
        'Business model canvas creation',
        'Financial projections & budgeting',
        'Revenue model definition',
        'Go-to-market strategy planning'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      color: '#f093fb'
    },
    {
      number: '03',
      title: 'Legal Setup & Registration',
      subtitle: 'Establish Your Entity',
      description: 'Register your company, obtain necessary licenses, protect your intellectual property, and ensure compliance with all legal requirements.',
      details: [
        'Company registration & incorporation',
        'Tax registration (GST, PAN, TAN)',
        'Trademark & IP protection',
        'Legal agreements & contracts'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M12 18v-6"/>
          <path d="M9 15h6"/>
        </svg>
      ),
      color: '#4facfe'
    },
    {
      number: '04',
      title: 'Product Development',
      subtitle: 'Build Your Solution',
      description: 'Develop your minimum viable product (MVP), iterate based on feedback, and refine your offering to achieve product-market fit.',
      details: [
        'MVP development & testing',
        'User feedback collection',
        'Product iteration & refinement',
        'Quality assurance & testing'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      color: '#fa709a'
    },
    {
      number: '05',
      title: 'Team Building',
      subtitle: 'Assemble Your Dream Team',
      description: 'Recruit talented individuals who share your vision, build a strong company culture, and create an organizational structure for growth.',
      details: [
        'Co-founder & key hire recruitment',
        'Company culture development',
        'Roles & responsibilities definition',
        'Equity & compensation planning'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#30cfd0'
    },
    {
      number: '06',
      title: 'Funding & Investment',
      subtitle: 'Secure Capital',
      description: 'Explore funding options, prepare your pitch deck, connect with investors, and secure the capital needed to scale your startup.',
      details: [
        'Pitch deck creation & refinement',
        'Investor outreach & networking',
        'Due diligence preparation',
        'Term sheet negotiation'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: '#a8edea'
    },
    {
      number: '07',
      title: 'Marketing & Launch',
      subtitle: 'Go To Market',
      description: 'Develop your brand identity, create a marketing strategy, launch your product, and acquire your first customers.',
      details: [
        'Brand identity & positioning',
        'Digital marketing strategy',
        'Product launch campaign',
        'Customer acquisition channels'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      color: '#ffecd2'
    },
    {
      number: '08',
      title: 'Scale & Growth',
      subtitle: 'Expand Your Impact',
      description: 'Optimize operations, expand your market reach, build strategic partnerships, and scale your business sustainably.',
      details: [
        'Operations optimization',
        'Market expansion strategy',
        'Strategic partnerships',
        'Sustainable growth planning'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      color: '#ff9a9e'
    }
  ];

  return (
    <section className="startup-journey-section">
      <div className="journey-bg-gradient"></div>
      <div className="container">
        <motion.div 
          className="journey-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="journey-title">
            Essential Steps to Launch Your<br/>Startup Journey Successfully
          </h2>
          <p className="journey-subtitle">
            Our comprehensive roadmap guides you through every critical phase of building your startup, from ideation to market launch, with expert insights and proven strategies designed to maximize your chances of success.
          </p>
        </motion.div>

        <div className="journey-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="journey-card"
              style={{ '--card-color': step.color }}
            >
              <div className="journey-card-header">
                <div className="journey-number" style={{ color: step.color }}>
                  {step.number}
                </div>
                <div className="journey-icon" style={{ background: `${step.color}15`, color: step.color }}>
                  {step.icon}
                </div>
              </div>
              
              <div className="journey-card-content">
                <span className="journey-subtitle-text" style={{ color: step.color }}>
                  {step.subtitle}
                </span>
                <h3 className="journey-card-title">{step.title}</h3>
                <p className="journey-card-description">{step.description}</p>
                
                <ul className="journey-details-list">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="journey-detail-item">
                      <div className="detail-dot" style={{ background: step.color }}></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="journey-card-footer">
                <Link href="/signup" className="journey-learn-more" style={{ color: step.color }}>
                  <span>Learn More</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
