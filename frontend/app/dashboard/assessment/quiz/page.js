'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [quizRes, resultRes] = await Promise.all([
          fetch('/api/v1/assessments?type=quiz'),
          fetch('/api/v1/assessments/results/all')
        ]);
        
        const quizJson = await quizRes.json();
        const resultJson = await resultRes.json();
        
        const fetchedQuizzes = quizJson.success && Array.isArray(quizJson.data) ? quizJson.data : [];
        setQuizzes(fetchedQuizzes);
        if (resultJson.success && Array.isArray(resultJson.data)) setResults(resultJson.data);
      } catch (err) {
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const submission = results.find(r => r.assessmentId?._id === quiz._id || r.assessmentId === quiz._id);
      return !submission;
    });
  }, [quizzes, results]);

  const filteredQuizzes = useMemo(() => {
    return pendingQuizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));
  }, [pendingQuizzes, search]);

  const handleStart = (id) => {
    router.push(`/dashboard/assessment/quiz/${id}/attempt`);
  };

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem' }}>
      <header className="platform-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="platform-page-title" style={{ fontSize: '2rem', marginBottom: '4px' }}>Strategic Quizzes</h1>
        <p className="platform-page-subtitle" style={{ fontSize: '0.9rem', color: '#64748B' }}>Validate your mastery of core venture building concepts.</p>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <SummaryCard label="Pending Mastery" count={pendingQuizzes.length} icon="zap" color="#7A1F2B" trend="Action Required" />
      </div>

      <div style={{ marginBottom: '2.5rem', position: 'relative', maxWidth: '440px' }}>
        <input 
          type="text" 
          placeholder="Search strategic quizzes..." 
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
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} onStart={() => handleStart(quiz._id)} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0' }}
                >
                  {quizzes.length === 0 ? (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="helpCircle" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>No Quizzes Found</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>Check back later for new strategic assessments.</p>
                    </>
                  ) : pendingQuizzes.length === 0 ? (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="check" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>Curriculum Completed</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>You've mastered all current strategic assessments.</p>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="search" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>No Matches Found</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>Try adjusting your search terms.</p>
                    </>
                  )}
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

function QuizCard({ quiz, onStart }) {
  const isLocked = quiz.isLocked;

  return (
    <motion.div 
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`assessment-card-v ${isLocked ? 'locked' : ''}`}
      style={{ 
        padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '320px', borderRadius: '32px',
        opacity: isLocked ? 0.7 : 1,
        position: 'relative',
        filter: isLocked ? 'grayscale(0.5)' : 'none'
      }}
    >
      {isLocked && (
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#F1F5F9', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
          <Icon name="lock" size={16} />
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#111', marginBottom: '12px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{quiz.title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
          {isLocked ? `This assessment is currently locked. ${quiz.lockReason || ''}` : quiz.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem', marginTop: 'auto', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="helpCircle" size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 800 }}>{quiz.questions?.length || 0} Questions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="clock" size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 800 }}>{quiz.timeLimit || 0}m</span>
        </div>
      </div>

      <button 
        onClick={onStart} 
        disabled={isLocked}
        className={isLocked ? 'btn-locked' : 'btn-brand-primary'} 
        style={{ 
          width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900,
          background: isLocked ? '#E2E8F0' : '#7A1F2B',
          color: isLocked ? '#94A3B8' : '#fff',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: 'none'
        }}
      >
        {isLocked ? 'LOCKED' : 'Begin Sprint'}
      </button>
    </motion.div>
  );
}
