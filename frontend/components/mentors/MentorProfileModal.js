'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Globe, 
  Briefcase, 
  Calendar, 
  ExternalLink,
  MessageSquare,
  Clock,
  ShieldCheck,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';
import '../../styles/mentor-profile-modal.css';
import BookSessionModal from '@/components/mentors/BookSessionModal';

const LinkedInIcon = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function initialsAvatar(name) {
  const initials = String(name || 'M')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e63946"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="110" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function MentorProfileModal({ mentor, onClose }) {
  const [showBookSession, setShowBookSession] = useState(false);
  if (!mentor) return null;

  // Mock data for missing fields
  const mockTestimonials = [
    {
      text: "The session was incredibly insightful. Bharat helped me refine my GTM strategy in just 45 minutes.",
      author: "Rahul S.",
      role: "SaaS Founder"
    },
    {
      text: "Practical advice with a deep understanding of market dynamics. Highly recommended!",
      author: "Ananya K.",
      role: "EdTech Founder"
    }
  ];

  const mockSessionInfo = {
    type: "1:1 Strategy Mentorship",
    timings: "Sat - Sun | 10:00 AM - 2:00 PM",
    price: "₹1,499",
    mode: "Online (Video Call)"
  };

  return (
    <>
    <AnimatePresence>
      <motion.div 
        className="mentor-profile-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="mentor-profile-modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="mentor-profile-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="mentor-profile-scroll">
            {/* Top Section */}
            <header className="profile-header-premium">
              <div className="profile-image-container">
                <img
                  src={mentor.profile_image || initialsAvatar(mentor.full_name)}
                  alt={mentor.full_name}
                  onError={e => { e.currentTarget.src = initialsAvatar(mentor.full_name); }}
                />
                <div className="profile-image-overlay"></div>
              </div>
              
              <div className="profile-info-main">
                <div className="status-badge-row">
                  <div className="premium-badge badge-verified">
                    <ShieldCheck size={14} />
                    Verified Expert
                  </div>
                  <div className="premium-badge badge-available">
                    <Clock size={14} />
                    Available This Week
                  </div>
                </div>

                <h2 className="profile-name-premium">{mentor.full_name}</h2>
                <p className="profile-title-premium">{mentor.current_role}</p>
                
              </div>
            </header>

            {/* Content Grid */}
            <div className="profile-content-grid">
              <div className="profile-main-column">
                {/* About Section */}
                <section className="profile-about-section">
                  <div className="profile-section-title">
                    <span><Briefcase size={20} /></span>
                    <h3>About Mentor</h3>
                  </div>
                  <p className="bio-text-full">
                    {mentor.bio}
                  </p>
                </section>

                {/* Experience & Professional Details */}
                <section className="professional-details-section">
                  <div className="profile-section-title">
                    <span><Award size={20} /></span>
                    <h3>Professional Highlights</h3>
                  </div>
                  <div className="info-card-premium">
                    <div className="stats-mini-grid">
                      <div className="mini-stat-item">
                        <span className="mini-stat-label">Experience</span>
                        <span className="mini-stat-value">{mentor.experience}</span>
                      </div>
                      <div className="mini-stat-item">
                        <span className="mini-stat-label">Worked At</span>
                        <span className="mini-stat-value">{mentor.company}</span>
                      </div>
                      <div className="mini-stat-item">
                        <span className="mini-stat-label">Past Companies</span>
                        <span className="mini-stat-value">{mentor.previous_companies?.join(', ') || 'N/A'}</span>
                      </div>
                      <div className="mini-stat-item">
                        <span className="mini-stat-label">Mentees Guided</span>
                        <span className="mini-stat-value">{mentor.total_mentees}+ Founders</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Expertise Section */}
                <section className="expertise-section-premium">
                  <div className="profile-section-title">
                    <span><CheckCircle2 size={20} /></span>
                    <h3>Mentorship Expertise</h3>
                  </div>
                  <div className="tags-container-premium">
                    {mentor.expertise.map((tag, idx) => (
                      <span key={idx} className="tag-premium">{tag}</span>
                    ))}
                  </div>
                </section>

                {/* Testimonials */}
                <section className="testimonials-section-premium">
                  <div className="profile-section-title">
                    <span><MessageSquare size={20} /></span>
                    <h3>Mentee Reviews</h3>
                  </div>
                  <div className="testimonials-row">
                    {mockTestimonials.map((t, idx) => (
                      <div key={idx} className="testimonial-card-premium">
                        <p className="testimonial-text">"{t.text}"</p>
                        <div className="testimonial-author">
                          <div className="author-avatar"></div>
                          <div className="author-info">
                            <h5>{t.author}</h5>
                            <span>{t.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="profile-side-column">
                {/* Session Booking Card */}
                <div className="info-card-premium session-info-card">
                  <div className="profile-section-title">
                    <span><Calendar size={20} /></span>
                    <h3 style={{fontSize: '18px'}}>Session Details</h3>
                  </div>
                  
                  <div className="session-details-list">
                    <div className="mini-stat-item" style={{marginBottom: '15px'}}>
                      <span className="mini-stat-label">Session Type</span>
                      <span className="mini-stat-value" style={{fontSize: '15px'}}>{mockSessionInfo.type}</span>
                    </div>
                    <div className="mini-stat-item" style={{marginBottom: '15px'}}>
                      <span className="mini-stat-label">Availability</span>
                      <span className="mini-stat-value" style={{fontSize: '15px'}}>{mockSessionInfo.timings}</span>
                    </div>
                    <div className="mini-stat-item">
                      <span className="mini-stat-label">Mode</span>
                      <span className="mini-stat-value" style={{fontSize: '15px'}}>{mockSessionInfo.mode}</span>
                    </div>
                  </div>

                  <div className="session-price-row">
                    <div className="price-info">
                      <span className="mini-stat-label">Starting from</span>
                      <div className="price-value">{mockSessionInfo.price}</div>
                    </div>
                    <ChevronRight size={24} color="#dc2626" />
                  </div>
                </div>

                {/* Languages Card */}
                <div className="info-card-premium">
                  <div className="profile-section-title">
                    <span><Globe size={20} /></span>
                    <h3 style={{fontSize: '18px'}}>Languages</h3>
                  </div>
                  <div className="tags-container-premium">
                    <span className="tag-premium">English</span>
                    <span className="tag-premium">Hindi</span>
                    <span className="tag-premium">Telugu</span>
                  </div>
                </div>

                {/* Network Card */}
                <div className="info-card-premium">
                  <div className="profile-section-title">
                    <span><Users size={20} /></span>
                    <h3 style={{fontSize: '18px'}}>Alumni Network</h3>
                  </div>
                  <p style={{color: '#94a3b8', fontSize: '13px', lineHeight: '1.5'}}>
                    Bharat has mentored founders from top IITs, IIMs, and worked with startups across Bangalore, Hyderabad, and Mumbai.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <footer className="profile-footer-sticky">
            <div className="footer-social-links">
              <a
                href={mentor.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn-premium"
                aria-label="LinkedIn"
                onClick={e => { if (!mentor.linkedin_url) e.preventDefault(); }}
                style={mentor.linkedin_url ? undefined : { opacity: 0.5, cursor: 'default' }}
              >
                <LinkedInIcon size={20} />
              </a>
              <a href="#" className="social-btn-premium" aria-label="Portfolio">
                <ExternalLink size={20} />
              </a>
            </div>

            <div className="footer-actions-main">
              <button
                className="btn-secondary-premium"
                style={{ cursor: 'default', opacity: 0.6, pointerEvents: 'none' }}
                disabled
              >
                Send Request
              </button>
              <button
                className="btn-primary-premium"
                style={{ cursor: 'default', opacity: 0.6, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Coming Soon</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>

    {showBookSession && (
      <BookSessionModal
        mentor={mentor}
        onClose={() => setShowBookSession(false)}
      />
    )}
    </>
  );
}
