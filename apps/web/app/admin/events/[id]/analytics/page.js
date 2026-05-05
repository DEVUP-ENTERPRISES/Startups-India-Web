'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import Link from 'next/link';

export default function AdminEventAnalyticsPage({ params }) {
  const id = params.id;
  const [analytics, setAnalytics] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: statsData }, { data: eventData }] = await Promise.all([
        apiGet(`/api/v1/admin/events/${id}/analytics`),
        apiGet(`/api/v1/events/${id}`)
      ]);
      
      if (statsData) setAnalytics(statsData);
      if (eventData) setEvent(eventData);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading"><div className="admin-spinner" /></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div
        className="admin-topbar"
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link href="/admin/events" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', marginBottom: 4, display: 'inline-block' }}>
            ← Back to Events
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
            Analytics: {event?.title || 'Event'}
          </h1>
        </div>
      </div>

      {analytics && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>Total Registrations</div>
              <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>{analytics.totalRegistrations}</div>
              <div style={{ color: '#10b981', fontSize: 13 }}>Across all sources</div>
            </div>
            
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>Remaining Seats</div>
              <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>{analytics.remainingSeats ?? 'Unlimited'}</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>Based on max capacity</div>
            </div>

            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>Attendance Rate</div>
              <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>{analytics.attendanceRate}%</div>
              <div style={{ color: '#3b82f6', fontSize: 13 }}>Of total registrations</div>
            </div>

            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>Refunds</div>
              <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>{analytics.refundCount}</div>
              <div style={{ color: '#ef4444', fontSize: 13 }}>Cancelled or refunded</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16 }}>Payment Status Breakdown</h3>
              {Object.keys(analytics.paymentStats).length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {Object.entries(analytics.paymentStats).map(([status, count]) => (
                    <li key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontWeight: 500 }}>{status}</span>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#94a3b8' }}>No payment data yet.</p>
              )}
            </div>
            
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16 }}>Attendance Breakdown</h3>
              {Object.keys(analytics.attendanceStats).length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {Object.entries(analytics.attendanceStats).map(([status, count]) => (
                    <li key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontWeight: 500 }}>{status}</span>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#94a3b8' }}>No attendance data yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
