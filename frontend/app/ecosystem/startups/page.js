'use client';
import EcoCategoryPage from '@/components/ecosystem/EcoCategoryPage';

const CONFIG = {
  category: 'startup',
  label: 'Startups',
  accent: '#ef4444',
  bg: 'rgba(239,68,68,0.12)',
  border: 'rgba(239,68,68,0.22)',
  gradient: 'radial-gradient(circle, rgba(239,68,68,0.75) 0%, transparent 70%)',
  heroTitle: 'Startups',
  heroSub: 'Discover the most ambitious early-stage ventures in our ecosystem - from seed-stage ideas to high-growth companies redefining industries.',
  ctaText: 'Apply to Our Incubation Program',
  ctaHref: '/programs/incubation',
  stats: [{ num: '500+', label: 'Startups' }, { num: '12', label: 'Sectors' }, { num: '80%', label: 'Survival Rate' }],
  svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  ),
};

export default function StartupsPage() {
  return <EcoCategoryPage config={CONFIG} />;
}
