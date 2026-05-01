'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import '@/styles/analytics-v2.css';

export default function ProgressOverviewPage() {
  const [data, setData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressRes, timeRes] = await Promise.all([
          fetch('/api/v1/analytics/progress'),
          fetch('/api/v1/analytics/learning-time')
        ]);
        
        const progressJson = await progressRes.json();
        const timeJson = await timeRes.json();
        
        if (progressJson.success) setData(progressJson.data);
        if (timeJson.success) setTimeData(timeJson.data);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const overall = Math.round(data?.overallCompletion || 0);

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', fontWeight: 900, color: '#94a3b8' }}>Analysing Curriculum Progress...</div>;

  return (
    <div className="analytics-page">
      {/* Hero Section: Mastery Path */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '40px', padding: '3.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem',
          position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 30px 60px rgba(122, 31, 43, 0.12)'
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '350px', height: '350px', background: 'var(--brand-red)', filter: 'blur(160px)', opacity: 0.15, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.05em', margin: '0 0 16px', color: '#fff' }}>
              Mastery <span style={{ color: 'var(--brand-red)' }}>Path</span>
           </h1>
           <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 0 2.5rem', maxWidth: '550px' }}>
              You have completed <span style={{ color: '#fff', fontWeight: 950 }}>{overall}%</span> of your startup learning path. You're currently <span style={{ color: 'var(--brand-gold)', fontWeight: 950 }}>12% ahead</span> of schedule.
           </p>
           <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--brand-red)', color: '#fff', padding: '10px 24px', fontSize: '0.8rem', borderRadius: '14px', fontWeight: 950, letterSpacing: '0.05em' }}>VALEDICTORIAN TRACK</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', padding: '10px 24px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 950, border: '1.5px solid rgba(255,255,255,0.1)' }}>
                 <Icon name="zap" size={18} color="var(--brand-red)" /> 8 DAY STREAK
              </div>
           </div>
        </div>

        <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
           <svg width="180" height="180" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <motion.circle 
                cx="60" cy="60" r="54" fill="none" stroke="var(--brand-red)" strokeWidth="10" 
                strokeDasharray="339.29"
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: 339.29 - (339.29 * overall) / 100 }}
                transition={{ duration: 2, ease: "circOut" }}
                strokeLinecap="round" transform="rotate(-90 60 60)"
              />
           </svg>
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', lineHeight: 1 }}>{overall}%</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 950, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '6px' }}>Path</div>
           </div>
        </div>
      </motion.div>

      <div className="analytics-grid">
        {/* Stats Grid */}
        <div className="col-12 stats-grid">
           {[
             { label: 'Total Hours Learned', val: (timeData?.totalHours || 0) + 'h', icon: 'clock', color: 'var(--brand-gold)' },
             { label: 'Modules Cleared', val: data?.completedItems || 0, icon: 'bookOpen', color: 'var(--brand-red)' },
             { label: 'Achievements', val: '2', icon: 'award', color: '#10b981' },
           ].map((s, i) => (
             <div key={i} className="glass-card-v2" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '22px', background: `${s.color === 'var(--brand-red)' || s.color === 'var(--brand-gold)' ? s.color + '20' : s.color + '15'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Icon name={s.icon} size={28} color={s.color} />
                </div>
                <div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</div>
                   <div style={{ fontSize: '2.25rem', fontWeight: 950, color: '#0f172a' }}>{s.val}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Subject Mastery Trends */}
        <div className="col-8">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: '#0f172a', marginBottom: '3.5rem' }}>Subject Mastery Trends</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 {(data?.courseBreakdown || []).map((course, i) => (
                   <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                         <span style={{ fontSize: '1.05rem', fontWeight: 950, color: '#0f172a' }}>{course.courseTitle}</span>
                         <span style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--brand-red)' }}>{Math.round(course.percentage)}%</span>
                      </div>
                      <div style={{ height: '10px', background: '#f8fafc', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #f1f5f9' }}>
                         <motion.div initial={{ width: 0 }} animate={{ width: `${course.percentage}%` }} transition={{ duration: 1.5, delay: i * 0.1 }} style={{ height: '100%', background: 'var(--brand-red)', borderRadius: '10px' }} />
                      </div>
                   </div>
                  ))}
              </div>
           </div>
        </div>
        <div className="col-4">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              <div className="glass-card-v2" style={{ padding: '3rem', borderRadius: '32px' }}>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#0f172a', marginBottom: '2.5rem' }}>Recent Activity</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--brand-red)10', border: '1.5px solid var(--brand-red)20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="zap" size={20} color="var(--brand-red)" />
                       </div>
                       <div>
                          <div style={{ fontSize: '1rem', fontWeight: 950, color: '#0f172a' }}>Advanced Pitching</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 750 }}>Last active 2h ago</div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: 48, height: 48, borderRadius: '16px', background: '#ecfdf5', border: '1.5px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="checkCircle" size={20} color="#10b981" />
                       </div>
                       <div>
                          <div style={{ fontSize: '1rem', fontWeight: 950, color: '#0f172a' }}>Unit Economics Quiz</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 750 }}>Graded: 92% Mastery</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-card-v2" style={{ padding: '3rem', borderRadius: '32px', background: 'linear-gradient(135deg, var(--brand-red) 0%, #5a1720 100%)', color: '#fff', border: 'none', boxShadow: '0 25px 50px rgba(122, 31, 43, 0.25)' }}>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#fff', marginBottom: '2.5rem' }}>Upcoming Missions</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                      { title: 'Final Pitch Draft', deadline: 'Tomorrow, 5 PM', urgency: 'High' },
                      { title: 'Market Size Quiz', deadline: 'Oct 28', urgency: 'Medium' }
                    ].map((t, i) => (
                      <div key={i} style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 950, color: t.urgency === 'High' ? '#fff' : 'var(--brand-gold)', textTransform: 'uppercase' }}>{t.urgency} PRIORITY</span>
                            <Icon name="clock" size={14} color="rgba(255,255,255,0.6)" />
                         </div>
                         <div style={{ fontSize: '1.15rem', fontWeight: 950, marginBottom: '6px' }}>{t.title}</div>
                         <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{t.deadline}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
