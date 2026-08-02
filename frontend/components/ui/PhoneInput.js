'use client';

import { useState, useRef, useEffect } from 'react';
import { COUNTRY_CODES, validatePhone } from '@/lib/validation';

export default function PhoneInput({
  value = '',
  countryCode = '+91',
  onChange,           // (digits, countryCode) => void
  onError,           // (errorMsg | null) => void
  required = false,
  className = '',
  inputStyle = {},
  darkMode = false,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0]
  );
  const [error, setError] = useState('');
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (cc) => {
    setSelected(cc);
    setOpen(false);
    // Re-validate with new country
    const err = required || value ? validatePhone(value, cc.code) : null;
    setError(err || '');
    onError?.(err);
    onChange?.(value, cc.code);
  };

  const handleChange = (e) => {
    // Only allow digits, spaces, dashes
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    const digits = raw.replace(/\D/g, '');
    // Enforce max length based on country
    if (digits.length > selected.digits) return;
    onChange?.(raw, selected.code);
    if (error) {
      const err = validatePhone(raw, selected.code);
      setError(err || '');
      onError?.(err);
    }
  };

  const handleBlur = () => {
    if (!required && !value) return;
    const err = validatePhone(value, selected.code);
    setError(err || '');
    onError?.(err);
  };

  const bg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const border = darkMode ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid #e5e7eb';
  const borderError = '1.5px solid #ef4444';
  const color = darkMode ? '#fff' : '#111827';

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: bg,
          border: error ? borderError : border,
          borderRadius: 10,
          overflow: 'visible',
          transition: 'border-color 0.2s',
          ...inputStyle,
        }}
      >
        {/* Country code picker */}
        <div ref={dropRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '0 10px 0 12px',
              background: 'transparent',
              border: 'none',
              borderRight: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
              cursor: 'pointer',
              height: '44px',
              color: color,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{selected.flag}</span>
            <span style={{ opacity: 0.7 }}>{selected.code}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5, marginLeft: 2 }}>
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {open && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              zIndex: 99999,
              background: darkMode ? '#1a1a2e' : '#fff',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              minWidth: 220,
              maxHeight: 260,
              overflowY: 'auto',
              padding: '6px 0',
            }}>
              {COUNTRY_CODES.map((cc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(cc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 16px',
                    background: selected.country === cc.country ? (darkMode ? 'rgba(229,57,53,0.12)' : '#fff5f5') : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: color,
                    fontSize: 13,
                    fontWeight: selected.country === cc.country ? 700 : 400,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = selected.country === cc.country ? (darkMode ? 'rgba(229,57,53,0.12)' : '#fff5f5') : 'transparent'}
                >
                  <span style={{ fontSize: 18 }}>{cc.flag}</span>
                  <span style={{ flex: 1, opacity: 0.8 }}>{cc.name}</span>
                  <span style={{ opacity: 0.5, fontWeight: 600 }}>{cc.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          placeholder={`${selected.digits}-digit number`}
          style={{
            flex: 1,
            padding: '0 14px',
            height: '44px',
            border: 'none',
            background: 'transparent',
            color: color,
            fontSize: 14,
            fontWeight: 500,
            outline: 'none',
            minWidth: 0,
          }}
        />
      </div>

      {error && (
        <p style={{
          fontSize: 11.5,
          color: '#ef4444',
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
