'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { getMentorProfile, updateMentorProfile, uploadMentorPhoto } from '@/lib/mentors';

/**
 * Mentor profile — fully editable by the mentor: photo, professional details,
 * bio, expertise, links. Only name + email stay read-only (email is the login
 * identity), because those live on the User account, not just this profile.
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
  const [photo, setPhoto] = useState({ url: '', uploading: false, progress: 0 });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getMentorProfile();
      if (err) {
        setError(err.message || 'Could not load your profile.');
        return;
      }
      setProfile(data);
      setPhoto({ url: data.profileImage || '', uploading: false, progress: 0 });
      setForm({
        currentRole: data.currentRole || '',
        company: data.company || '',
        experience: data.experience || '',
        bio: data.bio || '',
        availability: data.availability || '',
        linkedinUrl: data.linkedinUrl || '',
        phone: data.phone || '',
        achievements: data.achievements || '',
        expertise: (data.expertise || []).join(', '),
        previousCompanies: (data.previousCompanies || []).join(', '),
        industry: data.industry || '',
        startupsMentored: data.startupsMentored || '',
        websiteUrl: data.websiteUrl || '',
      });
    })();
  }, []);

  const handlePhoto = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setPhoto(p => ({ ...p, uploading: true, progress: 0 }));
    const { data, error: err } = await uploadMentorPhoto(file, pct => setPhoto(p => ({ ...p, progress: pct })));
    if (err) {
      setError(err.message || 'Could not upload the photo.');
      setPhoto(p => ({ ...p, uploading: false }));
      return;
    }
    // Persist immediately so the new photo sticks even if they don't hit Save.
    setPhoto({ url: data.fileUrl, uploading: false, progress: 100 });
    await updateMentorProfile({ profileImage: data.fileUrl });
    setSaved(true);
  };

  const save = async () => {
    setBusy(true);
    setError('');
    setSaved(false);

    const { data, error: err } = await updateMentorProfile({
      currentRole: form.currentRole,
      company: form.company,
      experience: form.experience,
      bio: form.bio,
      availability: form.availability,
      linkedinUrl: form.linkedinUrl,
      phone: form.phone,
      achievements: form.achievements,
      // Comma-separated in the UI, arrays in the model.
      expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
      previousCompanies: form.previousCompanies.split(',').map(s => s.trim()).filter(Boolean),
      industry: form.industry,
      startupsMentored: form.startupsMentored,
      websiteUrl: form.websiteUrl,
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

      {/* Photo + account (name/email read-only — they live on the login account) */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
          <div
            onClick={() => !photo.uploading && fileRef.current?.click()}
            role="button"
            tabIndex={0}
            style={{ width: 76, height: 76, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', background: '#f3f4f6', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}
          >
            {photo.uploading ? (
              <Loader2 size={22} color="#ef4444" className="mp-spin" />
            ) : photo.url ? (
              <img src={photo.url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={22} color="#9ca3af" />
            )}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>Profile photo</p>
            <p style={{ margin: '2px 0 8px', fontSize: 12.5, color: '#9ca3af' }}>Shown on your public mentor card.</p>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={photo.uploading}
              style={{ padding: '7px 15px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 12.5, fontWeight: 700, color: '#374151', cursor: 'pointer' }}>
              {photo.uploading ? `Uploading ${photo.progress}%` : photo.url ? 'Change photo' : 'Upload photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePhoto} />
          </div>
        </div>
        <ReadOnly label="Name" value={profile?.fullName} />
        <ReadOnly label="Email" value={profile?.email} />
        <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#9ca3af' }}>Name &amp; email are your login identity — contact an admin to change them.</p>
      </div>

      {/* Editable */}
      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
          Mentor Details
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Current Role">
            <input value={form.currentRole} onChange={e => setForm({ ...form, currentRole: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Company">
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} />
          </Field>
        </div>

        <Field label="Experience" hint="e.g. 10+ years">
          <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
        </Field>

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

        <Field label="Industry">
          <input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} style={inputStyle} />
        </Field>

        <Field label="Startups Mentored">
          <input value={form.startupsMentored} onChange={e => setForm({ ...form, startupsMentored: e.target.value })} style={inputStyle} />
        </Field>

        <Field label="Personal Website">
          <input value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://" style={inputStyle} />
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
      <style>{`.mp-spin{animation:mpspin .8s linear infinite}@keyframes mpspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
