'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion } from 'framer-motion';
import '@/styles/learning-experience.css';

export default function ContinueLearningPage() {
  const [continueData, setContinueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContinueData() {
      try {
        const res = await fetch('/api/v1/learning/continue-learning');
        const json = await res.json();
        if (json.success) setContinueData(json.data);
      } catch (err) {
        console.error('Failed to fetch continue learning data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContinueData();
  }, []);

  const current = continueData?.current;
  const next = continueData?.next;

  if (isLoading) {
    return (
      <div className="platform-page" style={{ padding: '2.5rem' }}>
        <div style={{ height: 200, background: '#f8fafc', borderRadius: 24, marginBottom: '2rem', animation: 'pulse 2s infinite' }} />
        <div className="platform-grid">
           <div style={{ height: 300, background: '#f8fafc', borderRadius: 20, animation: 'pulse 2s infinite' }} />
           <div style={{ height: 300, background: '#f8fafc', borderRadius: 20, animation: 'pulse 2s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%)', 
          padding: '3rem', 
          borderRadius: '24px', 
          color: '#fff', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(122, 31, 43, 0.15)'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5975B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Founder Velocity Active</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Resume Your Journey</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', fontWeight: 500 }}>Pick up exactly where you left off. Your next breakthrough is waiting.</p>
          </div>
          <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.1 }}>
             <Icon name="rocket" size={250} color="#fff" />
          </div>
        </div>
      </header>

      <div className="platform-grid">
        {/* Current Active Milestone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="platform-card-v" 
          style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(122,31,43,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="play" size={20} color="#7A1F2B" fill="#7A1F2B" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Milestone</span>
          </div>

          {current ? (
            <>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111', marginBottom: '1rem', lineHeight: 1.3 }}>{current.videoId?.title || 'Untitled Lesson'}</h3>
              <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '2.5rem', lineHeight: 1.6 }}>Continue this module to increase your Startup Readiness Score.</p>
              
              <div style={{ marginTop: 'auto', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#111' }}>
                  <span>{Math.round((current.watchedSeconds / (current.videoId?.durationSeconds || 300)) * 100)}% COMPLETE</span>
                  <span style={{ color: '#7A1F2B' }}>{Math.floor(current.watchedSeconds / 60)}m WATCHED</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (current.watchedSeconds / (current.videoId?.durationSeconds || 300)) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', background: '#7A1F2B' }} 
                  />
                </div>
              </div>

              <Link href={`/learn/${current.videoId?.courseId}`} style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', background: '#7A1F2B', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(122, 31, 43, 0.2)' }}>
                  Resume Lesson
                </button>
              </Link>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
               <Icon name="recorded" size={48} color="#cbd5e1" />
               <p style={{ color: '#94A3B8', marginTop: '1.5rem', fontWeight: 600 }}>No active lessons found.</p>
               <Link href="/dashboard/learning/recorded" style={{ color: '#7A1F2B', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>Browse Curriculum &rarr;</Link>
            </div>
          )}
        </motion.div>

        {/* Next Phase Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="platform-card-v" 
          style={{ padding: '2.5rem', background: '#f8fafc', border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(197,151,91,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="rocket" size={20} color="#C5975B" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Next Phase</span>
          </div>

          {next ? (
            <>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#94A3B8', marginBottom: '1rem' }}>{next.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem' }}>This phase is currently locked. Complete your active milestone to unlock the next level of insights.</p>
              <div style={{ marginTop: 'auto', background: '#fff', border: '1px solid #f1f5f9', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#cbd5e1', fontWeight: 800, fontSize: '0.85rem' }}>
                 Unlocks on Completion
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', margin: 'auto' }}>
               <Icon name="checkCircle" size={48} color="#10b981" opacity={0.5} />
               <p style={{ color: '#94A3B8', marginTop: '1.5rem', fontWeight: 600 }}>All phases complete.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

