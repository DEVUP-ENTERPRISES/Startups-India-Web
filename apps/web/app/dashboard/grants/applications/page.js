'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, ArrowRight, Plus, FileText } from 'lucide-react';
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
    <div
      style={{
        padding: '64px 24px',
        textAlign: 'center',
        background: '#fafafa',
        border: '1px dashed #e5e7eb',
        borderRadius: '20px',
      }}
    >
      <Rocket size={44} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
        No applications yet
      </h3>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 22px', lineHeight: 1.6 }}>
        Apply for the Startup Grant to access funding, mentorship and incubation support.
      </p>
      <Link
        href="/dashboard/grants"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '12px 22px', borderRadius: '12px',
          background: 'linear-gradient(135deg,#e63946,#ff6b6b)',
          color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
        }}
      >
        <Plus size={16} /> Start an application
      </Link>
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
            Track the status of your Startup Grant applications.
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
