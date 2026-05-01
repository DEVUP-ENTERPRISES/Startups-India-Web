'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/Icon';

const FlippableBadge = ({ badge }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Mapping backend icons and colors
  const colorMap = {
    milestone: '#fbbf24', // Gold
    score: '#8B5CF6',     // Purple
    streak: '#ef4444',    // Red
    default: '#3b82f6'    // Blue
  };

  const rarityMap = {
    milestone: 'Legendary',
    score: 'Epic',
    streak: 'Rare',
    default: 'Common'
  };

  const bColor = colorMap[badge.type] || colorMap.default;
  const bRarity = rarityMap[badge.type] || rarityMap.default;

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ 
        perspective: '1000px', 
        cursor: 'pointer',
        height: '340px'
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative', 
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Front Side */}
        <div style={{ 
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'var(--dashboard-bg)', borderRadius: '32px', padding: '2.5rem 1.5rem', textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ 
            width: '90px', height: '90px', borderRadius: '24px', background: bColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            boxShadow: `0 15px 30px ${bColor}33`,
            transform: 'rotate(-5deg)'
          }}>
            <Icon name={badge.icon || 'award'} size={40} color="#fff" />
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: bColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{bRarity}</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>{badge.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Click to view details</p>
        </div>

        {/* Back Side */}
        <div style={{ 
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#0f172a', borderRadius: '32px', padding: '2.5rem 1.5rem', textAlign: 'center',
          transform: 'rotateY(180deg)', color: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem', color: bColor }}>{badge.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            {badge.description}
          </p>
          <div style={{ marginTop: '2rem', fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
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
      try {
        const [earnedRes, catalogRes] = await Promise.all([
          fetch('/api/v1/achievements/badges'),
          fetch('/api/v1/achievements/badges/catalog')
        ]);
        
        const earnedJson = await earnedRes.json();
        const catalogJson = await catalogRes.json();
        
        if (earnedJson.success) setEarnedBadges(earnedJson.data);
        if (catalogJson.success) setCatalog(catalogJson.data);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
       <div style={{ textAlign: 'center' }}>
          <div className="badge-spinner" />
          <p style={{ marginTop: '20px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>SYNCING ACHIEVEMENT VAULT...</p>
       </div>
       <style jsx>{`
         @keyframes spin { to { transform: rotate(360deg); } }
         .badge-spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
       `}</style>
    </div>
  );

  const lockedBadges = catalog.filter(b => !earnedBadges.some(eb => eb._id === b._id));
  const progressPercent = catalog.length > 0 ? Math.round((earnedBadges.length / catalog.length) * 100) : 0;

  return (
    <div className="platform-page badges-page">
      <header className="page-standard-header badges-header">
        <div>
          <h1 className="page-standard-title">Achievement Vault</h1>
          <p className="page-standard-subtitle">Decipher your milestones and unlock the builder odyssey.</p>
        </div>
        <div className="odyssey-stats">
            <div className="odyssey-label">Odyssey Progress</div>
            <div className="odyssey-value">{progressPercent}% Complete</div>
        </div>
      </header>

      {/* Progress Bar Container */}
      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ height: '100%', background: '#ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
          />
      </div>

      <div className="unlocked-section">
          <div className="section-label">
            UNLOCKED ACHIEVEMENTS <span className="label-accent">GRID MODE</span>
          </div>
          <div className="badges-grid">
            {earnedBadges.map((badge) => (
              <FlippableBadge key={badge._id} badge={badge} />
            ))}
            {earnedBadges.length === 0 && (
              <div style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '32px', border: '1.5px dashed #e2e8f0' }}>
                 <Icon name="award" size={48} color="#cbd5e1" />
                 <p style={{ marginTop: '1.5rem', fontWeight: 700, color: '#94a3b8' }}>No badges unlocked yet. Start your journey to earn recognition.</p>
              </div>
            )}
          </div>
      </div>

      {/* LOCKED SECTION: SCROLLABLE LOG */}
      <div className="milestone-container">
          <div className="milestone-label">
             <Icon name="lock" size={18} color="#94a3b8" /> BUILDER MILESTONE LOG <span className="milestone-pathway">SCROLLABLE PATHWAY</span>
          </div>
          
          <div className="milestone-log custom-scrollbar">
            {lockedBadges.map((badge, idx) => (
              <div key={badge._id} className="milestone-item">
                  <div className="milestone-icon-wrap">
                    <div className="milestone-icon-box">
                      <Icon name={badge.icon || 'lock'} size={24} color="#94a3b8" />
                    </div>
                  </div>
                  <div className="milestone-info">
                    <h4 className="milestone-title">{badge.name}</h4>
                    <p className="milestone-req">{badge.description}</p>
                  </div>
                  <div className="milestone-status-box">
                    <div className="milestone-status">
                      <Icon name="target" size={14} color="#94a3b8" /> 
                      <span>LOCKED</span>
                    </div>
                  </div>
              </div>
            ))}
            {lockedBadges.length === 0 && catalog.length > 0 && (
               <div style={{ textAlign: 'center', padding: '3rem', color: '#10b981', fontWeight: 900 }}>
                  <Icon name="checkCircle" size={24} color="#10b981" /> ALL MILESTONES UNLOCKED
               </div>
            )}
          </div>
      </div>

      <style jsx global>{`
        .badges-page { padding: 3rem 4rem; min-height: 100vh; font-family: 'Poppins', sans-serif; }
        .badges-header { margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .page-standard-title { font-size: 3rem; font-weight: 950; color: #0f172a; margin: 0 0 0.5rem; letter-spacing: -0.05em; }
        .page-standard-subtitle { color: #64748b; font-size: 1.1rem; font-weight: 650; margin: 0; }
        
        .odyssey-stats { text-align: right; }
        .odyssey-label { font-size: 0.85rem; font-weight: 950; color: #ef4444; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px; }
        .odyssey-value { font-size: 2.25rem; font-weight: 950; color: #0f172a; letter-spacing: -0.02em; }
        
        .unlocked-section { margin-bottom: 7rem; }
        .section-label { font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 3rem; display: flex; align-items: center; }
        .label-accent { margin-left: 16px; color: #ef4444; background: #fef2f2; padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; }
        
        .badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2.5rem; }

        .milestone-container { background: #fcfdfe; border-radius: 48px; padding: 4rem; border: 1.5px solid #f1f5f9; box-shadow: 0 4px 30px rgba(0,0,0,0.01); }
        .milestone-label { font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 3rem; display: flex; align-items: center; gap: 14px; }
        .milestone-pathway { margin-left: 16px; color: #cbd5e1; font-size: 0.7rem; }
        
        .milestone-log { max-height: 700px; overflow-y: auto; padding-right: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .milestone-item { background: var(--dashboard-bg); border-radius: 32px; padding: 2rem 3rem; display: flex; align-items: center; gap: 3rem; border: 1.5px solid #f1f5f9; transition: all 0.3s ease; }
        .milestone-item:hover { border-color: rgba(239, 68, 68, 0.15); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.03); }
        
        .milestone-icon-wrap { position: relative; }
        .milestone-icon-box { width: 72px; height: 72px; border-radius: 24px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #f1f5f9; }
        
        .milestone-info { flex: 1; }
        .milestone-title { font-size: 1.25rem; font-weight: 950; color: #0f172a; margin: 0 0 8px; }
        .milestone-req { font-size: 0.95rem; color: #64748b; font-weight: 650; margin: 0; line-height: 1.6; }
        
        .milestone-status-box { flex-shrink: 0; }
        .milestone-status { padding: 12px 28px; border-radius: 18px; background: #f8fafc; border: 1.5px solid #e2e8f0; font-size: 0.8rem; font-weight: 950; color: #94a3b8; display: flex; align-items: center; gap: 10px; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }

        @media (max-width: 1060px) {
          .badges-page { padding: 6.5rem 1.25rem 4rem !important; }
          .badges-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .page-standard-title { font-size: 2.25rem; }
          .odyssey-stats { text-align: left; }
          .odyssey-value { font-size: 1.75rem; }
          
          .unlocked-section { margin-bottom: 5rem; }
          .badges-grid { grid-template-columns: 1fr; gap: 2rem; }
          
          .milestone-container { padding: 2rem 1.25rem; border-radius: 36px; }
          .milestone-label { font-size: 0.7rem; margin-bottom: 1.5rem; }
          .milestone-log { padding-right: 0; max-height: none; gap: 1rem; overflow: visible; }
          .milestone-item { padding: 1.5rem; flex-direction: column; align-items: flex-start; gap: 1rem; border-radius: 24px; }
          .milestone-icon-box { width: 56px; height: 56px; border-radius: 18px; }
          .milestone-title { font-size: 1.1rem; }
          .milestone-req { font-size: 0.85rem; }
          .milestone-status-box { width: 100%; }
          .milestone-status { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

