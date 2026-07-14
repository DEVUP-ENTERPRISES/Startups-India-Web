'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import { requestPasswordReset } from '@/lib/auth';
import '@/styles/auth-redesign.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: err } = await requestPasswordReset(email.trim());

    // Only genuine failures (network down, rate limited) surface here. The API
    // returns the same success for registered and unregistered addresses alike,
    // so this screen must never hint at which one it was.
    if (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      return;
    }

    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="auth-layout" style={{ gridTemplateColumns: '1fr' }}>
      <div className="auth-panel">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Startups India"
              width={170}
              height={48}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ textAlign: 'center', padding: '16px 0' }}
              >
                <div style={{ marginBottom: '24px', color: '#10b981' }}>
                  <MailCheck size={72} style={{ margin: '0 auto' }} />
                </div>
                <h2 className="auth-title">
                  Check your <span>inbox</span>
                </h2>
                <p className="auth-subtitle" style={{ marginTop: '12px' }}>
                  If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a link to
                  reset your password. The link expires in 30 minutes and can only be used once.
                </p>

                <p
                  style={{
                    marginTop: '24px',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: 1.6,
                  }}
                >
                  Didn&apos;t get it? Check your spam folder, or{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#ef4444',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    try another email address
                  </button>
                  .
                </p>

                <div className="signup-footer" style={{ marginTop: '32px' }}>
                  <Link
                    href="/login"
                    className="signup-action"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ArrowLeft size={16} /> Back to sign in
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="auth-header">
                  <div className="startup-badge">Account Recovery</div>
                  <h2 className="auth-title">
                    Forgot your <span>password?</span>
                  </h2>
                  <p className="auth-subtitle">
                    Enter the email address you signed up with and we&apos;ll send you a secure link
                    to set a new password.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      borderRadius: '12px',
                      color: '#ef4444',
                      fontSize: '13px',
                      fontWeight: 500,
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShieldCheck size={16} />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address
                    </label>
                    <div className="input-wrapper">
                      <Mail className="input-icon-left" size={18} />
                      <input
                        id="email"
                        type="email"
                        className="auth-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" disabled={isLoading || !email.trim()}>
                    {isLoading ? 'Sending link...' : 'Send Reset Link'}
                    {!isLoading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div className="signup-footer" style={{ marginTop: '28px' }}>
                  <p>
                    Remembered it?{' '}
                    <Link href="/login" className="signup-action">
                      Back to sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
