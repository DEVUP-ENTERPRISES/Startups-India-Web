'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

export default function AssessmentPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/v1/enrollments').then(res => {
      setCourses(res.data || []);
      setLoading(false);
    });
  }, []);

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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Assessments</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Take quizzes and assessments for your enrolled courses.
        </p>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No enrolled courses yet.</p>
            <Link
              href="/courses"
              style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
            >
              Browse courses →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map(e => (
              <Link
                key={e._id}
                href={`/learn/${e.courseId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '1rem 1.25rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: 2 }}>
                      {e.courseTitle || 'Course'}
                    </h3>
                    <span
                      style={{ fontSize: '0.8rem', color: e.completed ? '#10b981' : '#6b7280' }}
                    >
                      {e.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem' }}>
                    Start Assessment →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
