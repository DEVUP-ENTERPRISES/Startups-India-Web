'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignmentDetailPage({ params }) {
  const [assignment, setAssignment] = useState(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const res = await fetch(`/api/v1/assignments/${params.id}`);
        const json = await res.json();
        if (json.success) setAssignment(json.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAssignment();
  }, [params.id]);

  const handleSubmit = async () => {
    if (!content.trim()) return alert('Please provide your submission content.');
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/assignments/${params.id}/assignment-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionContent: content })
      });
      const json = await res.json();
      if (json.success) {
        router.push('/dashboard/assessments/results');
      }
    } catch (err) {
      alert('Failed to submit assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) return <div className="p-20 text-center">Loading Assignment...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: '48px' }}>
         <div style={{ background: 'rgba(197,151,91,0.1)', color: '#C5975B', padding: '6px 16px', borderRadius: '8px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '16px' }}>
            CRITICAL APPLICATION PHASE
         </div>
         <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', letterSpacing: '-0.04em', marginBottom: '12px' }}>{assignment.title}</h1>
         <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6 }}>{assignment.description}</p>
      </header>

      <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', marginBottom: '16px' }}>Your Submission</h4>
        <textarea 
          style={{ width: '100%', height: '300px', padding: '24px', borderRadius: '16px', border: '1px solid #f0f0f0', outline: 'none', fontSize: '1rem', background: '#fafafa', marginBottom: '24px', fontFamily: 'inherit' }}
          placeholder="Type your response or paste your project URL here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: 600 }}>
             Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}
          </div>
          <button 
            onClick={handleSubmit}
            style={{ background: '#7A1F2B', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'UPLOADING...' : 'SUBMIT WORK'}
          </button>
        </div>
      </div>
    </div>
  );
}
