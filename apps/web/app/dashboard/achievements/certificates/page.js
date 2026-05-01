'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificatesPage() {
  const router = useRouter();
  const [certs, setCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/v1/achievements/certificates');
        const json = await res.json();
        if (json.success) {
          setCerts(json.data);
          if (json.data.length > 0) {
            setSelectedCert(json.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleOpenNewTab = () => {
    if (selectedCert) {
      window.open(`/certificates/view/${selectedCert.certificateNumber}`, '_blank');
    }
  };

  const handleLinkedInShare = () => {
    if (!selectedCert) return;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/certificates/verify/' + selectedCert.certificateNumber)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page certificates-page">
      
      {/* ── HEADER ── */}
      <header className="payments-hero-header">
        <div className="header-text">
          <h1 className="header-title-main">Achievement Vault</h1>
          <p className="header-subtitle-main">Showcase your verified certifications and milestones to the world.</p>
        </div>
      </header>

      {/* ── MAIN CONTENT: SIDEBAR + PREVIEW ── */}
      <div className="certificates-layout">
        
        {certs.length > 0 ? (
          <>
            <aside className="certificates-sidebar">
              <h2 className="sidebar-label">SELECT ACHIEVEMENT</h2>
              <div className="sidebar-list custom-scrollbar">
                {certs.map(cert => (
                  <button
                    key={cert._id}
                    onClick={() => setSelectedCert(cert)}
                    className={`sidebar-item-card ${selectedCert?._id === cert._id ? 'active' : ''}`}
                  >
                    <div className="sidebar-item-icon">
                       <Icon name="certificate" size={20} color={selectedCert?._id === cert._id ? '#fff' : '#94a3b8'} />
                    </div>
                    <div className="sidebar-item-info">
                       <div className="sidebar-item-title">{cert.courseTitle}</div>
                       <div className="sidebar-item-date">Issued {new Date(cert.completionDate).toLocaleDateString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="certificates-main-stage">
              <AnimatePresence mode="wait">
                {selectedCert && (
                  <motion.div 
                    key={selectedCert._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="certificate-render-wrapper"
                  >
                    {/* Certificate High-Res Card */}
                    <div className="certificate-canvas">
                       <div className="cert-inner-frame" />
                       <img src="/assets/images/logo.png" alt="Logo" className="cert-logo" />
                       <h3 className="cert-type-label">Certificate of Excellence</h3>
                       <p className="cert-intro">This is to certify that</p>
                       <h2 className="cert-recipient-name">{selectedCert.userName}</h2>
                       <p className="cert-completion-text">Has successfully completed the comprehensive training program in</p>
                       <h4 className="cert-course-name">{selectedCert.courseTitle}</h4>
                       
                        <div className="cert-footer-row">
                          <div className="cert-signatory">
                             <div className="sign-name">Faizan Mohammed</div>
                             <div className="sign-title">Managing Director</div>
                          </div>
                          <div className="cert-seal">
                             <div className="seal-outer">
                                <div className="seal-inner">
                                   <Icon name="award" size={32} color="#fff" />
                                </div>
                             </div>
                          </div>
                          <div className="cert-date-box">
                             <div className="date-val">{new Date(selectedCert.completionDate).toLocaleDateString()}</div>
                             <div className="date-label">Issue Date</div>
                          </div>
                        </div>
                    </div>

                    {/* ACTION BAR */}
                    <div className="certificates-action-toolbar">
                      <div className="toolbar-group">
                        <button 
                          onClick={() => router.push(`/learn/${selectedCert.courseId}`)}
                          className="btn-toolbar-secondary"
                        >
                          <Icon name="book" size={18} /> REVISIT COURSE
                        </button>
                        <button 
                          onClick={handleOpenNewTab}
                          className="btn-toolbar-secondary"
                        >
                          <Icon name="externalLink" size={18} /> FULLSCREEN
                        </button>
                      </div>
                      
                      <div className="toolbar-group">
                        <button className="btn-toolbar-outline">
                          <Icon name="download" size={18} /> DOWNLOAD PDF
                        </button>
                        <button 
                          onClick={handleLinkedInShare}
                          className="btn-toolbar-primary"
                        >
                          <Icon name="userPlus" size={18} /> ADD TO LINKEDIN
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: '#fcfdfe' }}>
             <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '30px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                   <Icon name="certificate" size={40} color="#cbd5e1" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', marginBottom: '1rem' }}>No Certificates Found</h3>
                <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.6 }}>Complete your courses and assessments to unlock professional certifications in the vault.</p>
                <button 
                  onClick={() => router.push('/dashboard/learning/enrolled')}
                  style={{ marginTop: '2.5rem', padding: '16px 32px', borderRadius: '18px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}
                >
                  START LEARNING
                </button>
             </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .certificates-page { min-height: 100vh; background: #fff; display: flex; flex-direction: column; font-family: 'Poppins', sans-serif; }
        .payments-hero-header { padding: 3rem 4rem; background: #fff; border-bottom: 1px solid #f1f5f9; }
        .header-title-main { font-size: 2.8rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .header-subtitle-main { font-size: 1.1rem; color: #64748b; font-weight: 650; margin-top: 8px; }

        @media (max-width: 1060px) {
          .payments-hero-header { padding: 6.5rem 1.25rem 1.5rem !important; border-bottom: none !important; }
          .header-title-main { font-size: 2.25rem !important; }
        }
        
        .certificates-layout { display: flex; flex: 1; overflow: hidden; }
        .certificates-sidebar { width: 340px; background: #fff; border-right: 1px solid #f1f5f9; display: flex; flex-direction: column; padding: 2.5rem; flex-shrink: 0; }
        .sidebar-label { font-size: 0.8rem; font-weight: 950; color: #94a3b8; margin-bottom: 2rem; letter-spacing: 0.15em; }
        .sidebar-list { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; padding-right: 8px; }
        
        .sidebar-item-card { padding: 16px; border-radius: 20px; border: 1.5px solid #f1f5f9; background: #fff; text-align: left; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 16px; }
        .sidebar-item-card:hover { border-color: #ef4444; background: #fff; transform: translateX(5px); }
        .sidebar-item-card.active { border-color: #ef4444; background: #fef2f2; transform: translateX(8px); box-shadow: 10px 15px 35px rgba(239, 68, 68, 0.08); }
        
        .sidebar-item-icon { width: 44px; height: 44px; border-radius: 14px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sidebar-item-card.active .sidebar-item-icon { background: #ef4444; color: #fff !important; }
        
        .sidebar-item-info { flex: 1; min-width: 0; }
        .sidebar-item-title { font-size: 0.9rem; font-weight: 850; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sidebar-item-card.active .sidebar-item-title { color: #ef4444; }
        .sidebar-item-date { font-size: 0.7rem; color: #94a3b8; font-weight: 750; margin-top: 2px; }
        
        .certificates-main-stage { flex: 1; padding: 4rem; display: flex; flex-direction: column; align-items: center; overflow-y: auto; background: #fcfdfe; }
        .certificate-render-wrapper { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 4rem; }
        
        .certificate-canvas { aspect-ratio: 1.414/1; width: 100%; background: #fff; border-radius: 24px; box-shadow: 0 40px 100px rgba(0,0,0,0.08); position: relative; padding: 5rem; border: 20px solid #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-image: linear-gradient(to right, #f8fafc, #fff) 1; }
        .certificate-canvas::after { content: ''; position: absolute; inset: -4px; border: 1.5px solid #f1f5f9; border-radius: 28px; pointer-events: none; }
        .cert-inner-frame { position: absolute; inset: 20px; border: 1px solid rgba(239, 68, 68, 0.1); border-radius: 12px; pointer-events: none; }
        
        .cert-logo { width: 180px; margin-bottom: 4rem; }
        .cert-type-label { font-size: 1rem; font-weight: 950; color: #ef4444; letter-spacing: 0.6em; text-transform: uppercase; margin-bottom: 3rem; }
        .cert-intro { font-size: 1.25rem; color: #64748b; margin-bottom: 2rem; font-weight: 700; font-family: 'Poppins', sans-serif; }
        .cert-recipient-name { font-size: 4rem; font-weight: 950; color: #0f172a; margin-bottom: 2rem; text-decoration: underline; text-decoration-color: rgba(239, 68, 68, 0.2); text-underline-offset: 12px; }
        .cert-completion-text { font-size: 1.15rem; color: #64748b; max-width: 600px; line-height: 1.8; margin: 0; font-weight: 650; }
        .cert-course-name { font-size: 2.25rem; font-weight: 950; color: #ef4444; margin: 2rem 0 0; letter-spacing: -0.02em; }
        
        .cert-footer-row { display: flex; justify-content: space-between; width: 100%; margin-top: auto; border-top: 2px solid #f8fafc; padding-top: 4rem; align-items: flex-end; }
        .cert-signatory, .cert-date-box { text-align: left; }
        .cert-date-box { text-align: right; }
        .sign-name, .date-val { font-weight: 950; font-size: 1.1rem; color: #0f172a; }
        .sign-title, .date-label { font-size: 0.8rem; color: #94a3b8; font-weight: 800; margin-top: 4px; }
        
        .seal-outer { width: 110px; height: 110px; border: 2px solid #fef2f2; border-radius: 50%; padding: 6px; }
        .seal-inner { width: 100%; height: 100%; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); }
        
        .certificates-action-toolbar { background: #fff; border-radius: 36px; padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 30px 60px rgba(0,0,0,0.04); border: 1.5px solid #f1f5f9; width: 100%; }
        .toolbar-group { display: flex; gap: 16px; }
        .btn-toolbar-secondary { background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 14px 28px; border-radius: 20px; color: #475569; font-weight: 950; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
        .btn-toolbar-secondary:hover { border-color: #ef4444; color: #ef4444; background: #fff; }
        .btn-toolbar-outline { background: #fff; border: 2.5px solid #ef4444; padding: 14px 28px; border-radius: 20px; color: #ef4444; font-weight: 950; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
        .btn-toolbar-primary { background: #ef4444; border: none; padding: 14px 28px; border-radius: 20px; color: #fff; font-weight: 950; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); transition: all 0.2s; }
        .btn-toolbar-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3); }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }

        @media (max-width: 1060px) {
          .certificates-layout { flex-direction: column; overflow: visible; height: auto; }
          .certificates-sidebar { width: 100%; border-right: none; padding: 1.5rem 1.25rem; background: #fff; }
          .sidebar-list { display: flex; flex-direction: column; gap: 12px; overflow-x: visible; padding-bottom: 0; }
          .sidebar-item-card { width: 100%; min-width: 0; transform: none !important; }
          .sidebar-label { margin-bottom: 1rem; }
          
          .certificates-main-stage { padding: 1rem 1rem 6rem; background: #fcfdfe; }
          .certificate-render-wrapper { gap: 2rem; }
          .certificate-canvas { padding: 2.5rem 1.5rem; border-width: 10px; aspect-ratio: auto; min-height: 550px; border-radius: 12px; }
          .cert-logo { width: 120px; margin-bottom: 2rem; }
          .cert-recipient-name { font-size: 2.5rem; margin-bottom: 1.5rem; }
          .cert-course-name { font-size: 1.5rem; margin-top: 1.5rem; }
          
          .cert-footer-row { flex-direction: column; align-items: center; gap: 2rem; text-align: center; padding-top: 2rem; }
          .seal-outer { width: 90px; height: 90px; }
          
          .certificates-action-toolbar { flex-direction: column; gap: 12px; padding: 1.5rem; border-radius: 28px; }
          .toolbar-group { width: 100%; flex-direction: column; gap: 10px; }
          .toolbar-group button { width: 100%; justify-content: center; padding: 16px; border-radius: 18px; }
        }
      `}</style>
    </div>
  );
}

