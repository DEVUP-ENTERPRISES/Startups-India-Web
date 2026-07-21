'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { getEvaluation, scheduleMeeting, submitEvaluationResult, adminUrl } from '@/lib/grantsAdmin';

const MODES = [
  { id: 'google_meet', label: 'Google Meet' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'physical', label: 'In person' },
];

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

export default function AdminEvaluationPage() {
  const { id } = useParams();

  const [ev, setEv] = useState(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [busy, setBusy] = useState(false);

  // Scheduling — default to an in-person (offline) meet.
  const [mode, setMode] = useState('physical');
  const [when, setWhen] = useState('');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');

  // Scoring — single 0–100 mark + feedback.
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    const { data, error: err } = await getEvaluation(id);
    if (err) {
      setError(err.message || 'Could not load the evaluation.');
      return;
    }
    setEv(data);
    if (data.meeting?.mode) setMode(data.meeting.mode);
    if (data.meeting?.link) setLink(data.meeting.link);
    if (data.meeting?.location) setLocation(data.meeting.location);
    if (data.meeting?.scheduledAt) {
      setWhen(new Date(data.meeting.scheduledAt).toISOString().slice(0, 16));
    }
    if (data.score !== null && data.score !== undefined) setScore(String(data.score));
    if (data.feedback) setFeedback(data.feedback);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const say = m => { setFlash(m); setTimeout(() => setFlash(''), 2600); };

  const doSchedule = async () => {
    setBusy(true);
    setError('');
    const { error: err } = await scheduleMeeting(id, {
      mode,
      scheduledAt: when ? new Date(when).toISOString() : '',
      link: mode === 'physical' ? '' : link,
      location: mode === 'physical' ? location : '',
    });
    setBusy(false);
    if (err) { setError(err.message || 'Could not schedule the meeting.'); return; }
    await load();
    say('Meeting scheduled — the applicant has been notified.');
  };

  const doSubmit = async () => {
    setBusy(true);
    setError('');
    const { error: err } = await submitEvaluationResult(id, {
      score: Number(score),
      feedback,
    });
    setBusy(false);
    if (err) { setError(err.message || 'Could not submit the result.'); return; }
    await load();
    say('Evaluation recorded.');
  };

  if (error && !ev) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <AlertCircle size={38} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: '#6b7280' }}>{error}</p>
        <Link href={adminUrl('/grants/evaluations')} style={{ color: '#ef4444', fontWeight: 600 }}>Back to evaluations</Link>
      </div>
    );
  }

  if (!ev) return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>;

  const scheduled = Boolean(ev.meeting?.scheduledAt);
  const done = Boolean(ev.submittedAt);
  const threshold = ev.passThreshold ?? 50;

  const scoreNum = score === '' ? null : Number(score);
  const willPass = scoreNum !== null && scoreNum >= threshold;
  const scoreValid = scoreNum !== null && scoreNum >= 0 && scoreNum <= 100;
  // Feedback is mandatory when the applicant won't pass (they get it as suggestions).
  const complete = scoreValid && (willPass || feedback.trim().length > 0);

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 780, margin: '0 auto' }}>
      <Link
        href={adminUrl('/grants/evaluations')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}
      >
        <ArrowLeft size={15} /> Evaluations
      </Link>

      <h1 style={{ fontSize: '25px', fontWeight: 900, color: '#111827', margin: '0 0 22px' }}>
        Idea Evaluation
      </h1>

      {flash && (
        <div style={{ padding: '11px 16px', marginBottom: '14px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', color: '#047857', fontSize: '13px', fontWeight: 600 }}>
          {flash}
        </div>
      )}
      {error && (
        <div style={{ padding: '11px 16px', marginBottom: '14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Scheduling */}
      <div style={card}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
          <CalendarClock size={17} color="#ef4444" /> Meeting
        </h2>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Mode</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {MODES.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: `1.5px solid ${mode === m.id ? '#ef4444' : '#e5e7eb'}`,
                  background: mode === m.id ? '#fef2f2' : '#fff',
                  color: mode === m.id ? '#ef4444' : '#6b7280',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Date &amp; time
          </label>
          <input type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} style={inputStyle} />
        </div>

        {mode === 'physical' ? (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Office address" style={inputStyle} />
          </div>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Meeting link</label>
            <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://" style={inputStyle} />
          </div>
        )}

        <button
          type="button"
          onClick={doSchedule}
          disabled={busy || !when}
          style={{
            padding: '11px 22px', borderRadius: '11px', border: 'none',
            background: busy || !when ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
            color: busy || !when ? '#9ca3af' : '#fff',
            fontWeight: 700, fontSize: '13.5px',
            cursor: busy || !when ? 'default' : 'pointer',
          }}
        >
          {busy ? 'Saving…' : scheduled ? 'Reschedule' : 'Schedule meeting'}
        </button>
      </div>

      {/* Scoring */}
      <div style={{ ...card, opacity: scheduled ? 1 : 0.55 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
          <Star size={17} color="#ef4444" /> Score the idea
        </h2>
        <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: '#9ca3af' }}>
          {done
            ? 'This evaluation has been submitted.'
            : scheduled
              ? `Allocate a mark out of 100. ${threshold} or above passes to the next phases.`
              : 'Schedule the evaluation meet before recording a result.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <input
            type="number" min={0} max={100} disabled={!scheduled || done}
            value={score} onChange={e => setScore(e.target.value)}
            placeholder="0–100"
            style={{ ...inputStyle, width: 120, textAlign: 'center', fontSize: 24, fontWeight: 900, padding: '10px' }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#9ca3af' }}>/ 100</span>
          {scoreValid && (
            <span style={{ padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 800, background: willPass ? '#dcfce7' : '#fef3c7', color: willPass ? '#166534' : '#b45309' }}>
              {willPass ? `Passes (≥ ${threshold}) → advances` : `Below ${threshold} → not selected`}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Feedback {willPass ? '(optional)' : '(required — shown to the applicant as suggestions)'}
          </label>
          <textarea
            rows={4} disabled={!scheduled || done}
            value={feedback} onChange={e => setFeedback(e.target.value)}
            placeholder={willPass ? 'Optional note for the applicant.' : 'What should they improve? This is shown to them.'}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {done ? (
          <p style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: 0, fontSize: '13.5px', color: ev.passed ? '#047857' : '#b45309', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Scored {ev.score}/100 — {ev.passed ? 'Passed' : 'Not selected'} · {new Date(ev.submittedAt).toLocaleString('en-IN')}
          </p>
        ) : (
          <button
            type="button"
            onClick={doSubmit}
            disabled={busy || !scheduled || !complete}
            style={{
              padding: '12px 24px', borderRadius: '11px', border: 'none',
              background: busy || !scheduled || !complete ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
              color: busy || !scheduled || !complete ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: '14px',
              cursor: busy || !scheduled || !complete ? 'default' : 'pointer',
            }}
          >
            {busy ? 'Submitting…' : 'Submit evaluation'}
          </button>
        )}
      </div>
    </div>
  );
}
