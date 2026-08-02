'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import CertificateCard from '../../components/CertificateCard';
import { getCurrentUser } from '@/lib/auth';
import '../../styles/certificate.css';

function CertificateContent() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const { data, error } = await getCurrentUser();
        if (error || !data?.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);

        // Fetch certificates from backend API
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/api/v1/certificates/my`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (res.ok) {
          const json = await res.json();
          setCertificates(json.data || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading certificates:', error);
        setIsLoading(false);
      }
    };
    loadCertificates();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <div className="certificate-header">
        <div className="container">
          <h1 className="certificate-page-title">My Certificates</h1>
          <p className="certificate-page-description">Your achievements and completed courses</p>
        </div>
      </div>

      <div className="container py-4">
        {certificates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏆</div>
            <h3 className="empty-state-title">No certificates yet</h3>
            <p className="empty-state-description">
              Complete courses to earn certificates and showcase your skills.
            </p>
            <button onClick={() => router.push('/dashboard')} className="btn btn-primary">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="certificates-grid">
            {certificates.map(certificate => (
              <div key={certificate.id} className="certificate-item">
                <div className="certificate-item-header">
                  <h3 className="certificate-course-name">{certificate.courses.title}</h3>
                  <p className="certificate-issue-date">
                    Issued on{' '}
                    {new Date(certificate.issued_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <CertificateCard
                  certificate={certificate}
                  userName={user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  courseName={certificate.courses.title}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <ProtectedRoute>
      <CertificateContent />
    </ProtectedRoute>
  );
}
