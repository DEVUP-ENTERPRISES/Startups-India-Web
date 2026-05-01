'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion } from 'framer-motion';

export default function ExamDetailPage({ params }) {
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/v1/exams/${params.id}`);
        const json = await res.json();
        if (json.success) setExam(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExam();
  }, [params.id]);

  const startExam = async () => {
    try {
      const res = await fetch(`/api/v1/exams/${params.id}/start`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        router.push(`/dashboard/assessments/quizzes/${params.id}/attempt?submissionId=${json.data._id}&type=exam`);
      }
    } catch (err) {
      alert('Failed to start session. Ensure you have a stable connection.');
    }
  };

  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#EF4444', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Verifying Credentials...</p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );

  if (!exam) return <div className="p-20 text-center">Exam data not found.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: 900, width: '100%', background: 'rgba(30,41,59,0.5)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '5rem', backdropFilter: 'blur(20px)', boxShadow: '0 50px 100px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 20px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Icon name="shield" size={14} /> Secure Evaluation Protocol
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1.1 }}>{exam.title}</h1>
          <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>{exam.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '4.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="bookOpen" size={16} /> Session Rules
             </h4>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: '#94A3B8', fontSize: '0.95rem', display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '12px' }}><Icon name="clock" size={18} color="#EF4444" /> Fixed duration: {exam.timeLimit} Minutes</li>
                <li style={{ display: 'flex', gap: '12px' }}><Icon name="target" size={18} color="#EF4444" /> Minimum Score: {exam.passingScore}%</li>
                <li style={{ display: 'flex', gap: '12px' }}><Icon name="zap" size={18} color="#EF4444" /> Single attempt protocol active</li>
             </ul>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="user" size={16} /> Identity & Access
             </h4>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                   <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Structure</span>
                   <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{exam.questions?.length} Items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px' }}>
                   <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Environment</span>
                   <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>High Fidelity</span>
                </div>
             </div>
          </div>
        </div>

        <button 
          onClick={startExam}
          style={{ 
            width: '100%', padding: '1.75rem', borderRadius: '24px', background: '#EF4444', color: '#fff', 
            border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', letterSpacing: '0.1em',
            boxShadow: '0 20px 50px rgba(239,68,68,0.25)', transition: '0.3s', textTransform: 'uppercase'
          }}
        >
          Commence Evaluation
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
          By commencing, you agree to the monitoring protocols and evaluation standards.
        </p>
      </motion.div>
    </div>
  );
}
