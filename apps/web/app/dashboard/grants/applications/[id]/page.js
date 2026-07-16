'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, FileText, Download, CheckCircle2, Pencil, AlertCircle, CreditCard,
} from 'lucide-react';
import { getApplication, getDocumentUrl } from '@/lib/grants';
import StatusBadge from '@/components/grants/StatusBadge';
import Timeline from '@/components/grants/Timeline';

function Skeleton() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? '80px' : '200px',
            marginBottom: '18px',
            background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'grantShimmer 1.4s infinite',
            borderRadius: '18px',
          }}
        />
      ))}
      <style>{`@keyframes grantShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

const card = {
  padding: '24px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '20px',
  marginBottom: '18px',
};

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const justSubmitted = searchParams.get('submitted') === '1';

  const [app, setApp] = useState(null);
  const [error, setError] = useState('');
  const [celebrate, setCelebrate] = useState(justSubmitted);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getApplication(id);
      if (err) {
        setError(err.message || 'Could not load this application.');
        return;
      }
      setApp(data);
    })();
  }, [id]);

  useEffect(() => {
    if (!celebrate) return undefined;
    const t = setTimeout(() => setCelebrate(false), 4000);
    return () => clearTimeout(t);
  }, [celebrate]);

  const openDocument = async docId => {
    // Links are signed on demand and expire — we never hold a permanent URL.
    const { data, error: err } = await getDocumentUrl(docId);
    if (err) {
      setError(err.message || 'Could not open that document.');
      return;
    }
    window.open(data.url, '_blank', 'noopener,noreferrer');
  };

  if (error && !app) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#6b7280', fontSize: '15px' }}>{error}</p>
        <Link href="/dashboard/grants/applications" style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px' }}>
          Back to my applications
        </Link>
      </div>
    );
  }

  if (!app) return <Skeleton />;

  // The student's next action, derived from status — never a hardcoded step list.
  const needsPayment = app.status === 'selected' || app.status === 'idea_evaluation_pending';
  const canEdit = app.editable;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link
        href="/dashboard/grants/applications"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#6b7280', fontSize: '13.5px', fontWeight: 600,
          textDecoration: 'none', marginBottom: '20px',
        }}
      >
        <ArrowLeft size={15} /> My Applications
      </Link>

      {celebrate && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px 20px', marginBottom: '18px',
            background: '#f0fdf4', border: '1px solid #dcfce7',
            borderRadius: '16px',
            animation: 'grantPop .4s ease-out',
          }}
        >
          <CheckCircle2 size={22} color="#10b981" />
          <div>
            <p style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#065f46' }}>
              Application submitted
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#047857' }}>
              We&apos;ve received it. You&apos;ll be notified as the status changes.
            </p>
          </div>
          <style>{`@keyframes grantPop{0%{opacity:0;transform:scale(.96) translateY(-6px)}100%{opacity:1;transform:none}}`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.4px' }}>
              {app.startup?.name}
            </h1>
            <StatusBadge status={app.status} label={app.statusLabel} />
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
            {app.applicationId}
            {app.submittedAt &&
              ` · Submitted ${new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>
        </div>

        {canEdit && (
          <Link
            href="/dashboard/grants"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '12px',
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#374151', fontWeight: 600, fontSize: '13.5px', textDecoration: 'none',
            }}
          >
            <Pencil size={14} /> Edit
          </Link>
        )}
      </div>

      {/* Next action */}
      {needsPayment && (
        <div
          style={{
            ...card,
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'linear-gradient(135deg,#fff5f5,#fff)',
            border: '1px solid #fee2e2',
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '44px', height: '44px', borderRadius: '12px',
              background: '#fef2f2', flexShrink: 0,
            }}
          >
            <CreditCard size={20} color="#ef4444" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: '#111827' }}>
              Congratulations — you&apos;ve been selected
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '13.5px', color: '#6b7280', lineHeight: 1.6 }}>
              Complete your Idea Evaluation to continue to the funding stage.
            </p>
          </div>
          <Link
            href={`/dashboard/grants/applications/${app._id}/evaluation`}
            style={{
              padding: '11px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#e63946,#ff6b6b)',
              color: '#fff', fontWeight: 700, fontSize: '13.5px',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Proceed to Idea Evaluation
          </Link>
        </div>
      )}

      {/* Documents */}
      <div style={card}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
          Documents
        </h2>
        {app.documents?.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>No documents uploaded.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {app.documents.map(doc => (
              <button
                key={doc._id}
                type="button"
                onClick={() => openDocument(doc._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', width: '100%',
                  background: '#fafafa', border: '1px solid #f0f0f0',
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <FileText size={17} color="#6b7280" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, fontSize: '13.5px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.fileName}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af', flexShrink: 0 }}>
                  {doc.kind.replace(/_/g, ' ')}
                </span>
                <Download size={15} color="#9ca3af" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={card}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 18px' }}>
          Activity
        </h2>
        <Timeline entries={app.timeline || []} />
      </div>
    </div>
  );
}
