'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, FileText, Download, AlertCircle, Save, MessageSquare, Unlock, Lock,
} from 'lucide-react';
import {
  getGrantApplication, getStatusMachine, changeStatus, saveInternalNotes,
  addComment, setRevisionAllowed, getAdminDocumentUrl, adminUrl,
} from '@/lib/grantsAdmin';
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

// Transitions that need an explanation. Rejecting someone without a recorded
// reason is how a review process becomes unaccountable.
const REASON_REQUIRED = ['rejected', 'changes_requested'];

export default function AdminGrantDetailPage() {
  const { id } = useParams();

  const [app, setApp] = useState(null);
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [pending, setPending] = useState(null); // status awaiting confirmation
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [comment, setComment] = useState('');
  const [savedFlash, setSavedFlash] = useState('');

  const load = useCallback(async () => {
    const { data, error: err } = await getGrantApplication(id);
    if (err) {
      setError(err.message || 'Could not load this application.');
      return;
    }
    setApp(data);
    setNotes(data.internalNotes || '');
  }, [id]);

  useEffect(() => {
    load();
    getStatusMachine().then(({ data }) => setMachine(data));
  }, [load]);

  const flash = msg => {
    setSavedFlash(msg);
    setTimeout(() => setSavedFlash(''), 2500);
  };

  const applyStatus = async () => {
    if (REASON_REQUIRED.includes(pending) && !reason.trim()) {
      setError('Please give a reason — it is recorded on the timeline and sent to the applicant.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: err } = await changeStatus(id, { status: pending, reason: reason.trim() });
    setBusy(false);

    if (err) {
      setError(err.message || 'Could not update the status.');
      return;
    }
    setPending(null);
    setReason('');
    await load();
    flash('Status updated and the applicant was notified.');
  };

  const openDocument = async docId => {
    const { data, error: err } = await getAdminDocumentUrl(docId);
    if (err) {
      setError(err.message || 'Could not open that document.');
      return;
    }
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

  // Only legal next states are offered. The UI cannot invent an action the
  // backend would reject — the machine is the single authority.
  const nextStates = machine.transitions[app.status] || [];

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <Link
        href={adminUrl('/grants')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}
      >
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
            <h1 style={{ fontSize: '23px', fontWeight: 900, color: '#111827', margin: 0 }}>
              {app.startup?.name}
            </h1>
            <StatusBadge status={app.status} label={app.statusLabel} />
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
            {app.applicationId} · {app.founder?.fullName} · {app.founder?.email} · {app.founder?.phone}
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            setBusy(true);
            await setRevisionAllowed(id, !app.revisionAllowed);
            setBusy(false);
            await load();
            flash(app.revisionAllowed ? 'Editing locked.' : 'The applicant can now edit.');
          }}
          disabled={busy}
          style={{ ...inputStyle, width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}
        >
          {app.revisionAllowed ? <Lock size={14} /> : <Unlock size={14} />}
          {app.revisionAllowed ? 'Lock editing' : 'Allow revision'}
        </button>
      </div>

      {/* Actions */}
      <div style={card}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>
          Actions
        </h2>

        {nextStates.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>
            This application is {app.statusLabel.toLowerCase()} — no further actions are available.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {nextStates.map(s => {
              const danger = s === 'rejected';
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setPending(s); setReason(''); setError(''); }}
                  disabled={busy}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: `1.5px solid ${danger ? '#fee2e2' : '#e5e7eb'}`,
                    background: '#fff',
                    color: danger ? '#ef4444' : '#374151',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Mark {machine.labels[s]}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation — irreversible-ish actions get a reason box, not a bare click. */}
        {pending && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
              Move to “{machine.labels[pending]}”?
            </p>
            <textarea
              rows={3}
              placeholder={
                REASON_REQUIRED.includes(pending)
                  ? 'Reason (required — shared with the applicant)'
                  : 'Reason (optional — shared with the applicant)'
              }
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={applyStatus}
                disabled={busy}
                style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                {busy ? 'Applying…' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => { setPending(null); setReason(''); }}
                style={{ ...inputStyle, width: 'auto', fontWeight: 600, cursor: 'pointer' }}
              >
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
        {/* Application */}
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
              ['Demo Video', app.startup?.demoVideoUrl],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
                  <span style={{ minWidth: '120px', color: '#9ca3af', flexShrink: 0 }}>{k}</span>
                  <span style={{ color: '#374151', wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
          </div>

          {app.userProfile && (
            <div style={card}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>
                User Registration Profile ({app.userProfile.role})
              </h2>
              {app.userProfile.dynamicProfileData && Object.keys(app.userProfile.dynamicProfileData).length > 0 ? (
                Object.entries(app.userProfile.dynamicProfileData)
                  .filter(([k]) => !['profilePhoto', 'resume', 'certificates'].includes(k)) // exclude binary/large files
                  .map(([key, val]) => {
                    const humanKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    let displayVal = val;
                    if (Array.isArray(val)) {
                      displayVal = val.join(', ');
                    } else if (typeof val === 'boolean') {
                      displayVal = val ? 'Yes' : 'No';
                    } else if (typeof val === 'object' && val !== null) {
                      displayVal = JSON.stringify(val);
                    }

                    return (
                      <div key={key} style={{ display: 'flex', gap: '12px', marginBottom: '9px', fontSize: '13.5px', lineHeight: 1.6 }}>
                        <span style={{ minWidth: '120px', color: '#9ca3af', flexShrink: 0 }}>{humanKey}</span>
                        <span style={{ color: '#374151', wordBreak: 'break-word' }}>{displayVal || '-'}</span>
                      </div>
                    );
                  })
              ) : (
                <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>No registration profile details found.</p>
              )}
            </div>
          )}

          {/* Documents */}
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Documents</h2>
            {app.documents?.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13.5px', color: '#9ca3af' }}>No documents uploaded.</p>
            ) : (
              app.documents.map(d => (
                <button
                  key={d._id}
                  type="button"
                  onClick={() => openDocument(d._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 13px', marginBottom: '8px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}
                >
                  <FileText size={16} color="#6b7280" />
                  <span style={{ flex: 1, minWidth: 0, fontSize: '13px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.fileName}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#9ca3af' }}>{d.kind.replace(/_/g, ' ')}</span>
                  <Download size={14} color="#9ca3af" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Internal notes — admin only; never returned on a student route. */}
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>Internal Notes</h2>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#9ca3af' }}>
              Only admins can see this. The applicant never does.
            </p>
            <textarea
              rows={5}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }}
            />
            <button
              type="button"
              onClick={async () => {
                setBusy(true);
                const { error: err } = await saveInternalNotes(id, notes);
                setBusy(false);
                if (err) { setError(err.message); return; }
                flash('Internal notes saved.');
              }}
              disabled={busy}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: '13px', color: '#374151', cursor: 'pointer' }}
            >
              <Save size={14} /> Save notes
            </button>
          </div>

          {/* Reviewer comments */}
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>Reviewer Comments</h2>

            <textarea
              rows={3}
              placeholder="Add a comment…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                disabled={busy || !comment.trim()}
                onClick={async () => {
                  setBusy(true);
                  await addComment(id, { comment: comment.trim(), visibleToStudent: false });
                  setBusy(false);
                  setComment('');
                  await load();
                  flash('Internal comment added.');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: '12.5px', color: '#374151', cursor: 'pointer' }}
              >
                <MessageSquare size={13} /> Add internal
              </button>
              <button
                type="button"
                disabled={busy || !comment.trim()}
                onClick={async () => {
                  setBusy(true);
                  await addComment(id, { comment: comment.trim(), visibleToStudent: true });
                  setBusy(false);
                  setComment('');
                  await load();
                  flash('Comment shared with the applicant.');
                }}
                style={{ padding: '9px 14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
              >
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

          {/* Timeline */}
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Timeline</h2>
            <Timeline entries={app.timeline || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
