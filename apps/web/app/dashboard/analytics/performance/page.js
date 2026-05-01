'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import '@/styles/analytics-v2.css';

export default function PerformanceAnalyticsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/v1/analytics/performance');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error('Failed to fetch performance data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const historyScores = useMemo(() => {
    if (!data?.history || data.history.length === 0) return [0, 0];
    return data.history.map(h => h.accuracy);
  }, [data]);

  if (isLoading) return <div className="p-10 text-center">Quantifying Evaluative Data...</div>;

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1 className="analytics-title">
          Performance <span className="red-glow-text">Analytics</span>
        </h1>
        <p className="analytics-subtitle">
          Deep dive into your quiz trends, subject mastery, and project velocity.
        </p>
      </header>

      <div className="analytics-grid">
        {/* Quiz Scores Trend Chart */}
        <div className="col-8">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Quiz Scores Trend</h3>
                 <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f8fafc', padding: '10px 20px', borderRadius: '14px', border: '1.5px solid #f1f5f9' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-red)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 950, color: '#0f172a' }}>YOUR PERFORMANCE</span>
                 </div>
              </div>

              <div style={{ position: 'relative', height: '260px', width: '100%', paddingLeft: '40px' }}>
                 {[100, 80, 60, 40, 20, 0].map((val) => (
                    <div key={val} style={{ position: 'absolute', left: 0, top: `${((100 - val) / 100) * 220}px`, display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', width: '30px', textAlign: 'right' }}>{val}</span>
                       <div style={{ flex: 1, height: '1.5px', background: '#f8fafc' }} />
                    </div>
                 ))}

                 <div style={{ position: 'absolute', top: 0, left: '40px', width: 'calc(100% - 40px)', height: '220px' }}>
                    {historyScores.length > 1 ? (
                      <svg style={{ width: '100%', height: '100%' }} viewBox={`0 0 ${(historyScores.length - 1) * 100} 220`} preserveAspectRatio="none">
                        <defs>
                           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--brand-red)" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0" />
                           </linearGradient>
                        </defs>
                        <motion.path 
                           d={`M 0 ${220 - (historyScores[0] / 100) * 220} ${historyScores.map((s, i) => `L ${i * 100} ${220 - (s / 100) * 220}`).join(' ')} L ${(historyScores.length-1)*100} 220 L 0 220 Z`}
                           fill="url(#chartGrad)"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                        />
                        <motion.path 
                           d={`M ${historyScores.map((s, i) => `${i * 100} ${220 - (s / 100) * 220}`).join(' L ')}`}
                           fill="none" stroke="var(--brand-red)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                        />
                        {historyScores.map((s, i) => (
                           <motion.circle 
                              key={i} cx={i * 100} cy={220 - (s / 100) * 220} r="7" 
                              fill="#fff" stroke="var(--brand-red)" strokeWidth="3.5"
                              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                           />
                        ))}
                      </svg>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Insufficient trends</div>
                    )}
                 </div>

                 <div style={{ position: 'absolute', bottom: -25, left: '40px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between' }}>
                    {data?.history?.map((h, i) => (
                       <span key={i} style={{ fontSize: '0.75rem', fontWeight: 850, color: '#94a3b8' }}>{new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Accuracy Rate Gauge */}
        <div className="col-4">
           <div className="glass-card-v2" style={{ padding: '3.5rem', height: '100%', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '2.5rem' }}>
                 <svg width="180" height="180" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f8fafc" strokeWidth="12" />
                    <motion.circle 
                       cx="60" cy="60" r="54" fill="none" stroke="var(--brand-gold)" strokeWidth="12" 
                       strokeDasharray="339.29" initial={{ strokeDashoffset: 339.29 }}
                       animate={{ strokeDashoffset: 339.29 - (339.29 * (data?.averageAccuracy || 0)) / 100 }}
                       transition={{ duration: 1.5, ease: "circOut" }}
                       strokeLinecap="round" transform="rotate(-90 60 60)"
                    />
                 </svg>
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: 950, color: '#0f172a' }}>{Math.round(data?.averageAccuracy || 0)}%</div>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', margin: '0 0 10px' }}>Accuracy Rate</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, margin: 0 }}>Correct vs Incorrect answers</p>
              
              <div style={{ marginTop: '3rem', width: '100%', display: 'flex', gap: '1.5rem' }}>
                 <div style={{ flex: 1, padding: '20px', borderRadius: '24px', background: '#f8fafc', border: '1.5px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', marginBottom: '6px' }}>ANSWERS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0f172a' }}>{data?.totalEvaluations || 0}</div>
                 </div>
                 <div style={{ flex: 1, padding: '20px', borderRadius: '24px', background: '#f8fafc', border: '1.5px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', marginBottom: '6px' }}>PEAK</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0f172a' }}>{Math.round(data?.bestPerformance || 0)}%</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Subject-wise Mastery Breakdown */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', marginBottom: '3.5rem' }}>Subject Mastery Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {(data?.subjects || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                     <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'var(--brand-red)10', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--brand-red)20' }}>
                        <Icon name="zap" size={24} color="var(--brand-red)" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                           <span style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a' }}>{s.name}</span>
                           <span style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--brand-red)' }}>{s.score}%</span>
                        </div>
                        <div style={{ height: '10px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                           <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: 'var(--brand-red)', borderRadius: '12px' }} />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Project Tracking */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', marginBottom: '3rem' }}>Project Tracking</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {(data?.history || []).slice(0, 3).map((a, i) => (
                   <div key={i} style={{ padding: '1.75rem', borderRadius: '28px', background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'var(--dashboard-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #f1f5f9' }}>
                            <Icon name="fileText" size={24} color="#94a3b8" />
                         </div>
                         <div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 950, color: '#0f172a' }}>{a.title || 'Curriculum Task'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Recorded {new Date(a.date).toLocaleDateString()}</div>
                         </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#10b981' }}>{Math.round(a.accuracy)}%</div>
                         <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.08em' }}>GRADED</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
