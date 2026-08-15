'use client';

import { useEffect, useState } from 'react';
import LockedStage from '../_LockedStage';
import { listMyApplications } from '@/lib/grants';

export default function PreIncubationPage() {
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    listMyApplications().then(({ data }) => {
      if (data?.length) setPhase(data[0].currentPhase ?? 0);
    });
  }, []);

  const unlocked = phase !== null && phase >= 2;

  if (phase === null) return null; // loading

  if (!unlocked) {
    return (
      <LockedStage
        stageNum={3}
        title="Pre-Incubation"
        icon="🎓"
        description="Structured mentorship sessions to refine your business model, pitch deck, and go-to-market strategy. Unlock this by scoring in your idea evaluation."
        unlockCondition="Unlocks when evaluation score is revealed (any score)"
        accentColor="#8b5cf6"
        accentBg="rgba(139,92,246,0.08)"
        accentBorder="rgba(139,92,246,0.25)"
        benefits={[
          { icon: '🧑‍🏫', title: '4-Week Mentorship Program', desc: 'Weekly 1:1 sessions with industry mentors to sharpen your idea.' },
          { icon: '📋', title: 'Business Model Review', desc: 'Expert review of your revenue model, unit economics, and projections.' },
          { icon: '🎯', title: 'Pitch Deck Refinement', desc: 'Professional feedback on your deck with actionable improvement notes.' },
          { icon: '🔗', title: 'Network Access', desc: 'Introductions to potential co-founders, early employees, and advisors.' },
        ]}
      />
    );
  }

  // Unlocked view - minimal for now, to be expanded
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #4c1d95, #5b21b6)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: '8px' }}>
          Stage 3 - Active
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 900 }}>Pre-Incubation</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#ddd6fe', lineHeight: 1.6 }}>
          Your team will be in touch shortly with your mentorship schedule and program details.
        </p>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          The full Pre-Incubation portal is being prepared for your cohort. You'll receive an email
          with your mentor assignments, session schedule, and resource access within 48 hours.
        </p>
      </div>
    </div>
  );
}
