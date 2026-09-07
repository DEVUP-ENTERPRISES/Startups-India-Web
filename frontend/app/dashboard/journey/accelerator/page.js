'use client';

import { useEffect, useState } from 'react';
import LockedStage from '../_LockedStage';
import { listMyApplications } from '@/lib/grants';

// Accelerator is phase index 4.
const STAGE_INDEX = 4;

export default function AcceleratorPage() {
  const [phase, setPhase] = useState(null);
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);

  useEffect(() => {
    listMyApplications().then(({ data }) => {
      if (data?.length) {
        setPhase(data[0].currentPhase ?? 0);
        setUnlockedUpTo(data[0].unlockedUpTo ?? data[0].currentPhase ?? 0);
      }
    });
  }, []);

  if (phase === null) return null;

  // Unlocked either by reaching this phase, OR by score-based unlocking (≥75).
  const reachedPhase = phase >= STAGE_INDEX;
  const unlockedByScore = unlockedUpTo >= STAGE_INDEX;
  const unlocked = reachedPhase || unlockedByScore;

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

  // Unlocked-by-score but the admin hasn't formally moved them into this phase yet.
  const earnedNotActive = unlockedByScore && !reachedPhase;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #78350f, #92400e)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fcd34d', marginBottom: '8px' }}>
          {earnedNotActive ? 'Stage 5 - Unlocked' : 'Stage 5 - Active'}
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 900 }}>Accelerator Program</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#fde68a', lineHeight: 1.6 }}>
          {earnedNotActive
            ? 'Outstanding score! You have unlocked the Accelerator Program - our highest tier. It opens once you progress through Pre-Incubation and Incubation; our team will move you forward at the right time.'
            : 'Congratulations on reaching the Accelerator. Your programme coordinator will be in touch shortly.'}
        </p>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          {earnedNotActive
            ? 'Your evaluation places you in the top tier. Keep progressing through the earlier stages - you will be onboarded into the Accelerator when you reach it, with cohort schedule, mentors, and demo-day prep shared then.'
            : 'Welcome to the Accelerator Programme. Your cohort schedule, mentor assignments, and demo day preparation materials will be shared via email within 24 hours.'}
        </p>
      </div>
    </div>
  );
}
