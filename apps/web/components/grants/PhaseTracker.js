'use client';

import { Check, Lock, X, Sparkles, GraduationCap, Building2, Landmark, ArrowRight } from 'lucide-react';

/**
 * Applicant-facing journey tracker for the detail page. Same crimson Startups
 * India theme and typography as JourneyShowcase, so the two read as one family —
 * but this one is state-driven (done / current / locked / rejected) and shows
 * live progress. Renders entirely from the `phases` array the backend computes.
 */

function StartupsIndiaLogo({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M4 18L34 4L22 34L17 21L4 18Z" fill="#EF4444" />
      <path d="M34 4L17 21L24 26L34 4Z" fill="#B91C1C" />
      <path d="M17 21L12 28L15 20L17 21Z" fill="#FCA5A5" />
    </svg>
  );
}

// Same phase → icon mapping as the showcase, for a consistent visual language.
const PHASE_ICON = {
  registration: StartupsIndiaLogo,
  idea_evaluation: Sparkles,
  pre_incubation: GraduationCap,
  incubation: Building2,
  funding: Landmark,
};

function NodeIcon({ state, index }) {
  if (state === 'done') return <Check size={15} strokeWidth={3.5} />;
  if (state === 'rejected') return <X size={15} strokeWidth={3.5} />;
  if (state === 'locked') return <Lock size={12} />;
  return <span style={{ fontWeight: 800, fontSize: 13 }}>{index + 1}</span>;
}

export default function PhaseTracker({ phases = [] }) {
  const doneCount = phases.filter(p => p.state === 'done').length;
  const currentCount = phases.filter(p => p.state === 'current').length;
  const progress = phases.length > 0
    ? Math.round(((doneCount + currentCount * 0.5) / phases.length) * 100)
    : 0;

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        padding: '32px 28px 28px',
        background: 'linear-gradient(135deg, #661e29 0%, #4a101a 100%)',
        border: '1px solid #7d2634',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      }}
    >
      <style>{`
        .pt-scroll::-webkit-scrollbar { display: none; }
        .pt-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pt-card { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .pt-card:not(.pt-locked):hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.09) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
        }
        .pt-locked:hover { transform: translateY(-4px); border-color: rgba(251,191,36,0.4) !important; }
        @keyframes ptBarFill { from { width: 0; } to { width: var(--pt-progress); } }
        @keyframes ptShine { 0% { left: -60%; } 100% { left: 160%; } }
        @keyframes ptCurrentGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230,57,70,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(230,57,70,0); }
        }
      `}</style>

      {/* Dashed flight path + glow, matching the showcase */}
      <svg style={{ position: 'absolute', top: '45%', left: 0, width: '100%', height: 150, pointerEvents: 'none', zIndex: 1, opacity: 0.12 }} preserveAspectRatio="none" viewBox="0 0 1000 100">
        <path d="M0,50 Q150,90 300,50 T600,50 T1000,50" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="12 12" />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '100%', background: 'radial-gradient(ellipse at top, rgba(239,68,68,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StartupsIndiaLogo size={18} />
            </div>
            <span style={{ fontSize: 19, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.4px' }}>Journey Progress</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 13px', borderRadius: 100 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: 0.3 }}>{progress}%</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fca5a5' }}>complete</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, background: 'rgba(0,0,0,0.25)', borderRadius: 100, marginBottom: 26, overflow: 'hidden', position: 'relative' }}>
          <div style={{ '--pt-progress': `${progress}%`, height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, #f97316, #fbbf24)', animation: 'ptBarFill 1.2s cubic-bezier(0.4,0,0.2,1) forwards', position: 'relative', boxShadow: '0 0 14px rgba(251,191,36,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', transform: 'skewX(-20deg)', animation: 'ptShine 2.2s infinite' }} />
          </div>
        </div>

        {/* Phase rail */}
        <div className="pt-scroll" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 6, scrollSnapType: 'x mandatory' }}>
          {phases.map((p, i) => {
            const st = p.state;
            const isFunding = p.key === 'funding';
            const isCurrent = st === 'current';
            const isLocked = st === 'locked';
            const isDone = st === 'done';
            const isRejected = st === 'rejected';
            const Icon = PHASE_ICON[p.key] || Sparkles;
            const isRegistration = p.key === 'registration';

            const accent = isDone ? '#34d399'
              : isCurrent ? '#ffffff'
              : isRejected ? '#fca5a5'
              : isFunding ? '#fbbf24'
              : '#fca5a5'; // locked

            const cardBg = isCurrent ? 'rgba(255,255,255,0.09)'
              : isDone ? 'linear-gradient(180deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.02) 100%)'
              : isRejected ? 'linear-gradient(180deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.02) 100%)'
              : isFunding ? 'linear-gradient(180deg, rgba(251,191,36,0.08) 0%, rgba(251,191,36,0.01) 100%)'
              : 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)';

            const cardBorder = isCurrent ? 'rgba(255,255,255,0.4)'
              : isDone ? 'rgba(52,211,153,0.4)'
              : isRejected ? 'rgba(239,68,68,0.4)'
              : isFunding ? 'rgba(251,191,36,0.3)'
              : 'rgba(255,255,255,0.1)';

            // Status pill text, mirroring the showcase's bottom pill.
            const statusText = isDone ? 'Cleared'
              : isCurrent ? "You're here"
              : isRejected ? 'Not selected'
              : p.comingSoon ? 'Coming soon'
              : 'Locked';

            const nodeBg = isCurrent ? 'linear-gradient(135deg, #e63946, #ff6b6b)'
              : isDone ? '#34d399'
              : isRejected ? '#ef4444'
              : isFunding ? '#fbbf24'
              : 'rgba(255,255,255,0.08)';
            const nodeColor = isCurrent || isRejected ? '#ffffff'
              : isDone ? '#053726'
              : isFunding ? '#422006'
              : '#fca5a5';

            return (
              <div key={p.key} style={{ position: 'relative', display: 'flex', scrollSnapAlign: 'start' }}>
                <div
                  className={`pt-card ${isLocked ? 'pt-locked' : ''}`}
                  style={{
                    flex: '0 0 auto',
                    width: 248,
                    minHeight: 210,
                    borderRadius: 16,
                    padding: '22px',
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isCurrent ? '0 12px 30px -8px rgba(230,57,70,0.35)' : 'none',
                    animation: isCurrent ? 'ptCurrentGlow 2.4s infinite' : 'none',
                  }}
                >
                  {/* node + phase icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: nodeBg, color: nodeColor, border: `1px solid ${accent}` }}>
                      <NodeIcon state={st} index={i} />
                    </span>
                    {isRegistration
                      ? <Icon size={26} />
                      : <Icon size={22} color={accent} style={{ opacity: isLocked ? 0.7 : 1 }} />}
                  </div>

                  {/* text */}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: isLocked && !isFunding ? '#c98a92' : '#fca5a5' }}>
                      Phase {i + 1}
                    </span>
                    <h3 style={{ margin: '6px 0 6px', fontSize: 17, fontWeight: 700, color: isLocked && !isFunding ? '#fecaca' : '#ffffff', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                      {p.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: isLocked && !isFunding ? '#e58b93' : '#fecaca', lineHeight: 1.5 }}>
                      {p.subtitle}
                    </p>
                  </div>

                  {/* status pill */}
                  <div style={{ marginTop: 18 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 11px', borderRadius: 8, width: 'fit-content',
                      background: isCurrent ? 'rgba(255,255,255,0.12)' : isDone ? 'rgba(52,211,153,0.15)' : isRejected ? 'rgba(239,68,68,0.15)' : isFunding ? 'rgba(251,191,36,0.15)' : 'transparent',
                      border: `1px solid ${isCurrent ? 'rgba(255,255,255,0.2)' : isDone ? 'rgba(52,211,153,0.3)' : isRejected ? 'rgba(239,68,68,0.3)' : isFunding ? 'rgba(251,191,36,0.3)' : 'transparent'}`,
                    }}>
                      {isLocked && <Lock size={12} color={accent} />}
                      {isCurrent && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />}
                      <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, color: isDone ? '#6ee7b7' : isRejected ? '#fca5a5' : isFunding ? '#fde68a' : isCurrent ? '#ffffff' : '#fca5a5' }}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* connector chevron */}
                {i < phases.length - 1 && (
                  <ArrowRight size={16} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
