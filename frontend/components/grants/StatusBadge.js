'use client';

/**
 * Status pill.
 *
 * The label is passed in (it comes from the API's statusLabels, which come from
 * the status machine) - this component only decides the colour. Duplicating the
 * label text here would let the UI drift out of sync with the backend the first
 * time a status was renamed.
 */

// Tone by lifecycle phase, not by individual status: a new status added to the
// machine falls back to neutral rather than crashing or rendering unstyled.
const TONES = {
  draft: 'neutral',
  submitted: 'info',
  under_review: 'info',
  changes_requested: 'warn',
  shortlisted: 'good',
  selected: 'good',
  idea_evaluation_pending: 'warn',
  idea_evaluation_paid: 'good',
  evaluation_scheduled: 'info',
  evaluation_completed: 'info',
  funding_process_started: 'good',
  grant_approved: 'good',
  completed: 'good',
  rejected: 'bad',
};

const STYLES = {
  neutral: { bg: '#f3f4f6', fg: '#4b5563', dot: '#9ca3af' },
  info: { bg: '#eff6ff', fg: '#1d4ed8', dot: '#3b82f6' },
  good: { bg: '#f0fdf4', fg: '#047857', dot: '#10b981' },
  warn: { bg: '#fffbeb', fg: '#b45309', dot: '#f59e0b' },
  bad: { bg: '#fef2f2', fg: '#b91c1c', dot: '#ef4444' },
};

export default function StatusBadge({ status, label, size = 'md' }) {
  const tone = STYLES[TONES[status] || 'neutral'];
  const small = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: small ? '5px' : '7px',
        padding: small ? '3px 9px' : '5px 12px',
        borderRadius: '100px',
        background: tone.bg,
        color: tone.fg,
        fontSize: small ? '11.5px' : '12.5px',
        fontWeight: 700,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: small ? '5px' : '6px',
          height: small ? '5px' : '6px',
          borderRadius: '50%',
          background: tone.dot,
          flexShrink: 0,
        }}
      />
      {label || status}
    </span>
  );
}
