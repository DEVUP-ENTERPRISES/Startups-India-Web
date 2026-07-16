'use client';
import EcoCategoryPage from '@/components/EcoCategoryPage';

const CONFIG = {
  category: 'academia',
  label: 'Academia',
  accent: '#f59e0b',
  bg: 'rgba(245,158,11,0.12)',
  border: 'rgba(245,158,11,0.22)',
  gradient: 'radial-gradient(circle, rgba(245,158,11,0.75) 0%, transparent 70%)',
  heroTitle: 'Academia',
  heroSub: 'Universities, research institutions, and academic innovation hubs collaborating with startups to translate cutting-edge research into market-ready solutions.',
  ctaText: 'Explore Programs',
  ctaHref: '/programs',
  stats: [{ num: '40+', label: 'Institutions' }, { num: '100+', label: 'Research Projects' }, { num: '60+', label: 'Collaborations' }],
  svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 0 2.5 2 6 2s6-2 6-2v-5"/>
    </svg>
  ),
};

export default function AcademiaPage() {
  return <EcoCategoryPage config={CONFIG} />;
}
