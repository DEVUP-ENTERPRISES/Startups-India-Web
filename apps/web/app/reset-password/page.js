'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { resetPassword } from '@/lib/auth';
import '@/styles/auth-redesign.css';

// Mirrors the server-side policy in auth.routes.js. This is UX, not enforcement —
// the API rejects a weak password regardless of what this component allows.
const RULES = [
  { id: 'length', label: 'At least 8 characters', test: v => v.length >= 8 },
  { id: 'lower', label: 'One lowercase letter', test: v => /[a-z]/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: v => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: v => /[0-9]/.test(v) },
];

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const ruleState = useMemo(() => RULES.map(r => ({ ...r, ok: r.test(password) })), [password]);
  const allRulesPass = ruleState.every(r => r.ok);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit = allRulesPass && passwordsMatch && !isLoading;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!allRulesPass) {
      setError('Please satisfy all password requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const { error: err } = await resetPassword(token, password);

    if (err) {
      setError(err.message || 'Could not reset your password. Please try again.');
      setIsLoading(false);
      return;
    }

    setDone(true);
    setIsLoading(false);
    // The reset revoked every existing session, so there is nothing to carry over.
    setTimeout(() => router.push('/login'), 2500);
  };

  // A missing token means the user landed here directly rather than via the email
  // link. Don't render a form that is guaranteed to fail on submit.
  if (!token) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', color: '#ef4444' }}>
          <ShieldCheck size={64} style={{ margin: '0 auto' }} />
        </div>
        <h2 className="auth-title">
          Invalid reset <span>link</span>
        </h2>
        <p className="auth-subtitle" style={{ marginTop: '12px' }}>
          This link is missing its security token. Reset links expire after 30 minutes — please
          request a fresh one.
        </p>
        <Link href="/forgot-password" style={{ display: 'block', marginTop: '28px' }}>
          <button type="button" className="btn-primary">
            Request a new link <ArrowRight size={18} />
          </button>
        </Link>
        <div className="signup-footer" style={{ marginTop: '24px' }}>
          <Link href="/login" className="signup-action">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
        style={{ textAlign: 'center' }}
      >
        <div style={{ marginBottom: '24px', color: '#10b981' }}>
          <CheckCircle2 size={72} style={{ margin: '0 auto' }} />
        </div>
        <h2 className="auth-title">
          Password <span>updated</span>
        </h2>
        <p className="auth-subtitle" style={{ marginTop: '12px' }}>
          You&apos;ve been signed out on all devices. Redirecting you to sign in with your new
          password...
        </p>
        <Link href="/login" style={{ display: 'block', marginTop: '28px' }}>
          <button type="button" className="btn-primary">
            Sign in now <ArrowRight size={18} />
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="auth-card"
    >
      <div className="auth-header">
        <div className="startup-badge">Account Recovery</div>
        <h2 className="auth-title">
          Set a new <span>password</span>
        </h2>
        <p className="auth-subtitle">
          Choose a strong password you haven&apos;t used before. This will sign you out everywhere
          else.
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
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            New Password
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon-left" size={18} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Enter a new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {password.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              listStyle: 'none',
              padding: '12px 14px',
              margin: '0 0 20px 0',
              background: '#f9fafb',
              border: '1px solid #f0f0f0',
              borderRadius: '12px',
              display: 'grid',
              gap: '6px',
            }}
          >
            {ruleState.map(rule => (
              <li
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: rule.ok ? '#10b981' : '#9ca3af',
                }}
              >
                {rule.ok ? <Check size={14} /> : <X size={14} />}
                {rule.label}
              </li>
            ))}
          </motion.ul>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="confirm">
            Confirm New Password
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon-left" size={18} />
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input ${confirm.length > 0 && !passwordsMatch ? 'error' : ''}`}
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          {confirm.length > 0 && !passwordsMatch && (
            <p style={{ marginTop: '8px', fontSize: '12.5px', color: '#ef4444', fontWeight: 500 }}>
              Passwords do not match.
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {isLoading ? 'Updating password...' : 'Reset Password'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="signup-footer" style={{ marginTop: '28px' }}>
        <Link
          href="/login"
          className="signup-action"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-layout" style={{ gridTemplateColumns: '1fr' }}>
      <div className="auth-panel">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Startups India"
              width={170}
              height={48}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </motion.div>

        {/* useSearchParams() requires a Suspense boundary or the whole route
            opts out of static rendering at build time. */}
        <Suspense
          fallback={
            <div className="auth-card" style={{ textAlign: 'center' }}>
              <p className="auth-subtitle">Verifying your reset link...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
