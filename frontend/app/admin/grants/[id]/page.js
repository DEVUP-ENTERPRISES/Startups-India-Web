'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, FileText, Download, AlertCircle, Save, MessageSquare, Unlock, Lock, Star, Trash2,
} from 'lucide-react';
import {
  getGrantApplication, getStatusMachine, changeStatus, saveInternalNotes,
  addComment, setRevisionAllowed, getAdminDocumentUrl, adminUrl, submitScore,
} from '@/lib/grantsAdmin';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/grants/StatusBadge';
import Timeline from '@/components/grants/Timeline';

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

const REASON_REQUIRED = ['rejected', 'changes_requested'];
// Hide "under_review" - happens automatically after payment, no manual trigger needed
const HIDDEN_ACTIONS = ['under_review', 'shortlisted'];

export default function AdminGrantDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [app, setApp] = useState(null);
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [comment, setComment] = useState('');
  const [savedFlash, setSavedFlash] = useState('');

  // Score panel
  const [showScorePanel, setShowScorePanel] = useState(false);
  const [scoreInput, setScoreInput] = useState('');
  const [scoreFeedback, setScoreFeedback] = useState('');
  const [scoring, setScoring] = useState(false);

  // Delete / reset
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await getGrantApplication(id);
    if (err) { setError(err.message || 'Could not load this application.'); return; }
    setApp(data);
    setNotes(data.internalNotes || '');
  }, [id]);

  useEffect(() => {
    load();
    getStatusMachine().then(({ data }) => setMachine(data));
  }, [load]);

  const flash = msg => { setSavedFlash(msg); setTimeout(() => setSavedFlash(''), 2500); };

  const applyStatus = async () => {
    if (REASON_REQUIRED.includes(pending) && !reason.trim()) {
      setError('Please give a reason - it is recorded on the timeline and sent to the applicant.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: err } = await changeStatus(id, { status: pending, reason: reason.trim() });
    setBusy(false);
    if (err) { setError(err.message || 'Could not update the status.'); return; }
    setPending(null);
    setReason('');
    await load();
    flash('Status updated and the applicant was notified.');
  };

  const applyScore = async () => {
    const n = Number(scoreInput);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      setError('Enter a score between 0 and 100.');
      return;
    }
    setScoring(true);
    setError('');
    const { error: err } = await submitScore(id, { score: n, feedback: scoreFeedback.trim() });
    setScoring(false);
    if (err) { setError(err.message || 'Could not submit score.'); return; }
    setShowScorePanel(false);
    setScoreInput('');
    setScoreFeedback('');
    await load();
    flash(`Score ${n}/100 submitted - user notified and stages unlocked.`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    // Hard-delete the grant application and all related docs/payments
    const { error: err } = await apiFetch(
      `/api/v1/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}/grants/applications/${id}`,
      { method: 'DELETE' }
    );
    setDeleting(false);
    if (err) { setError(err.message || 'Could not delete the application.'); setShowDeleteConfirm(false); return; }
    router.push(adminUrl('/grants'));
  };

  const openDocument = async docId => {
    const { data, error: err } = await getAdminDocumentUrl(docId);
    if (err) { setError(err.message || 'Could not open that document.'); return; }
    window.open(data.url, '_blank', 'noopener,noreferrer');
  };

  if (error && !app) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <AlertCircle size={38} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: '#6b7280' }}>{error}</p>
        <Link href={adminUrl('/grants')} style={{ color: '#ef4444', fontWeight: 600 }}>Back to applications</Link>
      </div>
    );
  }

  if (!app || !machine) {
    return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>;
  }

  const nextStates = (machine.transitions[app.status] || []).filter(s => !HIDDEN_ACTIONS.includes(s));

  // Score button appears when app is paid/submitted/under_review - admin reviews and scores
  const canScore = ['submitted', 'under_review', 'idea_evaluation_paid', 'evaluation_scheduled',
    'idea_evaluation_pending'].includes(app.status);

  // Score badge for display
  const scoreLabel = scoreInput !== '' && Number.isFinite(Number(scoreInput))
    ? Number(scoreInput) >= 75
      ? '🚀 Pre-Inc + Incubation + Accelerator'
      : Number(scoreInput) >= 51
        ? '🏢 Pre-Inc + Incubation'
        : Number(scoreInput) >= 1
          ? '🎓 Pre-Incubation only'
          : '❌ Rejected'
    : null;

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <Link href={adminUrl('/grants')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}>
        <ArrowLeft size={15} /> Applications
      </Link>

      {savedFlash && (
        <div style={{ padding: '11px 16px', marginBottom: '14px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', color: '#047857', fontSize: '13px', fontWeight: 600 }}>
          {savedFlash}
        </div>
      )}
      {error && (
        <div style={{ padding: '11px 16px', marginBottom: '14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '23px', fontWeight: 900, color: '#111827', margin: 0 }}>{app.startup?.name}</h1>
            <StatusBadge status={app.status} label={app.statusLabel} />
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
            {app.applicationId} · {app.founder?.fullName} · {app.founder?.email} · {app.founder?.phone}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" disabled={busy}
            onClick={async () => {
              setBusy(true);
              await setRevisionAllowed(id, !app.revisionAllowed);
              setBusy(false);
              await load();
              flash(app.revisionAllowed ? 'Editing locked.' : 'The applicant can now edit.');
            }}
            style={{ ...inputStyle, width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}>
            {app.revisionAllowed ? <Lock size={14} /> : <Unlock size={14} />}
            {app.revisionAllowed ? 'Lock editing' : 'Allow revision'}
          </button>
          <button type="button" onClick={() => { setShowDeleteConfirm(true); setError(''); }}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #fee2e2', background: '#fff', color: '#ef4444', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Trash2 size={14} /> Delete & Reset
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div style={{ ...card, background: '#fef2f2', border: '1.5px solid #fecaca' }}>
          <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#b91c1c' }}>⚠ Delete this application?</p>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#6b7280' }}>
            This permanently deletes the application, all documents, and payment records.
            The user will need to complete Stage 2 again from scratch.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={handleDelete} disabled={deleting}
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              {deleting ? 'Deleting…' : 'Yes, Delete & Reset'}
            </button>
            <button type="button" onClick={() => setShowDeleteConfirm(false)}
              style={{ ...inputStyle, width: 'auto', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Actions</h2>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Score & Approve - replaces shortlisted */}
          {canScore && !showScorePanel && (
            <button type="button" onClick={() => { setShowScorePanel(true); setPending(null); setError(''); }}
              style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #dbeafe', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} /> Score & Approve
            </button>
          )}
          {/* Other action buttons (under_review and shortlisted hidden) */}
          {nextStates.map(s => (
            <button key={s} type="button" disabled={busy}
              onClick={() => { setPending(s); setReason(''); setError(''); setShowScorePanel(false); }}
              style={{ padding: '10px 16px', borderRadius: '10px', border: `1.5px solid ${s === 'rejected' ? '#fee2e2' : '#e5e7eb'}`, background: '#fff', color: s === 'rejected' ? '#ef4444' : '#374151', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              Mark {machine.labels[s]}
            </button>
          ))}
          {nextStates.length === 0 && !canScore && (
            <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>
              This application is {app.statusLabel?.toLowerCase()} - no further actions available.
            </p>
          )}
        </div>

        {/* Score panel */}
        {showScorePanel && (
          <div style={{ marginTop: '16px', padding: '20px', background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '14px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#0c4a6e' }}>
              Score this application (0–100)
            </p>
            <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: '#0369a1' }}>
              &lt;50 = Pre-Incubation only &nbsp;·&nbsp; 51–74 = Pre-Inc + Incubation &nbsp;·&nbsp; 75+ = Pre-Inc + Incubation + Accelerator
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <input type="number" min="0" max="100" placeholder="0–100"
                value={scoreInput} onChange={e => setScoreInput(e.target.value)}
                style={{ ...inputStyle, width: '130px', fontSize: '28px', fontWeight: 900, textAlign: 'center', padding: '10px' }}
              />
              <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>/ 100</span>
              {scoreLabel && (
                <span style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 700,
                  background: Number(scoreInput) >= 75 ? '#fef3c7' : Number(scoreInput) >= 51 ? '#dbeafe' : Number(scoreInput) >= 1 ? '#dcfce7' : '#fef2f2',
                  color: Number(scoreInput) >= 75 ? '#d97706' : Number(scoreInput) >= 51 ? '#1d4ed8' : Number(scoreInput) >= 1 ? '#15803d' : '#dc2626',
                }}>
                  {scoreLabel}
                </span>
              )}
            </div>
            <textarea rows={3} placeholder="Feedback for the applicant (optional if passing, required if 0)"
              value={scoreFeedback} onChange={e => setScoreFeedback(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={applyScore} disabled={scoring || scoreInput === ''}
                style={{ padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: scoring || scoreInput === '' ? '#f1f5f9' : 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                  color: scoring || scoreInput === '' ? '#94a3b8' : '#fff',
                  fontWeight: 700, fontSize: '13px', cursor: scoring || scoreInput === '' ? 'default' : 'pointer' }}>
                {scoring ? 'Submitting…' : 'Submit Score & Notify User'}
              </button>
              <button type="button" onClick={() => { setShowScorePanel(false); setScoreInput(''); setScoreFeedback(''); }}
                style={{ ...inputStyle, width: 'auto', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Generic status confirmation */}
        {pending && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
              Move to &quot;{machine.labels[pending]}&quot;?
            </p>
            <textarea rows={3}
              placeholder={REASON_REQUIRED.includes(pending) ? 'Reason (required - shared with the applicant)' : 'Reason (optional - shared with the applicant)'}
              value={reason} onChange={e => setReason(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={applyStatus} disabled={busy}
                style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                {busy ? 'Applying…' : 'Confirm'}
              </button>
              <button type="button" onClick={() => { setPending(null); setReason(''); }}
                style={{ ...inputStyle, width: 'auto', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              The applicant is notified automatically and this is recorded on the timeline.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '16px' }}>
        {/* Application details */}
        <div>
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Application</h2>
            {[
              ['Stage', app.startup?.stage],
              ['Category', app.startup?.category],
              ['Team Size', app.startup?.teamSize],
              ['College', app.founder?.collegeName],
              ['City', [app.founder?.city, app.founder?.state].filter(Boolean).join(', ')],
              ['Problem', app.startup?.problemStatement],
              ['Solution', app.startup?.solution],
              ['Target Audience', app.startup?.targetAudience],
              ['Business Model', app.startup?.businessModel],
              ['Traction', app.startup?.traction],
              ['Funding Raised', app.startup?.fundingRaised],
              ['Website', app.startup?.website],
              ['LinkedIn', app.startup?.linkedin],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
                <span style={{ minWidth: '120px', color: '#9ca3af', flexShrink: 0 }}>{k}</span>
                <span style={{ color: '#374151', wordBreak: 'break-word' }}>{v}</span>
              </div>
            ))}
          </div>

          {app.userProfile && (
            <div style={card}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>
                Registration Profile ({app.userProfile.role})
              </h2>
              {app.userProfile.dynamicProfileData && Object.keys(app.userProfile.dynamicProfileData).length > 0
                ? Object.entries(app.userProfile.dynamicProfileData)
                    .filter(([k]) => !['profilePhoto', 'resume', 'certificates', 'stateId', 'cityId', 'collegeId'].includes(k))
                    .map(([key, val]) => {
                      const humanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                      const display = Array.isArray(val) ? val.join(', ') : typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val ?? '');
                      if (!display) return null;
                      return (
                        <div key={key} style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
                          <span style={{ minWidth: '120px', color: '#9ca3af', flexShrink: 0 }}>{humanKey}</span>
                          <span style={{ color: '#374151', wordBreak: 'break-word' }}>{display}</span>
                        </div>
                      );
                    })
                : <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>No registration profile found.</p>
              }
            </div>
          )}

          {/* Documents */}
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Documents</h2>
            {app.documents?.length === 0
              ? <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>No documents uploaded.</p>
              : app.documents.map(d => (
                  <button key={d._id} type="button" onClick={() => openDocument(d._id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 13px', marginBottom: '8px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
                    <FileText size={16} color="#6b7280" />
                    <span style={{ flex: 1, minWidth: 0, fontSize: '13px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.fileName}</span>
                    <span style={{ fontSize: '11.5px', color: '#9ca3af' }}>{d.kind.replace(/_/g, ' ')}</span>
                    <Download size={14} color="#9ca3af" />
                  </button>
                ))
            }
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>Internal Notes</h2>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#9ca3af' }}>Only admins can see this.</p>
            <textarea rows={5} value={notes} onChange={e => setNotes(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }} />
            <button type="button" disabled={busy}
              onClick={async () => {
                setBusy(true);
                const { error: err } = await saveInternalNotes(id, notes);
                setBusy(false);
                if (err) { setError(err.message); return; }
                flash('Notes saved.');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
              <Save size={14} /> Save notes
            </button>
          </div>

          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>Reviewer Comments</h2>
            <textarea rows={3} placeholder="Add a comment…" value={comment} onChange={e => setComment(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button type="button" disabled={busy || !comment.trim()}
                onClick={async () => {
                  setBusy(true);
                  await addComment(id, { comment: comment.trim(), visibleToStudent: false });
                  setBusy(false); setComment(''); await load(); flash('Internal comment added.');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: '12.5px', color: '#374151', cursor: 'pointer' }}>
                <MessageSquare size={13} /> Add internal
              </button>
              <button type="button" disabled={busy || !comment.trim()}
                onClick={async () => {
                  setBusy(true);
                  await addComment(id, { comment: comment.trim(), visibleToStudent: true });
                  setBusy(false); setComment(''); await load(); flash('Comment shared with applicant.');
                }}
                style={{ padding: '9px 14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}>
                Share with applicant
              </button>
            </div>
            {app.comments?.map(c => (
              <div key={c._id} style={{ padding: '11px 13px', marginBottom: '8px', background: c.visibleToStudent ? '#f0fdf4' : '#fafafa', border: `1px solid ${c.visibleToStudent ? '#dcfce7' : '#f0f0f0'}`, borderRadius: '10px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{c.comment}</p>
                <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>
                  {c.authorId?.fullName || 'Admin'} · {new Date(c.createdAt).toLocaleString('en-IN')}
                  {c.visibleToStudent ? ' · shared' : ' · internal'}
                </p>
              </div>
            ))}
          </div>

          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Timeline</h2>
            <Timeline entries={app.timeline || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
