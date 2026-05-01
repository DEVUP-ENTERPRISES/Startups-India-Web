'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';

export default function BillingPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch('/api/v1/payments/billing');
        const json = await res.json();
        if (json.success) setHistory(json.data);
      } catch (err) {
        console.error('Failed to fetch billing history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBilling();
  }, []);

  const totalInvested = history.reduce((sum, item) => sum + (item.amount || 0), 0);
  const lastPayment = history.length > 0 ? history[0] : null;

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="flex overflow-hidden justify-center" style={{ minHeight: '100vh', background: 'var(--dashboard-bg)', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* ── MAIN CONTENT ── */}
      <main style={{ width: '100%', maxWidth: '1200px', background: 'var(--dashboard-bg)', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }} className="custom-scrollbar">
        
        {/* HEADER */}
        <header style={{ padding: '2.5rem 4rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Purchase and Billing History</h2>
            <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 750 }}>Review your investment in your startup journey.</p>
          </div>
          <button style={{ background: 'var(--dashboard-bg)', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 950, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} className="hover-red-border">
            <Icon name="download" size={14} /> EXPORT ALL
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <div style={{ padding: '0 4rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: '#fef2f2', padding: '1.75rem', borderRadius: '28px', border: '1px solid #fee2e2', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.05)' }}>
               <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#ef4444', letterSpacing: '0.1em', marginBottom: '10px' }}>TOTAL INVESTED</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a' }}>₹{totalInvested.toLocaleString()}</div>
               <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ background: '#ef4444', height: '6px', width: '40px', borderRadius: '3px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ef4444', opacity: 0.8 }}>{history.length} lifetime transactions</span>
               </div>
            </div>
            <div style={{ background: 'var(--dashboard-bg)', padding: '1.75rem', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '10px' }}>LAST PAYMENT</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a' }}>₹{lastPayment?.amount?.toLocaleString() || '0'}</div>
               <div style={{ marginTop: '12px', fontSize: '0.7rem', color: '#10b981', fontWeight: 900 }}>{lastPayment ? `Successfully paid on ${new Date(lastPayment.createdAt).toLocaleDateString()}` : 'No payments yet'}</div>
            </div>
            <div style={{ background: '#fef2f2', padding: '1.75rem', borderRadius: '28px', border: '1px solid #fee2e2' }}>
               <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#ef4444', letterSpacing: '0.1em', marginBottom: '10px' }}>PAYMENT METHOD</div>
               <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="creditCard" size={20} color="#ef4444" /> Razorpay / Stripe
               </div>
               <button style={{ marginTop: '14px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 950, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>EDIT METHOD</button>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div style={{ padding: '0 4rem 5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 950, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon name="list" size={18} color="#ef4444" /> Past History
           </h3>
          <div style={{ background: 'var(--dashboard-bg)', borderRadius: '32px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f1f5f9' }}>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>TRANSACTION ID</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>DATE</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>ITEM</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>AMOUNT</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>STATUS</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em', textAlign: 'right' }}>ACTION</th>
                  </tr>
               </thead>
               <tbody>
                  {history.map((t, i) => (
                    <tr key={t._id} style={{ borderBottom: i === history.length - 1 ? 'none' : '1px solid #f8fafc' }} className="table-row">
                       <td style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontWeight: 900, color: '#ef4444' }}>{t.paymentIntentId || t._id.slice(-8).toUpperCase()}</td>
                       <td style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontWeight: 750, color: '#64748b' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                       <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#0f172a' }}>{t.courseId?.title || 'Platform Service'}</div>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, marginTop: '4px' }}>Digital Investment</div>
                       </td>
                       <td style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: 950, color: '#0f172a' }}>₹{t.amount?.toLocaleString()}</td>
                       <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ 
                            background: t.status === 'succeeded' ? '#f0fdf4' : '#fef2f2', 
                            color: t.status === 'succeeded' ? '#10b981' : '#ef4444', 
                            padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 950 
                          }}>{t.status.toUpperCase()}</span>
                       </td>
                       <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                          <button style={{ background: 'transparent', border: '1.5px solid #f1f5f9', padding: '8px', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }} className="hover-red-bg">
                             <Icon name="fileText" size={16} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>

          {/* NEED HELP SECTION */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem', borderRadius: '28px', background: 'var(--dashboard-bg)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '18px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="lifeBuoy" size={28} />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#0f172a' }}>Billing Questions?</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800 }}>Our finance team is available 24/7 to resolve discrepancies.</p>
                </div>
            </div>
            <button style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '0.8rem', fontWeight: 950, cursor: 'pointer' }}>CONTACT SUPPORT</button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .table-row:hover { background: #fdfdfd; }
        .hover-red-border:hover { border-color: #ef4444 !important; color: #ef4444 !important; }
        .hover-red-bg:hover { background: #fef2f2 !important; border-color: #fef2f2 !important; color: #ef4444 !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

