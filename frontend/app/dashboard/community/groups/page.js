'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_GROUPS = [
  {
    _id: 'g1',
    name: 'SaaS Pioneers',
    description: 'Exclusive cohort for founders building B2B SaaS with high-signal growth strategies and enterprise scaling insights.',
    privacy: 'public',
    members: 45
  },
  {
    _id: 'g2',
    name: 'FinTech Mavericks',
    description: 'Navigating the complex landscape of digital finance, regulatory compliance, and disruptive payment solutions.',
    privacy: 'private',
    members: 32
  },
  {
    _id: 'g3',
    name: 'DeepTech Council',
    description: 'Engineers and researchers pushing the boundaries of AI, robotics, and hardware. Focused on R&D to commercialization.',
    privacy: 'public',
    members: 28
  },
  {
    _id: 'g4',
    name: 'Growth Alchemists',
    description: 'A tactical think-tank for marketing leaders and growth hackers obsessed with virality and unit economics.',
    privacy: 'public',
    members: 120
  },
  {
    _id: 'g5',
    name: 'ClimateTech Alliance',
    description: 'Founders building for sustainability, carbon capture, and renewable energy. Focused on high-impact environmental engineering.',
    privacy: 'private',
    members: 19
  },
  {
    _id: 'g6',
    name: 'EdTech Innovators',
    description: 'Revolutionizing the learning experience through gamification, personalized AI tutoring, and global knowledge access.',
    privacy: 'public',
    members: 54
  }
];

const DUMMY_GROUPS_WITH_PERMS = DUMMY_GROUPS.map((g, idx) => ({
  ...g,
  canChat: idx % 2 === 0,
}));

const DUMMY_MESSAGES = {
  g1: [
    {
      _id: 'm1',
      content: "Anyone here using a multi-tenant DB architecture? Scaling our Postgres instance is getting expensive.",
      authorId: { fullName: "Ethan Hunt" },
      createdAt: "2024-05-01T09:00:00Z"
    },
    {
      _id: 'm2',
      content: "Check out Citus for Postgres. It helps with horizontal scaling. We saved 40% on infrastructure after switching.",
      authorId: { fullName: "Sarah Jenkins" },
      createdAt: "2024-05-01T09:15:00Z"
    },
    {
      _id: 'm3',
      content: "Thanks Sarah! I'll look into it. Are there any migration gotchas?",
      authorId: { fullName: "Ethan Hunt" },
      createdAt: "2024-05-01T09:20:00Z"
    }
  ],
  g2: [
    {
      _id: 'm4',
      content: "Does anyone have a contact at the RBI for sandbox applications? We're stuck in the initial review phase.",
      authorId: { fullName: "Vikram Reddy" },
      createdAt: "2024-05-01T08:30:00Z"
    }
  ]
};

export default function GroupsPage() {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [allGroups, setAllGroups] = useState(DUMMY_GROUPS_WITH_PERMS);
  const [joinedGroups, setJoinedGroups] = useState([DUMMY_GROUPS_WITH_PERMS[0], DUMMY_GROUPS_WITH_PERMS[1]]);
  const [messages, setMessages] = useState(DUMMY_MESSAGES['g1']);
  const [loading, setLoading] = useState(false);

  const chatGroups = useMemo(() => joinedGroups, [joinedGroups]);

  useEffect(() => {
    // initData();
    if (!activeChannelId && joinedGroups.length > 0) {
      setActiveChannelId(joinedGroups[0]._id);
    }
  }, [activeChannelId, joinedGroups]);

  useEffect(() => {
    if (activeChannelId) {
      // fetchMessages(activeChannelId);
      setMessages(DUMMY_MESSAGES[activeChannelId] || []);
    }
  }, [activeChannelId]);

  async function initData() {
    // try {
    //   const [allRes, joinedRes] = await Promise.all([
    //     fetch('/api/v1/community/groups'),
    //     fetch('/api/v1/community/groups/joined')
    //   ]);
    //   
    //   const allJson = await allRes.json();
    //   const joinedJson = await joinedRes.json();
    //   
    //   if (allJson.success) setAllGroups(allJson.data);
    //   if (joinedJson.success) {
    //     setJoinedGroups(joinedJson.data);
    //     if (joinedJson.data.length > 0 && !activeChannelId) {
    //       setActiveChannelId(joinedJson.data[0]._id);
    //     } else if (joinedJson.data.length === 0) {
    //       setView('expert-directory');
    //     }
    //   }
    // } catch (err) {
    //   console.error('Failed to init groups data:', err);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function fetchMessages(groupId) {
    // try {
    //   const res = await fetch(`/api/v1/community/discussions?groupId=${groupId}`);
    //   const json = await res.json();
    //   if (json.success) setMessages(json.data);
    // } catch (err) {
    //   console.error('Failed to fetch messages:', err);
    // }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChannelId) return;
    const currentGroup = allGroups.find(g => g._id === activeChannelId);
    if (!currentGroup?.canChat) {
      alert('You do not have permission to message in this group. Admins have restricted chat here.');
      return;
    }
    const newMessage = {
      _id: Date.now().toString(),
      content: messageText,
      authorId: { fullName: "Founder (You)" },
      createdAt: new Date().toISOString(),
      type: 'me'
    };
    setMessages([...messages, newMessage]);
    setMessageText('');

    // try {
    //   const res = await fetch('/api/v1/community/discussions', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       title: 'Group Message', 
    //       content: messageText, 
    //       groupId: activeChannelId 
    //     })
    //   });
    //   const json = await res.json();
    //   if (json.success) {
    //     setMessages([...messages, json.data]);
    //     setMessageText('');
    //   }
    // } catch (err) {
    //   console.error('Failed to send message:', err);
    // }
  };

  const handleJoinGroup = async (groupId) => {
    const group = allGroups.find(g => g._id === groupId);
    setJoinedGroups([...joinedGroups, group]);
    setActiveChannelId(groupId);

    // try {
    //   const res = await fetch(`/api/v1/community/groups/${groupId}/join`, {
    //     method: 'POST'
    //   });
    //   const json = await res.json();
    //   if (json.success) {
    //     const group = allGroups.find(g => g._id === groupId);
    //     setJoinedGroups([...joinedGroups, group]);
    //     setActiveChannelId(groupId);
    //     setView('chat');
    //   }
    // } catch (err) {
    //   console.error('Failed to join group:', err);
    // }
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
      <div className="tribes-shell">
      <header className="tribes-topbar">
        <div>
          <h1 className="tribes-title">Groups</h1>
          <p className="tribes-subtitle">Joined groups only. Chat permission is controlled by admins.</p>
        </div>
      </header>

      {/* ── 1. TRIBE CHANNELS SIDEBAR ── */}
      <aside className={`tribes-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <header className="sidebar-header">
            <h2 className="sidebar-title">MY GROUPS</h2>
        </header>

        <div className="sidebar-content custom-scrollbar">
            {/* MY TRIBES SECTION */}
            <div className="sidebar-section">
                <div className="section-label">MY TRIBES</div>
                <div className="channel-stack">
                    {chatGroups.map(ch => (
                        <button 
                            key={ch._id}
                            onClick={() => {
                                setActiveChannelId(ch._id);
                                setIsSidebarOpen(false);
                            }}
                            className={`channel-btn ${activeChannelId === ch._id ? 'active' : ''}`}
                        >
                            <div className="channel-avatar">
                                {ch.name[0]}
                            </div>
                            <div className="channel-label-group">
                                <span className="channel-label">{ch.name}</span>
                                <span className="channel-mem-count">{ch.canChat ? 'Chat open' : 'Read only'}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </aside>

      {/* ── 2. MAIN AREA ── */}
      <main className="tribes-main">
        <header className="chat-header">
          <div className="chat-header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Icon name="menu" size={20} color="#0f172a" stroke={3} />
            </button>
            <div className="header-channel-box">
              <div className="channel-icon-pill">{activeGroup?.name?.[0] || '#'}</div>
              <div className="channel-info">
                <h3 className="channel-name">{activeGroup?.name || 'Select a group'}</h3>
                <div className="channel-meta">
                  <span className="host-name">{activeGroup?.privacy?.toUpperCase() || 'PUBLIC'}</span>
                  <span className="meta-sep">/</span>
                  <span>{activeGroup?.canChat ? 'Chat open' : 'Read only'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="chat-feed custom-scrollbar">
          {!activeGroup ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <Icon name="messageSquare" size={42} stroke={1.5} />
              <p style={{ marginTop: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>Pick a group to start chatting</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <Icon name="messageSquare" size={42} stroke={1.5} />
              <p style={{ marginTop: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>No messages yet in {activeGroup.name}</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m._id} className={`message-row ${m.type === 'me' ? 'me' : 'other'}`}>
                <div className="message-header">
                  <div className="message-avatar">{m.authorId?.fullName?.[0] || 'U'}</div>
                  <span className="message-user">{m.authorId?.fullName}</span>
                  <span className="message-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="message-bubble">{m.content}</div>
              </div>
            ))
          )}
        </div>

        <footer className="chat-footer">
          {!activeGroup?.canChat && activeGroup && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '16px', padding: '0.85rem 1rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 950, color: '#7A1F2B', letterSpacing: '-0.01em' }}>Read only</p>
            </div>
          )}
          <div className="input-pill">
            <div className="plus-btn">
              <Icon name="plus" size={18} color="#94a3b8" stroke={2.5} />
            </div>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              disabled={!activeGroup?.canChat}
              placeholder={activeGroup?.canChat ? `Message ${activeGroup?.name || 'group'}...` : 'Chat disabled'}
              className="chat-input"
            />
            <div className="input-actions">
              <div onClick={handleSendMessage} className="send-momentum-btn">
                <Icon name="send" size={15} color="#fff" stroke={3} />
              </div>
            </div>
          </div>
        </footer>
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
      </div>

      <style jsx global>{`
        .tribes-page { display: flex; background: var(--dashboard-bg); overflow: hidden; height: 100vh; font-family: 'Poppins', sans-serif; }
        .tribes-shell { display: flex; width: 100%; height: 100%; }
        .tribes-topbar { display: none; }
        
        .tribes-sidebar { width: 300px; background: #fcfdfe; border-right: 1.5px solid #f1f5f9; display: flex; flex-direction: column; height: 100%; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000; }
        .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid #f8fafc; }
        .sidebar-title { font-size: 0.85rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: 0.1em; }
        .sidebar-content { flex: 1; padding: 2rem 1.25rem; overflow-y: auto; }
        
        .sidebar-section { margin-bottom: 3rem; }
        .section-label { font-size: 0.65rem; font-weight: 950; color: #94a3b8; letter-spacing: 0.16em; padding: 0 1.25rem; margin-bottom: 1rem; }
        .channel-stack { display: flex; flex-direction: column; gap: 6px; }
        .channel-btn { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: none; background: transparent; border-radius: 14px; cursor: pointer; transition: all 0.2s; color: #64748b; }
        .channel-btn:hover { background: #fef2f2; color: #ef4444; }
        .channel-btn.active { background: #fff; color: #ef4444; box-shadow: 0 10px 25px rgba(0,0,0,0.04); border: 1.5px solid #fef2f2; }
        .channel-avatar { width: 28px; height: 28px; border-radius: 9px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 950; border: 1.5px solid #f1f5f9; flex-shrink: 0; }
        .channel-label-group { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
        .channel-label { font-size: 0.8rem; font-weight: 850; letter-spacing: -0.01em; line-height: 1.1; }
        .channel-mem-count { font-size: 0.6rem; color: #94a3b8; font-weight: 700; }
        
        .tribes-main { flex: 1; background: var(--dashboard-bg); display: flex; flex-direction: column; min-width: 0; }
        .chat-header { padding: 0.9rem 1.5rem; border-bottom: 1.5px solid #f8fafc; background: var(--dashboard-bg); display: flex; align-items: center; z-index: 10; }
        .chat-header-left { display: flex; align-items: center; gap: 14px; width: 100%; }
        .mobile-menu-btn { display: none; background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 12px; transition: background 0.2s; }
        .mobile-menu-btn:hover { background: #f8fafc; }
        .header-channel-box { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .channel-icon-pill { width: 38px; height: 38px; border-radius: 12px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1rem; border: 1.5px solid #f1f5f9; }
        .channel-name { margin: 0; font-size: 0.95rem; font-weight: 950; color: #0f172a; letter-spacing: -0.02em; }
        .channel-meta { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; color: #94a3b8; font-weight: 850; margin-top: 3px; }
        .host-name { color: #ef4444; }
        .meta-sep { opacity: 0.3; }

        .chat-feed { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; background: var(--dashboard-bg); }
        .message-row { display: flex; flex-direction: column; max-width: 78%; }
        .message-row.me { align-self: flex-end; align-items: flex-end; }
        .message-row.other { align-self: flex-start; align-items: flex-start; }
        .message-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .message-avatar { width: 24px; height: 24px; border-radius: 8px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 950; border: 1.5px solid #f1f5f9; }
        .message-user { font-size: 0.75rem; font-weight: 950; color: #0f172a; }
        .message-time { font-size: 0.62rem; color: #cbd5e1; font-weight: 800; }
        .message-bubble { padding: 0.9rem 1.1rem; border-radius: 20px; font-size: 0.88rem; font-weight: 650; line-height: 1.55; }
        .message-row.me .message-bubble { background: #0f172a; color: #fff; border-bottom-right-radius: 6px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12); }
        .message-row.other .message-bubble { background: #f8fafc; color: #334155; border-bottom-left-radius: 6px; border: 1.5px solid #f1f5f9; }

          .chat-footer { padding: 1rem 1.5rem; border-top: 1.5px solid #f8fafc; background: var(--dashboard-bg); z-index: 100; position: sticky; bottom: 0; }
          .input-pill { background: #f8fafc; border-radius: 24px; padding: 6px 10px; display: flex; align-items: center; border: 1.5px solid #f1f5f9; max-width: 1000px; margin: 0 auto; transition: all 0.3s; }
        .input-pill:focus-within { background: #fff; border-color: #ef4444; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.08); }
          .plus-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; border-radius: 50%; }
        .plus-btn:hover { background: #f1f5f9; }
          .chat-input { flex: 1; background: transparent; border: none; padding: 0 14px; font-size: 0.9rem; font-weight: 700; color: #0f172a; outline: none; }
          .input-actions { display: flex; align-items: center; gap: 10px; }
          .send-momentum-btn { width: 40px; height: 40px; border-radius: 14px; background: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25); transition: all 0.2s; }
        .send-momentum-btn:hover { transform: scale(1.05); background: #0f172a; }

          .context-panel { display: none; }

        @media (max-width: 1060px) {
           .tribes-sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); width: 300px; z-index: 1001; box-shadow: 20px 0 80px rgba(0,0,0,0.15); }
           .tribes-sidebar.open { transform: translateX(0); }
            .mobile-menu-btn { display: flex; }
            .tribes-topbar { display: block; padding: 5.5rem 1rem 1rem; }
            .tribes-title { margin: 0; font-size: 2rem; font-weight: 950; color: #111; letter-spacing: -0.03em; }
            .tribes-subtitle { margin: 6px 0 0; color: #64748b; font-size: 0.8rem; font-weight: 600; }
            .chat-header { padding: 1rem; position: sticky; top: 0; z-index: 200; background: #fff; border-bottom: 1.5px solid #f1f5f9; }
            .chat-footer { padding: 1rem; position: sticky; bottom: 0; border-top: 1.5px solid #f1f5f9; }
            .chat-feed { padding: 1rem; }
            .message-bubble { font-size: 0.86rem; padding: 0.85rem 1rem; }
        }
      `}</style>
    </div>
  );
}

