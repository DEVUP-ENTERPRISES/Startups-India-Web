'use client';

import { Check, Lock, X, Sparkles, ChevronRight, Zap } from 'lucide-react';

/**
 * Startups India Vibrant Theme - Crazy Animations Edition
 */

const TONE = {
  done:     { ring: '#10b981', bg: '#ffffff', border: '#a7f3d0', text: '#059669', iconBg: '#ecfdf5', iconBorder: '#10b981' },
  current:  { ring: '#f97316', bg: '#ffffff', border: '#fed7aa', text: '#ea580c', iconBg: '#fff7ed', iconBorder: '#f97316' },
  locked:   { ring: '#cbd5e1', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', iconBg: '#f1f5f9', iconBorder: '#cbd5e1' },
  rejected: { ring: '#ef4444', bg: '#ffffff', border: '#fecdd3', text: '#dc2626', iconBg: '#fef2f2', iconBorder: '#ef4444' },
};

function StateIcon({ state, index }) {
  if (state === 'done') return <Check size={16} strokeWidth={4} />;
  if (state === 'rejected') return <X size={16} strokeWidth={4} />;
  if (state === 'locked') return <Lock size={12} />;
  return <span style={{ fontWeight: 900, fontSize: 14 }}>{index + 1}</span>;
}

export default function PhaseTracker({ phases = [] }) {
  const doneCount = phases.filter(p => p.state === 'done').length;
  const currentCount = phases.filter(p => p.state === 'current').length;
  const progress = phases.length > 0
    ? Math.round(((doneCount + currentCount * 0.5) / phases.length) * 100)
    : 0;

  return (
    <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
      <style>{`
        @keyframes ptCrazyFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-1deg); }
          75% { transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes ptCrazyPulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.6); transform: scale(1); }
          50% { box-shadow: 0 0 0 12px rgba(249, 115, 22, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); transform: scale(1); }
        }
        @keyframes ptShine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes ptSlideBounce {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          60% { opacity: 1; transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ptProgressBar {
          0% { width: 0; }
          100% { width: var(--pt-progress); }
        }
        @keyframes ptSparkleSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .pt-phase-card { 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .pt-phase-card:hover { 
          transform: translateY(-8px) scale(1.03); 
          box-shadow: 0 20px 40px -10px rgba(30, 58, 138, 0.2), 0 10px 20px -5px rgba(249, 115, 22, 0.15);
          border-color: #f97316 !important;
          z-index: 10;
        }
        .pt-scroll-container::-webkit-scrollbar { height: 8px; }
        .pt-scroll-container::-webkit-scrollbar-track { background: rgba(30, 58, 138, 0.04); border-radius: 10px; }
        .pt-scroll-container::-webkit-scrollbar-thumb { background: rgba(30, 58, 138, 0.15); border-radius: 10px; }
        .pt-scroll-container::-webkit-scrollbar-thumb:hover { background: rgba(30, 58, 138, 0.25); }
      `}</style>

      {/* Main container with dynamic gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
          border: '1px solid #1e3a8a',
          borderRadius: '24px',
          padding: '32px 24px 36px',
          boxShadow: '0 10px 30px -5px rgba(30, 58, 138, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Orbs */}
        <div style={{ position: 'absolute', top: -100, left: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'ptCrazyFloat 8s infinite alternate ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -50, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'ptCrazyFloat 6s infinite alternate-reverse ease-in-out' }} />

        {/* Header with progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, #f97316, #fbbf24)', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
              animation: 'ptCrazyPulse 3s infinite'
            }}>
              <Zap size={18} style={{ animation: 'ptSparkleSpin 4s linear infinite' }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Journey Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 100, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fca5a5', letterSpacing: 0.5 }}>{progress}% WOW</span>
          </div>
        </div>

        {/* Progress bar - Crazy Saffron gradient */}
        <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginBottom: 32, overflow: 'hidden', position: 'relative', zIndex: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
          <div
            style={{
              '--pt-progress': `${progress}%`,
              height: '100%',
              borderRadius: 100,
              background: 'linear-gradient(90deg, #f97316, #fbbf24, #f97316)',
              backgroundSize: '200% 200%',
              animation: 'ptProgressBar 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              position: 'relative',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.8)'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)', transform: 'skewX(-20deg)', animation: 'ptShine 2s infinite' }} />
          </div>
        </div>

        {/* Phases - Horizontal Layout */}
        <div 
          className="pt-scroll-container"
          style={{ 
            display: 'flex', 
            gap: 20, 
            overflowX: 'auto', 
            paddingBottom: 20,
            paddingTop: 10,
            scrollSnapType: 'x mandatory',
            position: 'relative',
            zIndex: 2
          }}
        >
          {phases.map((p, i) => {
            const t = TONE[p.state] || TONE.locked;
            const isCurrent = p.state === 'current';
            const isLocked = p.state === 'locked';

            return (
              <div
                key={p.key}
                className="pt-phase-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 260,
                  maxWidth: 280,
                  flex: '1 0 auto',
                  background: isCurrent ? 'linear-gradient(145deg, #ffffff, #fff7ed)' : t.bg,
                  border: `2px solid ${isCurrent ? '#f97316' : isLocked ? '#e2e8f0' : '#e2e8f0'}`,
                  borderRadius: 24,
                  padding: '24px',
                  animation: `ptSlideBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.1}s both`,
                  scrollSnapAlign: 'center',
                  boxShadow: isCurrent ? '0 15px 35px -5px rgba(249, 115, 22, 0.3), 0 0 0 4px rgba(249,115,22,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
                  transform: isCurrent ? 'scale(1.02)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCurrent ? 'linear-gradient(135deg, #f97316, #ea580c)' : t.iconBg,
                      color: isCurrent ? '#fff' : t.ring,
                      animation: isCurrent ? 'ptCrazyPulse 2s infinite' : 'none',
                      boxShadow: isCurrent ? '0 4px 15px rgba(249,115,22,0.4)' : 'none'
                    }}
                  >
                    <StateIcon state={p.state} index={i} />
                  </div>
                  <div>
                    {p.state === 'current' && <Badge tone="current">🚀 Up Next</Badge>}
                    {p.state === 'done' && <Badge tone="done">🎉 Nailed It!</Badge>}
                    {p.state === 'rejected' && <Badge tone="rejected">Not Selected</Badge>}
                    {p.state === 'locked' && p.comingSoon && <Badge tone="locked">Coming Soon</Badge>}
                    {p.state === 'locked' && !p.comingSoon && <Badge tone="locked">Locked</Badge>}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: p.state === 'locked' ? '#94a3b8' : '#f97316',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    marginBottom: 8,
                  }}>
                    Phase {i + 1}
                  </span>
                  <h3 style={{
                    margin: '0 0 8px',
                    fontSize: 19,
                    fontWeight: 900,
                    color: p.state === 'locked' ? '#94a3b8' : '#0f172a',
                    letterSpacing: '-0.5px',
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    margin: '0 0 20px',
                    fontSize: 14,
                    color: p.state === 'locked' ? '#cbd5e1' : '#475569',
                    lineHeight: 1.6,
                    flex: 1,
                    fontWeight: 500
                  }}>
                    {p.subtitle}
                  </p>
                  
                  {isCurrent && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 'auto',
                      padding: '10px 16px',
                      background: '#fff7ed',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#ea580c',
                      border: '1px solid #fed7aa',
                      transition: 'all 0.2s'
                    }}>
                      Let's Go <ChevronRight size={16} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Badge({ tone, children }) {
  const styles = {
    done:     { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    current:  { bg: '#f97316', color: '#fff', border: '#ea580c' },
    rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fecdd3' },
    locked:   { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },
  };
  const s = styles[tone] || styles.locked;

  return (
    <span style={{
      padding: '6px 14px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
      boxShadow: tone === 'current' ? '0 4px 10px rgba(249,115,22,0.3)' : 'none'
    }}>
      {children}
    </span>
  );
}
