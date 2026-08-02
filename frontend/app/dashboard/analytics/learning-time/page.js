'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { apiGet } from '@/lib/api';
import '@/styles/analytics-v2.css';

export default function LearningTimePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: timeData, error: timeError } = await apiGet('/api/v1/analytics/learning-time');
      if (timeData) setData(timeData);
      if (timeError) setError(timeError.message);
      setIsLoading(false);
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
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-500)' }}>Syncing chronological logs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', color: '#ef4444' }}>
      <Icon name="alertCircle" size={32} color="#ef4444" />
      <p style={{ marginTop: '1rem', fontWeight: 700 }}>Failed to load analytics: {error}</p>
    </div>
  );

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1 className="analytics-title">
          Learning <span className="red-glow-text">Time</span>
        </h1>
      </header>

      <div className="analytics-grid">
        {/* Learning Velocity Hero Card */}
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-v2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-red) 0%, #5a1720 100%)',
              color: '#fff',
              padding: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 30px 60px rgba(122, 31, 43, 0.15)',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '350px', height: '350px', background: 'var(--brand-gold)', filter: 'blur(160px)', opacity: 0.15, zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ padding: '6px 12px', background: 'rgba(197, 151, 91, 0.2)', color: 'var(--brand-gold)', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Founder Focus
                </span>
                <span style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {data?.streak || 0} Day Streak
                </span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#fff' }}>
                Learning <span style={{ color: 'var(--brand-gold)' }}>Velocity</span>
              </h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '500px' }}>
                You have dedicated {data?.totalHours || 0} hours to your development this week. Maintain this momentum to accelerate your mastery.
              </p>
            </div>

            <div style={{ padding: 'clamp(1rem, 4vw, 2rem) clamp(1.5rem, 5vw, 3rem)', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', minWidth: '160px', flex: '1 1 auto' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Weekly Average</div>
               <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 800 }}>{data?.avgDailyHours || '0.0'}<span style={{ fontSize: '1rem', opacity: 0.6, marginLeft: '4px' }}>hrs/d</span></div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Study Velocity Chart */}
        <div className="col-8">
           <div className="glass-card-v2" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                 <h3 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>Active Hours Breakdown</h3>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', letterSpacing: '0.05em' }}>LAST 7 DAYS</div>
              </div>

               <div style={{ height: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'clamp(4px, 2vw, 1rem)' }}>
                  {weeklyData.map((d, i) => {
                    const isWeekend = d.day === 'Sat' || d.day === 'Sun';
                    const heightPercent = (parseFloat(d.hours) / maxHours) * 100;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                        <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', flexDirection: 'column-reverse' }}>
                           <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                style={{ 
                                   background: isWeekend ? 'var(--brand-gold)' : 'var(--slate-800)', 
                                   borderRadius: 'clamp(4px, 1vw, 12px)', width: '100%',
                                   opacity: isWeekend ? 0.9 : 1,
                                   position: 'relative',
                                   boxShadow: isWeekend ? '0 10px 20px rgba(197, 151, 91, 0.1)' : '0 10px 20px rgba(15, 23, 42, 0.05)'
                                }}
                           >
                             {parseFloat(d.hours) > 0 && (
                               <div style={{ position: 'absolute', top: '-28px', width: '100%', textAlign: 'center', fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 800, color: isWeekend ? 'var(--brand-gold)' : 'var(--slate-900)' }}>
                                 {d.hours}h
                               </div>
                             )}
                           </motion.div>
                        </div>
                        <span style={{ fontSize: 'clamp(0.6rem, 2vw, 0.75rem)', fontWeight: 800, color: 'var(--slate-400)', letterSpacing: '0.05em' }}>{d.day}</span>
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>

         {/* Side Stats */}
         <div className="col-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
               <div className="glass-card-v2" style={{ padding: '2rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Icon name="zap" size={24} color="var(--slate-900)" />
                  </div>
                  <div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-500)', letterSpacing: '0.05em' }}>PEAK FOCUS</div>
                     <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>{data?.peakHours || 'TBD'}</div>
                  </div>
               </div>

               <div className="glass-card-v2" style={{ padding: '2rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'rgba(197, 151, 91, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Icon name="streak" size={24} color="var(--brand-gold)" />
                  </div>
                  <div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-500)', letterSpacing: '0.05em' }}>CURRENT STREAK</div>
                     <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>{data?.streak || 0} Days</div>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
