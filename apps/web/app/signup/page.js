'use client';

/* ==========================================
   SIGNUP PAGE - Client Component
   
   CSS imported here to ensure proper loading on client-side navigation
   ========================================== */

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signUp, initGoogleSignIn, resendVerificationEmail } from '@/lib/auth';
import '@/styles/signup.css';

function SignupContent() {
  const [fullName, setFullName] = useState('');
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
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

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

  // Check password strength in real-time
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // Check if all password requirements are met
  const isPasswordStrong =
    passwordStrength.hasMinLength &&
    passwordStrength.hasUpperCase &&
    passwordStrength.hasLowerCase &&
    passwordStrength.hasNumber &&
    passwordStrength.hasSpecialChar;

  // Validate email in real-time
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!emailValid) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (
      !passwordStrength.hasUpperCase ||
      !passwordStrength.hasLowerCase ||
      !passwordStrength.hasNumber ||
      !passwordStrength.hasSpecialChar
    ) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting signup...', { email, fullName });
      const { data, error } = await signUp(email, password, fullName);

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('Signup successful, showing success state');
        setSuccess(true);
        setIsLoading(false);
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => router.push(returnUrl), 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage('');

    try {
      const { error } = await resendVerificationEmail(email);

      if (error) {
        console.error('Resend error:', error);
        setResendMessage('Failed to resend email. Please try again.');
      } else {
        setResendMessage('✓ Verification email sent! Check your inbox.');
      }
    } catch (err) {
      console.error('Unexpected resend error:', err);
      setResendMessage('An error occurred. Please try again.');
    } finally {
      setResendLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setResendMessage(''), 5000);
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

        {/* Right Side - Form or Success */}
        <div className="signup-form-container">
          <div className="form-card">
            {!success ? (
              <>
                <div className="form-header">
                  <div className="header-badge">
                    <span>Startup India Incubation</span>
                  </div>
                  <h2 className="form-title">Create Your Account</h2>
                  <p className="form-subtitle">
                    Join thousands of successful entrepreneurs and get access to exclusive
                    mentorship, funding opportunities, and a vibrant community of innovators.
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
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className="form-input"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        disabled={isLoading}
                        aria-label="Full Name"
                        aria-required="true"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <div
                        className={`email-input-wrapper ${emailTouched && emailValid ? 'email-valid' : ''} ${emailTouched && !emailValid && email ? 'email-invalid' : ''}`}
                      >
                        <input
                          id="email"
                          type="email"
                          className="form-input"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onBlur={() => setEmailTouched(true)}
                          placeholder="you@example.com"
                          required
                          disabled={isLoading}
                          aria-label="Email Address"
                          aria-invalid={emailTouched && !emailValid}
                          aria-describedby={emailTouched && !emailValid ? 'email-error' : undefined}
                        />
                        {emailTouched && emailValid && (
                          <span className="input-icon-success" aria-label="Valid email">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                        {emailTouched && !emailValid && email && (
                          <span className="input-icon-error" aria-label="Invalid email">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {emailTouched && !emailValid && email && (
                        <div className="field-error" id="email-error" role="alert">
                          Please enter a valid email address
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div
                        className={`password-input-wrapper ${isPasswordStrong ? 'password-strong' : ''}`}
                      >
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="form-input password-input"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          placeholder="Strong password"
                          required
                          disabled={isLoading}
                        />
                        {isPasswordStrong && <span className="input-legend">Strong Password</span>}
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex="-1"
                        >
                          {showPassword ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator - Only show when focused and not all requirements met */}
                      {password && passwordFocused && !isPasswordStrong && (
                        <div className="password-strength">
                          <div className="strength-requirements">
                            <div
                              className={`requirement ${passwordStrength.hasMinLength ? 'met' : ''}`}
                            >
                              <span className="requirement-icon">
                                {passwordStrength.hasMinLength ? '✓' : '○'}
                              </span>
                              <span className="requirement-text">At least 8 characters</span>
                            </div>
                            <div
                              className={`requirement ${passwordStrength.hasUpperCase ? 'met' : ''}`}
                            >
                              <span className="requirement-icon">
                                {passwordStrength.hasUpperCase ? '✓' : '○'}
                              </span>
                              <span className="requirement-text">One uppercase letter</span>
                            </div>
                            <div
                              className={`requirement ${passwordStrength.hasLowerCase ? 'met' : ''}`}
                            >
                              <span className="requirement-icon">
                                {passwordStrength.hasLowerCase ? '✓' : '○'}
                              </span>
                              <span className="requirement-text">One lowercase letter</span>
                            </div>
                            <div
                              className={`requirement ${passwordStrength.hasNumber ? 'met' : ''}`}
                            >
                              <span className="requirement-icon">
                                {passwordStrength.hasNumber ? '✓' : '○'}
                              </span>
                              <span className="requirement-text">One number</span>
                            </div>
                            <div
                              className={`requirement ${passwordStrength.hasSpecialChar ? 'met' : ''}`}
                            >
                              <span className="requirement-icon">
                                {passwordStrength.hasSpecialChar ? '✓' : '○'}
                              </span>
                              <span className="requirement-text">
                                One special character (!@#$%^&*)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <div
                        className={`password-input-wrapper ${confirmPassword && password !== confirmPassword ? 'password-mismatch' : ''} ${confirmPassword && password === confirmPassword && password ? 'password-match' : ''}`}
                      >
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-input password-input"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          required
                          disabled={isLoading}
                        />
                        {confirmPassword && password !== confirmPassword && (
                          <span className="input-legend-error">Passwords Don't Match</span>
                        )}
                        {confirmPassword && password === confirmPassword && password && (
                          <span className="input-legend">Passwords Match</span>
                        )}
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex="-1"
                        >
                          {showConfirmPassword ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Privacy Checkbox */}
                  <div className="terms-container">
                    <label className="terms-checkbox-label">
                      <input
                        type="checkbox"
                        className="terms-checkbox"
                        checked={termsAccepted}
                        onChange={e => setTermsAccepted(e.target.checked)}
                        disabled={isLoading}
                        aria-label="Accept terms and conditions"
                        required
                      />
                      <span className="checkbox-custom" aria-hidden="true"></span>
                      <span className="terms-text">
                        I agree to the{' '}
                        <Link
                          href="/terms"
                          className="terms-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms & Conditions
                        </Link>{' '}
                        and{' '}
                        <Link
                          href="/privacy"
                          className="terms-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`signup-btn ${isLoading ? 'btn-loading' : ''}`}
                    disabled={isLoading || !termsAccepted}
                    aria-busy={isLoading}
                    aria-label={isLoading ? 'Creating account, please wait' : 'Create account'}
                  >
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
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
                    Already have an account?{' '}
                    <Link href="/login" className="footer-link">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              /* Success State - Account Created */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 480,
                  padding: '48px 32px',
                  textAlign: 'center',
                }}
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  @keyframes successPulse {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  @keyframes checkDraw {
                    0% { stroke-dashoffset: 60; }
                    100% { stroke-dashoffset: 0; }
                  }
                  @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                  }
                  @keyframes confettiDot {
                    0% { opacity: 0; transform: translateY(0) scale(0); }
                    50% { opacity: 1; transform: translateY(-20px) scale(1); }
                    100% { opacity: 0; transform: translateY(-40px) scale(0); }
                  }
                `,
                  }}
                />

                {/* Confetti dots */}
                <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 28 }}>
                  {[
                    { left: -8, top: 10, bg: '#C5975B', delay: '0s', size: 8 },
                    { left: 110, top: 20, bg: '#7A1F2B', delay: '0.2s', size: 6 },
                    { left: 20, top: -5, bg: '#22c55e', delay: '0.4s', size: 7 },
                    { left: 95, top: 95, bg: '#C5975B', delay: '0.6s', size: 5 },
                    { left: -5, top: 85, bg: '#7A1F2B', delay: '0.3s', size: 6 },
                    { left: 55, top: -10, bg: '#f59e0b', delay: '0.5s', size: 5 },
                  ].map((dot, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: dot.left,
                        top: dot.top,
                        width: dot.size,
                        height: dot.size,
                        borderRadius: '50%',
                        background: dot.bg,
                        animation: `confettiDot 1.5s ease-out ${dot.delay} infinite`,
                      }}
                    />
                  ))}

                  {/* Success circle */}
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '10px auto',
                      animation: 'successPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                      boxShadow: '0 8px 32px rgba(34,197,94,0.2)',
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M12 24L20 32L36 16"
                        stroke="#16a34a"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: 60,
                          strokeDashoffset: 60,
                          animation: 'checkDraw 0.5s ease-out 0.4s forwards',
                        }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Welcome text */}
                <div style={{ animation: 'fadeUp 0.5s ease-out 0.6s both' }}>
                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: '#111',
                      margin: '0 0 8px',
                      fontFamily: "'Inter',system-ui,sans-serif",
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Welcome Aboard!
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: '#6b7280',
                      margin: '0 0 32px',
                      lineHeight: 1.6,
                      maxWidth: 340,
                    }}
                  >
                    Your account has been created successfully. Get ready to start your
                    entrepreneurial journey.
                  </p>
                </div>

                {/* User card */}
                <div
                  style={{
                    animation: 'fadeUp 0.5s ease-out 0.8s both',
                    background: 'linear-gradient(135deg, #faf8f5, #fff)',
                    border: '1px solid #f0e8e0',
                    borderRadius: 14,
                    padding: '20px 28px',
                    width: '100%',
                    maxWidth: 360,
                    marginBottom: 28,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7A1F2B, #9B3040)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {fullName || 'User'}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#9ca3af',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {email}
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: 'auto',
                        background: '#ecfdf5',
                        color: '#16a34a',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      VERIFIED
                    </div>
                  </div>
                </div>

                {/* What you get */}
                <div
                  style={{
                    animation: 'fadeUp 0.5s ease-out 1s both',
                    width: '100%',
                    maxWidth: 360,
                    marginBottom: 32,
                  }}
                >
                  {[
                    {
                      icon: 'M4 19.5A2.5 2.5 0 016.5 17H20v-2H6.5A2.5 2.5 0 014 17.5v-15A2.5 2.5 0 016.5 0H20v20H6.5A2.5 2.5 0 014 17.5z',
                      label: 'Access to premium courses',
                    },
                    {
                      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
                      label: 'Expert mentorship network',
                    },
                    {
                      icon: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
                      label: 'Certificates & recognition',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#92400e"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                        {item.label}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                        style={{ marginLeft: 'auto', flexShrink: 0 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div
                  style={{
                    animation: 'fadeUp 0.5s ease-out 1.2s both',
                    width: '100%',
                    maxWidth: 360,
                  }}
                >
                  <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                      width: '100%',
                      padding: '14px 0',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#fff',
                      background: 'linear-gradient(135deg, #7A1F2B, #9B3040)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      letterSpacing: '0.3px',
                      boxShadow: '0 4px 16px rgba(122,31,43,0.3)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(122,31,43,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(122,31,43,0.3)';
                    }}
                  >
                    Go to Dashboard
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#9ca3af',
                      marginTop: 16,
                      animation: 'fadeUp 0.5s ease-out 1.4s both',
                    }}
                  >
                    Redirecting to dashboard in a moment...
                  </p>
                </div>
              </div>
            )}
          </div>
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
