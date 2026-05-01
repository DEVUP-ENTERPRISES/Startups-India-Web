'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Quizzes');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/v1/assessments/results/all');
        const json = await res.json();
        if (json.success) setResults(json.data);
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, []);

  const stats = useMemo(() => {
    if (results.length === 0) return { avg: 0, total: 0, velocity: '0%' };
    const avg = results.reduce((acc, curr) => acc + (curr.score / curr.totalPoints), 0) / results.length;
    return {
      avg: (avg * 100).toFixed(1) + '%',
      total: results.length,
      velocity: 'Top 10%'
    };
  }, [results]);

  const filteredResults = useMemo(() => {
    const typeMap = { 'Quizzes': 'quiz', 'Assessments': 'assignment', 'Exams': 'exam' };
    return results.filter(r => r.assessmentId?.type === typeMap[activeTab]);
  }, [results, activeTab]);

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header className="platform-page-header">
        <h1 className="platform-page-title">Performance Analytics</h1>
        <p className="platform-page-subtitle">Detailed evaluation reports and certification history.</p>
      </header>

      <div className="flex-stack-mobile" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        {[
          { label: 'Average Precision', val: stats.avg, color: '#7A1F2B' },
          { label: 'Certifications Earned', val: stats.total, color: '#111827' },
          { label: 'Academic Velocity', val: stats.velocity, color: '#059669' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: 'var(--dashboard-bg)', padding: '1.5rem', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="mobile-hide-scroll" style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '10px' }}>
        {['Quizzes', 'Assessments', 'Exams'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
              background: activeTab === tab ? '#7A1F2B' : '#fff',
              color: activeTab === tab ? '#fff' : '#64748B',
              boxShadow: activeTab === tab ? '0 10px 20px rgba(122,31,43,0.2)' : 'none',
              transition: '0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="assessments-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {isLoading ? (
          [1, 2].map(i => <div key={i} style={{ height: 250, background: '#F9FAFB', borderRadius: 32 }} className="animate-pulse" />)
        ) : filteredResults.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredResults.map((res) => (
              <ResultCard key={res._id} result={res} />
            ))}
          </AnimatePresence>
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: '#F9FAFB', borderRadius: '32px', border: '2px dashed #E5E7EB' }}>
            <Icon name="award" size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#64748B' }}>No reports recorded</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Start your first {activeTab.toLowerCase().slice(0, -1)} to see performance analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  const percentage = Math.round((result.score / result.totalPoints) * 100);
  
  return (
    <motion.div 
      layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="result-card"
      style={{
        background: 'var(--dashboard-bg)', padding: '2rem', borderRadius: '32px', border: '1px solid #F1F5F9',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: '#7A1F2B', opacity: 0.02, borderRadius: '0 0 0 100%' }} />
      
      <div className="result-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-badge graded" style={{ fontSize: '0.6rem' }}>GRADED</span>
          <span style={{ background: '#FFF7ED', color: '#C2410C', padding: '4px 10px', borderRadius: '99px', fontSize: '0.6rem', fontWeight: 800 }}>VANGUARD</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>{new Date(result.submittedAt).toLocaleDateString()}</span>
      </div>

      <div className="result-card-content" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#F1F5F9" strokeWidth="10" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#7A1F2B" strokeWidth="10" 
              strokeDasharray={`${percentage * 2.76} 276`} 
              strokeLinecap="round" transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#111' }}>
            {percentage}%
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '4px', lineHeight: 1.3 }}>{result.assessmentId?.title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, margin: 0 }}>Critical Phase Evaluation</p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>Score</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111' }}>{result.score}/{result.totalPoints}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>Status</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#22C55E' }}>PASSED</div>
          </div>
        </div>
        <button className="btn-brand-outline" style={{ padding: '8px 16px', fontSize: '0.7rem' }}>ANALYZE REPORT</button>
      </div>
    </motion.div>
  );
}

