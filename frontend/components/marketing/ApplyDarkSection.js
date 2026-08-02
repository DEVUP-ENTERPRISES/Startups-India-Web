'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';
import { validateEmail, validatePhone, formatPhoneForSubmit } from '@/lib/validation';
import '../../styles/apply-dark.css';

export default function ApplyDarkSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isSubmitting = useRef(false);
  const abortRef = useRef(null);

  const [form, setForm] = useState({
    name: '', email: '', phoneDigits: '', phoneCountry: '+91',
    company: '', program: '', message: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const programs = [
    { id: 'incubation',    label: 'Incubation Program' },
    { id: 'pre-incubation',label: 'Pre-Incubation Cohort' },
    { id: 'acceleration',  label: 'Acceleration Program' },
    { id: 'mentorship',    label: 'Mentorship' },
    { id: 'funding',       label: 'Institutional Funding' },
    { id: 'other',         label: 'Other' },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const setField = useCallback((field) => (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  }, [fieldErrors]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    const emailErr = validateEmail(form.email);
    if (emailErr) errors.email = emailErr;
    const phoneErr = validatePhone(form.phoneDigits, form.phoneCountry);
    if (phoneErr) errors.phone = phoneErr;
    if (!form.program) errors.program = 'Please select a program';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    isSubmitting.current = true;
    setSubmitting(true);
    setSubmitError('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/public/inquiry`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: formatPhoneForSubmit(form.phoneDigits, form.phoneCountry),
            company: form.company.trim() || null,
            program: form.program,
            message: form.message.trim() || null,
          }),
        }
      );
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      isSubmitting.current = false;
      setSubmitting(false);
    }
  };

  const selectProgram = (program) => {
    setForm(prev => ({ ...prev, program: program.label }));
    setFieldErrors(prev => ({ ...prev, program: '' }));
    setIsDropdownOpen(false);
  };

  return (
    <section className="apply-dark-section">
      <div className="apply-section-header">
        <motion.h2 
          className="apply-main-title !text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Let's Build Something Big
        </motion.h2>
        <motion.p 
          className="apply-main-subtitle !text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join an elite ecosystem providing the foundational infrastructure, capital access, and mentorship networks required for high-impact ventures to thrive.
        </motion.p>
      </div>

      <div className="iec-container">
        <motion.div 
          className="apply-glass-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* LEFT COLUMN: Values + Contact + Stats */}
          <div className="apply-left-col">
            <h3 className="apply-panel-title !text-white">Apply to Join the Ecosystem</h3>
            
            <ul className="apply-feature-list">
              <li className="!text-gray-200"><span className="red-dot"></span>Expert mentorship access</li>
              <li className="!text-gray-200"><span className="red-dot"></span>Institutional funding opportunities</li>
              <li className="!text-gray-200"><span className="red-dot"></span>Structured startup programs</li>
              <li className="!text-gray-200"><span className="red-dot"></span>Strategic corporate partnerships</li>
            </ul>

            <div className="apply-contact-cards">
              <div className="contact-card-glass">
                <div className="contact-card-icon"><Mail size={18} /></div>
                <div className="contact-card-data">
                  <span className="contact-label">EMAIL</span>
                  <span className="contact-value">info@startupsindia.in</span>
                </div>
              </div>
              <div className="contact-card-glass">
                <div className="contact-card-icon"><Phone size={18} /></div>
                <div className="contact-card-data">
                  <span className="contact-label">PHONE</span>
                  <span className="contact-value">+91 9014878887</span>
                </div>
              </div>
              <div className="contact-card-glass">
                <div className="contact-card-icon"><MapPin size={18} /></div>
                <div className="contact-card-data">
                  <span className="contact-label">OFFICE</span>
                  <span className="contact-value">Hyderabad, Telangana</span>
                </div>
              </div>
              <div className="contact-card-glass">
                <div className="contact-card-icon"><Clock size={18} /></div>
                <div className="contact-card-data">
                  <span className="contact-label">RESPONSE TIME</span>
                  <span className="contact-value">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="apply-right-col">
            <div className="apply-form-wrapper">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    className="success-message-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="success-icon-wrapper">
                      <div className="success-icon-bg">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                    <h3 className="success-title">Application Received!</h3>
                    <p className="success-text">
                      Thank you for applying to Startups India. Your vision is being reviewed by our strategic board.
                    </p>
                    <div className="success-timeline">
                      <div className="timeline-dot"></div>
                      <span className="timeline-text">Our team will connect with you within 24 hours.</span>
                    </div>
                    <button
                      className="reset-form-btn"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: '', email: '', phoneDigits: '', phoneCountry: '+91', company: '', program: '', message: '' });
                        setFieldErrors({});
                      }}
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form className="apply-form-glass" onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                      <div className="form-group-glass">
                        <label>NAME</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={setField('name')}
                          style={fieldErrors.name ? { borderColor: '#ef4444' } : {}}
                        />
                        {fieldErrors.name && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 3, display: 'block' }}>{fieldErrors.name}</span>}
                      </div>
                      <div className="form-group-glass">
                        <label>EMAIL</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={setField('email')}
                          style={fieldErrors.email ? { borderColor: '#ef4444' } : {}}
                        />
                        {fieldErrors.email && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 3, display: 'block' }}>{fieldErrors.email}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group-glass">
                        <label>PHONE</label>
                        <PhoneInput
                          value={form.phoneDigits}
                          countryCode={form.phoneCountry}
                          darkMode={true}
                          required
                          onChange={(digits, country) => setForm(prev => ({ ...prev, phoneDigits: digits, phoneCountry: country }))}
                          onError={(err) => setFieldErrors(prev => ({ ...prev, phone: err || '' }))}
                          inputStyle={fieldErrors.phone ? { borderColor: '#ef4444' } : {}}
                        />
                        {fieldErrors.phone && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 3, display: 'block' }}>{fieldErrors.phone}</span>}
                      </div>
                      <div className="form-group-glass">
                        <label>STARTUP / COMPANY</label>
                        <input
                          type="text"
                          placeholder="XYZ Pvt. Ltd."
                          value={form.company}
                          onChange={setField('company')}
                        />
                      </div>
                    </div>

                    <div className="form-group-glass">
                      <label>PROGRAM INTEREST</label>
                      <div className="custom-dropdown" ref={dropdownRef}>
                        <div
                          className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          style={fieldErrors.program ? { borderColor: '#ef4444' } : {}}
                        >
                          <span>{form.program || 'Select a program'}</span>
                          <ChevronDown size={18} className={`arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} />
                        </div>
                        {fieldErrors.program && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 3, display: 'block' }}>{fieldErrors.program}</span>}

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              className="dropdown-menu"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {programs.map((item) => (
                                <div
                                  key={item.id}
                                  className={`dropdown-option ${form.program === item.label ? 'selected' : ''}`}
                                  onClick={() => selectProgram(item)}
                                >
                                  {item.label}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="form-group-glass">
                      <label>MESSAGE</label>
                      <textarea
                        placeholder="Tell us about your vision..."
                        rows={4}
                        value={form.message}
                        onChange={setField('message')}
                      />
                    </div>

                    {submitError && (
                      <p style={{ fontSize: 12.5, color: '#ef4444', textAlign: 'center', margin: '-4px 0' }}>{submitError}</p>
                    )}

                    <button type="submit" className="apply-now-btn" disabled={submitting}>
                      {submitting ? (
                        <div className="btn-loader"></div>
                      ) : 'APPLY NOW'}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
