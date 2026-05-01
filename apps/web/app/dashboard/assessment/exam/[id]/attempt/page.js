'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_QUESTIONS = [
  {
    id: 1,
    text: "Which of the following metrics is considered the most critical for evaluating a SaaS company's capital efficiency?",
    options: ["Gross Margin", "CAC Payback Period", "LTV/CAC Ratio", "Rule of 40"],
    correct: 3
  },
  {
    id: 2,
    text: "In a Series A pitch deck, which slide is typically scrutinized most by Tier-1 VCs for growth-stage readiness?",
    options: ["Team", "Market Size", "Go-to-Market Strategy", "Unit Economics"],
    correct: 2
  },
  {
    id: 3,
    text: "What is the industry standard 'Magic Number' threshold that indicates a highly efficient sales engine?",
    options: ["0.5", "0.75", "1.0", "1.5"],
    correct: 2
  }
];

export default function ExamAttemptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(DUMMY_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2700); // 45 mins
  const [isFinished, setIsFinished] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Request full screen on mount or when user clicks a button
    const enterFS = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    // enterFS(); // Might be blocked by browser policy without user gesture

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
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    // Exit full screen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    // Logic to submit to API
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIdx + 1) / questions.length) * 100;

  if (isFinished) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Icon name="check" size={40} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Examination Completed</h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '3rem' }}>Your responses have been securely transmitted to the Board of Evaluators.</p>
          <button 
            onClick={() => router.push('/dashboard/assessment/results')}
            style={{ padding: '1rem 3rem', background: '#7A1F2B', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}
          >
            VIEW PRELIMINARY RESULTS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* HUD Header */}
      <header style={{ padding: '1.5rem 3rem', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '8px 16px', background: '#0A0A0A', color: '#fff', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em' }}>EXAM MODE</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111', margin: 0 }}>Venture Capital Readiness Assessment</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Time Remaining</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: timeLeft < 300 ? '#EF4444' : '#111', tabularNums: true }}>{formatTime(timeLeft)}</div>
          </div>
          <button 
             onClick={handleFinish}
             style={{ padding: '10px 24px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: 'none', fontWeight: 800, fontSize: '0.85rem', color: '#EF4444', cursor: 'pointer' }}
          >
            ABORT SESSION
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ height: '4px', width: '100%', background: '#E2E8F0' }}>
        <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#7A1F2B' }} />
      </div>

      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', overflow: 'hidden' }}>
        {/* Question Area */}
        <div style={{ padding: '4rem 6rem', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ maxWidth: '800px' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#7A1F2B', marginBottom: '1rem', display: 'block' }}>QUESTION {currentIdx + 1} OF {questions.length}</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', lineHeight: 1.3, marginBottom: '3rem' }}>
                {questions[currentIdx].text}
              </h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questions[currentIdx].options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    style={{ 
                      textAlign: 'left',
                      padding: '1.5rem 2rem',
                      borderRadius: '20px',
                      border: answers[currentIdx] === i ? '2px solid #7A1F2B' : '1.5px solid #E2E8F0',
                      background: answers[currentIdx] === i ? 'rgba(122,31,43,0.04)' : '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: answers[currentIdx] === i ? '#7A1F2B' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem'
                    }}
                  >
                    <div style={{ 
                      width: 28, height: 28, borderRadius: '8px', 
                      background: answers[currentIdx] === i ? '#7A1F2B' : '#F1F5F9',
                      color: answers[currentIdx] === i ? '#fff' : '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 900
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
                <button 
                  onClick={handleNext}
                  disabled={answers[currentIdx] === undefined}
                  style={{ 
                    padding: '1.25rem 3rem', 
                    background: '#0A0A0A', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '16px', 
                    fontWeight: 900, 
                    fontSize: '1rem',
                    cursor: answers[currentIdx] === undefined ? 'not-allowed' : 'pointer',
                    opacity: answers[currentIdx] === undefined ? 0.5 : 1
                  }}
                >
                  {currentIdx === questions.length - 1 ? 'SUBMIT EXAMINATION' : 'CONTINUE TO NEXT QUESTION'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Navigation */}
        <aside style={{ background: '#fff', borderLeft: '1px solid #E2E8F0', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#111', marginBottom: '1.5rem' }}>QUESTION NAVIGATOR</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {questions.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{ 
                  aspectRatio: '1',
                  borderRadius: '10px',
                  border: currentIdx === i ? '2px solid #7A1F2B' : '1px solid #E2E8F0',
                  background: answers[i] !== undefined ? '#F1F5F9' : '#fff',
                  color: currentIdx === i ? '#7A1F2B' : (answers[i] !== undefined ? '#111' : '#94A3B8'),
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px' }}>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
                <Icon name="shield" size={18} color="#7A1F2B" />
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#111' }}>Integrity Shield Active</span>
             </div>
             <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', lineHeight: 1.6 }}>
               Your activity is being monitored for compliance. Avoid switching tabs or exiting full-screen mode during the session.
             </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
