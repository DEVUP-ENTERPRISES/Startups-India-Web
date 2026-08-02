'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import {
  getCurrentUser,
  enableTwoFactor,
  disableTwoFactor,
  regenerateBackupCodes,
} from '@/lib/auth';
import PhoneVerifyCard from '@/components/auth/PhoneVerifyCard';
import '@/styles/auth-redesign.css';

function BackupCodes({ codes, onDone }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        padding: '20px',
        background: '#fff8f8',
        border: '1px solid #fee2e2',
        borderRadius: '16px',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            Save these recovery codes now
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
            This is the only time they will ever be shown - we store them hashed and cannot show
            them again. Each one works once. Without them, a lost phone means a locked account.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '8px',
          margin: '16px 0',
        }}
      >
        {codes.map(code => (
          <code
            key={code}
            style={{
              padding: '10px',
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '13px',
              fontWeight: 600,
              color: '#111827',
              textAlign: 'center',
            }}
          >
            {code}
          </code>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" className="btn-primary" onClick={copy} style={{ flex: 1 }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy codes'}
        </button>
        <button
          type="button"
          onClick={onDone}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border: '1.5px solid #e5e7eb',
            background: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          I&apos;ve saved them
        </button>
      </div>
    </div>
  );
}

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [addingPhone, setAddingPhone] = useState(false);
  const [backupCodes, setBackupCodes] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  const load = async () => {
    const { data, error: err } = await getCurrentUser();
    if (err || !data?.user) {
      router.replace('/login?returnUrl=/settings/security');
      return;
    }
    setUser(data.user);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnable = async () => {
    setError('');
    setBusy(true);
    const { data, error: err } = await enableTwoFactor();
    setBusy(false);
    if (err) {
      setError(err.message || 'Could not turn on two-factor authentication.');
      return;
    }
    setBackupCodes(data.backup_codes);
    await load();
  };

  const handleDisable = async e => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await disableTwoFactor(password);
    setBusy(false);
    if (err) {
      setError(err.message || 'Could not turn off two-factor authentication.');
      return;
    }
    setPassword('');
    setConfirmingDisable(false);
    setNotice('Two-factor authentication is off.');
    await load();
  };

  const handleRegenerate = async () => {
    const pw = window.prompt('Confirm your password to generate new recovery codes:');
    if (!pw) return;
    setError('');
    setBusy(true);
    const { data, error: err } = await regenerateBackupCodes(pw);
    setBusy(false);
    if (err) {
      setError(err.message || 'Could not regenerate recovery codes.');
      return;
    }
    setBackupCodes(data.backup_codes);
  };

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#6b7280' }}>
        Loading your security settings...
      </div>
    );
  }

  const phoneVerified = user.phone_verified;
  const twoFactorOn = user.two_factor_enabled;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
        Security
      </h1>
      <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px' }}>
        Protect your account with a second layer of verification.
      </p>

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
          }}
        >
          {error}
        </div>
      )}
      {notice && (
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

      {backupCodes && (
        <div style={{ marginBottom: '24px' }}>
          <BackupCodes codes={backupCodes} onDone={() => setBackupCodes(null)} />
        </div>
      )}

      {/* ── Mobile number ── */}
      <section
        style={{
          padding: '24px',
          border: '1px solid #f0f0f0',
          borderRadius: '16px',
          marginBottom: '20px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <Smartphone size={20} color="#ef4444" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
            Mobile Number
          </h3>
          {phoneVerified && (
            <span
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                background: '#f0fdf4',
                color: '#10b981',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <Check size={12} /> Verified
            </span>
          )}
        </div>

        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
          {phoneVerified
            ? `Codes are sent to ${user.phone_masked}.`
            : 'Verify a mobile number to unlock two-factor authentication.'}
        </p>

        {addingPhone || !phoneVerified ? (
          <PhoneVerifyCard
            onVerified={async () => {
              setAddingPhone(false);
              setNotice('Mobile number verified.');
              await load();
            }}
            onSkip={addingPhone ? () => setAddingPhone(false) : undefined}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingPhone(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1.5px solid #e5e7eb',
              background: '#fff',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Change number
          </button>
        )}
      </section>

      {/* ── Two-factor ── */}
      <section
        style={{
          padding: '24px',
          border: '1px solid #f0f0f0',
          borderRadius: '16px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          {twoFactorOn ? (
            <ShieldCheck size={20} color="#10b981" />
          ) : (
            <ShieldAlert size={20} color="#9ca3af" />
          )}
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
            Two-Factor Authentication
          </h3>
          <span
            style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              background: twoFactorOn ? '#f0fdf4' : '#f3f4f6',
              color: twoFactorOn ? '#10b981' : '#6b7280',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {twoFactorOn ? 'On' : 'Off'}
          </span>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
          When this is on, signing in needs your password <em>and</em> a code texted to your phone.
          A stolen password alone is no longer enough to reach your account.
        </p>

        {!twoFactorOn ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleEnable}
            disabled={!phoneVerified || busy}
            title={phoneVerified ? undefined : 'Verify a mobile number first'}
          >
            {busy ? 'Turning on...' : 'Turn on two-factor'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={busy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1.5px solid #e5e7eb',
                background: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <KeyRound size={15} /> New recovery codes
            </button>

            {!confirmingDisable ? (
              <button
                type="button"
                onClick={() => setConfirmingDisable(true)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #fee2e2',
                  background: '#fff',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Turn off
              </button>
            ) : (
              // Disabling 2FA is a security downgrade, so it costs a password
              // re-auth - an unlocked laptop shouldn't be able to strip it off.
              <form
                onSubmit={handleDisable}
                style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}
              >
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Confirm your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ flex: 1, paddingLeft: '16px' }}
                />
                <button
                  type="submit"
                  disabled={busy || !password}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#ef4444',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {busy ? 'Turning off...' : 'Confirm'}
                </button>
              </form>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
