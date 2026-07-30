'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Step2BasicInformation({ 
  formData, 
  onChange, 
  error,
  isEmailTaken,
  setIsEmailTaken,
  isPhoneTaken,
  setIsPhoneTaken
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const isEmailValid = !!formData.email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
  const isPhoneValid = (formData.phone || '').length === 10;
  const passwordLengthMet = (formData.password || '').length >= 8;
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Real-time debounced check for email uniqueness
  useEffect(() => {
    if (!isEmailValid) {
      setIsEmailTaken(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/v1/auth/check-exists?email=${encodeURIComponent(formData.email)}`);
        const json = await res.json();
        if (json.success && json.data?.emailExists) {
          setIsEmailTaken(true);
        } else {
          setIsEmailTaken(false);
        }
      } catch (err) {
        setIsEmailTaken(false);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.email, isEmailValid, setIsEmailTaken]);

  // Real-time debounced check for phone uniqueness
  useEffect(() => {
    if (!isPhoneValid) {
      setIsPhoneTaken(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingPhone(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/v1/auth/check-exists?phone=${encodeURIComponent(formData.phone)}`);
        const json = await res.json();
        if (json.success && json.data?.phoneExists) {
          setIsPhoneTaken(true);
        } else {
          setIsPhoneTaken(false);
        }
      } catch (err) {
        setIsPhoneTaken(false);
      } finally {
        setIsCheckingPhone(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.phone, isPhoneValid, setIsPhoneTaken]);

  const handlePhoneInput = (e) => {
    // Only accept digits, maximum 10 digits
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange('phone', digits);
  };

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Basic <span>Information</span></h2>
        <p className="reg-v2-content-subtitle">
          Please fill in the basic details to create your account.
        </p>
      </div>

      {error && (
        <div 
          style={{ 
            padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', 
            borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <div className="reg-v2-form">
        {/* Full Name */}
        <div className="reg-v2-field-group">
          <label className="reg-v2-label">Full Name *</label>
          <div className="reg-v2-input-wrapper">
            <User className="reg-v2-input-icon" size={18} />
            <input
              type="text"
              className="reg-v2-input"
              placeholder="Enter your full name"
              value={formData.fullName || ''}
              onChange={(e) => onChange('fullName', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="reg-v2-field-group">
          <label className="reg-v2-label">Email ID *</label>
          <div className="reg-v2-input-wrapper" style={{ border: isEmailTaken ? '1.5px solid #ef4444' : undefined, background: isEmailTaken ? '#fef2f2' : undefined }}>
            <Mail className="reg-v2-input-icon" size={18} color={isEmailTaken ? '#ef4444' : undefined} />
            <input
              type="email"
              className="reg-v2-input"
              placeholder="name@example.com"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              style={{ color: isEmailTaken ? '#dc2626' : undefined, fontWeight: isEmailTaken ? 600 : undefined }}
              required
            />
          </div>
          {formData.email && (
            <p style={{ fontSize: '12px', color: isEmailTaken ? '#dc2626' : isEmailValid ? '#059669' : '#ef4444', marginTop: '5px', fontWeight: isEmailTaken ? 600 : 400, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isCheckingEmail ? (
                <span>Checking availability...</span>
              ) : isEmailTaken ? (
                <span>✕ This mail ID already exists in our database</span>
              ) : isEmailValid ? (
                <span>✓ Valid email address</span>
              ) : (
                <span>✕ Please enter a valid email address (e.g. name@domain.com)</span>
              )}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="reg-v2-field-group">
          <label className="reg-v2-label">Phone Number (10 Digits) *</label>
          <div className="reg-v2-phone-group">
            <select
              className="reg-v2-country-code"
              value={formData.countryCode || '+91'}
              onChange={(e) => onChange('countryCode', e.target.value)}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+971">🇦🇪 +971</option>
            </select>
            <div className="reg-v2-input-wrapper" style={{ flex: 1, border: isPhoneTaken ? '1.5px solid #ef4444' : undefined, background: isPhoneTaken ? '#fef2f2' : undefined }}>
              <Phone className="reg-v2-input-icon" size={18} color={isPhoneTaken ? '#ef4444' : undefined} />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="reg-v2-input"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone || ''}
                onChange={handlePhoneInput}
                style={{ color: isPhoneTaken ? '#dc2626' : undefined, fontWeight: isPhoneTaken ? 600 : undefined }}
                required
              />
            </div>
          </div>
          {formData.phone && (
            <p style={{ fontSize: '12px', color: isPhoneTaken ? '#dc2626' : isPhoneValid ? '#059669' : '#ef4444', marginTop: '5px', fontWeight: isPhoneTaken ? 600 : 400, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isCheckingPhone ? (
                <span>Checking availability...</span>
              ) : isPhoneTaken ? (
                <span>✕ This phone number already exists in our database</span>
              ) : isPhoneValid ? (
                <span>✓ Valid 10-digit mobile number</span>
              ) : (
                <span>✕ Mobile number must be exactly 10 digits ({(formData.phone || '').length}/10)</span>
              )}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="reg-v2-field-group">
          <label className="reg-v2-label">Create Password *</label>
          <div className="reg-v2-input-wrapper">
            <Lock className="reg-v2-input-icon" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              className="reg-v2-input"
              placeholder="Enter your password (min 8 chars)"
              value={formData.password || ''}
              onChange={(e) => onChange('password', e.target.value)}
              required
            />
            <button
              type="button"
              className="reg-v2-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: passwordLengthMet ? '#059669' : '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {passwordLengthMet && <CheckCircle2 size={14} />}
            Password must be at least 8 characters long.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="reg-v2-field-group">
          <label className="reg-v2-label">Confirm Password *</label>
          <div className="reg-v2-input-wrapper">
            <Lock className="reg-v2-input-icon" size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="reg-v2-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword || ''}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              required
            />
            <button
              type="button"
              className="reg-v2-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.confirmPassword && (
            <p style={{ fontSize: '11px', color: passwordsMatch ? '#059669' : '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
