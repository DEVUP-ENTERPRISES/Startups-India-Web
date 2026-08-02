'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Phone, AlertCircle } from 'lucide-react';
import { getMentorRequests } from '@/lib/mentors';

const card = {
  padding: '20px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '18px',
};

export default function MentorMenteesPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getMentorRequests();
      if (err) {
        setError(err.message || 'Could not load your mentees.');
        setItems([]);
        return;
      }
      setItems(data || []);
    })();
  }, []);

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
        My Mentees
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: '14.5px', color: '#6b7280' }}>
        Founders matched to you for mentorship.
      </p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {items === null ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div style={{ ...card, padding: '56px 20px', textAlign: 'center' }}>
          <Users size={38} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#374151' }}>
            No mentees yet
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#9ca3af' }}>
            Founders matched to you will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map(req => {
            const p = req.user || {};
            return (
              <div key={req._id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: '#fef2f2', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '16px',
                  }}
                >
                  {(p.fullName || '?').charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                    {p.fullName || 'Unknown'}
                  </p>
                  {req.topic && (
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
                      {req.topic}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {p.email && (
                      <a href={`mailto:${p.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#6b7280', textDecoration: 'none' }}>
                        <Mail size={12} /> {p.email}
                      </a>
                    )}
                    {p.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#6b7280' }}>
                        <Phone size={12} /> {p.phone}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  style={{
                    padding: '5px 12px', borderRadius: '100px', flexShrink: 0,
                    background: req.status === 'matched' ? '#f0fdf4' : '#fffbeb',
                    color: req.status === 'matched' ? '#047857' : '#b45309',
                    fontSize: '11.5px', fontWeight: 700,
                  }}
                >
                  {req.status || 'pending'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
