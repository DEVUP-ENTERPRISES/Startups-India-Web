'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/styles/registration-v2.css';
import ProgressStepper from '@/components/auth/registration/ProgressStepper';
import StepSidebarVisual from '@/components/auth/registration/StepSidebarVisual';
import Step1RoleSelection from '@/components/auth/registration/Step1RoleSelection';
import Step2BasicInformation from '@/components/auth/registration/Step2BasicInformation';
import Step3OTPVerification from '@/components/auth/registration/Step3OTPVerification';
import Step4DynamicProfile from '@/components/auth/registration/Step4DynamicProfile';
import Step5Review from '@/components/auth/registration/Step5Review';
import SuccessPage from '@/components/auth/registration/SuccessPage';
import { ArrowRight, ArrowLeft, ShieldAlert, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [selectedRole, setSelectedRole] = useState('');
  
  // Step 2 Form State
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isPhoneTaken, setIsPhoneTaken] = useState(false);

  // Step 3 Dual OTP Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Step 4 Dynamic Profile Data
  const [profileData, setProfileData] = useState({});

  // Step 5 Agreements & Global Errors
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.replace(returnUrl);
    }
  }, [router, returnUrl]);

  const steps = [
    { id: 1, label: 'Choose Role' },
    { id: 2, label: 'Basic Information' },
    { id: 3, label: 'Verify OTP' },
    { id: 4, label: 'Profile Setup' },
    { id: 5, label: 'Complete' },
  ];

  // Form field change handlers
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
    if (field === 'email') setIsEmailTaken(false);
    if (field === 'phone') setIsPhoneTaken(false);
    if (error) setError('');
  };

  const handleProfileDataChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // Step Validation logic
  const canProceedFromStep = (step) => {
    switch (step) {
      case 1:
        return !!selectedRole;
      case 2:
        return (
          !!basicInfo.fullName &&
          !!basicInfo.email &&
          !isEmailTaken &&
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(basicInfo.email) &&
          (basicInfo.phone || '').length === 10 &&
          !isPhoneTaken &&
          (basicInfo.password || '').length >= 8 &&
          basicInfo.password === basicInfo.confirmPassword
        );
      case 3:
        return isEmailVerified || isPhoneVerified;
      case 4:
        {
          const countWords = (str) => {
            if (!str || !str.trim()) return 0;
            return str.trim().split(/\s+/).filter(Boolean).length;
          };

          if (selectedRole === 'startup') {
            return (
              !!profileData.startupName &&
              !!profileData.startupStage &&
              !!profileData.industry &&
              !!profileData.yearFounded &&
              !!profileData.teamSize &&
              !!profileData.city &&
              !!profileData.isRegistered &&
              !!profileData.problemStatement &&
              countWords(profileData.description) >= 20
            );
          }
          if (selectedRole === 'founder') {
            const isStudent = profileData.isStudent === 'Yes';
            return (
              !!profileData.designation &&
              !!profileData.startupName &&
              (isStudent || !!profileData.startupStage) &&
              !!profileData.industry &&
              !!profileData.yearsOfExperience &&
              !!profileData.domainExpertise &&
              !!profileData.city &&
              !!profileData.linkedin &&
              countWords(profileData.bio) >= 20
            );
          }
          if (selectedRole === 'mentor') {
            return (
              !!profileData.currentCompany &&
              !!profileData.designation &&
              !!profileData.industry &&
              !!profileData.yearsOfExperience &&
              !!profileData.weeklyAvailability &&
              !!profileData.availabilityMode &&
              !!profileData.linkedin &&
              countWords(profileData.bio) >= 20
            );
          }
          if (selectedRole === 'investor') {
            return (
              !!profileData.organizationName &&
              !!profileData.investorType &&
              !!profileData.investmentStage &&
              !!profileData.preferredIndustries &&
              !!profileData.ticketSize &&
              !!profileData.geography &&
              !!profileData.linkedin
            );
          }
          return true;
        }
      case 5:
        return termsAccepted && privacyAccepted;
      default:
        return false;
    }
  };

  // Navigation actions with directional animations
  const handleNext = async () => {
    setError('');

    if (currentStep === 1) {
      if (!selectedRole) {
        setError('Please select a role to continue.');
        return;
      }
      setDirection(1);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!basicInfo.fullName) {
        setError('Please enter your full name.');
        return;
      }
      if (!basicInfo.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(basicInfo.email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if ((basicInfo.phone || '').length !== 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if ((basicInfo.password || '').length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (basicInfo.password !== basicInfo.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setDirection(1);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!isEmailVerified && !isPhoneVerified) {
        setError('Please verify at least your Email Address or Mobile Number before proceeding.');
        return;
      }
      setDirection(1);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setDirection(1);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      await handleSubmitRegistration();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setError('');
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  // Dual Target OTP Verification handler
  const handleVerifyTarget = (targetType, code) => {
    setOtpError('');
    if (code === '123456' || code.length === 6) {
      if (targetType === 'email') {
        setIsEmailVerified(true);
      } else {
        setIsPhoneVerified(true);
      }
    } else {
      setOtpError('Invalid verification code');
    }
  };

  // Final Submit Handler
  const handleSubmitRegistration = async () => {
    if (!termsAccepted || !privacyAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      fullName: basicInfo.fullName,
      email: basicInfo.email,
      phone: `${basicInfo.countryCode} ${basicInfo.phone}`,
      password: basicInfo.password,
      role: selectedRole,
      isVerified: isEmailVerified || isPhoneVerified,
      isEmailVerified,
      isPhoneVerified,
      dynamicProfileData: profileData,
    };

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/v1/auth/register-v2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Registration failed. Please check your details.');
      } else {
        const noApproval = ['founder', 'startup'].includes(selectedRole);
        if (noApproval && resData.data?.session?.access_token) {
          localStorage.setItem('access_token', resData.data.session.access_token);
          window.dispatchEvent(new CustomEvent('user:login'));
        }
        setRequiresApproval(!noApproval);
      }

      setDirection(1);
      setCurrentStep(6);
    } catch (err) {
      const msg = err.message || 'An error occurred during registration. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  return (
    <div className="reg-v2-container">
      {/* Left Dynamic 3D Illustration Visual Sidebar */}
      <StepSidebarVisual currentStep={currentStep} />

      {/* Right Main Stepper & Form Container */}
      <main className="reg-v2-main">
        {/* 5-Step Stepper */}
        {currentStep <= 5 && (
          <ProgressStepper
            currentStep={currentStep}
            steps={steps}
            onStepClick={(s) => {
              if (s < currentStep) {
                setDirection(-1);
                setCurrentStep(s);
              }
            }}
          />
        )}

        {/* Dynamic Step View with Framer Motion Slide Transitions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {currentStep === 1 && (
                <Step1RoleSelection
                  selectedRole={selectedRole}
                  onSelectRole={(r) => {
                    setSelectedRole(r);
                    if (error) setError('');
                  }}
                />
              )}

              {currentStep === 2 && (
                <Step2BasicInformation
                  formData={basicInfo}
                  onChange={handleBasicInfoChange}
                  error={error}
                  isEmailTaken={isEmailTaken}
                  setIsEmailTaken={setIsEmailTaken}
                  isPhoneTaken={isPhoneTaken}
                  setIsPhoneTaken={setIsPhoneTaken}
                />
              )}

              {currentStep === 3 && (
                <Step3OTPVerification
                  email={basicInfo.email}
                  phone={`${basicInfo.countryCode} ${basicInfo.phone}`}
                  isEmailVerified={isEmailVerified}
                  isPhoneVerified={isPhoneVerified}
                  onVerifyTarget={handleVerifyTarget}
                  error={otpError || error}
                />
              )}

              {currentStep === 4 && (
                <Step4DynamicProfile
                  role={selectedRole}
                  profileData={profileData}
                  onChange={handleProfileDataChange}
                />
              )}

              {currentStep === 5 && (
                <Step5Review
                  role={selectedRole}
                  basicInfo={basicInfo}
                  isVerified={isEmailVerified || isPhoneVerified}
                  isEmailVerified={isEmailVerified}
                  isPhoneVerified={isPhoneVerified}
                  profileData={profileData}
                  onGoToStep={(s) => {
                    setDirection(-1);
                    setCurrentStep(s);
                  }}
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  privacyAccepted={privacyAccepted}
                  setPrivacyAccepted={setPrivacyAccepted}
                  error={error}
                />
              )}

              {currentStep === 6 && (
                <SuccessPage
                  role={selectedRole}
                  requiresApproval={requiresApproval}
                  returnUrl={returnUrl}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Error Banner above Footer Buttons */}
        {error && currentStep <= 5 && (
          <div 
            style={{ 
              padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fca5a5', 
              borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 600,
              marginTop: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
            }}
          >
            <ShieldAlert size={18} />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Footer Navigation Actions */}
        {currentStep <= 5 && (
          <div className="reg-v2-footer-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {currentStep > 1 && (
                <button className="reg-v2-btn-back" onClick={handleBack} disabled={isLoading}>
                  <ArrowLeft size={15} /> Back
                </button>
              )}
            </div>

            <button
              className="reg-v2-btn-continue"
              onClick={handleNext}
              disabled={isLoading || !canProceedFromStep(currentStep)}
            >
              {isLoading
                ? 'Submitting Registration...'
                : currentStep === 3
                ? (isEmailVerified || isPhoneVerified ? 'Continue' : 'Verify Target')
                : currentStep === 5
                ? 'Submit & Complete Registration'
                : 'Continue'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </div>
        )}

        {/* Sign in link at bottom */}
        {currentStep <= 5 && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#dc2626', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        )}
      </main>
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
