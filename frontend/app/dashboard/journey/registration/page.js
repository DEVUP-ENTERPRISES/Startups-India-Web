'use client';

import { useDashboard } from '@/contexts/DashboardProvider';
import Link from 'next/link';
import { CheckCircle2, User, Building2, MapPin, Briefcase, ArrowRight } from 'lucide-react';

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  const display = Array.isArray(value) ? value.join(', ') : String(value);
  if (!display.trim()) return null;
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
      <span style={{ minWidth: '160px', color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1e293b', fontWeight: 600, wordBreak: 'break-word' }}>{display}</span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ color: '#dc2626' }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{title}</h2>
      </div>
      <div style={{ padding: '4px 20px 12px' }}>{children}</div>
    </div>
  );
}

export default function RegistrationPage() {
  const { user } = useDashboard();

  // user.full_name is the /me key; user.fullName also added in the updated /me
  const fullName = user?.fullName || user?.full_name || '';
  const email = user?.email || '';
  const dp = user?.dynamicProfileData || {};

  const isStudent = dp.isStudent === 'Yes';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)',
        borderRadius: '20px', padding: '32px',
        marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '20px',
        border: '1.5px solid #10b981',
        boxShadow: '0 10px 30px rgba(6,78,59,0.25)',
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
        }}>
          <CheckCircle2 size={30} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '100px',
            background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
            fontSize: '11px', fontWeight: 800, letterSpacing: '1px',
            textTransform: 'uppercase', color: '#34d399', marginBottom: '8px',
          }}>
            Stage 1 - Completed
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            Registration
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#a7f3d0', lineHeight: 1.5 }}>
            Your profile has been registered on StartupsIndia. Review your details below.
          </p>
        </div>
      </div>

      {/* Profile photo */}
      {dp.profilePhoto && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dp.profilePhoto} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
        </div>
      )}

      {/* About You */}
      <Section title="About You" icon={<User size={17} />}>
        <InfoRow label="Full Name" value={fullName} />
        <InfoRow label="Email" value={email} />
        <InfoRow label="Phone" value={user?.phone} />
        <InfoRow label={isStudent ? 'Course / Degree' : 'Designation'} value={dp.designation} />
        <InfoRow label={isStudent ? 'Year of Study' : 'Years of Experience'} value={dp.yearsOfExperience} />
        {!isStudent && <InfoRow label="Previous Company" value={dp.previousCompany} />}
        {!isStudent && <InfoRow label="Previous Startup" value={dp.previousStartup} />}
        <InfoRow label="Domain Expertise" value={dp.domainExpertise} />
      </Section>

      {/* Location & Education */}
      <Section title="Location & Education" icon={<MapPin size={17} />}>
        <InfoRow label="State" value={dp.state} />
        <InfoRow label="City" value={dp.city} />
        <InfoRow label="College / University" value={dp.collegeName} />
      </Section>

      {/* Startup / Idea */}
      <Section title={isStudent ? 'Your Idea' : 'Your Startup'} icon={<Building2 size={17} />}>
        <InfoRow label="Startup Name" value={dp.startupName} />
        <InfoRow label="Industry" value={dp.industry} />
        <InfoRow label="Stage" value={dp.startupStage} />
        <InfoRow label="Description" value={dp.bio} />
      </Section>

      {/* Looking For */}
      {dp.lookingFor?.length > 0 && (
        <Section title="Looking For" icon={<Briefcase size={17} />}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '12px' }}>
            {dp.lookingFor.map(item => (
              <span key={item} style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {item}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Social Links */}
      {(dp.linkedin || dp.website) && (
        <Section title="Social & Links" icon={<ArrowRight size={17} />}>
          <InfoRow label="LinkedIn" value={dp.linkedin} />
          <InfoRow label="Website" value={dp.website} />
        </Section>
      )}

      {/* CTA to Stage 2 */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f5, #ffffff)',
        border: '1.5px solid #fca5a5', borderRadius: '16px',
        padding: '22px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Ready for Stage 2?</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Submit your pitch deck, revenue model and pay ₹1,499 to get your idea evaluated.
          </p>
        </div>
        <Link href="/dashboard/journey/idea-validation"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(220,38,38,0.25)' }}>
          Go to Idea Validation <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
