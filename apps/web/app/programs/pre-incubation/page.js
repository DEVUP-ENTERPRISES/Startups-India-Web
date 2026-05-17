'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WhyJoinProgramSection from '@/components/WhyJoinProgramSection';
import CTAStripSection from '@/components/CTAStripSection';
import ProgramTimelineSection from '@/components/ProgramTimelineSection';
import ModulesSection from '@/components/ModulesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import MentorsSection from '@/components/MentorsSection';
import FoundersTestimonialsSection from '@/components/FoundersTestimonialsSection';
import FAQSection from '@/components/FAQSection';
import DemoClassesSection from '@/components/DemoClassesSection';

// Import all required CSS
import '../../../styles/why-join-program.css';
import '../../../styles/cta-strip.css';
import '../../../styles/program-timeline-responsive.css';
import '../../../styles/modules-section.css';
import '../../../styles/how-it-works.css';
import '../../../styles/outcomes-section.css';
import '../../../styles/mentors-section.css';
import '../../../styles/testimonials-section.css';
import '../../../styles/faq-section.css';
import '../../../styles/demo-classes.css';
import '../../../styles/pre-incubation-spacing.css';

export default function PreIncubationPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pre-incubation-page" style={{ background: '#FAFAFA', position: 'relative', overflow: 'hidden' }}>
      {/* ── ATMOSPHERIC MASTERSTROKES ─────────────────────────────────── */}
      <div className="masterpiece-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(229, 57, 53, 0.04) 0%, transparent 70%)', filter: 'blur(120px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(15, 23, 42, 0.03) 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(229, 57, 53, 0.02) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', padding: '120px 0 80px', overflow: 'hidden', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'inline-flex', background: '#FFFFFF', padding: '10px 24px', borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.15em', color: '#E53935', textTransform: 'uppercase' }}>Pre Incubation Cohort</span>
              </div>
              
              <h1 style={{ fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: '950', color: '#0F172A', lineHeight: '1', marginBottom: '28px', letterSpacing: '-0.04em' }}>
                Transform Your Startup Vision Into <span style={{ color: '#E53935' }}>Reality</span>
              </h1>

              <p style={{ fontSize: '19px', color: '#64748B', lineHeight: '1.6', maxWidth: '750px', margin: '0 auto 40px' }}>
                Join the elite Pre-Incubation Program. Get world-class mentorship, idea validation, and build your MVP. Designed exclusively for student founders and early-stage entrepreneurs.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link href="/login">
                  <button style={{ background: '#E53935', color: '#FFFFFF', padding: '18px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 15px 35px rgba(229, 57, 53, 0.25)', transition: 'all 0.3s ease' }}>
                    <span>Book a Session</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Feature Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginTop: '100px' }}>
               {[
                 { title: 'Expert Mentorship', sub: 'Learn from industry leaders', color: '#E53935' },
                 { title: 'Funding Access', sub: 'Angles | VCs | Govt Grants', color: '#0F172A' },
                 { title: 'MVP Development', sub: 'Build & launch your product', color: '#E53935' }
               ].map((card, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                   style={{ background: '#FFFFFF', padding: '32px', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'left' }}
                   whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0,0,0,0.08)' }}
                 >
                   <div style={{ width: '48px', height: '48px', background: card.color + '0D', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, marginBottom: '20px' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                   </div>
                   <div style={{ fontSize: '13px', fontWeight: '900', color: card.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{card.title}</div>
                   <div style={{ fontSize: '15px', color: '#64748B', fontWeight: '500' }}>{card.sub}</div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIONS ─────────────────────────────────────────────── */}
      <WhyJoinProgramSection />
      
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <ProgramTimelineSection />
      </div>

      <ModulesSection />
      <DemoClassesSection />
      
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <HowItWorksSection />
      </div>

      <MentorsSection />
      <CTAStripSection />
      <FoundersTestimonialsSection />
      <FAQSection />
    </div>
  );
}
