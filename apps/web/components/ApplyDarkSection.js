'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import '../styles/apply-dark.css';

export default function ApplyDarkSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    program: '',
    message: '',
  });

  const programs = [
    { id: 'incubation', label: 'Incubation Program' },
    { id: 'acceleration', label: 'Acceleration Program' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'funding', label: 'Institutional Funding' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
  };

  const selectProgram = (program) => {
    setForm({ ...form, program: program.label });
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

            {/* <div className="apply-stats-horizontal">
              <div className="apply-stat-box">
                <span className="stat-number">500+</span>
                <span className="stat-label">STARTUPS</span>
              </div>
              <div className="apply-stat-box">
                <span className="stat-number">200+</span>
                <span className="stat-label">MENTORS</span>
              </div>
            </div> */}
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="apply-right-col">
            <div className="apply-form-wrapper">
              <form className="apply-form-glass" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group-glass">
                    <label>NAME</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group-glass">
                    <label>EMAIL</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-glass">
                    <label>PHONE</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group-glass">
                    <label>STARTUP / COMPANY</label>
                    <input 
                      type="text" 
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group-glass">
                  <label>PROGRAM INTEREST</label>
                  <div className="custom-dropdown" ref={dropdownRef}>
                    <div 
                      className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>{form.program || 'Select a program'}</span>
                      <ChevronDown size={18} className={`arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} />
                    </div>
                    
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
                    onChange={(e) => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button type="submit" className="apply-now-btn">
                  APPLY NOW
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
