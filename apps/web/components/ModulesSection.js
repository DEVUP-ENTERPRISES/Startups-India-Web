'use client';

import { motion } from 'framer-motion';

export default function ModulesSection() {
  const modules = [
    {
      number: '01',
      title: 'Entrepreneurial Mindset',
      week: 'Week 1',
      description: 'Build the foundation. Discover what it takes to think, act, and lead like a startup founder. Learn team collaboration and ethical decision-making.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    {
      number: '02',
      title: 'Problem Discovery & Idea Generation',
      week: 'Week 2',
      description: 'Uncover real problems worth solving. Master root-cause analysis, validate pain points, and generate breakthrough ideas that matter.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      )
    },
    {
      number: '03',
      title: 'Idea Validation & Customer Discovery',
      week: 'Week 3',
      description: 'Talk to real customers. Conduct interviews, measure market size (TAM/SAM/SOM), and test if your idea has legs before you build anything.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      number: '04',
      title: 'Business Model & Value Proposition',
      week: 'Week 4',
      description: 'Design your business engine. Use the Business Model Canvas, define your unique value, and analyze competitors strategically.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    },
    {
      number: '05',
      title: 'MVP & Prototype Development',
      week: 'Week 5',
      description: 'Stop overthinking — start building. Learn to create a Minimum Viable Product that tests your core assumption fast and cheap.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    },
    {
      number: '06',
      title: 'Marketing & Go-to-Market Strategy',
      week: 'Week 6',
      description: 'Get your first 100 customers. Master branding, storytelling, customer acquisition channels, and create a GTM plan that works.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      )
    },
    {
      number: '07',
      title: 'Finance & Legal Foundations',
      week: 'Week 7',
      description: 'Understand the money. Build revenue models, forecast financials, choose the right legal structure, and protect your intellectual property.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    },
    {
      number: '08',
      title: 'Pitching & Demo Day',
      week: 'Week 8',
      description: 'Nail your pitch. Craft a compelling pitch deck, master storytelling and body language, then present to investors and mentors on Demo Day.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    }
  ];

  return (
    <section className="modules-section">
      <div className="modules-container">
        {/* Header */}
        <motion.div
          className="modules-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="modules-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span>What You'll Learn</span>
          </div>

          <h2 className="modules-title">
            8 Weeks. <span className="modules-highlight">8 Game-Changing Modules</span>.
          </h2>
        </motion.div>

        {/* Modules Grid */}
        <div className="modules-grid">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              className="module-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="module-card-glow"></div>
              
              <div className="module-header">
                <div className="module-icon">{module.icon}</div>
                <div className="module-week">{module.week}</div>
              </div>

              <div className="module-number">{module.number}</div>

              <h3 className="module-title">{module.title}</h3>
              
              <p className="module-description">{module.description}</p>

              <div className="module-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
