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

  if (isLoading) return <div className="p-10 text-center">Syncing Chronological Logs...</div>;

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1 className="analytics-title">
          Learning <span className="red-glow-text">Time</span>
        </h1>
        <p className="analytics-subtitle">
          Behavior tracking and focus consistency throughout your founder development journey.
        </p>
      </header>

      <div className="analytics-grid">
        {/* Weekly Study Velocity Chart */}
        <div className="col-8">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Weekly Study Velocity</h3>
                 <div style={{ padding: '12px 28px', borderRadius: '16px', background: 'var(--brand-red)', color: '#fff', fontSize: '0.9rem', fontWeight: 950, boxShadow: '0 10px 20px rgba(122, 31, 43, 0.2)' }}>
                    TOTAL: {data?.totalHours || 0} hrs
                 </div>
              </div>

               <div className="bar-chart-container" style={{ height: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', paddingBottom: '2.5rem' }}>
                  {weeklyData.map((d, i) => (
                     <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', minWidth: '40px' }}>
                        <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', flexDirection: 'column-reverse' }}>
                           <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${(parseFloat(d.hours) / maxHours) * 100}%` }}
                              transition={{ duration: 1.2, delay: i * 0.1, ease: 'circOut' }}
                              style={{ 
                                 background: d.day === 'Sat' || d.day === 'Sun' ? 'var(--brand-red)' : '#0f172a', 
                                 borderRadius: '16px', width: '100%',
                                 boxShadow: d.day === 'Sat' || d.day === 'Sun' ? '0 10px 20px rgba(122, 31, 43, 0.15)' : 'none'
                              }}
                           />
                           <div style={{ position: 'absolute', top: '-35px', width: '100%', textAlign: 'center', fontSize: '0.85rem', fontWeight: 950, color: '#0f172a' }}>
                              {d.hours}h
                           </div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 950, color: '#94a3b8' }}>{d.day.toUpperCase()}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: Peak Focus & Consistency */}
         <div className="col-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <div className="glass-card-v2" style={{ padding: '2.5rem', borderRadius: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                     <div style={{ width: 54, height: 54, borderRadius: '18px', background: 'var(--brand-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(122, 31, 43, 0.2)', flexShrink: 0 }}>
                        <Icon name="zap" size={24} color="#fff" />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Peak Focus Hour</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--brand-red)' }}>{data?.peakHours || '09:00 PM - 11:00 PM'}</div>
                     </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, margin: 0, lineHeight: 1.8 }}>
                     Your productivity is <span style={{ color: '#0f172a', fontWeight: 950 }}>24% higher</span> during this window.
                  </p>
               </div>

               <div className="glass-card-v2" style={{ padding: '2.5rem', borderRadius: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', border: 'none' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#fff', marginBottom: '2.5rem' }}>Consistency Stats</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>AVG SESSION</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 950 }}>1.8 hrs</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(122, 31, 43, 0.2)', borderRadius: '20px', border: '1.5px solid rgba(122, 31, 43, 0.3)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-gold)', letterSpacing: '0.05em' }}>STREAK</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--brand-gold)' }}>{data?.streak || 8} Days</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Time Distribution & Daily Mission */}
         <div className="col-12">
            <div className="glass-card-v2 flex-stack-mobile" style={{ padding: '3.5rem', display: 'flex', gap: '4rem', alignItems: 'center' }}>
               <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '220px', height: '220px', position: 'relative', flexShrink: 0 }}>
                     <svg width="220" height="220" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f8fafc" strokeWidth="12" />
                        <motion.circle 
                           cx="50" cy="50" r="42" fill="none" stroke="var(--brand-red)" strokeWidth="12" 
                           strokeDasharray="263.89" strokeDashoffset="158" strokeLinecap="round" transform="rotate(-90 50 50)" 
                        />
                     </svg>
                     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', lineHeight: 1 }}>{Math.round(data?.totalHours || 0)}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 950, marginTop: '4px' }}>TOTAL HOURS</div>
                     </div>
                  </div>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', marginBottom: '1.5rem' }}>Time Distribution</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                          { name: 'Live Sessions', value: 40, color: 'var(--brand-red)' },
                          { name: 'Assessments', value: 35, color: '#0f172a' },
                          { name: 'Notes & Reading', value: 25, color: 'var(--brand-gold)' }
                        ].map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f8fafc' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 12, height: 12, borderRadius: 4, background: d.color }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{d.name}</span>
                             </div>
                             <span style={{ fontSize: '0.9rem', fontWeight: 950, color: '#64748b' }}>{d.value}%</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div style={{ flex: 1, width: '100%', background: '#f8fafc', padding: '2.5rem', borderRadius: '40px', border: '1.5px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#0f172a', marginBottom: '8px' }}>Daily Mission</h3>
                  <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, marginBottom: '2.5rem' }}>Target: 2 hrs / day focused study</p>
                  
                  <div style={{ marginBottom: '2rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 950, color: 'var(--brand-red)' }}>PROGRESS: 82%</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 950, color: '#94a3b8' }}>1.64h / 2.0h</span>
                     </div>
                     <div style={{ height: '14px', background: 'var(--dashboard-bg)', borderRadius: '20px', border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 2 }} style={{ height: '100%', background: 'var(--brand-red)', borderRadius: '20px' }} />
                     </div>
                  </div>
                  
                  <div style={{ padding: '1.25rem', background: 'var(--dashboard-bg)', border: '1.5px solid rgba(122, 31, 43, 0.1)', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(122, 31, 43, 0.05)' }}>
                     <p style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--brand-red)', margin: 0 }}>You are only 22 mins away from your goal!</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
