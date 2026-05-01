'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QuizAttemptPage({ params }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/quizzes/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setQuiz(json.data);
        setTimeLeft(json.data.timeLimit * 60);
        // Initialize empty answers
        setAnswers(json.data.questions.map(q => ({ questionId: q._id, selectedOptions: [] })));
      }
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (qIdx, optIdx) => {
    const newAnswers = [...answers];
    const question = quiz.questions[qIdx];
    
    if (question.type === 'mcq') {
      newAnswers[qIdx].selectedOptions = [optIdx];
    } else {
      const current = newAnswers[qIdx].selectedOptions;
      if (current.includes(optIdx)) {
        newAnswers[qIdx].selectedOptions = current.filter(i => i !== optIdx);
      } else {
        newAnswers[qIdx].selectedOptions = [...current, optIdx];
      }
    }
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/quizzes/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, answers })
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/dashboard/assessments/results`);
      }
    } catch (err) {
      alert('Submission failed. Retrying...');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <div className="p-20 text-center">Loading Questions...</div>;

  const currentQ = quiz.questions[currentIdx];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7A1F2B' }}>{quiz.title}</h2>
           <p style={{ fontSize: '0.8rem', color: '#999', fontWeight: 700 }}>QUESTION {currentIdx + 1} OF {quiz.questions.length}</p>
        </div>
        <div style={{ background: '#7A1F2B', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 800 }}>
           {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </header>

      <div style={{ background: 'var(--dashboard-bg)', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', marginBottom: '40px', lineHeight: 1.4 }}>{currentQ.text}</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {currentQ.options.map((opt, i) => (
            <div 
              key={i} 
              onClick={() => handleOptionSelect(currentIdx, i)}
              style={{ 
                padding: '20px 24px', borderRadius: '16px', border: '2px solid', 
                borderColor: answers[currentIdx]?.selectedOptions.includes(i) ? '#7A1F2B' : '#f0f0f0',
                background: answers[currentIdx]?.selectedOptions.includes(i) ? 'rgba(122,31,43,0.02)' : 'white',
                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700,
                color: answers[currentIdx]?.selectedOptions.includes(i) ? '#7A1F2B' : '#444'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ 
                   width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                   borderColor: answers[currentIdx]?.selectedOptions.includes(i) ? '#7A1F2B' : '#ddd',
                   background: answers[currentIdx]?.selectedOptions.includes(i) ? '#7A1F2B' : 'transparent',
                   display: 'flex', alignItems: 'center', justifyContent: 'center'
                 }}>
                   {answers[currentIdx]?.selectedOptions.includes(i) && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />}
                 </div>
                 {opt.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #ddd', background: 'var(--dashboard-bg)', fontWeight: 800, cursor: 'pointer' }}
          disabled={currentIdx === 0}
        >PREVIOUS</button>
        
        {currentIdx < quiz.questions.length - 1 ? (
          <button 
            onClick={() => setCurrentIdx(prev => prev + 1)}
            style={{ padding: '12px 24px', borderRadius: '12px', background: '#111', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
          >NEXT QUESTION</button>
        ) : (
          <button 
            onClick={handleSubmit}
            style={{ padding: '12px 32px', borderRadius: '12px', background: '#7A1F2B', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SUBMITTING...' : 'FINISH ATTEMPT'}
          </button>
        )}
      </footer>
    </div>
  );
}
