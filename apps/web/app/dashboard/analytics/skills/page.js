'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { apiGet } from '@/lib/api';
import '@/styles/analytics-v2.css';

export default function SkillGraphPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: skillData, error: skillError } = await apiGet('/api/v1/analytics/skills');
      if (skillData) setData(skillData);
      if (skillError) setError(skillError.message);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const radarData = useMemo(() => {
    if (!data?.radar) return [
      { label: 'Problem Solving', score: 0 },
      { label: 'Concept Mastery', score: 0 },
      { label: 'Speed', score: 0 },
      { label: 'Accuracy', score: 0 },
      { label: 'Memory Retention', score: 0 },
    ];
    return data.radar;
  }, [data]);

  const totalPoints = radarData.length;
  const radius = 120;
  const cx = 150;
  const cy = 150;
  
  const getPoint = (score, index) => {
    const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2;
    const r = (radius * score) / 100;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const radarPath = radarData.map((s, i) => {
    const p = getPoint(s.score, i);
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(' ') + ' Z';

  if (isLoading) return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', fontWeight: 900, color: 'var(--slate-400)' }}>
      Rendering Cognitive Skillscape...
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
          Skill <span className="red-glow-text">Graph</span>
        </h1>
      </header>

      <div className="analytics-grid">
        {/* Skills Hero Card */}
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-v2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-red) 0%, #5a1720 100%)',
              color: '#fff',
              padding: '2.5rem 3rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 30px 60px rgba(122, 31, 43, 0.2)',
              flexWrap: 'wrap',
              gap: '2.5rem'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'var(--brand-gold)', filter: 'blur(180px)', opacity: 0.2, zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ padding: '8px 16px', background: 'rgba(197, 151, 91, 0.25)', color: 'var(--brand-gold)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Founder Intelligence
                </span>
                <span style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Phase: Scale-Up Ready
                </span>
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#fff', lineHeight: 1.1 }}>
                Cognitive <span style={{ color: 'var(--brand-gold)' }}>Skillscape</span>
              </h2>
              <p style={{ fontSize: '1.15rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '550px', margin: 0 }}>
                Mapping your core competencies across technical, operational, and strategic domains based on your curriculum performance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'clamp(1rem, 5vw, 3.5rem)', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-gold)', marginBottom: '4px' }}>{radarData.length > 0 ? Math.round(radarData.reduce((sum, r) => sum + r.score, 0) / radarData.length) : 0}%</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AVG SCORE</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{(data?.proficiency || []).length}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SUBJECTS</div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Intelligence Radar Chart - Full Width Centered */}
        <div className="col-12">
           <div className="glass-card-v2" style={{ padding: 'clamp(1rem, 5vw, 3rem)', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--slate-900)', marginBottom: 'clamp(2rem, 8vw, 4rem)' }}>Cognitive Mapping</h3>
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                 <svg width="100%" height="auto" viewBox="0 0 600 450" style={{ overflow: 'visible' }}>
                    <defs>
                       <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="var(--brand-red)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0" />
                       </radialGradient>
                    </defs>

                    {/* Background levels */}
                    {[20, 40, 60, 80, 100].map((level) => {
                       const levelRadius = (160 * level) / 100;
                       return (
                         <path 
                            key={level}
                            d={radarData.map((_, i) => {
                               const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
                               return `${i === 0 ? 'M' : 'L'} ${300 + levelRadius * Math.cos(angle)} ${225 + levelRadius * Math.sin(angle)}`;
                            }).join(' ') + ' Z'}
                            fill="none" stroke="var(--slate-100)" strokeWidth="1"
                         />
                       );
                    })}
                    
                    {/* Axis lines */}
                    {radarData.map((_, i) => {
                       const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
                       return <line key={i} x1="300" y1="225" x2={300 + 160 * Math.cos(angle)} y2={225 + 160 * Math.sin(angle)} stroke="var(--slate-100)" strokeWidth="1" />;
                    })}

                    {/* Data Path */}
                    <motion.path 
                       initial={{ pathLength: 0, opacity: 0 }} 
                       animate={{ pathLength: 1, opacity: 1 }} 
                       transition={{ duration: 2, ease: "easeInOut" }}
                       d={radarData.map((s, i) => {
                          const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
                          const r = (160 * s.score) / 100;
                          return `${i === 0 ? 'M' : 'L'} ${300 + r * Math.cos(angle)} ${225 + r * Math.sin(angle)}`;
                       }).join(' ') + ' Z'}
                       fill="url(#radarGlow)" 
                       stroke="var(--brand-gold)" 
                       strokeWidth="3"
                       strokeLinejoin="round"
                    />

                    {/* Data points and labels */}
                    {radarData.map((s, i) => {
                       const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
                       const r = (160 * s.score) / 100;
                       const px = 300 + r * Math.cos(angle);
                       const py = 225 + r * Math.sin(angle);
                       
                       // Label positioning
                       const labelRadius = 200;
                       const lx = 300 + labelRadius * Math.cos(angle);
                       const ly = 225 + labelRadius * Math.sin(angle);
                       
                       return (
                         <g key={i}>
                            <motion.circle 
                               cx={px} cy={py} r="6" 
                               fill="var(--brand-gold)" 
                               stroke="#fff" 
                               strokeWidth="2.5"
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               transition={{ delay: 1 + i * 0.1 }}
                            />
                            <text 
                              x={lx} y={ly} 
                              textAnchor="middle" 
                              dominantBaseline="middle"
                              style={{ fontSize: '13px', fontWeight: 800, fill: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              {s.label}
                            </text>
                            <text 
                              x={lx} y={ly + 18} 
                              textAnchor="middle" 
                              dominantBaseline="middle"
                              style={{ fontSize: '12px', fontWeight: 800, fill: 'var(--brand-gold)' }}
                            >
                              {s.score}%
                            </text>
                         </g>
                       );
                    })}
                 </svg>
              </div>
           </div>
        </div>

        {/* Subject Proficiency Grid */}
        <div className="col-12">
           <div className="glass-card-v2" style={{ padding: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2.5rem' }}>Subject Mastery Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem 4rem' }}>
                 {(data?.proficiency || []).map((s, i) => (
                    <div key={i}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'flex-end' }}>
                          <div style={{ flex: 1 }}>
                             <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', display: 'block' }}>{s.name}</span>
                             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-gold)', letterSpacing: '0.1em' }}>{s.score > 80 ? 'EXPERT' : s.score > 50 ? 'MASTER' : 'BEGINNER'}</span>
                          </div>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>{s.score}%</span>
                       </div>
                       <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '12px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1.5, delay: i * 0.05 }} style={{ height: '100%', background: s.score > 70 ? 'var(--brand-gold)' : 'var(--slate-800)', borderRadius: '10px' }} />
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
