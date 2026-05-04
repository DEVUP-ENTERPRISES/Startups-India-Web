'use client';

/* ==========================================
   LOGIN PAGE - Client Component
   
   CSS imported here to ensure proper loading on client-side navigation
   ========================================== */

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, initGoogleSignIn } from '@/lib/auth';
import '@/styles/signup.css';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const [currentSlide, setCurrentSlide] = useState(0);
  const googleBtnRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace(returnUrl);
    }
  }, [router, returnUrl]);

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update carousel slides and indicators
  useEffect(() => {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }, [currentSlide]);

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
          setTimeout(() => router.push(returnUrl), 1500);
        }
      });
    }
  }, [router, returnUrl]);

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

      if (data) {
        setSuccess(true);

        // Activity logging is handled by dashboard layout on SIGNED_IN event
        // No need to log here to avoid duplicates

        setTimeout(() => {
          router.push(returnUrl);
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side - Premium Graphics */}
        <div className="signup-content">
          {/* Animated Background Grid */}
          <div className="auth-grid-bg"></div>

          {/* Floating 3D Shapes */}
          <div className="floating-shapes">
            <div className="shape-3d shape-cube"></div>
            <div className="shape-3d shape-sphere"></div>
            <div className="shape-3d shape-pyramid"></div>
          </div>

          {/* Logo */}
          <Link href="/" className="auth-logo">
            <Image
              src="/assets/images/Startupsina logo wight.png"
              alt="Startup India Incubation"
              width={220}
              height={65}
              priority
              className="auth-logo-image"
            />
          </Link>

          {/* Floating Graphic Cards */}
          <div className="auth-graphics-container">
            {/* Stats Card - Animated */}
            <div className="auth-card stats-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <span className="card-label">Live Seats</span>
                <div className="pulse-indicator"></div>
              </div>
              <div className="card-value">2,051</div>
              <div className="card-trend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 10L6 6L9 9L14 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>↑ 24%</span>
              </div>
            </div>

            {/* Success Badge Card */}
            <div className="auth-card success-card">
              <div className="card-glow"></div>
              <div className="success-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 2L24 14L36 16L27 25L29 38L20 32L11 38L13 25L4 16L16 14L20 2Z"
                    fill="url(#starGradient)"
                  />
                  <defs>
                    <linearGradient id="starGradient" x1="4" y1="2" x2="36" y2="38">
                      <stop stopColor="#FFD700" />
                      <stop offset="1" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="success-info">
                <div className="success-number">₹50L+</div>
                <div className="success-label">Avg Funding</div>
              </div>
            </div>

            {/* Mentor Avatars Card */}
            <div className="auth-card mentors-card">
              <div className="card-glow"></div>
              <div className="mentor-avatars-group">
                <div className="mentor-avatar">👨‍💼</div>
                <div className="mentor-avatar">👩‍💼</div>
                <div className="mentor-avatar">👨‍🎓</div>
                <div className="mentor-avatar-more">+47</div>
              </div>
              <div className="mentor-label">Expert Mentors</div>
            </div>

            {/* Growth Chart Card */}
            <div className="auth-card chart-card">
              <div className="card-glow"></div>
              <div className="chart-header">
                <span className="chart-label">Growth</span>
                <span className="chart-period">2025</span>
              </div>
              <div className="mini-chart">
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '95%' }}></div>
              </div>
            </div>

            {/* Success Rate Card */}
            <div className="auth-card success-rate-card">
              <div className="card-glow"></div>
              <div className="success-rate-circle">
                <svg className="progress-ring" width="64" height="64">
                  <circle
                    className="progress-ring-circle"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="5"
                    fill="transparent"
                    r="27"
                    cx="32"
                    cy="32"
                  />
                  <circle
                    className="progress-ring-circle-animated"
                    stroke="url(#successGradient2)"
                    strokeWidth="5"
                    fill="transparent"
                    r="27"
                    cx="32"
                    cy="32"
                    strokeDasharray="169.646"
                    strokeDashoffset="16.965"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="successGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="success-rate-text">
                  <div className="success-rate-number">95%</div>
                </div>
              </div>
              <div className="success-rate-label">Success Rate</div>
            </div>

            {/* Funding Secured Card */}
            <div className="auth-card funding-card">
              <div className="card-glow"></div>
              <div className="funding-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4L18 12L26 14L20 20L22 28L16 24L10 28L12 20L6 14L14 12L16 4Z"
                    fill="url(#fundingGradient)"
                  />
                  <circle cx="16" cy="16" r="3" fill="#fff" />
                  <defs>
                    <linearGradient id="fundingGradient" x1="6" y1="4" x2="26" y2="28">
                      <stop offset="0%" stopColor="#e63946" />
                      <stop offset="100%" stopColor="#ff6b9d" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="funding-amount">₹110Cr+</div>
              <div className="funding-label">Total Funding</div>
            </div>
          </div>

          {/* Text Carousel Section */}
          <div className="auth-carousel">
            <div className="carousel-content">
              <div className="carousel-slide active">
                <h3 className="carousel-title">Easy to Use Dashboard</h3>
                <p className="carousel-description">
                  Access your personalized dashboard with real-time analytics, course progress, and
                  mentorship tracking all in one place.
                </p>
              </div>
              <div className="carousel-slide">
                <h3 className="carousel-title">Learn from Industry Experts</h3>
                <p className="carousel-description">
                  Get access to premium courses, workshops, and masterclasses taught by successful
                  entrepreneurs and industry leaders.
                </p>
              </div>
              <div className="carousel-slide">
                <h3 className="carousel-title">Secure Funding Opportunities</h3>
                <p className="carousel-description">
                  Connect with investors, apply for grants, and access funding programs worth ₹50L+
                  to scale your startup.
                </p>
              </div>
              <div className="carousel-slide">
                <h3 className="carousel-title">Network & Collaborate</h3>
                <p className="carousel-description">
                  Join a vibrant community of 5,000+ entrepreneurs, find co-founders, and build
                  valuable partnerships.
                </p>
              </div>
            </div>
            <div className="carousel-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="signup-form-container">
          <div className="form-card">
            {success ? (
              <div className="success-message">
                <div className="success-icon">🎉</div>
                <h2 className="success-title">Welcome Aboard!</h2>
                <p className="success-subtitle">
                  You've successfully signed in. Redirecting to your dashboard...
                </p>
                <div className="success-loader">
                  <div className="loader-bar"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <div className="header-badge">
                    <span>Startup India Incubation</span>
                  </div>
                  <h2 className="form-title">Welcome Back</h2>
                  <p className="form-subtitle">
                    Sign in to continue your entrepreneurial journey and access your personalized
                    dashboard with exclusive resources, mentorship sessions, and funding
                    opportunities.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="footer-link"
                        style={{ fontSize: '12px' }}
                      >
                        Forgot?
                      </Link>
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button type="submit" className="signup-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <svg
                          className="spinner"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="form-divider">
                  <span>or continue with</span>
                </div>

                <div className="social-buttons social-buttons-single">
                  <div
                    ref={googleBtnRef}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  ></div>
                </div>

                <div className="form-footer">
                  <p className="footer-text">
                    Don't have an account?{' '}
                    <Link href="/signup" className="footer-link">
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
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
