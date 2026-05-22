'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function CTAStripSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        if (window.location.hash === '#apply-form') {
          setShowForm(true);
        }
      }
    }
    checkAuth();
  }, []);

  const handleApplyClick = () => {
    if (!user) {
      router.push('/login?returnUrl=' + encodeURIComponent(pathname + '#apply-form'));
    } else {
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = encodeURIComponent('Program Application from ' + formData.get('name'));
    const body = encodeURIComponent(`Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nPhone: ${formData.get('phone')}\nStartup/Idea Name: ${formData.get('startup')}\n\nMotivation:\n${formData.get('motivation')}`);
    window.location.href = `mailto:admin@stratupsindia.in?subject=${subject}&body=${body}`;
    setShowForm(false);
  };

  return (
    <>
      <section className="cta-strip-section">
        <div className="cta-strip-container">
          <motion.div
            className="cta-strip-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-strip-left">
              <div className="cta-strip-badge">LIMITED SEATS</div>
              <h3 className="cta-strip-title">
                Ready to Turn Your Idea Into Reality?
              </h3>
              <p className="cta-strip-text">
                Join 1,000+ student founders who transformed their startups with our proven framework. Applications close soon.
              </p>
            </div>

            <div className="cta-strip-right">
              <div className="cta-strip-stats">
                <div className="stat-item">
                  <div className="stat-number">7 Days</div>
                  <div className="stat-label">Left to Apply</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">50</div>
                  <div className="stat-label">Seats Available</div>
                </div>
              </div>
              
              <div className="cta-strip-actions">
                <button className="cta-strip-primary" onClick={handleApplyClick}>
                  <span>Apply Now</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button className="cta-strip-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>Download Brochure</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Modal Form */}
      <AnimatePresence>
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', maxWidth: '560px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>Program Application</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>Take the first step towards turning your idea into reality.</p>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Full Name</label>
                  <input type="text" name="name" required placeholder="John Doe" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }} 
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email Address</label>
                    <input type="email" name="email" defaultValue={user?.email || ''} required placeholder="john@example.com" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+91 98765 43210" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Startup / Idea Name</label>
                  <input type="text" name="startup" required placeholder="Project Phoenix" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Why do you want to join this program?</label>
                  <textarea name="motivation" required placeholder="Tell us about your goals and what you hope to achieve..." style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '120px', fontSize: '15px', resize: 'vertical', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 57, 70, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }}></textarea>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #e63946 0%, #be123c 100%)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.1s, boxShadow 0.2s', boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(225, 29, 72, 0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(225, 29, 72, 0.3)'; }}
                  >
                    Submit Application
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
