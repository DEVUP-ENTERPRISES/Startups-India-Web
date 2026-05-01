'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/Icon';
import Link from 'next/link';

export default function PurchasesPage() {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch('/api/v1/payments/purchases');
        const json = await res.json();
        if (json.success) setPurchases(json.data);
      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  const filteredCourses = useMemo(() => {
    return purchases.filter(p => {
      if (activeTab === 'ACTIVE') return p.status === 'succeeded';
      return false; // Completed logic
    });
  }, [activeTab, purchases]);

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page">
      
      {/* HEADER */}
      <header className="platform-page-header">
        <div>
          <h1 className="platform-page-title">My Purchases</h1>
          <p className="platform-page-subtitle">Your unlocked premium startup curriculum.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--dashboard-bg)', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
            <button 
              onClick={() => setActiveTab('ACTIVE')}
              style={{ padding: '10px 22px', border: 'none', background: activeTab === 'ACTIVE' ? '#ef4444' : 'transparent', color: activeTab === 'ACTIVE' ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 950, cursor: 'pointer', transition: '0.2s' }}
            >
              ACTIVE
            </button>
            <button 
              onClick={() => setActiveTab('COMPLETED')}
              style={{ padding: '10px 22px', border: 'none', background: activeTab === 'COMPLETED' ? '#ef4444' : 'transparent', color: activeTab === 'COMPLETED' ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 950, cursor: 'pointer', transition: '0.2s' }}
            >
              COMPLETED
            </button>
        </div>
      </header>

      {/* PURCHASED COURSES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
        {filteredCourses.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '32px', border: '1.5px dashed #e2e8f0' }}>
            <Icon name="bookOpen" size={48} stroke={1.5} />
            <p style={{ marginTop: '1rem', fontWeight: 700 }}>No {activeTab.toLowerCase()} courses found.</p>
          </div>
        )}
        {filteredCourses.map(p => {
          const course = p.courseId || {};
          return (
            <div 
              key={p._id} 
              className="glass-card"
              style={{ 
                  background: 'var(--dashboard-bg)', borderRadius: '32px', overflow: 'hidden', border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)', cursor: 'pointer', transition: '0.3s'
              }}
            >
              <div style={{ position: 'relative', height: '180px', background: '#f8fafc' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ef4444, #7A1F2B)', color: '#fff' }}>
                       <Icon name="book" size={48} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950 }}>
                      {course.category?.toUpperCase() || 'COURSE'}
                  </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', lineHeight: 1.4, height: '3rem', overflow: 'hidden' }}>{course.title || 'Untitled Course'}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 950 }}>C</div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Instructor: Course Expert</span>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8' }}>MODULE ACCESS</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#ef4444' }}>PURCHASED</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `100%`, height: '100%', background: '#ef4444', borderRadius: '4px' }} />
                      </div>
                  </div>

                  <Link href={`/learn/${course.slug || course._id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ 
                        width: '100%', marginTop: '24px', padding: '14px', borderRadius: '16px', border: 'none', 
                        background: '#0f172a', 
                        color: '#fff', 
                        fontSize: '0.8rem', fontWeight: 950, cursor: 'pointer',
                        transition: 'all 0.2s'
                    }} className="hover-scale">
                        START LEARNING
                    </button>
                  </Link>
              </div>
            </div>
          );
        })}

        {/* UPSELL CARD */}
        <div style={{ background: 'rgba(239, 68, 68, 0.03)', borderRadius: '32px', border: '2.5px dashed rgba(239, 68, 68, 0.1)', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '22px', background: 'var(--dashboard-bg)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.1)' }}>
                <Icon name="plus" size={32} stroke={3} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>Expand Your Mind</h3>
            <p style={{ margin: '8px 0 24px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 750, lineHeight: 1.5 }}>Unlock 50+ premium startup courses with a single subscription.</p>
            <Link href="/dashboard/courses" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '14px 32px', borderRadius: '16px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.85rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 6px 15px rgba(239, 68, 68, 0.2)' }}>EXPLORE CATALOG</button>
            </Link>
        </div>
      </div>

      <style jsx global>{`
        .hover-scale { transition: all 0.2s; }
        .hover-scale:hover { transform: scale(0.98); opacity: 0.9; }
        .platform-page { padding: 2rem 4rem 10rem; }
        .platform-page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .platform-page-title { font-size: 2.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .platform-page-subtitle { color: #94a3b8; font-weight: 750; margin-top: 8px; }
      `}</style>
    </div>
  );
}

