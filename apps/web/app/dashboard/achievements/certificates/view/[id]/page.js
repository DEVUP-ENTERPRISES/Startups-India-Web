'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

export default function CertificateViewPage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // We fetch by certificate number
        const res = await fetch(`/api/v1/achievements/certificates`);
        const json = await res.json();
        const found = json.data?.find(c => c.certificateNumber === id || c._id === id);
        if (found) {
          setCert(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  if (!cert) return (
    <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
       <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Certificate Not Found</h2>
       <p style={{ color: '#64748b', marginTop: '1rem' }}>The requested credential could not be located in our secure vault.</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '4rem 2rem',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ 
        aspectRatio: '1.414/1', 
        width: '100%',
        maxWidth: '1100px',
        background: '#fff',
        borderRadius: '0',
        boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
        position: 'relative',
        padding: '5rem',
        border: '24px solid #0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
         <div style={{ position: 'absolute', inset: '10px', border: '1px solid #ef444433', pointerEvents: 'none' }} />
         
         <img src="/assets/images/logo.png" alt="Logo" style={{ width: '180px', marginBottom: '3rem' }} />
         <h3 style={{ fontSize: '1rem', fontWeight: 950, color: '#ef4444', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '3rem' }}>Certificate of Excellence</h3>
         
         <p style={{ fontSize: '1.25rem', color: '#64748b', margin: '0 0 2rem', fontWeight: 600 }}>This is to certify that</p>
         <h2 style={{ fontSize: '4.5rem', fontWeight: 950, color: '#0f172a', margin: '0 0 2rem', textDecoration: 'underline', textDecorationColor: 'rgba(239,68,68,0.2)', textUnderlineOffset: '12px' }}>{cert.userName}</h2>
         <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '750px', lineHeight: 1.8, fontWeight: 600 }}>Has successfully completed the comprehensive training program and met all validation criteria for</p>
         <h4 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#ef4444', margin: '2rem 0 5rem', letterSpacing: '-0.02em' }}>{cert.courseTitle}</h4>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', borderTop: '2px solid #f8fafc', paddingTop: '4rem' }}>
            <div style={{ textAlign: 'left' }}>
               <div style={{ fontWeight: 950, fontSize: '1.1rem', color: '#0f172a' }}>Faizan Mohammed</div>
               <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>Managing Director</div>
            </div>
            <div style={{ textAlign: 'center' }}>
               <div style={{ width: '110px', height: '110px', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
                  <Icon name="award" size={48} />
               </div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontWeight: 950, fontSize: '1.1rem', color: '#0f172a' }}>{new Date(cert.completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
               <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>Issue Date</div>
            </div>
         </div>

         {/* Print Button - only visible on screen */}
         <button 
           onClick={() => window.print()}
           style={{ 
             position: 'absolute', top: '-80px', right: 0,
             background: '#0f172a', color: '#fff', border: 'none', 
             padding: '16px 32px', borderRadius: '16px', fontWeight: 900, cursor: 'pointer',
             boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
             display: 'flex', alignItems: 'center', gap: '12px'
           }}
           className="no-print"
         >
           <Icon name="download" size={18} /> PRINT CREDENTIAL
         </button>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; padding: 0 !important; }
          .dashboard-sidebar, .mobile-nav-header { display: none !important; }
          .dashboard-main { padding: 0 !important; margin: 0 !important; }
          .dashboard-content { padding: 0 !important; }
          .platform-page { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
