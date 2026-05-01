'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';

export default function PaymentsPage() {
  const [tab, setTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [billing, setBilling] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [purchasesRes, billingRes, subscriptionsRes] = await Promise.all([
        fetch('/api/v1/payments/purchases'),
        fetch('/api/v1/payments/billing'),
        fetch('/api/v1/payments/subscriptions')
      ]);

      const [pJson, bJson, sJson] = await Promise.all([
        purchasesRes.json(),
        billingRes.json(),
        subscriptionsRes.json()
      ]);

      if (pJson.success) setPurchases(pJson.data);
      if (bJson.success) setBilling(bJson.data);
      if (sJson.success) setSubscriptions(sJson.data);
    } catch (err) {
      console.error('Failed to fetch payments data:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = billing.reduce((s, b) => s + (b.amount || 0), 0);
  const activeSubscription = subscriptions.find(s => s.status === 'active');

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page payments-view">
      
      {/* ── UNIFIED HERO HEADER ── */}
      <div className="payments-hero-header">
        <div className="header-text">
          <h1 className="header-title-main">Billing & Purchases</h1>
          <p className="header-subtitle-main">Monitor your active subscriptions, course investments, and financial history.</p>
        </div>
        <button className="settings-btn-secondary mobile-full-width">
          <Icon name="download" size={18} /> Export Records
        </button>
      </div>

      {/* Stats */}
      <div className="platform-stats-grid">
        {[
          { label:'Total Spent',    val:`₹${totalSpent.toLocaleString()}`, icon:'creditCard', bg:'#fef2f2', tc:'#ef4444', border:'#fee2e2' },
          { label:'Active Courses', val: purchases.length,  icon:'book', bg:'#fff7ed', tc:'#f97316', border:'#fed7aa' },
          { label:'Subscription',   val: activeSubscription ? 'Pro' : 'Free',   icon:'zap', bg:'#f5f3ff', tc:'#7c3aed', border:'#ddd6fe' },
          { label:'Next Billing',   val: activeSubscription ? new Date(activeSubscription.currentPeriodEnd).toLocaleDateString() : 'N/A', icon:'calendar', bg:'#eff6ff', tc:'#2563eb', border:'#bfdbfe' },
        ].map((s,i) => (
          <div key={i} className="platform-stat-card" style={{ background:s.bg, borderColor:s.border }}>
            <div className="platform-stat-label">
              {s.label}
              <div style={{ width:28, height:28, borderRadius:7, background:'rgba(255,255,255,0.7)', display:'flex', alignItems: 'center', justifyContent:'center' }}>
                <Icon name={s.icon} size={15} color={s.tc} />
              </div>
            </div>
            <span className="platform-stat-value" style={{ color:s.tc }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Pro plan banner if subscribed */}
      {activeSubscription && (
        <div className="pro-banner-card">
          <div className="pro-banner-info">
            <div className="pro-badge-group">
              <Icon name="zap" size={24} color="#fff" />
              <span className="pro-title">Startup India Pro</span>
              <span className="pro-tag">ACTIVE</span>
            </div>
            <p className="pro-subtitle">Auto-renewing: {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()} · ₹{activeSubscription.planId?.price || '4,999'} / month</p>
          </div>
          <button className="pro-manage-btn">
            Manage Subscription
          </button>
        </div>
      )}

      <div className="platform-tabs">
        <button className={`platform-tab ${tab==='purchases'?'active':''}`} onClick={()=>setTab('purchases')}>My Purchases</button>
        <button className={`platform-tab ${tab==='billing'?'active':''}`} onClick={()=>setTab('billing')}>Billing History</button>
      </div>

      {/* Purchases */}
      {tab==='purchases' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {purchases.length === 0 && (
             <div className="empty-state">No purchases found.</div>
          )}
          {purchases.map((p,i) => (
            <div key={p._id} className="platform-list-row purchase-row">
              <div className="purchase-img-wrap">
                <div className="purchase-icon-placeholder">
                  <Icon name="book" size={24} color="#fff" />
                </div>
              </div>
              <div className="purchase-info">
                <div className="purchase-head">
                  <h3 className="purchase-title">{p.courseId?.title || 'Course'}</h3>
                  <span className={`tag-pill ${p.status === 'succeeded' ? 'tag-green' : 'tag-orange'}`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div className="purchase-meta">
                  <Icon name="calendar" size={12} /> {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="purchase-amount">
                ₹{p.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Billing History */}
      {tab==='billing' && (
        <div className="billing-history-interface">
          <div className="billing-table-header">
            <span className="col-desc">Description</span>
            <span className="col-amount">Amount</span>
            <span className="col-id">Transaction ID</span>
            <span className="col-status">Status</span>
          </div>
          <div className="billing-records-viewport custom-scrollbar">
            <div className="billing-records-list">
              {billing.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No billing records found.</div>
              )}
              {billing.map((b) => (
                <div key={b._id} className="billing-record-row">
                  <div className="col-desc">
                    <div className="record-title text-truncate">{b.courseId?.title || 'Platform Service'}</div>
                    <div className="record-date"><Icon name="calendar" size={11} /> {new Date(b.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="col-amount">₹{b.amount.toLocaleString()}</div>
                  <div className="col-id">{b.paymentIntentId || b._id}</div>
                  <div className="col-status">
                    <span className={`paid-badge-pill ${b.status === 'succeeded' ? '' : 'failed'}`}>{b.status === 'succeeded' ? 'Paid' : b.status}</span>
                    <button className="btn-invoice-download">
                      <Icon name="download" size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .payments-view { padding: 1.5rem 3rem 10rem !important; max-width: 1400px; margin: 0 auto; }
        .payments-hero-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 1.5rem 0 2rem; margin-bottom: 2.5rem; border-bottom: 1px solid #f1f5f9; }
        .header-title-main { font-size: 2.8rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .header-subtitle-main { font-size: 1.15rem; color: #64748b; font-weight: 650; margin-top: 10px; }
        
        .platform-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .platform-stat-card { padding: 1.75rem; border-radius: 28px; border: 1.5px solid #f1f5f9; }
        .platform-stat-label { font-size: 0.8rem; font-weight: 900; color: #64748b; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .platform-stat-value { font-size: 1.8rem; font-weight: 950; }

        .settings-btn-secondary { padding: 14px 24px; border-radius: 16px; background: #fff; border: 1.5px solid #e2e8f0; font-size: 0.95rem; font-weight: 850; color: #1e293b; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
        .settings-btn-secondary:hover { border-color: #ef4444; color: #ef4444; }

        .pro-banner-card { background: linear-gradient(135deg, #ef4444, #f97316); border-radius: 36px; padding: 2.5rem 3rem; margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 25px 50px rgba(239, 68, 68, 0.2); border: 1px solid rgba(255,255,255,0.1); }
        .pro-badge-group { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
        .pro-title { font-weight: 950; color: #fff; font-size: 1.6rem; letter-spacing: -0.02em; }
        .pro-tag { background: rgba(255,255,255,0.2); color: #fff; border-radius: 20px; padding: 4px 14px; font-size: 0.75rem; font-weight: 950; }
        .pro-subtitle { color: rgba(255,255,255,0.9); font-weight: 700; margin: 0; font-size: 1.1rem; }
        .pro-manage-btn { background: #fff; border: none; color: #ef4444; padding: 16px 32px; border-radius: 20px; font-weight: 950; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .pro-manage-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

        .platform-tabs { display: flex; gap: 2rem; margin-bottom: 2.5rem; border-bottom: 1px solid #f1f5f9; }
        .platform-tab { padding: 1rem 0; background: transparent; border: none; font-size: 1rem; font-weight: 900; color: #64748b; cursor: pointer; position: relative; }
        .platform-tab.active { color: #ef4444; }
        .platform-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: #ef4444; border-radius: 10px; }

        .purchase-row { padding: 1.25rem 1.75rem; border-radius: 24px; border: 1.5px solid #f1f5f9; background: #fff; transition: all 0.2s; display: flex; align-items: center; gap: 1.5rem; }
        .purchase-row:hover { border-color: #ef4444; transform: translateX(4px); box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
        .purchase-img-wrap { width: 60px; height: 60px; border-radius: 16px; overflow: hidden; flex-shrink: 0; }
        .purchase-icon-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #ef4444, #f97316); display: flex; align-items: center; justify-content: center; }
        
        .purchase-info { flex: 1; min-width: 0; }
        .purchase-head { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
        .purchase-title { font-weight: 900; color: #0f172a; margin: 0; font-size: 1rem; }
        .purchase-meta { font-size: 0.8rem; color: #94a3b8; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .purchase-amount { font-weight: 950; color: #0f172a; font-size: 1.15rem; text-align: right; min-width: 100px; }

        .tag-pill { padding: 4px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 950; }
        .tag-green { background: #f0fdf4; color: #10b981; }
        .tag-orange { background: #fff7ed; color: #f97316; }

        .billing-history-interface { background: #fff; border-radius: 36px; border: 1.5px solid #f1f5f9; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .billing-table-header { display: grid; grid-template-columns: 1fr 150px 180px 180px; gap: 1rem; padding: 1.5rem 2.5rem; background: #fcfdfe; border-bottom: 1px solid #f1f5f9; }
        .billing-table-header span { font-size: 0.8rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; }
        
        .billing-records-viewport { max-height: 550px; overflow-y: auto; padding-right: 2px; }
        .billing-record-row { display: grid; grid-template-columns: 1fr 150px 180px 180px; gap: 1rem; padding: 1.75rem 2.5rem; border-bottom: 1px solid #f8fafc; align-items: center; transition: all 0.2s; }
        .billing-record-row:hover { background: #fcfdfe; }
        .record-title { font-weight: 900; color: #0f172a; font-size: 1.05rem; }
        .record-date { font-size: 0.8rem; color: #94a3b8; font-weight: 700; display: flex; align-items: center; gap: 6px; margin-top: 5px; }
        .col-amount { font-weight: 950; color: #0f172a; font-size: 1.15rem; }
        .col-id { font-size: 0.9rem; color: #64748b; font-weight: 750; font-family: monospace; }
        .col-status { display: flex; gap: 1.5rem; align-items: center; }
        .paid-badge-pill { background: #f0fdf4; color: #16a34a; border-radius: 12px; padding: 6px 16px; font-size: 0.8rem; font-weight: 950; border: 1px solid #dcfce7; }
        .paid-badge-pill.failed { background: #fef2f2; color: #ef4444; border-color: #fee2e2; }
        .btn-invoice-download { background: #fef2f2; border: 1.5px solid #fee2e2; width: 40px; height: 40px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-invoice-download:hover { background: #ef4444; }
        .btn-invoice-download:hover :global(svg) { color: #fff !important; }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; transition: background 0.2s; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }

        .text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .empty-state { padding: 3rem; text-align: center; color: #64748b; font-weight: 600; border: 1.5px dashed #f1f5f9; border-radius: 24px; }

        @media (max-width: 1060px) {
           .payments-view { padding: 6.5rem 1.25rem 8rem !important; }
           .payments-hero-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding-top: 1rem; border-bottom: none; }
           .header-title-main { font-size: 2.25rem; }
           .settings-btn-secondary.mobile-full-width { width: 100%; justify-content: center; padding: 16px; border-radius: 20px; }
           
           .platform-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
           .pro-banner-card { flex-direction: column; align-items: flex-start; gap: 2rem; padding: 2.5rem 1.5rem; border-radius: 28px; }
           .pro-manage-btn { width: 100%; padding: 18px; border-radius: 22px; }

           .purchase-row { padding: 1.5rem; gap: 1rem; border-radius: 20px; }
           .purchase-title { font-size: 0.95rem; }
           .purchase-amount { text-align: left; min-width: 0; font-size: 1.1rem; margin-top: 8px; }

           .billing-table-header { display: none; }
           .billing-record-row { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.5rem; border-radius: 24px; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
           .col-amount { font-size: 1.4rem; }
           .col-id { padding: 10px 0; border-top: 1px dashed #f1f5f9; }
           .col-status { justify-content: space-between; width: 100%; border-top: 1px solid #f1f5f9; padding-top: 1.25rem; }
           .billing-history-interface { border: none; background: transparent; box-shadow: none; border-radius: 0; }
           .billing-records-viewport { max-height: none; overflow: visible; padding-right: 0; }
        }
      `}</style>
    </div>
  );
}
