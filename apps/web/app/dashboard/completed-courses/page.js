'use client';

import { useDashboard } from '@/contexts/DashboardProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function CompletedCoursesPage() {
  const { completedCourses, courses, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ height: '40px', width: '250px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '2rem' }} className="animate-pulse" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: '350px', background: '#f3f4f6', borderRadius: '24px' }} className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Map enrollments to course details
  const displayItems = completedCourses.map(enr => {
    const course = courses.find(c => c._id === enr.courseId);
    return { ...enr, course };
  }).filter(item => item.course);

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .completed-card { animation: fadeInUp 0.4s ease-out both; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .completed-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
        .action-btn { transition: all 0.2s; }
        .action-btn:hover { transform: scale(1.03); filter: brightness(1.1); }
      `}} />

      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Completed Courses</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Congratulations on your achievements! Your finished learning paths are here.
          </p>
        </div>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#059669',
          padding: '0.75rem 1.25rem',
          borderRadius: '16px',
          fontWeight: 800,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21 8 14l-6-4.6h7.6z" />
          </svg>
          {displayItems.length} Courses Finished
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
          borderRadius: '32px',
          border: '2px solid #fde68a',
          boxShadow: '0 15px 40px -10px rgba(251,191,36,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes trophy-bounce { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.1) translateY(-10px); } }
            @keyframes sparkle { 0%, 100% { opacity: 0.3; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
            .trophy-emoji { animation: trophy-bounce 2s ease-in-out infinite; display: inline-block; }
            .sparkle-dot { position: absolute; width: 6px; height: 6px; background: #fbbf24; border-radius: 50%; animation: sparkle 2s infinite; }
          `}} />
          
          <div style={{ position: 'relative', height: '100px', width: '100px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="sparkle-dot" style={{ top: '10%', left: '20%', animationDelay: '0s' }} />
            <div className="sparkle-dot" style={{ top: '30%', right: '15%', animationDelay: '0.4s' }} />
            <div className="sparkle-dot" style={{ bottom: '20%', left: '30%', animationDelay: '0.8s' }} />
            <div className="trophy-emoji" style={{ zIndex: 2 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginBottom: '1rem' }}>
            The finish line is calling!
          </h2>
          <p style={{ color: '#b45309', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.6, fontSize: '1.1rem' }}>
            Every expert was once a beginner. Complete your active courses to see your hard-earned certificates here!
          </p>
          
          <Link href="/dashboard/my-courses" style={{ textDecoration: 'none' }}>
            <button className="action-btn" style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 10px 20px -5px rgba(245,158,11,0.4)'
            }}>
              Go to Enrolled Courses
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {displayItems.map((item, i) => (
            <div key={item._id} className="completed-card" style={{
              background: 'var(--dashboard-bg)',
              borderRadius: '24px',
              border: '1px solid #f3f4f6',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animationDelay: i * 0.05 + 's',
            }}>
              <div style={{ position: 'relative', height: '180px', flexShrink: 0 }}>
                {item.course.thumbnailUrl ? (
                  <Image
                    src={item.course.thumbnailUrl}
                    alt={item.course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '3rem', color: '#fff', fontWeight: 900, opacity: 0.8 }}>
                      {item.course.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#fff',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  COMPLETED
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'inline-block'
                }}>
                  Finished on {new Date(item.completedAt).toLocaleDateString()}
                </span>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#111827',
                  margin: '0 0 0.75rem',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.course.title}
                </h3>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <Link href={`/dashboard/certificates`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className="action-btn" style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 16px -4px rgba(245,158,11,0.3)'
                    }}>
                      View Certificate
                    </button>
                  </Link>
                  <Link href={`/learn/${item.courseId}`} style={{ textDecoration: 'none' }}>
                    <button className="action-btn" style={{
                      background: '#f3f4f6',
                      color: '#4b5563',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}>
                      Review
                    </button>
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

