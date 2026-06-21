'use client';
import EcoCategoryPage from '@/components/EcoCategoryPage';

const CONFIG = {
  category: 'coworking',
  label: 'Co-Working',
  accent: '#a855f7',
  bg: 'rgba(168,85,247,0.12)',
  border: 'rgba(168,85,247,0.22)',
  gradient: 'radial-gradient(circle, rgba(168,85,247,0.75) 0%, transparent 70%)',
  heroTitle: 'Co-Working',
  heroSub: 'State-of-the-art shared workspaces, innovation labs, and maker spaces — designed for founders, teams, and creators who build together.',
  ctaText: 'Book a Space',
  ctaHref: '/programs',
  stats: [{ num: '25+', label: 'Spaces' }, { num: '5000+', label: 'Seats' }, { num: '10+', label: 'Cities' }],
  svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
    </svg>
  ),
};

export default function CoworkingPage() {
  return <EcoCategoryPage config={CONFIG} />;
}
