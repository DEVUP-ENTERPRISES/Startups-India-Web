'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/explore-mentors-modal.css';

export default function ExploreMentorsModal({ onClose }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllMentors();
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchAllMentors = async () => {
    // Mentor data will be loaded from backend API
    setMentors([]);
    setLoading(false);
  };

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch =
      mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.current_role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <motion.div
      className="explore-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="explore-modal-container"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="explore-modal-header">
          <div className="header-content">
            {/* <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div> */}
            <div>
              <h2 className="modal-title">Explore Our Mentors</h2>
              <p className="modal-subtitle">
                {filteredMentors.length} {filteredMentors.length === 1 ? 'mentor' : 'mentors'} ready
                to guide your journey
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="explore-modal-filters">
          <div className="search-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, role, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Content */}
        <div className="explore-modal-content">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading mentors...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3>No mentors found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="mentors-grid-explore">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  className="mentor-card-explore"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="card-header-explore">
                    <div className="mentor-avatar-explore">
                      {mentor.profile_image ? (
                        <img src={mentor.profile_image} alt={mentor.full_name} />
                      ) : (
                        <div className="avatar-placeholder">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="header-info-explore">
                      <h3 className="mentor-name-explore">{mentor.full_name}</h3>
                      <p className="mentor-role-explore">{mentor.current_role}</p>
                    </div>
                    {mentor.status === 'approved' && (
                      <div className="verified-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="card-body-explore">
                    {mentor.company && (
                      <div className="company-tag-explore">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="9" y1="3" x2="9" y2="21" />
                        </svg>
                        {mentor.company}
                      </div>
                    )}

                    {mentor.expertise_areas && (
                      <div className="expertise-tags-explore">
                        {mentor.expertise_areas
                          .split(',')
                          .slice(0, 3)
                          .map((skill, idx) => (
                            <span key={idx} className="tag-explore">
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mentor-stats-explore">
                      {mentor.years_of_experience && (
                        <div className="stat-item-explore">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{mentor.years_of_experience}+ years</span>
                        </div>
                      )}
                      {mentor.email && (
                        <div className="stat-item-explore">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <span className="email-text">{mentor.email}</span>
                        </div>
                      )}
                    </div>

                    {mentor.linkedin_url && (
                      <div className="mentor-actions-explore">
                        <a
                          href={mentor.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="linkedin-link-explore"
                          onClick={e => e.stopPropagation()}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
