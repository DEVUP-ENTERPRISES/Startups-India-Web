'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | history

  useEffect(() => {
    async function fetchData() {
      try {
        const [examRes, resultRes] = await Promise.all([
          fetch('/api/v1/assessments?type=exam'),
          fetch('/api/v1/assessments/results/all')
        ]);
        
        const examJson = await examRes.json();
        const resultJson = await resultRes.json();
        
        if (examJson.success) setExams(examJson.data);
        if (resultJson.success) setResults(resultJson.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const examsWithStatus = useMemo(() => {
    return exams.map(exam => {
      const submission = results.find(r => r.assessmentId?._id === exam._id || r.assessmentId === exam._id);
      return {
        ...exam,
        submissionStatus: submission ? submission.status : 'Pending',
        score: submission ? submission.score : null,
        submittedAt: submission ? submission.submittedAt : null
      };
    });
  }, [exams, results]);

  const filteredExams = useMemo(() => {
    if (activeTab === 'upcoming') {
      return examsWithStatus.filter(e => e.submissionStatus === 'Pending' || e.submissionStatus === 'in-progress');
    }
    return examsWithStatus.filter(e => e.submissionStatus === 'submitted' || e.submissionStatus === 'graded');
  }, [examsWithStatus, activeTab]);

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header className="platform-page-header">
        <h1 className="platform-page-title">Exams Hall</h1>
        <p className="platform-page-subtitle">Strict evaluation protocols to validate your readiness for the global startup ecosystem.</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1.5px solid #F1F5F9' }}>
         <button 
           onClick={() => setActiveTab('upcoming')}
           style={{ padding: '1rem 0', background: 'none', border: 'none', color: activeTab === 'upcoming' ? '#7A1F2B' : '#94A3B8', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', borderBottom: activeTab === 'upcoming' ? '3px solid #7A1F2B' : '3px solid transparent', transition: '0.2s' }}
         >
           Upcoming Sessions
         </button>
         <button 
           onClick={() => setActiveTab('history')}
           style={{ padding: '1rem 0', background: 'none', border: 'none', color: activeTab === 'history' ? '#7A1F2B' : '#94A3B8', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', borderBottom: activeTab === 'history' ? '3px solid #7A1F2B' : '3px solid transparent', transition: '0.2s' }}
         >
           Attempt History
         </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isLoading ? (
          [1, 2].map(i => (
            <div key={i} style={{ height: 100, background: '#F9FAFB', borderRadius: 20 }} className="animate-pulse" />
          ))
        ) : filteredExams.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredExams.map((exam) => (
              <ExamRow key={exam._id} exam={exam} />
            ))}
          </AnimatePresence>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#F9FAFB', borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
            <Icon name="shield" size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B' }}>No exams found</h3>
            <p style={{ color: '#94A3B8' }}>{activeTab === 'upcoming' ? 'No scheduled exams at this time.' : 'You haven\'t attempted any exams yet.'}</p>
          </div>
        )}
      </div>

      <p style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
        <Icon name="info" size={14} style={{ marginRight: '6px' }} /> Note: Tab switching will be monitored and may void the attempt. Ensure a stable connection.
      </p>
    </div>
  );
}

function ExamRow({ exam }) {
  const status = exam.submissionStatus;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem 2rem',
        background: 'var(--dashboard-bg)', borderRadius: '20px', border: '1px solid #F1F5F9',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: '0.3s'
      }}
    >
      <div style={{ width: 50, height: 50, background: '#F8FAFC', color: '#7A1F2B', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="fileText" size={24} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>{exam.title}</h3>
          <span className={`status-badge ${status === 'Pending' ? 'pending' : 'graded'}`} style={{ fontSize: '0.6rem' }}>
            {status === 'Pending' ? 'Scheduled' : 'Completed'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>High Stakes Evaluation</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1.5px solid #F1F5F9', paddingLeft: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="helpCircle" size={14} /> {exam.questions?.length || 0} Qs
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="clock" size={14} /> {exam.timeLimit || 0}m
            </span>
          </div>
          {exam.score !== null && (
            <span style={{ fontSize: '0.85rem', color: '#22C55E', fontWeight: 800, marginLeft: 'auto' }}>
              Score: {exam.score}% — PASSED
            </span>
          )}
        </div>
      </div>

      <Link href={`/dashboard/assessments/exams/${exam._id}`} style={{ textDecoration: 'none' }}>
        <button className={status === 'Pending' ? 'btn-brand-primary' : 'btn-brand-outline'} style={{ minWidth: '160px', padding: '12px 24px' }}>
          {status === 'Pending' ? 'ENTER HALL' : 'REVIEW PAPER'}
        </button>
      </Link>
    </motion.div>
  );
}

