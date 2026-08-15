'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

/**
 * Reusable locked stage page.
 * Shows what the stage is about, why it's locked, and what score/action unlocks it.
 */
export default function LockedStage({
  stageNum,
  title,
  icon,
  description,
  unlockCondition,
  benefits = [],
  accentColor = '#6366f1',
  accentBg = 'rgba(99,102,241,0.08)',
  accentBorder = 'rgba(99,102,241,0.25)',
}) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Lock hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e24 0%, #0d0d11 100%)',
        borderRadius: '20px', padding: '40px 32px', marginBottom: '24px',
        textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Stage number */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px', borderRadius: '100px', marginBottom: '20px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '11px', fontWeight: 800, letterSpacing: '1.2px',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
        }}>
          Stage {stageNum}
        </div>

        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px',
          background: accentBg, border: `1.5px solid ${accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px',
        }}>
          {icon}
        </div>

        <h1 style={{ margin: '0 0 12px', fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
          {title}
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '440px', marginInline: 'auto' }}>
          {description}
        </p>

        {/* Lock badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '100px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)',
        }}>
          <Lock size={14} />
          {unlockCondition}
        </div>
      </div>

      {/* What you'll get */}
      {benefits.length > 0 && (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '16px', padding: '22px 24px', marginBottom: '20px',
        }}>
          <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            What you'll get
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                  background: accentBg, border: `1px solid ${accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px',
                }}>
                  {b.icon}
                </span>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{b.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f5, #fff)',
        border: '1.5px solid #fca5a5', borderRadius: '16px',
        padding: '20px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Haven't started Stage 2 yet?
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Complete Idea Validation to unlock these stages.
          </p>
        </div>
        <Link
          href="/dashboard/journey/idea-validation"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: '#fff', fontWeight: 700, fontSize: '13.5px',
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 3px 10px rgba(220,38,38,0.25)',
          }}
        >
          Go to Idea Validation <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
