'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Rocket, User, Building2, CheckCircle2, ArrowRight, ArrowLeft,
  AlertCircle, Lock,
} from 'lucide-react';
import {
  getGrantConfig, saveDraft, submitApplication, getApplication, listMyApplications,
} from '@/lib/grants';
import JourneyShowcase from '@/components/grants/JourneyShowcase';

// Phase 1 is a free idea check — lean by design. Detailed business plans and
// document uploads happen in Phase 2 (Idea Evaluation), after the idea is
// accepted. So there is no Documents step here.
const STEPS = ['Founder', 'Startup', 'Review'];

const emptyFounder = {
  fullName: '', email: '', phone: '', collegeName: '',
  university: '', city: '', state: '',
};
// Demo video is an upload, not a URL — founders attach the file on the Documents
// step. The backend still accepts demoVideoUrl for older drafts, but the form no
// longer collects one.
const emptyStartup = {
  name: '', stage: '', category: '', teamSize: '',
  problemStatement: '', solution: '', targetAudience: '', businessModel: '',
  traction: '', fundingRaised: '', website: '', linkedin: '',
};

// ─── Small presentational helpers ──────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
  background: '#fff',
  fontFamily: 'inherit',
};

function Skeleton() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? '38px' : '92px',
            marginBottom: '18px',
            background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'grantShimmer 1.4s infinite',
            borderRadius: '12px',
          }}
        />
      ))}
      <style>{`@keyframes grantShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────
export default function GrantApplicationPage() {
  const router = useRouter();

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [founder, setFounder] = useState(emptyFounder);
  const [startup, setStartup] = useState(emptyStartup);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationRef, setApplicationRef] = useState('');
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: cfg, error: cfgErr } = await getGrantConfig();
      if (cfgErr) {
        setError(cfgErr.message || 'Could not load the application form.');
        setLoading(false);
        return;
      }
      setConfig(cfg);

      // Resume an existing draft rather than silently starting a second one.
      const { data: mine } = await listMyApplications();
      const draft = mine?.find(a => a.status === 'draft');
      if (draft) {
        const { data: full } = await getApplication(draft._id);
        if (full) {
          setApplicationId(full._id);
          setApplicationRef(full.applicationId);
          setFounder({ ...emptyFounder, ...full.founder });
          setStartup({
            ...emptyStartup,
            ...full.startup,
            teamSize: full.startup?.teamSize ?? '',
          });
        }
      }
      setLoading(false);
    })();
  }, []);


  const founderValid = useMemo(
    () => founder.fullName.trim() && founder.email.trim() && founder.phone.trim(),
    [founder]
  );
  const startupValid = useMemo(
    () =>
      startup.name.trim() &&
      startup.stage &&
      startup.category &&
      startup.problemStatement.trim() &&
      startup.solution.trim(),
    [startup]
  );

  /**
   * The draft must exist server-side before any document can be attached to it,
   * so leaving the Startup step persists first and only then unlocks uploads.
   */
  const persistDraft = async () => {
    setSaving(true);
    setError('');

    const payload = {
      founder,
      startup: {
        ...startup,
        teamSize: startup.teamSize === '' ? undefined : Number(startup.teamSize),
      },
    };

    const { data, error: err } = await saveDraft(payload);
    setSaving(false);

    if (err) {
      setError(err.message || 'Could not save your application.');
      return false;
    }
    setApplicationId(data._id);
    setApplicationRef(data.applicationId);
    return true;
  };

  const next = async () => {
    setError('');
    if (step === 1) {
      const okSaved = await persistDraft();
      if (!okSaved) return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = async () => {
    setError('');
    if (!terms) {
      setError('Please accept the terms and conditions to submit.');
      return;
    }
    setSaving(true);
    // Persist any edits made after the draft was first created.
    const okSaved = await persistDraft();
    if (!okSaved) return;

    const { error: err } = await submitApplication(applicationId, true);
    setSaving(false);

    if (err) {
      setError(err.message || 'Could not submit your application.');
      return;
    }
    router.push(`/dashboard/grants/applications/${applicationId}?submitted=1`);
  };

  if (loading) return <Skeleton />;

  // Admin kill-switch / deadline. Rendering the form would be a lie.
  if (config && !config.enabled) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <Lock size={48} color="#9ca3af" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
          Applications are closed
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
          Startup Funding is not accepting new applications right now. Please check back later.
        </p>
      </div>
    );
  }


  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
            background: '#fef2f2', color: '#ef4444', borderRadius: '100px',
            fontSize: '11.5px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <Rocket size={13} /> Startup Funding
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          {config.title}
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
          {config.description}
        </p>
        {applicationRef && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: '#9ca3af' }}>
            Application ID: <strong style={{ color: '#374151' }}>{applicationRef}</strong>
          </p>
        )}
      </div>

      {/* Journey showcase — get founders excited about all 5 phases before they
          fill anything in. Rendered from config.phases (backend source of truth). */}
      <JourneyShowcase phases={config.phases} />

      {/* Progress tracker */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div
              style={{
                height: '4px',
                borderRadius: '100px',
                background: i <= step ? 'linear-gradient(90deg,#e63946,#ff6b6b)' : '#f0f0f0',
                marginBottom: '8px',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: i === step ? 700 : 500,
                color: i <= step ? '#111827' : '#9ca3af',
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
            background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px',
            color: '#ef4444', fontSize: '13px', fontWeight: 500, marginBottom: '20px',
          }}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div
        style={{
          padding: '28px',
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* ── Step 0: Founder ── */}
        {step === 0 && (
          <>
            <SectionTitle icon={<User size={18} />} title="Founder details" />
            <Field label="Full Name" required>
              <input style={inputStyle} value={founder.fullName}
                onChange={e => setFounder({ ...founder, fullName: e.target.value })} />
            </Field>
            <Field label="Email" required>
              <input type="email" style={inputStyle} value={founder.email}
                onChange={e => setFounder({ ...founder, email: e.target.value })} />
            </Field>
            <Field label="Mobile Number" required>
              <input type="tel" style={inputStyle} value={founder.phone}
                onChange={e => setFounder({ ...founder, phone: e.target.value })} />
            </Field>
            <Two>
              <Field label="College Name">
                <input style={inputStyle} value={founder.collegeName}
                  onChange={e => setFounder({ ...founder, collegeName: e.target.value })} />
              </Field>
              <Field label="City">
                <input style={inputStyle} value={founder.city}
                  onChange={e => setFounder({ ...founder, city: e.target.value })} />
              </Field>
            </Two>
          </>
        )}

        {/* ── Step 1: Startup ── */}
        {step === 1 && (
          <>
            <SectionTitle icon={<Building2 size={18} />} title="Startup details" />
            <Field label="Startup Name" required>
              <input style={inputStyle} value={startup.name}
                onChange={e => setStartup({ ...startup, name: e.target.value })} />
            </Field>
            <Two>
              {/* Options come from admin settings — never hardcoded here. */}
              <Field label="Startup Stage" required>
                <select style={inputStyle} value={startup.stage}
                  onChange={e => setStartup({ ...startup, stage: e.target.value })}>
                  <option value="">Select a stage</option>
                  {config.stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Startup Category" required>
                <select style={inputStyle} value={startup.category}
                  onChange={e => setStartup({ ...startup, category: e.target.value })}>
                  <option value="">Select a category</option>
                  {config.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </Two>
            <Field label="Problem Statement" required hint="What problem are you solving?">
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={startup.problemStatement}
                onChange={e => setStartup({ ...startup, problemStatement: e.target.value })} />
            </Field>
            <Field label="Solution" required hint="How does your startup solve it?">
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={startup.solution}
                onChange={e => setStartup({ ...startup, solution: e.target.value })} />
            </Field>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#9ca3af', lineHeight: 1.6 }}>
              That&apos;s all we need for now — your detailed business plan and documents come later,
              in Phase 2 (Idea Evaluation), once your idea is accepted.
            </p>
          </>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && (
          <>
            <SectionTitle icon={<CheckCircle2 size={18} />} title="Review & submit" />

            <Summary title="Founder" rows={[
              ['Name', founder.fullName], ['Email', founder.email], ['Mobile', founder.phone],
              ['College', founder.collegeName], ['City', founder.city],
            ]} />

            <Summary title="Startup" rows={[
              ['Name', startup.name], ['Stage', startup.stage], ['Category', startup.category],
              ['Problem', startup.problemStatement], ['Solution', startup.solution],
            ]} />

            <label
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px',
                background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#ef4444' }} />
              <span style={{ fontSize: '13.5px', color: '#374151', lineHeight: 1.6 }}>
                {config.termsText}
              </span>
            </label>

            <p style={{ margin: '14px 0 0', fontSize: '12.5px', color: '#9ca3af', lineHeight: 1.6 }}>
              Once submitted, your application is locked and cannot be edited unless our team asks
              you for changes.
            </p>
          </>
        )}

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '28px' }}>
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '12px',
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: step === 0 ? '#d1d5db' : '#374151',
              fontWeight: 600, fontSize: '14px',
              cursor: step === 0 ? 'default' : 'pointer',
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={
                saving ||
                (step === 0 && !founderValid) ||
                (step === 1 && !startupValid)
              }
              style={primaryBtn(
                saving ||
                (step === 0 && !founderValid) ||
                (step === 1 && !startupValid)
              )}
            >
              {saving ? 'Saving…' : 'Continue'} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !terms}
              style={primaryBtn(saving || !terms)}
            >
              {saving ? 'Submitting…' : 'Submit Application'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#9ca3af' }}>
        <Link href="/dashboard/grants/applications" style={{ color: '#ef4444', fontWeight: 600 }}>
          View my applications
        </Link>
      </p>
    </div>
  );
}

function primaryBtn(disabled) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '12px 24px', borderRadius: '12px', border: 'none',
    background: disabled ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
    color: disabled ? '#9ca3af' : '#fff',
    fontWeight: 700, fontSize: '14px',
    cursor: disabled ? 'default' : 'pointer',
  };
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '20px' }}>
      <span style={{ color: '#ef4444' }}>{icon}</span>
      <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h2>
    </div>
  );
}

function Two({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' }}>
      {children}
    </div>
  );
}

function Summary({ title, rows }) {
  const filled = rows.filter(([, v]) => v !== '' && v !== undefined && v !== null);
  return (
    <div style={{ marginBottom: '22px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#111827', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
      <div style={{ display: 'grid', gap: '8px' }}>
        {filled.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: '12px', fontSize: '13.5px', lineHeight: 1.6 }}>
            <span style={{ minWidth: '130px', color: '#9ca3af', flexShrink: 0 }}>{k}</span>
            <span style={{ color: '#374151', wordBreak: 'break-word' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
