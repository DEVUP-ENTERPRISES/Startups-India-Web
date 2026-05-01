'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await fetch('/api/v1/payments/subscriptions');
        const json = await res.json();
        if (json.success) setSubscriptions(json.data);
      } catch (err) {
        console.error('Failed to fetch subscriptions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, []);

  const activeSub = subscriptions.find(s => s.status === 'active');

  const tiers = [
    { 
      name: 'Founder Base', 
      price: 'Free', 
      features: ['LMS Course Access', 'Community Discussions', 'Basic Assessments'],
      isCurrent: !activeSub,
      accent: '#94a3b8'
    },
    { 
      name: 'StartUp Pro', 
      price: '₹2,499/mo', 
      features: ['Priority Mentorship', 'Live Expert Sessions', 'Premium Resources', 'Advanced Certifications'],
      isPopular: true,
      isCurrent: activeSub && activeSub.planId?.name?.includes('Pro'),
      accent: '#ef4444'
    },
    { 
      name: 'Elite Scaler', 
      price: '₹9,999/mo', 
      features: ['1-on-1 VC Training', 'Investor Matchmaking', 'Dedicated Scaling Partner', 'Unlimited Seat Licensing'],
      isCurrent: activeSub && activeSub.planId?.name?.includes('Elite'),
      accent: '#1e293b'
    }
  ];

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page">
      
      {/* ── HEADER ── */}
      <header className="platform-page-header" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="platform-page-title">Subscriptions</h1>
          <p className="platform-page-subtitle">Manage your premium access and billing cycle.</p>
        </div>
      </header>

      {/* ── PRICING TIERS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {tiers.map((tier) => (
            <div key={tier.name} className="glass-card" style={{ 
                background: 'var(--dashboard-bg)', borderRadius: '40px', padding: '3rem', 
                border: '1.5px solid', borderColor: tier.isPopular ? '#ef4444' : 'rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', position: 'relative',
                boxShadow: tier.isPopular ? '0 25px 60px rgba(239, 68, 68, 0.1)' : '0 10px 30px rgba(0,0,0,0.03)',
                transition: '0.3s'
            }}>
                {tier.isPopular && (
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 950, padding: '6px 14px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>BEST VALUE</div>
                )}
                <h4 style={{ fontSize: '1.2rem', fontWeight: 950, color: tier.accent, marginBottom: '8px' }}>{tier.name}</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a' }}>{tier.price}</span>
                    {tier.price !== 'Free' && <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8' }}>/ mo</span>}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '3rem' }}>
                    {tier.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Icon name="check" size={16} color={tier.accent === '#ef4444' ? '#ef4444' : '#10b981'} stroke={4} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{f}</span>
                      </div>
                    ))}
                </div>

                <Link href={tier.isCurrent ? '#' : '/checkout'} style={{ textDecoration: 'none' }}>
                  <button 
                    disabled={tier.isCurrent}
                    style={{ 
                      width: '100%', padding: '16px', borderRadius: '18px', border: 'none',
                      background: tier.isCurrent ? '#f1f5f9' : (tier.name === 'Elite Scaler' ? '#1e293b' : '#ef4444'),
                      color: tier.isCurrent ? '#94a3b8' : '#fff',
                      fontSize: '0.9rem', fontWeight: 950, cursor: tier.isCurrent ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: !tier.isCurrent ? '0 10px 20px rgba(0,0,0,0.05)' : 'none'
                  }}>
                    {tier.isCurrent ? 'CURRENT PLAN' : 'UPGRADE NOW'}
                  </button>
                </Link>
            </div>
          ))}
      </div>

      <style jsx global>{`
        .glass-card:hover { transform: translateY(-5px); border-color: #ef444433; }
        .platform-page { padding: 2rem 4rem 10rem; }
        .platform-page-title { font-size: 2.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .platform-page-subtitle { color: #94a3b8; font-weight: 750; margin-top: 8px; }
      `}</style>
    </div>
  );
}

