'use client';

import { Sparkles, GraduationCap, Building2, Landmark, ArrowRight, Lock } from 'lucide-react';

/**
 * Pre-application hero: showcases the full 5-phase Startups India journey so a
 * founder is excited *before* they fill the form. Renders from the `phases`
 * array the backend serves in getGrantConfig().
 */

function StartupsIndiaLogo({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M4 18L34 4L22 34L17 21L4 18Z" fill="#EF4444"/>
      <path d="M34 4L17 21L24 26L34 4Z" fill="#B91C1C"/>
      <path d="M17 21L12 28L15 20L17 21Z" fill="#FCA5A5"/>
    </svg>
  );
}

const DECOR = {
  registration: { Icon: StartupsIndiaLogo, blurb: 'Free · start here' },
  idea_evaluation: { Icon: Sparkles, blurb: 'Scored /100 by top VCs' },
  pre_incubation: { Icon: GraduationCap, blurb: 'Get investor-ready' },
  incubation: { Icon: Building2, blurb: 'Build & scale' },
  funding: { Icon: Landmark, blurb: 'The goal — get funded' },
};

export default function JourneyShowcase({ phases = [], fee }) {
  if (!phases.length) return null;

  const parsedFee = Number(fee);
  const rupees = (!isNaN(parsedFee) && parsedFee > 0) ? `₹${(parsedFee / 100).toLocaleString('en-IN')}` : null;

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        padding: '48px 40px',
        marginBottom: 48,
        background: 'linear-gradient(135deg, #661e29 0%, #4a101a 100%)',
        border: '1px solid #7d2634',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      }}
    >
      <style>{`
        .js-scroll-container::-webkit-scrollbar { display: none; }
        .js-scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        
        .js-card { 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .js-card:not(.js-locked-card):hover { 
          transform: translateY(-6px); 
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
        }
        
        .js-funding-card:hover {
          border-color: rgba(251, 191, 36, 0.6) !important;
          background: linear-gradient(180deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.04) 100%) !important;
          box-shadow: 0 15px 40px -10px rgba(251, 191, 36, 0.3);
        }

        .js-locked-card {
          transition: all 0.4s ease;
        }
        .js-locked-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(251, 191, 36, 0.4) !important;
          box-shadow: 0 10px 30px -10px rgba(251, 191, 36, 0.2);
        }
        .js-locked-card:hover .js-lock-icon {
          animation: unlockWobble 0.6s ease-in-out infinite alternate;
          color: #fbbf24 !important;
        }
        .js-locked-card:hover .js-locked-title {
          color: #ffffff !important;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-3deg); }
        }
        @keyframes unlockWobble {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-10deg); }
          75% { transform: scale(1.1) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(251, 191, 36, 0); }
        }
      `}</style>

      {/* Dashed Flight Path Background */}
      <svg 
        style={{ position: 'absolute', top: '40%', left: 0, width: '100%', height: '150px', pointerEvents: 'none', zIndex: 1, opacity: 0.15 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        <path 
          d="M0,50 Q150,90 300,50 T600,50 T1000,50" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="3" 
          strokeDasharray="12 12" 
        />
      </svg>

      {/* Elegant subtle background glow */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '100%', background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Subtle Badge with Logo */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: 24 }}>
          <StartupsIndiaLogo size={16} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#fca5a5' }}>
            The Startups India Journey
          </span>
        </div>

        {/* Header */}
        <h2 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          From idea to <span style={{ color: '#fbbf24', fontWeight: 800 }}>funded startup</span> — in 5 phases
        </h2>
        <p style={{ margin: '0 0 40px', fontSize: 16, color: '#fecaca', lineHeight: 1.6, maxWidth: 680, fontWeight: 400 }}>
          Apply free with just your idea. Clear each phase to unlock the next —
          {rupees ? ` a ${rupees} idea evaluation` : ' an idea evaluation'} scored by top VCs and mentors,
          hands-on incubation, and finally funding from leading investors.
        </p>

        {/* Phase rail - Horizontal Scroll */}
        <div
          className="js-scroll-container"
          style={{ 
            display: 'flex', 
            gap: 16, 
            overflowX: 'auto', 
            paddingBottom: 16,
            scrollSnapType: 'x mandatory',
            position: 'relative'
          }}
        >
          {phases.map((p, i) => {
            const decor = DECOR[p.key] || { Icon: Sparkles, blurb: '' };
            const Icon = decor.Icon;
            const isFunding = p.key === 'funding';
            const isRegistration = p.key === 'registration';
            const soon = p.comingSoon;
            const price = p.fee ? `₹${(p.fee / 100).toLocaleString('en-IN')}` : null;

            // Refined accents for Crimson theme
            const accent = isFunding ? '#fbbf24' : soon ? '#fca5a5' : '#ffffff';
            
            // "Locked" exciting visual style
            const cardBg = isFunding
              ? 'linear-gradient(180deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.01) 100%)'
              : soon 
                ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
                : 'rgba(255, 255, 255, 0.04)';
            
            const cardBorder = isFunding 
              ? 'rgba(251, 191, 36, 0.3)' 
              : soon
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(255, 255, 255, 0.12)';

            return (
              <div key={p.key} style={{ position: 'relative', display: 'flex', scrollSnapAlign: 'start' }}>
                <div
                  className={`js-card ${isFunding ? 'js-funding-card' : ''} ${soon ? 'js-locked-card' : ''}`}
                  style={{
                    flex: '0 0 auto',
                    width: 250,
                    borderRadius: 16,
                    padding: '24px',
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 220,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span
                      style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600, color: isFunding ? '#422006' : soon ? '#f87171' : '#991b1b',
                        border: `1px solid ${isFunding ? '#fbbf24' : soon ? 'rgba(255,255,255,0.1)' : '#fecaca'}`,
                        background: isFunding ? '#fbbf24' : soon ? 'rgba(255,255,255,0.05)' : '#fecaca',
                      }}
                    >
                      {i + 1}
                    </span>
                    {isRegistration ? (
                      <div style={{ animation: 'floatLogo 4s infinite ease-in-out' }}>
                        <Icon size={28} />
                      </div>
                    ) : soon ? (
                      <Lock size={22} color={accent} style={{ opacity: 0.5, transition: 'all 0.3s' }} className="js-lock-icon" />
                    ) : (
                      <Icon size={22} color={accent} style={{ opacity: isFunding ? 1 : 0.8 }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 className="js-locked-title" style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: soon && !isFunding ? '#fecaca' : '#ffffff', lineHeight: 1.3, letterSpacing: '-0.2px', transition: 'color 0.3s' }}>
                      {p.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: soon && !isFunding ? '#f87171' : '#fecaca', lineHeight: 1.5 }}>
                      {p.subtitle}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6, 
                      background: isFunding ? 'rgba(251, 191, 36, 0.15)' : soon ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.1)', 
                      padding: '4px 10px', borderRadius: 6, 
                      border: `1px solid ${isFunding ? 'rgba(251, 191, 36, 0.3)' : soon ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                      width: 'fit-content',
                      animation: soon ? 'pulseGlow 2s infinite' : 'none'
                    }}>
                      {soon && <Lock size={12} color="#fbbf24" />}
                      <span style={{ fontSize: 11, fontWeight: 700, color: isFunding || soon ? '#fde68a' : '#ffffff', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                        {soon ? (isFunding ? decor.blurb : 'Unlock to reveal') : decor.blurb}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Minimal connector chevron between cards */}
                {i < phases.length - 1 && (
                  <ArrowRight
                    size={16}
                    color="rgba(255,255,255,0.2)"
                    style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
