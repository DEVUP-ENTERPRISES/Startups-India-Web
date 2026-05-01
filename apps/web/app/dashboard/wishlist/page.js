'use client';

import { useDashboard } from '@/contexts/DashboardProvider';
import { apiPost } from '@/lib/api';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, isLoading, refresh } = useDashboard();

  async function handleRemove(id) {
    const res = await apiPost(`/api/v1/courses/${id}/wishlist`, {});
    if (res.success) {
      refresh();
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            height: 24,
            width: 160,
            background: '#e5e7eb',
            borderRadius: 8,
            marginBottom: '1.5rem',
          }}
          className="animate-pulse"
        />
        {[1, 2].map(i => (
          <div
            key={i}
            style={{ height: 60, background: '#f3f4f6', borderRadius: 12, marginBottom: '1rem' }}
            className="animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .wishlist-container { padding: 2rem; maxWidth: 1280px; margin: 0 auto; }
        .wishlist-grid { display: grid; gridTemplateColumns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        @media (max-width: 768px) {
          .wishlist-container { padding: 1.25rem 1rem; }
          .wishlist-container h1 { font-size: 1.5rem !important; margin-bottom: 1.5rem !important; }
          .wishlist-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .wishlist-item-card { border-radius: 16px !important; }
          .wishlist-item-thumb { height: 140px !important; }
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
        Wishlist
      </h1>

      {wishlist.length === 0 ? (
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
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Save courses you're interested in for later.
          </p>
          <Link
            href="/dashboard/explore"
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
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(course => (
            <div
              key={course._id}
              className="wishlist-item-card"
              style={{
                background: 'var(--dashboard-bg)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="wishlist-item-thumb"
                style={{ height: 160, background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}
              >
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '4px 8px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#111827',
                  }}
                >
                  {course.price > 0 ? `₹${course.price.toLocaleString()}` : 'FREE'}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#6366f1',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {course.category}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#111827',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                  }}
                >
                  {course.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {course.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: 'auto',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '1rem',
                  }}
                >
                  <Link
                    href={`/courses/${course.slug || course._id}`}
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
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(course._id)}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

