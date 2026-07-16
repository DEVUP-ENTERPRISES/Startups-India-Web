'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMentorProfile, updateMentorProfile } from '@/lib/mentors';

/**
 * Mentor profile.
 *
 * Only renders inputs for the fields updateMentorProfile actually whitelists
 * (bio, availability, linkedinUrl, phone, achievements, expertise,
 * previousCompanies). Name/company/role are shown read-only because the API
 * deliberately refuses to update them — offering an input that silently
 * discards the edit would be worse than showing none.
 */

const card = {
  padding: '22px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '18px',
  marginBottom: '16px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 13px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '13.5px',
  color: '#111827',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
};

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
      <span style={{ minWidth: '110px', color: '#9ca3af', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#374151', wordBreak: 'break-word' }}>{value || '—'}</span>
    </div>
  );
}

export default function MentorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getMentorProfile();
      if (err) {
        setError(err.message || 'Could not load your profile.');
        return;
      }
      setProfile(data);
      setForm({
        bio: data.bio || '',
        availability: data.availability || '',
        linkedinUrl: data.linkedinUrl || '',
        phone: data.phone || '',
        achievements: data.achievements || '',
        expertise: (data.expertise || []).join(', '),
        previousCompanies: (data.previousCompanies || []).join(', '),
      });
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    setError('');
    setSaved(false);

    const { data, error: err } = await updateMentorProfile({
      bio: form.bio,
      availability: form.availability,
      linkedinUrl: form.linkedinUrl,
      phone: form.phone,
      achievements: form.achievements,
      // Comma-separated in the UI, arrays in the model.
      expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
      previousCompanies: form.previousCompanies.split(',').map(s => s.trim()).filter(Boolean),
    });

    setBusy(false);
    if (err) {
      setError(err.message || 'Could not save your profile.');
      return;
    }
    setProfile(data);
    setSaved(true);
  };

  if (error && !profile) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <AlertCircle size={38} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: '#6b7280', fontSize: '14.5px' }}>{error}</p>
      </div>
    );
  }

  if (!form) {
    return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>;
  }

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
        My Profile
      </h1>
      <p style={{ margin: '0 0 22px', fontSize: '14.5px', color: '#6b7280' }}>
        This is what founders see when they&apos;re matched with you.
      </p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}
      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', color: '#047857', fontSize: '13px', fontWeight: 600 }}>
          <CheckCircle2 size={15} /> Profile saved.
        </div>
      )}

      {/* Locked fields — set at application time, not editable here. */}
      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Account</h2>
        <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#9ca3af' }}>
          Contact an admin to change these.
        </p>
        <ReadOnly label="Name" value={profile?.fullName} />
        <ReadOnly label="Email" value={profile?.email} />
        <ReadOnly label="Current Role" value={profile?.currentRole} />
        <ReadOnly label="Company" value={profile?.company} />
        <ReadOnly label="Experience" value={profile?.experience} />
      </div>

      {/* Editable */}
      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
          Mentor Details
        </h2>

        <Field label="Bio">
          <textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>

        <Field label="Availability" hint="e.g. Weekends, 2 hours/week — founders see this before booking.">
          <input value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} style={inputStyle} />
        </Field>

        <Field label="Expertise" hint="Comma separated, e.g. SaaS, Fundraising, GTM">
          <input value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} style={inputStyle} />
        </Field>

        <Field label="Previous Companies" hint="Comma separated">
          <input value={form.previousCompanies} onChange={e => setForm({ ...form, previousCompanies: e.target.value })} style={inputStyle} />
        </Field>

        <Field label="Achievements">
          <textarea rows={3} value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>

        <Field label="LinkedIn URL">
          <input value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://" style={inputStyle} />
        </Field>

        <Field label="Phone">
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        </Field>

        <button
          type="button"
          onClick={save}
          disabled={busy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 24px', borderRadius: '11px', border: 'none',
            background: busy ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
            color: busy ? '#9ca3af' : '#fff',
            fontWeight: 700, fontSize: '14px',
            cursor: busy ? 'default' : 'pointer',
          }}
        >
          <Save size={15} /> {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
