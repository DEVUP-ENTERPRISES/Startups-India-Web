'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

const USE_MOCK_DATA = true;

const MOCK_LEADERS = {
  weekly: [
    { _id: 'w1', name: 'Jaswanth Reddy', score: 14850, badges: 18, level: 'Tier Elite', batch: 'Founders Batch 01' },
    { _id: 'w2', name: 'Faizan Mohammed', score: 13220, badges: 15, level: 'Tier Elite', batch: 'Founders Batch 01' },
    { _id: 'w3', name: 'Sarah Chen', score: 11780, badges: 12, level: 'Tier Elite', batch: 'Founders Batch 02' },
    { _id: 'w4', name: 'Aarav Mehta', score: 10120, badges: 10, level: 'Growth Phase', batch: 'Founders Batch 02' },
    { _id: 'w5', name: 'Elena Gilbert', score: 9480, badges: 9, level: 'Growth Phase', batch: 'Founders Batch 02' },
    { _id: 'w6', name: 'David Miller', score: 8860, badges: 8, level: 'Growth Phase', batch: 'Founders Batch 03' },
    { _id: 'w7', name: 'Priya Sharma', score: 8210, badges: 8, level: 'Seed Stage', batch: 'Founders Batch 03' },
    { _id: 'w8', name: 'Liam O’Brien', score: 7600, badges: 7, level: 'Seed Stage', batch: 'Founders Batch 03' },
    { _id: 'w9', name: 'Amara Kante', score: 7010, badges: 6, level: 'Seed Stage', batch: 'Founders Batch 04' },
    { _id: 'w10', name: 'Xavier Lopez', score: 6650, badges: 6, level: 'Seed Stage', batch: 'Founders Batch 04' },
    { _id: 'w11', name: 'Chloe Dubois', score: 6040, badges: 5, level: 'Incubation', batch: 'Founders Batch 04' },
    { _id: 'w12', name: 'Arjun Gupta', score: 5480, badges: 5, level: 'Incubation', batch: 'Founders Batch 05' },
  ],
  monthly: [
    { _id: 'm1', name: 'Jaswanth Reddy', score: 38210, badges: 24, level: 'Tier Elite', batch: 'Founders Batch 01' },
    { _id: 'm2', name: 'Faizan Mohammed', score: 36440, badges: 22, level: 'Tier Elite', batch: 'Founders Batch 01' },
    { _id: 'm3', name: 'Sarah Chen', score: 34120, badges: 19, level: 'Tier Elite', batch: 'Founders Batch 02' },
    { _id: 'm4', name: 'Aarav Mehta', score: 32550, badges: 18, level: 'Tier Elite', batch: 'Founders Batch 02' },
    { _id: 'm5', name: 'Elena Gilbert', score: 30840, badges: 17, level: 'Growth Phase', batch: 'Founders Batch 02' },
    { _id: 'm6', name: 'David Miller', score: 29410, badges: 16, level: 'Growth Phase', batch: 'Founders Batch 03' },
    { _id: 'm7', name: 'Priya Sharma', score: 28020, badges: 15, level: 'Growth Phase', batch: 'Founders Batch 03' },
    { _id: 'm8', name: 'Liam O’Brien', score: 26880, badges: 14, level: 'Seed Stage', batch: 'Founders Batch 03' },
    { _id: 'm9', name: 'Amara Kante', score: 25290, badges: 13, level: 'Seed Stage', batch: 'Founders Batch 04' },
    { _id: 'm10', name: 'Xavier Lopez', score: 24670, badges: 12, level: 'Seed Stage', batch: 'Founders Batch 04' },
    { _id: 'm11', name: 'Chloe Dubois', score: 22810, badges: 12, level: 'Incubation', batch: 'Founders Batch 04' },
    { _id: 'm12', name: 'Arjun Gupta', score: 21780, badges: 11, level: 'Incubation', batch: 'Founders Batch 05' },
    { _id: 'm13', name: 'Nina Rossi', score: 20840, badges: 11, level: 'Incubation', batch: 'Founders Batch 05' },
    { _id: 'm14', name: 'Kenji Sato', score: 19650, badges: 10, level: 'Discovery', batch: 'Founders Batch 05' },
    { _id: 'm15', name: 'Zoe Miller', score: 18220, badges: 9, level: 'Discovery', batch: 'Founders Batch 06' },
    { _id: 'm16', name: 'Lucas Silva', score: 17400, badges: 8, level: 'Discovery', batch: 'Founders Batch 06' },
  ],
  'all-time': [
    { _id: 'a1', name: 'Jaswanth Reddy', score: 68210, badges: 42, level: 'Founder Legend', batch: 'Founders Batch 01' },
    { _id: 'a2', name: 'Faizan Mohammed', score: 65120, badges: 40, level: 'Founder Legend', batch: 'Founders Batch 01' },
    { _id: 'a3', name: 'Sarah Chen', score: 62340, badges: 38, level: 'Founder Legend', batch: 'Founders Batch 02' },
    { _id: 'a4', name: 'Aarav Mehta', score: 59700, badges: 36, level: 'Tier Elite', batch: 'Founders Batch 02' },
    { _id: 'a5', name: 'Elena Gilbert', score: 56890, badges: 34, level: 'Tier Elite', batch: 'Founders Batch 02' },
    { _id: 'a6', name: 'David Miller', score: 55120, badges: 31, level: 'Tier Elite', batch: 'Founders Batch 03' },
    { _id: 'a7', name: 'Priya Sharma', score: 52810, badges: 30, level: 'Growth Phase', batch: 'Founders Batch 03' },
    { _id: 'a8', name: 'Liam O’Brien', score: 50840, badges: 28, level: 'Growth Phase', batch: 'Founders Batch 03' },
    { _id: 'a9', name: 'Amara Kante', score: 49230, badges: 27, level: 'Growth Phase', batch: 'Founders Batch 04' },
    { _id: 'a10', name: 'Xavier Lopez', score: 48010, badges: 26, level: 'Growth Phase', batch: 'Founders Batch 04' },
    { _id: 'a11', name: 'Chloe Dubois', score: 46520, badges: 25, level: 'Seed Stage', batch: 'Founders Batch 04' },
    { _id: 'a12', name: 'Arjun Gupta', score: 44970, badges: 24, level: 'Seed Stage', batch: 'Founders Batch 05' },
    { _id: 'a13', name: 'Nina Rossi', score: 43050, badges: 23, level: 'Seed Stage', batch: 'Founders Batch 05' },
    { _id: 'a14', name: 'Kenji Sato', score: 41680, badges: 22, level: 'Discovery', batch: 'Founders Batch 05' },
    { _id: 'a15', name: 'Zoe Miller', score: 39990, badges: 21, level: 'Discovery', batch: 'Founders Batch 06' },
    { _id: 'a16', name: 'Lucas Silva', score: 38810, badges: 20, level: 'Discovery', batch: 'Founders Batch 06' },
  ],
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        if (USE_MOCK_DATA) {
          setLeaders(MOCK_LEADERS[timeframe]);
          return;
        }

        const res = await fetch(`/api/v1/achievements/leaderboard/${timeframe}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setLeaders(json.data);
        } else {
          setLeaders(MOCK_LEADERS[timeframe]);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setLeaders(MOCK_LEADERS[timeframe]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [timeframe]);

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
      <motion.div
        aria-hidden
        animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-90px',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(245,158,11,0.18), rgba(245,158,11,0))',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '130px',
          left: '-120px',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(122,31,43,0.14), rgba(122,31,43,0))',
          pointerEvents: 'none',
        }}
      />
      <header className="platform-page-header" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="platform-page-title" style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em' }}>Ecosystem Standing</h1>
          <p className="platform-page-subtitle" style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>Real-time ranking of the most strategic builders in the network.</p>
        </div>
        
        <div style={{ display: 'flex', background: '#fff', padding: '8px', borderRadius: '20px', gap: '8px', border: '1.5px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          {['weekly', 'monthly', 'all-time'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '12px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 950, textTransform: 'uppercase', transition: '0.2s',
                background: timeframe === t ? '#7A1F2B' : 'transparent',
                color: timeframe === t ? '#fff' : '#64748B',
                boxShadow: timeframe === t ? '0 10px 20px rgba(122,31,43,0.15)' : 'none'
              }}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Podium Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2.5rem', marginBottom: '6rem', minHeight: '300px' }}>
        {/* Silver */}
        {topThree[1] && <PodiumRank founder={topThree[1]} rank={2} height={200} color="#94A3B8" icon="award" />}
        {/* Gold */}
        {topThree[0] && <PodiumRank founder={topThree[0]} rank={1} height={260} color="#F59E0B" icon="zap" />}
        {/* Bronze */}
        {topThree[2] && <PodiumRank founder={topThree[2]} rank={3} height={150} color="#D97706" icon="target" />}
      </div>

      {/* Leaderboard Table */}
      <div style={{ background: '#fff', borderRadius: '48px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px 200px', padding: '1.5rem 2.5rem', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9', fontSize: '0.75rem', fontWeight: 950, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <div>Global Rank</div>
          <div>Founder Identification</div>
          <div style={{ textAlign: 'right' }}>Velocity Score</div>
          <div style={{ textAlign: 'right' }}>Verified Badges</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence>
            {others.map((founder, idx) => (
              <motion.div 
                key={founder._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px 200px', padding: '1.25rem 2.5rem', borderBottom: '1px solid #F1F5F9', alignItems: 'center', transition: '0.2s' }}
                whileHover={{ background: '#F8FAFC' }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 950, color: '#94A3B8' }}>#{idx + 4}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '16px', background: 'linear-gradient(135deg, #7A1F2B, #A52A2A)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 950, color: '#fff',
                    boxShadow: '0 8px 20px rgba(122,31,43,0.15)', flexShrink: 0
                  }}>
                     {founder.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 950, color: '#111', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>{founder.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>{founder.level || 'Elite Founder'}</div>
                    <div style={{ fontSize: '0.62rem', color: '#CBD5E1', fontWeight: 900, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.08em' }}>{founder.batch || 'Unlocked Batch'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 950, color: '#7A1F2B', fontSize: '1.1rem' }}>{founder.score.toLocaleString()}</div>
                <div style={{ textAlign: 'right', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontSize: '0.75rem' }}>
                  <Icon name="award" size={14} color="#fbbf24" />
                  {founder.badges} Earned
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .leaderboard-header,
          .leaderboard-row {
            grid-template-columns: 80px 1fr 140px 140px !important;
            padding: 1.5rem 2rem !important;
            font-size: 0.75rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .leaderboard-header,
          .leaderboard-row {
            grid-template-columns: 60px 1fr 100px !important;
            padding: 1.25rem 1.5rem !important;
          }
          .leaderboard-header div:nth-child(4),
          .leaderboard-row div:nth-child(4) {
            display: none;
          }
          .leaderboard-header div:nth-child(3),
          .leaderboard-row div:nth-child(3) {
            text-align: left !important;
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .leaderboard-header,
          .leaderboard-row {
            grid-template-columns: 50px 1fr !important;
            padding: 1rem !important;
          }
          .leaderboard-header div:nth-child(3),
          .leaderboard-header div:nth-child(4),
          .leaderboard-row div:nth-child(3),
          .leaderboard-row div:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function PodiumRank({ founder, rank, height, color, icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', flex: 1, maxWidth: '220px' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ 
          width: 110, height: 110, borderRadius: '40px', background: '#fff', border: `4px solid ${color}`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', fontWeight: 950, color: '#111', 
          boxShadow: `0 30px 60px ${color}20`, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}10, transparent)` }} />
          {founder.name[0]}
        </div>
        <div style={{ 
          position: 'absolute', bottom: '-12px', right: '-12px', width: 38, height: 38, background: color, 
          borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', 
          fontSize: '1rem', fontWeight: 950, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '3px solid #fff' 
        }}>
          {rank}
        </div>
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: 56,
            height: 56,
            borderRadius: '18px',
            border: `2px solid ${color}`,
            pointerEvents: 'none',
          }}
        />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 950, fontSize: '1.1rem', color: '#111', marginBottom: '4px', letterSpacing: '-0.02em' }}>{founder.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#7A1F2B', fontWeight: 950, fontSize: '0.9rem' }}>
          <Icon name="zap" size={14} />
          {founder.score.toLocaleString()} PTS
        </div>
      </div>

      <div style={{ 
        width: '100%', height: height, background: `linear-gradient(to bottom, ${color}15, transparent)`, 
        borderRadius: '24px 24px 0 0', border: `2px solid ${color}20`, borderBottom: 'none', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '2rem', gap: '0.8rem'
      }}>
         <Icon name={icon} size={32} color={color} opacity={0.6} />
         <div style={{ fontSize: '0.68rem', fontWeight: 950, color: color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tier Elite</div>
      </div>
    </motion.div>
  );
}
