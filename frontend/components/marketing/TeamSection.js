'use client';

import { useState } from 'react';
import '../../styles/team-section.css';

const TEAM_DATA = {
  core: [
    {
      name: 'Ravi Tilekar',
      role: 'Founder & Director',
      department: 'Leadership',
      image: '/assets/images/Ravi Tilekar.jpg',
      linkedin: 'https://www.linkedin.com/in/ravi-tilekar-53830a99/',
      email: 'info@startupsindia.in',
      quote: 'We believe innovation should be accessible to every aspiring entrepreneur in India.',
    },
    {
      name: 'Avinash Tilekar',
      role: 'Chief Executive Officer (CEO)',
      department: 'Technology',
      image: '/assets/images/Avinash Tilekar.jpg',
      linkedin: 'https://www.linkedin.com/in/avinash-tilekar-bb4aa41b6/',
      email: 'info@startupsindia.in',
      quote: 'Driving technological innovation to empower the next generation of startups.',
    },
    {
      name: 'Vishwaraj Saude',
      role: 'Chief Strategy Officer (CSO)',
      department: 'Operations',
      image: '/assets/images/Vishwaraj.jpg',
      linkedin: 'https://www.linkedin.com/in/vishwaraj-saude-728269151/',
      email: 'info@startupsindia.in',
      quote:
        'Crafting strategic pathways that transform visionary ideas into successful enterprises.',
    },
    {
      name: 'J. Vinod Kumar',
      role: 'Head of Admin',
      department: 'Operations',
      image: '/assets/images/Vinod.jpg',
      linkedin: 'https://linkedin.com',
      email: 'info@startupsindia.in',
      quote: 'Ensuring seamless operations that empower our ecosystem to thrive.',
    },
    {
      name: 'Sandeep Sharma',
      role: 'Chief Business Officer (CBO)',
      department: 'Partnerships',
      image: '/assets/images/Sandeep.jpg',
      linkedin: 'https://linkedin.com',
      email: 'info@startupsindia.in',
      quote: 'Building strategic alliances that accelerate startup growth and market reach.',
    },
    {
      name: 'Dr. P. Karthik',
      role: 'Chief Marketing Officer (CMO)',
      department: 'Marketing',
      image: '/assets/images/Kartik.jpg',
      linkedin: 'https://linkedin.com',
      email: 'info@startupsindia.in',
      quote: 'Amplifying startup stories to connect with the right audience and investors.',
    },
  ],
  advisors: [
    {
      name: 'Vijay Hamilpur',
      role: 'Strategic Advisor',
      department: 'Strategy',
      image: '/assets/images/Vijay.jpg',
      linkedin: 'https://linkedin.com',
      email: 'admin@startupsindia.in',
      quote: 'Bridging academic excellence with real-world entrepreneurship for lasting impact.',
    },
    {
      name: 'Bharat Bhushan Rallapalli',
      role: 'Political Advisor',
      department: 'Policy',
      image: '/assets/images/Bhushan-pragma.jpg',
      linkedin: 'https://linkedin.com',
      email: 'meera@startupindia.com',
      quote: 'Navigating regulatory landscapes to create enabling environments for startups.',
    },
    {
      name: 'Raghunatha Chary',
      role: 'Revenue Strategy Advisor',
      department: 'Legal',
      image: '/assets/images/Raghunatha-Chary.jpg',
      linkedin: 'https://linkedin.com',
      email: 'karthik@startupindia.com',
      quote: 'Building compliant frameworks that protect and accelerate business growth.',
    },
    {
      name: 'Suresh Boggavarapu',
      role: 'Senior Market Advisor',
      department: 'Financial',
      image: '/assets/images/Suresh.jpg',
      linkedin: 'https://linkedin.com',
      email: 'info@startupsindia.in',
      quote: 'Building high-performance teams that drive organizational excellence.',
    },
    {
      name: 'Dr. Venugopal Gandham',
      role: 'Cyber Security Advisor',
      department: 'Technology',
      image: '/assets/images/Dr.Venugopal Gandham.jpg',
      linkedin: 'https://linkedin.com',
      email: 'sanjay@startupindia.com',
      quote: 'Securing digital futures by safeguarding startup innovations from cyber threats.',
    },
    {
      name: 'Raghu Vasishth',
      role: 'Legal Advisor',
      department: 'Advocate',
      image: '/assets/images/raghu-vasishth.jpg',
      linkedin: 'https://linkedin.com',
      email: 'divya@startupindia.com',
      quote: 'Transforming brand visions into market-leading success stories.',
    },
  ],
};

const STATS = [
  { value: '50+', label: 'Team Members' },
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Startups Supported' },
  { value: '100%', label: 'Dedication' },
];

function TeamCard({ member, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = e => {
    if (e.target.closest('.card-icon-link')) return;
    setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = e => {
    if (e.target.closest('.card-icon-link')) return;
    setIsFlipped(true);
  };

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleCardClick}
    >
      <div className="flip-card-inner">
        {/* Front Side - Identity */}
        <div className="flip-card-front">
          <div className="card-image-wrapper">
            <img src={member.image} alt={member.name} className="card-image" loading="lazy" />
            <div className="card-gradient-overlay" />
          </div>
          <div className="card-content">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            {member.department && <span className="member-tag">{member.department}</span>}
            
            {member.quote && (
              <div className="member-quote mobile-only-quote">
                <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p>{member.quote}</p>
              </div>
            )}

            <div
              className="card-action-section"
              onMouseEnter={e => e.stopPropagation()}
              onMouseLeave={e => e.stopPropagation()}
            >
              <div className="card-icons">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-icon-link"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.528zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="card-icon-link"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Insight */}
        <div className="flip-card-back">
          <div className="card-image-wrapper">
            <img src={member.image} alt={member.name} className="card-image" loading="lazy" />
            <div className="card-gradient-overlay-back" />
          </div>
          <div className="card-content">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            {member.department && <span className="member-tag">{member.department}</span>}
            {member.quote && (
              <div className="member-quote">
                <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p>{member.quote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [activeTab, setActiveTab] = useState('core');

  return (
    <section className="team-section" id="team-profiles">
      <div className="team-container">
        <div className="team-header">
          <h2 className="team-title">Meet Our Team</h2>
          <p className="team-subtitle">
            A passionate team of innovators, mentors, and ecosystem builders dedicated to
            transforming ideas into thriving businesses
          </p>
        </div>

        <div className="team-stats">
          {STATS.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="team-toggle">
          <div className="toggle-track">
            <button
              className={`toggle-option ${activeTab === 'core' ? 'active' : ''}`}
              onClick={() => setActiveTab('core')}
            >
              Core Team
            </button>
            <button
              className={`toggle-option ${activeTab === 'advisors' ? 'active' : ''}`}
              onClick={() => setActiveTab('advisors')}
            >
              Advisors
            </button>
          </div>
        </div>

        <div className="team-grid">
          {(activeTab === 'core' ? TEAM_DATA.core : TEAM_DATA.advisors).map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
