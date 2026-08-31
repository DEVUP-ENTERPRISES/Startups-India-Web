'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getGrantSettings, updateGrantSettings, adminUrl } from '@/lib/grantsAdmin';
import { formatMoney } from '@/lib/grants';

// Format a stored instant into a `datetime-local` value (YYYY-MM-DDTHH:mm) in
// LOCAL time. toISOString() would render in UTC and shift the wall-clock (and can
// roll the date back a day for IST times near midnight), so we build it from
// local getters instead.
function toLocalDatetimeInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.valueOf())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Grant Settings.
 *
 * The form is generated from the SCHEMA the backend returns - there is no
 * hardcoded list of fields here. Add a tunable in grant.settings.js and it shows
 * up in this UI on the next load, correctly typed, with no frontend change.
 */

const GROUPS = [
  { title: 'Availability', match: k => k.includes('.enabled') || k.includes('revisions') },
  { title: 'Fee & Tax', match: k => k.startsWith('grant.evaluation.') && !k.includes('criteria') && !k.includes('maxScore') && !k.includes('enabled') },
  { title: 'Later-Phase Pricing (Pre-Incubation & Incubation)', match: k => k === 'grant.preIncubation.fee' || k === 'grant.incubation.fee' },
  { title: 'Capacity & Deadline', match: k => k.startsWith('grant.applications.') && !k.includes('enabled') },
  { title: 'Uploads', match: k => k.startsWith('grant.upload.') },
  { title: 'Content & Labels', match: k => k.startsWith('grant.ui.') },
  { title: 'Taxonomy', match: k => k === 'grant.stages' || k === 'grant.categories' },
  { title: 'Evaluation Scoring', match: k => k.includes('criteria') || k.includes('maxScore') },
];

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '13.5px',
  color: '#111827',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
};

function humanise(key) {
  return key
    .replace(/^grant\./, '')
    .replace(/\./g, ' → ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function GrantSettingsPage() {
  const [schema, setSchema] = useState(null);
  const [values, setValues] = useState({});
  const [dirty, setDirty] = useState({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getGrantSettings();
      if (err) {
        setError(err.message || 'Could not load settings.');
        return;
      }
      setSchema(data.schema);
      setValues(data.values);
    })();
  }, []);

  const set = (key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    setDirty(d => ({ ...d, [key]: true }));
    setSaved(false);
  };

  const save = async () => {
    const patch = Object.fromEntries(
      Object.keys(dirty).filter(k => dirty[k]).map(k => [k, values[k]])
    );
    if (Object.keys(patch).length === 0) return;

    setBusy(true);
    setError('');
    const { data, error: err } = await updateGrantSettings(patch);
    setBusy(false);

    if (err) {
      // The backend validates and coerces every key; a bad value is rejected
      // rather than written, so the fee can never end up in a broken state.
      setError(err.message || 'Could not save settings.');
      return;
    }
    setValues(data.values);
    setDirty({});
    setSaved(true);
  };

  if (!schema) {
    return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading settings…</div>;
  }

  const renderField = key => {
    const spec = schema[key];
    const value = values[key];

    if (spec.type === 'boolean') {
      return (
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={e => set(key, e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
          />
          <span style={{ fontSize: '13.5px', color: '#374151' }}>
            {value ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );
    }

    if (spec.type === 'stringArray') {
      return (
        <>
          <textarea
            rows={3}
            value={(value || []).join('\n')}
            onChange={e => set(key, e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'ui-monospace, monospace', fontSize: '12.5px' }}
          />
          <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>One per line.</p>
        </>
      );
    }

    if (spec.type === 'integer' || spec.type === 'number') {
      const isMoney = key.endsWith('.fee');

      // Fees are entered in plain rupees (₹) - no paise arithmetic for the admin.
      // We convert to the paise the backend stores on the way in and out, so the
      // admin never sees "149900" again.
      if (isMoney) {
        const rupeeVal =
          value === '' || value === null || value === undefined ? '' : Number(value) / 100;
        return (
          <>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700, fontSize: '14px' }}>
                ₹
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={rupeeVal}
                placeholder="e.g. 1499"
                onChange={e =>
                  set(key, e.target.value === '' ? '' : Math.round(Number(e.target.value) * 100))
                }
                style={{ ...inputStyle, paddingLeft: '26px' }}
              />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#6b7280' }}>
              {(Number(value) || 0) > 0
                ? <>Founders in this phase are charged <strong>{formatMoney(Number(value))}</strong>.</>
                : 'Set to 0 = not charged (phase shown as “Coming soon”).'}
            </p>
          </>
        );
      }

      return (
        <input
          type="number"
          value={value ?? ''}
          min={spec.min}
          max={spec.max}
          onChange={e => set(key, e.target.value === '' ? '' : Number(e.target.value))}
          style={inputStyle}
        />
      );
    }

    const isLong = key.includes('description') || key.includes('termsText');
    return isLong ? (
      <textarea
        rows={3}
        value={value ?? ''}
        onChange={e => set(key, e.target.value)}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    ) : (
      <input
        type={key.includes('deadline') ? 'datetime-local' : 'text'}
        value={
          key.includes('deadline') && value
            ? toLocalDatetimeInput(value)
            : value ?? ''
        }
        onChange={e =>
          set(
            key,
            key.includes('deadline') && e.target.value
              ? new Date(e.target.value).toISOString()
              : e.target.value
          )
        }
        style={inputStyle}
      />
    );
  };

  const allKeys = Object.keys(schema);
  const grouped = GROUPS.map(g => ({ ...g, keys: allKeys.filter(g.match) }));
  const claimed = new Set(grouped.flatMap(g => g.keys));
  const leftovers = allKeys.filter(k => !claimed.has(k));
  if (leftovers.length) grouped.push({ title: 'Other', keys: leftovers });

  const hasChanges = Object.values(dirty).some(Boolean);

  return (
    <div style={{ padding: '28px 28px 100px', maxWidth: 860, margin: '0 auto' }}>
      <Link
        href={adminUrl('/grants')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}
      >
        <ArrowLeft size={15} /> Grant Applications
      </Link>

      <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 6px' }}>
        Startup Grant Settings
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>
        Everything here takes effect immediately - no deployment required.
      </p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', color: '#047857', fontSize: '13px', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> Settings saved and live.
        </div>
      )}

      {grouped.filter(g => g.keys.length > 0).map(group => (
        <div
          key={group.title}
          style={{ padding: '22px', marginBottom: '16px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '18px' }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 18px' }}>
            {group.title}
          </h2>

          {group.keys.map(key => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                {humanise(key)}
                {dirty[key] && (
                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>
                    unsaved
                  </span>
                )}
              </label>
              {renderField(key)}
            </div>
          ))}
        </div>
      ))}

      {/* Sticky save bar */}
      <div
        style={{
          position: 'sticky',
          bottom: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={save}
          disabled={busy || !hasChanges}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '13px 26px',
            borderRadius: '12px',
            border: 'none',
            background: hasChanges ? 'linear-gradient(135deg,#e63946,#ff6b6b)' : '#f3f4f6',
            color: hasChanges ? '#fff' : '#9ca3af',
            fontWeight: 700,
            fontSize: '14px',
            cursor: hasChanges ? 'pointer' : 'default',
            boxShadow: hasChanges ? '0 8px 24px rgba(230,57,70,0.3)' : 'none',
          }}
        >
          <Save size={16} />
          {busy ? 'Saving…' : hasChanges ? 'Save changes' : 'No changes'}
        </button>
      </div>
    </div>
  );
}
