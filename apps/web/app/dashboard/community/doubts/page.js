'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { AnimatePresence } from 'framer-motion';

export default function DoubtsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showNewDoubt, setShowNewDoubt] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const res = await fetch('/api/v1/community/questions');
      const json = await res.json();
      if (json.success) setQuestions(json.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/community/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          tags: formData.tags.split(',').map(t => t.trim()) 
        })
      });
      const json = await res.json();
      if (json.success) {
        setQuestions([json.data, ...questions]);
        setShowNewDoubt(false);
        setFormData({ title: '', content: '', tags: '' });
      }
    } catch (err) {
      console.error('Failed to ask question:', err);
    }
  };

  const filtered = questions.filter(q => {
    if (filter === 'all') return true;
    if (filter === 'solved') return !!q.acceptedAnswerId;
    if (filter === 'ongoing') return !q.acceptedAnswerId;
    return true;
  });

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page doubts-hub-page">
      
      {/* ── MAIN CONTENT ── */}
      <main className="doubts-main custom-scrollbar">
        
        {/* HIGH-INTENSITY HEADER */}
        <header className="doubts-hero-header">
          <div className="hero-content">
            <h1 className="hero-title">Expert <span className="red-glow">Q&A Hub</span></h1>
            <div className="resolution-metrics-pill">
               <div className="pulse-dot"></div>
               <span className="metric-text">2.4h Average Resolution Speed</span>
            </div>
          </div>
          
          <div className="hero-actions">
            <div className="filter-nav-pill">
               <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>ALL TICKETS</button>
               <button onClick={() => setFilter('ongoing')} className={filter === 'ongoing' ? 'active' : ''}>ACTIVE</button>
               <button onClick={() => setFilter('solved')} className={filter === 'solved' ? 'active' : ''}>SOLVED</button>
            </div>

            <button 
                onClick={() => setShowNewDoubt(true)}
                className="raise-ticket-btn"
            >
                <Icon name="plus" size={18} color="#fff" stroke={3} /> 
                <span className="btn-long-text">OPEN NEW TICKET</span>
            </button>
          </div>
        </header>

        {/* PERFORMANCE STRIP */}
        <div className="performance-stats-strip">
           <div className="performance-grid">
              <div className="performance-card">
                 <div className="perf-label">ACTIVE QUEUE</div>
                 <div className="perf-value">{questions.filter(q => !q.acceptedAnswerId).length} <span className="perf-unit">Issues</span></div>
                 <div className="perf-trend negative">
                    <Icon name="trendingUp" size={14} /> Live feed active
                 </div>
              </div>
              <div className="performance-card">
                 <div className="perf-label">EXPERTS ONLINE</div>
                 <div className="perf-value">08 <span className="perf-unit">Live</span></div>
                 <div className="perf-trend positive">
                    <Icon name="zap" size={14} /> Instant response active
                 </div>
              </div>
              <div className="performance-card">
                 <div className="perf-label">GLOBAL TRUST</div>
                 <div className="perf-value">4.9<span className="perf-unit">/5.0</span></div>
                 <div className="perf-trend neutral">
                    <Icon name="users" size={14} /> Based on 400+ reviews
                 </div>
              </div>
           </div>
        </div>

        {/* TICKETS FEED */}
        <div className="tickets-feed-section">
          <div className="feed-header-alt">
             <h3 className="feed-label-main">Resolution Feed</h3>
             <div className="feed-sort">Most Recent <Icon name="chevronDown" size={14} /></div>
          </div>

          <div className="tickets-stack">
            {filtered.map(t => (
              <div 
                key={t._id} 
                className="ticket-interactive-card"
              >
                <div className="ticket-avatar-status">
                  <div className={`status-icon-box ${t.acceptedAnswerId ? 'solved' : 'ongoing'}`}>
                    <Icon name={t.acceptedAnswerId ? 'checkCircle' : 'helpCircle'} size={32} stroke={2.5} />
                  </div>
                  <div className="vertical-line"></div>
                </div>

                <div className="ticket-main-body">
                  <div className="ticket-row-top">
                    <div className="name-group">
                       <span className="ticket-id-badge">#{t._id.slice(-4).toUpperCase()}</span>
                       <h3 className="ticket-headline">{t.title}</h3>
                    </div>
                    <div className={`status-tag-pill ${t.acceptedAnswerId ? 'solved' : 'ongoing'}`}>
                        {t.acceptedAnswerId ? 'SOLVED' : 'ONGOING'}
                    </div>
                  </div>
                  
                  <div className="ticket-row-footer">
                    <div className="expert-assignment">
                        <div className="assignee-avatar">{t.authorId?.fullName?.[0] || 'U'}</div>
                        <div className="assignee-meta">
                           <span className="assignee-name">{t.authorId?.fullName || 'Anonymous'}</span>
                           <span className="assignee-role">Verified Builder</span>
                        </div>
                    </div>
                    
                    <div className="ticket-meta-pills">
                       <div className="meta-pill-item category">
                          <Icon name="tag" size={12} /> {t.tags?.[0] || 'General'}
                       </div>
                       <div className="meta-pill-item time">
                          <Icon name="clock" size={12} /> {new Date(t.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                    
                    <button className="view-resolution-btn">
                       VIEW STATUS <Icon name="arrowRight" size={14} stroke={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* NEW TICKET MODAL */}
      <AnimatePresence>
        {showNewDoubt && (
          <div className="modal-overlay" onClick={() => setShowNewDoubt(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Ask the Experts</h2>
              <form onSubmit={handleAskQuestion}>
                <div className="input-group">
                  <label>Problem Headline</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Seed Stage Equity Dilution Clarification" 
                  />
                </div>
                <div className="input-group">
                  <label>Context / Details</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Describe your hurdle in detail..." 
                  />
                </div>
                <div className="input-group">
                  <label>Tags (comma separated)</label>
                  <input 
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g. Finance, Equity, Seed" 
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowNewDoubt(false)} className="cancel-btn">CANCEL</button>
                  <button type="submit" className="submit-btn">SUBMIT TICKET</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .doubts-hub-page { background: var(--dashboard-bg); min-height: 100vh; font-family: 'Poppins', sans-serif; }
        .doubts-main { width: 100%; overflow-y: auto; height: calc(100vh - 4.5rem); }
        
        .doubts-hero-header { padding: 3rem 4rem 2rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 2rem; background: var(--dashboard-bg); }
        .hero-title { font-size: 3.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.05em; }
        .red-glow { color: #ef4444; text-shadow: 0 0 30px rgba(239, 68, 68, 0.1); }
        .resolution-metrics-pill { background: #fef2f2; border: 1.5px solid #fef2f2; padding: 10px 24px; border-radius: 20px; display: inline-flex; align-items: center; gap: 12px; margin-top: 1.25rem; }
        .pulse-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        .metric-text { font-size: 0.95rem; font-weight: 850; color: #ef4444; letter-spacing: -0.01em; }
        
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .filter-nav-pill { display: flex; background: #f8fafc; padding: 6px; border-radius: 20px; border: 1.5px solid #f1f5f9; }
        .filter-nav-pill button { padding: 12px 24px; border-radius: 16px; border: none; background: transparent; color: #64748b; font-size: 0.85rem; font-weight: 950; cursor: pointer; transition: all 0.3s; }
        .filter-nav-pill button.active { background: #0f172a; color: #fff; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15); }
        
        .raise-ticket-btn { background: #ef4444; color: #fff; border: none; padding: 18px 36px; border-radius: 20px; font-weight: 950; font-size: 0.95rem; box-shadow: 0 15px 35px rgba(239, 68, 68, 0.25); cursor: pointer; display: flex; align-items: center; gap: 14px; transition: all 0.3s; }
        .raise-ticket-btn:hover { background: #0f172a; transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }

        .performance-stats-strip { padding: 0 4rem 3rem; }
        .performance-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .performance-card { background: var(--dashboard-bg); padding: 2.5rem; border-radius: 40px; border: 1.5px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.01); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .performance-card:hover { transform: translateY(-8px); border-color: #ef4444; box-shadow: 0 30px 60px rgba(239, 68, 68, 0.08); }
        .perf-label { font-size: 0.8rem; font-weight: 950; color: #94a3b8; letter-spacing: 0.15em; margin-bottom: 12px; }
        .perf-value { font-size: 2.25rem; font-weight: 950; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 8px; }
        .perf-unit { font-size: 1rem; color: #64748b; font-weight: 750; margin-left: 6px; }
        .perf-trend { font-size: 0.85rem; font-weight: 900; display: flex; align-items: center; gap: 8px; }
        .perf-trend.negative { color: #ef4444; }
        .perf-trend.positive { color: #10b981; }
        .perf-trend.neutral { color: #94a3b8; }

        .tickets-feed-section { padding: 0 4rem 10rem; }
        .feed-header-alt { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .feed-label-main { font-size: 1.4rem; font-weight: 950; color: #0f172a; letter-spacing: -0.02em; }
        .feed-sort { font-size: 0.9rem; font-weight: 850; color: #64748b; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        
        .tickets-stack { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1400px; }
        .ticket-interactive-card { background: var(--dashboard-bg); border-radius: 32px; padding: 1.8rem 2.2rem; border: 1px solid #f1f5f9; display: flex; gap: 2rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .ticket-interactive-card:hover { border-color: #ef4444; box-shadow: 0 40px 80px rgba(239, 68, 68, 0.08); }
        
        .ticket-avatar-status { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .status-icon-box { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 10px 20px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; }
        .status-icon-box.solved { background: #f0fdf4; color: #10b981; }
        .status-icon-box.ongoing { background: #fef2f2; color: #ef4444; }
        .vertical-line { width: 4px; flex: 1; background: #f8fafc; border-radius: 10px; min-height: 40px; }
        
        .ticket-main-body { flex: 1; }
        .ticket-row-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .name-group { display: flex; align-items: center; gap: 24px; }
        .ticket-id-badge { font-size: 0.9rem; font-weight: 950; background: #f1f5f9; padding: 8px 16px; border-radius: 14px; color: #64748b; }
        .ticket-headline { font-size: 1.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.02em; }
        
        .status-tag-pill { font-size: 0.75rem; font-weight: 950; padding: 8px 20px; border-radius: 14px; letter-spacing: 0.1em; }
        .status-tag-pill.solved { background: #f0fdf4; color: #16a34a; }
        .status-tag-pill.ongoing { background: #fef2f2; color: #ef4444; }

        .ticket-row-footer { display: flex; align-items: center; gap: 3rem; flex-wrap: wrap; }
        .expert-assignment { display: flex; align-items: center; gap: 16px; }
        .assignee-avatar { width: 44px; height: 44px; border-radius: 14px; background: var(--dashboard-bg); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 950; color: #0f172a; border: 1.5px solid #f1f5f9; }
        .assignee-meta { display: flex; flex-direction: column; }
        .assignee-name { font-size: 1rem; font-weight: 950; color: #0f172a; }
        .assignee-role { font-size: 0.75rem; color: #94a3b8; font-weight: 850; }
        
        .ticket-meta-pills { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .meta-pill-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 850; color: #64748b; background: var(--dashboard-bg); padding: 8px 16px; border-radius: 14px; border: 1.5px solid #f1f5f9; }
        
        .view-resolution-btn { margin-left: auto; background: transparent; border: none; font-size: 0.9rem; font-weight: 950; color: #0f172a; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; padding: 12px 24px; border-radius: 16px; }
        .view-resolution-btn:hover { background: var(--dashboard-bg); color: #ef4444; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: var(--dashboard-bg); width: 600px; max-width: 90vw; padding: 3rem; border-radius: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.2); }
        .modal-title { font-size: 2rem; font-weight: 950; color: #0f172a; margin-bottom: 2rem; }
        .input-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 0.8rem; font-weight: 950; color: #94a3b8; letter-spacing: 0.1em; }
        .input-group input, .input-group textarea { padding: 16px 20px; border-radius: 16px; border: 1.5px solid #f1f5f9; background: var(--dashboard-bg); font-size: 1rem; font-weight: 700; color: #0f172a; outline: none; }
        .input-group input:focus, .input-group textarea:focus { border-color: #ef4444; background: var(--dashboard-bg); }
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .cancel-btn { flex: 1; padding: 18px; border-radius: 20px; border: 1.5px solid #f1f5f9; background: var(--dashboard-bg); color: #64748b; font-weight: 950; cursor: pointer; }
        .submit-btn { flex: 2; padding: 18px; border-radius: 20px; border: none; background: #ef4444; color: #fff; font-weight: 950; cursor: pointer; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2); }

        @media (max-width: 1060px) {
          .doubts-hero-header { padding: 6.5rem 1.25rem 1rem; flex-direction: column; align-items: flex-start; gap: 1.2rem; }
          .hero-title { font-size: 2.25rem; }
          .performance-stats-strip { padding: 0 1.25rem 2.5rem; }
          .performance-grid { grid-template-columns: 1fr; gap: 1rem; }
          .tickets-feed-section { padding: 0 1.25rem 8rem; }
          .ticket-interactive-card { padding: 1.25rem; flex-direction: column; gap: 1.25rem; border-radius: 24px; }
          .ticket-avatar-status { flex-direction: row; align-items: center; width: 100%; }
          .vertical-line { height: 4px; width: 100%; min-height: auto; }
          .ticket-row-top { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .name-group { flex-direction: column; align-items: flex-start; gap: 12px; }
          .ticket-headline { font-size: 1.2rem; }
          .ticket-row-footer { gap: 2rem; }
          .view-resolution-btn { width: 100%; justify-content: center; background: #0f172a; color: #fff; margin-top: 1rem; border-radius: 20px; }
          .raise-ticket-btn { width: 62px; height: 62px; padding: 0; border-radius: 50%; position: fixed; bottom: 2.5rem; right: 1.5rem; z-index: 100; justify-content: center; box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4); }
          .raise-ticket-btn .btn-long-text { display: none; }
        }
      `}</style>
    </div>
  );
}

