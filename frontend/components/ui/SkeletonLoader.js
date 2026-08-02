'use client';

export function CourseCardSkeleton() {
  return (
    <div
      className="course-card-skeleton"
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '16px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '160px',
          background: '#e5e7eb',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      />
      <div
        style={{
          width: '70%',
          height: '20px',
          background: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '8px',
        }}
      />
      <div
        style={{
          width: '50%',
          height: '16px',
          background: '#e5e7eb',
          borderRadius: '4px',
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" style={{ padding: '24px' }}>
      {/* Header Skeleton */}
      <div
        style={{
          width: '300px',
          height: '32px',
          background: '#e5e7eb',
          borderRadius: '8px',
          marginBottom: '24px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />

      {/* Stats Cards Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#e5e7eb',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            />
            <div
              style={{
                width: '80%',
                height: '16px',
                background: '#e5e7eb',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map(i => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
