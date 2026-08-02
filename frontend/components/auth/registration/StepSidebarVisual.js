'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ClipboardList, Smartphone, GraduationCap, CheckCircle2, 
  Mail, Lock, Phone, Target, TrendingUp, Send, Check, ShieldCheck 
} from 'lucide-react';

export default function StepSidebarVisual({ currentStep }) {
  const getStepContent = (step) => {
    switch (step) {
      case 1:
        return {
          title: (
            <>
              Your Startup <br />
              <span style={{ color: '#dc2626' }}>Journey Starts Here!</span>
            </>
          ),
          subtitle: 'Join thousands of innovators, builders and changemakers who are building the future.',
          illustration: (
            <div className="reg-v2-3d-visual-container">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-right"
              >
                <Target size={20} color="#dc2626" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge bottom-right"
              >
                <TrendingUp size={20} color="#dc2626" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-main-3d-rocket"
              >
                <Rocket size={72} color="#dc2626" strokeWidth={1.5} />
              </motion.div>
              <div className="reg-v2-cloud-base"></div>
            </div>
          ),
        };

      case 2:
        return {
          title: (
            <>
              Your Startup <br />
              <span style={{ color: '#dc2626' }}>Journey Begins!</span>
            </>
          ),
          subtitle: 'Fill in your basic details to create your account and get started.',
          illustration: (
            <div className="reg-v2-3d-visual-container">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-left"
              >
                <Mail size={18} color="#dc2626" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-right"
              >
                <Lock size={18} color="#dc2626" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge bottom-left"
              >
                <Phone size={18} color="#dc2626" />
              </motion.div>

              {/* 3D Clipboard Graphic */}
              <div className="reg-v2-clipboard-card">
                <div className="reg-v2-clipboard-clip"></div>
                <div className="reg-v2-clipboard-avatar">👤</div>
                <div className="reg-v2-clipboard-lines">
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                </div>
                <div className="reg-v2-pen-3d">✏️</div>
              </div>
            </div>
          ),
        };

      case 3:
        return {
          title: (
            <>
              One Step Closer <br />
              to <span style={{ color: '#dc2626' }}>Your Journey!</span>
            </>
          ),
          subtitle: "We've sent a verification code to your email/phone number.",
          illustration: (
            <div className="reg-v2-3d-visual-container">
              <motion.div 
                animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-right"
              >
                <Send size={18} color="#dc2626" />
              </motion.div>

              {/* 3D Phone with Envelope Graphic */}
              <div className="reg-v2-phone-3d">
                <div className="reg-v2-phone-screen">
                  <div className="reg-v2-envelope-3d">
                    <div className="reg-v2-envelope-header">✉️</div>
                    <div className="reg-v2-otp-dots">***</div>
                  </div>
                </div>
                <div className="reg-v2-phone-check-badge">
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          ),
        };

      case 4:
        return {
          title: (
            <>
              You&apos;re Almost <br />
              <span style={{ color: '#dc2626' }}>There!</span>
            </>
          ),
          subtitle: 'Tell us a bit more about yourself so we can personalize your experience.',
          illustration: (
            <div className="reg-v2-3d-visual-container">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-right"
              >
                🎓
              </motion.div>

              <div className="reg-v2-clipboard-card">
                <div className="reg-v2-clipboard-clip"></div>
                <div className="reg-v2-clipboard-avatar">🎓</div>
                <div className="reg-v2-clipboard-lines">
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                </div>
                <div className="reg-v2-cap-books-3d">📚</div>
              </div>
            </div>
          ),
        };

      case 5:
      case 6:
      default:
        return {
          title: (
            <>
              You&apos;re Ready <br />
              to <span style={{ color: '#dc2626' }}>Get Started! 🚀</span>
            </>
          ),
          subtitle: 'Review your details and complete your registration.',
          illustration: (
            <div className="reg-v2-3d-visual-container">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="reg-v2-floating-badge top-right"
                style={{ top: '10px', right: '10px', background: '#fff5f5', border: '1px solid #fecaca' }}
              >
                <Rocket size={22} color="#dc2626" />
              </motion.div>

              <div className="reg-v2-clipboard-card" style={{ boxShadow: '0 12px 36px rgba(220, 38, 38, 0.12)' }}>
                <div className="reg-v2-clipboard-clip"></div>
                <div 
                  className="reg-v2-clipboard-check-large" 
                  style={{ 
                    marginTop: '16px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}
                >
                  <CheckCircle2 size={48} color="#dc2626" strokeWidth={2} />
                </div>
                <div className="reg-v2-clipboard-lines" style={{ marginTop: '24px' }}>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                  <div className="reg-v2-line red"><Check size={12} strokeWidth={3} color="#dc2626" /></div>
                </div>
              </div>
            </div>
          ),
        };
    }
  };

  const content = getStepContent(currentStep);

  return (
    <aside className="reg-v2-sidebar">
      {/* Top Header Logo */}
      <div className="reg-v2-sidebar-header">
        <div className="reg-v2-logo">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/assets/images/logo.png"
              alt="Startups India"
              width={160}
              height={44}
              priority
              style={{ width: 'auto', height: '36px', objectFit: 'contain' }}
            />
          </Link>
        </div>
      </div>

      {/* Step Dynamic Illustration & Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="reg-v2-sidebar-hero"
        >
          {content.illustration}

          <h1 className="reg-v2-sidebar-title">{content.title}</h1>
          <p className="reg-v2-sidebar-subtext">{content.subtitle}</p>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
