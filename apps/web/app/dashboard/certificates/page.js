'use client';

import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardProvider';
import Icon from '@/components/Icon';

export default function CertificatesPage() {
  const { certificates, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ height: 40, width: 240, background: '#f1f5f9', borderRadius: 12, marginBottom: '2rem' }} className="animate-pulse" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 240, background: '#f8fafc', borderRadius: 20, border: '1px solid #f1f5f9' }} className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-container">
      <style jsx>{`
        .certificates-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .cert-hero {
          margin-bottom: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }
        .hero-title h1 {
          font-size: 2.25rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
        }
        .hero-title p {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }
        .cert-stats {
          display: flex;
          gap: 2rem;
        }
        .stat-item {
          text-align: right;
        }
        .stat-val {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          color: #7A1F2B;
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }
        .cert-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .cert-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(122, 31, 43, 0.08);
          border-color: rgba(122, 31, 43, 0.15);
        }
        .cert-icon-wrapper {
          width: 64px;
          height: 64px;
          background: #fdf2f2;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #7A1F2B;
        }
        .cert-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .cert-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 1.5rem;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }
        .cert-id {
          font-family: 'SF Mono', monospace;
          color: #94a3b8;
          font-size: 0.75rem;
        }
        .cert-actions {
          display: flex;
          gap: 12px;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .btn-view {
          flex: 1;
          background: #7A1F2B;
          color: #fff;
          text-align: center;
          padding: 10px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          transition: 0.2s;
        }
        .btn-view:hover {
          background: #5c1520;
          transform: translateY(-2px);
        }
        .btn-verify {
          flex: 1;
          background: #f8fafc;
          color: #475569;
          text-align: center;
          padding: 10px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid #e2e8f0;
          transition: 0.2s;
        }
        .btn-verify:hover {
          background: #fff;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .empty-state {
          background: #f8fafc;
          border-radius: 32px;
          padding: 5rem 2rem;
          text-align: center;
          border: 2px dashed #e2e8f0;
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          color: #cbd5e1;
        }
        .empty-state h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .empty-state p {
          color: #64748b;
          margin-bottom: 2rem;
          font-weight: 500;
        }
        .btn-explore {
          background: #7A1F2B;
          color: #fff;
          padding: 12px 28px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
        }
        .btn-explore:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(122, 31, 43, 0.2);
        }

        @media (max-width: 768px) {
          .cert-hero { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .cert-stats { width: 100%; justify-content: space-between; }
          .cert-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cert-hero">
        <div className="hero-title">
          <h1>My Certificates</h1>
          <p>Recognizing your professional growth and expertise.</p>
        </div>
        <div className="cert-stats">
          <div className="stat-item">
            <span className="stat-val">{certificates.length}</span>
            <span className="stat-label">Earned</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">{certificates.filter(c => c.isPremium).length}</span>
            <span className="stat-label">Premium</span>
          </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon name="certificate" size={40} />
          </div>
          <h2>No certificates yet</h2>
          <p>Complete any course or program to receive a verified certificate of completion.</p>
          <Link href="/dashboard/explore" className="btn-explore">
            Browse Courses <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      ) : (
        <div className="cert-grid">
          {certificates.map(cert => (
            <div key={cert._id} className="cert-card">
              <div className="cert-icon-wrapper">
                <Icon name="certificate" size={32} />
              </div>
              
              <div className="cert-content">
                <h3>{cert.courseTitle || 'Executive Management Program'}</h3>
                
                <div className="cert-meta">
                  <div className="meta-row">
                    <Icon name="calendar" size={14} />
                    <span>Issued: {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                  </div>
                  {cert.certificateNumber && (
                    <div className="meta-row cert-id">
                      <Icon name="checkCircle" size={14} color="#10b981" />
                      ID: {cert.certificateNumber}
                    </div>
                  )}
                </div>

                <div className="cert-actions">
                  <Link href={`/certificate?id=${cert._id}`} className="btn-view">
                    View Certificate
                  </Link>
                  {cert.certificateNumber && (
                    <Link href={`/verify/${cert.certificateNumber}`} className="btn-verify">
                      Verify Link
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

