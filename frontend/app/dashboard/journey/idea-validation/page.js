'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, CheckCircle2, CalendarClock,
  CreditCard, FileText, AlertCircle, Loader2,
  Download, ArrowRight, Shield,
} from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardProvider';
import { apiFetch } from '@/lib/api';
import {
  listMyApplications, getApplication, saveDraft,
  submitApplication, getGrantConfig, formatMoney,
} from '@/lib/grants';
import FileDropzone from '@/components/grants/FileDropzone';

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load payment gateway.'));
    document.body.appendChild(script);
  });
}

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid #e5e7eb', borderRadius: '12px',
  fontSize: '14px', color: '#111827', outline: 'none',
  background: '#fff', fontFamily: 'inherit',
};

const PAID_STATUSES = [
  'idea_evaluation_paid', 'evaluation_scheduled', 'evaluation_completed',
  'pre_incubation', 'incubation', 'funding_process_started', 'grant_approved', 'completed',
];

// The canonical startup-stage taxonomy lives in admin settings (grant.stages) and
// is delivered via the /config endpoint as config.stages. This list is only a
// fallback for the brief window before config loads - prefer config.stages so an
// admin edit never silently goes stale here.
const DEFAULT_STARTUP_STAGES = ['Idea', 'Prototype', 'MVP', 'Revenue', 'Scaling'];

/**
 * Maps a free-text industry value (from the user's profile) to the nearest
 * valid grant category from the admin's config list.
 *
 * Tries an exact match first, then a case-insensitive substring match, then
 * falls back to "Other".
 */
function resolveCategory(industry, categories = []) {
  if (!industry) return 'Other';
  // 1. Exact match
  if (categories.includes(industry)) return industry;
  // 2. Case-insensitive exact
  const lower = industry.toLowerCase();
  const exact = categories.find(c => c.toLowerCase() === lower);
  if (exact) return exact;
  // 3. Substring - does any category appear inside the industry string, or vice-versa?
  const substr = categories.find(
    c => lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower),
  );
  if (substr) return substr;
  // 4. Token overlap - "Artificial Intelligence / ML" ↔ "AI/ML"
  const tokens = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const tokenMatch = categories.find(c => {
    const cTokens = c.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    return tokens.some(t => cTokens.some(ct => t.startsWith(ct) || ct.startsWith(t)));
  });
  if (tokenMatch) return tokenMatch;
  return 'Other';
}

// ── EvaluatedSection: shown after admin scores. The report (score, feedback,
// downloadable file) stays LOCKED until 2 hours before the booked 1:1 slot. ──
function EvaluatedSection({ appId, evalSummary }) {
  const [showDialog, setShowDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState('');

  const reportUnlocked = Boolean(evalSummary?.reportUnlocked);
  const hasSlot = Boolean(evalSummary?.meeting?.scheduledAt);
  const result = evalSummary?.result || null;

  const slotLabel = hasSlot
    ? new Date(evalSummary.meeting.scheduledAt).toLocaleString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    })
    : null;

  const handleDownload = async () => {
    setDlError('');
    setDownloading(true);
    const { data, error } = await apiFetch(`/api/v1/grants/applications/${appId}/evaluation/report`);
    setDownloading(false);
    if (error) {
      setDlError(error.message || 'Report is not available yet.');
      return;
    }
    if (data?.hasFile && data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    }
    // If there is no file, the on-page score/feedback below IS the report.
  };

  return (
    <>
      {/* Shortlisted / Approved banner */}
      <div style={{
        background: 'linear-gradient(135deg, #022c22, #064e3b)',
        border: '1.5px solid #10b981', borderRadius: '16px',
        padding: '28px 24px', marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px', marginBottom: '14px',
            background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
            fontSize: '11px', fontWeight: 800, letterSpacing: '1px',
            textTransform: 'uppercase', color: '#34d399',
          }}>
            🎉 Application Shortlisted
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            Your idea has been validated!
          </h2>

          {reportUnlocked ? (
            <>
              <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#a7f3d0', lineHeight: 1.6 }}>
                Your evaluation report is unlocked. View your score and feedback below, or download the full report.
              </p>

              {/* On-page score + feedback (the report itself when no file exists) */}
              {result && (
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '12px', padding: '16px 18px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: result.feedback ? '10px' : 0 }}>
                    <span style={{ fontSize: '30px', fontWeight: 900, color: '#fff' }}>{result.score}</span>
                    <span style={{ fontSize: '15px', color: '#a7f3d0' }}>/ {result.maxScore || 100}</span>
                    <span style={{
                      marginLeft: 'auto', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800,
                      background: result.passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                      color: result.passed ? '#34d399' : '#fca5a5',
                    }}>
                      {result.passed ? 'PASSED' : 'NOT CLEARED'}
                    </span>
                  </div>
                  {result.feedback && (
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#d1fae5', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {result.feedback}
                    </p>
                  )}
                </div>
              )}

              {result?.hasFile && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '13px 22px', borderRadius: '12px',
                    border: '1.5px solid rgba(16,185,129,0.5)',
                    background: 'rgba(16,185,129,0.15)',
                    color: '#34d399', fontWeight: 700, fontSize: '14px',
                    cursor: downloading ? 'wait' : 'pointer',
                  }}>
                  <Download size={16} />
                  {downloading ? 'Preparing…' : 'Download Evaluation Report (PDF)'}
                  <ArrowRight size={14} />
                </button>
              )}
              {dlError && (
                <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#fca5a5' }}>{dlError}</p>
              )}
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#a7f3d0', lineHeight: 1.6 }}>
                Congratulations! Our expert panel has reviewed your startup idea.
                {hasSlot
                  ? ' Your evaluation report unlocks 2 hours before your booked 1:1 session.'
                  : ' Book a 1:1 session to unlock your report - it opens 2 hours before your slot.'}
              </p>

              {hasSlot ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '13px 20px', borderRadius: '12px',
                  border: '1.5px solid rgba(148,163,184,0.4)', background: 'rgba(15,23,42,0.35)',
                  color: '#cbd5e1', fontWeight: 600, fontSize: '13.5px',
                }}>
                  <CalendarClock size={16} />
                  Report unlocks 2 hrs before your session{slotLabel ? ` — ${slotLabel}` : ''}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDialog(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '13px 22px', borderRadius: '12px',
                    border: '1.5px solid rgba(16,185,129,0.5)',
                    background: 'rgba(16,185,129,0.15)',
                    color: '#34d399', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}>
                  <CalendarClock size={16} />
                  Book 1:1 Session to Unlock Report
                  <ArrowRight size={14} />
                </button>
              )}
              <p style={{ margin: '10px 0 0', fontSize: '11.5px', color: 'rgba(167,243,208,0.6)' }}>
                🔒 Your report is locked until 2 hours before your 1:1 session.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Dialog: book slot to access report */}
      {showDialog && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowDialog(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            maxWidth: '440px', width: '100%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            animation: 'dialogPop 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <style>{`@keyframes dialogPop{from{opacity:0;transform:scale(0.9) translateY(10px)}to{opacity:1;transform:none}}`}</style>

            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              border: '1.5px solid #bfdbfe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarClock size={26} color="#1d4ed8" />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
              Book a 1:1 Session First
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b', lineHeight: 1.6, textAlign: 'center' }}>
              Your evaluation report will be shared during your 1:1 session with our expert panel.
              Book a slot to access it.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {appId && (
                <Link
                  href={`/dashboard/journey/book-slot?appId=${appId}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: '#fff', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
                  }}
                  onClick={() => setShowDialog(false)}
                >
                  <CalendarClock size={17} /> Book 1:1 Slot Now
                </Link>
              )}
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                style={{
                  padding: '12px', borderRadius: '12px',
                  border: '1.5px solid #e2e8f0', background: '#fff',
                  color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function IdeaValidationPage() {
  const { user } = useDashboard();
  const dp = user?.dynamicProfileData || {};

  const [app, setApp] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Optimistic post-payment state: flipped the instant Razorpay confirms success,
  // so the user immediately sees "payment received / confirming" instead of a
  // stale "Continue to Payment" button while verify + reload run in the background.
  const [paymentDone, setPaymentDone] = useState(false);

  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [documents, setDocuments] = useState([]);
  const [evalSummary, setEvalSummary] = useState(null);

  // Draft ID - only created lazily when the user first tries to upload a file.
  // Nothing is sent to the backend until the user takes an explicit action.
  const [draftId, setDraftId] = useState(null);
  const [creatingDraft, setCreatingDraft] = useState(false);

  const loadData = useCallback(async () => {
    const [{ data: apps }, { data: cfg }] = await Promise.all([
      listMyApplications(),
      getGrantConfig(),
    ]);
    setConfig(cfg);

    const existing = apps?.[0];
    if (existing) {
      const { data: full } = await getApplication(existing._id);
      if (full) {
        setApp(full);
        setDraftId(full._id);
        setProblemStatement(full.startup?.problemStatement || '');
        setSolution(full.startup?.solution || '');
        setDocuments(full.documents || []);
      }
      if (PAID_STATUSES.includes(existing.status)) {
        const { data: ev } = await apiFetch(`/api/v1/grants/applications/${existing._id}/evaluation`);
        if (ev) setEvalSummary(ev);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /**
   * Creates a draft application on demand - only called when the user first
   * picks a file to upload. Returns the application _id, or null on failure.
   * Subsequent calls are no-ops (returns the already-known id).
   */
  const ensureDraft = useCallback(async () => {
    const existingId = draftId || app?._id;
    if (existingId) return existingId;
    if (creatingDraft) return null; // already in flight
    if (!user?.email) return null;

    setCreatingDraft(true);
    const { data, error: draftError } = await saveDraft({
      founder: {
        fullName: user?.fullName || user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        collegeName: dp.collegeName || '',
        university: dp.collegeName || '',
        city: dp.city || '',
        state: dp.state || '',
      },
      startup: {
        name: dp.startupName || 'My Startup',
        stage: resolveCategory(dp.startupStage, config?.stages || DEFAULT_STARTUP_STAGES) || 'Idea',
        category: resolveCategory(dp.industry, config?.categories) || 'Other',
        problemStatement: problemStatement.trim() || '-',
        solution: solution.trim() || '-',
      },
    });
    setCreatingDraft(false);

    if (data?._id) {
      setDraftId(data._id);
      // Refresh app state so documents are tied to the right record
      getApplication(data._id).then(({ data: full }) => {
        if (full) { setApp(full); setDocuments(full.documents || []); }
      });
      return data._id;
    }

    setError(draftError?.message || 'Could not prepare your application. Please try again.');
    return null;
  }, [
    draftId, app?._id, creatingDraft,
    user?.email, user?.fullName, user?.full_name, user?.phone,
    dp.collegeName, dp.industry, dp.startupName, dp.startupStage, dp.city, dp.state,
    config?.categories, config?.stages, problemStatement, solution,
  ]);

  const handleContinueToPayment = async () => {
    setError('');

    if (!problemStatement.trim() || !solution.trim()) {
      setError('Please fill in both Problem Statement and Solution.');
      return;
    }
    const hasDocs = documents.some(d => d.kind === 'pitch_deck' || d.kind === 'business_plan');
    if (!hasDocs) {
      setError('Please upload at least your pitch deck or business plan before proceeding.');
      return;
    }

    setSaving(true);

    // Save latest problem/solution to the draft
    const founderPayload = {
      fullName: user?.fullName || user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      collegeName: dp.collegeName || '',
      university: dp.collegeName || '',
      city: dp.city || '',
      state: dp.state || '',
    };
    const startupPayload = {
      name: dp.startupName || 'My Startup',
      stage: resolveCategory(dp.startupStage, config?.stages || DEFAULT_STARTUP_STAGES) || 'Idea',
      category: resolveCategory(dp.industry, config?.categories) || 'Other',
      problemStatement: problemStatement.trim(),
      solution: solution.trim(),
    };

    const { data: saved, error: saveErr } = await saveDraft({ founder: founderPayload, startup: startupPayload });
    if (saveErr) { setSaving(false); setError(saveErr.message || 'Could not save.'); return; }

    const appId = saved._id;
    setDraftId(appId);

    // NOTE: we deliberately do NOT submit the application here. The application
    // stays a draft until payment SUCCEEDS - submission happens inside the
    // Razorpay success handler, right before verification. This way, cancelling
    // the payment leaves the form editable and the user can pay again.

    setSaving(false);
    setPaying(true);

    // Open Razorpay
    try {
      await loadRazorpay();
      const { data: order, error: orderErr } = await apiFetch(
        `/api/v1/grants/applications/${appId}/evaluation/order`,
        { method: 'POST' }
      );
      if (orderErr) throw new Error(orderErr.message || 'Could not create payment order.');

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.totalAmount,
        currency: order.currency,
        name: 'StartupsIndia',
        description: `Idea Evaluation - ${order.applicationRef}`,
        order_id: order.orderId,
        prefill: {
          name: user?.fullName || user?.full_name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        handler: async response => {
          // Payment succeeded. Flip the UI to a success/confirming state IMMEDIATELY
          // so the user never sees a stale "Continue to Payment" button while the
          // verify + reload happen. The money is already taken at this point.
          setError('');
          setPaying(false);
          setPaymentDone(true);
          setSuccess('Payment received! Confirming your registration…');

          // Record submission (best-effort - the backend also self-heals submittedAt
          // on verify) and verify in parallel to cut the wait.
          const [, verifyRes] = await Promise.all([
            submitApplication(appId, true).catch(() => ({})),
            apiFetch(
              `/api/v1/grants/applications/${appId}/evaluation/verify`,
              {
                method: 'POST',
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            ),
          ]);

          if (verifyRes?.error) {
            // Rare: payment captured but signature verify failed. Keep the success
            // framing but flag it for support rather than telling them to pay again.
            setSuccess('');
            setError('Payment received. We are finalising your registration - if it does not update shortly, contact support (do NOT pay again).');
          } else {
            setSuccess('Payment confirmed! Your idea has been submitted for evaluation.');
          }

          // Refresh the real application state in the background. The optimistic
          // paymentDone flag already updated the UI, so any delay here is invisible.
          await loadData().catch(() => {});
        },
        modal: { ondismiss: () => { setPaying(false); } },
        theme: { color: '#dc2626' },
      });
      rzp.on('payment.failed', res => {
        setError(res?.error?.description || 'Payment failed. You have not been charged.');
        setPaying(false);
      });
      // Clear any stale error from a previous attempt before opening the modal
      setError('');
      rzp.open();
    } catch (err) {
      setError(err.message || 'Could not start payment.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
        <Loader2 size={32} color="#dc2626" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const status = app?.status || 'not_applied';
  const isPaid = PAID_STATUSES.includes(status);
  // Statuses where the user has self-submitted but NOT yet paid - they can still
  // pay (and edit). Treat these like a draft so a cancelled/abandoned payment
  // never locks the user out of paying again.
  const UNPAID_OPEN_STATUSES = ['draft', 'submitted', 'idea_evaluation_pending'];
  // "Submitted" for UI purposes = past the point where the user can still pay.
  // An unpaid self-submitted app is NOT treated as submitted here, so the form
  // and payment button remain available.
  const isSubmitted = status !== 'not_applied' && !UNPAID_OPEN_STATUSES.includes(status);
  // Paid but waiting for admin to score and schedule - show "Under Review"
  const isUnderReview = status === 'idea_evaluation_paid';
  const isScheduled = status === 'evaluation_scheduled';
  const isEvaluated = ['evaluation_completed', 'pre_incubation', 'incubation',
    'funding_process_started', 'grant_approved', 'completed'].includes(status);
  const isRejected = status === 'rejected';

  const docsOf = kind => documents.filter(d => d.kind === kind);
  const hasKeyDoc = docsOf('pitch_deck').length > 0 || docsOf('business_plan').length > 0;
  const uploadAppId = draftId || app?._id;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)',
        borderRadius: '20px', padding: '28px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 28px -8px rgba(30,58,138,0.4)',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', marginBottom: '10px', background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fca5a5' }}>
            <Sparkles size={12} /> Stage 2
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, color: '#fff' }}>Idea Validation</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#93c5fd', lineHeight: 1.5 }}>
            Submit your pitch deck and revenue model. Pay ₹1,499 for expert idea evaluation.
          </p>
          {app?.applicationId && (
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{app.applicationId}</p>
          )}
        </div>
      </div>

      {/* Error / success banners */}
      {error && (
        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', marginBottom: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', fontSize: '13.5px', fontWeight: 500 }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> {error}
        </div>
      )}
      {success && (
        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', marginBottom: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#15803d', fontSize: '13.5px', fontWeight: 600 }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> {success}
        </div>
      )}

      {/* Pre-filled profile summary */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pre-filled from your profile</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: '13.5px' }}>
          {[
            ['Founder', user?.fullName || user?.full_name],
            ['Startup', dp.startupName],
            ['Industry', dp.industry],
            ['Stage', dp.startupStage],
            ['City', dp.city],
            ['College', dp.collegeName],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#94a3b8', minWidth: '70px' }}>{k}</span>
              <span style={{ color: '#1e293b', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <Link href="/dashboard/journey/registration" style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#94a3b8', textDecoration: 'underline' }}>
          Edit profile →
        </Link>
      </div>

      {/* ── PAYMENT CONFIRMED (optimistic): shown the instant Razorpay succeeds,
             until the real status refreshes into the Under Review / report state ── */}
      {paymentDone && !isUnderReview && !isScheduled && !isEvaluated && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1.5px solid #bbf7d0', borderRadius: '16px',
          padding: '24px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={22} color="#fff" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: '#15803d' }}>
                ✅ Payment Successful
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#16a34a', lineHeight: 1.5 }}>
                Your payment went through and your idea is being submitted for evaluation. This page will update in a moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Problem & Solution ── */}
      {!isSubmitted && !paymentDone && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>1</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Problem &amp; Solution</h2>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Problem Statement <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="What problem does your startup solve? Be specific."
              value={problemStatement} onChange={e => setProblemStatement(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Solution <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="How does your startup solve this problem? What makes it unique?"
              value={solution} onChange={e => setSolution(e.target.value)} />
          </div>
        </div>
      )}

      {/* Read-only problem/solution after submission */}
      {isSubmitted && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Problem &amp; Solution</p>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>PROBLEM</p>
          <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#1e293b', lineHeight: 1.6 }}>{app?.startup?.problemStatement || '-'}</p>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>SOLUTION</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', lineHeight: 1.6 }}>{app?.startup?.solution || '-'}</p>
        </div>
      )}

      {/* ── STEP 2: Upload Documents (before payment) ── */}
      {!isPaid && !paymentDone && !isSubmitted && config && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>2</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Upload Documents</h2>
          </div>
          <FileDropzone
              applicationId={uploadAppId}
              onBeforeUpload={ensureDraft}
              kind="pitch_deck"
              label="Pitch Deck"
              hint="Your pitch deck (PDF, max 10MB)"
              accept={config.upload?.pitchDeckTypes || ['application/pdf']}
              maxSizeMb={config.upload?.maxSizeMb || 10}
              maxFiles={1}
              existing={docsOf('pitch_deck')}
              onChange={next => setDocuments(prev => [
                ...prev.filter(d => d.kind !== 'pitch_deck'),
                ...next.filter(d => d.kind === 'pitch_deck'),
              ])}
            />
            <FileDropzone
              applicationId={uploadAppId}
              onBeforeUpload={ensureDraft}
              kind="business_plan"
              label="Revenue Model / Business Plan"
              hint="Your revenue model or business plan (PDF, max 10MB)"
              accept={config.upload?.documentTypes || ['application/pdf']}
              maxSizeMb={config.upload?.maxSizeMb || 10}
              maxFiles={1}
              existing={docsOf('business_plan')}
              onChange={next => setDocuments(prev => [
                ...prev.filter(d => d.kind !== 'business_plan'),
                ...next.filter(d => d.kind === 'business_plan'),
              ])}
            />
        </div>
      )}

      {/* Documents vault (after payment) */}
      {isPaid && documents.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Uploaded Documents</p>
          {documents.map(doc => (
            <div key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
              <FileText size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{doc.fileName}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{doc.kind.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 3: Continue to Payment button ── */}
      {!isSubmitted && !isPaid && !paymentDone && (
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={handleContinueToPayment}
            disabled={saving || paying || !problemStatement.trim() || !solution.trim()}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
              background: (saving || paying || !problemStatement.trim() || !solution.trim())
                ? '#f1f5f9' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: (saving || paying || !problemStatement.trim() || !solution.trim()) ? '#94a3b8' : '#fff',
              fontWeight: 700, fontSize: '16px', cursor: 'pointer',
              boxShadow: (saving || paying || !problemStatement.trim() || !solution.trim())
                ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
            <CreditCard size={18} />
            {saving ? 'Saving…' : paying ? 'Opening payment…' : 'Continue to Payment - ₹1,499'}
          </button>
          {!hasKeyDoc && problemStatement.trim() && solution.trim() && (
            <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: '12.5px', color: '#f59e0b', fontWeight: 600 }}>
              ⚠ Upload your pitch deck or business plan above to proceed with payment.
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
            <Shield size={13} color="#10b981" /> Secured by Razorpay
          </div>
        </div>
      )}

      {/* ── AFTER PAYMENT: Application under review ── */}
      {isUnderReview && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1.5px solid #bbf7d0', borderRadius: '16px',
          padding: '24px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={22} color="#fff" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: '#15803d' }}>
                ✅ Payment Confirmed - Application Under Review
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#16a34a', lineHeight: 1.5 }}>
                Our expert panel is reviewing your idea. We'll notify you once it's evaluated.
              </p>
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '10px', border: '1px solid #bbf7d0', fontSize: '13px', color: '#15803d', fontWeight: 500, lineHeight: 1.6 }}>
            📋 You'll receive an email when your evaluation is complete. This usually takes <strong>2–5 business days</strong>.
          </div>
        </div>
      )}

      {/* ── SCHEDULED BY ADMIN: Now the user can book their slot ── */}
      {isScheduled && !evalSummary?.meeting && app?._id && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          border: '1.5px solid #bfdbfe', borderRadius: '16px',
          padding: '24px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarClock size={22} color="#fff" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: '#1e3a8a' }}>
                🎉 Idea Evaluated - Book Your 1:1 Session
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6', lineHeight: 1.5 }}>
                Our panel has reviewed your idea. Choose a slot for your expert session.
              </p>
            </div>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#1e40af', lineHeight: 1.6 }}>
            Your evaluation report will be shared during the session - available <strong>2 hours before</strong> it starts.
            Sessions run <strong>Mon–Sat, 11 AM – 6 PM</strong>.
          </p>
          <Link
            href={`/dashboard/journey/book-slot?appId=${app._id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 24px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: '#fff', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
            }}
          >
            <CalendarClock size={17} /> Book 1:1 Slot Now
          </Link>
        </div>
      )}

      {/* ── SCHEDULED: Session booked ── */}
      {isScheduled && evalSummary?.meeting && (
        <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '22px 24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <CalendarClock size={22} color="#1d4ed8" />
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e3a8a' }}>1:1 Session Booked</p>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            {new Date(evalSummary.meeting.scheduledAt).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
          <p style={{ margin: '0 0 14px', fontSize: '13.5px', color: '#3b82f6' }}>
            {evalSummary.meeting.mode === 'physical'
              ? '📍 StartupsIndia Office - In-person session'
              : '💻 Online session - Link will be shared before the meeting'}
          </p>
          <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>
            🔒 Your evaluation report will be available 2 hours before this session.
          </div>
        </div>
      )}

      {/* ── EVALUATED: Report (locked until 2h before slot, then unlocks) ── */}
      {isEvaluated && (
        <EvaluatedSection appId={app?._id} evalSummary={evalSummary} />
      )}

      {/* ── REJECTED ── */}
      {isRejected && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '16px', padding: '22px 24px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#92400e' }}>💪 Not selected this round</p>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#78350f', lineHeight: 1.6 }}>
            Your idea didn&apos;t clear evaluation this time. Review the feedback and consider reapplying with improvements.
          </p>
        </div>
      )}
    </div>
  );
}
