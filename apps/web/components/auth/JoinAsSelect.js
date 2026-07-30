'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, UserPlus } from 'lucide-react';

/**
 * "Join as…" role picker for the login / signup pages.
 *
 * Config-driven: to add a role later (e.g. Incubator, Corporate), add one line
 * to ROLES below and it appears everywhere this component is used. Each option
 * just points at the right apply flow — role never affects how you *log in*
 * (everyone uses the same /login), it only routes new applicants to the correct
 * application.
 */
const ROLES = [
  { value: '/signup', label: 'Startup Founder' },
  { value: '/mentors#become-mentor', label: 'Mentor' },
  { value: '/investors#become-investor', label: 'Investor' },
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
        background: 'linear-gradient(135deg,#fff5f5 0%,#ffffff 100%)',
        border: '1.5px solid #fecaca',
        borderRadius: '14px',
      }}
    >
      <label
        htmlFor="join-as"
        style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13.5px', fontWeight: 700, color: '#b91c1c', marginBottom: '10px' }}
      >
        <UserPlus size={15} /> New here? Join as…
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          id="join-as"
          suppressHydrationWarning
          value={dest}
          onChange={e => setDest(e.target.value)}
          style={{
            flex: 1,
            padding: '11px 13px',
            border: '1.5px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            color: dest ? '#111827' : '#9ca3af',
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="">Select a role…</option>
          {ROLES.map(r => (
            <option key={r.value} value={r.value} style={{ color: '#111827' }}>
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
            gap: '5px',
            padding: '0 18px',
            borderRadius: '10px',
            border: 'none',
            background: dest ? 'linear-gradient(135deg,#e63946,#ff6b6b)' : '#f3f4f6',
            color: dest ? '#fff' : '#9ca3af',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: dest ? 'pointer' : 'default',
            whiteSpace: 'nowrap',
          }}
        >
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
