'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { getInvestorProfile, updateInvestorProfile } from '@/lib/investors';

const card = { padding: '22px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '18px', marginBottom: '16px' };
const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '13.5px', color: '#111827', outline: 'none', fontFamily: 'inherit', background: '#fff' };
const label = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

function Field({ label: l, hint, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={label}>{l}</label>
      {children}
      {hint && <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

function ReadOnly({ label: l, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
      <span style={{ minWidth: '110px', color: '#9ca3af', flexShrink: 0 }}>{l}</span>
      <span style={{ color: '#374151', wordBreak: 'break-word' }}>{value || '—'}</span>
    </div>
  );
}

export default function InvestorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getInvestorProfile();
      if (err) { setError(err.message || 'Could not load your profile.'); return; }
      setProfile(data);
      setForm({
        bio: data.bio || '',
        organizationName: data.organizationName || '',
        ticketSize: data.ticketSize || '',
        linkedinUrl: data.linkedinUrl || '',
        websiteUrl: data.websiteUrl || '',
        phone: data.phone || '',
        location: data.location || '',
        investmentFocus: (data.investmentFocus || []).join(', '),
        preferredStages: (data.preferredStages || []).join(', '),
      });
    })();
  }, []);

  const save = async () => {
    setBusy(true); setError(''); setSaved(false);
    const { data, error: err } = await updateInvestorProfile({
      bio: form.bio,
      organizationName: form.organizationName,
      ticketSize: form.ticketSize,
      linkedinUrl: form.linkedinUrl,
      websiteUrl: form.websiteUrl,
      phone: form.phone,
      location: form.location,
      investmentFocus: form.investmentFocus.split(',').map(s => s.trim()).filter(Boolean),
      preferredStages: form.preferredStages.split(',').map(s => s.trim()).filter(Boolean),
    });
    setBusy(false);
    if (err) { setError(err.message || 'Could not save your profile.'); return; }
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
  if (!form) return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>;

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.4px' }}>My Profile</h1>
      <p style={{ margin: '0 0 22px', fontSize: '14.5px', color: '#6b7280' }}>This is what founders see when they browse investors.</p>

      {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', marginBottom: 16, background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 12, color: '#ef4444', fontSize: 13, fontWeight: 500 }}><AlertCircle size={15} /> {error}</div>}
      {saved && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', marginBottom: 16, background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 12, color: '#047857', fontSize: 13, fontWeight: 600 }}><CheckCircle2 size={15} /> Profile saved.</div>}

      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Account</h2>
        <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#9ca3af' }}>Contact an admin to change these.</p>
        <ReadOnly label="Name" value={profile?.fullName} />
        <ReadOnly label="Email" value={profile?.email} />
        <ReadOnly label="Investor Type" value={profile?.investorType} />
      </div>

      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Investor Details</h2>
        <Field label="Bio"><textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></Field>
        <Field label="Organization"><input style={inputStyle} value={form.organizationName} onChange={e => setForm({ ...form, organizationName: e.target.value })} /></Field>
        <Field label="Investment Focus" hint="Comma separated, e.g. FinTech, SaaS"><input style={inputStyle} value={form.investmentFocus} onChange={e => setForm({ ...form, investmentFocus: e.target.value })} /></Field>
        <Field label="Preferred Stages" hint="Comma separated, e.g. Seed, Series A"><input style={inputStyle} value={form.preferredStages} onChange={e => setForm({ ...form, preferredStages: e.target.value })} /></Field>
        <Field label="Typical Ticket Size"><input style={inputStyle} value={form.ticketSize} onChange={e => setForm({ ...form, ticketSize: e.target.value })} /></Field>
        <Field label="Location"><input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Field>
        <Field label="LinkedIn URL"><input style={inputStyle} placeholder="https://" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} /></Field>
        <Field label="Website"><input style={inputStyle} placeholder="https://" value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} /></Field>
        <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>

        <button type="button" onClick={save} disabled={busy}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 24px', borderRadius: '11px', border: 'none', background: busy ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)', color: busy ? '#9ca3af' : '#fff', fontWeight: 700, fontSize: '14px', cursor: busy ? 'default' : 'pointer' }}>
          <Save size={15} /> {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
