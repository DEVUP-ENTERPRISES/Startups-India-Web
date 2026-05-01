'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';
import { useDashboard } from '@/contexts/DashboardProvider';

/* ─────────────────────────────────────────────────────────
   API HELPER  — authenticated calls to Express backend
───────────────────────────────────────────────────────── */
import { apiGet, apiPatch, apiDelete } from '@/lib/api';

/* ─────────────────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);
  const dismiss = useCallback(id => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, show, dismiss };
}

function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SHARED UI ATOMS
───────────────────────────────────────────────────────── */
function Toggle({ enabled, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`stg-toggle ${enabled ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
    >
      <span className="stg-toggle-knob" />
    </button>
  );
}

function FieldGroup({ label, required, hint, children }) {
  return (
    <div className="stg-field">
      {label && (
        <label className="stg-label">
          {label}
          {required && <span className="stg-required"> *</span>}
        </label>
      )}
      {children}
      {hint && <p className="stg-hint">{hint}</p>}
    </div>
  );
}

function Card({ title, subtitle, children, danger = false }) {
  return (
    <div className={`stg-card ${danger ? 'stg-card-danger' : ''}`}>
      {title && (
        <div className="stg-card-head">
          <h3 className="stg-card-title">{title}</h3>
          {subtitle && <p className="stg-card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];

  if (!password) return null;
  return (
    <div className="stg-pw-strength">
      <div className="stg-pw-bars">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className="stg-pw-bar"
            style={{ background: n <= score ? colors[score] : '#e2e8f0' }}
          />
        ))}
      </div>
      <span className="stg-pw-label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <div className="stg-loader">
      <div className="stg-spinner" />
    </div>
  );
}

function SaveBar({ dirty, saving, onReset, onSave }) {
  if (!dirty) return null;
  return (
    <div className="stg-savebar">
      <span className="stg-savebar-msg">You have unsaved changes</span>
      <div className="stg-savebar-actions">
        <button className="stg-btn stg-btn-ghost" onClick={onReset} disabled={saving}>
          Discard
        </button>
        <button className="stg-btn stg-btn-primary" onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <span className="stg-btn-spinner" />
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROFILE TAB
───────────────────────────────────────────────────────── */
function ProfileTab({ toast }) {
  const { refresh } = useDashboard();
  const empty = {
    fullName: '', headline: '', missionStatement: '', bio: '',
    location: '', phone: '', timezone: 'IST (UTC+5:30)',
    socialLinks: { linkedin: '', twitter: '', github: '', website: '' },
  };
  const [form, setForm] = useState(empty);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet('/api/v1/settings/profile').then(res => {
      if (!res.error) {
        const d = res.data;
        const formatted = {
          fullName: d.fullName || '',
          headline: d.headline || '',
          missionStatement: d.missionStatement || '',
          bio: d.bio || '',
          location: d.location || '',
          phone: d.phone || '',
          timezone: d.timezone || 'IST (UTC+5:30)',
          socialLinks: {
            linkedin: d.socialLinks?.linkedin || '',
            twitter: d.socialLinks?.twitter || '',
            github: d.socialLinks?.github || '',
            website: d.socialLinks?.website || '',
          },
        };
        setForm(formatted);
        setInitial(formatted);
      }
    }).finally(() => setLoading(false));
  }, []);

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const social = (key, val) =>
    setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const dirty = initial && JSON.stringify(form) !== JSON.stringify(initial);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await apiPatch('/api/v1/settings/profile', form);
    setSaving(false);
    if (!error) {
      setInitial({ ...form });
      if (refresh) await refresh();
      toast('Profile updated successfully', 'success');
    } else {
      toast(error.message || 'Failed to update profile', 'error');
    }
  };

  const initials = form.fullName
    ? form.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (loading) return <Spinner />;

  return (
    <div className="stg-tab-body">
      <div className="stg-tab-header">
        <h2 className="stg-tab-title">Profile &amp; Identity</h2>
        <p className="stg-tab-subtitle">Manage your public profile and professional presence.</p>
      </div>

      {/* ── Avatar + Core info ── */}
      <Card title="Profile Information">
        <div className="stg-avatar-row">
          <div className="stg-avatar-wrap">
            <div className="stg-avatar">{initials}</div>
            <div className="stg-avatar-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>
          <div className="stg-avatar-meta">
            <p className="stg-avatar-name">{form.fullName || 'Your Name'}</p>
            <p className="stg-avatar-tagline">{form.headline || 'Add a headline below'}</p>
            <p className="stg-avatar-note">Avatar uses your initials — photo upload coming soon</p>
          </div>
        </div>

        <div className="stg-grid-2">
          <FieldGroup label="Full Name" required>
            <input
              className="stg-input"
              value={form.fullName}
              onChange={e => field('fullName', e.target.value)}
              placeholder="Jane Doe"
            />
          </FieldGroup>
          <FieldGroup label="Headline">
            <input
              className="stg-input"
              value={form.headline}
              onChange={e => field('headline', e.target.value)}
              placeholder="Founder @ Startup India"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Mission Statement">
          <input
            className="stg-input"
            value={form.missionStatement}
            onChange={e => field('missionStatement', e.target.value)}
            placeholder="Your core professional objective…"
          />
        </FieldGroup>

        <FieldGroup label="Bio" hint={`${form.bio.length} / 300 characters`}>
          <textarea
            className="stg-input stg-textarea"
            rows={3}
            maxLength={300}
            value={form.bio}
            onChange={e => field('bio', e.target.value)}
            placeholder="Tell the founder community about yourself…"
            style={{ borderColor: dirty ? '#7A1F2B' : '#e5e7eb' }}
          />
        </FieldGroup>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="stg-btn stg-btn-primary" 
            onClick={handleSave} 
            disabled={saving || !dirty}
            style={{ minWidth: '160px' }}
          >
            {saving ? 'Updating…' : 'Update Profile'}
          </button>
        </div>
      </Card>

      {/* ── Contact details ── */}
      <Card title="Contact &amp; Location">
        <div className="stg-grid-3">
          <FieldGroup label="Location">
            <div className="stg-input-icon">
              <Icon name="mapPin" size={15} />
              <input
                className="stg-input"
                value={form.location}
                onChange={e => field('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </FieldGroup>
          <FieldGroup label="Timezone">
            <div className="stg-input-icon">
              <Icon name="clock" size={15} />
              <select
                className="stg-input"
                value={form.timezone}
                onChange={e => field('timezone', e.target.value)}
              >
                <option>IST (UTC+5:30)</option>
                <option>EST (UTC-5:00)</option>
                <option>CST (UTC-6:00)</option>
                <option>PST (UTC-8:00)</option>
                <option>GMT (UTC+0:00)</option>
                <option>CET (UTC+1:00)</option>
                <option>JST (UTC+9:00)</option>
                <option>AEST (UTC+10:00)</option>
              </select>
            </div>
          </FieldGroup>
          <FieldGroup label="Phone">
            <div className="stg-input-icon">
              <Icon name="phone" size={15} />
              <input
                className="stg-input"
                value={form.phone}
                onChange={e => field('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </FieldGroup>
        </div>
      </Card>

      {/* ── Social links ── */}
      <Card title="Social Links">
        <div className="stg-links-grid">
          {[
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile', icon: 'linkedin' },
            { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle', icon: 'twitter' },
            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername', icon: 'github' },
            { key: 'website', label: 'Personal Website', placeholder: 'https://yourwebsite.com', icon: 'globe' },
          ].map(({ key, label, placeholder, icon }) => (
            <FieldGroup key={key} label={label}>
              <div className="stg-input-icon">
                <Icon name={icon} size={15} />
                <input
                  className="stg-input"
                  type="url"
                  value={form.socialLinks[key]}
                  onChange={e => social(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            </FieldGroup>
          ))}
        </div>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onReset={() => setForm(initial)} onSave={handleSave} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ACCOUNT TAB
───────────────────────────────────────────────────────── */
function AccountTab({ toast }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    apiGet('/api/v1/settings/profile').then(res => {
      if (!res.error) setEmail(res.data.email || '');
    }).finally(() => setLoading(false));
  }, []);

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (!pw.current || !pw.next) return toast('Please fill in all fields', 'error');
    if (pw.next !== pw.confirm) return toast('New passwords do not match', 'error');
    if (pw.next.length < 8) return toast('Password must be at least 8 characters', 'error');
    setPwSaving(true);
    const { error } = await apiPatch('/api/v1/settings/account/password', { 
      currentPassword: pw.current, 
      newPassword: pw.next 
    });
    setPwSaving(false);
    if (!error) {
      setPw({ current: '', next: '', confirm: '' });
      toast('Password updated successfully', 'success');
    } else {
      toast(error.message || 'Failed to update password', 'error');
    }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    const { error } = await apiDelete('/api/v1/settings/account');
    setDeactivating(false);
    if (!error) {
      localStorage.clear();
      window.location.replace('/login');
    } else {
      toast(error.message || 'Failed to deactivate account', 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="stg-tab-body">
      <div className="stg-tab-header">
        <h2 className="stg-tab-title">Account &amp; Security</h2>
        <p className="stg-tab-subtitle">Manage your login credentials and account status.</p>
      </div>

      {/* ── Email ── */}
      <Card title="Email Address" subtitle="Your verified login email. Contact support to change it.">
        <div className="stg-email-row">
          <div className="stg-email-icon">
            <Icon name="mail" size={18} />
          </div>
          <div className="stg-email-text">
            <span className="stg-email-value">{email || '—'}</span>
            <span className="stg-verified-pill">✓ Verified</span>
          </div>
        </div>
      </Card>

      {/* ── Password ── */}
      <Card title="Change Password" subtitle="Use a strong password you don't use elsewhere.">
        <form onSubmit={handlePasswordSubmit}>
          <div className="stg-grid-3">
            <FieldGroup label="Current Password">
              <div className="stg-input-icon stg-input-suffix">
                <Icon name="lock" size={15} />
                <input
                  className="stg-input"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={pw.current}
                  onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                />
                <button type="button" className="stg-eye-btn" onClick={() => setShowCurrent(v => !v)}>
                  <Icon name={showCurrent ? 'eyeOff' : 'eye'} size={14} />
                </button>
              </div>
            </FieldGroup>
            <FieldGroup label="New Password">
              <div className="stg-input-icon stg-input-suffix">
                <Icon name="lock" size={15} />
                <input
                  className="stg-input"
                  type={showNext ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={pw.next}
                  onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                />
                <button type="button" className="stg-eye-btn" onClick={() => setShowNext(v => !v)}>
                  <Icon name={showNext ? 'eyeOff' : 'eye'} size={14} />
                </button>
              </div>
              <PasswordStrength password={pw.next} />
            </FieldGroup>
            <FieldGroup label="Confirm New Password">
              <div className="stg-input-icon">
                <Icon name="lock" size={15} />
                <input
                  className="stg-input"
                  type="password"
                  placeholder="••••••••"
                  value={pw.confirm}
                  onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                />
              </div>
              {pw.confirm && pw.next !== pw.confirm && (
                <p className="stg-field-error">Passwords do not match</p>
              )}
            </FieldGroup>
          </div>
          <div className="stg-pw-rules">
            {[
              { ok: pw.next.length >= 8, text: '8+ characters' },
              { ok: /[A-Z]/.test(pw.next), text: 'One uppercase' },
              { ok: /[0-9]/.test(pw.next), text: 'One number' },
              { ok: /[^A-Za-z0-9]/.test(pw.next), text: 'One special character' },
            ].map(({ ok, text }) => (
              <span key={text} className={`stg-pw-rule ${ok ? 'ok' : ''}`}>
                <span className="stg-pw-rule-dot" />
                {text}
              </span>
            ))}
          </div>
          <button
            type="submit"
            className="stg-btn stg-btn-primary"
            disabled={pwSaving}
            style={{ marginTop: '1.5rem' }}
          >
            {pwSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </Card>

      {/* ── Danger zone ── */}
      <Card title="Danger Zone" danger>
        <div className="stg-danger-inner">
          <div className="stg-danger-text">
            <h4 className="stg-danger-label">Deactivate Account</h4>
            <p className="stg-danger-desc">
              This will immediately revoke all access, pause any active subscriptions, and hide your
              public profile. You can reactivate by contacting support.
            </p>
          </div>
          {!showDeactivate ? (
            <button className="stg-btn stg-btn-danger-outline" onClick={() => setShowDeactivate(true)}>
              Deactivate Account
            </button>
          ) : (
            <div className="stg-danger-confirm">
              <p className="stg-danger-confirm-msg">Are you absolutely sure?</p>
              <div className="stg-danger-confirm-btns">
                <button className="stg-btn stg-btn-ghost" onClick={() => setShowDeactivate(false)}>
                  Cancel
                </button>
                <button className="stg-btn stg-btn-danger" onClick={handleDeactivate} disabled={deactivating}>
                  {deactivating ? 'Deactivating…' : 'Yes, deactivate'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NOTIFICATIONS TAB
───────────────────────────────────────────────────────── */
const NOTIF_ITEMS = [
  {
    group: 'Learning',
    items: [
      { key: 'learning', label: 'Course updates & reminders', desc: 'When new lessons, materials, or deadlines are added', icon: 'book' },
      { key: 'assessments', label: 'Assessment results', desc: 'Quiz scores, assignment feedback, and exam results', icon: 'award' },
    ],
  },
  {
    group: 'Community',
    items: [
      { key: 'community', label: 'Community mentions', desc: 'Replies, reactions, and tags in discussions', icon: 'users' },
    ],
  },
  {
    group: 'Payments & Marketing',
    items: [
      { key: 'payments', label: 'Payment receipts', desc: 'Order confirmations, invoices, and billing alerts', icon: 'creditCard' },
      { key: 'marketing', label: 'New programs & offers', desc: 'New courses, events, and promotional announcements', icon: 'box' },
    ],
  },
];

function NotificationsTab({ toast }) {
  const [prefs, setPrefs] = useState({
    learning: true, assessments: true, community: true, payments: true, marketing: false,
  });
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet('/api/v1/settings/notifications').then(res => {
      if (!res.error && res.data) {
        const p = res.data;
        setPrefs(p);
        setInitial(p);
      }
    }).finally(() => setLoading(false));
  }, []);

  const dirty = initial && JSON.stringify(prefs) !== JSON.stringify(initial);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await apiPatch('/api/v1/settings/notifications/preferences', prefs);
    setSaving(false);
    if (!error) {
      setInitial({ ...prefs });
      toast('Notification preferences saved', 'success');
    } else {
      toast(error.message || 'Failed to save preferences', 'error');
    }
  };

  const allOn = Object.values(prefs).every(Boolean);
  const toggleAll = () => {
    const next = !allOn;
    const updated = Object.fromEntries(Object.keys(prefs).map(k => [k, next]));
    setPrefs(updated);
  };

  if (loading) return <Spinner />;

  return (
    <div className="stg-tab-body">
      <div className="stg-tab-header">
        <h2 className="stg-tab-title">Notification Preferences</h2>
        <p className="stg-tab-subtitle">Control which email updates you receive from the platform.</p>
      </div>

      <Card>
        <div className="stg-notif-global-row">
          <div>
            <span className="stg-notif-global-label">Email Notifications</span>
            <span className="stg-notif-global-sub">All platform email alerts</span>
          </div>
          <button className="stg-toggle-all-btn" onClick={toggleAll}>
            {allOn ? 'Disable all' : 'Enable all'}
          </button>
        </div>

        {NOTIF_ITEMS.map(group => (
          <div key={group.group} className="stg-notif-group">
            <div className="stg-notif-group-label">{group.group}</div>
            {group.items.map(item => (
              <div key={item.key} className="stg-notif-row">
                <div className="stg-notif-icon-wrap">
                  <Icon name={item.icon} size={17} />
                </div>
                <div className="stg-notif-text">
                  <span className="stg-notif-label">{item.label}</span>
                  <span className="stg-notif-desc">{item.desc}</span>
                </div>
                <Toggle
                  enabled={!!prefs[item.key]}
                  onChange={v => setPrefs(p => ({ ...p, [item.key]: v }))}
                />
              </div>
            ))}
          </div>
        ))}
      </Card>

      <SaveBar dirty={dirty} saving={saving} onReset={() => setPrefs(initial)} onSave={handleSave} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRIVACY TAB
───────────────────────────────────────────────────────── */
function PrivacyTab({ toast }) {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    activityVisibility: 'public',
    showBio: true,
    showStats: true,
    showGoals: true,
  });
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet('/api/v1/settings/privacy').then(res => {
      if (!res.error && res.data) {
        setSettings(res.data);
        setInitial(res.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  const dirty = initial && JSON.stringify(settings) !== JSON.stringify(initial);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await apiPatch('/api/v1/settings/privacy', settings);
    setSaving(false);
    if (!error) {
      setInitial({ ...settings });
      toast('Privacy settings saved', 'success');
    } else {
      toast(error.message || 'Failed to save privacy settings', 'error');
    }
  };

  const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public', desc: 'Visible to everyone on the platform' },
    { value: 'users', label: 'Members only', desc: 'Visible to registered members only' },
    { value: 'private', label: 'Private', desc: 'Only visible to you' },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="stg-tab-body">
      <div className="stg-tab-header">
        <h2 className="stg-tab-title">Privacy &amp; Visibility</h2>
        <p className="stg-tab-subtitle">Control who can see your profile and learning activity.</p>
      </div>

      <div className="stg-privacy-grid">
        <Card title="Profile Visibility" subtitle="Who can see your public profile page">
          <div className="stg-radio-group">
            {VISIBILITY_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                className={`stg-radio-card ${settings.profileVisibility === value ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, profileVisibility: value }))}
              >
                <div className="stg-radio-dot" />
                <div className="stg-radio-text">
                  <span className="stg-radio-label">{label}</span>
                  <span className="stg-radio-desc">{desc}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Activity Visibility" subtitle="Who can see your learning activity and progress">
          <div className="stg-radio-group">
            {VISIBILITY_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                className={`stg-radio-card ${settings.activityVisibility === value ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, activityVisibility: value }))}
              >
                <div className="stg-radio-dot" />
                <div className="stg-radio-text">
                  <span className="stg-radio-label">{label}</span>
                  <span className="stg-radio-desc">{desc}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="stg-privacy-grid-wide">
          <Card title="Profile Content Visibility" subtitle="Choose which sections appear on your public profile">
            {[
              { key: 'showBio', label: 'Bio', desc: 'Show your bio section on your profile' },
              { key: 'showStats', label: 'Learning Stats', desc: 'Show your course progress and achievements' },
              { key: 'showGoals', label: 'Goals', desc: 'Show your learning goals to others' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="stg-notif-row">
                <div className="stg-notif-text">
                  <span className="stg-notif-label">{label}</span>
                  <span className="stg-notif-desc">{desc}</span>
                </div>
                <Toggle
                  enabled={!!settings[key]}
                  onChange={v => setSettings(s => ({ ...s, [key]: v }))}
                />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onReset={() => setSettings(initial)} onSave={handleSave} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN SETTINGS PAGE
───────────────────────────────────────────────────────── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: 'user', desc: 'Name, bio & links' },
  { id: 'account', label: 'Account', icon: 'lock', desc: 'Email & password' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', desc: 'Email preferences' },
  { id: 'privacy', label: 'Privacy', icon: 'shield', desc: 'Visibility controls' },
];

function SettingsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get('tab') || 'profile';
  const { toasts, show: toast, dismiss } = useToast();

  const tabProps = { toast };

  return (
    <div className="stg-page">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Page header */}
      <div className="stg-page-header">
        <div className="stg-page-title-block">
          <h1 className="stg-page-title">Settings</h1>
          <p className="stg-page-sub">Manage your account, security, and preferences.</p>
        </div>
      </div>

      <div className="stg-layout-modern">
        {/* ── Top Tabs Navigation ── */}
        <nav className="stg-top-nav">
          <div className="stg-top-nav-inner">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`stg-top-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => router.push(`/dashboard/settings?tab=${tab.id}`, { scroll: false })}
              >
                <Icon name={tab.icon} size={19} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── Content area ── */}
        <main className="stg-main-content">
          {activeTab === 'profile' && <ProfileTab {...tabProps} />}
          {activeTab === 'account' && <AccountTab {...tabProps} />}
          {activeTab === 'notifications' && <NotificationsTab {...tabProps} />}
          {activeTab === 'privacy' && <PrivacyTab {...tabProps} />}
        </main>
      </div>

      {/* ─── All styles scoped via .stg- prefix ─── */}
      <style jsx global>{`
        /* ── Layout ── */
        .stg-page {
          min-height: 100vh;
          background: #ffffff;
          padding: 2.5rem 3rem 6rem;
          font-family: 'Poppins', sans-serif;
          max-width: 1400px;
          margin: 0 auto;
        }
        .stg-page-header {
          margin-bottom: 2.5rem;
        }
        .stg-page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #7A1F2B;
          margin: 0 0 4px;
          letter-spacing: -0.04em;
        }
        .stg-page-sub {
          color: #94a3b8;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        .stg-layout-modern {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* ── Top Navigation ── */
        .stg-top-nav {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #f0e8e9;
          padding: 8px;
          position: sticky;
          top: 90px;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .stg-top-nav-inner {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .stg-top-nav-inner::-webkit-scrollbar { display: none; }

        .stg-top-tab-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 14px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #64748b;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          min-height: 48px;
        }
        .stg-top-tab-item:hover {
          background: #f1f5f9;
          color: #7A1F2B;
        }
        .stg-top-tab-item.active {
          background: #7A1F2B;
          color: #fff;
          box-shadow: 0 4px 12px rgba(122,31,43,0.2);
        }

        /* ── Content area ── */
        .stg-main-content {
          min-width: 0;
        }
        .stg-tab-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stg-tab-header { margin-bottom: 0.25rem; }
        .stg-tab-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
          letter-spacing: -0.03em;
        }
        .stg-tab-subtitle {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        /* ── Card ── */
        .stg-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #f3f4f6;
          padding: 2rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .stg-card-danger {
          border-color: rgba(239, 68, 68, 0.2);
          background: rgba(254, 242, 242, 0.4);
        }
        .stg-card-head {
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1.5px solid #f8fafc;
        }
        .stg-card-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .stg-card-subtitle {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }

        /* ── Avatar ── */
        .stg-avatar-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1.5px solid #f0e8e9;
        }
        .stg-avatar-wrap { position: relative; flex-shrink: 0; }
        .stg-avatar {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          background: linear-gradient(135deg, #7A1F2B, #9b3040);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(122,31,43,0.25);
        }
        .stg-avatar-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #fff;
          border: 1.5px solid #f0e8e9;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          color: #64748b;
        }
        .stg-avatar-meta { flex: 1; min-width: 0; }
        .stg-avatar-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }
        .stg-avatar-tagline {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          margin: 0 0 6px;
        }
        .stg-avatar-note {
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0;
        }

        /* ── Fields & Inputs ── */
        .stg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 1.25rem;
        }
        .stg-field:last-child { margin-bottom: 0; }
        .stg-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .stg-required { color: #ef4444; }
        .stg-hint {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }
        .stg-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1.5px solid #f1f5f9;
          background: #fafafa;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
        }
        .stg-input:focus {
          border-color: #7A1F2B;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(122,31,43,0.07);
        }
        .stg-input:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
        }
        .stg-textarea {
          height: auto;
          padding: 12px 16px;
          resize: none;
          line-height: 1.6;
        }
        select.stg-input { cursor: pointer; }
        .stg-input-icon {
          position: relative;
        }
        .stg-input-icon :global(svg) {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          z-index: 1;
        }
        .stg-input-icon .stg-input {
          padding-left: 42px;
        }
        .stg-input-suffix .stg-input {
          padding-right: 44px;
        }
        .stg-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          display: flex;
          align-items: center;
          z-index: 1;
          transition: color 0.15s;
        }
        .stg-eye-btn:hover { color: #0f172a; }
        .stg-field-error {
          font-size: 0.72rem;
          color: #ef4444;
          font-weight: 600;
          margin: 0;
        }

        /* ── Grids ── */
        .stg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .stg-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem; }
        .stg-links-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

        /* ── Password strength ── */
        .stg-pw-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .stg-pw-bars { display: flex; gap: 4px; flex: 1; }
        .stg-pw-bar { flex: 1; height: 4px; border-radius: 2px; transition: background 0.3s; }
        .stg-pw-label { font-size: 0.7rem; font-weight: 700; min-width: 46px; text-align: right; }
        .stg-pw-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }
        .stg-pw-rule {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .stg-pw-rule.ok { color: #10b981; }
        .stg-pw-rule-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }

        /* ── Toggle ── */
        .stg-toggle {
          width: 46px;
          height: 26px;
          border-radius: 13px;
          background: #e2e8f0;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 0 3px;
          display: flex;
          align-items: center;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }
        .stg-toggle.on { background: #7A1F2B; }
        .stg-toggle.disabled { opacity: 0.4; cursor: not-allowed; }
        .stg-toggle-knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          position: absolute;
          left: 3px;
          transition: left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stg-toggle.on .stg-toggle-knob { left: calc(100% - 23px); }

        /* ── Email row ── */
        .stg-email-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #f8fafc;
          border-radius: 14px;
          border: 1.5px solid #f1f5f9;
        }
        .stg-email-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #f0e8e9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7A1F2B;
          flex-shrink: 0;
        }
        .stg-email-text {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .stg-email-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
        .stg-verified-pill {
          background: #ecfdf5;
          color: #059669;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 8px;
        }

        /* ── Danger zone ── */
        .stg-danger-inner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .stg-danger-text { flex: 1; }
        .stg-danger-label {
          font-size: 1rem;
          font-weight: 800;
          color: #ef4444;
          margin: 0 0 6px;
        }
        .stg-danger-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          max-width: 480px;
        }
        .stg-danger-confirm {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }
        .stg-danger-confirm-msg {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ef4444;
          margin: 0;
        }
        .stg-danger-confirm-btns {
          display: flex;
          gap: 10px;
        }

        /* ── Notifications ── */
        .stg-notif-global-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          margin-bottom: 0.5rem;
          border-bottom: 1.5px solid #f8fafc;
        }
        .stg-notif-global-label {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          display: block;
        }
        .stg-notif-global-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          display: block;
          margin-top: 2px;
        }
        .stg-toggle-all-btn {
          background: none;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 36px;
        }
        .stg-toggle-all-btn:hover { border-color: #7A1F2B; color: #7A1F2B; }
        .stg-notif-group { margin-bottom: 1.5rem; }
        .stg-notif-group:last-child { margin-bottom: 0; }
        .stg-notif-group-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 14px 0 8px;
        }
        .stg-notif-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 12px;
          transition: background 0.15s;
          min-height: 44px;
        }
        .stg-notif-row:hover { background: #f8fafc; }
        .stg-notif-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }
        .stg-notif-text { flex: 1; min-width: 0; }
        .stg-notif-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
          margin-bottom: 2px;
        }
        .stg-notif-desc {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          display: block;
        }

        /* ── Privacy ── */
        .stg-privacy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .stg-privacy-grid-wide {
          grid-column: 1 / -1;
        }
        .stg-radio-group { display: flex; flex-direction: column; gap: 10px; }
        .stg-radio-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid #f1f5f9;
          background: #fafafa;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          min-height: 44px;
        }
        .stg-radio-card:hover { border-color: #cbd5e1; background: #f8fafc; }
        .stg-radio-card.active { border-color: #7A1F2B; background: #f8fafc; }
        .stg-radio-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          position: relative;
          flex-shrink: 0;
          transition: border-color 0.15s;
        }
        .stg-radio-card.active .stg-radio-dot {
          border-color: #7A1F2B;
        }
        .stg-radio-card.active .stg-radio-dot::after {
          content: '';
          position: absolute;
          inset: 4px;
          background: #7A1F2B;
          border-radius: 50%;
        }
        .stg-radio-text { min-width: 0; }
        .stg-radio-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .stg-radio-card.active .stg-radio-label { color: #7A1F2B; }
        .stg-radio-desc {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* ── Buttons ── */
        .stg-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Poppins', sans-serif;
          border: none;
          min-height: 44px;
          white-space: nowrap;
        }
        .stg-btn:disabled { opacity: 0.55; cursor: not-allowed; pointer-events: none; }
        .stg-btn-primary {
          background: #7A1F2B;
          color: #fff;
          box-shadow: 0 2px 8px rgba(122,31,43,0.2);
        }
        .stg-btn-primary:hover { background: #9b3040; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(122,31,43,0.3); }
        .stg-btn-ghost {
          background: transparent;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
        }
        .stg-btn-ghost:hover { border-color: #7A1F2B; color: #7A1F2B; }
        .stg-btn-danger-outline {
          background: transparent;
          color: #ef4444;
          border: 1.5px solid rgba(239,68,68,0.3);
        }
        .stg-btn-danger-outline:hover { background: #fef2f2; border-color: #ef4444; }
        .stg-btn-danger {
          background: #ef4444;
          color: #fff;
        }
        .stg-btn-danger:hover { background: #dc2626; }
        .stg-btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: stg-spin 0.8s linear infinite;
          display: inline-block;
        }

        /* ── Save bar ── */
        .stg-savebar {
          position: sticky;
          bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 16px 24px;
          background: #0f172a;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          z-index: 50;
          animation: stg-slide-up 0.25s ease;
        }
        .stg-savebar-msg {
          font-size: 0.875rem;
          font-weight: 600;
          color: #e2e8f0;
        }
        .stg-savebar-actions { display: flex; gap: 10px; }

        /* ── Toast ── */
        .toast-container {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
          pointer-events: none;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 22px;
          border-radius: 16px;
          font-size: 0.875rem;
          font-weight: 700;
          min-width: 280px;
          max-width: 440px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          cursor: pointer;
          pointer-events: all;
          animation: stg-toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .toast-success { background: #0f172a; color: #fff; }
        .toast-error { background: #7f1d1d; color: #fff; }
        .toast-info { background: #1e3a5f; color: #fff; }
        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 900;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .toast-msg { flex: 1; }

        /* ── Loader ── */
        .stg-loader {
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stg-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #f0e8e9;
          border-top-color: #7A1F2B;
          border-radius: 50%;
          animation: stg-spin 0.9s linear infinite;
        }

        /* ── Keyframes ── */
        @keyframes stg-spin { to { transform: rotate(360deg); } }
        @keyframes stg-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stg-toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Responsive ── */
        @media (max-width: 1060px) {
          .stg-page { padding: 2rem 1.5rem 6rem; }
          .stg-top-tab-item { padding: 10px 16px; font-size: 0.875rem; }
        }

        @media (max-width: 768px) {
          .stg-page { padding: 1.5rem 1rem 6rem; }
          .stg-page-title { font-size: 1.75rem; }
          .stg-grid-2, .stg-grid-3, .stg-links-grid { grid-template-columns: 1fr; }
          .stg-card { padding: 1.5rem; border-radius: 16px; }
          .stg-avatar-row { flex-direction: column; text-align: center; }
          .stg-privacy-grid { grid-template-columns: 1fr; }
          .stg-danger-inner { flex-direction: column; }
          .stg-savebar { flex-direction: column; text-align: center; bottom: 16px; }
        }

        @media (max-width: 480px) {
          .stg-page { padding: 1rem 0.75rem 5rem; }
          .stg-page-title { font-size: 1.5rem; }
          .stg-card { padding: 1.25rem; }
          .stg-tab-title { font-size: 1.25rem; }
          .stg-mobile-tab span { display: none; }
          .stg-email-text { flex-direction: column; align-items: flex-start; gap: 6px; }
          .toast-container { left: 16px; right: 16px; transform: none; }
          .toast { min-width: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #f0e8e9', borderTopColor: '#7A1F2B', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
