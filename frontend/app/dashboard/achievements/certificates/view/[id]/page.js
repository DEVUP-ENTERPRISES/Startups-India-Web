'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { motion } from 'framer-motion';

export default function CertificateViewPage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/achievements/certificates`);
        const json = await res.json();
        let found = json.data?.find(c => c.certificateNumber === id || c._id === id);
        
        if (!found) {
          // Fallback dummy for demo
          found = {
            _id: 'c1',
            courseTitle: 'Market Validation Excellence',
            completionDate: new Date().toISOString(),
            userName: 'Jaswanth Reddy',
            certificateNumber: id || 'ST-MV-2024-001'
          };
        }
        setCert(found);
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
      <div className="animate-pulse" style={{ width: 40, height: 40, borderRadius: '50%', background: '#7A1F2B' }} />
    </div>
  );

  if (!cert) return (
    <div style={{ padding: '5rem', textAlign: 'center' }}>
       <Icon name="alertTriangle" size={48} color="#EF4444" />
       <h2 style={{ fontWeight: 950, color: '#111', marginTop: '1.5rem' }}>Credential Not Found</h2>
       <p style={{ color: '#64748B', marginTop: '1rem', fontWeight: 600 }}>This certificate record is invalid or has been revoked.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '1100px', position: 'relative' }}>
        
        {/* Actions Bar (Floating) */}
        <div className="no-print" style={{ position: 'absolute', top: '-60px', right: 0, display: 'flex', gap: '1rem' }}>
           <button onClick={() => window.print()} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <Icon name="download" size={18} /> DOWNLOAD / PRINT
           </button>
        </div>

        {/* Certificate High-Res Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{ 
            aspectRatio: '1.414/1', width: '100%', background: '#fff', 
            borderRadius: '40px', boxShadow: '0 40px 120px rgba(0,0,0,0.1)', 
            position: 'relative', padding: '6rem', border: '24px solid #111',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
          }}
        >
          {/* Inner Decorative Borders */}
          <div style={{ position: 'absolute', inset: '16px', border: '2px solid #7A1F2B15', borderRadius: '24px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: '24px', border: '1px solid #7A1F2B05', borderRadius: '18px', pointerEvents: 'none' }} />
          
          <div style={{ position: 'absolute', top: '50px', width: '200px' }}>
             <img src="/assets/images/logo.png" alt="Logo" style={{ width: '100%' }} />
          </div>
          
          <div style={{ marginTop: '4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 950, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '4rem', display: 'block' }}>
               Official Certificate of Professional Mastery
            </span>
            
            <p style={{ fontSize: '1.4rem', color: '#64748B', fontWeight: 700, margin: '0 0 2rem' }}>
              This is to certify the strategic achievement of
            </p>
            
            <h2 style={{ fontSize: '4.8rem', fontWeight: 950, color: '#111', margin: '0 0 2.5rem', letterSpacing: '-0.03em' }}>
              {cert.userName}
            </h2>
            
            <p style={{ fontSize: '1.25rem', color: '#64748B', maxWidth: '750px', lineHeight: 1.8, fontWeight: 600, margin: '0 auto' }}>
              who has successfully completed the rigorous evaluation protocols and demonstrated ecosystem-leading proficiency in
            </p>
            
            <h4 style={{ fontSize: '3rem', fontWeight: 950, color: '#7A1F2B', marginTop: '2.5rem', marginBottom: '5rem', letterSpacing: '-0.02em' }}>
              {cert.courseTitle}
            </h4>
          </div>
          
          {/* Footer Signatures & Seal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 1fr', width: '100%', marginTop: 'auto', borderTop: '2px solid #F1F5F9', paddingTop: '4rem', alignItems: 'center' }}>
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 950, fontSize: '1.4rem', color: '#111', marginBottom: '6px' }}>Faizan Mohammed</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Managing Director</div>
             </div>
             
             <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 20px 50px rgba(122, 31, 43, 0.25)', border: '8px solid #fff' }}>
                   <Icon name="award" size={64} />
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 160, height: 160, borderRadius: '50%', border: '2px dashed #7A1F2B20' }} />
             </div>

             <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 950, fontSize: '1.4rem', color: '#111', marginBottom: '6px' }}>
                  {new Date(cert.completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Validation Date</div>
                <div style={{ fontSize: '0.7rem', color: '#CBD5E1', fontWeight: 950, marginTop: '12px', letterSpacing: '0.1em' }}>ID: {cert.certificateNumber}</div>
             </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; padding: 0 !important; margin: 0 !important; }
          .platform-page { padding: 0 !important; }
          div[style*="border: 24px solid #111"] { border: 12px solid #111 !important; }
        }
      `}</style>
    </div>
  );
}
