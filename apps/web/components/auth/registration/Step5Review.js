'use client';
import { Edit2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Step5Review({
  role,
  basicInfo,
  isVerified,
  isEmailVerified,
  isPhoneVerified,
  profileData,
  onGoToStep,
  termsAccepted,
  setTermsAccepted,
  privacyAccepted,
  setPrivacyAccepted,
  error,
}) {
  const getRoleTitle = (r) => {
    switch (r) {
      case 'student': return 'Student';
      case 'startup': return 'Startup';
      case 'founder': return 'Founder / Student';
      case 'mentor': return 'Mentor';
      case 'investor': return 'Investor';
      case 'service_provider': return 'Service Provider';
      default: return 'User';
    }
  };

  const getVerificationText = () => {
    if (isPhoneVerified) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>Mobile Number Verified ✓</span>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600 }}>
        <AlertCircle size={16} color="#ef4444" />
        <span>Mobile Number Unverified</span>
      </div>
    );
  };

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Review & <span>Submit</span></h2>
        <p className="reg-v2-content-subtitle">
          Please review your information carefully before submitting your registration.
        </p>
      </div>

      {error && (
        <div 
          style={{ 
            padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', 
            borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ShieldCheck size={16} />
          {error}
        </div>
      )}

      <div className="reg-v2-review-grid">
        {/* 01 Role Selected */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">01</span>
            <div>
              <h4 className="reg-v2-review-title">Role Selected</h4>
              <div className="reg-v2-review-details">
                <strong style={{ color: '#dc2626', fontSize: '16px' }}>{getRoleTitle(role)}</strong>
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(1)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>

        {/* 02 Basic Information */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">02</span>
            <div>
              <h4 className="reg-v2-review-title">Basic Information</h4>
              <div className="reg-v2-review-details">
                <div><strong>Full Name:</strong> {basicInfo.fullName || '-'}</div>
                <div><strong>Email:</strong> {basicInfo.email || '-'}</div>
                <div><strong>Phone Number:</strong> {basicInfo.countryCode || '+91'} {basicInfo.phone || '-'}</div>
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(2)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>

        {/* 03 Verification */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">03</span>
            <div>
              <h4 className="reg-v2-review-title">Verification Status</h4>
              <div className="reg-v2-review-details">
                {getVerificationText()}
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(3)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>

        {/* 04 Profile Details */}
        <div className="reg-v2-review-card">
          <div className="reg-v2-review-left">
            <span className="reg-v2-review-num">04</span>
            <div>
              <h4 className="reg-v2-review-title">Profile Details ({getRoleTitle(role)})</h4>
              <div className="reg-v2-review-details">
                {Object.entries(profileData).length > 0 ? (
                  Object.entries(profileData).map(([key, val]) => (
                    val ? (
                      <div key={key} style={{ marginBottom: '8px' }}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>{' '}
                        {key === 'profilePhoto' || (typeof val === 'string' && val.startsWith('data:image/')) ? (
                          <div style={{ marginTop: '6px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={val}
                              alt="Profile Thumbnail"
                              style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #dc2626',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                              }}
                            />
                          </div>
                        ) : (
                          <span>{String(val)}</span>
                        )}
                      </div>
                    ) : null
                  ))
                ) : (
                  <div>No extra details specified</div>
                )}
              </div>
            </div>
          </div>
          <button className="reg-v2-btn-edit" onClick={() => onGoToStep(4)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>
      </div>

      {/* Declarations & Legal Agreements card */}
      <div 
        style={{ 
          background: '#ffffff', 
          padding: '18px 20px', 
          borderRadius: '16px', 
          border: '1.5px solid #e2e8f0', 
          marginTop: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Declarations & Legal Agreements
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Terms & Conditions Row */}
          <div 
            onClick={() => setTermsAccepted(!termsAccepted)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px',
              borderRadius: '10px',
              background: termsAccepted ? '#fff5f5' : '#f8fafc',
              border: termsAccepted ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAccepted}
              onChange={(e) => {
                e.stopPropagation();
                setTermsAccepted(e.target.checked);
              }}
              style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
              I agree to the{' '}
              <a 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}
              >
                Terms & Conditions
              </a>
            </span>
          </div>

          {/* Privacy Policy Row */}
          <div 
            onClick={() => setPrivacyAccepted(!privacyAccepted)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px',
              borderRadius: '10px',
              background: privacyAccepted ? '#fff5f5' : '#f8fafc',
              border: privacyAccepted ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              id="privacyCheckbox"
              checked={privacyAccepted}
              onChange={(e) => {
                e.stopPropagation();
                setPrivacyAccepted(e.target.checked);
              }}
              style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
              I agree to the{' '}
              <a 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}
              >
                Privacy Policy
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
