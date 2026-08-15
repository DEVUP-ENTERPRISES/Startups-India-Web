'use client';

import { useEffect, useState } from 'react';
import LockedStage from '../_LockedStage';
import { listMyApplications } from '@/lib/grants';

export default function AcceleratorPage() {
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    listMyApplications().then(({ data }) => {
      if (data?.length) setPhase(data[0].currentPhase ?? 0);
    });
  }, []);

  const unlocked = phase !== null && phase >= 4;

  if (phase === null) return null;

  if (!unlocked) {
    return (
      <LockedStage
        stageNum={5}
        title="Accelerator Program"
        icon="🚀"
        description="Fast-track growth with intensive mentorship, market access, and investor demo days. Requires a score of 75 or above - our highest performance tier."
        unlockCondition="Unlocks with evaluation score ≥ 75"
        accentColor="#f59e0b"
        accentBg="rgba(245,158,11,0.08)"
        accentBorder="rgba(245,158,11,0.25)"
        benefits={[
          { icon: '⚡', title: '12-Week Intensive Program', desc: 'Fast-paced curriculum covering growth hacking, product-market fit, and fundraising.' },
          { icon: '🌍', title: 'Market Access & Pilots', desc: 'Introductions to enterprise customers for pilot programmes and early revenue.' },
          { icon: '💰', title: 'Demo Day with Investors', desc: 'Pitch to 50+ VCs, angels, and corporate venture funds at the quarterly demo day.' },
          { icon: '🏆', title: 'Alumni Network', desc: 'Lifetime access to our accelerator alumni network of 500+ founders.' },
        ]}
      />
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #78350f, #92400e)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fcd34d', marginBottom: '8px' }}>
          Stage 5 - Active
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 900 }}>Accelerator Program</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#fde68a', lineHeight: 1.6 }}>
          Congratulations on reaching the Accelerator. Your programme coordinator will be in touch shortly.
        </p>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          Welcome to the Accelerator Programme. Your cohort schedule, mentor assignments, and demo day
          preparation materials will be shared via email within 24 hours.
        </p>
      </div>
    </div>
  );
}
