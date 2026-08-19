'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '@/components/ui/Icon';
import { getCurrentUser } from '@/lib/auth';
import { getGroups, getGroupMessages, sendGroupMessage } from '@/lib/community';
import '@/styles/community-discussions.css';

const DEFAULT_GROUPS = [
  {
    _id: 'saas-pioneers',
    name: 'SaaS Pioneers',
    description: 'Exclusive group for SaaS founders scaling B2B solutions.',
    privacy: 'public',
    members: 48,
    canChat: true,
    lastMsg: 'Check out the new pricing models discussion!',
    time: '10:42 AM',
  },
  {
    _id: 'fintech-mavericks',
    name: 'FinTech Mavericks',
    description: 'Digital finance, regulatory updates, and banking APIs.',
    privacy: 'admin-only',
    members: 35,
    canChat: false,
    lastMsg: 'RBI compliance guidelines update document attached.',
    time: 'Yesterday',
  },
  {
    _id: 'deeptech-council',
    name: 'DeepTech Council',
    description: 'Engineers & researchers building AI and robotics.',
    privacy: 'public',
    members: 29,
    canChat: true,
    lastMsg: 'Anyone testing Llama 3 for local inference?',
    time: 'Yesterday',
  },
  {
    _id: 'growth-alchemists',
    name: 'Growth Alchemists',
    description: 'GTM strategies, viral loops, and marketing tactics.',
    privacy: 'public',
    members: 112,
    canChat: true,
    lastMsg: 'Our CAC dropped 30% after implementing referral loops.',
    time: '2 days ago',
  },
  {
    _id: 'official-announcements',
    name: 'Official Announcements',
    description: 'Official platform news and incubator announcements.',
    privacy: 'admin-only',
    members: 240,
    canChat: false,
    lastMsg: 'Cohort #4 Application Deadline extended to Friday.',
    time: '3 days ago',
  },
];

const DEFAULT_MESSAGES = {
  'saas-pioneers': [
    {
      _id: 'm1',
      content: 'Welcome to SaaS Pioneers. Feel free to share your product metrics or ask for feedback.',
      authorId: { fullName: 'Arjun Verma', role: 'mentor' },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      _id: 'm2',
      content: 'Anyone here scaling multi-tenant Postgres? Looking for advice on partitioning strategies.',
      authorId: { fullName: 'Rahul Sharma', role: 'founder' },
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      _id: 'm3',
      content: 'Check out Citus extension for Postgres. We saved 40% on infra cost.',
      authorId: { fullName: 'Sarah Jenkins', role: 'cofounder' },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  'fintech-mavericks': [
    {
      _id: 'm4',
      content: 'RBI compliance guidelines update document attached for all FinTech founders.',
      authorId: { fullName: 'Admin', role: 'admin' },
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ],
};

export default function WhatsAppGroupsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const chatBottomRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    getCurrentUser().then(({ data }) => {
      if (data?.user) {
        const u = {
          ...data.user,
          _id: data.user.id || data.user._id,
          fullName: data.user.full_name || data.user.fullName,
        };
        setCurrentUser(u);
      }
    });
  }, []);

  // Fetch groups from API
  useEffect(() => {
    getGroups().then((res) => {
      if (res?.data && res.data.length > 0) {
        setGroups(res.data);
        setActiveGroupId(res.data[0]._id);
      }
    });
  }, []);

  // Fetch group messages when active group changes
  useEffect(() => {
    if (!activeGroupId) return;
    setLoadingMsgs(true);
    getGroupMessages(activeGroupId)
      .then((res) => {
        if (res?.data) {
          setMessages(res.data);
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => setLoadingMsgs(false));
  }, [activeGroupId]);

  // Instant scroll on switching groups
  useEffect(() => {
    if (activeGroupId && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [activeGroupId]);

  // Smooth scroll on receiving/sending new messages
  useEffect(() => {
    if (messages.length > 0 && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const activeGroup = useMemo(
    () => groups.find((g) => g._id === activeGroupId) || null,
    [groups, activeGroupId]
  );

  const isAdmin = currentUser?.role === 'admin';
  const isReadOnlyGroup = activeGroup?.privacy === 'admin-only' || activeGroup?.canChat === false;
  const canSend = !isReadOnlyGroup || isAdmin;

  const handleSend = async () => {
    const text = inputMsg.trim();
    if (!text || !canSend) return;

    const tempMsg = {
      _id: Date.now().toString(),
      content: text,
      authorId: { fullName: currentUser?.fullName || 'You', role: currentUser?.role || 'student' },
      createdAt: new Date().toISOString(),
      isSelf: true,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputMsg('');

    try {
      const res = await sendGroupMessage(activeGroupId, text);
      if (res?.data) {
        setMessages((prev) => prev.map((m) => (m._id === tempMsg._id ? res.data : m)));
      }
    } catch (err) {
      console.error('Message error:', err);
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wa-shell">
      {/* ── 1. LEFT CARD: GROUPS LIST ── */}
      <div className="wa-left-card">
        {/* Top Header */}
        <div className="wa-left-header">
          <h2 className="wa-header-title">Groups</h2>
          <span className="wa-group-count">{groups.length} active</span>
        </div>

        {/* Search Bar */}
        <div className="wa-search-wrap">
          <div className="wa-search-box">
            <Icon name="search" size={16} color="#94A3B8" />
            <input
              type="text"
              className="wa-search-input"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Groups Stack */}
        <div className="wa-groups-list wa-scrollbar">
          {filteredGroups.map((g) => {
            const isActive = g._id === activeGroupId;
            const isRestricted = g.privacy === 'admin-only' || g.canChat === false;

            return (
              <div
                key={g._id}
                className={`wa-group-item${isActive ? ' active' : ''}`}
                onClick={() => setActiveGroupId(g._id)}
              >
                <div className="wa-avatar">
                  {g.name[0]}
                </div>
                <div className="wa-group-info">
                  <div className="wa-group-top">
                    <span className="wa-group-name">{g.name}</span>
                    <span className="wa-group-time">{g.time || 'Today'}</span>
                  </div>
                  <div className="wa-group-bottom">
                    <span className="wa-group-preview">{g.lastMsg || g.description}</span>
                    {isRestricted ? (
                      <span className="wa-tag wa-tag-admin">Admin Only</span>
                    ) : (
                      <span className="wa-tag wa-tag-open">All Members</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. RIGHT CARD: WHATSAPP CHAT WINDOW ── */}
      <div className="wa-right-card">
        {!activeGroup ? (
          <div className="wa-chat-empty-state">
            <div className="wa-chat-empty-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3>Groups Chat</h3>
            <p>Select a group from the list on the left to view discussions and start chatting.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="wa-chat-header">
              <div className="wa-avatar wa-avatar-lg">
                {activeGroup?.name?.[0] || 'G'}
              </div>
              <div className="wa-chat-header-info">
                <h3 className="wa-chat-title">{activeGroup?.name}</h3>
                <p className="wa-chat-sub">
                  {activeGroup?.description || 'Community discussion group'}
                </p>
              </div>
              <div className="wa-chat-header-badges">
                {isReadOnlyGroup ? (
                  <span className="wa-badge-pill wa-badge-pill-lock">
                    Admin Posts Only
                  </span>
                ) : (
                  <span className="wa-badge-pill wa-badge-pill-open">
                    Open Discussion
                  </span>
                )}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="wa-chat-feed wa-scrollbar">
              <div className="wa-date-divider">
                <span>TODAY</span>
              </div>

              {loadingMsgs ? (
                <div className="wa-feed-empty">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="wa-feed-empty">
                  <Icon name="messageSquare" size={32} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
                  <p>No messages yet in {activeGroup?.name}. Start the conversation!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const authorName = m.authorId?.fullName || 'Member';
                  const authorRole = m.authorId?.role || 'student';
                  const isSelf = m.isSelf || String(m.authorId?._id || m.authorId) === String(currentUser?._id || currentUser?.userId);

                  return (
                    <div key={m._id} className={`wa-msg-row ${isSelf ? 'wa-msg-self' : 'wa-msg-other'}`}>
                      {!isSelf && (
                        <div className="wa-msg-sender">
                          <span>{authorName}</span>
                          <span className="wa-role-tag">{authorRole}</span>
                        </div>
                      )}
                      <div className="wa-msg-bubble">
                        <p className="wa-msg-text">{m.content}</p>
                        <span className="wa-msg-time">
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:45 AM'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar (Sticky Fixed Bottom) */}
            <div className="wa-chat-footer">
              {!canSend && (
                <div className="wa-read-only-banner">
                  Only admins can send messages in this group.
                </div>
              )}
              <div className={`wa-input-pill ${!canSend ? 'disabled' : ''}`}>
                <button className="wa-icon-btn" title="Add attachment" disabled={!canSend}>
                  <Icon name="plus" size={18} color="#64748B" />
                </button>
                <input
                  type="text"
                  className="wa-input-field"
                  placeholder={canSend ? `Type a message in #${activeGroup?.name}...` : 'Messaging restricted to admins'}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  disabled={!canSend}
                />
                <button className="wa-send-btn" onClick={handleSend} disabled={!canSend || !inputMsg.trim()}>
                  <Icon name="send" size={16} color="#fff" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .wa-shell {
          display: flex;
          gap: 20px;
          height: calc(100vh - 100px);
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 24px;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── CUSTOM SLEEK SCROLLBAR ── */
        .wa-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .wa-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .wa-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .wa-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ── LEFT CARD ── */
        .wa-left-card {
          width: 380px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          flex-shrink: 0;
        }

        .wa-left-header {
          padding: 20px 20px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
        }
        .wa-header-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .wa-group-count {
          font-size: 12px;
          font-weight: 700;
          color: #7A1F2B;
          background: #FEF2F2;
          padding: 4px 10px;
          border-radius: 99px;
        }

        .wa-search-wrap {
          padding: 14px 20px;
          border-bottom: 1px solid #f8fafc;
        }
        .wa-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 14px;
        }
        .wa-search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 13px;
          color: #1e293b;
        }

        .wa-groups-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }
        .wa-group-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wa-group-item:hover {
          background: #f8fafc;
        }
        .wa-group-item.active {
          background: #FEF2F2;
          border: 1px solid #FECACA;
        }

        .wa-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-avatar-lg {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }

        .wa-group-info {
          flex: 1;
          min-width: 0;
        }
        .wa-group-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .wa-group-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wa-group-time {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }
        .wa-group-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .wa-group-preview {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .wa-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .wa-tag-admin {
          background: #FEF2F2;
          color: #7A1F2B;
        }
        .wa-tag-open {
          background: #F0FDF4;
          color: #16A34A;
        }

        /* ── RIGHT CARD: CHAT WINDOW ── */
        .wa-right-card {
          flex: 1;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          min-width: 0;
          position: relative;
          overflow: hidden;
        }

        .wa-chat-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 40px;
          color: #94a3b8;
          background: #f8fafc;
        }
        .wa-chat-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #7A1F2B;
        }
        .wa-chat-empty-state h3 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .wa-chat-empty-state p {
          font-size: 14px;
          color: #64748b;
          max-width: 320px;
          margin: 0;
          line-height: 1.5;
        }

        .wa-chat-header {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          z-index: 10;
        }
        .wa-chat-header-info {
          flex: 1;
        }
        .wa-chat-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .wa-chat-sub {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .wa-badge-pill {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
        }
        .wa-badge-pill-lock {
          background: #FEF2F2;
          color: #7A1F2B;
          border: 1px solid #FECACA;
        }
        .wa-badge-pill-open {
          background: #F0FDF4;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }

        /* Feed */
        .wa-chat-feed {
          flex: 1;
          background: #f8fafc;
          padding: 20px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wa-date-divider {
          text-align: center;
          margin: 8px 0 16px;
          position: relative;
        }
        .wa-date-divider span {
          background: #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 99px;
          letter-spacing: 0.05em;
        }

        .wa-feed-empty {
          margin: auto;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .wa-msg-row {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }
        .wa-msg-self {
          align-self: flex-end;
          align-items: flex-end;
        }
        .wa-msg-other {
          align-self: flex-start;
          align-items: flex-start;
        }

        .wa-msg-sender {
          font-size: 11px;
          font-weight: 700;
          color: #7A1F2B;
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wa-role-tag {
          font-size: 9px;
          background: #e2e8f0;
          color: #475569;
          padding: 1px 5px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .wa-msg-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .wa-msg-self .wa-msg-bubble {
          background: #7A1F2B;
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }
        .wa-msg-other .wa-msg-bubble {
          background: #ffffff;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .wa-msg-text {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.45;
          font-weight: 500;
        }
        .wa-msg-time {
          font-size: 10px;
          opacity: 0.7;
          float: right;
          margin-top: 4px;
          margin-left: 12px;
        }

        /* Sticky Fixed Footer */
        .wa-chat-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }

        .wa-read-only-banner {
          background: #FEF2F2;
          color: #7A1F2B;
          border: 1px solid #FECACA;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 10px;
        }

        .wa-input-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 6px 8px 6px 14px;
          transition: border 0.2s ease;
        }
        .wa-input-pill:focus-within {
          border-color: #7A1F2B;
          background: #ffffff;
        }
        .wa-input-pill.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .wa-icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .wa-input-field {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #0f172a;
        }

        .wa-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #7A1F2B;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .wa-send-btn:hover {
          transform: scale(1.05);
        }
        .wa-send-btn:disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .wa-shell {
            flex-direction: column;
            height: auto;
            padding: 12px;
          }
          .wa-left-card {
            width: 100%;
            height: 300px;
          }
          .wa-right-card {
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
