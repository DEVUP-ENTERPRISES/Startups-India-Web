'use client';

import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardProvider';

export default function MyCoursesPage() {
  const { enrolledCourses, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
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
        {[1, 2].map(i => (
          <div
            key={i}
            style={{
              height: 100,
              background: '#f3f4f6',
              borderRadius: 20,
              marginBottom: '1rem',
            }}
            className="animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="my-courses-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .my-courses-container { padding: 2.5rem; maxWidth: 1200px; margin: 0 auto; }
        .course-item-card { 
          background: #ffffff; 
          border-radius: 24px; 
          padding: 1.25rem; 
          border: 1px solid #f1f5f9; 
          display: flex; 
          align-items: center; 
          gap: 1.5rem; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .course-item-card:hover { 
          transform: translateY(-4px); 
          border-color: #7A1F2B;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .course-icon-box {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justifyContent: center;
          flex-shrink: 0;
          border: 1px solid #f1f5f9;
          color: #7A1F2B;
        }
        .course-progress-bar {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
          width: 100%;
          margin-top: 0.5rem;
        }
        .empty-state-card {
          text-align: center;
          padding: 6rem 2rem;
          background: #ffffff;
          border-radius: 32px;
          border: 2px dashed #f1f5f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .my-courses-container { padding: 1.5rem 1rem; }
          .course-item-card { flex-direction: column; align-items: stretch; gap: 1rem; padding: 1.5rem; }
          .course-icon-box { width: 56px; height: 56px; }
          .course-item-info { text-align: center; }
          .course-item-progress { align-items: stretch !important; }
        }
      `,
        }}
      />
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#111827',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}
        >
          My Courses
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
          You are currently enrolled in {enrolledCourses.length} programs.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="empty-state-card">
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '24px', 
            background: '#f8fafc', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: '#94a3b8'
          }}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
            No active courses
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '340px', lineHeight: 1.6 }}>
            Ready to learn? Explore our startup curriculum and start building your dream today.
          </p>
          <Link
            href="/dashboard/explore"
            style={{
              background: '#7A1F2B',
              color: '#fff',
              padding: '0.875rem 2rem',
              borderRadius: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {enrolledCourses.map(e => {
            const isCompleted = e.status === 'completed' || e.completed;
            const progress = e.progress || 0;
            return (
              <Link
                key={e._id}
                href={`/learn/${e.courseId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="course-item-card">
                  {/* Leading Icon Box */}
                  <div className="course-icon-box">
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {isCompleted ? (
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      )}
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="course-item-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: isCompleted ? '#059669' : '#7A1F2B',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#111827', marginBottom: '0.25rem' }}>
                      {e.courseTitle || 'Course'}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Joined on {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div
                    className="course-item-progress"
                    style={{
                      width: '240px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.875rem', fontWeight: 700 }}>
                      <span style={{ color: '#111827' }}>Progress</span>
                      <span style={{ color: isCompleted ? '#059669' : '#111827' }}>{isCompleted ? '100%' : `${progress}%`}</span>
                    </div>
                    <div className="course-progress-bar">
                      <div
                        style={{
                          height: '100%',
                          width: isCompleted ? '100%' : `${progress}%`,
                          background: isCompleted ? '#059669' : '#7A1F2B',
                          borderRadius: '4px',
                          transition: 'width 1s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Arrow Action */}
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '14px', 
                    background: '#f8fafc', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#111827'
                  }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
