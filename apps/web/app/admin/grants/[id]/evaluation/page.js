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

const RECOMMENDATIONS = [
  { id: 'reject', label: 'Reject', tone: '#ef4444' },
  { id: 'needs_improvement', label: 'Needs Improvement', tone: '#f59e0b' },
  { id: 'recommended', label: 'Recommended', tone: '#3b82f6' },
  { id: 'funding_ready', label: 'Funding Ready', tone: '#10b981' },
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

  // Scheduling
  const [mode, setMode] = useState('google_meet');
  const [when, setWhen] = useState('');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');

  // Scoring
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('');

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
    if (data.scores) setScores(data.scores);
    if (data.comments) setComments(data.comments);
    if (data.recommendation) setRecommendation(data.recommendation);
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
      scores,
      comments,
      recommendation,
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
  const maxPer = ev.maxScorePerCriterion;

  const total = ev.criteria.reduce((sum, c) => sum + (Number(scores[c]) || 0), 0);
  const outOf = ev.criteria.length * maxPer;
  const complete = ev.criteria.every(c => scores[c] !== undefined && scores[c] !== '');

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
          <Star size={17} color="#ef4444" /> Scorecard
        </h2>
        <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: '#9ca3af' }}>
          {done
            ? 'This evaluation has been submitted.'
            : scheduled
              ? 'Score each criterion out of ' + maxPer + '.'
              : 'Schedule the meeting before recording a result.'}
        </p>

        {/* Criteria come from Grant Settings — adding one needs no code change. */}
        {ev.criteria.map(c => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ flex: 1, fontSize: '13.5px', color: '#374151', fontWeight: 500 }}>{c}</span>
            <input
              type="number"
              min={0}
              max={maxPer}
              disabled={!scheduled || done}
              value={scores[c] ?? ''}
              onChange={e => setScores({ ...scores, [c]: e.target.value === '' ? '' : Number(e.target.value) })}
              style={{ ...inputStyle, width: '90px', textAlign: 'center', fontWeight: 700 }}
            />
            <span style={{ fontSize: '12.5px', color: '#9ca3af', width: '34px' }}>/ {maxPer}</span>
          </div>
        ))}

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 15px', margin: '16px 0',
            background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '11px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Total</span>
          <span style={{ fontSize: '19px', fontWeight: 900, color: '#111827' }}>
            {total} <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>/ {outOf}</span>
          </span>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Comments</label>
          <textarea
            rows={4}
            disabled={!scheduled || done}
            value={comments}
            onChange={e => setComments(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Recommendation</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {RECOMMENDATIONS.map(r => (
              <button
                key={r.id}
                type="button"
                disabled={!scheduled || done}
                onClick={() => setRecommendation(r.id)}
                style={{
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: `1.5px solid ${recommendation === r.id ? r.tone : '#e5e7eb'}`,
                  background: recommendation === r.id ? `${r.tone}12` : '#fff',
                  color: recommendation === r.id ? r.tone : '#6b7280',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: !scheduled || done ? 'default' : 'pointer',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {done ? (
          <p style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: 0, fontSize: '13.5px', color: '#047857', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Submitted on {new Date(ev.submittedAt).toLocaleString('en-IN')}
          </p>
        ) : (
          <button
            type="button"
            onClick={doSubmit}
            disabled={busy || !scheduled || !complete || !recommendation}
            style={{
              padding: '12px 24px', borderRadius: '11px', border: 'none',
              background:
                busy || !scheduled || !complete || !recommendation
                  ? '#f3f4f6'
                  : 'linear-gradient(135deg,#e63946,#ff6b6b)',
              color: busy || !scheduled || !complete || !recommendation ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: '14px',
              cursor: busy || !scheduled || !complete || !recommendation ? 'default' : 'pointer',
            }}
          >
            {busy ? 'Submitting…' : 'Submit evaluation'}
          </button>
        )}
      </div>
    </div>
  );
}
