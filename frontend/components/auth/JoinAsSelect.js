'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, UserPlus } from 'lucide-react';

/**
 * "Join as…" role picker for the login / signup pages.
 *
 * Config-driven: to add a role later (e.g. Incubator, Corporate), add one line
 * to ROLES below and it appears everywhere this component is used. Each option
 * just points at the right apply flow - role never affects how you *log in*
 * (everyone uses the same /login), it only routes new applicants to the correct
 * application.
 */
const ROLES = [
  { value: '/signup', label: 'Startup / Founder' },
  { value: '/signup?role=mentor', label: 'Mentor' },
  { value: '/signup?role=investor', label: 'Investor' },
];

export default function JoinAsSelect() {
  const router = useRouter();
  const [dest, setDest] = useState('');

  const go = () => {
    if (dest) router.push(dest);
  };

  return (
    // Rendered as a tinted, bordered card so it reads as its own call-to-action.
    // It used to be plain text at the very bottom of the page and people simply
    // never found it.
    <div
      style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
        border: '1.5px solid #fee2e2',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <label
        htmlFor="join-as"
        style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13.5px', fontWeight: 700, color: '#dc2626', marginBottom: '10px' }}
      >
        <UserPlus size={16} /> New here? Join as…
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          id="join-as"
          suppressHydrationWarning
          value={dest}
          onChange={e => setDest(e.target.value)}
          style={{
            flex: 1,
            padding: '11px 14px',
            border: '1.5px solid #fecaca',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: dest ? '#0f172a' : '#64748b',
            background: '#ffffff',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease',
          }}
        >
          <option value="">Select a role…</option>
          {ROLES.map(r => (
            <option key={r.value} value={r.value} style={{ color: '#0f172a', fontWeight: 500 }}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={go}
          disabled={!dest}
          aria-label="Continue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 20px',
            borderRadius: '12px',
            border: 'none',
            background: dest ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : '#f1f5f9',
            color: dest ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: dest ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            boxShadow: dest ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
