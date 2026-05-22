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
  Linkedin, 
  ExternalLink,
  MessageSquare,
  Clock,
  ShieldCheck,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';
import '../styles/mentor-profile-modal.css';
import BookSessionModal from '@/components/BookSessionModal';

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
                <img src={mentor.profile_image} alt={mentor.full_name} />
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
                
                <div className="profile-rating-hero">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < 5 ? "#F59E0B" : "transparent"} color="#F59E0B" />
                    ))}
                  </div>
                  <span className="rating-value">{mentor.rating || "4.9"}</span>
                  <span className="rating-label">Based on {mentor.total_sessions || "400"}+ sessions</span>
                </div>
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
              <a href="#" className="social-btn-premium" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-btn-premium" aria-label="Portfolio">
                <ExternalLink size={20} />
              </a>
            </div>

            <div className="footer-actions-main">
              <button className="btn-secondary-premium">Send Request</button>
              <button className="btn-primary-premium" onClick={() => setShowBookSession(true)}>Book a Session</button>
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
