'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Mail, 
  User, 
  Home,
  Check
} from 'lucide-react';
import '../styles/mentor-modal-premium.css';

export default function MentorRegistrationModal({ onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    currentRole: '',
    company: '',
    experience: '',
    linkedin: '',
    expertise: [],
    bio: '',
    availability: '',
  });

  const [customExpertise, setCustomExpertise] = useState('');
  const [showCustomExpertise, setShowCustomExpertise] = useState(false);
  const [customAvailability, setCustomAvailability] = useState('');
  const [showCustomAvailability, setShowCustomAvailability] = useState(false);
  const [categorySelections, setCategorySelections] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // A. Core Startup & Business Expertise
  const coreExpertiseCategories = {
    'Strategy & Validation': [
      'Idea Validation',
      'Product-Market Fit',
      'Business Model Design',
      'Lean Startup Methodology',
      'Design Thinking',
      'Market Research',
      'Competitive Analysis',
      'Go-To-Market (GTM) Strategy',
      'Growth Strategy',
    ],
    'Product & Technology': [
      'Product Strategy',
      'Product Management',
      'MVP Development',
      'UX/UI Design',
      'System Architecture',
      'Technical Consulting',
      'AI / ML',
      'Data Science',
      'SaaS',
      'Cloud Computing',
      'Cybersecurity',
      'IoT & Embedded Systems',
      'Blockchain / Web3',
    ],
    'Marketing & Growth': [
      'Growth Hacking',
      'Digital Marketing',
      'Performance Marketing',
      'Brand Strategy',
      'Social Media Marketing',
      'Content Marketing',
      'Community Building',
      'PR & Media Strategy',
      'B2B Marketing',
      'B2C Marketing',
    ],
    'Finance & Fundraising': [
      'Financial Planning',
      'Unit Economics',
      'Startup Accounting',
      'Budgeting & Forecasting',
      'Fundraising Strategy',
      'Angel / VC Readiness',
      'Pitch Deck Review',
      'Valuation Strategy',
      'Cap Table Structuring',
      'Government Grants',
    ],
    'Team & Operations': [
      'Team Building',
      'Leadership Development',
      'Hiring & HR Strategy',
      'Organization Structure',
      'Founder Coaching',
      'Conflict Management',
      'Operational Strategy',
      'Process Building',
    ],
    'Legal & Compliance': [
      'Startup Legal Structuring',
      'DPIIT / Startup India',
      'MSME / Udyam',
      'IP / Patent / Trademark',
      'ESOP Structuring',
      'Contracts & Agreements',
      'Corporate Governance',
    ],
  };

  // B. Industry / Sector Expertise
  const industryExpertiseCategories = {
    'DeepTech & Emerging Tech': [
      'AI / ML',
      'Robotics & Mechatronics',
      'Nanotechnology',
      'Embedded Systems',
      'Semiconductor',
      'AR / VR',
      'Quantum Tech',
    ],
    'Health & Bio': [
      'HealthTech',
      'MedTech',
      'Biotech',
      'Genomics & Proteomics',
      'Drug Discovery',
      'Bioinformatics',
    ],
    'Climate & Sustainability': [
      'Climate Tech',
      'ESG',
      'Renewable Energy',
      'Circular Economy',
      'Waste Management',
      'Water & Environmental Tech',
    ],
    'Agri & Rural': ['AgriTech', 'Digital Agriculture', 'Food Processing', 'Rural Innovation'],
    'Business & FinTech': ['FinTech', 'InsurTech', 'EdTech', 'HRTech', 'LegalTech', 'GovTech'],
    'Infrastructure & Engineering': [
      'Structural Engineering',
      'Construction Tech',
      'Transportation',
      'Energy Systems',
      'Power Electronics',
      'Thermal Engineering',
    ],
    'Media & Creative': [
      'Digital Media',
      'Creator Economy',
      'Personal Branding',
      'Storytelling',
      'Content Strategy',
      'Film / Production',
    ],
  };

  // C. Stage-Specific Mentoring & Special Categories
  const stageAndSpecialCategories = {
    'Stage-Specific Mentoring': [
      'Ideation Stage',
      'Validation Stage',
      'MVP Stage',
      'Early Revenue Stage',
      'Scaling Stage',
      'Fundraising Stage',
    ],
    'Special Categories': [
      'Angel Investor',
      'Corporate CXO',
      'Serial Entrepreneur',
      'Academic Researcher',
      'Technical Advisor',
      'Policy / Government Advisor',
      'International Market Expansion',
    ],
  };

  const availabilityOptions = ['2-3 hours/week', '4-5 hours/week', '6-8 hours/week', 'Flexible'];

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpertiseToggle = (skill, category) => {
    const currentCategorySelections = categorySelections[category] || [];

    if (formData.expertise.includes(skill)) {
      // Remove from both expertise and category tracking
      setFormData(prev => ({
        ...prev,
        expertise: prev.expertise.filter(s => s !== skill),
      }));
      setCategorySelections(prev => ({
        ...prev,
        [category]: currentCategorySelections.filter(s => s !== skill),
      }));
    } else {
      // Add only if under limit
      if (currentCategorySelections.length < 3) {
        setFormData(prev => ({
          ...prev,
          expertise: [...prev.expertise, skill],
        }));
        setCategorySelections(prev => ({
          ...prev,
          [category]: [...currentCategorySelections, skill],
        }));
      }
    }
  };

  const handleAddCustomExpertise = () => {
    if (customExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, customExpertise.trim()],
      }));
      setCustomExpertise('');
      setShowCustomExpertise(false);
    }
  };

  const handleAvailabilityChange = value => {
    if (value === 'other') {
      setShowCustomAvailability(true);
      setFormData(prev => ({ ...prev, availability: '' }));
    } else {
      setShowCustomAvailability(false);
      setFormData(prev => ({ ...prev, availability: value }));
    }
  };

  const handleCustomAvailabilitySubmit = () => {
    if (customAvailability.trim()) {
      setFormData(prev => ({ ...prev, availability: customAvailability.trim() }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Comprehensive Validation
    const errors = [];

    // Personal Information - All Mandatory
    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.push('Full Name is required');
    }
    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email Address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!formData.password || formData.password.trim() === '') {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (!formData.phone || formData.phone.trim() === '') {
      errors.push('Phone Number is required');
    }

    // Professional Background - All Mandatory
    if (!formData.currentRole || formData.currentRole.trim() === '') {
      errors.push('Current Role is required');
    }
    if (!formData.company || formData.company.trim() === '') {
      errors.push('Current Company is required');
    }
    if (!formData.experience || formData.experience.trim() === '') {
      errors.push('Years of Experience is required');
    }

    // Expertise - Optional (no validation needed)
    // Users can select up to 3 per subcategory, enforced in the UI

    // Professional Bio - Mandatory
    if (!formData.bio || formData.bio.trim() === '') {
      errors.push('Professional Bio is required');
    }

    // Availability - Mandatory
    if (!formData.availability || formData.availability.trim() === '') {
      errors.push('Availability is required');
    }

    // Terms & Conditions - Mandatory
    if (!agreedToTerms) {
      errors.push('You must agree to the Terms & Conditions');
    }

    // If there are errors, display them
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError('Please fix the following errors:');
      // Scroll to top to show errors
      document.querySelector('.mentor-modal-container')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const { apiPost } = await import('@/lib/api');
      const { data, error } = await apiPost('/api/v1/mentors/apply', formData);
      
      if (error) {
        throw new Error(error.message || 'Registration failed');
      }

      // Success!
      setSuccess(true);
      setLoading(false);

      // Redirect to homepage after 8 seconds
      setTimeout(() => {
        router.push('/');
      }, 8000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      setValidationErrors(['An unexpected error occurred. Please try again or contact support.']);
      setLoading(false);
      document.querySelector('.mentor-modal-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-container success-modal-mentor"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="success-content-mentor">
            <motion.div
              className="success-icon-mentor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </motion.div>

            <motion.div
              className="success-header-mentor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="success-title-mentor">Thank You, {formData.fullName}!</h2>

              <div className="success-user-details">
                <div className="detail-row">
                   <User size={18} />
                  <span>
                    <strong>Name:</strong> {formData.fullName}
                  </span>
                </div>
                <div className="detail-row">
                  <Mail size={18} />
                  <span>
                    <strong>Email:</strong> {formData.email}
                  </span>
                </div>
              </div>

              <p className="success-message-mentor">
                We are truly grateful for your interest in becoming a mentor with us. Your
                willingness to share your knowledge and experience means a lot to our community.
              </p>

              <div className="success-info-boxes">
                <div className="info-box">
                  <div className="info-icon">
                    <CheckCircle2 size={24} color="#10B981" />
                  </div>
                  <div className="info-text">
                    <strong>Registration Successful</strong>
                    <span>
                      Your profile has been successfully submitted and saved in our system
                    </span>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">
                    <Clock size={24} color="#F59E0B" />
                  </div>
                  <div className="info-text">
                    <strong>Under Review</strong>
                    <span>Our team will carefully review your profile and credentials</span>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">
                    <Mail size={24} color="#3B82F6" />
                  </div>
                  <div className="info-text">
                    <strong>We'll Reach Out Soon</strong>
                    <span>
                      Upon approval, you will hear from us directly. Thank you for your patience!
                    </span>
                  </div>
                </div>
              </div>

              <div className="explore-section">
                <p className="explore-text">
                  Meanwhile, feel free to explore our ecosystem and discover the amazing work we're
                  doing!
                </p>
                <a href="/" className="explore-link">
                  <Home size={18} />
                  Explore Our Ecosystem
                </a>
              </div>
            </motion.div>

            <motion.div
              className="success-footer-mentor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="redirect-timer">
                <svg
                  className="spinner"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span>Redirecting to homepage in a moment...</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="modal-overlay mentor-modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-container mentor-modal-container"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <button className="modal-close mentor-modal-close" onClick={onClose}>
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

        <div className="modal-header mentor-modal-header">
          <h2 className="modal-title mentor-modal-title">Become a Mentor</h2>
          <p className="modal-subtitle mentor-modal-subtitle">
            Share your expertise and shape the future
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && validationErrors.length > 0 && (
            <div className="error-banner-detailed">
              <div className="error-header">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <strong>{error}</strong>
              </div>
              <ul className="error-list">
                {validationErrors.map((err, index) => (
                  <li key={index}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-section">
            <h3 className="section-title-modal">Personal Information</h3>
            <p className="mandatory-note">All fields are mandatory *</p>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Dr. Priya Sharma"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="priya@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title-modal">Professional Background</h3>
            <p className="mandatory-note">All fields are mandatory *</p>

            <div className="form-row">
              <div className="form-group">
                <label>Current Role *</label>
                <input
                  type="text"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleInputChange}
                  placeholder="Senior Product Manager"
                  required
                />
              </div>
              <div className="form-group">
                <label>Current Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Google"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Years of Experience *</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select experience</option>
                  <option value="5-7 years">5-7 years</option>
                  <option value="8-10 years">8-10 years</option>
                  <option value="10-15 years">10-15 years</option>
                  <option value="15+ years">15+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title-modal">Expertise Selection</h3>
            <p className="section-description">
              Select your areas of expertise (optional - up to 3 per subcategory)
            </p>

            {/* A. Core Startup & Business Expertise */}
            <div className="expertise-category-section">
              <div className="category-header">
                <h4 className="category-title">
                  <span className="category-icon">
                    <Rocket size={20} color="#E53935" />
                  </span>
                  A. Core Startup & Business Expertise
                </h4>
                <span className="category-subtitle">Select up to 3 options per subcategory</span>
              </div>

              {Object.entries(coreExpertiseCategories).map(([category, options]) => {
                const categoryKey = `core-${category}`;
                const selectedInCategory = categorySelections[categoryKey] || [];
                const remainingSlots = 3 - selectedInCategory.length;

                return (
                  <div key={category} className="subcategory-block">
                    <div className="subcategory-header">
                      <label className="subcategory-label">{category}</label>
                      <span className="selection-counter">
                        {selectedInCategory.length}/3 selected
                      </span>
                    </div>

                    <select
                      className="expertise-dropdown"
                      onChange={e => {
                        if (e.target.value) {
                          handleExpertiseToggle(e.target.value, categoryKey);
                          e.target.value = '';
                        }
                      }}
                      disabled={remainingSlots === 0}
                    >
                      <option value="">
                        {remainingSlots === 0
                          ? 'Maximum 3 selected'
                          : `Select ${category} (${remainingSlots} remaining)`}
                      </option>
                      {options.map(option => (
                        <option
                          key={option}
                          value={option}
                          disabled={formData.expertise.includes(option)}
                        >
                          {option} {formData.expertise.includes(option) ? '✓' : ''}
                        </option>
                      ))}
                    </select>

                    {/* Show selected items below dropdown */}
                    {selectedInCategory.length > 0 && (
                      <div className="selected-items-inline">
                        {selectedInCategory.map(item => (
                          <div key={item} className="selected-tag-inline">
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleExpertiseToggle(item, categoryKey)}
                              className="remove-inline-btn"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* B. Industry / Sector Expertise */}
            <div className="expertise-category-section">
              <div className="category-header">
                <h4 className="category-title">
                  <span className="category-icon">
                    <Building2 size={20} color="#E53935" />
                  </span>
                  B. Industry / Sector Expertise
                </h4>
                <span className="category-subtitle">Select up to 3 options per subcategory</span>
              </div>

              {Object.entries(industryExpertiseCategories).map(([category, options]) => {
                const categoryKey = `industry-${category}`;
                const selectedInCategory = categorySelections[categoryKey] || [];
                const remainingSlots = 3 - selectedInCategory.length;

                return (
                  <div key={category} className="subcategory-block">
                    <div className="subcategory-header">
                      <label className="subcategory-label">{category}</label>
                      <span className="selection-counter">
                        {selectedInCategory.length}/3 selected
                      </span>
                    </div>

                    <select
                      className="expertise-dropdown"
                      onChange={e => {
                        if (e.target.value) {
                          handleExpertiseToggle(e.target.value, categoryKey);
                          e.target.value = '';
                        }
                      }}
                      disabled={remainingSlots === 0}
                    >
                      <option value="">
                        {remainingSlots === 0
                          ? 'Maximum 3 selected'
                          : `Select ${category} (${remainingSlots} remaining)`}
                      </option>
                      {options.map(option => (
                        <option
                          key={option}
                          value={option}
                          disabled={formData.expertise.includes(option)}
                        >
                          {option} {formData.expertise.includes(option) ? '✓' : ''}
                        </option>
                      ))}
                    </select>

                    {selectedInCategory.length > 0 && (
                      <div className="selected-items-inline">
                        {selectedInCategory.map(item => (
                          <div key={item} className="selected-tag-inline">
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleExpertiseToggle(item, categoryKey)}
                              className="remove-inline-btn"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* C. Stage-Specific & Special Categories */}
            <div className="expertise-category-section">
              <div className="category-header">
                <h4 className="category-title">
                  <span className="category-icon">📊</span>
                  C. Stage-Specific Mentoring & Special Categories
                </h4>
                <span className="category-subtitle">Select up to 3 options per subcategory</span>
              </div>

              {Object.entries(stageAndSpecialCategories).map(([category, options]) => {
                const categoryKey = `stage-${category}`;
                const selectedInCategory = categorySelections[categoryKey] || [];
                const remainingSlots = 3 - selectedInCategory.length;

                return (
                  <div key={category} className="subcategory-block">
                    <div className="subcategory-header">
                      <label className="subcategory-label">{category}</label>
                      <span className="selection-counter">
                        {selectedInCategory.length}/3 selected
                      </span>
                    </div>

                    <select
                      className="expertise-dropdown"
                      onChange={e => {
                        if (e.target.value) {
                          handleExpertiseToggle(e.target.value, categoryKey);
                          e.target.value = '';
                        }
                      }}
                      disabled={remainingSlots === 0}
                    >
                      <option value="">
                        {remainingSlots === 0
                          ? 'Maximum 3 selected'
                          : `Select ${category} (${remainingSlots} remaining)`}
                      </option>
                      {options.map(option => (
                        <option
                          key={option}
                          value={option}
                          disabled={formData.expertise.includes(option)}
                        >
                          {option} {formData.expertise.includes(option) ? '✓' : ''}
                        </option>
                      ))}
                    </select>

                    {selectedInCategory.length > 0 && (
                      <div className="selected-items-inline">
                        {selectedInCategory.map(item => (
                          <div key={item} className="selected-tag-inline">
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleExpertiseToggle(item, categoryKey)}
                              className="remove-inline-btn"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Expertise Option */}
            <div className="form-group">
              <label>Add Custom Expertise</label>
              <div className="custom-input-wrapper">
                <input
                  type="text"
                  value={customExpertise}
                  onChange={e => setCustomExpertise(e.target.value)}
                  placeholder="Enter any other expertise area..."
                  className="custom-input"
                  onKeyPress={e =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddCustomExpertise())
                  }
                />
                <button
                  type="button"
                  onClick={handleAddCustomExpertise}
                  className="add-custom-btn"
                  disabled={!customExpertise.trim()}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Add
                </button>
              </div>
            </div>

            {/* Total Expertise Summary */}
            {formData.expertise.length > 0 && (
              <div className="expertise-summary">
                <div className="summary-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>
                    <strong>{formData.expertise.length}</strong> expertise areas selected
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="section-title-modal">Additional Information</h3>
            <p className="mandatory-note">All fields are mandatory *</p>

            <div className="form-group">
              <label>Professional Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your journey and expertise..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Availability *</label>
              <select
                name="availability"
                value={showCustomAvailability ? 'other' : formData.availability}
                onChange={e => handleAvailabilityChange(e.target.value)}
                required
              >
                <option value="">Select availability</option>
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'Flexible' ? 'Flexible schedule' : option + ' per week'}
                  </option>
                ))}
                <option value="other">Other (Specify)</option>
              </select>

              {/* Custom Availability Input */}
              {showCustomAvailability && (
                <motion.div
                  className="custom-input-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="custom-input-wrapper">
                    <input
                      type="text"
                      value={customAvailability}
                      onChange={e => setCustomAvailability(e.target.value)}
                      placeholder="Enter your availability (e.g., Weekends only, 10 hours/week)..."
                      className="custom-input"
                      onKeyPress={e =>
                        e.key === 'Enter' && (e.preventDefault(), handleCustomAvailabilitySubmit())
                      }
                      onBlur={handleCustomAvailabilitySubmit}
                    />
                    <button
                      type="button"
                      onClick={handleCustomAvailabilitySubmit}
                      className="add-custom-btn"
                      disabled={!customAvailability.trim()}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Set
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Display custom availability */}
              {formData.availability && !availabilityOptions.includes(formData.availability) && (
                <div className="custom-availability-display">
                  <span className="custom-tag">Custom: {formData.availability}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="terms-section">
            <label className="terms-checkbox-container">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="terms-checkbox"
              />
              <span className="terms-checkmark"></span>
              <span className="terms-text">
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{' '}
                *
              </span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Complete Registration'}
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
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
