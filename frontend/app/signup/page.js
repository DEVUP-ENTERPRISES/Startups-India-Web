'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { initGoogleSignIn, getPostAuthRedirect, isLoggedIn, setLoggedInFlag } from '@/lib/auth';
import { setMemToken } from '@/lib/api';
import '@/styles/auth-redesign.css';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/onboarding';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const googleBtnRef = useRef(null);

  // Redirect if already logged in - run once on mount only
  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render Google Sign-In button
  useEffect(() => {
    if (googleBtnRef.current) {
      initGoogleSignIn(googleBtnRef.current, ({ data, error: err }) => {
        if (err) { setError(err.message); return; }
        if (data) {
          setSuccess(true);
          // New accounts have onboarding_completed=false → /onboarding.
          // Returning Google users who already onboarded → role-specific dashboard.
          router.push(getPostAuthRedirect(data));
        }
      });
    }
  }, [router]);

  // Real-time email uniqueness check
  useEffect(() => {
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValid) { setIsEmailTaken(false); return; }
    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/v1/auth/check-exists?email=${encodeURIComponent(email)}`);
        const json = await res.json();
        setIsEmailTaken(json.success && json.data?.emailExists);
      } catch {
        setIsEmailTaken(false);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [email]);

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const passwordLengthOk = password.length >= 8;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const canSubmit =
    fullName.trim().length >= 2 &&
    isEmailValid &&
    !isEmailTaken &&
    passwordLengthOk &&
    passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      if (data.data?.user?.id) {
        setLoggedInFlag(data.data.user.id);
        if (data.data?.session?.access_token) {
          setMemToken(data.data.session.access_token);
        }
        window.dispatchEvent(new CustomEvent('user:login'));
      }

      setSuccess(true);
      router.push('/onboarding');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="dashboard-panel left-panel">
        <div className="bg-pattern"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="visual-logo"
        >
          <Link href="/">
            <Image
              src="/assets/images/Startupsina logo wight.png"
              alt="Startup India"
              width={180}
              height={50}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </motion.div>

        <div className="visual-content">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="visual-title"
          >
            Join the Startup India Ecosystem
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="visual-subtext"
          >
            Create your account in seconds. Tell us who you are after - your journey starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}
          >
            {[
              { icon: '🚀', title: 'Startups & Founders', desc: 'Apply for seed funding, incubation & mentorship' },
              { icon: '🎓', title: 'Mentors', desc: 'Guide early-stage ventures with your expertise' },
              { icon: '💰', title: 'Investors', desc: 'Discover and back high-growth startups' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  background: 'rgba(255,255,255,0.06)', borderRadius: '12px',
                  padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bottom-info-badge"
          >
            <div className="badge-icon-red"><ShieldCheck size={24} /></div>
            <div className="badge-content">
              <h4>Secure & Trusted</h4>
              <p>Your data is protected with enterprise-grade security.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel right-panel">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <CheckCircle2 size={72} color="#10b981" style={{ margin: '0 auto 20px' }} />
              <h2 className="auth-title">Account <span>Created!</span></h2>
              <p className="auth-subtitle">Taking you to set up your profile...</p>
            </motion.div>
          ) : (
            <>
              <div className="auth-header">
                <div className="startup-badge">Startup India Incubation</div>
                <h2 className="auth-title">Create your <span>Account</span></h2>
                <p className="auth-subtitle">
                  Just the basics to get started. You&apos;ll set up your role and profile next.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2',
                    borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
                    marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <ShieldAlert size={16} /> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon-left" size={18} />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setError(''); }}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon-left" size={18} />
                    <input
                      type="email"
                      className={`auth-input ${isEmailTaken ? 'error' : isEmailValid && !isCheckingEmail ? 'success' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); setIsEmailTaken(false); }}
                      required
                    />
                  </div>
                  {email && (
                    <p style={{
                      fontSize: '12px', marginTop: '4px',
                      color: isEmailTaken ? '#dc2626' : isEmailValid ? '#059669' : '#94a3b8',
                      fontWeight: 500
                    }}>
                      {isCheckingEmail ? 'Checking...' :
                        isEmailTaken ? '✕ This email is already registered' :
                        isEmailValid ? '✓ Valid email address' :
                        '✕ Enter a valid email'}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon-left" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      required
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: passwordLengthOk ? '#059669' : '#94a3b8', fontWeight: 500 }}>
                      {passwordLengthOk ? '✓ Good password' : `✕ At least 8 characters (${password.length}/8)`}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon-left" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      required
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: passwordsMatch ? '#059669' : '#ef4444', fontWeight: 500 }}>
                      {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading || !canSubmit}
                  style={{ marginTop: '4px' }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

              {/* Divider */}
              <div className="divider-container" style={{ margin: '20px 0' }}>
                <div className="divider-line"></div>
                <span className="divider-text">OR CONTINUE WITH</span>
                <div className="divider-line"></div>
              </div>

              {/* Google Sign-In Button */}
              <div ref={googleBtnRef} className="google-container"></div>

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '20px' }}>
                By creating an account, you agree to our{' '}
                <Link href="/terms" style={{ color: '#dc2626', fontWeight: 600 }}>Terms</Link>
                {' & '}
                <Link href="/privacy" style={{ color: '#dc2626', fontWeight: 600 }}>Privacy Policy</Link>
              </p>

              <div className="signup-footer" style={{ marginTop: '12px' }}>
                <p>Already have an account? <Link href="/login" className="signup-action">Sign in</Link></p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
