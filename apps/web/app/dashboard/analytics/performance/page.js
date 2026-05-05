'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { apiGet } from '@/lib/api';
import '@/styles/analytics-v2.css';

export default function PerformanceAnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: perfData, error: perfError } = await apiGet('/api/v1/analytics/performance');
      if (perfData) setData(perfData);
      if (perfError) setError(perfError.message);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const historyScores = useMemo(() => {
    if (!data?.history || data.history.length === 0) return [0, 0];
    return data.history.map(h => h.accuracy);
  }, [data]);

  if (isLoading) return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', fontWeight: 800, color: '#94a3b8' }}>
      Quantifying Evaluative Data...
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
          Performance <span className="red-glow-text">Analytics</span>
        </h1>
      </header>

      <div className="analytics-grid">
        {/* Performance Hero Card */}
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
                  Founder Performance
                </span>
                <span style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Overall Accuracy: {Math.round(data?.averageAccuracy || 0)}%
                </span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#fff' }}>
                Evaluative <span style={{ color: 'var(--brand-gold)' }}>Intelligence</span>
              </h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '500px' }}>
                Your performance score is based on {data?.totalEvaluations || 0} assessment records and project reviews. Keep pushing for consistency.
              </p>
            </div>

            <div style={{ position: 'relative', width: 'clamp(120px, 30vw, 160px)', height: 'clamp(120px, 30vw, 160px)', flexShrink: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none" stroke="var(--brand-gold)" strokeWidth="10"
                  strokeDasharray="339.29"
                  initial={{ strokeDashoffset: 339.29 }}
                  animate={{ strokeDashoffset: 339.29 - (339.29 * (data?.averageAccuracy || 0)) / 100 }}
                  transition={{ duration: 2, ease: 'circOut' }}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{Math.round(data?.averageAccuracy || 0)}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '4px' }}>Accuracy</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quiz Scores Trend Chart */}
        <div className="col-8">
           <div className="glass-card-v2" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>Score Velocity</h3>
                 <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--slate-50)', padding: '10px 20px', borderRadius: '14px', border: '1.5px solid var(--slate-100)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-red)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-red)' }}>GRADED ASSESSMENTS</span>
                 </div>
              </div>

              <div style={{ position: 'relative', height: '260px', width: '100%', paddingLeft: 'clamp(20px, 5vw, 40px)' }}>
                 {[100, 80, 60, 40, 20, 0].map((val) => (
                    <div key={val} style={{ position: 'absolute', left: 0, top: `${((100 - val) / 100) * 220}px`, display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--slate-400)', width: '25px', textAlign: 'right' }}>{val}%</span>
                       <div style={{ flex: 1, height: '1px', background: 'var(--slate-100)' }} />
                    </div>
                 ))}

                 <div style={{ position: 'absolute', top: 0, left: 'clamp(20px, 5vw, 40px)', width: 'calc(100% - clamp(20px, 5vw, 40px))', height: '220px' }}>
                    {historyScores.length > 1 ? (
                      <svg width="100%" height="100%" viewBox={`0 0 ${(historyScores.length - 1) * 100} 220`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <defs>
                           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--brand-red)" stopOpacity="0.2" />
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
                           fill="none" stroke="var(--brand-gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                        />
                        {historyScores.map((s, i) => (
                           <motion.circle 
                              key={i} cx={i * 100} cy={220 - (s / 100) * 220} r="7" 
                              fill="#fff" stroke="var(--brand-gold)" strokeWidth="3.5"
                              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                           />
                        ))}
                      </svg>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)' }}>Insufficient data trends</div>
                    )}
                 </div>

                 <div style={{ position: 'absolute', bottom: -25, left: '40px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between' }}>
                    {data?.history?.map((h, i) => (
                       <span key={i} style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-400)' }}>{new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Column */}
        <div className="col-4">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
              <div className="glass-card-v2" style={{ padding: '2rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'rgba(122, 31, 43, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="checkCircle" size={24} color="var(--brand-red)" />
                 </div>
                 <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-500)', letterSpacing: '0.05em' }}>TOTAL ANSWERS</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>{data?.totalEvaluations || 0}</div>
                 </div>
              </div>
              
              <div className="glass-card-v2" style={{ padding: '2rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'rgba(197, 151, 91, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="zap" size={24} color="var(--brand-gold)" />
                 </div>
                 <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-500)', letterSpacing: '0.05em' }}>PEAK PERFORMANCE</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>{Math.round(data?.bestPerformance || 0)}%</div>
                 </div>
              </div>

           </div>
        </div>

        {/* Subject-wise Mastery Breakdown */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2.5rem' }}>Subject Mastery Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {(data?.subjects || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                     <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(122, 31, 43, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="zap" size={20} color="var(--brand-red)" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                           <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{s.name}</span>
                           <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>{s.score}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--slate-50)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--slate-100)' }}>
                           <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: s.score > 70 ? 'var(--brand-gold)' : 'var(--slate-800)', borderRadius: '10px' }} />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Project Tracking */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2.5rem' }}>Recorded Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {(data?.history || []).slice(0, 3).map((a, i) => (
                   <div key={i} style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--slate-50)', border: '1.5px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                         <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--slate-100)' }}>
                            <Icon name="fileText" size={20} color="var(--slate-400)" />
                         </div>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{a.title || 'Curriculum Task'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>{new Date(a.date).toLocaleDateString()}</div>
                         </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-red)' }}>{Math.round(a.accuracy)}%</div>
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--slate-400)', letterSpacing: '0.05em' }}>GRADED</div>
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
