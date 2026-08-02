'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    apiGet(`/api/v1/learning/quiz?videoId=${id}`).then(res => {
      setQuestions(res.data || []);
      setLoading(false);
    });
  }, [id]);

  function selectAnswer(questionId, optionIndex) {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');

    const responses = questions.map(q => ({
      questionId: q._id,
      selectedOption: answers[q._id],
    }));

    const res = await apiPost('/api/v1/learning/quiz', { videoId: id, responses });
    if (res.error) {
      setError(res.error.message);
    } else {
      setResult(res.data);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No Quiz Found</h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>This quiz has no questions yet.</p>
        <button
          onClick={() => router.back()}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Result screen
  if (result) {
    const passed = result.passed ?? result.score >= 75;
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '3rem',
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📝'}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
          </h1>
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: passed ? '#10b981' : '#ef4444',
              marginBottom: '0.5rem',
            }}
          >
            {result.score ?? result.percentage}%
          </p>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {result.correct ?? 0} of {result.total ?? questions.length} correct •{' '}
            {passed ? 'Great job!' : 'You need 75% to pass.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {!passed && (
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQ(0);
                }}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => router.back()}
              style={{
                padding: '0.6rem 1.25rem',
                background: '#1f2937',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Back to Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '2rem',
          maxWidth: 600,
          width: '100%',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Progress */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Question {currentQ + 1} of {questions.length}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {Object.keys(answers).length}/{questions.length} answered
          </span>
        </div>
        <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, marginBottom: '1.5rem' }}>
          <div
            style={{
              height: '100%',
              width: `${((currentQ + 1) / questions.length) * 100}%`,
              background: '#3b82f6',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Question */}
        <h2
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.5 }}
        >
          {q.question || q.text}
        </h2>

        {/* Options */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            marginBottom: '1.5rem',
          }}
        >
          {(q.options || []).map((opt, i) => {
            const selected = answers[q._id] === i;
            return (
              <button
                key={i}
                onClick={() => selectAnswer(q._id, i)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  border: selected ? '2px solid #3b82f6' : '1px solid #d1d5db',
                  background: selected ? '#eff6ff' : '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: selected ? 600 : 400,
                  color: '#1f2937',
                  fontSize: '0.9rem',
                }}
              >
                {typeof opt === 'string' ? opt : opt.text || opt.label}
              </button>
            );
          })}
        </div>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'none',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              cursor: currentQ === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQ === 0 ? 0.4 : 1,
              fontWeight: 500,
            }}
          >
            ← Previous
          </button>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
              style={{
                padding: '0.6rem 1.25rem',
                background: '#1f2937',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '0.6rem 1.25rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
