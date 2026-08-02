'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, Building, Network, GraduationCap, ArrowRight, X } from 'lucide-react';
import styles from './FinalCTA.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@startupsindia.in';

// ─── Spotlight Card ───
function CTAActionCard({ icon, title, index, buttonText, onClick }) {
  const cardRef = useRef(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const isMobile = useRef(false);
  const animationFrameId = useRef(null);

  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches;
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, []);

  const animate = () => {
    if (!isHovered.current) { animationFrameId.current = null; return; }
    const card = cardRef.current;
    if (!card) { animationFrameId.current = requestAnimationFrame(animate); return; }
    const ease = 0.12;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;
    card.style.setProperty('--glow-x', `${currentX.current}px`);
    card.style.setProperty('--glow-y', `${currentY.current}px`);
    if (!isMobile.current) card.style.transform = 'translateY(-8px) scale(1.02)';
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
      if (!animationFrameId.current) animate();
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'translateY(0px) scale(1)';
    card.style.setProperty('--glow-a', '0');
    if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; }
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
      <div className={styles.glowOverlay} aria-hidden="true" />
      <div className={styles.cardContent}>
        <div className={styles.iconCircle}>{icon}</div>
        <h4 className={styles.cardTitle}>{title}</h4>
        <button className={styles.cardButton} onClick={(e) => { e.stopPropagation(); onClick(); }}>
          <span>{buttonText}</span>
          <ArrowRight size={14} className={styles.buttonArrow} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function FinalCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState('Sponsor Inquiry');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const isSubmitting = useRef(false);
  const abortRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', collegeOrg: '', roleInterest: '', message: ''
  });

  const ctaCards = [
    { title: 'Become Sponsor',         buttonText: 'Apply Now',       formType: 'Sponsor Inquiry',      icon: <Handshake size={22} strokeWidth={1.8} /> },
    { title: 'Register College',        buttonText: 'Register Now',    formType: 'College Registration', icon: <Building size={22} strokeWidth={1.8} /> },
    { title: 'Become Ecosystem Partner',buttonText: 'Partner With Us', formType: 'Ecosystem Partnership',icon: <Network size={22} strokeWidth={1.8} /> },
    { title: 'Student Registration',    buttonText: 'Join Now',        formType: 'Student Registration', icon: <GraduationCap size={22} strokeWidth={1.8} /> },
  ];

  // Cleanup abort on unmount
  useEffect(() => () => { abortRef.current?.abort(); document.body.style.overflow = 'unset'; }, []);

  const handleOpenModal = (type) => {
    setFormType(type);
    setStatus('idle');
    setErrorMsg('');
    setFormData({ fullName: '', email: '', phone: '', collegeOrg: '', roleInterest: '', message: '' });
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  // ESC key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleCloseModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setField = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setStatus('submitting');
    setErrorMsg('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/api/v1/public/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          company: formData.collegeOrg.trim() || null,
          program: `${formType}${formData.roleInterest ? ` - ${formData.roleInterest}` : ''}`,
          message: formData.message.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success !== false) {
          setSubmittedEmail(formData.email.trim());
          setStatus('success');
        } else {
          throw new Error(data.message || 'Submission failed.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setErrorMsg(err.message);
      setStatus('error');
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      <motion.div
        className={styles.ctaBox}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.badgeWrapper}>
          <div className={styles.badgeLine} />
          <div className={styles.pillBadge}>Join The Mission</div>
          <div className={styles.badgeLine} />
        </div>

        <h2 className={styles.mainTitle}>
          Join India's Emerging <br />
          <span className={styles.gradientHighlight}>Campus Innovation</span> Movement
        </h2>

        <p className={styles.subtext}>
          This is your opportunity to become part of a large-scale innovation ecosystem shaping the future of entrepreneurship and startup culture in India.
        </p>

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

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <motion.div
              className={styles.modalOverlayBlur}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className={styles.closeButton} onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* ── SUCCESS STATE ── */
                  <motion.div
                    key="success"
                    className={styles.successWrapper}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={styles.successIconWrap}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3 className={styles.successTitle}>Application Submitted!</h3>
                    <p className={styles.successText}>
                      Thank you for your <strong>{formType}</strong> application. Our team will review your details and reach out within <strong>24 hours</strong>.
                    </p>
                    <div className={styles.successEmailNote}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Confirmation sent to <strong>{submittedEmail}</strong>
                    </div>
                    <div className={styles.successAdminNote}>
                      Team at <strong>{ADMIN_EMAIL}</strong> has been notified.
                    </div>
                    <button className={styles.successCloseBtn} onClick={handleCloseModal}>
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  /* ── FORM STATE ── */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className={styles.modalTitle}>
                      Apply for <span className={styles.redHighlight}>{formType}</span>
                    </h3>
                    <p className={styles.modalSubtitle}>
                      Fill in the details below to join the innovation movement.
                    </p>

                    <form className={styles.modalForm} onSubmit={handleSubmit}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-name" className={styles.formLabel}>Full Name *</label>
                          <input id="fca-name" type="text" name="fullName" placeholder="John Doe"
                            value={formData.fullName} onChange={setField('fullName')} required className={styles.formInput} />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-email" className={styles.formLabel}>Email Address *</label>
                          <input id="fca-email" type="email" name="email" placeholder="john@example.com"
                            value={formData.email} onChange={setField('email')} required className={styles.formInput} />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-phone" className={styles.formLabel}>Phone Number *</label>
                          <input id="fca-phone" type="tel" name="phone" placeholder="+91 98765 43210"
                            value={formData.phone} onChange={setField('phone')} required className={styles.formInput} />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-org" className={styles.formLabel}>College / Organization *</label>
                          <input id="fca-org" type="text" name="collegeOrg" placeholder="IIT Madras / XYZ Corp"
                            value={formData.collegeOrg} onChange={setField('collegeOrg')} required className={styles.formInput} />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-type" className={styles.formLabel}>Application Type *</label>
                          <select id="fca-type" value={formType} onChange={(e) => setFormType(e.target.value)} required className={styles.formInput}>
                            <option value="Sponsor Inquiry">Sponsor Inquiry</option>
                            <option value="College Registration">College Registration</option>
                            <option value="Ecosystem Partnership">Ecosystem Partnership</option>
                            <option value="Student Registration">Student Registration</option>
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="fca-role" className={styles.formLabel}>Role / Interest</label>
                          <input id="fca-role" type="text" name="roleInterest" placeholder="e.g. Student Lead, Silver Sponsor"
                            value={formData.roleInterest} onChange={setField('roleInterest')} className={styles.formInput} />
                        </div>
                      </div>

                      <div className={styles.formGroupFull}>
                        <label htmlFor="fca-msg" className={styles.formLabel}>Message *</label>
                        <textarea id="fca-msg" name="message" placeholder="Tell us about yourself or your organization..."
                          value={formData.message} onChange={setField('message')} required rows={3} className={styles.formTextarea} />
                      </div>

                      {status === 'error' && (
                        <div className={styles.errorBox}>
                          {errorMsg || 'Something went wrong. Please try again.'}
                        </div>
                      )}

                      <button
                        type="submit"
                        className={`${styles.submitButton} ${status === 'submitting' ? styles.submitLoading : ''}`}
                        disabled={status === 'submitting'}
                      >
                        {status === 'submitting' ? (
                          <span className={styles.btnSpinner} />
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
