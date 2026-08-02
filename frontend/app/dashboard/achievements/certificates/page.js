'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import '@/styles/assessments-v2.css';

const SIGNATURE_FONT = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
const USE_MOCK_DATA = true;

const MOCK_CERTIFICATES = [
  { _id: 'c1', courseTitle: 'Venture Capital Readiness', completionDate: new Date().toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-VC-2024-001', batchName: 'Founders Batch 01', status: 'Unlocked', directorsNote: 'Jaswanth has demonstrated exceptional strategic thinking and financial acumen throughout the Venture Capital Readiness track. His ability to synthesize complex market data into a compelling investment thesis is indicative of top-tier founder talent.' },
  { _id: 'c2', courseTitle: 'Market Entry Excellence', completionDate: new Date(Date.now() - 86400000 * 15).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-ME-2024-005', batchName: 'Founders Batch 01', status: 'Unlocked', directorsNote: "A masterclass in go-to-market orchestration. Jaswanth's framework for TAM expansion and competitive moat construction provides a scalable blueprint for high-growth ventures." },
  { _id: 'c3', courseTitle: 'Series A Growth Modeling', completionDate: new Date(Date.now() - 86400000 * 45).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-GM-2024-012', batchName: 'Founders Batch 02', status: 'Unlocked', directorsNote: "The quantitative rigor displayed in the Growth Modeling assessment is rare. Jaswanth's command over unit economics and predictive scaling models is truly remarkable." },
  { _id: 'c4', courseTitle: 'Product-Market Fit Mastery', completionDate: new Date(Date.now() - 86400000 * 60).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-PMF-2024-018', batchName: 'Founders Batch 02', status: 'Unlocked', directorsNote: "Jaswanth's iterative approach to PMF validation and customer feedback loops has set a new benchmark for the cohort. His product intuition is backed by rigorous data-driven validation." },
  { _id: 'c5', courseTitle: 'Legal & Intellectual Property Strategy', completionDate: new Date(Date.now() - 86400000 * 90).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-IP-2024-022', batchName: 'Founders Batch 03', status: 'Unlocked', directorsNote: 'Strategic mastery of the IP landscape. Jaswanth has successfully navigated complex regulatory frameworks and established a robust defensive posture for digital assets.' },
  { _id: 'c6', courseTitle: 'Global Operations & Scaling', completionDate: new Date(Date.now() - 86400000 * 120).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-OPS-2024-031', batchName: 'Founders Batch 03', status: 'Unlocked', directorsNote: "Operational excellence at scale. Jaswanth's blueprint for international expansion and supply chain optimization reflects a deep understanding of global market dynamics." },
  { _id: 'c7', courseTitle: 'Leadership & Hiring Playbook', completionDate: new Date(Date.now() - 86400000 * 135).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-LH-2024-041', batchName: 'Founders Batch 04', status: 'Unlocked', directorsNote: 'An exceptional understanding of founder-led hiring, team design, and leadership scaffolding under rapid growth conditions.' },
  { _id: 'c8', courseTitle: 'Investor Reporting & Governance', completionDate: new Date(Date.now() - 86400000 * 160).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-IG-2024-052', batchName: 'Founders Batch 04', status: 'Unlocked', directorsNote: 'Demonstrates investor-grade reporting discipline, clean governance practices, and a highly credible board communication style.' },
  { _id: 'c9', courseTitle: 'Data-Driven Decision Making', completionDate: new Date(Date.now() - 86400000 * 25).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-DA-2024-007', batchName: 'Founders Batch 01', status: 'Unlocked', directorsNote: "Mastery in translating raw data into actionable business intelligence. Jaswanth's analytical frameworks have consistently delivered 40%+ efficiency gains." },
  { _id: 'c10', courseTitle: 'Customer Acquisition Strategy', completionDate: new Date(Date.now() - 86400000 * 35).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-CA-2024-011', batchName: 'Founders Batch 01', status: 'Unlocked', directorsNote: 'Exceptional expertise in multi-channel acquisition and conversion optimization. Proven track record of reducing CAC by 55% while maintaining quality metrics.' },
  { _id: 'c11', courseTitle: 'Organizational Scaling Dynamics', completionDate: new Date(Date.now() - 86400000 * 50).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-OS-2024-015', batchName: 'Founders Batch 02', status: 'Unlocked', directorsNote: 'Demonstrated expertise in managing organizational growth from 5-50+ member teams. Knowledge of culture, process design, and leadership delegation.' },
  { _id: 'c12', courseTitle: 'Board Strategy & Governance', completionDate: new Date(Date.now() - 86400000 * 75).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-BG-2024-021', batchName: 'Founders Batch 02', status: 'Unlocked', directorsNote: 'Expert-level understanding of board dynamics, investor relations, and governance best practices. Structured approach to stakeholder alignment.' },
  { _id: 'c13', courseTitle: 'Financial Modeling & Forecasting', completionDate: new Date(Date.now() - 86400000 * 100).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-FF-2024-028', batchName: 'Founders Batch 03', status: 'Unlocked', directorsNote: 'Sophisticated understanding of DCF analysis, scenario modeling, and financial projections. Accuracy rate of 92% on quarterly forecasts.' },
  { _id: 'c14', courseTitle: 'Strategic Partnerships & Alliances', completionDate: new Date(Date.now() - 86400000 * 110).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-SP-2024-035', batchName: 'Founders Batch 03', status: 'Unlocked', directorsNote: 'Mastery in identifying, negotiating, and executing strategic partnerships. Successfully closed 8 revenue-generating alliances in 12 months.' },
  { _id: 'c15', courseTitle: 'Crisis Management & Resilience', completionDate: new Date(Date.now() - 86400000 * 140).toISOString(), userName: 'Jaswanth Reddy', certificateNumber: 'ST-CR-2024-048', batchName: 'Founders Batch 04', status: 'Locked', directorsNote: 'Reserved for demonstration of crisis navigation. Contact program director for unlock criteria.' },
];

export default function CertificatesPage() {
  const router = useRouter();
  const certificateRef = useRef(null);
  const [certs, setCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (USE_MOCK_DATA) {
          setCerts(MOCK_CERTIFICATES);
          return;
        }
        const res = await fetch('/api/v1/achievements/certificates');
        const json = await res.json();
        setCerts(json.success && json.data.length > 0 ? json.data : MOCK_CERTIFICATES);
      } catch {
        setCerts(MOCK_CERTIFICATES);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Track native fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const openPreview = (cert) => {
    setSelectedCert(cert);
    setShowPreview(true);
  };

  const closePreview = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setShowPreview(false);
    setSelectedCert(null);
  };

  const handleToggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (certificateRef.current?.requestFullscreen) {
        await certificateRef.current.requestFullscreen();
      }
    } catch (e) {
      console.error('Fullscreen error:', e);
    }
  };

  const handleDownload = async () => {
    if (!selectedCert || !certificateRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `certificate-${selectedCert.certificateNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #F1F5F9', borderTop: '3px solid #7A1F2B', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <>
      <link rel="stylesheet" href={SIGNATURE_FONT} />

      <div className="platform-page" style={{ padding: '0.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <motion.div
          aria-hidden
          animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-160px', right: '-90px', width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(122,31,43,0.15), rgba(122,31,43,0))',
            pointerEvents: 'none',
          }}
        />

        <AnimatePresence mode="wait">
          {/* ── CARDS LIST VIEW ── */}
          {!showPreview ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <header className="platform-page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 className="platform-page-title" style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  Certification Vault
                </h1>
              </header>

              {certs.filter(c => c.status === 'Unlocked').length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#111', margin: 0, letterSpacing: '-0.02em' }}>
                      Your Certificates
                    </h2>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#7A1F2B', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '999px', padding: '7px 14px', whiteSpace: 'nowrap' }}>
                      {certs.filter(c => c.status === 'Unlocked').length} certificates
                    </div>
                  </div>

                  {/* 4-column grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '1rem',
                    }}
                  >
                    {certs.filter(c => c.status === 'Unlocked').map(cert => (
                      <motion.div
                        key={cert._id}
                        whileHover={{ y: -6 }}
                        onClick={() => openPreview(cert)}
                        style={{
                          padding: '1rem',
                          borderRadius: '20px',
                          background: '#fff',
                          border: '1.5px solid #F1F5F9',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(122,31,43,0.05), transparent)' }} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                            <div style={{ width: 38, height: 38, borderRadius: '12px', background: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon name="award" size={18} color="#fff" />
                            </div>
                            <span style={{
                              fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em',
                              color: '#7A1F2B',
                              background: '#F8FAFC',
                              padding: '5px 10px', borderRadius: '99px',
                            }}>
                              Unlocked
                            </span>
                          </div>
                          <h3 style={{ fontSize: '0.92rem', fontWeight: 950, color: '#111', marginBottom: '0.45rem', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                            {cert.courseTitle}
                          </h3>
                          <p style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 650, marginBottom: '0.35rem', lineHeight: 1.45 }}>
                            Batch: {cert.batchName}
                          </p>
                          <p style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.9rem', lineHeight: 1.45 }}>
                            Issued: {new Date(cert.completionDate).toLocaleDateString()}
                          </p>
                          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.7rem', borderTop: '1px solid #F1F5F9' }}>
                            <span style={{ fontSize: '0.65rem', color: '#CBD5E1', fontWeight: 700 }}>{cert.certificateNumber}</span>
                            <span style={{ fontSize: '0.95rem', color: '#7A1F2B', fontWeight: 950 }}>→</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '8rem 2rem', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0' }}>
                  <Icon name="award" size={40} color="#CBD5E1" />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#111', margin: '1.5rem 0 0.5rem' }}>No Credentials Found</h3>
                  <p style={{ color: '#64748B', fontWeight: 500, maxWidth: '360px', margin: '0 auto' }}>Complete evaluations to unlock professional certificates verified by the board.</p>
                </div>
              )}
            </motion.div>

          ) : (
          /* ── CERTIFICATE PREVIEW - rendered inside content area, sidebar stays visible ── */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Action bar - Back · title · Full Screen · Download */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                gap: '0.75rem',
              }}>
                {/* Back */}
                <button
                  onClick={closePreview}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0,
                    background: '#111', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '8px 16px',
                    fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  <Icon name="chevronLeft" size={16} />
                  Back
                </button>

                {/* Title */}
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedCert.courseTitle}
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {selectedCert.certificateNumber}
                  </div>
                </div>

                {/* Full Screen + Download */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={handleToggleFullscreen}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#fff', color: '#111', border: '1.5px solid #E2E8F0',
                      borderRadius: '10px', padding: '8px 14px',
                      fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon name={isFullscreen ? 'minimize' : 'maximize'} size={14} />
                    {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#7A1F2B', color: '#fff', border: 'none',
                      borderRadius: '10px', padding: '8px 14px',
                      fontSize: '0.78rem', fontWeight: 800, cursor: isDownloading ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap', opacity: isDownloading ? 0.7 : 1,
                    }}
                  >
                    <Icon name="download" size={14} />
                    {isDownloading ? 'Saving…' : 'Download'}
                  </button>
                </div>
              </div>

              {/* Certificate - landscape A4 ratio, fits the content area width */}
              <div
                ref={certificateRef}
                style={{
                  width: '100%',
                  maxWidth: '860px',
                  aspectRatio: '1.414 / 1',
                  margin: '0 auto',
                  background: '#fff',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.09)',
                  border: '1px solid #E2E8F0',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '2.5% 3%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {/* Decorative inner borders */}
                <div style={{ position: 'absolute', inset: '10px', border: '1.5px solid rgba(122,31,43,0.07)', borderRadius: '13px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: '17px', border: '1px solid rgba(122,31,43,0.04)', borderRadius: '9px', pointerEvents: 'none' }} />

                {/* Logo - top left */}
                <div style={{ position: 'absolute', top: '3.5%', left: '3.5%', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: 26, height: 26, background: '#7A1F2B', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon name="zap" size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 'clamp(0.6rem,1.1vw,0.82rem)', fontWeight: 950, color: '#111', lineHeight: 1 }}>Startup India</div>
                    <div style={{ fontSize: 'clamp(0.4rem,0.7vw,0.52rem)', fontWeight: 800, color: '#7A1F2B', letterSpacing: '0.12em' }}>Incubation</div>
                  </div>
                </div>

                {/* Award seal */}
                <div style={{ width: 'clamp(44px,7%,68px)', height: 'clamp(44px,7%,68px)', background: '#fff', border: '4px solid #7A1F2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A1F2B', marginBottom: '2%', boxShadow: '0 10px 28px rgba(122,31,43,0.12)', position: 'relative', flexShrink: 0 }}>
                  <Icon name="award" size={28} />
                  <div style={{ position: 'absolute', inset: '-7px', border: '1px dashed rgba(122,31,43,0.4)', borderRadius: '50%' }} />
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: '-13px', borderRadius: '50%', border: '2px solid rgba(122,31,43,0.3)' }}
                  />
                </div>

                <span style={{ fontSize: 'clamp(0.38rem,0.8vw,0.56rem)', fontWeight: 950, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.36em', marginBottom: '1.5%', display: 'block' }}>
                  Official Certificate of Completion
                </span>

                <div style={{ marginBottom: '1.5%' }}>
                  <p style={{ fontSize: 'clamp(0.46rem,0.9vw,0.64rem)', color: '#64748B', fontWeight: 600, margin: '0 0 0.5%' }}>
                    This credential is hereby granted to
                  </p>
                  <h2 style={{ fontSize: 'clamp(0.85rem,2.2vw,1.45rem)', fontWeight: 950, color: '#111', margin: '0 0 0.5%', letterSpacing: '-0.03em' }}>
                    {selectedCert.userName}
                  </h2>
                  <p style={{ fontSize: 'clamp(0.46rem,0.9vw,0.64rem)', color: '#64748B', fontWeight: 600, margin: '0 auto' }}>
                    For demonstrated competence in
                  </p>
                  <div style={{ marginTop: '0.8%', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 10px', borderRadius: '999px', background: '#F8FAFC', color: '#7A1F2B', fontSize: 'clamp(0.38rem,0.7vw,0.54rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <Icon name="target" size={9} /> {selectedCert.batchName}
                  </div>
                </div>

                <h3 style={{ fontSize: 'clamp(0.65rem,1.6vw,1.1rem)', fontWeight: 950, color: '#7A1F2B', margin: '0 0 1.8%', letterSpacing: '-0.02em', maxWidth: '70%' }}>
                  {selectedCert.courseTitle}
                </h3>

                {selectedCert.directorsNote && (
                  <div style={{ maxWidth: '72%', width: '100%', margin: '0 auto 1.8%', padding: '1.2% 2%', border: '1px solid rgba(122,31,43,0.12)', background: 'linear-gradient(to bottom right,#F8FAFC,#fff)', textAlign: 'left', borderRadius: '10px', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: '-7px', left: '14px', background: '#7A1F2B', color: '#fff', padding: '1px 8px', borderRadius: '99px', fontSize: 'clamp(0.32rem,0.6vw,0.44rem)', fontWeight: 950, letterSpacing: '0.1em' }}>COMMENDATION</div>
                    <p style={{ fontSize: 'clamp(0.42rem,0.82vw,0.6rem)', color: '#334155', lineHeight: 1.5, fontStyle: 'italic', margin: '0.4% 0 0', fontWeight: 500 }}>
                      "{selectedCert.directorsNote}"
                    </p>
                  </div>
                )}

                {/* Signatures */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2%', width: '82%', borderTop: '1.5px solid #F1F5F9', paddingTop: '1.5%', flexShrink: 0 }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: 'clamp(0.62rem,1.3vw,0.95rem)', color: '#111', height: '1.4em', display: 'flex', alignItems: 'flex-end', marginBottom: '2px' }}>Faizan Mohammed</div>
                    <div style={{ width: '100%', height: '0.5px', background: '#E2E8F0', marginBottom: '2px' }} />
                    <div style={{ fontSize: 'clamp(0.38rem,0.72vw,0.52rem)', fontWeight: 950, color: '#111' }}>Faizan Mohammed</div>
                    <div style={{ fontSize: 'clamp(0.32rem,0.62vw,0.44rem)', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Managing Director</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: 42, height: 42, border: '2px double #7A1F2B', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7A1F2B', gap: '1px' }}>
                      <div style={{ fontSize: '0.26rem', fontWeight: 950, letterSpacing: '0.08em' }}>VERIFIED</div>
                      <Icon name="shield" size={9} />
                      <div style={{ fontSize: '0.26rem', fontWeight: 950 }}>BOARD</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: 'clamp(0.62rem,1.3vw,0.95rem)', color: '#111', height: '1.4em', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: '2px' }}>Jaswanth Reddy</div>
                    <div style={{ width: '100%', height: '0.5px', background: '#E2E8F0', marginBottom: '2px' }} />
                    <div style={{ fontSize: 'clamp(0.38rem,0.72vw,0.52rem)', fontWeight: 950, color: '#111' }}>Jaswanth Reddy</div>
                    <div style={{ fontSize: 'clamp(0.32rem,0.62vw,0.44rem)', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Head</div>
                  </div>
                </div>

                {/* QR - bottom right */}
                <div style={{ position: 'absolute', bottom: '3%', right: '3.5%', textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(0.3rem,0.6vw,0.44rem)', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '3px' }}>Verified</div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=44x44&data=https://verify.startupindia.com/c/${selectedCert.certificateNumber}`}
                    alt="QR"
                    style={{ padding: '3px', background: '#fff', border: '1px solid #F1F5F9', borderRadius: '5px', display: 'block' }}
                  />
                </div>

                {/* Issue date - bottom left */}
                <div style={{ position: 'absolute', bottom: '3%', left: '3.5%', textAlign: 'left' }}>
                  <div style={{ fontSize: 'clamp(0.3rem,0.6vw,0.44rem)', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Date of Issue</div>
                  <div style={{ fontSize: 'clamp(0.36rem,0.7vw,0.52rem)', fontWeight: 900, color: '#111' }}>
                    {new Date(selectedCert.completionDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
