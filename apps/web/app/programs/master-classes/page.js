'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import '../../../styles/master-class-coming-soon.css';

export default function MasterClassesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/public/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Waitlist User',
          email,
          phone: 'N/A',
          company: 'N/A',
          program: 'Master Class Waitlist',
          message: 'Early access request for Master Classes'
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Waitlist error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="master-coming-soon">
      {/* Cinematic Background */}
      <div className="m-cs-bg">
        <div className="m-cs-glow"></div>
        <div className="m-cs-grid"></div>
      </div>

      <div className="m-cs-container">
        {/* Top Badge */}
        <motion.div 
          className="m-cs-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge-dot"></div>
          <span className="badge-text">ENROLLMENT OPENING SOON</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          className="m-cs-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Mastering <span>The Future</span>
        </motion.h1>

        <motion.p 
          className="m-cs-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          An elite learning experience designed for the next generation of visionary founders. 
          Get ready for deep-dives into scaling, capital, and global expansion.
        </motion.p>

        {/* Waitlist Card */}
        <motion.div 
          className="m-cs-form-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                className="cs-success-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="success-icon-bg" style={{ width: '60px', height: '60px', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="m-cs-form-title">You're on the list!</h3>
                <p className="m-cs-form-subtitle">We'll notify you the moment the first cohort opens.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="m-cs-form-title">Join the Exclusive Waitlist</h3>
                <p className="m-cs-form-subtitle">Be the first to secure your spot in the inaugural Master Class.</p>
                
                <form className="m-cs-form" onSubmit={handleSubmit}>
                  <input 
                    type="email" 
                    className="m-cs-input" 
                    placeholder="Enter your professional email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="m-cs-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'JOINING...' : (
                      <>
                        GET EARLY ACCESS <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Stats / Trust */}
        <motion.div 
          className="m-cs-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="m-cs-stat">
            <span className="stat-val">50+</span>
            <span className="stat-lab">EXPERT MENTORS</span>
          </div>
          <div className="m-cs-stat">
            <span className="stat-val">24/7</span>
            <span className="stat-lab">LIFETIME ACCESS</span>
          </div>
          <div className="m-cs-stat">
            <span className="stat-val">1:1</span>
            <span className="stat-lab">STRATEGIC SESSIONS</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
