'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, TrendingUp, Users, Star, Lock, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Building2, Send
} from 'lucide-react';
import { getInvestorDashboard } from '@/lib/investors';

function InvestorDashboardContent() {
  const searchParams = useSearchParams();
  const activeTabState = searchParams.get('tab') || 'dashboard';

  // Data States
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Support Form State
  const [supportTicket, setSupportTicket] = useState({ subject: '', category: 'general', message: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Load Investor Dashboard Data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const { data: dashRes } = await getInvestorDashboard();
        if (dashRes && isMounted) {
          setDashboardData(dashRes);
        }
      } catch (err) {
        console.error('Failed to load investor dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportTicket.subject || !supportTicket.message) {
      return;
    }
    setSupportSubmitting(true);
    setTimeout(() => {
      setSupportSubmitting(false);
      setSupportSuccess(true);
      setSupportTicket({ subject: '', category: 'general', message: '' });
      setTimeout(() => setSupportSuccess(false), 5000);
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading dashboard statistics...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const profileData = dashboardData?.profile || {};

  return (
    <>
      {/* ── TAB 1: OVERVIEW DASHBOARD ─────────────────────────────────── */}
      {activeTabState === 'dashboard' && (
        <div className="investor-tab-body">
          {/* Hero Banner */}
          <div className="investor-hero-card">
            <div style={{ flex: 1, zIndex: 2 }}>
              <span className="investor-hero-badge">
                <ShieldCheck size={13} /> VERIFIED INVESTOR
              </span>
              <h2 className="investor-hero-title">Welcome back, {profileData.fullName?.split(' ')[0] || 'Investor'}!</h2>
              <p className="investor-hero-text">
                Your investor profile is active on the Startups India ecosystem. Founders across Tier 1, 2 & 3 cities can discover your investment focus.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Link href="/dashboard/investor/profile" className="investor-btn-primary">
                  Edit Investor Profile <ArrowRight size={15} />
                </Link>
                <Link href="/investors" className="investor-btn-secondary">
                  View Public Card <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="investor-metrics-grid">
            <div className="investor-metric-card">
              <div className="investor-metric-header">
                <Briefcase size={18} color="#dc2626" />
                <span className="investor-metric-label">PORTFOLIO</span>
              </div>
              <div className="investor-metric-value">{stats.portfolioCount ?? 0}</div>
              <div className="investor-metric-sub">Active venture investments</div>
            </div>

            <div className="investor-metric-card">
              <div className="investor-metric-header">
                <TrendingUp size={18} color="#2563eb" />
                <span className="investor-metric-label">TOTAL DEPLOYED</span>
              </div>
              <div className="investor-metric-value" style={{ color: '#2563eb' }}>{stats.totalInvestments ?? 0}</div>
              <div className="investor-metric-sub">Cheques issued to date</div>
            </div>

            <div className="investor-metric-card">
              <div className="investor-metric-header">
                <Users size={18} color="#16a34a" />
                <span className="investor-metric-label">STARTUPS SUPPORTED</span>
              </div>
              <div className="investor-metric-value" style={{ color: '#16a34a' }}>{stats.totalStartupsSupported ?? 0}</div>
              <div className="investor-metric-sub">Mentees & founders backed</div>
            </div>

            <div className="investor-metric-card">
              <div className="investor-metric-header">
                <Star size={18} color="#d97706" />
                <span className="investor-metric-label">RATING</span>
              </div>
              <div className="investor-metric-value" style={{ color: '#d97706' }}>
                {stats.rating ? Number(stats.rating).toFixed(1) : '5.0'}
              </div>
              <div className="investor-metric-sub">Community feedback score</div>
            </div>
          </div>

          {/* Split Content Section */}
          <div className="investor-content-grid">
            {/* Left Column: Recent Deal Flow Preview */}
            <div className="investor-panel-card">
              <div className="investor-panel-header">
                <div>
                  <h3 className="investor-panel-title">Incoming Pitch Decks & Deal Flow</h3>
                  <p className="investor-panel-sub">Founders seeking funding in your sector</p>
                </div>
                <span className="investor-coming-soon-tag">
                  <Lock size={12} /> Full Diligence Tool Coming Soon
                </span>
              </div>

              <div className="investor-deal-list">
                {[
                  { name: 'TechFlow AI', stage: 'Pre-Seed', ask: '₹50 Lakhs', sector: 'DeepTech', pitch: 'AI-driven automated supply chain logistics for Indian manufacturing.' },
                  { name: 'HealthPulse', stage: 'Seed', ask: '₹1.2 Cr', sector: 'HealthTech', pitch: 'Remote diagnostic IoT devices for rural healthcare clinics.' },
                  { name: 'EcoPack India', stage: 'Pre-Seed', ask: '₹35 Lakhs', sector: 'CleanTech', pitch: 'Biodegradable packaging solutions for quick-commerce brands.' },
                ].map((deal, idx) => (
                  <div key={idx} className="investor-deal-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div className="investor-deal-logo">{deal.name.substring(0, 2).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="investor-deal-name">{deal.name}</span>
                          <span className="investor-deal-stage">{deal.stage}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{deal.sector} · Seeking {deal.ask}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.4 }}>{deal.pitch}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button className="investor-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Review Pitch Deck
                      </button>
                      <button className="investor-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Schedule Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Investor Credentials Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="investor-panel-card">
                <h3 className="investor-panel-title">Investor Credentials</h3>
                <div className="investor-info-row">
                  <span className="investor-info-label">Investor Category:</span>
                  <span className="investor-info-value">{profileData.investorType || 'Angel Investor'}</span>
                </div>
                <div className="investor-info-row">
                  <span className="investor-info-label">Organization / Fund:</span>
                  <span className="investor-info-value">{profileData.organizationName || 'Independent Investor'}</span>
                </div>
                <div className="investor-info-row">
                  <span className="investor-info-label">Typical Ticket Size:</span>
                  <span className="investor-info-value">{profileData.ticketSize || '₹10L - ₹50L'}</span>
                </div>
                <div className="investor-info-row">
                  <span className="investor-info-label">Geography:</span>
                  <span className="investor-info-value">{profileData.geography || 'Pan-India'}</span>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <Link href="/dashboard/investor/profile" className="investor-full-btn">
                    Update Investor Profile Settings
                  </Link>
                </div>
              </div>

              <div className="investor-panel-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Building2 size={22} color="#ef4444" />
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Startups India Venture Network</h4>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Your investor profile is indexed in our verified angel database. Startups in active cohorts can request intro calls directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: HELP & SUPPORT ─────────────────────────────────────── */}
      {activeTabState === 'support' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="investor-panel-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Investor Support Desk
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
              Have questions regarding startup verification, deal flow access, or platform features? Send a ticket directly to the Incubation team.
            </p>

            {supportSuccess && (
              <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #b7eb8f', borderRadius: '12px', color: '#276749', fontSize: '13.5px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                Ticket submitted! An incubation officer will reach out within 24 hours.
              </div>
            )}

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Question about startup due diligence"
                  value={supportTicket.subject}
                  onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                <select
                  value={supportTicket.category}
                  onChange={(e) => setSupportTicket({ ...supportTicket, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px', background: '#ffffff' }}
                >
                  <option value="general">General Support</option>
                  <option value="deal-flow">Deal Flow Inquiry</option>
                  <option value="profile">Profile Verification</option>
                  <option value="technical">Technical Issue</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Message</label>
                <textarea
                  rows={5}
                  placeholder="Describe your inquiry in detail..."
                  value={supportTicket.message}
                  onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" disabled={supportSubmitting} className="investor-btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
                {supportSubmitting ? 'Sending Ticket...' : 'Submit Support Ticket'}
                {!supportSubmitting && <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function InvestorDashboardPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', padding: '40px 0', justifyContent: 'center', alignItems: 'center' }}>Loading Workspace...</div>}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
