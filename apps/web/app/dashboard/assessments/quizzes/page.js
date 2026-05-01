'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Quizzes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [quizRes, resultRes] = await Promise.all([
          fetch('/api/v1/assessments?type=quiz'),
          fetch('/api/v1/assessments/results/all')
        ]);
        
        const quizJson = await quizRes.json();
        const resultJson = await resultRes.json();
        
        if (quizJson.success) setQuizzes(quizJson.data);
        if (resultJson.success) setResults(resultJson.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const quizzesWithStatus = useMemo(() => {
    return quizzes.map(quiz => {
      const submission = results.find(r => r.assessmentId?._id === quiz._id || r.assessmentId === quiz._id);
      return {
        ...quiz,
        submissionStatus: submission ? submission.status : 'Pending',
        score: submission ? submission.score : null,
        totalPoints: submission ? submission.totalPoints : null
      };
    });
  }, [quizzes, results]);

  const filteredQuizzes = useMemo(() => {
    return quizzesWithStatus.filter(q => {
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
      if (activeTab === 'Pending') return matchSearch && q.submissionStatus === 'Pending';
      if (activeTab === 'Submitted') return matchSearch && q.submissionStatus === 'submitted';
      if (activeTab === 'Graded') return matchSearch && q.submissionStatus === 'graded';
      return matchSearch;
    });
  }, [quizzesWithStatus, search, activeTab]);

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header className="platform-page-header">
        <h1 className="platform-page-title">Interactive Quizzes</h1>
        <p className="platform-page-subtitle">Test your knowledge and earn founder points with quick evaluation sprints.</p>
      </header>

      <div className="quiz-hub-layout">
        <aside className="quiz-sidebar">
          <SidebarItem label="All Quizzes" icon="books" active={activeTab === 'All Quizzes'} onClick={() => setActiveTab('All Quizzes')} />
          <SidebarItem label="Pending" icon="clock" active={activeTab === 'Pending'} onClick={() => setActiveTab('Pending')} />
          <SidebarItem label="Submitted" icon="fileText" active={activeTab === 'Submitted'} onClick={() => setActiveTab('Submitted')} />
          <SidebarItem label="Graded" icon="award" active={activeTab === 'Graded'} onClick={() => setActiveTab('Graded')} />
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px', border: '1.5px solid #E5E7EB', fontSize: '0.95rem', outline: 'none' }}
            />
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <Icon name="search" size={18} />
            </div>
          </div>

          {isLoading ? (
            <div className="platform-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 300, background: '#F9FAFB', borderRadius: 20 }} className="animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="platform-grid">
              <AnimatePresence mode="popLayout">
                {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                )) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: 'var(--dashboard-bg)', borderRadius: '24px', border: '2px dashed #E5E7EB' }}
                  >
                    <Icon name="pencil" size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B' }}>No quizzes found</h3>
                    <p style={{ color: '#94A3B8' }}>Your assessment queue is currently clear.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem',
        fontWeight: active ? 700 : 500,
        background: active ? '#7A1F2B' : 'transparent',
        color: active ? '#fff' : '#64748B',
        transition: '0.2s', textAlign: 'left'
      }}
    >
      <Icon name={icon} size={18} color={active ? '#fff' : '#94A3B8'} />
      {label}
    </button>
  );
}

function QuizCard({ quiz }) {
  const status = quiz.submissionStatus; // Pending, submitted, graded
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="assessment-card-v"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
        <span className="difficulty-indicator medium">
          Medium
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111', marginBottom: '8px' }}>{quiz.title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
          {quiz.description?.slice(0, 80)}...
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>
          <Icon name="fileText" size={14} /> {quiz.questions?.length || 0} Qs
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>
          <Icon name="clock" size={14} /> {quiz.timeLimit || 0}m
        </div>
      </div>

      <Link href={`/dashboard/assessments/quizzes/${quiz._id}`} style={{ textDecoration: 'none' }}>
        <button className="btn-brand-primary" style={{ width: '100%' }}>
          {status === 'Pending' ? 'Start Quiz' : 'View Results'}
        </button>
      </Link>
    </motion.div>
  );
}

