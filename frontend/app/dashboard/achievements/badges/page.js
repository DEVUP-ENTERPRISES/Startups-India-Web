'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import '@/styles/assessments-v2.css';

const USE_MOCK_DATA = true;

const COLOR_MAP = {
  milestone: '#fbbf24',
  score: '#8B5CF6',
  streak: '#ef4444',
  expert: '#059669',
  default: '#3b82f6',
};

const FlippableBadgeCard = ({ badge, isEarned }) => {
  const [flipped, setFlipped] = useState(false);
  const color = COLOR_MAP[badge.type] || COLOR_MAP.default;

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{ flex: '0 0 220px', scrollSnapAlign: 'start', perspective: '1200px', cursor: 'pointer', height: '100%' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#fff', borderRadius: '20px', padding: '1rem',
          border: '1.5px solid #F1F5F9',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${isEarned ? `${color}08` : 'rgba(148,163,184,0.05)'}, transparent)`, borderRadius: '20px' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: '12px', background: isEarned ? color : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isEarned ? `0 8px 20px ${color}33` : 'none' }}>
                <Icon name={badge.icon || 'award'} size={18} color={isEarned ? '#fff' : '#94A3B8'} />
              </div>
              <span style={{
                fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: isEarned ? color : '#94A3B8',
                background: isEarned ? `${color}12` : '#F1F5F9',
                padding: '5px 10px', borderRadius: '99px',
              }}>
                {isEarned ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 950, color: '#111', marginBottom: '0.45rem', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
              {badge.name}
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 650, marginBottom: '0.35rem', lineHeight: 1.45 }}>
              {badge.type ? badge.type.charAt(0).toUpperCase() + badge.type.slice(1) : 'Standard'} Honor
            </p>
            {isEarned && badge.earnedAt && (
              <p style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.9rem', lineHeight: 1.45 }}>
                Earned: {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            )}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.7rem', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.65rem', color: '#CBD5E1', fontWeight: 700 }}>Tap to flip</span>
              <span style={{ fontSize: '0.95rem', color: isEarned ? color : '#CBD5E1', fontWeight: 950 }}>↺</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#111', borderRadius: '20px', padding: '1rem',
          border: '1.5px solid #222', transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: '0.6rem',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="info" size={18} color={color} />
          </div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 950, color: color, margin: 0, letterSpacing: '-0.01em' }}>{badge.name}</h4>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
            {badge.description}
          </p>
          <div style={{ marginTop: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isEarned && badge.earnedAt
                ? `EARNED ${new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                : 'LOCKED'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function BadgesPage() {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const mockEarned = [
          { _id: 'b1', name: 'Seed Architect', type: 'milestone', icon: 'zap', description: 'Demonstrated structural excellence in early-stage business modeling.', earnedAt: new Date().toISOString() },
          { _id: 'b2', name: 'Strategic Visionary', type: 'score', icon: 'target', description: 'Achieved 95%+ accuracy on 10 consecutive market simulations.', earnedAt: new Date().toISOString() },
          { _id: 'b3', name: 'Growth Engineer', type: 'expert', icon: 'trendingUp', description: 'Successfully navigated 5 complex scaling scenarios with optimal capital efficiency.', earnedAt: new Date().toISOString() },
          { _id: 'b4', name: 'Fiscal Steward', type: 'milestone', icon: 'award', description: 'Maintained zero-burn optimization in the financial management track.', earnedAt: new Date().toISOString() },
          { _id: 'b5', name: 'Market Disruptor', type: 'streak', icon: 'explore', description: 'Identified 3 unique blue-ocean opportunities in the sector analysis.', earnedAt: new Date().toISOString() },
          { _id: 'b6', name: 'Elite Negotiator', type: 'expert', icon: 'users', description: 'Mastered the term-sheet simulation with 100% founder-favorable terms.', earnedAt: new Date().toISOString() },
        ];
        const mockCatalog = [
          ...mockEarned,
          { _id: 'b7', name: 'Data Commander', type: 'score', icon: 'results', description: 'Processed 1M+ data points in the analytics dashboard without error.' },
          { _id: 'b8', name: 'Viral Growth Catalyst', type: 'streak', icon: 'zap', description: 'Engineered a referral loop with a K-factor greater than 1.5.' },
          { _id: 'b9', name: 'Unit Econ Specialist', type: 'score', icon: 'target', description: 'Optimized LTV/CAC ratio to 5x across all acquisition channels.' },
          { _id: 'b10', name: 'Resilient Founder', type: 'milestone', icon: 'shield', description: 'Successfully navigated 3 consecutive market downturn simulations.' },
        ];

        if (USE_MOCK_DATA) {
          setEarnedBadges(mockEarned);
          setCatalog(mockCatalog);
          return;
        }

        const [earnedRes, catalogRes] = await Promise.all([
          fetch('/api/v1/achievements/badges'),
          fetch('/api/v1/achievements/badges/catalog'),
        ]);
        const earnedJson = await earnedRes.json();
        const catalogJson = await catalogRes.json();
        setEarnedBadges(earnedJson.success && earnedJson.data.length > 0 ? earnedJson.data : mockEarned);
        setCatalog(catalogJson.success && catalogJson.data.length > 0 ? catalogJson.data : mockCatalog);
      } catch {
        const fallbackEarned = [
          { _id: 'b1', name: 'Seed Architect', type: 'milestone', icon: 'zap', description: 'Demonstrated structural excellence in early-stage business modeling.', earnedAt: new Date().toISOString() },
          { _id: 'b2', name: 'Strategic Visionary', type: 'score', icon: 'target', description: 'Achieved 95%+ accuracy on 10 consecutive market simulations.', earnedAt: new Date().toISOString() },
          { _id: 'b3', name: 'Growth Engineer', type: 'expert', icon: 'trendingUp', description: 'Successfully navigated 5 complex scaling scenarios with optimal capital efficiency.', earnedAt: new Date().toISOString() },
          { _id: 'b4', name: 'Fiscal Steward', type: 'milestone', icon: 'award', description: 'Maintained zero-burn optimization in the financial management track.', earnedAt: new Date().toISOString() },
          { _id: 'b5', name: 'Market Disruptor', type: 'streak', icon: 'explore', description: 'Identified 3 unique blue-ocean opportunities in the sector analysis.', earnedAt: new Date().toISOString() },
          { _id: 'b6', name: 'Elite Negotiator', type: 'expert', icon: 'users', description: 'Mastered the term-sheet simulation with 100% founder-favorable terms.', earnedAt: new Date().toISOString() },
        ];
        setEarnedBadges(fallbackEarned);
        setCatalog(fallbackEarned);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const progressPercent = catalog.length > 0 ? Math.round((earnedBadges.length / catalog.length) * 100) : 0;
  const lockedBadges = catalog.filter(b => !earnedBadges.some(eb => eb._id === b._id));

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
      <motion.div
        aria-hidden
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-140px', right: '-90px', width: 280, height: 280,
          borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(122,31,43,0.16), rgba(122,31,43,0))',
          pointerEvents: 'none',
        }}
      />

      <header className="platform-page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="platform-page-title" style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em' }}>Achievement Vault</h1>
          <p className="platform-page-subtitle" style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>
            Collection of unique digital honors earned through your building journey.
          </p>
        </div>
        <div style={{ textAlign: 'right', background: '#fff', padding: '1.25rem 2rem', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', minWidth: 180 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Vault Progress</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#111', lineHeight: 1 }}>
            {progressPercent}% <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800 }}>COMPLETE</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#F1F5F9', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: '#7A1F2B', borderRadius: '3px' }} />
          </div>
        </div>
      </header>

      {/* Unlocked Badges - single horizontal scrollable row */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#111', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Unlocked Honors</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Scroll sideways · Tap any badge to flip and read details.</p>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#7A1F2B', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '999px', padding: '8px 12px', whiteSpace: 'nowrap' }}>
            {earnedBadges.length} badges
          </div>
        </div>

        {isLoading ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #F1F5F9', borderTop: '3px solid #7A1F2B', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : earnedBadges.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
            <Icon name="award" size={36} color="#CBD5E1" />
            <p style={{ marginTop: '1rem', fontWeight: 600, color: '#94A3B8' }}>No badges earned yet. Complete evaluations to unlock your first honor.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: '0.9rem', overflowX: 'auto', paddingBottom: '0.75rem',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', height: '230px',
          }}>
            {earnedBadges.map(badge => (
              <FlippableBadgeCard key={badge._id} badge={badge} isEarned={true} />
            ))}
          </div>
        )}
      </section>

      {/* Locked / Milestone Roadmap - also a row */}
      {lockedBadges.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#111', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Milestone Roadmap</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Complete milestones to unlock these honors.</p>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '999px', padding: '8px 12px', whiteSpace: 'nowrap' }}>
              {lockedBadges.length} locked
            </div>
          </div>
          <div style={{
            display: 'flex', gap: '0.9rem', overflowX: 'auto', paddingBottom: '0.75rem',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', height: '230px',
          }}>
            {lockedBadges.map(badge => (
              <FlippableBadgeCard key={badge._id} badge={badge} isEarned={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
