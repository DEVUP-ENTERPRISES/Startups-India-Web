'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

const DISMISS_KEY = 'securePhonePromptDismissedAt';
// Re-ask after a week rather than never: a permanent dismissal would leave most
// of the existing accounts without a number forever, which is exactly the hole
// this is meant to close.
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Nudges signed-in users who have no verified mobile number to add one — the
 * backfill path for accounts created before phone verification existed.
 * Renders nothing once the number is verified.
 */
export default function SecurePhonePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return;

      const { data, error } = await getCurrentUser();
      if (cancelled || error || !data?.user) return;
      if (!data.user.phone_verified) setShow(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
        border: '1px solid #fee2e2',
        borderRadius: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: '#fef2f2',
          flexShrink: 0,
        }}
      >
        <ShieldAlert size={20} color="#ef4444" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
          Secure your account
        </h4>
        <p style={{ margin: '2px 0 0', fontSize: '13.5px', color: '#6b7280', lineHeight: 1.5 }}>
          Add and verify your mobile number to turn on two-factor sign-in.
        </p>
      </div>

      <Link
        href="/settings/security"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 18px',
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 700,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Add number <ArrowRight size={15} />
      </Link>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: '4px',
          flexShrink: 0,
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
