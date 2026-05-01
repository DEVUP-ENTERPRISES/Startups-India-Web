'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

const DUMMY_EXAMS = [
  {
    _id: 'e1',
    title: 'Venture Capital Readiness',
    description: 'A high-stakes evaluation of your startup investment thesis, governance, and exit strategy alignment.',
    questions: 25,
    timeLimit: 45,
    difficulty: 'Expert'
  },
  {
    _id: 'e2',
    title: 'Product-Market Fit Audit',
    description: 'Comprehensive assessment of retention cohorts, expansion revenue, and product stickiness metrics.',
    questions: 20,
    timeLimit: 40,
    difficulty: 'Advanced'
  },
  {
    _id: 'e3',
    title: 'Series A Growth Modeling',
    description: 'Advanced financial forecasting and scaling strategies for high-growth ventures.',
    questions: 30,
    timeLimit: 60,
    difficulty: 'Expert'
  }
];

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [examRes, resultRes] = await Promise.all([
          fetch('/api/v1/assessments?type=exam'),
          fetch('/api/v1/assessments/results/all')
        ]);
        
        const examJson = await examRes.json();
        const resultJson = await resultRes.json();
        
        let fetchedExams = examJson.success ? examJson.data : [];
        if (fetchedExams.length === 0) fetchedExams = DUMMY_EXAMS;
        
        setExams(fetchedExams);
        if (resultJson.success) setResults(resultJson.data);
      } catch (err) {
        setExams(DUMMY_EXAMS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingExams = useMemo(() => {
    return exams.filter(exam => {
      const submission = results.find(r => r.assessmentId?._id === exam._id || r.assessmentId === exam._id);
      return !submission;
    });
  }, [exams, results]);

  const filteredExams = useMemo(() => {
    return pendingExams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
  }, [pendingExams, search]);

  const handleStart = (id) => {
    router.push(`/dashboard/assessment/exam/${id}/attempt`);
  };

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem' }}>
      <header className="platform-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="platform-page-title" style={{ fontSize: '2rem', marginBottom: '4px' }}>Executive Examinations</h1>
        <p className="platform-page-subtitle" style={{ fontSize: '0.9rem', color: '#64748B' }}>High-stakes certifications for advanced venture building competence.</p>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <SummaryCard label="Pending Certification" count={pendingExams.length} icon="award" color="#7A1F2B" trend="High Priority" />
      </div>

      <div style={{ marginBottom: '2.5rem', position: 'relative', maxWidth: '440px' }}>
        <input 
          type="text" 
          placeholder="Search executive examinations..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 18px 14px 46px', borderRadius: '16px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', outline: 'none', background: '#fff', fontWeight: 600 }}
        />
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
          <Icon name="search" size={18} />
        </div>
      </div>

      <main>
        {isLoading ? (
          <div className="platform-grid">
            {[1, 2].map(i => (
              <div key={i} style={{ height: 320, background: '#fff', borderRadius: 32, border: '1px solid #F1F5F9' }} className="animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="platform-grid">
            <AnimatePresence mode="popLayout">
              {filteredExams.length > 0 ? filteredExams.map((exam) => (
                <ExamCard key={exam._id} exam={exam} onStart={() => handleStart(exam._id)} />
              )) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Icon name="check" size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>Board Certified</h3>
                  <p style={{ color: '#94A3B8', fontWeight: 600 }}>You've cleared all current executive examinations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, count, icon, color, trend }) {
  return (
    <div style={{ background: '#fff', padding: '1.25rem 2rem', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
           <span style={{ fontSize: '1.75rem', fontWeight: 950, color: '#111' }}>{count}</span>
           <span style={{ fontSize: '0.75rem', fontWeight: 850, color: color }}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

function ExamCard({ exam, onStart }) {
  return (
    <motion.div 
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="assessment-card-v"
      style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '340px', borderRadius: '32px' }}
    >
      <div style={{ marginBottom: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#111', lineHeight: 1.2, letterSpacing: '-0.01em', margin: 0 }}>{exam.title}</h3>
          <span style={{ fontSize: '0.6rem', fontWeight: 900, padding: '4px 8px', borderRadius: '6px', background: '#F8FAFC', color: '#64748B', border: '1px solid #F1F5F9' }}>
            {exam.difficulty || 'Advanced'}
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
          {exam.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem', marginTop: 'auto', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="helpCircle" size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 800 }}>{exam.questions?.length || exam.questions || 0} Questions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="clock" size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 800 }}>{exam.timeLimit || 0} Minutes</span>
        </div>
      </div>

      <button onClick={onStart} className="btn-brand-primary" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900 }}>
        Launch Certification
      </button>
    </motion.div>
  );
}

