'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import '@/styles/analytics-v2.css';

export default function SkillGraphPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/v1/analytics/skills');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error('Failed to fetch skill data:', err);
      } finally {
        setIsLoading(false);
      }
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

  if (isLoading) return <div className="p-10 text-center">Rendering Cognitive Skillscape...</div>;

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1 className="analytics-title">
          Skill <span className="red-glow-text">Graph</span>
        </h1>
        <p className="analytics-subtitle">
          Visual intelligence showing your cognitive strengths and learning velocity.
        </p>
      </header>

      <div className="analytics-grid">
        {/* Visual Intelligence Radar Chart */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', width: '100%', marginBottom: '4rem', textAlign: 'left' }}>Visual Intelligence</h3>
              
              <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto' }}>
                 <svg width="320" height="320" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
                    {[20, 40, 60, 80, 100].map((level) => (
                       <path 
                          key={level}
                          d={radarData.map((_, i) => {
                             const p = getPoint(level, i);
                             return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                          }).join(' ') + ' Z'}
                          fill="none" stroke="#f1f5f9" strokeWidth="1.5"
                       />
                    ))}
                    {radarData.map((_, i) => {
                       const p = getPoint(100, i);
                       return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth="1.5" />;
                    })}
                    <motion.path 
                       initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2 }}
                       d={radarPath} fill="rgba(122, 31, 43, 0.1)" stroke="var(--brand-red)" strokeWidth="4"
                    />
                    {radarData.map((s, i) => {
                       const p = getPoint(s.score, i);
                       return <circle key={i} cx={p.x} cy={p.y} r="6" fill="var(--brand-red)" stroke="#fff" strokeWidth="2.5" />;
                    })}
                 </svg>

                 {radarData.map((s, i) => {
                    const p = getPoint(140, i);
                    return (
                       <div key={i} style={{ 
                          position: 'absolute', top: p.y, left: p.x, transform: 'translate(-50%, -50%)',
                          fontSize: '0.75rem', fontWeight: 950, color: '#94a3b8', width: '90px', textAlign: 'center'
                       }}>
                          <div style={{ color: '#0f172a' }}>{s.label.toUpperCase()}</div>
                          <div style={{ color: 'var(--brand-red)' }}>{s.score}%</div>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Proficiency Levels breakdown */}
        <div className="col-6">
           <div className="glass-card-v2" style={{ padding: '3.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', marginBottom: '3.5rem' }}>Proficiency Levels</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 {(data?.proficiency || []).map((s, i) => (
                    <div key={i}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-end' }}>
                          <div>
                             <span style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', display: 'block' }}>{s.name}</span>
                             <span style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--brand-gold)', letterSpacing: '0.1em' }}>{s.score > 80 ? 'ADVANCED' : s.score > 50 ? 'INTERMEDIATE' : 'BEGINNER'}</span>
                          </div>
                          <span style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--brand-red)' }}>{s.score}%</span>
                       </div>
                       <div style={{ height: '10px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #f1f5f9' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: 'var(--brand-red)', borderRadius: '12px' }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Growth Predictor & AI Suggestions */}
        <div className="col-12">
           <div className="glass-card-v2" style={{ padding: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
              <div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)' }}>
                       <Icon name="zap" size={28} color="var(--brand-gold)" />
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>Growth Predictor</h3>
                 </div>
                 <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#64748b', lineHeight: 1.8, maxWidth: '550px' }}>
                    Based on your linear progress, you are scheduled to reach <span style={{ color: 'var(--brand-red)', fontWeight: 950 }}>Expert Proficiency</span> in core domains by Dec 2026.
                 </p>
                 <div style={{ display: 'flex', gap: '4rem', marginTop: '3.5rem' }}>
                    <div>
                       <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>+14%</div>
                       <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>WEEKLY GAIN</div>
                    </div>
                    <div>
                       <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>Level 12</div>
                       <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>GLOBAL RANK</div>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <h4 style={{ fontSize: '0.85rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>AI FOCUS SUGGESTIONS</h4>
                 {[
                   { title: 'Speed Drill', desc: 'Attempt 3 quickfire quizzes to improve your response rate.', type: 'Quizzes' },
                   { title: 'Memory Refresher', desc: 'Revise Unit Economics concepts from last week.', type: 'Notes' }
                 ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '32px', border: '1.5px solid #f1f5f9' }}>
                       <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--dashboard-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #f1f5f9' }}>
                          <Icon name={a.type === 'Quizzes' ? 'zap' : 'fileText'} size={22} color="var(--brand-red)" />
                       </div>
                       <div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 950, color: '#0f172a' }}>{a.title}</div>
                          <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 650, lineHeight: 1.5 }}>{a.desc}</p>
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
