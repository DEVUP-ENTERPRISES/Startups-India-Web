'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signUp, initGoogleSignIn, resendVerificationEmail } from '@/lib/auth';
import '@/styles/auth-redesign.css';
import PhoneVerifyCard from '@/components/auth/PhoneVerifyCard';
import JoinAsSelect from '@/components/auth/JoinAsSelect';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, CheckCircle2, Users, Briefcase, Target, TrendingUp, Award, Zap, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SignupContent() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const [isSwitching, setIsSwitching] = useState(false);
  const handleNavigation = (e, path) => {
    e.preventDefault();
    setIsSwitching(true);
    router.push(path);
  };

  const googleBtnRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace(returnUrl);
    }
  }, [router, returnUrl]);

  // Google Sign-In
  useEffect(() => {
    if (googleBtnRef.current) {
      initGoogleSignIn(googleBtnRef.current, ({ data, error: err }) => {
        if (err) {
          setError(err.message);
          return;
        }
        if (data) {
          setSuccess(true);
          router.push(returnUrl);
        }
      });
    }
  }, [router, returnUrl]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true);
    setEmailValid(validateEmail(value));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!termsAccepted) {
      setError('Please accept the Terms and Privacy Policy');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Only enforce what the backend actually requires (min 8 characters). Read the
    // live password value directly — the earlier check used a strength object that
    // wasn't wired to the input, so it always failed no matter what was typed.
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signupError } = await signUp({
        email,
        password,
        fullName,
        phone,
      });

      if (signupError) {
        setError(signupError.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const { error } = await resendVerificationEmail(email);
      if (error) {
        setError(error.message);
      } else {
        setResendMessage('Verification email resent successfully!');
      }
    } catch (err) {
      setError('Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };



  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  const dashboardCards = [
    { icon: <Users size={20} />, label: "Live Seats", value: "2,051", trend: "↑ 24%", trendClass: "", hasLiveDot: true },
    { icon: <Briefcase size={20} />, label: "Avg Funding", value: "₹50L+", trend: "↑ 12%", trendClass: "" },
    { icon: <Target size={20} />, label: "Expert Mentors", value: "47+", trend: "↑ 18%", trendClass: "purple" },
    { icon: <TrendingUp size={20} />, label: "Growth", value: "Growth", isChart: true },
    { icon: <Award size={20} />, label: "Success Rate", value: "95%", isProgress: true },
    { icon: <Zap size={20} />, label: "Total Funding", value: "₹110Cr+", trend: "↑ 28%", trendClass: "red" },
  ];

  return (
    <div className={`auth-layout signup-mode ${isSwitching ? 'auth-switching' : ''}`}>
      {/* Left Panel - Auth Form */}
      <div className="auth-panel left-panel">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {/* Abstract Illustration Background */}
          <div className="auth-illustration">
            <svg className="rocket-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
            <div className="building-silhouette building-1"></div>
            <div className="building-silhouette building-2"></div>
            <div className="building-silhouette building-3"></div>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="success-view"
              >
                {/* The account exists and we already hold a session, so the phone
                    can be verified right here. Skipping is allowed — the dashboard
                    prompt will ask again rather than trapping anyone at signup. */}
                <div className="auth-header" style={{ textAlign: 'center' }}>
                  <div style={{ color: '#10b981', marginBottom: '16px' }}>
                    <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
                  </div>
                  <h2 className="auth-title">Welcome <span>Aboard</span></h2>
                  <p className="auth-subtitle">
                    One last step — verify your mobile number so you can secure your account.
                  </p>
                </div>

                <PhoneVerifyCard
                  initialPhone={phone}
                  onVerified={() => setTimeout(() => router.push(returnUrl), 1200)}
                  onSkip={() => router.push(returnUrl)}
                />
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="auth-header">
                  <div className="startup-badge">
                    Startup India Incubation
                  </div>
                  <h2 className="auth-title">Create Your <span>Account</span></h2>
                  <p className="auth-subtitle">
                    Join thousands of successful entrepreneurs and get access to exclusive mentorship and funding.
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', 
                      borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
                      marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon-left" size={18} />
                      <input 
                        type="text" 
                        className="auth-input"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon-left" size={18} />
                      <input
                        type="tel"
                        className="auth-input"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                      We&apos;ll verify this with a code so you can secure your account later.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon-left" size={18} />
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon-left" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="auth-input"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Friendly, live hint — the only rule is 8+ characters. Turns
                        green the moment it's met, so nobody's left guessing. */}
                    {password.length > 0 && (
                      <p style={{ marginTop: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', color: password.length >= 8 ? '#059669' : '#9ca3af' }}>
                        {password.length >= 8
                          ? <><CheckCircle2 size={14} /> Looks good</>
                          : `Use at least 8 characters (${password.length}/8)`}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon-left" size={18} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        className="auth-input"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group remember-me-group">
                    <input type="checkbox" id="termsAccepted" className="custom-checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                    <label htmlFor="termsAccepted">I agree to the Terms & Conditions</label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isLoading || !termsAccepted}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div className="divider-container">
                  <div className="divider-line"></div>
                  <span className="divider-text">OR CONTINUE WITH</span>
                  <div className="divider-line"></div>
                </div>

                <div ref={googleBtnRef} className="google-container"></div>

                <div className="signup-footer">
                  <p>Already have an account? <a href="/login" onClick={(e) => handleNavigation(e, '/login')} className="signup-action">Sign in</a></p>
                  {/* This form creates a founder account. Mentors apply through a
                      separate reviewed flow, so without this link they'd sign up
                      here and never actually become a mentor. */}
                  {/* Role picker — shared with the login page; add a role in
                      JoinAsSelect and it appears in both places. */}
                  <JoinAsSelect />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right Panel - Visuals */}
      <div className="dashboard-panel right-panel">
        <div className="bg-pattern"></div>
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            Smart Incubation Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="visual-subtext"
          >
            Track your startup growth, access expert mentors, and unlock funding opportunities.
          </motion.p>

          <div className="dashboard-grid">
            {dashboardCards.map((card, index) => (
              <div 
                key={index}
                className="metric-card"
                onMouseMove={handleMouseMove}
              >
                <div className="top-glow"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="icon-box">{card.icon}</div>
                  {card.hasLiveDot && <div className="live-dot"></div>}
                </div>
                <div className="metric-label">{card.label}</div>
                
                {card.isChart ? (
                  <div className="chart-container">
                    <div className="chart-bar" style={{ height: '30%' }}></div>
                    <div className="chart-bar" style={{ height: '50%' }}></div>
                    <div className="chart-bar" style={{ height: '40%' }}></div>
                    <div className="chart-bar" style={{ height: '70%' }}></div>
                    <div className="chart-bar" style={{ height: '90%' }}></div>
                  </div>
                ) : card.isProgress ? (
                  <div className="success-ring-container">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#10b981" strokeWidth="4" 
                        strokeDasharray="163.36" strokeDashoffset="8.16" strokeLinecap="round" transform="rotate(-90 30 30)" />
                    </svg>
                    <span className="success-ring-text">95%</span>
                  </div>
                ) : (
                  <>
                    <div className="metric-value">{card.value}</div>
                    <div className={`card-trend ${card.trendClass}`}>{card.trend}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bottom-info-badge"
          >
            <div className="badge-icon-red">
              <ShieldCheck size={24} />
            </div>
            <div className="badge-content">
              <h4>Secure. Trusted. Reliable.</h4>
              <p>Your data is protected with enterprise-grade security.</p>
            </div>
          </motion.div>
        </div>
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
