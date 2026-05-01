'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroupsPage() {
  const [view, setView] = useState('chat'); // 'chat' or 'expert-directory'
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  const [allGroups, setAllGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (activeChannelId) {
      fetchMessages(activeChannelId);
    }
  }, [activeChannelId]);

  async function initData() {
    try {
      const [allRes, joinedRes] = await Promise.all([
        fetch('/api/v1/community/groups'),
        fetch('/api/v1/community/groups/joined')
      ]);
      
      const allJson = await allRes.json();
      const joinedJson = await joinedRes.json();
      
      if (allJson.success) setAllGroups(allJson.data);
      if (joinedJson.success) {
        setJoinedGroups(joinedJson.data);
        if (joinedJson.data.length > 0 && !activeChannelId) {
          setActiveChannelId(joinedJson.data[0]._id);
        } else if (joinedJson.data.length === 0) {
          setView('expert-directory');
        }
      }
    } catch (err) {
      console.error('Failed to init groups data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(groupId) {
    try {
      const res = await fetch(`/api/v1/community/discussions?groupId=${groupId}`);
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChannelId) return;
    try {
      const res = await fetch('/api/v1/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: 'Group Message', 
          content: messageText, 
          groupId: activeChannelId 
        })
      });
      const json = await res.json();
      if (json.success) {
        setMessages([...messages, json.data]);
        setMessageText('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const res = await fetch(`/api/v1/community/groups/${groupId}/join`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success) {
        const group = allGroups.find(g => g._id === groupId);
        setJoinedGroups([...joinedGroups, group]);
        setActiveChannelId(groupId);
        setView('chat');
      }
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  };

  const activeGroup = useMemo(() => 
    allGroups.find(g => g._id === activeChannelId), 
  [allGroups, activeChannelId]);

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-bg)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="platform-page tribes-page">
      
      {/* ── 1. TRIBE CHANNELS SIDEBAR ── */}
      <aside className={`tribes-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <header className="sidebar-header">
            <h2 className="sidebar-title">INCUBATOR TRIBES</h2>
        </header>

        <div className="sidebar-content custom-scrollbar">
            
            {/* EXPLORE GROUPS BUTTON */}
            <div className="explore-btn-box">
                <button 
                    onClick={() => { setView('expert-directory'); setIsSidebarOpen(false); }}
                    className={`explore-nav-btn ${view === 'expert-directory' ? 'active' : ''}`}
                >
                    <Icon name="search" size={18} color="#fff" stroke={3} />
                    <span>EXPLORE TRIBES</span>
                </button>
            </div>

            {/* MY TRIBES SECTION */}
            <div className="sidebar-section">
                <div className="section-label">MY TRIBES</div>
                <div className="channel-stack">
                    {joinedGroups.map(ch => (
                        <button 
                            key={ch._id}
                            onClick={() => {
                                setView('chat');
                                setActiveChannelId(ch._id);
                                setIsSidebarOpen(false);
                            }}
                            className={`channel-btn ${view === 'chat' && activeChannelId === ch._id ? 'active' : ''}`}
                        >
                            <div className="channel-avatar">
                                {ch.name[0]}
                            </div>
                            <div className="channel-label-group">
                                <span className="channel-label">{ch.name}</span>
                                <span className="channel-mem-count">{ch.privacy.toUpperCase()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </aside>

      {/* ── 2. MAIN AREA ── */}
      <main className="tribes-main">
        
        {view === 'chat' ? (
            <>
                {/* CHAT HEADER */}
                <header className="chat-header">
                    <div className="chat-header-left">
                        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                            <Icon name="menu" size={24} color="#0f172a" stroke={3} />
                        </button>
                        <div className="header-channel-box">
                            <div className="channel-icon-pill">{activeGroup?.name?.[0] || '#'}</div>
                            <div 
                                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                                className="channel-info"
                            >
                                <h3 className="channel-name">#{activeGroup?.name || 'select-tribe'}</h3>
                                <div className="channel-meta">
                                    <span className="host-name">Tribe Hub</span>
                                    <span className="meta-sep">/</span>
                                    <span>Verified Builders</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* FEED AREA */}
                <div className="chat-feed custom-scrollbar">
                    {messages.length === 0 && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                         <Icon name="messageSquare" size={48} stroke={1.5} />
                         <p style={{ marginTop: '1rem', fontWeight: 600 }}>Start the first conversation in #{activeGroup?.name}</p>
                      </div>
                    )}
                    {messages.map((m) => (
                        <div key={m._id} className={`message-row ${m.type === 'me' ? 'me' : 'other'}`}>
                            <div className="message-header">
                                <div className="message-avatar">{m.authorId?.fullName?.[0] || 'U'}</div>
                                <span className="message-user">{m.authorId?.fullName}</span>
                                <span className="message-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            
                            <div className="message-bubble">
                                {m.content}
                            </div>
                        </div>
                    ))}
                    <div style={{ height: '20px' }} />
                </div>

                {/* INPUT AREA */}
                <footer className="chat-footer">
                    <div className="input-pill">
                        <div className="plus-btn">
                            <Icon name="plus" size={20} color="#94a3b8" stroke={2.5} />
                        </div>
                        <input 
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            placeholder={`Message #${activeGroup?.name || 'tribe'}...`} 
                            className="chat-input"
                        />
                        <div className="input-actions">
                            <Icon name="smile" size={20} color="#94a3b8" />
                            <div 
                                onClick={handleSendMessage}
                                className="send-momentum-btn"
                            >
                                <Icon name="send" size={16} color="#fff" stroke={3} />
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        ) : (
            /* DISCOVERY VIEW */
            <div className="explore-container">
                <header className="explore-header">
                     <button className="mobile-explore-back" onClick={() => setIsSidebarOpen(true)}>
                        <Icon name="arrowLeft" size={24} color="#0f172a" stroke={2.5} />
                     </button>
                     <div className="explore-text">
                        <h2 className="explore-title">Curated Tribes</h2>
                        <p className="explore-subtitle">Join specialized cohorts and domain-specific think tanks.</p>
                     </div>
                </header>
                
                <div className="explore-grid custom-scrollbar">
                    {allGroups.map(group => {
                        const isJoined = joinedGroups.some(jg => jg._id === group._id);
                        return (
                          <div key={group._id} className="explore-card">
                              <div className="card-gradient-top">
                                  <div className="card-avatar-box">{group.name[0]}</div>
                                  <div className="card-members-badge">{group.privacy.toUpperCase()}</div>
                              </div>
                              <div className="card-body">
                                  <h3 className="card-name">{group.name}</h3>
                                  <p className="card-desc">{group.description}</p>
                                  <button 
                                      onClick={() => isJoined ? (setView('chat'), setActiveChannelId(group._id)) : handleJoinGroup(group._id)}
                                      className={`join-tribe-btn ${isJoined ? 'joined' : ''}`}
                                  >
                                      {isJoined ? 'VIEW CHANNEL' : 'JOIN TRIBE'}
                                  </button>
                              </div>
                          </div>
                        );
                    })}
                </div>
            </div>
        )}
      </main>

      {/* ── 3. DYNAMIC CONTEXT PANEL ── */}
      <AnimatePresence>
        {isRightPanelOpen && activeGroup && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="context-panel"
          >
            <div className="panel-inner custom-scrollbar">
                <div className="context-box">
                    <h4 className="context-label">ABOUT THIS TRIBE</h4>
                    <p className="context-text">
                        {activeGroup.description || "A high-fidelity environment engineered for strategic high-level discussions among verified industry pioneers."}
                    </p>
                </div>

                <div className="membership-box">
                    <div className="context-label">Tribe Info</div>
                    <div className="founders-stack">
                        <div className="founder-item">
                            <div className="founder-avatar is-host">
                                H
                            </div>
                            <div className="founder-meta">
                                <h5 className="founder-name">Tribe Hub</h5>
                                <p className="founder-role">Automated Host</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={() => setIsRightPanelOpen(false)}
                  className="close-panel-btn"
                >
                    CLOSE PANEL
                </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .tribes-page { display: flex; background: var(--dashboard-bg); overflow: hidden; height: 100vh; font-family: 'Poppins', sans-serif; }
        
        .tribes-sidebar { width: 300px; background: #fcfdfe; border-right: 1.5px solid #f1f5f9; display: flex; flex-direction: column; height: 100%; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000; }
        .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid #f8fafc; }
        .sidebar-title { font-size: 0.85rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: 0.1em; }
        .sidebar-content { flex: 1; padding: 2rem 1.25rem; overflow-y: auto; }
        
        .explore-btn-box { margin-bottom: 2.5rem; }
        .explore-nav-btn { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: none; background: #ef4444; color: #fff; border-radius: 18px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem; font-weight: 950; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2); }
        .explore-nav-btn.active { background: #0f172a; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2); }
        .explore-nav-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(239, 68, 68, 0.3); }

        .sidebar-section { margin-bottom: 3rem; }
        .section-label { font-size: 0.7rem; font-weight: 950; color: #94a3b8; letter-spacing: 0.15em; padding: 0 1.25rem; margin-bottom: 1.5rem; }
        .channel-stack { display: flex; flex-direction: column; gap: 6px; }
        .channel-btn { display: flex; align-items: center; gap: 14px; padding: 12px 18px; border: none; background: transparent; border-radius: 16px; cursor: pointer; transition: all 0.2s; color: #64748b; }
        .channel-btn:hover { background: #fef2f2; color: #ef4444; }
        .channel-btn.active { background: #fff; color: #ef4444; box-shadow: 0 10px 25px rgba(0,0,0,0.04); border: 1.5px solid #fef2f2; }
        .channel-avatar { width: 32px; height: 32px; border-radius: 10px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 950; border: 1.5px solid #f1f5f9; flex-shrink: 0; }
        .channel-label-group { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
        .channel-label { font-size: 0.9rem; font-weight: 850; letter-spacing: -0.01em; }
        .channel-mem-count { font-size: 0.65rem; color: #94a3b8; font-weight: 700; }
        
        .tribes-main { flex: 1; background: var(--dashboard-bg); display: flex; flex-direction: column; min-width: 0; }
        .chat-header { padding: 1rem 2.5rem; border-bottom: 1.5px solid #f8fafc; background: var(--dashboard-bg); display: flex; align-items: center; z-index: 10; }
        .chat-header-left { display: flex; align-items: center; gap: 20px; width: 100%; }
        .mobile-menu-btn { display: none; background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 12px; transition: background 0.2s; }
        .mobile-menu-btn:hover { background: #f8fafc; }
        .header-channel-box { display: flex; align-items: center; gap: 16px; cursor: pointer; }
        .channel-icon-pill { width: 44px; height: 44px; border-radius: 14px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1.2rem; border: 1.5px solid #f1f5f9; }
        .channel-name { margin: 0; font-size: 1.15rem; font-weight: 950; color: #0f172a; letter-spacing: -0.02em; }
        .channel-meta { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #94a3b8; font-weight: 850; margin-top: 4px; }
        .host-name { color: #ef4444; }
        .meta-sep { opacity: 0.3; }

        .chat-feed { flex: 1; padding: 2.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 2rem; background: var(--dashboard-bg); }
        .message-row { display: flex; flex-direction: column; max-width: 85%; }
        .message-row.me { align-self: flex-end; align-items: flex-end; }
        .message-row.other { align-self: flex-start; align-items: flex-start; }
        .message-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .message-avatar { width: 28px; height: 28px; border-radius: 8px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 950; border: 1.5px solid #f1f5f9; }
        .message-user { font-size: 0.85rem; font-weight: 950; color: #0f172a; }
        .message-time { font-size: 0.7rem; color: #cbd5e1; font-weight: 800; }
        .message-bubble { padding: 1.25rem 1.75rem; border-radius: 28px; font-size: 1rem; font-weight: 650; line-height: 1.6; }
        .message-row.me .message-bubble { background: #0f172a; color: #fff; border-bottom-right-radius: 6px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12); }
        .message-row.other .message-bubble { background: #f8fafc; color: #334155; border-bottom-left-radius: 6px; border: 1.5px solid #f1f5f9; }

        .chat-footer { padding: 1.5rem 2.5rem; border-top: 1.5px solid #f8fafc; background: var(--dashboard-bg); z-index: 100; }
        .input-pill { background: #f8fafc; border-radius: 32px; padding: 8px 12px; display: flex; align-items: center; border: 1.5px solid #f1f5f9; max-width: 1000px; margin: 0 auto; transition: all 0.3s; }
        .input-pill:focus-within { background: #fff; border-color: #ef4444; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.08); }
        .plus-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; border-radius: 50%; }
        .plus-btn:hover { background: #f1f5f9; }
        .chat-input { flex: 1; background: transparent; border: none; padding: 0 20px; font-size: 1rem; font-weight: 750; color: #0f172a; outline: none; }
        .input-actions { display: flex; align-items: center; gap: 14px; }
        .send-momentum-btn { width: 44px; height: 44px; border-radius: 16px; background: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25); transition: all 0.2s; }
        .send-momentum-btn:hover { transform: scale(1.05); background: #0f172a; }

        .explore-container { flex: 1; padding: 3rem; overflow-y: auto; background: #fcfdfe; display: flex; flex-direction: column; }
        .explore-header { margin-bottom: 3rem; display: flex; align-items: center; gap: 24px; }
        .mobile-explore-back { display: none; background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 12px; transition: background 0.2s; }
        .explore-title { font-size: 2.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .explore-subtitle { color: #94a3b8; font-weight: 750; font-size: 1.1rem; margin-top: 8px; }
        
        .explore-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2rem; }
        .explore-card { background: #fff; border-radius: 40px; border: 1.5px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.015); overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .explore-card:hover { transform: translateY(-10px); border-color: #ef4444; box-shadow: 0 30px 60px rgba(239, 68, 68, 0.08); }
        .card-gradient-top { height: 120px; background: linear-gradient(135deg, #fef2f2 0%, #fff 100%); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
        .card-avatar-box { width: 56px; height: 56px; border-radius: 18px; background: #fff; color: #ef4444; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1.4rem; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.1); border: 1.5px solid #fef2f2; }
        .card-members-badge { font-size: 0.75rem; font-weight: 950; color: #94a3b8; background: #fff; padding: 8px 14px; border-radius: 12px; border: 1.5px solid #f1f5f9; }
        .card-body { padding: 2.5rem 2rem; text-align: left; }
        .card-name { font-size: 1.3rem; font-weight: 950; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.01em; }
        .card-desc { font-size: 0.95rem; color: #64748b; margin-bottom: 2.5rem; line-height: 1.6; font-weight: 650; min-height: 48px; }
        .join-tribe-btn { width: 100%; background: #0f172a; color: #fff; border: none; padding: 18px; border-radius: 20px; font-size: 0.9rem; font-weight: 950; cursor: pointer; transition: all 0.3s; }
        .join-tribe-btn.joined { background: #f1f5f9; color: #cbd5e1; cursor: default; }
        .explore-card:hover .join-tribe-btn:not(.joined) { background: #ef4444; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.25); }

        .context-panel { background: #fcfdfe; display: flex; flex-direction: column; height: 100%; border-left: 1.5px solid #f1f5f9; box-shadow: -10px 0 40px rgba(0,0,0,0.02); }
        .panel-inner { min-width: 340px; padding: 3rem 2rem; overflow-y: auto; }
        .context-label { font-size: 0.7rem; font-weight: 950; color: #94a3b8; letter-spacing: 0.15em; margin-bottom: 1.75rem; }
        .context-box { background: #fff; border-radius: 28px; padding: 2rem; border: 1.5px solid #f1f5f9; margin-bottom: 2.5rem; }
        .context-text { font-size: 0.95rem; color: #475569; line-height: 1.7; font-weight: 650; margin: 0; }
        .membership-box { margin-bottom: 3rem; }
        .founders-stack { display: flex; flex-direction: column; gap: 1.5rem; }
        .founder-item { display: flex; align-items: center; gap: 16px; }
        .founder-avatar { width: 44px; height: 44px; border-radius: 14px; background: #f1f5f9; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 950; position: relative; border: 1.5px solid #fff; }
        .founder-avatar.is-host { background: #fef2f2; color: #ef4444; }
        .founder-meta { flex: 1; }
        .founder-name { margin: 0; font-size: 0.95rem; font-weight: 950; color: #0f172a; }
        .founder-role { margin: 2px 0 0; font-size: 0.75rem; color: #94a3b8; font-weight: 800; }
        .close-panel-btn { width: 100%; padding: 16px; border-radius: 16px; border: 1.5px solid #f1f5f9; background: #fff; color: #64748b; font-weight: 950; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
        .close-panel-btn:hover { background: #fef2f2; color: #ef4444; border-color: #fef2f2; }

        @media (max-width: 1060px) {
           .tribes-sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); width: 300px; z-index: 1001; box-shadow: 20px 0 80px rgba(0,0,0,0.15); }
           .tribes-sidebar.open { transform: translateX(0); }
           .mobile-menu-btn, .mobile-explore-back { display: flex; }
           .explore-container { padding: 6rem 1.5rem 6rem; }
           .explore-grid { grid-template-columns: 1fr; }
           .chat-header { padding: 6.5rem 1rem 1rem; position: sticky; top: 0; z-index: 200; background: #fff; border-bottom: 1.5px solid #f1f5f9; }
           .chat-footer { padding: 1rem; position: sticky; bottom: 0; border-top: 1.5px solid #f1f5f9; }
           .context-panel { display: none; }
           .chat-feed { padding: 1.5rem; }
           .message-bubble { font-size: 0.9rem; padding: 1rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}

