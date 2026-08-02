'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PhoneInput from '@/components/ui/PhoneInput';
import {
  User, Mail, Lock, Briefcase, Building2, Camera, X, Check, CheckCircle2,
  Clock, Loader2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { applyAsMentor, uploadMentorPhoto } from '@/lib/mentors';
import '../../styles/mentor-modal-premium.css';

/**
 * Shortened mentor application.
 *
 * Deliberately one screen and ~9 fields: the earlier form asked for experience,
 * LinkedIn and availability up front, which the mentor now fills in on their
 * profile after approval. Everything here is what the public mentor card needs
 * to render (photo, name, role, company, skills) plus login credentials.
 */

// A flat, common set - the grouped-category picker was overkill for a quick
// apply. A mentor can also type their own.
const SUGGESTED_EXPERTISE = [
  'Fundraising', 'Product', 'Growth Marketing', 'Sales', 'SaaS', 'FinTech',
  'AI / ML', 'Operations', 'Strategy', 'Legal', 'Design / UX', 'HR & Hiring',
  'Go-To-Market', 'Engineering', 'Finance', 'Branding',
];

const MAX_EXPERTISE = 6;

export default function MentorRegistrationModal({ onClose }) {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    currentRole: '', company: '', bio: '',
  });
  const [expertise, setExpertise] = useState([]);
  const [customSkill, setCustomSkill] = useState('');

  const [photo, setPhoto] = useState({ url: '', uploading: false, progress: 0 });
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = skill => {
    setExpertise(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : prev.length >= MAX_EXPERTISE ? prev : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !expertise.includes(s) && expertise.length < MAX_EXPERTISE) {
      setExpertise(prev => [...prev, s]);
    }
    setCustomSkill('');
  };

  const handlePhoto = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setPhoto(p => ({ ...p, uploading: true, progress: 0 }));

    const { data, error: err } = await uploadMentorPhoto(file, pct =>
      setPhoto(p => ({ ...p, progress: pct }))
    );

    if (err) {
      setError(err.message || 'Could not upload the photo.');
      setPhoto({ url: '', uploading: false, progress: 0 });
      return;
    }
    setPhoto({ url: data.fileUrl, uploading: false, progress: 100 });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setError('Please fill in your name, email, password and phone.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!form.currentRole.trim() || !form.company.trim()) {
      setError('Please add your current role and company.');
      return;
    }
    if (expertise.length === 0) {
      setError('Please add at least one area of expertise.');
      return;
    }
    if (!form.bio.trim()) {
      setError('Please add a short bio.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }
    if (photo.uploading) {
      setError('Please wait for your photo to finish uploading.');
      return;
    }
    // A photo is mandatory - the admin reviews it before approving.
    if (!photo.url) {
      setError('Please upload a profile photo.');
      return;
    }

    setLoading(true);
    const { error: err } = await applyAsMentor({
      ...form,
      expertise,
      profileImage: photo.url || null,
    });
    setLoading(false);

    if (err) {
      setError(err.message || 'Could not submit your application.');
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/'), 6000);
  };

  // ── Success ──
  if (success) {
    return (
      <div className="modal-overlay mentor-modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="modal-container"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: 460, textAlign: 'center', padding: '48px 32px' }}
        >
          <div style={{ color: '#10b981', marginBottom: 18 }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
            Thank you, {form.fullName.split(' ')[0]}!
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, margin: '0 0 20px' }}>
            Your mentor application is in. Our team will review it, and you&apos;ll get an email once
            it&apos;s approved - with how to sign in to your mentor dashboard.
          </p>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 100, background: '#fffbeb', color: '#b45309',
              fontSize: 13, fontWeight: 700,
            }}
          >
            <Clock size={15} /> Status: Under review
          </div>
        </motion.div>
      </div>
    );
  }

  const inputWrap = { position: 'relative', display: 'flex', alignItems: 'center' };
  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #e5e7eb',
    borderRadius: 12, fontSize: 14, color: '#111827', outline: 'none', background: '#fff',
    fontFamily: 'inherit',
  };
  const iconStyle = { position: 'absolute', left: 14, color: '#9ca3af', pointerEvents: 'none' };
  const label = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };

  return (
    <div className="modal-overlay mentor-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-container mentor-modal-container"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 560 }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a0505, #2d0808)',
            padding: '28px 32px', textAlign: 'center', position: 'relative',
            borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%',
              border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff' }}>Become a Mentor</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            A quick application - under 2 minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px 32px', maxHeight: '65vh', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', marginBottom: 18,
                background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10,
                color: '#ef4444', fontSize: 13, fontWeight: 500,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div
              onClick={() => !photo.uploading && fileRef.current?.click()}
              role="button"
              tabIndex={0}
              style={{
                width: 72, height: 72, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                background: photo.url ? `url(${photo.url}) center/cover` : '#f3f4f6',
                border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center',
                justifyContent: 'center', position: 'relative', overflow: 'hidden',
              }}
            >
              {photo.uploading ? (
                <Loader2 size={22} color="#ef4444" className="mspin" />
              ) : !photo.url ? (
                <Camera size={22} color="#9ca3af" />
              ) : null}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>
                Profile photo <span style={{ color: '#e63946' }}>*</span>
              </p>
              <p style={{ margin: '2px 0 6px', fontSize: 12.5, color: '#9ca3af' }}>
                Required · JPG, PNG or WebP. Shown on your public mentor card.
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={photo.uploading}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                  background: '#fff', fontSize: 12.5, fontWeight: 700, color: '#374151', cursor: 'pointer',
                }}
              >
                {photo.uploading ? `Uploading ${photo.progress}%` : photo.url ? 'Change photo' : 'Upload photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePhoto} />
            </div>
          </div>

          {/* Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={label}>Full Name *</label>
              <div style={inputWrap}>
                <User size={16} style={iconStyle} />
                <input style={inputStyle} placeholder="Dr. Priya Sharma" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={label}>Email *</label>
              <div style={inputWrap}>
                <Mail size={16} style={iconStyle} />
                <input type="email" style={inputStyle} placeholder="priya@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Password + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={label}>Password *</label>
              <div style={inputWrap}>
                <Lock size={16} style={iconStyle} />
                <input type="password" style={inputStyle} placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <p style={{ margin: '5px 0 0', fontSize: 11.5, color: '#9ca3af' }}>You&apos;ll sign in with this once approved.</p>
            </div>
            <div>
              <label style={label}>Phone *</label>
              <PhoneInput value={form.phone} onChange={v => set('phone', v)} />
            </div>
          </div>

          {/* Role + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={label}>Current Role *</label>
              <div style={inputWrap}>
                <Briefcase size={16} style={iconStyle} />
                <input style={inputStyle} placeholder="e.g. CTO, Founder" value={form.currentRole} onChange={e => set('currentRole', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={label}>Company *</label>
              <div style={inputWrap}>
                <Building2 size={16} style={iconStyle} />
                <input style={inputStyle} placeholder="e.g. Acme Inc." value={form.company} onChange={e => set('company', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Expertise * <span style={{ color: '#9ca3af', fontWeight: 400 }}>(up to {MAX_EXPERTISE})</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {SUGGESTED_EXPERTISE.map(skill => {
                const on = expertise.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '7px 13px', borderRadius: 100, cursor: 'pointer',
                      border: `1.5px solid ${on ? '#ef4444' : '#e5e7eb'}`,
                      background: on ? '#fef2f2' : '#fff',
                      color: on ? '#ef4444' : '#6b7280', fontSize: 12.5, fontWeight: 600,
                    }}
                  >
                    {on && <Check size={12} />} {skill}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputStyle, paddingLeft: 14 }}
                placeholder="Add your own…"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
              />
              <button type="button" onClick={addCustomSkill} style={{ padding: '0 18px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Add</button>
            </div>
            {expertise.filter(s => !SUGGESTED_EXPERTISE.includes(s)).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {expertise.filter(s => !SUGGESTED_EXPERTISE.includes(s)).map(s => (
                  <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 100, background: '#fef2f2', color: '#ef4444', fontSize: 12.5, fontWeight: 600 }}>
                    {s}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleSkill(s)} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 18 }}>
            <label style={label}>Short Bio *</label>
            <textarea
              rows={3}
              style={{ ...inputStyle, paddingLeft: 14, resize: 'vertical' }}
              placeholder="A couple of lines on how you help founders."
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
            />
          </div>

          {/* Terms */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: '#ef4444' }} />
            <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              I agree to the Terms &amp; Conditions and confirm the information provided is accurate.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || photo.uploading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: loading || photo.uploading ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
              color: loading || photo.uploading ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: 15, cursor: loading || photo.uploading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Submitting…' : 'Submit Application'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>

      <style jsx>{`
        :global(.mspin) { animation: mspin 0.8s linear infinite; }
        @keyframes mspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
