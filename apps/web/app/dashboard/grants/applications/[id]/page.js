'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, FileText, Download, CheckCircle2, Pencil, AlertCircle,
  Sparkles, ArrowRight, CalendarClock, Clock, Layers, Zap, Flame
} from 'lucide-react';
import { getApplication, getDocumentUrl } from '@/lib/grants';
import StatusBadge from '@/components/grants/StatusBadge';
import Timeline from '@/components/grants/Timeline';
import PhaseTracker from '@/components/grants/PhaseTracker';

function Skeleton() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? '100px' : '250px',
            marginBottom: '24px',
            background: 'linear-gradient(90deg,#f8fafc 25%,#f1f5f9 50%,#f8fafc 75%)',
            backgroundSize: '200% 100%',
            animation: 'grantShimmer 1.4s infinite',
            borderRadius: '28px',
          }}
        />
      ))}
      <style>{`@keyframes grantShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

const appAnimations = `
  @keyframes appSlideIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: none; } }
  @keyframes appPop { 0% { opacity: 0; transform: scale(.9) translateY(20px); } 100% { opacity: 1; transform: none; } }
  @keyframes appCrazyFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-8px) rotate(-2deg); } 75% { transform: translateY(-4px) rotate(2deg); } }
  @keyframes appCrazyPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 50% { box-shadow: 0 0 0 12px rgba(249, 115, 22, 0); } }
  .app-doc-row { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .app-doc-row:hover { transform: translateX(8px) scale(1.02); background: #f8fafc !important; border-color: #cbd5e1 !important; box-shadow: 0 10px 20px rgba(30,58,138,0.06); }
  .app-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .app-card:hover { box-shadow: 0 15px 40px -10px rgba(30,58,138,0.15); transform: translateY(-4px); border-color: #cbd5e1 !important; }
`;

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
        <style>{appAnimations}</style>
        <div style={{
          width: 80, height: 80, borderRadius: 20, margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fef2f2', border: '2px solid #fecdd3',
          animation: 'appCrazyFloat 4s infinite alternate'
        }}>
          <AlertCircle size={36} color="#dc2626" />
        </div>
        <p style={{ color: '#475569', fontSize: '18px', marginBottom: 28, fontWeight: 700 }}>{error}</p>
        <Link href="/dashboard/grants/applications" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '16px 32px', borderRadius: 16,
          background: '#ffffff', border: '2px solid #e2e8f0',
          color: '#1e3a8a', fontWeight: 900, fontSize: '16px', textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(30,58,138,0.06)',
          transition: 'all 0.3s'
        }}>
          <ArrowLeft size={20} /> Back to my applications
        </Link>
      </div>
    );
  }

  if (!app) return <Skeleton />;

  const eligibleForEvaluation = app.status === 'selected' || app.status === 'idea_evaluation_pending';
  const inEvaluation = ['idea_evaluation_paid', 'evaluation_scheduled'].includes(app.status);
  const passed = app.status === 'evaluation_completed' || app.passedEvaluation === true
    || ['funding_process_started', 'grant_approved', 'completed'].includes(app.status);
  const failedEvaluation = app.status === 'rejected' && app.phases?.[1]?.state === 'rejected';
  const canEdit = app.editable;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      <style>{appAnimations}</style>

      <Link
        href="/dashboard/grants/applications"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: '#1e3a8a', fontSize: '15px', fontWeight: 800,
          textDecoration: 'none', marginBottom: '28px',
          padding: '10px 20px', borderRadius: 12,
          background: '#ffffff', border: '2px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(30,58,138,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={18} strokeWidth={3} /> My Applications
      </Link>

      {celebrate && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '24px 28px', marginBottom: '28px',
            background: 'linear-gradient(135deg, #022c22, #064e3b)', border: '2px solid #10b981', borderRadius: '24px',
            animation: 'appPop .5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 10px 30px rgba(16,185,129,0.2)',
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #10b981, #059669)', border: '1px solid #34d399',
            flexShrink: 0, boxShadow: '0 4px 15px rgba(16,185,129,0.4)',
            animation: 'appCrazyFloat 3s infinite alternate'
          }}>
            <CheckCircle2 size={28} color="#fff" strokeWidth={3} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
              Application Launched! 🚀
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '15px', color: '#a7f3d0', fontWeight: 500 }}>
              We've received your submission. You'll be notified as the status changes.
            </p>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="app-card" style={{
        padding: '32px', background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0',
        borderRadius: '28px', marginBottom: '32px',
        display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        boxShadow: '0 10px 30px -5px rgba(30,58,138,0.06)',
        animation: 'appSlideIn 0.3s ease-out',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(30,58,138,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{
          width: 72, height: 72, borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a, #172554)',
          color: '#ffffff', flexShrink: 0,
          boxShadow: '0 10px 25px rgba(30,58,138,0.3)',
          position: 'relative', zIndex: 2
        }}>
          <Layers size={32} />
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
              {app.startup?.name}
            </h1>
            <StatusBadge status={app.status} label={app.statusLabel} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px', color: '#64748b', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
              {app.applicationId}
            </span>
            {app.submittedAt && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px', color: '#64748b', fontWeight: 700 }}>
                <Clock size={16} color="#f97316" />
                {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {canEdit && (
          <Link
            href="/dashboard/grants"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 24px', borderRadius: '14px',
              border: '2px solid #cbd5e1', background: '#fff',
              color: '#1e3a8a', fontWeight: 900, fontSize: '15px', textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 4px 15px rgba(30,58,138,0.06)',
              position: 'relative', zIndex: 2
            }}
          >
            <Pencil size={18} /> Edit App
          </Link>
        )}
      </div>

      {/* 5-phase journey */}
      {app.phases?.length > 0 && (
        <div style={{ marginBottom: '32px', animation: 'appSlideIn 0.4s ease-out' }}>
          <PhaseTracker phases={app.phases} />
        </div>
      )}

      {/* Phase 2 unlocked banner - Crazy Animation Edition */}
      {eligibleForEvaluation && (
        <div style={{
          background: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)',
          borderRadius: '28px', padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
          marginBottom: '32px',
          animation: 'appSlideIn 0.5s ease-out',
          boxShadow: '0 15px 40px -10px rgba(30, 58, 138, 0.4)',
        }}>
          {/* Crazy Glow orbs */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)', pointerEvents: 'none', animation: 'appCrazyFloat 6s infinite alternate' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'appCrazyFloat 4s infinite alternate-reverse' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 100, background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)', marginBottom: 20 }}>
              <Flame size={16} color="#f97316" style={{ animation: 'appCrazyFloat 2s infinite alternate' }} />
              <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: '#fed7aa' }}>Phase 2 Unlocked!</span>
            </div>
            <h3 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              You're eligible for Idea Evaluation
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: 16, color: '#93c5fd', lineHeight: 1.7, maxWidth: 680, fontWeight: 500 }}>
              Your idea has been accepted by our team. Next, upload your business plan and supporting
              documents, then reserve your evaluation — your startup will be reviewed and scored by
              top VCs and mentors in an in-person evaluation meet. Let's make it happen!
            </p>
            <Link
              href={`/dashboard/grants/applications/${app._id}/evaluation`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '16px 32px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff', fontWeight: 900, fontSize: 16,
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 30px rgba(249,115,22,0.4)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              Reserve Your Spot <ArrowRight size={20} strokeWidth={3} />
            </Link>
          </div>
        </div>
      )}

      {/* Paid / scheduled */}
      {inEvaluation && (
        <div className="app-card" style={{
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '28px 32px', marginBottom: '32px',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          border: '1px solid #e2e8f0',
          borderRadius: '28px',
          animation: 'appSlideIn 0.5s ease-out',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe',
            flexShrink: 0, boxShadow: '0 4px 15px rgba(30,58,138,0.1)',
            animation: 'appCrazyFloat 3s infinite alternate'
          }}>
            <CalendarClock size={28} color="#1e3a8a" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.3px' }}>
              {app.status === 'evaluation_scheduled' ? 'It\'s Showtime! Meet Scheduled ⏰' : 'Payment Received — Evaluation in Progress'}
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: 15, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              Our panel will review your submission at the in-person meet and share your result here.
              Check the Idea Evaluation page for all the details.
            </p>
          </div>
        </div>
      )}

      {/* Passed */}
      {passed && (
        <div style={{
          background: 'linear-gradient(135deg, #022c22, #064e3b)',
          border: '2px solid #10b981',
          borderRadius: '32px', padding: '48px 40px', textAlign: 'center',
          marginBottom: '32px', position: 'relative', overflow: 'hidden',
          animation: 'appPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 20px 50px rgba(6,78,59,0.3), inset 0 2px 10px rgba(255,255,255,0.1)'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 64, marginBottom: 20, animation: 'appCrazyFloat 4s infinite alternate', display: 'inline-block' }}>🎉</div>
            <h3 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>You cleared the Idea Evaluation!</h3>
            <p style={{ margin: 0, fontSize: 16, color: '#a7f3d0', lineHeight: 1.7, maxWidth: 640, marginInline: 'auto', fontWeight: 500 }}>
              Congratulations — your idea passed our panel's review. You're now eligible for the
              next phases: Pre-Incubation, Incubation, and Funding by top VCs and angel investors. We'll
              be in touch with the next steps. Let's build something great!
            </p>
          </div>
        </div>
      )}

      {/* Not selected */}
      {failedEvaluation && (
        <div className="app-card" style={{
          padding: '36px', background: 'linear-gradient(135deg, #fffbeb, #fff)', borderRadius: '28px',
          border: '2px solid #fde68a', marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(146,64,14,0.08)',
          animation: 'appSlideIn 0.5s ease-out',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 900, color: '#92400e', letterSpacing: '-0.5px' }}>
            Not selected this time 💪
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: 16, color: '#78350f', lineHeight: 1.6, fontWeight: 500 }}>
            Your idea didn't clear the evaluation on this occasion, but every "no" is just a step closer to a "yes". Here's the panel's
            feedback to help you strengthen it and reapply:
          </p>
          {app.timeline?.find(t => t.reason)?.reason && (
            <div style={{ padding: '20px 24px', background: '#fffbeb', borderRadius: 16, borderLeft: '6px solid #f59e0b', fontSize: 15.5, color: '#92400e', lineHeight: 1.6, fontWeight: 600 }}>
              "{app.timeline.find(t => t.reason).reason}"
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      <div className="app-card" style={{
        padding: '36px', background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '28px', marginBottom: '32px',
        boxShadow: '0 10px 40px -10px rgba(30,58,138,0.06)',
        animation: 'appSlideIn 0.6s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc', border: '2px solid #e2e8f0',
            boxShadow: '0 4px 10px rgba(30,58,138,0.05)'
          }}>
            <FileText size={22} color="#1e3a8a" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Documents Vault
          </h2>
        </div>
        {app.documents?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px' }}>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0, fontWeight: 600 }}>No documents uploaded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {app.documents.map(doc => (
              <button
                key={doc._id}
                type="button"
                onClick={() => openDocument(doc._id)}
                className="app-doc-row"
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px', width: '100%',
                  background: '#ffffff', border: '2px solid #e2e8f0',
                  borderRadius: '16px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#f8fafc', border: '1px solid #e2e8f0', flexShrink: 0,
                }}>
                  <FileText size={18} color="#475569" />
                </div>
                <span style={{ flex: 1, minWidth: 0, fontSize: '15.5px', fontWeight: 800, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.fileName}
                </span>
                <span style={{
                  fontSize: '12px', color: '#1e3a8a', flexShrink: 0,
                  padding: '6px 12px', borderRadius: 10, background: '#eff6ff',
                  fontWeight: 800, textTransform: 'capitalize', letterSpacing: 0.5
                }}>
                  {doc.kind.replace(/_/g, ' ')}
                </span>
                <Download size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="app-card" style={{
        padding: '36px', background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '28px', boxShadow: '0 10px 40px -10px rgba(30,58,138,0.06)',
        animation: 'appSlideIn 0.65s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff7ed', border: '2px solid #fed7aa',
            boxShadow: '0 4px 10px rgba(249,115,22,0.1)'
          }}>
            <Clock size={22} color="#ea580c" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Activity Feed
          </h2>
        </div>
        <Timeline entries={app.timeline || []} />
      </div>
    </div>
  );
}
