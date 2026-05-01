'use client';

import { useDashboard } from '@/contexts/DashboardProvider';
import Link from 'next/link';

export default function CompletedCoursesPage() {
  const { enrolledCourses, isLoading } = useDashboard();

  const completedCourses = enrolledCourses.filter(e => e.status === 'completed' || e.completed);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            height: 32,
            width: 240,
            background: '#e5e7eb',
            borderRadius: 8,
            marginBottom: '2rem',
          }}
          className="animate-pulse"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{ height: 280, background: '#f3f4f6', borderRadius: 20 }}
              className="animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="completed-courses-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .completed-courses-container { padding: 2rem; maxWidth: 1280px; margin: 0 auto; }
        .completed-grid { display: grid; gridTemplateColumns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        @media (max-width: 768px) {
          .completed-courses-container { padding: 1.25rem 1rem; }
          .completed-courses-container h1 { font-size: 1.5rem !important; margin-bottom: 1.5rem !important; }
          .completed-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .completed-item-card { border-radius: 16px !important; }
          .completed-item-thumb { height: 120px !important; }
        }
      `}} />
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: '2rem',
          color: '#111827',
          letterSpacing: '-0.025em',
        }}
      >
        Completed Courses
      </h1>

      {completedCourses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--dashboard-bg)',
            borderRadius: '24px',
            border: '2px dashed #e5e7eb',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <svg
              width="64"
              height="64"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            No completed courses yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Finish your active courses to see them here and earn your certificates.
          </p>
          <Link
            href="/dashboard/my-courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#111827',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="completed-grid">
          {completedCourses.map(e => (
            <div
              key={e._id}
              className="completed-item-card"
              style={{
                background: 'var(--dashboard-bg)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
              }}
            >
              <div className="completed-item-thumb" style={{ height: 160, background: '#f0fdf4', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <svg width="48" height="48" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                 </svg>
                 <div style={{ position: 'absolute', bottom: 12, right: 12, background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                    COMPLETED
                 </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>
                  {e.courseTitle}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                  Completed on {e.completedAt ? new Date(e.completedAt).toLocaleDateString() : 'N/A'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <Link
                    href={`/learn/${e.courseId}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      background: '#f3f4f6',
                      color: '#111827',
                      padding: '0.6rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    View
                  </Link>
                  <Link
                    href="/dashboard/certificates"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      background: '#111827',
                      color: '#fff',
                      padding: '0.6rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Certificate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
