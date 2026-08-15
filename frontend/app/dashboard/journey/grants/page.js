'use client';

import { useEffect, useState } from 'react';
import LockedStage from '../_LockedStage';
import { listMyApplications } from '@/lib/grants';

export default function GrantsPage() {
  const [phase, setPhase] = useState(null);
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    listMyApplications().then(({ data }) => {
      if (data?.length) {
        setPhase(data[0].currentPhase ?? 0);
        setAppStatus(data[0].status);
      }
    });
  }, []);

  const unlocked = phase !== null && phase >= 5;

  if (phase === null) return null;

  if (!unlocked) {
    return (
      <LockedStage
        stageNum={6}
        title="Grants"
        icon="🏛️"
        description="Unlock government grants and seed funding up to ₹20 Lakhs. This is the final stage - awarded to startups that have completed the accelerator programme."
        unlockCondition="Unlocks after completing the Accelerator Program"
        accentColor="#dc2626"
        accentBg="rgba(220,38,38,0.08)"
        accentBorder="rgba(220,38,38,0.25)"
        benefits={[
          { icon: '💵', title: 'Up to ₹20 Lakh Grant', desc: 'Non-dilutive government seed funding under the DPIIT SISFS scheme.' },
          { icon: '📜', title: 'DPIIT Recognition', desc: 'Official DPIIT startup recognition certificate, unlocking tax benefits and compliance relaxations.' },
          { icon: '🤝', title: 'Continued Mentorship', desc: '12 months of post-grant mentorship to ensure successful fund utilisation.' },
          { icon: '🌐', title: 'Global Opportunities', desc: 'Nominations for international startup competitions and global accelerator programmes.' },
        ]}
      />
    );
  }

  const isApproved = appStatus === 'grant_approved' || appStatus === 'completed';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px', color: '#fff',
        border: '1.5px solid #dc2626',
        boxShadow: '0 12px 32px rgba(220,38,38,0.3)',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fca5a5', marginBottom: '8px' }}>
          Stage 6 - {isApproved ? 'Grant Approved 🎉' : 'Active'}
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 900 }}>Grants</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#fecaca', lineHeight: 1.6 }}>
          {isApproved
            ? 'Your grant has been approved. Disbursement details are being processed.'
            : 'Your grant application is being processed. Our team will contact you with the next steps.'}
        </p>
      </div>

      {isApproved && (
        <div style={{
          background: '#f0fdf4', border: '1.5px solid #bbf7d0',
          borderRadius: '16px', padding: '24px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
            background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>
            🏆
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#065f46' }}>
              Congratulations!
            </p>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#047857', lineHeight: 1.5 }}>
              Your grant has been approved. Expect disbursement within 15 business days.
              A formal grant letter has been sent to your registered email.
            </p>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          Our grants team will reach out with the DPIIT documentation requirements, bank details
          submission process, and fund utilisation guidelines. All communication will be via your
          registered email address.
        </p>
      </div>
    </div>
  );
}
