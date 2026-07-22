'use client';

/* ==========================================
   LOGIN PAGE - Client Component
   
   CSS imported here to ensure proper loading on client-side navigation
   ========================================== */

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  ShieldCheck,
  Briefcase,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { signIn, initGoogleSignIn } from '@/lib/auth';
import JoinAsSelect from '@/components/auth/JoinAsSelect';
import TwoFactorStep from '@/components/auth/TwoFactorStep';
import '@/styles/auth-redesign.css';

// Must match middleware.js / NEXT_PUBLIC_ADMIN_SLUG — the admin panel is only
// reachable through this slug.
const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Set when the password was correct but the account requires an SMS code.
  // Holds no session — only the short-lived token that unlocks the OTP step.
  const [twoFactor, setTwoFactor] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const googleBtnRef = useRef(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    setIsSwitching(true);
    router.push(path);
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace(returnUrl);
    }
  }, [router, returnUrl]);

  // Render Google Sign-In button
  useEffect(() => {
    if (googleBtnRef.current) {
      initGoogleSignIn(googleBtnRef.current, ({ data, error: err }) => {
        if (err) {
          setError(err.message);
          return;
        }
        if (data) {
          setSuccess(true);
          router.push(getRedirectByRole(data));
        }
      });
    }
  }, [router, returnUrl]);

  const getRedirectByRole = (userData) => {
    const role = userData?.user?.role || userData?.role;
    // The admin panel is served at /{ADMIN_SLUG}/*; middleware hard-404s any
    // literal /admin path, so redirecting there would bounce every admin login.
    if (role === 'admin') return `/${ADMIN_SLUG}/dashboard`;
    if (role === 'mentor') return '/dashboard/mentor';
    if (role === 'investor') return '/dashboard/investor';
    return returnUrl;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // 2FA account: no session was issued. Hand off to the OTP step instead of
      // redirecting — treating this as a success would send the user to a
      // dashboard they have no token for.
      if (data?.two_factor_required) {
        setTwoFactor({
          pendingToken: data.pending_token,
          phoneMasked: data.phone_masked,
          expiresIn: data.expires_in,
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        setSuccess(true);
        router.push(getRedirectByRole(data));
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
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
    <div className={`auth-layout ${isSwitching ? 'auth-switching' : ''}`}>
      {/* Left Panel - Visuals */}
      <div className="dashboard-panel left-panel">
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
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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
              </motion.div>
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

      {/* Right Panel - Auth */}
      <div className="auth-panel right-panel">
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
            <svg className="cloud-icon cloud-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-5h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            <svg className="cloud-icon cloud-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-5h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            <svg className="trajectory-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 Q40,60 100,0" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 4"/>
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {twoFactor && !success ? (
              <TwoFactorStep
                pendingToken={twoFactor.pendingToken}
                phoneMasked={twoFactor.phoneMasked}
                expiresIn={twoFactor.expiresIn}
                onSuccess={() => {
                  setSuccess(true);
                  router.push(returnUrl);
                }}
                onCancel={() => {
                  setTwoFactor(null);
                  setPassword('');
                  setError('');
                }}
              />
            ) : success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="success-view"
                style={{ textAlign: 'center', padding: '40px 0' }}
              >
                <div style={{ marginBottom: '24px', color: '#10b981' }}>
                  <CheckCircle2 size={80} style={{ margin: '0 auto' }} />
                </div>
                <h2 className="auth-title">Welcome <span>Back</span></h2>
                <p className="auth-subtitle">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="auth-header">
                  <div className="startup-badge">
                    Startup India Incubation
                  </div>
                  <h2 className="auth-title">Welcome <span>Back</span></h2>
                  <p className="auth-subtitle">
                    Sign in to continue your entrepreneurial journey and access your personalized dashboard.
                  </p>
                </div>

                {/* Sits above the sign-in form on purpose: new mentors/investors
                    were missing it entirely when it lived at the bottom of the
                    page. Add a role in JoinAsSelect and it appears here and on
                    signup automatically. */}
                <div style={{ marginBottom: '22px' }}>
                  <JoinAsSelect />
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
                      gap: '8px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon-left" size={18} />
                      <input 
                        type="email" 
                        className={`auth-input ${email && 'success'}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                      <Link href="/forgot-password" size={12} className="forgot-link">Forgot Password?</Link>
                    </div>
                    <div className="input-wrapper">
                      <Lock className="input-icon-left" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="auth-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group remember-me-group">
                    <input type="checkbox" id="rememberMe" className="custom-checkbox" />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
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
                  <p>Don't have an account? <a href="/signup" onClick={(e) => handleNavigation(e, '/signup')} className="signup-action">Sign up</a></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bottom-features"
        >
          <div className="feature-box">
            <div className="feature-icon-red"><ShieldCheck size={20} /></div>
            <div className="feature-txt">
              <h6>Data Security</h6>
              <p>Enterprise-grade protection</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon-red"><Users size={20} /></div>
            <div className="feature-txt">
              <h6>Expert Mentors</h6>
              <p>Connect with industry leaders</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon-red"><Zap size={20} /></div>
            <div className="feature-txt">
              <h6>Growth Focused</h6>
              <p>Resources to scale faster</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
