'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, Building, Network, GraduationCap, ArrowRight, X, CheckCircle } from 'lucide-react';
import styles from './FinalCTA.module.css';

// ─── Custom Interactive Glassmorphism Card with LERP Spotlight ───
function CTAActionCard({ icon, title, index, buttonText, onClick }) {
  const cardRef = useRef(null);
  
  // Coordinates LERP refs for smooth 60fps animations
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const isMobile = useRef(false);
  const animationFrameId = useRef(null);

  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches;
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const animate = () => {
    if (!isHovered.current) {
      animationFrameId.current = null;
      return;
    }

    const card = cardRef.current;
    if (!card) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const ease = 0.12;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    // Push smooth coordinates to custom CSS variables
    card.style.setProperty('--glow-x', `${currentX.current}px`);
    card.style.setProperty('--glow-y', `${currentY.current}px`);

    if (!isMobile.current) {
      // GPU-accelerated lift & scale
      card.style.transform = 'translateY(-8px) scale(1.02)';
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;

    if (!isHovered.current) {
      isHovered.current = true;
      card.style.setProperty('--glow-a', '1');
      if (!animationFrameId.current) {
        animate();
      }
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'translateY(0px) scale(1)';
    card.style.setProperty('--glow-a', '0');

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={styles.actionCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background spotlight overlay */}
      <div className={styles.glowOverlay} aria-hidden="true" />
      
      {/* Content layout wrapper */}
      <div className={styles.cardContent}>
        <div className={styles.iconCircle}>
          {icon}
        </div>
        <h4 className={styles.cardTitle}>
          {title}
        </h4>
        <button 
          className={styles.cardButton}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span>{buttonText}</span>
          <ArrowRight size={14} className={styles.buttonArrow} />
        </button>
      </div>
    </motion.div>
  );
}

export default function FinalCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState('Sponsor Inquiry');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeOrg: '',
    roleInterest: '',
    message: ''
  });

  const ctaCards = [
    {
      title: 'Become Sponsor',
      buttonText: 'Apply Now',
      formType: 'Sponsor Inquiry',
      icon: <Handshake size={22} strokeWidth={1.8} />
    },
    {
      title: 'Register College',
      buttonText: 'Register Now',
      formType: 'College Registration',
      icon: <Building size={22} strokeWidth={1.8} />
    },
    {
      title: 'Become Ecosystem Partner',
      buttonText: 'Partner With Us',
      formType: 'Ecosystem Partnership',
      icon: <Network size={22} strokeWidth={1.8} />
    },
    {
      title: 'Student Registration',
      buttonText: 'Join Now',
      formType: 'Student Registration',
      icon: <GraduationCap size={22} strokeWidth={1.8} />
    }
  ];

  const handleOpenModal = (type) => {
    setFormType(type);
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      collegeOrg: '',
      roleInterest: '',
      message: ''
    });
    setIsOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
  };

  return (
    <section className={styles.sectionWrapper}>
      {/* Ambient backgrounds */}
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Spacious centered glass panel container */}
      <motion.div 
        className={styles.ctaBox}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top uppercase tag badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badgeLine} />
          <div className={styles.pillBadge}>Join The Mission</div>
          <div className={styles.badgeLine} />
        </div>

        {/* Large Heading &constrained subtext */}
        <h2 className={styles.mainTitle}>
          Join India’s Emerging <br />
          <span className={styles.gradientHighlight}>Campus Innovation</span> Movement 🚀
        </h2>

        <p className={styles.subtext}>
          This is your opportunity to become part of a large-scale innovation ecosystem shaping the future of entrepreneurship and startup culture in India.
        </p>

        {/* 4 horizontal cards layout */}
        <div className={styles.cardsGrid}>
          {ctaCards.map((card, idx) => (
            <CTAActionCard
              key={idx}
              title={card.title}
              buttonText={card.buttonText}
              icon={card.icon}
              index={idx}
              onClick={() => handleOpenModal(card.formType)}
            />
          ))}
        </div>
      </motion.div>

      {/* Popup Modal with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <motion.div 
              className={styles.modalOverlayBlur}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close Button top-right */}
              <button className={styles.closeButton} onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>

              {!isSubmitted ? (
                <>
                  <h3 className={styles.modalTitle}>
                    Apply for <span className={styles.redHighlight}>{formType}</span>
                  </h3>
                  <p className={styles.modalSubtitle}>
                    Fill in the details below to join the innovation movement.
                  </p>

                  <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="collegeOrg" className={styles.formLabel}>College / Organization</label>
                        <input
                          type="text"
                          id="collegeOrg"
                          name="collegeOrg"
                          placeholder="IIT Madras / XYZ Corp"
                          value={formData.collegeOrg}
                          onChange={handleInputChange}
                          required
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="formType" className={styles.formLabel}>Application Type</label>
                        <select
                          id="formType"
                          name="formType"
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          required
                          className={styles.formInput}
                        >
                          <option value="Sponsor Inquiry">Sponsor Inquiry</option>
                          <option value="College Registration">College Registration</option>
                          <option value="Ecosystem Partnership">Ecosystem Partnership</option>
                          <option value="Student Registration">Student Registration</option>
                        </select>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="roleInterest" className={styles.formLabel}>Role / Interest</label>
                        <input
                          type="text"
                          id="roleInterest"
                          name="roleInterest"
                          placeholder="e.g. Student Lead, Silver Sponsor"
                          value={formData.roleInterest}
                          onChange={handleInputChange}
                          required
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="message" className={styles.formLabel}>Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us a bit about yourself or your organization..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className={styles.formTextarea}
                        rows={3}
                      />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      <span>Submit Application</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  className={styles.successWrapper}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.successIconWrapper}>
                    <CheckCircle className={styles.successIcon} size={64} />
                  </div>
                  <h3 className={styles.successTitle}>Application Submitted!</h3>
                  <p className={styles.successText}>
                    Thank you for applying. Our team will review your details and get back to you shortly.
                  </p>
                  <button className={styles.successCloseBtn} onClick={handleCloseModal}>
                    Close Window
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
