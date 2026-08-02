'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, ArrowRight, Plus, FileText, Camera, Zap } from 'lucide-react';
import { listMyApplications } from '@/lib/grants';
import StatusBadge from '@/components/grants/StatusBadge';

function Skeleton() {
  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            height: '104px',
            background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'grantShimmer 1.4s infinite',
            borderRadius: '18px',
          }}
        />
      ))}
      <style>{`@keyframes grantShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '32px',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 12px 32px -12px rgba(0,0,0,0.06)'
    }}>
      
      {/* Left: Pitch & Stages */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', width: 'fit-content' }}>
          <Zap size={14} fill="currentColor" /> Applications Open
        </div>
        
        <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
          Fast-track your startup journey.
        </h3>
        
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          You haven't applied yet! Join the Startups India ecosystem. Get your idea evaluated by top VCs, secure mentorship, and get funded. <strong>Apply fast</strong> before the current cohort fills up.
        </p>
        
        <Link
          href="/dashboard/grants"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '16px 28px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #e63946 0%, #b91c1c 100%)',
            color: '#fff', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
            boxShadow: '0 8px 20px -6px rgba(230, 57, 70, 0.5)',
            width: 'fit-content',
            marginBottom: '40px',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(230, 57, 70, 0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(230, 57, 70, 0.5)'; }}
        >
          <Rocket size={18} /> Start Your Application
        </Link>

        {/* Mini Stages Summary */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>The 5-Phase Journey</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
            {[ 'Idea', 'Eval', 'Pre-Inc', 'Incubate', 'Funded'].map((stage, i) => (
              <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center', position: 'relative', flex: 1 }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', 
                  background: i === 4 ? '#fef3c7' : '#f3f4f6', 
                  color: i === 4 ? '#d97706' : '#6b7280', 
                  border: i === 4 ? '1px solid #fde68a' : '1px solid transparent',
                  fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2
                }}>
                  {i + 1}
                </div>
                {i < 4 && <div style={{ position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px', background: '#f3f4f6', zIndex: 1 }} />}
                <span style={{ fontSize: '11px', fontWeight: 600, color: i === 4 ? '#d97706' : '#6b7280' }}>{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Photo Grid Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '340px' }}>
        {/* Large photo left */}
        <div style={{ 
          background: '#000', borderRadius: '20px', gridRow: 'span 2', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
        }}>
          <img src="/showcase/pitch.png" alt="Startup Pitch" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px 16px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#fff', pointerEvents: 'none' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.3px' }}>Seed Pitches</span>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500, marginTop: '2px' }}>Cohort 4</div>
          </div>
        </div>
        
        {/* Top right */}
        <div style={{ 
          background: '#000', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
        }}>
          <img src="/showcase/event.png" alt="Networking Event" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '24px 14px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#fff', pointerEvents: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.2px' }}>Networking</span>
          </div>
        </div>
        
        {/* Bottom right */}
        <div style={{ 
          background: '#000', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
        }}>
          <img src="/showcase/office.png" alt="Incubation Space" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '24px 14px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#fff', pointerEvents: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.2px' }}>Workspace</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function MyApplicationsPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error: err } = await listMyApplications();
      if (err) {
        setError(err.message || 'Could not load your applications.');
        setItems([]);
        return;
      }
      setItems(data || []);
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '26px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            My Applications
          </h1>
          <p style={{ fontSize: '14.5px', color: '#6b7280', margin: 0 }}>
            Track the status of your Startup Funding applications.
          </p>
        </div>

        {items?.length > 0 && (
          <Link
            href="/dashboard/grants"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '12px',
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#374151', fontWeight: 600, fontSize: '13.5px', textDecoration: 'none',
            }}
          >
            <Plus size={15} /> New application
          </Link>
        )}
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {items === null ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {items.map(app => (
            <Link
              key={app._id}
              href={`/dashboard/grants/applications/${app._id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px 22px', background: '#fff',
                border: '1px solid #f0f0f0', borderRadius: '18px',
                textDecoration: 'none', transition: 'box-shadow .15s, transform .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#fef2f2', flexShrink: 0,
                }}
              >
                <FileText size={20} color="#ef4444" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {app.startup?.name || 'Untitled startup'}
                  </h3>
                  <StatusBadge status={app.status} label={app.statusLabel} size="sm" />
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#9ca3af' }}>
                  {app.applicationId}
                  {app.submittedAt
                    ? ` · Submitted ${new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : ' · Not submitted yet'}
                </p>
              </div>

              <ArrowRight size={18} color="#d1d5db" style={{ flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
