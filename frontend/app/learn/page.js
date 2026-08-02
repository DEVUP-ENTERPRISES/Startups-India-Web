'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/my-courses');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ color: '#6b7280' }}>Redirecting to your courses...</p>
    </div>
  );
}
