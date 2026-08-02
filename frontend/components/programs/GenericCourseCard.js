'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GenericCourseCard({ course, isEnrolled = false, showEnrollButton = true }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/courses/${course.slug}`);
  };

  const getDifficultyColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBadge = (level) => {
    const color = getDifficultyColor(level);
    return (
      <span style={{
        padding: '4px 12px',
        background: `${color}15`,
        color: color,
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {level || 'Beginner'}
      </span>
    );
  };

  return (
    <div 
      className="generic-course-card"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.12)' 
          : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Course Image */}
      <div style={{ 
        position: 'relative', 
        paddingTop: '56.25%', // 16:9 aspect ratio
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden'
      }}>
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url}
            alt={course.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            fontWeight: '700'
          }}>
            {course.title?.charAt(0) || '📚'}
          </div>
        )}
        
        {/* Status Badge */}
        {isEnrolled && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '6px 14px',
            background: '#10b981',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            ✓ Enrolled
          </div>
        )}

        {course.is_featured && !isEnrolled && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '6px 14px',
            background: '#e63946',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)'
          }}>
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Course Content */}
      <div style={{ padding: '20px' }}>
        {/* Difficulty & Duration */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          {getDifficultyBadge(course.difficulty_level)}
          <span style={{
            fontSize: '13px',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {course.duration_weeks} weeks
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.title}
        </h3>

        {/* Subtitle/Description */}
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.subtitle || course.intro_copy?.substring(0, 100) || 'Learn new skills and advance your career'}
        </p>

        {/* Course Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
              {course.total_modules || 0}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginTop: '2px' }}>
              Modules
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
              {course.enrolled_count || 0}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginTop: '2px' }}>
              Students
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              ⭐ {course.average_rating || '4.9'}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginTop: '2px' }}>
              Rating
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {showEnrollButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: isEnrolled 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #e63946 0%, #d62828 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isEnrolled
                ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(230, 57, 70, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = isEnrolled
                ? '0 6px 16px rgba(16, 185, 129, 0.4)'
                : '0 6px 16px rgba(230, 57, 70, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isEnrolled
                ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(230, 57, 70, 0.3)';
            }}
          >
            {isEnrolled ? 'Continue Learning →' : 'View Course Details →'}
          </button>
        )}
      </div>
    </div>
  );
}
