'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import '@/styles/analytics-v2.css';

export default function LearningTimePage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/v1/analytics/learning-time');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error('Failed to fetch learning time data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const weeklyData = useMemo(() => {
    if (!data?.dailyBreakdown) return [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const results = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = data.dailyBreakdown.find(b => b.date === dateStr);
      results.push({
        day: days[(d.getDay() + 6) % 7], // Map Sun (0) to index 6
        hours: match ? (match.minutes / 60).toFixed(1) : '0.0'
      });
    }
    return results;
  }, [data]);

  const maxHours = useMemo(() => {
    const hours = weeklyData.map(d => parseFloat(d.hours));
    return Math.max(...hours, 1);
  }, [weeklyData]);

  if (isLoading) return (
    <div className="analytics-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #f1f5f9', borderTop: '4px solid var(--brand-red)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748b' }}>Syncing chronological logs...</p>
      </div>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  return (
    <div className="analytics-page">
      {/* Decorative Background Elements */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(122, 31, 43, 0.03) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-5%', left: '-5%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(197, 151, 91, 0.03) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <header className="analytics-header" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <span style={{ padding: '6px 12px', background: 'rgba(122, 31, 43, 0.08)', color: 'var(--brand-red)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Behavioral Analytics
          </span>
        </div>
        <h1 className="analytics-title">
          Learning <span className="red-glow-text">Time</span>
        </h1>
        <p className="analytics-subtitle">
          Behavior tracking and focus consistency throughout your founder development journey.
        </p>
      </header>

      <div className="analytics-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Weekly Study Velocity Chart */}
        <div className="col-12">
           <div className="glass-card-v2" style={{ padding: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                 <div>
                   <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Study Velocity</h3>
                   <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '8px', fontWeight: 500 }}>Active learning hours over the last 7 days</p>
                 </div>
                 <div style={{ padding: '16px 32px', borderRadius: '20px', background: '#0f172a', color: '#fff', textAlign: 'right', boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Total Weekly</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>{data?.totalHours || 0} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>hrs</span></div>
                 </div>
              </div>

               <div className="bar-chart-container" style={{ height: '320px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', paddingBottom: '1.5rem' }}>
                  {weeklyData.map((d, i) => {
                    const isWeekend = d.day === 'Sat' || d.day === 'Sun';
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minWidth: '40px' }}>
                        <div style={{ position: 'relative', width: '100%', height: '240px', display: 'flex', flexDirection: 'column-reverse' }}>
                           <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${(parseFloat(d.hours) / maxHours) * 100}%` }}
                               transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                               style={{ 
                                  background: isWeekend ? 'linear-gradient(180deg, var(--brand-red-light) 0%, var(--brand-red) 100%)' : 'linear-gradient(180deg, #334155 0%, #0f172a 100%)', 
                                  borderRadius: '16px', width: '100%',
                                  boxShadow: isWeekend ? '0 10px 25px rgba(122, 31, 43, 0.15)' : 'none',
                                  position: 'relative'
                               }}
                           >
                             {parseFloat(d.hours) > 0 && (
                               <div style={{ position: 'absolute', top: '-35px', width: '100%', textAlign: 'center', fontSize: '0.9rem', fontWeight: 900, color: isWeekend ? 'var(--brand-red)' : '#0f172a' }}>
                                 {d.hours}h
                               </div>
                             )}
                           </motion.div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isWeekend ? 'var(--brand-red)' : '#94a3b8', letterSpacing: '0.05em' }}>{d.day.toUpperCase()}</span>
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>

         {/* Consistency & Impact Row */}
         <div className="col-6">
            <div className="glass-card-v2" style={{ padding: '2.5rem', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', border: 'none' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Icon name="streak" size={20} color="var(--brand-gold)" /> Consistency Metric
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Daily Session</span>
                     <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>1.8 <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>hrs</span></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(197, 151, 91, 0.12)', borderRadius: '20px', border: '1px solid rgba(197, 151, 91, 0.25)' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Learning Streak</span>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--brand-gold)' }}>{data?.streak || 0}</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-gold)' }}>DAYS</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="col-6">
            <div className="glass-card-v2" style={{ padding: '2.5rem', height: '100%' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'var(--brand-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(122, 31, 43, 0.2)', flexShrink: 0 }}>
                     <Icon name="zap" size={24} color="#fff" />
                  </div>
                  <div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peak Engagement</div>
                     <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>{data?.peakHours || 'Analyzing patterns...'}</div>
                  </div>
               </div>
               <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                 <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, margin: 0, lineHeight: 1.7 }}>
                    Your productivity peak is identified based on lesson completion density and assessment activity timestamps. Maintain your focus during this window for optimal results.
                 </p>
               </div>
            </div>
         </div>
      </div>

      <style jsx>{`
        .red-glow-text {
          color: var(--brand-red);
          text-shadow: 0 0 40px rgba(122, 31, 43, 0.15);
        }
      `}</style>
    </div>
  );
}
