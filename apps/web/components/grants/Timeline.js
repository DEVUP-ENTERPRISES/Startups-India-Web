'use client';

import { Clock, CheckCircle2, XCircle, FileUp, MessageSquare, CreditCard, CalendarClock } from 'lucide-react';

// Icon per timeline event. Unknown events fall back to a clock rather than
// rendering nothing — the backend can add events without breaking this view.
const EVENT_ICONS = {
  created: Clock,
  submitted: CheckCircle2,
  status_changed: Clock,
  document_uploaded: FileUp,
  document_removed: FileUp,
  comment_added: MessageSquare,
  payment_completed: CreditCard,
  meeting_scheduled: CalendarClock,
  revision_enabled: FileUp,
};

function formatWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Timeline({ entries = [] }) {
  if (entries.length === 0) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
        Nothing has happened on this application yet.
      </p>
    );
  }

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
      {entries.map((e, i) => {
        const Icon = EVENT_ICONS[e.event] || Clock;
        const isRejection = e.toStatus === 'rejected';
        const last = i === entries.length - 1;

        return (
          <li key={e._id || i} style={{ display: 'flex', gap: '14px', paddingBottom: last ? 0 : '22px', position: 'relative' }}>
            {/* Connector */}
            {!last && (
              <span
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '32px',
                  bottom: 0,
                  width: '2px',
                  background: '#f0f0f0',
                }}
              />
            )}

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isRejection ? '#fef2f2' : '#f9fafb',
                border: `1.5px solid ${isRejection ? '#fee2e2' : '#f0f0f0'}`,
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              {isRejection ? (
                <XCircle size={15} color="#ef4444" />
              ) : (
                <Icon size={15} color="#6b7280" />
              )}
            </span>

            <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: 1.5 }}>
                {e.message}
              </p>

              {e.reason && (
                <p
                  style={{
                    margin: '6px 0 0',
                    padding: '8px 12px',
                    background: '#f9fafb',
                    borderLeft: '3px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#4b5563',
                    lineHeight: 1.6,
                  }}
                >
                  {e.reason}
                </p>
              )}

              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                {formatWhen(e.createdAt)}
                {e.actorId?.fullName ? ` · ${e.actorId.fullName}` : ''}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
