'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/learning-experience.css';

function LiveClassCard({ cls, onJoin }) {
  const isLive = cls.status === 'live';
  const isCompleted = cls.status === 'completed';
  const startTime = new Date(cls.startTime);
  const duration = cls.endTime ? Math.round((new Date(cls.endTime) - startTime) / 60000) : 60;

  return (
    <div className="platform-card-v" style={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--dashboard-bg)',
    }}>
      {/* Thumbnail Placeholder */}
      <div style={{ 
        position: 'relative', 
        height: '200px', 
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon name="live" size={48} color="rgba(255,255,255,0.2)" />
        <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px', zIndex: 6 }}>
          {isLive && (
            <span style={{ background:'#ef4444', color:'#fff', borderRadius:'20px', padding:'4px 10px', fontSize:'0.7rem', fontWeight:800, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 6px rgba(239,68,68,0.4)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'pulse 1.5s infinite' }} />
              LIVE
            </span>
          )}
          <span style={{ background:'rgba(0,0,0,0.6)', color:'#fff', backdropFilter:'blur(4px)', padding:'4px 10px', borderRadius:'12px', fontSize:'0.7rem', fontWeight:600 }}>
            {cls.category || 'Masterclass'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px', color: '#111', lineHeight: 1.3 }}>{cls.title}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {cls.description}
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="user" size={14} color="#94A3B8" /> {cls.instructorId?.name || 'Top Mentor'}
          </span>
          <span style={{ fontSize: '0.8rem', color: isLive ? '#ef4444' : '#666', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="clock" size={14} color={isLive ? "#ef4444" : "#94A3B8"} /> 
            {isLive ? 'Started' : startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({duration} min)
          </span>
        </div>
        
        {/* Footer actions */}
        <div style={{ marginTop: '20px', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="users" size={14} color="#94A3B8" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>{cls.attendees?.length || 0} JOINED</span>
          </div>

          {isLive ? (
            <button 
              onClick={() => onJoin(cls._id)} 
              style={{ background: '#7A1F2B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(122, 31, 43, 0.2)' }}
            >
              JOIN NOW
            </button>
          ) : isCompleted ? (
             <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700 }}>COMPLETED</span>
          ) : (
            <button 
              onClick={() => alert('Reminder set!')} 
              style={{ background: 'transparent', color: '#111', border: '1.5px solid #e2e8f0', padding: '8px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
            >
              REMIND ME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveClassesPage() {
  const router = useRouter();
  const [liveClasses, setLiveClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    async function fetchLiveClasses() {
      try {
        const res = await fetch('/api/v1/learning/live');
        const json = await res.json();
        if (json.success) setLiveClasses(json.data);
      } catch (err) {
        console.error('Failed to fetch live classes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLiveClasses();
  }, []);

  const joinClass = async (id) => {
    try {
      const res = await fetch(`/api/v1/learning/live/${id}/join`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        window.open(json.data.meetingLink || json.data.meetingUrl, '_blank');
      }
    } catch (err) {
      alert('Failed to join session.');
    }
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // Assuming join code maps to an ID or a specific room
    router.push(`/dashboard/learning/live/${joinCode.trim()}`);
  };

  const filteredClasses = liveClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cls.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'live') return matchesSearch && cls.status === 'live';
    if (filter === 'upcoming') return matchesSearch && cls.status === 'scheduled';
    if (filter === 'all') return matchesSearch && cls.status !== 'cancelled';
    return matchesSearch;
  });

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Live Experience</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Join interactive live sessions with Top Mentors & Founders.</p>
        </div>
        
        <form onSubmit={handleJoinByCode} style={{ background: 'var(--dashboard-bg)', padding: '1rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '350px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Join with Code</label>
              <input 
                type="text" 
                placeholder="e.g. xyz-123-abc"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                style={{ width: '100%', border: 'none', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <button 
              type="submit"
              style={{ marginTop: 'auto', background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', height: '42px' }}
            >
              Join
            </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', background: 'var(--dashboard-bg)', padding: '0.75rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'live', 'upcoming'].map(f => (
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
                transition: '0.2s',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #f1f5f9', padding: '10px 16px 10px 40px', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s' }}
          />
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            <Icon name="search" size={16} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="platform-grid">
           {[1, 2, 3].map(i => <div key={i} style={{ height: 400, background: '#f8fafc', borderRadius: 16, animation: 'pulse 2s infinite' }} />)}
        </div>
      ) : filteredClasses.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div 
            layout
            className="platform-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {filteredClasses.map((cls) => (
              <motion.div key={cls._id} layout>
                <LiveClassCard cls={cls} onJoin={joinClass} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div style={{ background: '#f8fafc', borderRadius: 24, padding: '6rem 2rem', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
            <Icon name="live" size={48} color="#cbd5e1" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B', marginTop: '1.5rem' }}>No sessions found</h3>
            <p style={{ color: '#94A3B8', fontSize:'1rem' }}>Try adjusting your search or filters to find upcoming sessions.</p>
        </div>
      )}
    </div>
  );
}

