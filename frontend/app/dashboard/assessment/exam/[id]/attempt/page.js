'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGet, apiPost } from '@/lib/api';

const VIOLATION_LIMIT = 3;

export default function ExamAttemptPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [violations, setViolations] = useState(0);
  const [violationMsg, setViolationMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState('');
  const [loadError, setLoadError] = useState(null);

  const violationsRef = useRef(0);
  const submittingRef = useRef(false);
  const timerRef = useRef(null);
  const examRef = useRef(null);
  const answersRef = useRef({});

  const storageKey = `exam_state_${id}`;

  // ── Submit ───────────────────────────────────────────────────────────────
  const submitExam = useCallback(async (currentAnswers) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);

    clearInterval(timerRef.current);
    sessionStorage.removeItem(storageKey);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const payload = Object.entries(currentAnswers).map(([idx, optIdx]) => ({
      questionId: questions[Number(idx)]?._id,
      selectedOptions: [optIdx]
    })).filter(a => a.questionId);

    const { data, error: err } = await apiPost(`/api/v1/assessments/${id}/submit`, {
      submissionId,
      answers: payload
    });

    setIsSubmitting(false);
    setIsFinished(true);
    if (data) setResult(data);
    if (err) console.error('Submit error:', err.message);
  }, [id, submissionId, questions, storageKey]);

  // ── Violation handler ────────────────────────────────────────────────────
  const recordViolation = useCallback((reason) => {
    violationsRef.current += 1;
    const count = violationsRef.current;
    setViolations(count);

    const limit = examRef.current?.violationLimit || VIOLATION_LIMIT;
    const remaining = limit - count;

    if (count >= limit) {
      setWarningText(`Auto-submitting: ${reason}. Violation limit reached.`);
      setShowWarning(true);
      setTimeout(() => submitExam(answersRef.current), 2000);
    } else {
      setWarningText(`${reason}. ${remaining} warning${remaining !== 1 ? 's' : ''} remaining before auto-submit.`);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
    }
  }, [submitExam]);

  // ── Load exam + restore state ────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data, error: err } = await apiGet(`/api/v1/assessments/${id}`);
      if (err || !data) {
        setLoadError(err?.message || 'Failed to load exam');
        setIsLoading(false);
        return;
      }

      examRef.current = data;
      setExam(data);
      setQuestions(data.questions || []);

      // Restore persisted state
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.answers) {
            answersRef.current = state.answers;
            setAnswers(state.answers);
          }
          if (state.currentIdx != null) setCurrentIdx(state.currentIdx);
          if (state.timeLeft != null) {
            setTimeLeft(state.timeLeft);
          } else {
            setTimeLeft((data.timeLimit || 45) * 60);
          }
        } catch {
          setTimeLeft((data.timeLimit || 45) * 60);
        }
      } else {
        setTimeLeft((data.timeLimit || 45) * 60);
      }

      setIsLoading(false);
    }
    load();
  }, [id, storageKey]);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || isFinished || isLoading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setWarningText('Time is up! Submitting your exam now.');
          setShowWarning(true);
          setTimeout(() => submitExam(answersRef.current), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft === null, isFinished, isLoading]); // eslint-disable-line

  // ── Persist state to sessionStorage ─────────────────────────────────────
  useEffect(() => {
    if (isLoading || isFinished) return;
    sessionStorage.setItem(storageKey, JSON.stringify({ answers, currentIdx, timeLeft }));
  }, [answers, currentIdx, timeLeft, isLoading, isFinished, storageKey]);

  // ── Fullscreen helpers ───────────────────────────────────────────────────
  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    if (isLoading || isFinished) return;

    const onFsChange = () => {
      const inFS = !!document.fullscreenElement;
      setIsFullscreen(inFS);
      if (!inFS && !submittingRef.current) {
        recordViolation('You exited fullscreen mode');
      }
    };

    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [isLoading, isFinished, recordViolation]);

  // ── Tab visibility detection ─────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isFinished) return;

    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && !submittingRef.current) {
        recordViolation('You switched tabs or minimized the window');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isLoading, isFinished, recordViolation]);

  // ── Keyboard restrictions ────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isFinished) return;

    const onKeyDown = (e) => {
      const blocked = (
        (e.ctrlKey && ['c', 'v', 'a', 'x', 'u', 's'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'a', 'x', 'u', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      );
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onContextMenu = (e) => e.preventDefault();

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('contextmenu', onContextMenu);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [isLoading, isFinished]);

  // ── Beforeunload warning ─────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isFinished) return;

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Your exam is in progress. Leaving will count as a violation.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isLoading, isFinished]);

  // ── Answer selection ─────────────────────────────────────────────────────
  const handleOptionSelect = (optionIdx) => {
    const updated = { ...answersRef.current, [currentIdx]: optionIdx };
    answersRef.current = updated;
    setAnswers(updated);
  };

  const formatTime = (seconds) => {
    if (seconds == null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const progress = total > 0 ? ((currentIdx + 1) / total) * 100 : 0;
  const limit = exam?.violationLimit || VIOLATION_LIMIT;

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#EF4444', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Exam...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff', textAlign: 'center' }}>
      <div>
        <Icon name="alertCircle" size={48} color="#EF4444" />
        <p style={{ marginTop: '1.5rem', fontWeight: 700, color: '#94A3B8' }}>{loadError}</p>
        <button onClick={() => router.back()} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  // ── Submitting overlay ───────────────────────────────────────────────────
  if (isSubmitting) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#EF4444', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>Transmitting Responses...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  // ── Result screen ────────────────────────────────────────────────────────
  if (isFinished) {
    const pct = result?.score ?? null;
    const passed = pct != null && pct >= (exam?.passingScore || 0);
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 480, padding: '2rem' }}>
          <div style={{ width: 80, height: 80, background: passed ? '#22C55E' : '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Icon name={passed ? 'check' : 'x'} size={40} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
            {passed ? 'Exam Passed' : 'Exam Submitted'}
          </h1>
          {pct != null && (
            <div style={{ fontSize: '3rem', fontWeight: 900, color: passed ? '#22C55E' : '#EF4444', marginBottom: '0.5rem' }}>{pct}%</div>
          )}
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
            {passed
              ? 'Congratulations! Your responses have been recorded and you have met the passing criteria.'
              : 'Your responses have been securely transmitted. Check your results for a detailed breakdown.'}
          </p>
          <button
            onClick={() => router.push('/dashboard/assessment')}
            style={{ padding: '1rem 3rem', background: '#7A1F2B', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}
          >
            Back to Assessments
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Fullscreen gate ──────────────────────────────────────────────────────
  if (!isFullscreen) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 72, height: 72, background: 'rgba(239,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Icon name="maximize" size={32} color="#EF4444" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Fullscreen Required</h2>
        <p style={{ color: '#94A3B8', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          This exam requires fullscreen mode to begin. Your activity will be monitored for integrity compliance.
        </p>
        {violations > 0 && (
          <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 700 }}>
            ⚠ {violations}/{limit} violation{violations !== 1 ? 's' : ''} recorded
          </p>
        )}
        <button
          onClick={enterFullscreen}
          style={{ padding: '1.25rem 3rem', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(239,68,68,0.3)', letterSpacing: '0.05em' }}
        >
          Enter Fullscreen & Continue
        </button>
      </motion.div>
    </div>
  );

  // ── Main exam UI ─────────────────────────────────────────────────────────
  return (
    <div
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Violation Warning Toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#EF4444', color: '#fff', padding: '1rem 2rem', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
          >
            <Icon name="alertTriangle" size={18} color="#fff" />
            {warningText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Header */}
      <header style={{ padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '6px 14px', background: '#0A0A0A', color: '#fff', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>EXAM MODE</div>
          <h2 style={{ fontSize: '1rem', fontWeight: 900, color: '#111', margin: 0, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exam?.title}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Violation counter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < violations ? '#EF4444' : '#E2E8F0', border: '1px solid', borderColor: i < violations ? '#EF4444' : '#CBD5E1' }} />
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>Time Left</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: timeLeft != null && timeLeft < 300 ? '#EF4444' : '#111', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>Answered</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#111' }}>{answered}/{total}</div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to submit the exam? This cannot be undone.')) {
                submitExam(answersRef.current);
              }
            }}
            style={{ padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: 'none', fontWeight: 800, fontSize: '0.8rem', color: '#EF4444', cursor: 'pointer' }}
          >
            Submit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ height: '3px', width: '100%', background: '#E2E8F0' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: '#7A1F2B' }} />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr clamp(200px, 28vw, 380px)', overflow: 'hidden' }}>
        {/* Question area */}
        <div style={{ padding: 'clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 6vw, 6rem)', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: '760px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#7A1F2B', marginBottom: '0.75rem', display: 'block' }}>
                QUESTION {currentIdx + 1} OF {total}
                {questions[currentIdx]?.points > 1 && <span style={{ marginLeft: '1rem', color: '#94A3B8' }}>{questions[currentIdx].points} pts</span>}
              </span>

              <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, color: '#111', lineHeight: 1.35, marginBottom: '2.5rem' }}>
                {questions[currentIdx]?.text}
              </h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(questions[currentIdx]?.options || []).map((opt, i) => {
                  const optText = typeof opt === 'object' ? opt.text : opt;
                  const selected = answers[currentIdx] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      style={{
                        textAlign: 'left', padding: '1.25rem 1.75rem', borderRadius: '18px',
                        border: selected ? '2px solid #7A1F2B' : '1.5px solid #E2E8F0',
                        background: selected ? 'rgba(122,31,43,0.04)' : '#fff',
                        fontSize: '1rem', fontWeight: 700,
                        color: selected ? '#7A1F2B' : '#475569',
                        cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '1.25rem'
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                        background: selected ? '#7A1F2B' : '#F1F5F9',
                        color: selected ? '#fff' : '#94A3B8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 900
                      }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      {optText}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                {currentIdx > 0 && (
                  <button
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    style={{ padding: '1rem 2rem', borderRadius: '14px', border: '1.5px solid #E2E8F0', background: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', color: '#475569' }}
                  >
                    ← Previous
                  </button>
                )}
                {currentIdx < total - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    style={{ padding: '1rem 2.5rem', background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (window.confirm(`You have answered ${answered} of ${total} questions. Submit now?`)) {
                        submitExam(answersRef.current);
                      }
                    }}
                    style={{ padding: '1rem 2.5rem', background: '#7A1F2B', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar navigator */}
        <aside style={{ background: '#fff', borderLeft: '1px solid #E2E8F0', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#111', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Navigator</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '2rem' }}>
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{
                  aspectRatio: '1', borderRadius: '8px',
                  border: currentIdx === i ? '2px solid #7A1F2B' : '1px solid #E2E8F0',
                  background: answers[i] !== undefined ? (currentIdx === i ? 'rgba(122,31,43,0.08)' : '#F0FDF4') : '#fff',
                  color: currentIdx === i ? '#7A1F2B' : (answers[i] !== undefined ? '#16A34A' : '#94A3B8'),
                  fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#F0FDF4', border: '1px solid #16A34A' }} />
              <span>Answered ({answered})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#fff', border: '1px solid #E2E8F0' }} />
              <span>Skipped ({total - answered})</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '1.25rem', background: '#FFF7F7', borderRadius: '16px', border: '1px solid #FECDD3' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '0.75rem' }}>
              <Icon name="shield" size={16} color="#7A1F2B" />
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#111' }}>Integrity Shield</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', lineHeight: 1.6 }}>
              Violations: <strong style={{ color: violations > 0 ? '#EF4444' : '#64748B' }}>{violations}/{limit}</strong>
              <br />Tab switching and fullscreen exit are monitored.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
