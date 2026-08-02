'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BookSessionModal({ mentor, onClose }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    startup: '',
    message: '',
  });

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        // Redirect to login with return URL
        router.push(`/login?returnUrl=${encodeURIComponent('/mentors')}`);
        onClose();
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && json.data?.user) {
          setIsLoggedIn(true);
          setForm(prev => ({
            ...prev,
            name: json.data.user.fullName || json.data.user.full_name || '',
            email: json.data.user.email || '',
          }));
        } else {
          router.push(`/login?returnUrl=${encodeURIComponent('/mentors')}`);
          onClose();
          return;
        }
      } catch {
        router.push(`/login?returnUrl=${encodeURIComponent('/mentors')}`);
        onClose();
        return;
      }
      setChecking(false);
    }
    checkAuth();
  }, [router, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await apiFetch('/api/v1/public/inquiry', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.startup,
          program: `Mentor Session Booking - ${mentor?.full_name || mentor?.name || 'General'}`,
          message: form.message || `Booking request for a mentorship session with ${mentor?.full_name || mentor?.name || 'a mentor'}.`,
        }),
      });

      if (res.error) {
        setError(res.error.message || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  if (checking) return null;
  if (!isLoggedIn) return null;

  const mentorName = mentor?.full_name || mentor?.name || 'Mentor';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ─── THANK YOU SCREEN ─── */
            <motion.div
              key="thankyou"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ padding: '60px 40px', textAlign: 'center' }}
            >
              {/* Animated check circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)',
                }}
              >
                <motion.svg
                  width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              </motion.div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                Booking Confirmed!
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 12px', lineHeight: '1.6' }}>
                Your mentorship session request with <strong style={{ color: '#0f172a' }}>{mentorName}</strong> has been submitted successfully.
              </p>

              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '18px 20px',
                margin: '24px 0',
                textAlign: 'left',
              }}>
                <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  What happens next?
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#15803d', lineHeight: '1.6' }}>
                  Our team will review your request and connect with you within <strong>24 hours</strong> to confirm your session details.
                </p>
              </div>

              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>
                A confirmation email has been sent to <strong>{form.email}</strong>
              </p>

              <button
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#fff',
                  padding: '14px 36px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(220, 38, 38, 0.25)',
                  transition: 'all 0.2s',
                }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            /* ─── BOOKING FORM ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '32px 32px 28px',
                borderRadius: '24px 24px 0 0',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '100px',
                  padding: '5px 14px',
                  marginBottom: '14px',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Book a Session
                  </span>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 6px' }}>
                  Session with {mentorName}
                </h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Fill in your details and we'll connect you with the mentor
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {error && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}>
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    style={{
                      width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Email <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    style={{
                      width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Phone Number <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Startup Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Startup / Company Name
                  </label>
                  <input
                    type="text"
                    value={form.startup}
                    onChange={(e) => setForm(prev => ({ ...prev, startup: e.target.value }))}
                    placeholder="Your startup or company name"
                    style={{
                      width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    What do you need help with? <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your startup idea, stage, and what guidance you're looking for..."
                    style={{
                      width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', resize: 'vertical', transition: 'border-color 0.2s',
                      minHeight: '80px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: '#fff',
                    padding: '15px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: submitting ? 'none' : '0 8px 25px rgba(220, 38, 38, 0.25)',
                    transition: 'all 0.2s',
                    marginTop: '4px',
                  }}
                >
                  {submitting ? (
                    <>
                      <span>Submitting...</span>
                      <div style={{
                        width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff', borderRadius: '50%',
                        animation: 'bookSessionSpin 0.8s linear infinite',
                      }} />
                    </>
                  ) : (
                    <>
                      <span>Book Session</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: '0' }}>
                  Your details will be shared with the mentor for session scheduling
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bookSessionSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        ` }} />
      </motion.div>
    </div>
  );
}
