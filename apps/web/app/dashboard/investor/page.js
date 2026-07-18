'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, Users, Star, AlertCircle, ArrowRight } from 'lucide-react';
import { getInvestorDashboard } from '@/lib/investors';

const card = { padding: '22px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '18px' };

function Skeleton() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: '92px', borderRadius: '16px', background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'iShim 1.4s infinite' }} />
        ))}
      </div>
      <style>{`@keyframes iShim{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function StatTile({ icon, label, value, tone = '#111827' }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#9ca3af' }}>
        {icon}<span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px' }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: tone, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

export default function InvestorDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: res, error: err } = await getInvestorDashboard();
      if (err) { setError(err.message || 'Could not load your investor dashboard.'); return; }
      setData(res);
    })();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Investor profile not ready</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, margin: '0 0 20px' }}>{error}</p>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>If your application was only just approved, try signing out and back in.</p>
      </div>
    );
  }

  if (!data) return <Skeleton />;
  const { profile = {}, stats = {} } = data;

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '100px', fontSize: '11.5px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Investor</div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Welcome back{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}
        </h1>
        <p style={{ margin: 0, fontSize: '14.5px', color: '#6b7280' }}>
          {profile.investorType ? `${profile.investorType} investor` : 'Your investor overview'}
          {profile.organizationName ? ` · ${profile.organizationName}` : ''}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '18px' }}>
        <StatTile icon={<Briefcase size={15} />} label="Portfolio" value={stats.portfolioCount ?? 0} />
        <StatTile icon={<TrendingUp size={15} />} label="Investments" value={stats.totalInvestments ?? 0} tone="#1d4ed8" />
        <StatTile icon={<Users size={15} />} label="Startups Supported" value={stats.totalStartupsSupported ?? 0} />
        <StatTile icon={<Star size={15} />} label="Rating" value={stats.rating ? Number(stats.rating).toFixed(1) : '—'} tone="#b45309" />
      </div>

      <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Your public profile</h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280' }}>Keep your focus areas and bio up to date so founders can find you.</p>
        </div>
        <Link href="/dashboard/investor/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '11px', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none' }}>
          Edit profile <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
