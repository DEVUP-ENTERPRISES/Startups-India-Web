'use client';
import EcoCategoryPage from '@/components/ecosystem/EcoCategoryPage';

const CONFIG = {
  category: 'partner',
  label: 'Partners',
  accent: '#10b981',
  bg: 'rgba(16,185,129,0.12)',
  border: 'rgba(16,185,129,0.22)',
  gradient: 'radial-gradient(circle, rgba(16,185,129,0.75) 0%, transparent 70%)',
  heroTitle: 'Partners',
  heroSub: 'Our strategic allies - technology providers, service partners, and ecosystem enablers who amplify the impact of every startup we support.',
  ctaText: 'Become a Partner',
  ctaHref: '/about',
  stats: [{ num: '80+', label: 'Partners' }, { num: '15+', label: 'Countries' }, { num: '5x', label: 'Growth Impact' }],
  svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
    </svg>
  ),
};

export default function PartnersPage() {
  return <EcoCategoryPage config={CONFIG} />;
}
