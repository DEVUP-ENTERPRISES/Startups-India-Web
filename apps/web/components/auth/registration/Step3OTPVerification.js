'use client';
import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Info, RefreshCw, Mail, Phone, CheckCircle2 } from 'lucide-react';

export default function Step3OTPVerification({
  email,
  phone,
  isEmailVerified,
  isPhoneVerified,
  onVerifyTarget,
  onResendPhoneOtp,
  error,
}) {
  const [activeTab, setActiveTab] = useState('phone'); // Only 'phone' is used now, email OTP is removed
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef([]);

  const currentTarget = activeTab === 'email' ? email : phone;
  const isCurrentTargetVerified = activeTab === 'email' ? isEmailVerified : isPhoneVerified;

  // Timer Countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = updated.join('');
    if (fullCode.length === 6) {
      handleCheckCode(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
      handleCheckCode(pastedData);
    }
  };

  const handleCheckCode = (code) => {
    setLocalError('');
    if (activeTab === 'email') {
      if (code === '123456' || code.length === 6) {
        onVerifyTarget(activeTab, code);
      } else {
        setLocalError('Invalid OTP code. Use 123456 for testing.');
      }
    } else {
      if (code.length === 6) {
        onVerifyTarget(activeTab, code);
      } else {
        setLocalError('Please enter a 6-digit verification code.');
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setLocalError('');
    inputRefs.current[0]?.focus();
    if (activeTab === 'phone' && onResendPhoneOtp) {
      onResendPhoneOtp();
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Verify Your <span>Mobile Number</span></h2>
        <p className="reg-v2-content-subtitle">
          Verify your mobile number to complete your registration.
        </p>
      </div>

      <div className="reg-v2-otp-container">
        <div className="reg-v2-otp-badge">
          <ShieldCheck size={36} />
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', margin: 0 }}>
          Enter the 6-digit verification code sent to <br />
          <strong style={{ color: '#0f172a' }}>{currentTarget || 'your registered contact'}</strong>
        </p>

        {isCurrentTargetVerified ? (
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', padding: '12px 20px', borderRadius: '10px', color: '#166534', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} />
            {activeTab === 'email' ? 'Email Address Verified' : 'Mobile Number Verified'}
          </div>
        ) : (
          <>
            {(localError || error) && (
              <div 
                style={{ 
                  padding: '10px 16px', background: '#fef2f2', border: '1px solid #fee2e2', 
                  borderRadius: '10px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
                  width: '100%', textAlign: 'center'
                }}
              >
                {localError || error}
              </div>
            )}

            {/* 6 OTP Digits */}
            <div className="reg-v2-otp-inputs" onPaste={handlePaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="reg-v2-otp-box"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="reg-v2-resend-box">
              <span>Didn&apos;t receive the code?</span>
              {canResend ? (
                <span className="reg-v2-resend-link" onClick={handleResend}>
                  <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Resend OTP
                </span>
              ) : (
                <span style={{ color: '#dc2626', fontWeight: 700 }}>
                  Resend in {formatTimer(timer)}
                </span>
              )}
            </div>

            {activeTab === 'phone' && (
              <div className="reg-v2-alert-info">
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Verification Code Sent</strong>
                  <p style={{ margin: 0, marginTop: '2px', opacity: 0.9 }}>
                    A verification code has been dispatched to your phone.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
