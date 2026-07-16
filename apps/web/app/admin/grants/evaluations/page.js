'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ClipboardCheck, CalendarClock, CheckCircle2 } from 'lucide-react';
import { listEvaluations, adminUrl } from '@/lib/grantsAdmin';

const FILTERS = [
  { id: '', label: 'All paid' },
  { id: 'pending', label: 'Awaiting scheduling' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
];

const card = {
  padding: '18px 20px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '16px',
};

export default function AdminEvaluationsPage() {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setData(null);
    const { data: res, error: err } = await listEvaluations({ scheduled: filter });
    if (err) {
      setError(err.message || 'Could not load evaluations.');
      return;
    }
    setData(res);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <Link
        href={adminUrl('/grants')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}
      >
        <ArrowLeft size={15} /> Grant Applications
      </Link>

      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 6px' }}>
        <ClipboardCheck size={23} color="#ef4444" /> Idea Evaluations
      </h1>
      <p style={{ margin: '0 0 22px', fontSize: '14px', color: '#6b7280' }}>
        Applications that have paid the evaluation fee. Schedule the meeting, then record the result.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 15px',
              borderRadius: '100px',
              border: `1.5px solid ${filter === f.id ? '#ef4444' : '#e5e7eb'}`,
              background: filter === f.id ? '#fef2f2' : '#fff',
              color: filter === f.id ? '#ef4444' : '#6b7280',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: '14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {!data ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</p>
      ) : data.items.length === 0 ? (
        <div style={{ ...card, padding: '56px 20px', textAlign: 'center' }}>
          <ClipboardCheck size={38} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#374151' }}>
            Nothing here yet
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#9ca3af' }}>
            Evaluations appear once a selected applicant pays the fee.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {data.items.map(ev => {
            const app = ev.applicationId;
            const done = Boolean(ev.submittedAt);
            const scheduled = Boolean(ev.meeting?.scheduledAt);

            return (
              <Link
                key={ev._id}
                href={adminUrl(`/grants/${app?._id}/evaluation`)}
                style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: done ? '#f0fdf4' : scheduled ? '#eff6ff' : '#fffbeb',
                    flexShrink: 0,
                  }}
                >
                  {done ? (
                    <CheckCircle2 size={19} color="#10b981" />
                  ) : (
                    <CalendarClock size={19} color={scheduled ? '#3b82f6' : '#f59e0b'} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                    {app?.startup?.name || 'Unknown startup'}
                  </p>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#9ca3af' }}>
                    {app?.applicationId} · {app?.founder?.fullName}
                    {scheduled && ` · ${new Date(ev.meeting.scheduledAt).toLocaleString('en-IN')}`}
                  </p>
                </div>

                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: '100px',
                    background: done ? '#f0fdf4' : scheduled ? '#eff6ff' : '#fffbeb',
                    color: done ? '#047857' : scheduled ? '#1d4ed8' : '#b45309',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {done
                    ? `Scored ${ev.totalScore}/${ev.maxScore}`
                    : scheduled
                      ? 'Scheduled'
                      : 'Needs scheduling'}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
