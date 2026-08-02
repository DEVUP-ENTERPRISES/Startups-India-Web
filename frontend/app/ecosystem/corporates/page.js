'use client';
import EcoCategoryPage from '@/components/ecosystem/EcoCategoryPage';

const CONFIG = {
  category: 'corporate',
  label: 'Corporates',
  accent: '#6366f1',
  bg: 'rgba(99,102,241,0.12)',
  border: 'rgba(99,102,241,0.22)',
  gradient: 'radial-gradient(circle, rgba(99,102,241,0.75) 0%, transparent 70%)',
  heroTitle: 'Corporates',
  heroSub: 'Leading enterprises driving open innovation, corporate accelerators, and strategic partnerships with the startup ecosystem.',
  ctaText: 'Partner With Us',
  ctaHref: '/about',
  stats: [{ num: '50+', label: 'Corporates' }, { num: '20+', label: 'Programs' }, { num: '300+', label: 'Collaborations' }],
  svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
    </svg>
  ),
};

export default function CorporatesPage() {
  return <EcoCategoryPage config={CONFIG} />;
}
