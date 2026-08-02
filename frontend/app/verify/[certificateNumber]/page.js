'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

export default function VerifyCertificatePage() {
  const { certificateNumber } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/api/v1/certificates/verify/${encodeURIComponent(certificateNumber)}`).then(res => {
      if (res.error) {
        setError(res.error.message || 'Certificate not found.');
      } else {
        setCert(res.data);
      }
      setLoading(false);
    });
  }, [certificateNumber]);

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
        <p>Verifying certificate...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '2.5rem',
          maxWidth: 500,
          width: '100%',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
        }}
      >
        {error ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#ef4444',
              }}
            >
              Invalid Certificate
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          </>
        ) : cert ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#10b981',
              }}
            >
              Certificate Verified
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              This certificate is authentic and valid.
            </p>

            <div
              style={{
                background: '#f9fafb',
                borderRadius: 12,
                padding: '1.25rem',
                textAlign: 'left',
                marginBottom: '1rem',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                  Certificate Number
                </span>
                <p style={{ fontWeight: 600, fontFamily: 'monospace' }}>{cert.certificateNumber}</p>
              </div>
              {cert.userName && (
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}
                  >
                    Issued To
                  </span>
                  <p style={{ fontWeight: 600 }}>{cert.userName}</p>
                </div>
              )}
              {cert.courseTitle && (
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}
                  >
                    Course
                  </span>
                  <p style={{ fontWeight: 600 }}>{cert.courseTitle}</p>
                </div>
              )}
              {cert.issuedAt && (
                <div>
                  <span
                    style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}
                  >
                    Issued On
                  </span>
                  <p style={{ fontWeight: 600 }}>
                    {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : null}

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
