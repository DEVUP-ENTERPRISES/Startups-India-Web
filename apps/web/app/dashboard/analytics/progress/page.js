'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { apiGet } from '@/lib/api';
import '@/styles/analytics-v2.css';

export default function ProgressOverviewPage() {
  const [data, setData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [progressRes, timeRes] = await Promise.all([
        apiGet('/api/v1/analytics/progress'),
        apiGet('/api/v1/analytics/learning-time')
      ]);

      if (progressRes.data) setData(progressRes.data);
      if (timeRes.data) setTimeData(timeRes.data);

      if (progressRes.error || timeRes.error) {
        setError((progressRes.error || timeRes.error).message);
      }

      setIsLoading(false);
    }
    fetchData();
  }, []);

  const overall = Math.round(data?.overallCompletion || 0);
  const streak = timeData?.streak || 0;

  // Derive recent activity from top completed courses
  const recentCourses = (data?.courseBreakdown || [])
    .filter(c => c.completedCount > 0)
    .slice(0, 2);

  // In-progress courses for upcoming missions (0 < % < 100)
  const inProgressCourses = (data?.courseBreakdown || [])
    .filter(c => c.percentage > 0 && Math.round(c.percentage) < 100)
    .slice(0, 2);

  // Count fully completed courses
  const completedCoursesCount = (data?.courseBreakdown || [])
    .filter(c => Math.round(c.percentage) >= 100).length;

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', fontWeight: 700, color: 'var(--slate-400)' }}>
        Analysing Curriculum Progress...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--brand-font)', color: 'var(--slate-500)' }}>
        <Icon name="alertCircle" size={32} color="#ef4444" />
        <p style={{ marginTop: '1rem', fontWeight: 700 }}>Failed to load analytics: {error}</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1 className="analytics-title">
          Progress <span className="red-glow-text">Overview</span>
        </h1>
      </header>

      <div className="analytics-grid">
        {/* Mastery Path Hero Card - Redesigned for consistency */}
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-v2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-red) 0%, #5a1720 100%)',
              color: '#fff',
              padding: '2rem 2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 30px 60px rgba(122, 31, 43, 0.12)',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '350px', height: '350px', background: 'var(--brand-gold)', filter: 'blur(160px)', opacity: 0.2, zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ padding: '6px 12px', background: 'rgba(197, 151, 91, 0.2)', color: 'var(--brand-gold)', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mastery Path
                </span>
                {streak > 0 && (
                  <span style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icon name="zap" size={12} color="var(--brand-gold)" /> {streak} Day Streak
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#fff' }}>
                Curriculum <span style={{ color: 'var(--brand-gold)' }}>Velocity</span>
              </h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '500px' }}>
                {overall > 0
                  ? `You've cleared ${overall}% of your path. ${data?.completedItems || 0} lessons completed successfully.`
                  : "Begin your learning journey to see your curriculum mastery metrics here."}
              </p>
            </div>

            <div style={{ position: 'relative', width: 'clamp(120px, 25vw, 160px)', height: 'clamp(120px, 25vw, 160px)', flexShrink: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none" stroke="var(--brand-gold)" strokeWidth="10"
                  strokeDasharray="339.29"
                  initial={{ strokeDashoffset: 339.29 }}
                  animate={{ strokeDashoffset: 339.29 - (339.29 * overall) / 100 }}
                  transition={{ duration: 2, ease: 'circOut' }}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{overall}%</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '4px' }}>Path</div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Stats Grid */}
        <div className="col-12 stats-grid">
          {[
            { label: 'Total Hours Learned', val: `${timeData?.totalHours || '0.0'}h`, icon: 'clock', color: 'var(--brand-gold)' },
            { label: 'Lessons Cleared', val: data?.completedItems || 0, icon: 'checkCircle', color: 'var(--brand-red)' },
            { label: 'Courses Completed', val: completedCoursesCount, icon: 'award', color: 'var(--brand-red)' },
          ].map((s, i) => (
            <div key={i} className="glass-card-v2" style={{ padding: '1rem clamp(0.75rem, 3vw, 1.5rem)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: `${s.color === 'var(--brand-red)' || s.color === 'var(--brand-gold)' ? s.color + '20' : s.color + '15'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--slate-500)', marginBottom: '2px', letterSpacing: '0.04em', lineHeight: 1.2 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Mastery Trends */}
        <div className="col-8">
          <div className="glass-card-v2" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2.5rem' }}>Subject Mastery Trends</h3>
            {(data?.courseBreakdown || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)', fontWeight: 700 }}>
                <Icon name="bookOpen" size={40} color="#e2e8f0" />
                <p style={{ marginTop: '1rem' }}>No course progress yet. Start learning to see trends.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {(data.courseBreakdown).map((course, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>{course.courseTitle}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-red)' }}>{Math.round(course.percentage)}%</span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--slate-100)', borderRadius: '10px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, course.percentage)}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        style={{ height: '100%', background: course.percentage > 80 ? 'linear-gradient(90deg, var(--brand-gold) 0%, #e9c46a 100%)' : 'var(--slate-800)', borderRadius: '10px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Recent Activity */}
            <div className="glass-card-v2" style={{ padding: '2rem', borderRadius: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>Recent Activity</h3>
              {recentCourses.length === 0 ? (
                <div style={{ color: 'var(--slate-500)', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                  No activity yet. Start a course to see updates here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {recentCourses.map((course, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'rgba(122,31,43,0.08)', border: '1.5px solid rgba(122,31,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={i === 0 ? 'zap' : 'checkCircle'} size={20} color="var(--brand-red)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{course.courseTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                          {course.completedCount} lesson{course.completedCount !== 1 ? 's' : ''} completed · {Math.round(course.percentage)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Missions (in-progress courses) */}
            <div className="glass-card-v2" style={{ padding: '2rem', borderRadius: '32px', background: 'linear-gradient(135deg, var(--brand-red) 0%, #5a1720 100%)', color: '#fff', border: 'none', boxShadow: '0 25px 50px rgba(122, 31, 43, 0.25)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Continue Learning</h3>
              {inProgressCourses.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textAlign: 'center', padding: '1rem 0' }}>
                  {overall >= 100 ? 'All courses complete! 🎉' : 'Enroll in a course to track progress here.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {inProgressCourses.map((course, i) => (
                    <div key={i} style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-gold)', textTransform: 'uppercase' }}>
                          {Math.round(course.percentage)}% DONE
                        </span>
                        <Icon name="clock" size={14} color="rgba(255,255,255,0.6)" />
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{course.courseTitle}</div>
                      <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, course.percentage)}%`, height: '100%', background: 'var(--brand-gold)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
