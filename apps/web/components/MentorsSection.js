'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/auth';

export default function MentorsSection() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    }
    checkAuth();
  }, []);

  const handleApplyClick = () => {
    setIsRedirecting(true);
    // Add a slight delay for the premium "loading" transition feel
    setTimeout(() => {
      if (isLoggedIn) {
        router.push('/courses');
      } else {
        // Pass the returnUrl to redirect back after sign in
        router.push('/login?returnUrl=/courses');
      }
    }, 800);
  };

  const mentors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      company: 'TechVentures India',
      bio: 'Ex-Google PM. Built and scaled 2 B2B SaaS startups to $5M ARR. Angel investor in 15+ startups.',
      expertise: ['SaaS', 'Product', 'GTM Strategy'],
      image: '/api/placeholder/200/200',
      logo: '/api/placeholder/80/30',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Partner',
      company: 'Sequoia Capital India',
      bio: 'VC with 10+ years investing in early-stage startups. Led Series A rounds in 8 unicorns.',
      expertise: ['Fundraising', 'Pitch Deck', 'Investor Relations'],
      image: '/api/placeholder/200/200',
      logo: '/api/placeholder/80/30',
    },
    {
      id: 3,
      name: 'Amit Patel',
      role: 'CTO & Co-founder',
      company: 'Fintech Solutions',
      bio: 'IIT Delhi grad. Built tech for 100M+ users. Expertise in scaling engineering teams.',
      expertise: ['Tech Stack', 'MVP Development', 'Team Building'],
      image: '/api/placeholder/200/200',
      logo: '/api/placeholder/80/30',
    },
    // {
    //   id: 3,
    //   name: 'Avinash T',
    //   role: 'CTO & Co-founder',
    //   company: 'Fintech Solutions',
    //   bio: 'IIT Delhi grad. Built tech for 100M+ users. Expertise in scaling engineering teams.',
    //   expertise: ['Tech Stack', 'MVP Development', 'Team Building'],
    //   image: '/api/placeholder/200/200',
    //   logo: '/api/placeholder/80/30',
    // },
    // {
    //   id: 3,
    //   name: 'Avinash T',
    //   role: 'CTO & Co-founder',
    //   company: 'Fintech Solutions',
    //   bio: 'IIT Delhi grad. Built tech for 100M+ users. Expertise in scaling engineering teams.',
    //   expertise: ['Tech Stack', 'MVP Development', 'Team Building'],
    //   image: '/api/placeholder/200/200',
    //   logo: '/api/placeholder/80/30',
    // },
    // {
    //   id: 3,
    //   name: 'Avinash T',
    //   role: 'CTO & Co-founder',
    //   company: 'Fintech Solutions',
    //   bio: 'IIT Delhi grad. Built tech for 100M+ users. Expertise in scaling engineering teams.',
    //   expertise: ['Tech Stack', 'MVP Development', 'Team Building'],
    //   image: '/api/placeholder/200/200',
    //   logo: '/api/placeholder/80/30',
    // },
  ];

  return (
    <section className="mentors-section">
      <div className="mentors-container">
        {/* Header */}
        <motion.div
          className="mentors-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mentors-badge">MENTORS & PARTNERS</div>
          <h2 className="mentors-title">
            Learn from Those Who've
            <br />
            <span className="mentors-highlight">Built, Scaled, and Exited</span>
          </h2>
          <p className="mentors-subtitle">
            Our mentors aren't just advisors — they're battle-tested founders, investors, and
            operators who've raised funding, built products, and scaled startups. Every student gets
            matched with a mentor based on their industry and needs.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="mentors-bento-grid">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              className={`program-mentor-card program-mentor-card-${index + 1}`}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.025, boxShadow: '0 8px 32px rgba(99,102,241,0.13)' }}
              style={{
                borderRadius: 18,
                boxShadow: '0 2px 12px rgba(30,41,59,0.07)',
                background: '#fff',
                padding: 24,
                margin: 0,
                minWidth: 0,
                width: '100%',
                maxWidth: 370,
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.18s',
              }}
            >
              <div
                className="program-mentor-card-inner"
                style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}
              >
                {/* Photo */}
                <div className="mentor-photo">
                  <div className="photo-placeholder">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="mentor-badge-tag">{mentor.expertise[0]}</div>
                </div>

                {/* Content */}
                <div className="mentor-content">
                  <div
                    className="mentor-name"
                    style={{
                      fontSize: 19,
                      fontWeight: 700,
                      color: '#18181b',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {mentor.name}
                  </div>
                  <div
                    className="mentor-role"
                    style={{ fontSize: 15, color: '#6366f1', fontWeight: 600, margin: '2px 0' }}
                  >
                    {mentor.role}
                  </div>
                  <div
                    className="mentor-company"
                    style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 2 }}
                  >
                    <span>{mentor.company}</span>
                  </div>
                  <p
                    className="mentor-bio"
                    style={{
                      fontSize: 14,
                      color: '#475569',
                      margin: 0,
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {mentor.bio}
                  </p>
                  {/* Expertise Tags */}
                  <div
                    className="mentor-expertise"
                    style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}
                  >
                    {mentor.expertise.slice(1).map((skill, idx) => (
                      <span
                        key={idx}
                        className="expertise-tag"
                        style={{
                          background: '#f1f5f9',
                          color: '#6366f1',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="mentor-cta">
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Book a Session</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mentor CTA */}
        <motion.div
          className="mentor-cta-section"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mentor-cta-content">
            <div className="mentor-cta-text">
              <h3>One-on-One Sessions with Mentors</h3>
              <p>Connect with experienced mentors, get personalized guidance, and accelerate your startup journey.</p>
            </div>
            <button 
              className="mentor-apply-btn"
              onClick={handleApplyClick}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <span>Redirecting...</span>
                  <div className="btn-loader"></div>
                </>
              ) : (
                <>
                  <span>Apply Here</span>
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
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
