'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion } from 'framer-motion';
import { apiGet, apiPost } from '@/lib/api';

export default function ExamDetailPage({ params }) {
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchExam() {
      const { data, error: err } = await apiGet(`/api/v1/assessments/${params.id}`);
      if (data) setExam(data);
      if (err) setError(err.message || 'Failed to load exam');
      setIsLoading(false);
    }
    fetchExam();
  }, [params.id]);

  const startExam = async () => {
    setIsStarting(true);
    const { data, error: err } = await apiPost(`/api/v1/assessments/${params.id}/start`, {});
    if (err) {
      alert(err.message || 'Failed to start exam. Ensure you have a stable connection.');
      setIsStarting(false);
      return;
    }
    if (data) {
      sessionStorage.removeItem(`exam_state_${params.id}`);
      router.push(`/dashboard/assessment/exam/${params.id}/attempt?submissionId=${data._id}`);
    }
  };

  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#EF4444', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Verifying Credentials...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error || !exam) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#fff', textAlign: 'center' }}>
      <div>
        <Icon name="alertCircle" size={48} color="#EF4444" />
        <p style={{ marginTop: '1.5rem', fontWeight: 700, color: '#94A3B8' }}>{error || 'Exam not found.'}</p>
      </div>
    </div>
  );

  const attemptsLeft = exam.maxAttempts != null ? exam.maxAttempts : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: 900, width: '100%', background: 'rgba(30,41,59,0.5)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: 'clamp(2rem, 6vw, 5rem)', backdropFilter: 'blur(20px)', boxShadow: '0 50px 100px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 20px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Icon name="shield" size={14} /> Secure Evaluation Protocol
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1.1 }}>{exam.title}</h1>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>{exam.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="bookOpen" size={16} /> Session Rules
             </h4>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: '#94A3B8', fontSize: '0.95rem', display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Icon name="clock" size={18} color="#EF4444" /> Duration: {exam.timeLimit || '—'} minutes</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Icon name="target" size={18} color="#EF4444" /> Passing score: {exam.passingScore || 0}%</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Icon name="zap" size={18} color="#EF4444" /> Max attempts: {attemptsLeft}</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Icon name="eye" size={18} color="#EF4444" /> Fullscreen enforced</li>
             </ul>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="alertTriangle" size={16} /> Anti-Cheat Active
             </h4>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: '#94A3B8', fontSize: '0.9rem', display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#EF4444', flexShrink: 0 }}>•</span> Tab switching is monitored</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#EF4444', flexShrink: 0 }}>•</span> Copy / paste is disabled</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#EF4444', flexShrink: 0 }}>•</span> Exiting fullscreen = violation</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><span style={{ color: '#EF4444', flexShrink: 0 }}>•</span> {exam.violationLimit || 3} violations trigger auto-submit</li>
             </ul>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon name="info" size={16} color="#64748B" />
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
            This exam contains <strong style={{ color: '#94A3B8' }}>{exam.questions?.length || 0} questions</strong>. Once started, you must complete it in a single session. Ensure you are in a quiet environment before proceeding.
          </p>
        </div>

        <button
          onClick={startExam}
          disabled={isStarting}
          style={{
            width: '100%', padding: '1.75rem', borderRadius: '24px',
            background: isStarting ? '#7f1d1d' : '#EF4444', color: '#fff',
            border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: isStarting ? 'default' : 'pointer',
            letterSpacing: '0.1em', boxShadow: '0 20px 50px rgba(239,68,68,0.25)',
            transition: '0.3s', textTransform: 'uppercase', opacity: isStarting ? 0.7 : 1
          }}
        >
          {isStarting ? 'Initializing Session...' : 'Commence Evaluation'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
          By commencing, you agree to the monitoring protocols and evaluation standards.
        </p>
      </motion.div>
    </div>
  );
}
