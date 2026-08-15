'use client';
import { Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

const ROLE_LABELS = {
  startup: 'Startup / Founder',
  mentor: 'Mentor',
  investor: 'Investor',
  service_provider: 'Service Provider',
};

export default function OnboardingReview({
  role,
  phone,
  isPhoneVerified,
  profileData,
  onGoToStep,
  termsAccepted,
  setTermsAccepted,
  privacyAccepted,
  setPrivacyAccepted,
  error,
}) {
  const roleLabel = ROLE_LABELS[role] || 'User';

  const verificationBadge = isPhoneVerified ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
      <CheckCircle2 size={15} /> Verified
    </span>
  ) : (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600 }}>
      <AlertCircle size={15} /> Not verified
    </span>
  );

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Review & <span>Submit</span></h2>
        <p className="reg-v2-content-subtitle">
          Review your information carefully before completing your profile setup.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '14px 18px', background: '#fef2f2', border: '1.5px solid #fca5a5',
          borderRadius: '12px', marginBottom: '20px',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#b91c1c', fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              {error}
            </p>
            {/* Phone conflict - nudge user to go back and change the number */}
            {error.toLowerCase().includes('phone') && (
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                style={{
                  marginTop: '8px', background: '#dc2626', color: '#fff',
                  border: 'none', borderRadius: '8px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                ← Change Phone Number
              </button>
            )}
          </div>
        </div>
      )}

      <div className="reg-v2-review-grid">
        {/* 01 Role */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">01</span>
            <div>
              <h4 className="reg-v2-review-title">Selected Role</h4>
              <div className="reg-v2-review-details">
                <strong style={{ color: '#dc2626', fontSize: '16px' }}>{roleLabel}</strong>
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(1)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>

        {/* 02 Phone Verification */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">02</span>
            <div>
              <h4 className="reg-v2-review-title">Phone Verification</h4>
              <div className="reg-v2-review-details">
                <div><strong>Number:</strong> {phone || '-'}</div>
                <div style={{ marginTop: '4px' }}>{verificationBadge}</div>
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(2)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>

        {/* 03 Profile Details */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">03</span>
            <div>
              <h4 className="reg-v2-review-title">Profile Details ({roleLabel})</h4>
              <div className="reg-v2-review-details">
                {Object.entries(profileData).length > 0 ? (
                  Object.entries(profileData)
                    // Skip raw ID fields (displayed via their name counterparts) and other internal keys
                    .filter(([key]) => !['stateId', 'cityId', 'collegeId', 'isStudent'].includes(key))
                    .map(([key, val]) =>
                      val ? (
                        <div key={key} style={{ marginBottom: '6px' }}>
                          <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}:</strong>{' '}
                          {key === 'profilePhoto' || (typeof val === 'string' && val.startsWith('data:image/')) ? (
                            <div style={{ marginTop: '6px' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={val}
                                alt="Profile"
                                style={{
                                  width: '60px', height: '60px', borderRadius: '50%',
                                  objectFit: 'cover', border: '2px solid #dc2626',
                                }}
                              />
                            </div>
                          ) : (
                            <span>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                          )}
                        </div>
                      ) : null
                    )
                ) : (
                  <div style={{ color: '#94a3b8' }}>No profile details yet</div>
                )}
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(3)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>
      </div>

      {/* Legal agreements */}
      <div style={{
        background: '#ffffff', padding: '18px 20px', borderRadius: '16px',
        border: '1.5px solid #e2e8f0', marginTop: '12px', marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Declarations & Legal Agreements
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              id: 'terms',
              checked: termsAccepted,
              toggle: () => setTermsAccepted(!termsAccepted),
              label: <>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</a></>,
            },
            {
              id: 'privacy',
              checked: privacyAccepted,
              toggle: () => setPrivacyAccepted(!privacyAccepted),
              label: <>I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</a></>,
            },
          ].map(({ id, checked, toggle, label }) => (
            <div
              key={id}
              onClick={toggle}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: checked ? '#fff5f5' : '#f8fafc',
                border: checked ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => { e.stopPropagation(); toggle(); }}
                style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
