'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_QUESTIONS = [
  {
    id: 1,
    text: "What does 'TAM' stand for in market sizing?",
    options: ["Total Available Market", "Target Attainable Market", "Total Addressable Market", "Technical Asset Management"],
    correct: 2
  },
  {
    id: 2,
    text: "Which of these is a typical 'Vanity Metric'?",
    options: ["Churn Rate", "Cumulative Downloads", "Daily Active Users", "Customer Acquisition Cost"],
    correct: 1
  },
  {
    id: 3,
    text: "A 'Burn Rate' of $50k and Cash of $500k gives a runway of how many months?",
    options: ["5 Months", "10 Months", "12 Months", "20 Months"],
    correct: 1
  }
];

export default function QuizAttemptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState(DUMMY_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (optionIdx) => {
    setAnswers({ ...answers, [currentIdx]: optionIdx });
    // Auto-advance for quizzes to keep it fast-paced
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        handleFinish();
      }
    }, 300);
  };

  const handleFinish = async () => {
    setIsFinished(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem' }}>
          <div style={{ width: 80, height: 80, background: '#F0FDF4', color: '#16A34A', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Icon name="zap" size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Sprint Complete</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '3rem', fontWeight: 500 }}>You've completed the market entry strategy quiz. Your performance profile is being updated.</p>
          <button 
            onClick={() => router.push('/dashboard/assessment/results')}
            style={{ width: '100%', padding: '1.25rem', background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}
          >
            SEE YOUR SCORE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, background: '#7A1F2B', color: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="explore" size={20} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>Quiz Sprint</span>
        </div>
        
        <div style={{ padding: '8px 20px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <Icon name="clock" size={18} color="#64748B" />
           <span style={{ fontWeight: 900, fontSize: '1.1rem', tabularNums: true }}>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>
        <div style={{ maxWidth: '700px', width: '100%' }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
             <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em' }}>QUESTION {currentIdx + 1} OF {questions.length}</span>
             <h1 style={{ fontSize: '2.2rem', fontWeight: 950, color: '#111', marginTop: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
               {questions[currentIdx].text}
             </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {questions[currentIdx].options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleOptionSelect(i)}
                style={{ 
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '24px',
                  border: '2px solid #F1F5F9',
                  background: '#F8FAFC',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 40, height: 6, borderRadius: '3px', background: i === currentIdx ? '#7A1F2B' : (answers[i] !== undefined ? '#111' : '#E2E8F0') }} />
          ))}
        </div>
      </footer>
    </div>
  );
}
