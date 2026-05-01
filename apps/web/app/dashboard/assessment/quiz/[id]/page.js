'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizDetailPage({ params }) {
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/v1/quizzes/${params.id}`);
        const json = await res.json();
        if (json.success) setQuiz(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuiz();
  }, [params.id]);

  const startQuiz = async () => {
    setIsStarting(true);
    try {
      const res = await fetch(`/api/v1/quizzes/${params.id}/attempt`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        router.push(`/dashboard/assessments/quizzes/${params.id}/attempt?submissionId=${json.data._id}`);
      } else {
        alert(json.message);
      }
    } catch (err) {
      alert('Failed to start attempt.');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center">Initialising Assessment...</div>;
  if (!quiz) return <div className="p-20 text-center">Quiz not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .dcard { background:#fff; border-radius:32px; padding:4rem; border:1px solid rgba(0,0,0,0.05); box-shadow:0 20px 60px rgba(0,0,0,0.05); }
        .start-btn { background: #7A1F2B; color:white; border:none; padding:1.25rem 2.5rem; border-radius:16px; font-weight:800; font-size:1rem; cursor:pointer; transition:all 0.3s; width:100%; box-shadow:0 10px 30px rgba(122,31,43,0.25); }
        .start-btn:hover { background: #922538; transform: translateY(-3px); }
        .start-btn:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; transform: none; }
      `}} />

      <div className="dcard">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#C5975B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Module Evaluation</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginTop: '16px', marginBottom: '16px', letterSpacing: '-0.04em' }}>{quiz.title}</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6 }}>{quiz.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fafafa', borderRadius: '20px' }}>
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999', marginBottom: '4px' }}>Questions</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>{quiz.questions?.length}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fafafa', borderRadius: '20px' }}>
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999', marginBottom: '4px' }}>Time Limit</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>{quiz.timeLimit}m</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fafafa', borderRadius: '20px' }}>
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999', marginBottom: '4px' }}>Pass Score</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>{quiz.passingScore}%</div>
          </div>
        </div>

        <button className="start-btn" onClick={startQuiz} disabled={isStarting}>
          {isStarting ? 'PREPARING SESSION...' : 'START ATTEMPT'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: '#999', fontWeight: 500 }}>
          By starting this quiz, you agree to the evaluation terms. 
          Ensure you have a stable connection.
        </p>
      </div>
    </div>
  );
}
