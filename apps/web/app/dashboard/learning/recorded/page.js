'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/learning-experience.css';

function RecordedCard({ cls, layout = 'grid' }) {
  const isList = layout === 'list';
  const isWatched = cls.progress === 100;

  return (
    <Link href={`/dashboard/learning/continue?courseId=${cls._id}`} style={{ textDecoration: 'none' }}>
      <div className={`platform-card-v ${isList ? 'layout-list' : ''}`} style={{
        height: '100%',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        overflow: 'hidden',
        background: 'var(--dashboard-bg)',
        transition: 'all 0.3s ease'
      }}>
        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          height: isList ? '180px' : '200px',
          width: isList ? '280px' : '100%',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {cls.thumbnailUrl ? (
            <img src={cls.thumbnailUrl} alt={cls.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7A1F2B, #3d0e16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="recorded" size={40} color="rgba(255,255,255,0.2)" />
            </div>
          )}
          <div className="play-btn-overlay" style={{ background: 'rgba(0,0,0,0.3)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
            <div style={{ width: '50px', height: '50px', background: '#7A1F2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon name="play" size={20} fill="currentColor" />
            </div>
          </div>
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 6 }}>
            <span style={{ background:'rgba(0,0,0,0.7)', color:'#fff', backdropFilter:'blur(4px)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.65rem', fontWeight:800 }}>{cls.category || 'Course'}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', color: '#111', lineHeight: 1.3 }}>{cls.title}</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={12} color="#94A3B8" />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>{cls.instructorName || 'Founder Mentor'}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f8fafc' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="play" size={12} color="#cbd5e1" /> {cls.enrolledCount?.toLocaleString() || 0} learners
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="clock" size={12} color="#cbd5e1" /> {cls.durationWeeks || 0} weeks
            </span>
          </div>

          {cls.progress > 0 && (
             <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: isWatched ? '#10b981' : '#7A1F2B', marginBottom: '4px', textTransform: 'uppercase' }}>
                   {isWatched ? 'Completed' : `${cls.progress}% Watched`}
                </div>
                <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${cls.progress}%`, height: '100%', background: isWatched ? '#10b981' : '#7A1F2B' }} />
                </div>
             </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function RecordedClassesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState('grid');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/v1/courses');
        const json = await res.json();
        if (json.success) setCourses(json.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    return ['All Categories', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const q = search.toLowerCase();
      const matchesSearch = !q || c.title.toLowerCase().includes(q) || (c.category && c.category.toLowerCase().includes(q));
      const matchesCategory = categoryFilter === 'All Categories' || c.category === categoryFilter;
      const matchesTab = filter === 'all' || (filter === 'watched' && c.progress === 100) || (filter === 'in-progress' && c.progress > 0 && c.progress < 100);
      
      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [courses, search, categoryFilter, filter]);

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Knowledge Vault</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Access high-fidelity curriculum from the world's most successful founders.</p>
        </div>

        <div style={{ position: 'relative', width: '400px' }}>
          <input
            type="text"
            placeholder="Search by topic or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #f1f5f9', padding: '12px 16px 12px 42px', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', background: 'var(--dashboard-bg)' }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            <Icon name="search" size={18} />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '0.75rem', background: 'var(--dashboard-bg)', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'in-progress', 'watched'].map(f => (
            <button
               key={f}
               onClick={() => setFilter(f)}
               style={{ 
                  padding: '10px 20px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: filter === f ? '#7A1F2B' : 'transparent',
                  color: filter === f ? '#fff' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
               }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>

        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #f1f5f9', background: 'var(--dashboard-bg)', fontSize: '0.9rem', fontWeight: 700, color: '#111', outline: 'none', cursor: 'pointer' }}
        >
           {categories.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setLayout('grid')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: layout === 'grid' ? '#fff' : 'transparent', boxShadow: layout === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: layout === 'grid' ? '#7A1F2B' : '#94A3B8' }}
          >
            <Icon name="dashboard" size={14} /> GRID
          </button>
          <button
            onClick={() => setLayout('list')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: layout === 'list' ? '#fff' : 'transparent', boxShadow: layout === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: layout === 'list' ? '#7A1F2B' : '#94A3B8' }}
          >
            <Icon name="recorded" size={14} /> LIST
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="platform-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 350, background: '#f8fafc', borderRadius: 20, animation: 'pulse 2s infinite' }} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter + layout + search + categoryFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={layout === 'grid' ? 'platform-grid' : ''}
            style={{ display: layout === 'list' ? 'flex' : 'grid', flexDirection: 'column', gap: '1.5rem' }}
          >
            {filtered.map((cls) => (
              <motion.div key={cls._id} layout>
                <RecordedCard cls={cls} layout={layout} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: 24, border: '2px dashed #e2e8f0' }}>
           <Icon name="search" size={48} color="#cbd5e1" />
           <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B', marginTop: '1.5rem' }}>No recordings found</h2>
           <p style={{ color: '#94A3B8' }}>Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}

