'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion } from 'framer-motion';

export default function AchievementsHub() {
  const [stats, setStats] = useState({ certs: 0, badges: 0, rank: '---', pts: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [certRes, badgeRes, leaderRes] = await Promise.all([
          fetch('/api/v1/achievements/certificates'),
          fetch('/api/v1/achievements/badges'),
          fetch('/api/v1/achievements/leaderboard/monthly')
        ]);
        
        const certJson = await certRes.json();
        const badgeJson = await badgeRes.json();
        const leaderJson = await leaderRes.json();
        
        setStats({
          certs: certJson.success ? certJson.data.length : 3,
          badges: badgeJson.success ? badgeJson.data.length : 12,
          rank: 'Top 5%',
          pts: 2450 // Mock points for hub
        });
      } catch (err) {
        console.error('Failed to fetch hub stats:', err);
        // Set some dummy data if API fails to show design
        setStats({ certs: 3, badges: 12, rank: 'Top 5%', pts: 2450 });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem' }}>
      <header className="platform-page-header" style={{ marginBottom: '3rem' }}>
        <h1 className="platform-page-title" style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em' }}>Founder Achievements</h1>
        <p className="platform-page-subtitle" style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>Your verified record of excellence, milestones, and ecosystem standing.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
        <StatCard label="Verified Credentials" value={stats.certs} icon="award" color="#7A1F2B" sub="Ready for LinkedIn" />
        <StatCard label="Achievement Badges" value={stats.badges} icon="zap" color="#F59E0B" sub="Strategic Milestones" />
        <StatCard label="Ecosystem Points" value={stats.pts} icon="target" color="#059669" sub={stats.rank} />
      </div>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem' }}>
        <HubActionCard 
          title="Certification Vault" 
          desc="Access your high-resolution professional certificates for completed courses and formal exams. Verified by the Board of Evaluators."
          icon="award"
          href="/dashboard/achievements/certificates"
          stats={`${stats.certs} Credentials`}
          color="#7A1F2B"
          img="https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600"
        />
        <HubActionCard 
          title="Achievement Badges" 
          desc="Your collection of unique digital honors earned through specific platform milestones, high-accuracy sprints, and community contributions."
          icon="zap"
          href="/dashboard/achievements/badges"
          stats={`${stats.badges} Unlocked`}
          color="#F59E0B"
          img="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600"
        />
        <HubActionCard 
          title="Global Leaderboard" 
          desc="Real-time ecosystem rankings. Measure your building velocity and strategic performance against the top 1% of founders in the network."
          icon="trendingUp"
          href="/dashboard/achievements/leaderboard"
          stats="View Rankings"
          color="#059669"
          img="https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=600"
        />
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '20px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={28} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#111', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: color, marginTop: '4px' }}>{sub}</div>
      </div>
    </div>
  );
}

function HubActionCard({ title, desc, icon, href, stats, color, img }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div 
        whileHover={{ y: -12 }}
        style={{ 
          height: '480px', background: '#fff', borderRadius: '40px', border: '1px solid #F1F5F9', 
          overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer',
          boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #fff, transparent)` }} />
          <div style={{ position: 'absolute', bottom: '24px', left: '32px', background: '#fff', padding: '8px 18px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 950, color: color, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            {stats}
          </div>
        </div>
        <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
            <div style={{ color: color }}>
              <Icon name={icon} size={28} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: '#111', margin: 0 }}>{title}</h3>
          </div>
          <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{desc}</p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', color: color, fontWeight: 950, fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            EXPLORE MODULE <Icon name="chevronRight" size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
