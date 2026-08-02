'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import './team.css';

export default function TeamPage() {
  const coreTeamMembers = [
    {
      id: 1,
      name: 'Ravi Tilekar',
      role: 'Founder & Director',
      image: '/assets/images/Ravi Tilekar.jpg',
      linkedin: 'https://www.linkedin.com/in/ravi-tilekar-53830a99/',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Leadership'
    },
    {
      id: 2,
      name: 'Avinash Tilekar',
      role: 'Chief Executive Officer (CEO)',
      image: '/assets/images/Avinash Tilekar.jpg',
      linkedin: 'https://www.linkedin.com/in/avinash-tilekar-bb4aa41b6/',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Technology'
    },
    {
      id: 3,
      name: 'Vishwaraj Saude',
      role: 'Chief Strategy Officer (CSO)',
      image: '/assets/images/Vishwaraj.jpg',
      linkedin: 'https://www.linkedin.com/in/vishwaraj-saude-728269151/',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Chief Operating Officer'
    },
    {
      id: 4,
      name: 'J. Vinod Kumar',
      role: 'Head of Admin',
      image: '/assets/images/Vinod.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Operations Management'
    },
    {
      id: 5,
      name: 'Sandeep Sharma',
      role: 'Chief Business Officer (CBO)',
      image: '/assets/images/Sandeep.jpg',
      bio: 'Fostering a vibrant ecosystem of entrepreneurs and innovators through engaging programs and events. Dedicated to building strong networks that support collaboration and knowledge sharing among founders.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Corporate Partnership Head'
    },
    {
      id: 6,
      name: 'Dr. P. Karthik',
      role: 'Chief Marketing Officer (CMO)',
      image: '/assets/images/Kartik.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Marketing & Adv'
    },
  ];

  const advisors = [
    {
      id: 11,
      name: 'Vijay Hamilpur',
      role: 'Strategic Advisor',
      image: '/assets/images/Vijay.jpg',
      bio: 'Former IIT professor with expertise in technology commercialization and research.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'admin@startupsindia.in',
      expertise: 'Strategy'
    },
    {
      id: 12,
      name: 'Bharat Bhushan Rallapalli',
      role: 'Political Advisor',
      image: '/assets/images/Bhushan-pragma.jpg',
      bio: 'Veteran investor with portfolio of 50+ successful startups.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'meera@startupindia.com',
      expertise: 'Educator'
    },
    {
      id: 13,
      name: 'Raghunatha Chary',
      role: 'Revenue Strategy Advisor',
      image: '/assets/images/Raghunatha.jpg',
      bio: 'Corporate lawyer specializing in startup legal frameworks and compliance.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'karthik@startupindia.com',
      expertise: 'GTM Design'
    },
    {
      id: 16,
      name: 'Suresh Boggavarapu',
      role: 'Senior Market Advisor',
      image: '/assets/images/Suresh.jpg',
      bio: 'People operations expert building high-performance startup teams.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'info@startupsindia.in',
      expertise: 'Financial'
    },
    {
      id: 15,
      name: 'Dr.Venugopal Gandham',
      role: 'Cyber Security Advisor',
      image: '/assets/images/Venugopal .jpg',
      bio: 'CFO turned advisor helping startups with financial planning and fundraising.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'sanjay@startupindia.com',
      expertise: 'AI Driven Expert'
    },
    {
      id: 14,
      name: 'Raghu Vasishth',
      role: 'Legal Advisor',
      image: '/assets/images/raghu-vasishth.jpg',
      bio: 'Brand strategist who scaled multiple startups to market leadership.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'divya@startupindia.com',
      expertise: 'Advocate'
    },
  ];

  const stats = [
    { 
      number: '50+', 
      label: 'Team Members',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      number: '15+', 
      label: 'Years Experience',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    { 
      number: '500+', 
      label: 'Startups Supported',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    { 
      number: '100%', 
      label: 'Dedication',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    }
  ];

  return (
    <div className="team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <svg className="badge-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Meet Our Team</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The People Behind
              <span className="gradient-text"> Your Success</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A passionate team of innovators, mentors, and ecosystem builders dedicated to transforming ideas into thriving businesses
            </motion.p>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {[
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
                title: 'Innovation First',
                description: 'We embrace cutting-edge solutions and encourage creative thinking in everything we do'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: 'Collaboration',
                description: 'Building strong partnerships and fostering a supportive ecosystem for all stakeholders'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                title: 'Excellence',
                description: 'Committed to delivering exceptional quality and exceeding expectations consistently'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
                title: 'Growth Mindset',
                description: 'Continuous learning and adaptation to stay ahead in the dynamic startup landscape'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="team-members-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Core Team</h2>
            <p className="section-subtitle">The driving force behind our mission</p>
          </motion.div>

          {/* Core Team Grid */}
          <div className="team-grid">
            {coreTeamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="team-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                layout
              >
                <div className="card-glow"></div>
                
                <div className="card-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="member-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-placeholder" style={{ display: 'none' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="image-overlay">
                    <div className="social-links">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href={`mailto:${member.email}`} className="social-link" aria-label="Email">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>

                  <div className="expertise-badge">
                    <span className="expertise-tag">{member.expertise}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="advisors-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Advisors</h2>
            <p className="section-subtitle">Industry experts guiding our strategic direction</p>
          </motion.div>

          {/* Advisors Grid */}
          <div className="team-grid">
            {advisors.map((member, index) => (
              <motion.div
                key={member.id}
                className="team-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                layout
              >
                <div className="card-glow"></div>
                
                <div className="card-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="member-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-placeholder" style={{ display: 'none' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="image-overlay">
                    <div className="social-links">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href={`mailto:${member.email}`} className="social-link" aria-label="Email">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>

                  <div className="expertise-badge">
                    <span className="expertise-tag">{member.expertise}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Impact</h2>
            <p className="section-subtitle">Transforming the startup ecosystem together</p>
          </motion.div>

          <div className="impact-grid">
            {[
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                number: '500+',
                label: 'Startups Accelerated',
                description: 'From ideation to market success'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                number: '₹100Cr+',
                label: 'Funding Facilitated',
                description: 'Connecting startups with investors'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                number: '50+',
                label: 'Success Stories',
                description: 'Unicorns and market leaders'
              },
              {
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                number: '15+',
                label: 'States Covered',
                description: 'Pan-India presence and impact'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="impact-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="impact-icon-wrapper">
                  <div className="impact-icon">{item.icon}</div>
                  <div className="impact-glow"></div>
                </div>
                <div className="impact-number">{item.number}</div>
                <div className="impact-label">{item.label}</div>
                <div className="impact-description">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
