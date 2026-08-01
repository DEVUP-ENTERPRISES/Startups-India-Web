'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CourseCard({ course }) {
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage =
    course.discount ||
    Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  const [imgSrc, setImgSrc] = useState(course.thumbnail || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80");

  return (
    <div
      className="course-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 16,
        boxShadow: isHovered ? '0 4px 24px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.18s',
        background: '#fff',
        padding: 20,
        margin: 0,
        minWidth: 0,
        maxWidth: 420,
        width: '100%',
        position: 'relative',
        outline: isHovered ? '2px solid #6366f1' : 'none',
        outlineOffset: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Thumbnail */}
      <div
        className="course-thumbnail"
        style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}
      >
        <Image
          src={imgSrc}
          alt={course.title}
          width={400}
          height={225}
          className="thumbnail-image"
          onError={() => {
            setImgSrc("https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80");
          }}
        />
        {course.originalPrice && course.price < course.originalPrice && (
          <div className="discount-badge">{discountPercentage}% OFF</div>
        )}
        {course.bestseller && <div className="bestseller-badge">⭐ Bestseller</div>}
      </div>

      {/* Content */}
      <div className="course-content" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Category */}
        <div
          className="course-category"
          style={{
            fontSize: 13,
            color: '#6366f1',
            fontWeight: 600,
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          {course.category}
        </div>

        {/* Title */}
        <h3
          className="course-title"
          style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.2 }}
        >
          {course.title}
        </h3>

        {/* Subtitle */}
        <p
          className="course-subtitle"
          style={{ fontSize: 15, color: '#64748b', margin: 0, fontWeight: 500 }}
        >
          {course.subtitle}
        </p>

        {/* Instructor */}
        <div
          className="course-instructor"
          style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}
        >
          <Image
            src={course.instructor.avatar}
            alt={course.instructor.name}
            width={32}
            height={32}
            className="instructor-avatar"
          />
          <span className="instructor-name">{course.instructor.name}</span>
        </div>

        {/* Stats */}
        <div
          className="course-stats"
          style={{ display: 'flex', gap: 16, fontSize: 13, color: '#475569', margin: '4px 0' }}
        >
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{course.rating}</span>
            <span className="stat-label">({course.reviewsCount.toLocaleString()})</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">
              {course.students || (course.studentsEnrolled / 1000).toFixed(0) + 'K'}
            </span>
            <span className="stat-label">students</span>
          </div>
        </div>

        {/* Details */}
        <div
          className="course-details"
          style={{ display: 'flex', gap: 16, fontSize: 13, color: '#475569', margin: '4px 0' }}
        >
          <div className="detail-item">
            <span className="detail-icon">🕐</span>
            <span>{course.duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📚</span>
            <span>{course.lectures} lectures</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📊</span>
            <span>{course.level}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div
          className="course-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <div
            className="course-price"
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span className="price-current">₹{course.price}</span>
            {course.originalPrice && course.price < course.originalPrice && (
              <span className="price-original">₹{course.originalPrice}</span>
            )}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="view-course-btn"
            style={{
              background: isHovered ? '#6366f1' : '#f1f5f9',
              color: isHovered ? '#fff' : '#6366f1',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              transition: 'background 0.18s, color 0.18s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            View Course
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hover overlay with quick info */}
      {isHovered && (
        <div
          className="course-hover-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(99,102,241,0.97)',
            color: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(99,102,241,0.18)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 28,
            transition: 'background 0.18s',
          }}
        >
          <h4 className="hover-title" style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
            What you'll learn
          </h4>
          <ul
            className="hover-list"
            style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: 320 }}
          >
            {course.whatYouWillLearn.slice(0, 4).map((item, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 15,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={`/courses/${course.slug}`}
            className="hover-cta"
            style={{
              marginTop: 18,
              background: '#fff',
              color: '#6366f1',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              transition: 'background 0.18s, color 0.18s',
              display: 'inline-block',
            }}
          >
            View Full Details →
          </Link>
        </div>
      )}
    </div>
  );
}
