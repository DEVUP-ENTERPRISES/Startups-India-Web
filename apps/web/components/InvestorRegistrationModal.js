'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/investor-modal-premium.css';

export default function InvestorRegistrationModal({ isOpen, onClose, user }) {
  // Support both isOpen prop and direct rendering
  const shouldShow = isOpen !== undefined ? isOpen : true;
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    organization_name: '',
    investor_type: '',
    email: user?.email || '',
    phone: '',
    linkedin_url: '',
    website_url: '',
    investment_focus: [],
    preferred_stages: [],
    ticket_size: '',
    bio: '',
    location: '',
    years_of_experience: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const investorTypes = ['Angel', 'VC', 'Fund', 'Individual', 'Corporate', 'Family Office'];

  const focusAreas = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'SaaS',
    'E-commerce',
    'AI/ML',
    'CleanTech',
    'AgriTech',
    'Logistics',
    'B2B Tech',
    'Consumer Tech',
    'Enterprise Software',
    'DeepTech',
    'IoT',
  ];

  const startupStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/v1/investors/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          full_name: user?.name || '',
          organization_name: '',
          investor_type: '',
          email: user?.email || '',
          phone: '',
          linkedin_url: '',
          website_url: '',
          investment_focus: [],
          preferred_stages: [],
          ticket_size: '',
          bio: '',
          location: '',
          years_of_experience: '',
        });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldShow) return null;

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-container success-modal"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="success-content">
            <div className="success-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="success-title">Registration Submitted!</h2>
            <p className="success-message">
              We'll review your application and get back to you within 48 hours.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="modal-overlay investor-modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-container investor-modal-container"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <button className="modal-close investor-modal-close" onClick={onClose}>
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

        <div className="modal-header investor-modal-header">
          <h2 className="modal-title investor-modal-title">Register as an Investor</h2>
          <p className="modal-subtitle investor-modal-subtitle">
            Join our verified investor network and support the next generation of startups
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-banner">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-section">
            <h3 className="section-title-modal">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="Company or fund name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Investor Type *</label>
                <select
                  name="investor_type"
                  value={formData.investor_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  {investorTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ticket Size</label>
                <input
                  type="text"
                  name="ticket_size"
                  value={formData.ticket_size}
                  onChange={handleChange}
                  placeholder="e.g., $25K-$100K"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title-modal">Investment Preferences</h3>

            <div className="form-group">
              <label>Investment Focus Areas * (Select at least one)</label>
              <div className="focus-grid">
                {focusAreas.map(area => (
                  <div
                    key={area}
                    className={`focus-option ${formData.investment_focus.includes(area) ? 'selected' : ''}`}
                    onClick={() => handleMultiSelect('investment_focus', area)}
                  >
                    {area}
                    {formData.investment_focus.includes(area) && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Startup Stages * (Select at least one)</label>
              <div className="stages-grid">
                {startupStages.map(stage => (
                  <div
                    key={stage}
                    className={`stage-option ${formData.preferred_stages.includes(stage) ? 'selected' : ''}`}
                    onClick={() => handleMultiSelect('preferred_stages', stage)}
                  >
                    {stage}
                    {formData.preferred_stages.includes(stage) && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title-modal">Additional Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio / About</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your investment philosophy and experience..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', marginBottom: '8px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
            <input
              type="checkbox"
              id="investor-terms"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              required
              style={{ width: '18px', height: '18px', accentColor: '#dc2626', marginTop: '2px', flexShrink: 0, cursor: 'pointer' }}
            />
            <label htmlFor="investor-terms" style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', cursor: 'pointer' }}>
              I agree to the <a href="/terms" target="_blank" style={{ color: '#dc2626', fontWeight: '600', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="/privacy" target="_blank" style={{ color: '#dc2626', fontWeight: '600', textDecoration: 'underline' }}>Privacy Policy</a>. I confirm that all information provided is accurate and that investor participation is program-led and subject to review.
            </label>
          </div>

          <div className="modal-footer">
            <button type="submit" className="submit-btn" disabled={loading || !termsAccepted} style={{ opacity: !termsAccepted ? 0.6 : 1 }}>
              {loading ? (
                <>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
