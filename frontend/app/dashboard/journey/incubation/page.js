'use client';

import { useEffect, useState } from 'react';
import LockedStage from '../_LockedStage';
import { listMyApplications } from '@/lib/grants';

// Incubation is phase index 3.
const STAGE_INDEX = 3;

export default function IncubationPage() {
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

  // Unlocked either by reaching this phase, OR by score-based unlocking.
  const reachedPhase = phase >= STAGE_INDEX;
  const unlockedByScore = unlockedUpTo >= STAGE_INDEX;
  const unlocked = reachedPhase || unlockedByScore;

  if (!unlocked) {
    return (
      <LockedStage
        stageNum={4}
        title="Incubation"
        icon="🏢"
        description="Physical workspace, labs, and hands-on operational support to build and scale your startup. Requires a score of 50 or above in your evaluation."
        unlockCondition="Unlocks with evaluation score ≥ 50"
        accentColor="#0ea5e9"
        accentBg="rgba(14,165,233,0.08)"
        accentBorder="rgba(14,165,233,0.25)"
        benefits={[
          { icon: '🏗️', title: 'Physical Office Space', desc: 'Dedicated desk and meeting rooms at the StartupsIndia incubation centre.' },
          { icon: '🔬', title: 'Lab & Prototyping Access', desc: 'Access to technical labs, hardware prototyping equipment, and testing facilities.' },
          { icon: '💼', title: 'Operational Support', desc: 'Legal, accounting, HR, and compliance support from our partner firms.' },
          { icon: '📈', title: 'Investor Introductions', desc: 'Warm introductions to our network of angel investors and early-stage VCs.' },
        ]}
      />
    );
  }

  // Unlocked-by-score but the admin hasn't formally moved them into this phase yet.
  const earnedNotActive = unlockedByScore && !reachedPhase;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0c4a6e, #075985)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#7dd3fc', marginBottom: '8px' }}>
          {earnedNotActive ? 'Stage 4 - Unlocked' : 'Stage 4 - Active'}
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 900 }}>Incubation</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#bae6fd', lineHeight: 1.6 }}>
          {earnedNotActive
            ? 'Your evaluation score has unlocked Incubation. This stage opens once you complete Pre-Incubation — our team will move you forward when you are ready.'
            : 'Welcome to the incubation programme. Your onboarding details will be sent within 48 hours.'}
        </p>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          {earnedNotActive
            ? 'You have early access to what Incubation offers. Continue with your current stage — you will be onboarded into Incubation at the right time, and your coordinator will share workspace and programme details then.'
            : 'Your incubation coordinator will reach out with workspace access, programme schedule, and resource allocation. Check your registered email for further instructions.'}
        </p>
      </div>
    </div>
  );
}
