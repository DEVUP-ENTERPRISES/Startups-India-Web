'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, KeyRound, RefreshCw } from 'lucide-react';
import { verifyTwoFactor, resendTwoFactorCode, verifyBackupCode } from '@/lib/auth';

const CODE_LENGTH = 6;

/**
 * Second step of login. Rendered only after /login has answered with
 * two_factor_required — at that point the password is verified but no session
 * exists yet, and `pendingToken` is the only thing that can complete it.
 *
 * @param {string}   pendingToken
 * @param {string}   phoneMasked  e.g. "+91 ••••• 3210"
 * @param {number}   expiresIn    seconds until the code dies
 * @param {Function} onSuccess    called once a real session is stored
 * @param {Function} onCancel     back to the password form
 */
export default function TwoFactorStep({
  pendingToken,
  phoneMasked,
  expiresIn = 300,
  onSuccess,
  onCancel,
}) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [backupMode, setBackupMode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(expiresIn);
  const [resendIn, setResendIn] = useState(60);

  const inputsRef = useRef([]);
  const code = digits.join('');

  // Expiry + resend cooldown tick together off one interval.
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
      setResendIn(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const submitCode = async value => {
    setError('');
    setIsLoading(true);
    const { data, error: err } = await verifyTwoFactor(pendingToken, value);
    if (err) {
      setError(err.message || 'That code did not work.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
      setIsLoading(false);
      return;
    }
    onSuccess(data);
  };

  const handleDigit = (index, raw) => {
    const value = raw.replace(/\D/g, '');
    if (!value) {
      setDigits(prev => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }

    // Handle a pasted or autofilled full code landing in one box.
    if (value.length > 1) {
      const next = value.slice(0, CODE_LENGTH).split('');
      const filled = Array(CODE_LENGTH)
        .fill('')
        .map((_, i) => next[i] || '');
      setDigits(filled);
      if (filled.every(Boolean)) submitCode(filled.join(''));
      else inputsRef.current[Math.min(next.length, CODE_LENGTH - 1)]?.focus();
      return;
    }

    const next = digits.map((d, i) => (i === index ? value : d));
    setDigits(next);
    if (index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();

    // Auto-submit on the last digit — saves a click on the most common path.
    if (next.every(Boolean)) submitCode(next.join(''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    const { error: err } = await resendTwoFactorCode(pendingToken);
    if (err) {
      setError(err.message || 'Could not resend the code.');
      return;
    }
    setNotice('A new code is on its way.');
    setDigits(Array(CODE_LENGTH).fill(''));
    setSecondsLeft(expiresIn);
    setResendIn(60);
    inputsRef.current[0]?.focus();
  };

  const handleBackupSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { data, error: err } = await verifyBackupCode(pendingToken, backupCode.trim());
    if (err) {
      setError(err.message || 'That recovery code is not valid.');
      setIsLoading(false);
      return;
    }
    onSuccess(data);
  };

  const expired = secondsLeft === 0;
  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <motion.div key="2fa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="auth-header">
        <div className="startup-badge">Two-Factor Authentication</div>
        <h2 className="auth-title">
          Verify it&apos;s <span>you</span>
        </h2>
        <p className="auth-subtitle">
          {backupMode ? (
            <>Enter one of the recovery codes you saved when you turned on two-factor.</>
          ) : (
            <>
              We sent a {CODE_LENGTH}-digit code to <strong>{phoneMasked}</strong>. It expires in{' '}
              <strong>{expired ? '—' : mmss}</strong>.
            </>
          )}
        </p>
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
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} />
          {error}
        </motion.div>
      )}

      {notice && !error && (
        <div
          style={{
            padding: '12px 16px',
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            borderRadius: '12px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '20px',
          }}
        >
          {notice}
        </div>
      )}

      {backupMode ? (
        <form onSubmit={handleBackupSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="backupCode">
              Recovery Code
            </label>
            <div className="input-wrapper">
              <KeyRound className="input-icon-left" size={18} />
              <input
                id="backupCode"
                type="text"
                className="auth-input"
                placeholder="XXXXX-XXXXX"
                value={backupCode}
                onChange={e => setBackupCode(e.target.value)}
                autoComplete="one-time-code"
                autoFocus
                required
              />
            </div>
            <p style={{ marginTop: '8px', fontSize: '12.5px', color: '#6b7280' }}>
              Each recovery code works only once.
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading || !backupCode.trim()}>
            {isLoading ? 'Verifying...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      ) : (
        <>
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
                // Lets iOS/Android offer the code straight from the SMS.
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                value={digit}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={isLoading || expired}
                aria-label={`Digit ${i + 1}`}
                style={{
                  width: '100%',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#111827',
                  border: `1.5px solid ${digit ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  background: '#fff',
                  outline: 'none',
                  transition: 'border-color .15s',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => submitCode(code)}
            disabled={isLoading || code.length !== CODE_LENGTH || expired}
          >
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
            }}
          >
            <button
              type="button"
              onClick={handleResend}
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
                setBackupMode(true);
                setError('');
                setNotice('');
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
              Lost your phone?
            </button>
          </div>
        </>
      )}

      <div className="signup-footer" style={{ marginTop: '28px' }}>
        <button
          type="button"
          onClick={backupMode ? () => setBackupMode(false) : onCancel}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6b7280',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          {backupMode ? 'Use the SMS code instead' : 'Back to sign in'}
        </button>
      </div>
    </motion.div>
  );
}
