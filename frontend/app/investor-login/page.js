'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { signIn } from '@/lib/auth';
import '@/styles/auth-redesign.css';

/**
 * Dedicated investor sign-in - mirror of /mentor-login. A branded entry point,
 * not a security boundary: access is decided by the account's role, so a
 * non-investor signing in here is routed to their own dashboard rather than
 * rejected.
 */
export default function InvestorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setPending(''); setIsLoading(true);

    const { data, error: err } = await signIn(email.trim(), password);
    if (err) {
      if (err.status === 403 && /review|approved/i.test(err.message || '')) {
        setPending(true);
        setError(err.message);
      } else {
        setError(err.message || 'Could not sign you in. Please check your details.');
      }
      setIsLoading(false);
      return;
    }

    const role = data?.user?.role;
    if (role === 'investor') { router.push('/dashboard/investor'); return; }
    router.push(role === 'admin' ? '/' : '/dashboard');
  };

  return (
    <div className="auth-layout" style={{ gridTemplateColumns: '1fr' }}>
      <div className="auth-panel">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '32px' }}>
          <Link href="/">
            <Image src="/assets/images/logo.png" alt="Startups India" width={170} height={48} priority style={{ width: 'auto', height: 'auto' }} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="auth-card">
          <div className="auth-header">
            <div className="startup-badge"><TrendingUp size={13} style={{ marginRight: '5px' }} /> Investor Portal</div>
            <h2 className="auth-title">Investor <span>Sign In</span></h2>
            <p className="auth-subtitle">Sign in with the email and password you used when you applied.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '12px 16px', marginBottom: '22px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, lineHeight: 1.6, background: pending ? '#fffbeb' : '#fef2f2', border: `1px solid ${pending ? '#fde68a' : '#fee2e2'}`, color: pending ? '#b45309' : '#ef4444' }}>
              {pending ? <Clock size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input id="email" type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input id="password" type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Link href="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading || !email.trim() || !password}>
              {isLoading ? 'Signing in...' : 'Sign In to Investor Dashboard'}{!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="signup-footer" style={{ marginTop: '28px' }}>
            <p>Not an investor yet? <Link href="/investors#become-investor" className="signup-action">Apply as an Investor</Link></p>
            <p style={{ marginTop: '8px', fontSize: '13px' }}>Looking for the founder login? <Link href="/login" className="signup-action">Sign in here</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
