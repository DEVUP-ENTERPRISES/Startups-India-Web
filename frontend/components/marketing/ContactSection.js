'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import '../../styles/contact.css';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' });

  // This form previously only console.logged: every enquiry a visitor typed was
  // silently discarded. POST /api/v1/public/inquiry stores it as a Lead (visible
  // in Admin → Leads/CRM) and emails the admin.
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });

    const { apiPost } = await import('@/lib/api');
    const { error } = await apiPost('/api/v1/public/inquiry', {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      program: formData.subject,
      message: formData.message,
    });

    if (error) {
      setStatus({
        state: 'error',
        message: error.message || 'Could not send your message. Please try again.',
      });
      return;
    }

    setStatus({ state: 'sent', message: "Thanks - we've received your message and will be in touch." });
    setFormData({
      firstName: '', lastName: '', email: '', phone: '',
      company: '', subject: '', message: '',
    });
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'info@startupindia.in',
      subtext: 'Send us an email anytime',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: '+91 9014878887',
      subtext: 'Mon–Fri 9am–6pm IST',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Location',
      value: 'Hyderabad, Telangana',
      subtext: 'India',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: 'Availability',
      value: 'Mon–Fri 9am–6pm IST',
      subtext: 'We typically respond within 24 hours',
    },
  ];

  const offices = [
    {
      city: 'Hyderabad',
      address: 'Third Floor, Indralok Arcade, Plot No. 143, Shop No.1, Alkapur',
      country: 'Telangana 500014, India',
      primary: true,
    },
  ];

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        {/* Header */}
        <div className="contact-header-section">
          <motion.div
            className="contact-header-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-badge">CONTACT US</div>
            <h2 className="contact-main-title">
              Let&apos;s Build Something <span className="highlight">Big</span>
            </h2>
            <p className="contact-main-subtitle">
              Whether you have questions about the program, pricing, or anything else, our team is
              ready to answer all your questions.
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="contact-content-grid">
          {/* Left Column - Contact Methods */}
          <div className="contact-left-column">
            {/* Contact Methods Grid */}
            <motion.div
              className="contact-methods-grid"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  className="contact-method-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-content">
                    <div className="method-label">{method.label}</div>
                    <div className="method-value">{method.value}</div>
                    <div className="method-subtext">{method.subtext}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Office Locations */}
            <motion.div
              className="office-locations"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="office-title">Headquarters</h3>
              <div className="office-list">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className={`office-item ${office.primary ? 'office-primary' : ''}`}
                  >
                    {office.primary && <span className="office-badge">Headquarters</span>}
                    <div className="office-city">{office.city}</div>
                    <div className="office-address">{office.address}</div>
                    <div className="office-country">{office.country}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <motion.div
            className="contact-right-column"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h3 className="form-title">Send us a message</h3>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="professional-contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input-pro"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input-pro"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input-pro"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input-pro"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="company" className="form-label">
                    Company / University (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input-pro"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select-pro"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="program-inquiry">Program Inquiry</option>
                    <option value="pricing">Pricing & Payment</option>
                    <option value="scholarship">Scholarship Application</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="form-textarea-pro"
                    required
                  ></textarea>
                </div>

                {status.state !== 'idle' && status.message && (
                  <p
                    role="status"
                    style={{
                      margin: '0 0 14px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      background: status.state === 'error' ? '#fef2f2' : '#f0fdf4',
                      color: status.state === 'error' ? '#b91c1c' : '#047857',
                      border: `1px solid ${status.state === 'error' ? '#fee2e2' : '#dcfce7'}`,
                    }}
                  >
                    {status.message}
                  </p>
                )}

                <button type="submit" className="form-submit-pro" disabled={status.state === 'sending'}>
                  <span>{status.state === 'sending' ? 'Sending…' : 'Send Message'}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
