'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/auth';

const CODE_LENGTH = 6;

/**
 * Collects a mobile number and proves ownership of it via SMS.
 *
 * Requires an authenticated session (the endpoints are behind authRequired), so
 * it is used after signup and from the dashboard - never on the logged-out login
 * page. On success the number is stored in E.164 and marked verified, which is
 * the precondition for enabling 2FA.
 *
 * @param {string}   initialPhone
 * @param {Function} onVerified   called with { phone_masked }
 * @param {Function} [onSkip]     renders a "not now" affordance when provided
 */
export default function PhoneVerifyCard({ initialPhone = '', onVerified, onSkip }) {
  const [phone, setPhone] = useState(initialPhone);
  const [stage, setStage] = useState('enter'); // 'enter' | 'code' | 'done'
  const [phoneMasked, setPhoneMasked] = useState('');
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const inputsRef = useRef([]);
  const code = digits.join('');

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const id = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const requestCode = async e => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    const { data, error: err } = await sendPhoneOtp(phone.trim());
    if (err) {
      setError(err.message || 'Could not send the code.');
      setIsLoading(false);
      return;
    }

    setPhoneMasked(data.phone_masked);
    setStage('code');
    setResendIn(60);
    setIsLoading(false);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const submitCode = async value => {
    setError('');
    setIsLoading(true);
    const { data, error: err } = await verifyPhoneOtp(value);
    if (err) {
      setError(err.message || 'That code did not work.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
      setIsLoading(false);
      return;
    }
    setStage('done');
    setIsLoading(false);
    onVerified?.(data);
  };

  const handleDigit = (index, raw) => {
    const value = raw.replace(/\D/g, '');
    if (!value) {
      setDigits(prev => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    if (value.length > 1) {
      const next = value.slice(0, CODE_LENGTH).split('');
      const filled = Array(CODE_LENGTH)
        .fill('')
        .map((_, i) => next[i] || '');
      setDigits(filled);
      if (filled.every(Boolean)) submitCode(filled.join(''));
      return;
    }
    const next = digits.map((d, i) => (i === index ? value : d));
    setDigits(next);
    if (index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    if (next.every(Boolean)) submitCode(next.join(''));
  };

  if (stage === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ color: '#10b981', marginBottom: '16px' }}>
          <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Mobile number verified
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {phoneMasked} is now linked to your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} />
          {error}
        </div>
      )}

      {stage === 'enter' ? (
        <form onSubmit={requestCode}>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Mobile Number
            </label>
            <div className="input-wrapper">
              <Phone className="input-icon-left" size={18} />
              <input
                id="phone"
                type="tel"
                className="auth-input"
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>
            <p style={{ marginTop: '8px', fontSize: '12.5px', color: '#6b7280' }}>
              Indian mobile numbers only. We&apos;ll text you a {CODE_LENGTH}-digit code.
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading || !phone.trim()}>
            {isLoading ? 'Sending code...' : 'Send Code'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      ) : (
        <>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px' }}>
            Enter the {CODE_LENGTH}-digit code we sent to <strong>{phoneMasked}</strong>.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${CODE_LENGTH}, 1fr)`,
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                value={digit}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !digits[i] && i > 0) {
                    inputsRef.current[i - 1]?.focus();
                  }
                }}
                disabled={isLoading}
                aria-label={`Digit ${i + 1}`}
                style={{
                  width: '100%',
                  height: '52px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#111827',
                  border: `1.5px solid ${digit ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  background: '#fff',
                  outline: 'none',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => submitCode(code)}
            disabled={isLoading || code.length !== CODE_LENGTH}
          >
            {isLoading ? 'Verifying...' : 'Verify Number'}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <button
              type="button"
              onClick={requestCode}
              disabled={resendIn > 0}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: resendIn > 0 ? '#9ca3af' : '#ef4444',
                fontWeight: 600,
                cursor: resendIn > 0 ? 'default' : 'pointer',
              }}
            >
              <RefreshCw size={14} />
              {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage('enter');
                setDigits(Array(CODE_LENGTH).fill(''));
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#6b7280',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Change number
            </button>
          </div>
        </>
      )}

      {onSkip && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Not now
          </button>
        </div>
      )}
    </div>
  );
}
