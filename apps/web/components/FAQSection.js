'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        if (window.location.hash === '#contact-form') {
          setShowForm(true);
        }
      }
    }
    checkAuth();
  }, []);

  const handleContactClick = () => {
    if (!user) {
      router.push('/login?returnUrl=' + encodeURIComponent(pathname + '#contact-form'));
    } else {
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = encodeURIComponent('Contact Request from ' + formData.get('name'));
    const body = encodeURIComponent(`Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\nMessage:\n${formData.get('message')}`);
    window.location.href = `mailto:admin@stratupsindia.in?subject=${subject}&body=${body}`;
    setShowForm(false);
  };

  const faqs = [
    {
      id: 1,
      question: 'What is the Startups India Pre-Incubation Cohort (SINPC)?',
      answer: "The Startups India Pre-Incubation Cohort (SINPC) is a structured pre-incubation program for startups in India designed to support aspiring entrepreneurs and early-stage founders. The program helps participants validate startup ideas, build prototypes, and prepare for incubation and funding opportunities within the startup ecosystem in India."
    },
    {
      id: 2,
      question: 'Who can apply for the SINPC startup program?',
      answer: 'The SINPC startup mentorship program is open to students, innovators, entrepreneurs, and early-stage startup founders who have innovative business ideas and want to build scalable startups.'
    },
    {
      id: 3,
      question: '3. What are the benefits of joining the SINPC startup program?',
      answer: 'Participants in the Startups India Pre-Incubation Cohort receive: Expert startup mentorship, Business model development support, Guidance for startup funding and investor readiness, Market validation strategies, Access to the Indian startup ecosystem.'
    },
    {
      id: 4,
      question: 'How long is the Startups India Pre-Incubation Cohort program?',
      answer: 'The pre-incubation program duration is typically 8–12 weeks, where participants attend mentorship sessions, workshops, and startup development activities.'
    },
    {
      id: 5,
      question: 'Do I need a registered startup to join this startup incubation program?',
      answer: 'No. You can apply with just a startup idea or early-stage concept. Registration of a company is not mandatory to join the pre-incubation program in India.'
    },
    {
      id: 6,
      question: "Will participants receive mentorship during the program?",
      answer: "Yes. The program provides access to startup mentors, industry experts, and experienced founders who guide participants in product development, business strategy, and market validation."
    },
    {
      id: 7,
      question: 'Will I receive a certificate after completing the program?',
      answer: 'Yes. Participants who successfully complete the Startups India Pre-Incubation Cohort (SINPC) will receive a certificate of completion, recognizing their participation in the startup development program.'
    },
    {
      id: 8,
      question: 'What happens after completing the SINPC program?',
      answer: 'After completing the program, promising startups may get the opportunity to enter a startup incubation program or accelerator program, where they receive advanced mentorship, networking opportunities, and potential access to investors.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="faq-section">
        {/* Background Elements */}
        <div className="faq-bg">
          <div className="faq-gradient faq-gradient-1"></div>
          <div className="faq-gradient faq-gradient-2"></div>
        </div>

        <div className="faq-container">
          {/* Header */}
          <motion.div
            className="faq-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="faq-badge">FAQ</div>
            <h2 className="faq-title">
              Questions?<br />
              <span className="faq-highlight">We've Got Answers.</span>
            </h2>
          </motion.div>

          {/* FAQ Grid */}
          <div className="faq-grid">
            {/* Accordion Column */}
            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  className={`faq-item ${openIndex === index ? 'faq-item-open' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className="faq-question-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        {openIndex === index ? (
                          <path d="M5 12h14" />
                        ) : (
                          <>
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </>
                        )}
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        className="faq-answer-wrapper"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="faq-answer">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Side Info Card */}
            <motion.div
              className="faq-side-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="faq-card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 10h.01M12 10h.01M16 10h.01"/>
                </svg>
              </div>
              <h3 className="faq-card-title">Still have questions?</h3>
              <p className="faq-card-text">
                Our team is here to help you understand the program better and answer any specific questions you might have.
              </p>
              <div className="faq-card-features">
                <div className="faq-card-feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Quick response time</span>
                </div>
                <div className="faq-card-feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Personalized guidance</span>
                </div>
                <div className="faq-card-feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>No commitment required</span>
                </div>
              </div>
              <button className="faq-card-cta" onClick={handleContactClick}>
                <span>Contact Our Team</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
              className="premium-modal"
            >
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s', outline: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div style={{ marginBottom: '28px', paddingRight: '30px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>Contact Our Team</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>Have questions? Fill out the form below and our team will get back to you shortly.</p>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Full Name</label>
                  <input type="text" name="name" required placeholder="John Doe" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }} 
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email Address</label>
                  <input type="email" name="email" defaultValue={user?.email || ''} required placeholder="john@example.com" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Message</label>
                  <textarea name="message" required placeholder="How can we help you?" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '140px', fontSize: '15px', resize: 'vertical', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }}></textarea>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #e63946 0%, #be123c 100%)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.1s, boxShadow 0.2s', boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(225, 29, 72, 0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(225, 29, 72, 0.3)'; }}
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
