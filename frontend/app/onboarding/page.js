'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/registration-v2.css';
import ProgressStepper from '@/components/auth/registration/ProgressStepper';
import StepSidebarVisual from '@/components/auth/registration/StepSidebarVisual';
import Step1RoleSelection from '@/components/auth/registration/Step1RoleSelection';
import OtpVerification from '@/components/auth/registration/Step3OTPVerification';
import DynamicProfile from '@/components/auth/registration/Step4DynamicProfile';
import OnboardingReview from '@/components/auth/registration/OnboardingReview';
import { ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostAuthRedirect, isLoggedIn } from '@/lib/auth';

// Map onboarding step numbers to sidebar visual step numbers so the illustrations stay meaningful.
const SIDEBAR_STEP_MAP = { 1: 1, 2: 3, 3: 4, 4: 5 };

function OnboardingContent() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 - role
  const [selectedRole, setSelectedRole] = useState('');

  // Step 2 - phone + OTP
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneSessionId, setPhoneSessionId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Step 3 - profile
  const [profileData, setProfileData] = useState({});

  // Step 4 - review + legal
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Guard: must be logged in, and must not have already completed onboarding.
  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/signup'); return; }

    // If already onboarded, send to the right dashboard
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const meToken = typeof window !== 'undefined' ? sessionStorage.getItem('_at') : null;
    fetch(`${apiBase}/api/v1/auth/me`, {
      credentials: 'include',
      headers: meToken ? { Authorization: `Bearer ${meToken}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        const user = data?.data?.user;
        if (user?.onboarding_completed) {
          router.replace(getPostAuthRedirect({ user }));
        }
      })
      .catch(() => {});
  }, [router]);

  const steps = [
    { id: 1, label: 'Choose Role' },
    { id: 2, label: 'Verify Phone' },
    { id: 3, label: 'Profile Setup' },
    { id: 4, label: 'Review' },
  ];

  // ── Phone OTP helpers ─────────────────────────────────────────────────

  const sendPhoneOtp = async (fullPhone) => {
    setOtpError('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/v1/auth/phone/send-otp-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhoneSessionId(data.data.sessionId);
        setOtpSent(true);
      } else {
        // Show the actual error - rate limit, invalid number, etc.
        setOtpError(data.message || `Failed to send code (${res.status}). Please try again.`);
      }
    } catch (err) {
      setOtpError('Network error - could not send verification code. Please try again.');
    }
  };

  const handleVerifyPhone = async (_target, code) => {
    setOtpError('');
    if (!phoneSessionId) {
      setOtpError('No active session. Please resend the code.');
      return;
    }
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/v1/auth/phone/verify-otp-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: phoneSessionId, code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsPhoneVerified(true);
      } else {
        setOtpError(data.message || 'Incorrect code. Please try again.');
      }
    } catch {
      setOtpError('Connection error. Please try again.');
    }
  };

  // ── Step validation ───────────────────────────────────────────────────

  const isPhoneValid = phone.length === 10;

  const canProceed = (step) => {
    switch (step) {
      case 1: return !!selectedRole;
      case 2: return isPhoneVerified;
      case 3: {
        const words = (str) => (str || '').trim().split(/\s+/).filter(Boolean).length;
        // 'startup' is the only non-approval role - uses the founder/student profile form
        if (selectedRole === 'startup') {
          const isStudent = profileData.isStudent === 'Yes';
          return (
            !!profileData.designation && !!profileData.startupName &&
            (isStudent || !!profileData.startupStage) && !!profileData.industry &&
            !!profileData.yearsOfExperience && !!profileData.domainExpertise &&
            !!profileData.stateId && !!profileData.cityId &&
            !!profileData.linkedin && words(profileData.bio) >= 20
          );
        }
        if (selectedRole === 'mentor') {
          return (
            !!profileData.currentCompany && !!profileData.designation && !!profileData.industry &&
            !!profileData.yearsOfExperience && !!profileData.weeklyAvailability &&
            !!profileData.availabilityMode && !!profileData.linkedin && words(profileData.bio) >= 20
          );
        }
        if (selectedRole === 'investor') {
          return (
            !!profileData.organizationName && !!profileData.investorType &&
            !!profileData.investmentStage && !!profileData.preferredIndustries &&
            !!profileData.ticketSize && !!profileData.geography && !!profileData.linkedin
          );
        }
        return true;
      }
      case 4: return termsAccepted && privacyAccepted;
      default: return false;
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────

  const go = (step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    setError('');
  };

  const handleNext = async () => {
    setError('');
    if (currentStep < 4) {
      go(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) go(currentStep - 1);
  };

  // ── Final submit ──────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!termsAccepted || !privacyAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('_at') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/v1/auth/complete-onboarding`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          role: selectedRole,
          phone: `${countryCode}${phone}`,
          isPhoneVerified,
          dynamicProfileData: profileData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete onboarding. Please try again.');
      }

      setRequiresApproval(data.data?.requires_approval);
      setIsDone(true);

      if (!data.data?.requires_approval) {
        // Use the role-specific dashboard - getPostAuthRedirect reads the role
        // that was just saved. We pass onboarding_completed=true explicitly so
        // the helper skips the /onboarding check (we just finished it).
        const fakeUser = { role: selectedRole, onboarding_completed: true };
        setTimeout(() => router.push(getPostAuthRedirect({ user: fakeUser })), 2200);
      } else {
        setTimeout(() => router.push('/'), 7000);
      }
    } catch (err) {
      // Map any raw technical errors that may have slipped through to friendly messages
      const raw = err.message || '';
      let friendly = raw;

      if (raw.includes('E11000') || raw.includes('duplicate key')) {
        if (raw.includes('phone')) {
          friendly = 'An account with this phone number already exists. Please use a different number or log in.';
        } else if (raw.includes('email')) {
          friendly = 'An account with this email already exists. Try logging in instead.';
        } else {
          friendly = 'Some of your details are already registered. Please review and try again.';
        }
      } else if (!raw || raw.toLowerCase().includes('networkerror') || raw.toLowerCase().includes('fetch')) {
        friendly = 'Could not reach the server. Please check your connection and try again.';
      }

      setError(friendly || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Slide variants ────────────────────────────────────────────────────

  const slide = {
    enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 30 : -30, opacity: 0 }),
  };

  // ── Done screen ───────────────────────────────────────────────────────

  if (isDone) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '60px 32px', maxWidth: 500 }}
        >
          {requiresApproval ? (
            <>
              <div style={{ fontSize: '68px', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Profile Submitted - <span style={{ color: '#dc2626' }}>Under Review</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '20px' }}>
                Thank you for registering as a{' '}
                <strong style={{ color: '#dc2626', textTransform: 'capitalize' }}>
                  {selectedRole === 'startup' ? 'Student / Startup' : selectedRole}
                </strong>!{' '}
                Our team will review your details and notify you by email once approved.
                Direct login is disabled until permission is granted.
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Redirecting you to the home page...</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '68px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Welcome to <span style={{ color: '#dc2626' }}>Startups India!</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>
                Your profile is all set. Taking you to your dashboard...
              </p>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="reg-v2-container">
      <StepSidebarVisual currentStep={SIDEBAR_STEP_MAP[currentStep] || currentStep} />

      <main className="reg-v2-main">
        <ProgressStepper
          currentStep={currentStep}
          steps={steps}
          onStepClick={(s) => { if (s < currentStep) go(s); }}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {/* ── Step 1: Role ── */}
              {currentStep === 1 && (
                <Step1RoleSelection
                  selectedRole={selectedRole}
                  onSelectRole={(r) => { setSelectedRole(r); setError(''); }}
                />
              )}

              {/* ── Step 2: Phone + OTP ── */}
              {currentStep === 2 && (
                <div>
                  <div className="reg-v2-content-header">
                    <h2 className="reg-v2-content-title">Verify Your <span>Mobile Number</span></h2>
                    <p className="reg-v2-content-subtitle">
                      Enter your phone number to receive a 6-digit verification code.
                    </p>
                  </div>

                  <div className="reg-v2-otp-container" style={{ maxWidth: 480, margin: '0 auto' }}>
                    {/* Phone number entry */}
                    {!isPhoneVerified && (
                      <div style={{ width: '100%' }}>
                        <label className="reg-v2-label" style={{ marginBottom: '6px', display: 'block' }}>
                          Phone Number *
                        </label>
                        <div className="reg-v2-phone-group">
                          <select
                            className="reg-v2-country-code"
                            value={countryCode}
                            onChange={(e) => { setCountryCode(e.target.value); setOtpSent(false); setIsPhoneVerified(false); }}
                          >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+971">🇦🇪 +971</option>
                          </select>
                          <div className="reg-v2-input-wrapper" style={{ flex: 1 }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              className="reg-v2-input no-icon"
                              placeholder="10-digit mobile number"
                              value={phone}
                              maxLength={10}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPhone(digits);
                                setOtpSent(false);
                                setIsPhoneVerified(false);
                              }}
                            />
                          </div>
                        </div>
                        {phone && (
                          <p style={{ fontSize: '12px', marginTop: '4px', color: isPhoneValid ? '#059669' : '#ef4444', fontWeight: 500 }}>
                            {isPhoneValid ? '✓ Valid 10-digit number' : `✕ Must be 10 digits (${phone.length}/10)`}
                          </p>
                        )}

                        {!otpSent && (
                          <button
                            type="button"
                            className="reg-v2-btn-continue"
                            onClick={() => sendPhoneOtp(`${countryCode}${phone}`)}
                            disabled={!isPhoneValid}
                            style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
                          >
                            Send Verification Code <ArrowRight size={15} />
                          </button>
                        )}

                        {otpSent && (
                          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                            Code sent to <strong>{countryCode} {phone}</strong>
                          </p>
                        )}
                      </div>
                    )}

                    {/* OTP input - shown after sending */}
                    {otpSent && !isPhoneVerified && (
                      <OtpVerification
                        email=""
                        phone={`${countryCode} ${phone}`}
                        isEmailVerified={false}
                        isPhoneVerified={isPhoneVerified}
                        onVerifyTarget={handleVerifyPhone}
                        onResendPhoneOtp={() => sendPhoneOtp(`${countryCode}${phone}`)}
                        error={otpError}
                      />
                    )}

                    {/* Verified state */}
                    {isPhoneVerified && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        {/* Checkmark circle */}
                        <div style={{
                          width: '72px', height: '72px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          border: '3px solid #16a34a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 16px',
                          boxShadow: '0 8px 24px rgba(22, 163, 74, 0.2)',
                          fontSize: '32px',
                        }}>
                          ✓
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginBottom: '6px' }}>
                          Number Verified!
                        </h3>

                        <p style={{ fontSize: '13px', color: '#4b7c59', marginBottom: '16px' }}>
                          <strong>{countryCode} {phone}</strong> has been verified successfully.
                        </p>

                        {/* Verified badge pill */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: '#f0fdf4', border: '1.5px solid #86efac',
                          borderRadius: '20px', padding: '6px 16px',
                          fontSize: '12px', fontWeight: 700, color: '#15803d',
                        }}>
                          Secured &amp; Verified
                        </div>

                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
                          Click <strong>Continue</strong> to proceed to profile setup.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 3: Profile ── */}
              {currentStep === 3 && (
                <DynamicProfile
                  role="founder"
                  profileData={profileData}
                  onChange={(field, val) => { setProfileData((p) => ({ ...p, [field]: val })); setError(''); }}
                />
              )}

              {/* ── Step 4: Review ── */}
              {currentStep === 4 && (
                <OnboardingReview
                  role={selectedRole}
                  phone={`${countryCode} ${phone}`}
                  isPhoneVerified={isPhoneVerified}
                  profileData={profileData}
                  onGoToStep={go}
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  privacyAccepted={privacyAccepted}
                  setPrivacyAccepted={setPrivacyAccepted}
                  error={error}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global error banner */}
        {error && (
          <div style={{
            padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fca5a5',
            borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 600,
            marginTop: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <ShieldAlert size={18} />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Footer navigation */}
        <div className="reg-v2-footer-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div>
            {currentStep > 1 && (
              <button className="reg-v2-btn-back" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft size={15} /> Back
              </button>
            )}
          </div>
          <button
            className="reg-v2-btn-continue"
            onClick={handleNext}
            disabled={isLoading || !canProceed(currentStep)}
          >
            {isLoading ? 'Saving...' : currentStep === 4 ? 'Complete Setup' : 'Continue'}
            {!isLoading && <ArrowRight size={15} />}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        Loading...
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
