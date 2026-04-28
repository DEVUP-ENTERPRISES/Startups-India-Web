'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Icons SVG Components ---
const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  rocket: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-4.6l-1.4-1.4a5.4 5.4 0 0 0-4.6 1z"/><path d="m15.4 6.5-1.4 1.4M9 13l2 2M15 15l-1.5-1.5M10.8 6.2C11.8 5 13.5 4.3 15 4.5l4-1.5-1.5 4c.2 1.5-.5 3.2-1.7 4.2"/></svg>,
  monitor: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  trending: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  megaphone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  gif: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M8 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2 M14 9v6 M18 9v6 M18 12h-2"/></svg>,
  barChart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  flame: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.36a.5.5 0 0 0 .622.622l4.36-1.32a2 2 0 0 0 .83-.51z"/></svg>,
  more: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  heart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  heartSolid: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  comment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  share: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  bookmark: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  external: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  chevronRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  checkCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/></svg>
};

export default function DiscussionsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('All Posts');
  
  // Like/Comment states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [openComments, setOpenComments] = useState({}); // { postId: boolean }
  const [commentInputs, setCommentInputs] = useState({}); // { postId: text }

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/community/discussions');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() || submitting) return;
    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostText, title: newPostText.substring(0, 50) }) // Mock title if API needs it
      });
      const data = await res.json();
      if (data.success) {
        setNewPostText('');
        fetchPosts(); // Reload feed
      }
    } catch (err) {
      console.error('Failed to post', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
    // Note: Would normally hit a POST /api/likes here
  };

  const handleToggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    
    try {
      const res = await fetch('/api/v1/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, parentId: postId, title: 'Comment' })
      });
      const data = await res.json();
      if (data.success) {
        // Clear input and ideally update replies
        setCommentInputs({ ...commentInputs, [postId]: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="discussions-layout">
      
      {/* ── LEFT SIDEBAR (CHANNELS) ── */}
      <aside className="channels-sidebar">
        <div className="ch-header">
          <h2>Channels</h2>
          <button className="add-ch-btn">{Icons.plus}</button>
        </div>
        
        <div className="ch-list">
          <div className="ch-item active">
            <span className="ch-icon">{Icons.globe}</span> Main Feed
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.rocket}</span> Incubation
            <span className="ch-badge">12</span>
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.monitor}</span> Tech Stack
            <span className="ch-badge">8</span>
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.trending}</span> Growth
            <span className="ch-badge">15</span>
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.briefcase}</span> Funding & Investors
            <span className="ch-badge">6</span>
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.users}</span> Hiring & Team
            <span className="ch-badge">4</span>
          </div>
          <div className="ch-item">
            <span className="ch-icon">{Icons.megaphone}</span> Announcements
            <span className="ch-dot"></span>
          </div>
        </div>
      </aside>

      {/* ── MAIN FEED ── */}
      <main className="feed-main">
        <div className="feed-header">
          <div className="fh-left">
            <h1>Global Feed</h1>
            <p>Connect with high-signal founders and innovators.</p>
          </div>
          <button className="my-posts-btn">My Posts</button>
        </div>

        {/* Create Post Box */}
        <div className="create-post-box">
          <div className="cp-row">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop" alt="User" className="user-avatar" />
            <input 
              type="text" 
              placeholder="Share your thoughts with the community..." 
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePost()}
              disabled={submitting}
            />
            <div className="cp-tools">
              <button>{Icons.image}</button>
              <button>{Icons.gif}</button>
              <button>{Icons.barChart}</button>
            </div>
            <button className="send-btn" onClick={handleCreatePost} disabled={submitting}>
              {submitting ? <div className="spinner-sm" /> : Icons.send}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="feed-filters">
          <div className="ff-tabs">
            <button className={`ff-tab ${activeTab === 'All Posts' ? 'active' : ''}`} onClick={() => setActiveTab('All Posts')}>
              {activeTab === 'All Posts' && <span className="flame-icon">{Icons.flame}</span>} All Posts
            </button>
            <button className={`ff-tab ${activeTab === 'Following' ? 'active' : ''}`} onClick={() => setActiveTab('Following')}>Following</button>
            <button className={`ff-tab ${activeTab === 'Popular' ? 'active' : ''}`} onClick={() => setActiveTab('Popular')}>Popular</button>
            <button className={`ff-tab ${activeTab === 'Unanswered' ? 'active' : ''}`} onClick={() => setActiveTab('Unanswered')}>Unanswered</button>
          </div>
          <button className="ff-filter-btn">{Icons.filter} Filters</button>
        </div>

        {/* Posts List */}
        <div className="posts-list">
          {loading ? (
            <div className="loader-box"><div className="spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No discussions yet. Be the first to post!</div>
          ) : (
            posts.map(post => {
              const isLiked = likedPosts.has(post._id);
              const repliesCount = post.replies?.length || 0;
              const isOpen = openComments[post._id];

              return (
                <div key={post._id} className="post-card">
                  {post.tags?.includes('Announcement') && (
                    <div className="pinned-header">
                      {Icons.pin} Pinned by Admin
                    </div>
                  )}
                  
                  <div className="post-header">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" alt="Avatar" className="p-avatar" />
                    <div className="p-meta">
                      <div className="p-user-row">
                        <span className="p-name">{post.authorId?.fullName || 'User'}</span>
                        {post.tags?.includes('Announcement') ? (
                           <span className="p-role admin">Admin</span>
                        ) : (
                           <span className="p-role founder">Founder</span>
                        )}
                        {post.channel && <span className="p-channel">in <b>{post.channel}</b></span>}
                      </div>
                      <div className="p-sub-row">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.tags?.includes('Announcement') && <span className="p-ann-badge">{Icons.megaphone} Announcement</span>}
                      </div>
                    </div>
                    <button className="more-btn">{Icons.more}</button>
                  </div>

                  <div className="post-content">
                    {post.title !== 'Discussion Thread' && <h3 className="pc-title">{post.title}</h3>}
                    <p className="pc-text">{post.content}</p>
                    
                    {post.tags && post.tags.length > 0 && post.tags[0] !== 'GLOBAL' && (
                      <div className="pc-tags">
                        {post.tags.map(t => <span key={t} className="pc-tag">{t}</span>)}
                      </div>
                    )}
                  </div>

                  <div className="post-footer">
                    <button className={`pf-btn ${isLiked ? 'liked' : ''}`} onClick={() => handleToggleLike(post._id)}>
                      {isLiked ? Icons.heartSolid : Icons.heart} 
                      <span>{Math.floor(Math.random() * 50) + (isLiked ? 1 : 0)}</span>
                    </button>
                    <div className="pf-right">
                      <button className="pf-btn" onClick={() => handleToggleComments(post._id)}>
                        {Icons.comment} <span>{repliesCount} Comments</span>
                      </button>
                      <button className="pf-btn">{Icons.share} Share</button>
                      <button className="pf-btn bookmark">{Icons.bookmark}</button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="comments-section">
                        {post.replies?.map(reply => (
                          <div key={reply._id} className="comment-item">
                            <div className="c-avatar">{reply.authorId?.fullName?.[0] || 'U'}</div>
                            <div className="c-bubble">
                              <span className="c-name">{reply.authorId?.fullName || 'User'}</span>
                              <p className="c-text">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="add-comment-row">
                           <input 
                              type="text" 
                              placeholder="Write a comment..." 
                              value={commentInputs[post._id] || ''}
                              onChange={e => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
                           />
                           <button onClick={() => handleAddComment(post._id)}>{Icons.send}</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="right-sidebar">
        
        {/* Trending Topics */}
        <div className="rs-card">
          <div className="rs-header">
            <h3>{Icons.external} Trending Topics</h3>
            <button className="view-all-btn">View all</button>
          </div>
          <div className="rs-list">
            <div className="rs-item trending">
              <span className="t-rank">1</span>
              <div className="t-info">
                <h4>How to validate your startup idea?</h4>
                <p>128 posts</p>
              </div>
            </div>
            <div className="rs-item trending">
              <span className="t-rank orange">2</span>
              <div className="t-info">
                <h4>Pitch deck feedback</h4>
                <p>96 posts</p>
              </div>
            </div>
            <div className="rs-item trending">
              <span className="t-rank blue">3</span>
              <div className="t-info">
                <h4>SaaS pricing strategies</h4>
                <p>76 posts</p>
              </div>
            </div>
            <div className="rs-item trending">
              <span className="t-rank gray">4</span>
              <div className="t-info">
                <h4>Finding the right co-founder</h4>
                <p>54 posts</p>
              </div>
            </div>
            <div className="rs-item trending">
              <span className="t-rank gray">5</span>
              <div className="t-info">
                <h4>Bootstrapping vs Funding</h4>
                <p>41 posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Group Banner */}
        <div className="rs-banner">
          <h3>Join a Community Group</h3>
          <p>Connect with like-minded founders in focused groups.</p>
          <button className="banner-btn">Explore Groups {Icons.chevronRight}</button>
        </div>

        {/* Suggested People */}
        <div className="rs-card">
          <div className="rs-header">
            <h3>Suggested People</h3>
            <button className="view-all-btn">View all</button>
          </div>
          <div className="rs-list">
            <div className="rs-item people">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop" alt="Neha" />
              <div className="p-info">
                <h4>Neha Iyer</h4>
                <p>Founder, BuildNext</p>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
            <div className="rs-item people">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop" alt="Arjun" />
              <div className="p-info">
                <h4>Arjun Verma</h4>
                <p>Founder, Flowly</p>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
            <div className="rs-item people">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop" alt="Karan" />
              <div className="p-info">
                <h4>Karan Mehta</h4>
                <p>Investor, angel.co</p>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="rs-card guidelines">
          <h3>Community Guidelines</h3>
          <ul className="gl-list">
            <li>{Icons.chevronRight} Be respectful and kind</li>
            <li>{Icons.chevronRight} Share knowledge, not spam</li>
            <li>{Icons.chevronRight} No self-promotion without value</li>
            <li>{Icons.chevronRight} Help others grow</li>
          </ul>
          <div className="gl-shield">
             {Icons.checkCircle}
          </div>
          <button className="gl-read-more">Read full guidelines {Icons.chevronRight}</button>
        </div>

      </aside>

      <style jsx global>{`
        .discussions-layout {
          display: flex;
          height: calc(100vh - 72px);
          background: #fafcff;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* Helpers */
        .spinner { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; }
        .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* ── LEFT SIDEBAR ── */
        .channels-sidebar { width: 260px; background: transparent; border-right: 1px solid #f1f5f9; padding: 2rem 1rem; overflow-y: auto; flex-shrink: 0; }
        .ch-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 0 1rem; }
        .ch-header h2 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
        .add-ch-btn { background: none; border: none; color: #64748b; cursor: pointer; transition: 0.2s; padding: 4px; border-radius: 6px; }
        .add-ch-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .ch-list { display: flex; flex-direction: column; gap: 0.25rem; }
        .ch-item { display: flex; align-items: center; padding: 0.8rem 1rem; border-radius: 12px; font-size: 0.95rem; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .ch-item:hover { background: #fff; border-color: #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .ch-item.active { background: #fef2f2; color: #ef4444; }
        .ch-item.active .ch-icon { color: #ef4444; }
        .ch-icon { margin-right: 0.75rem; display: flex; align-items: center; color: #94a3b8; }
        .ch-badge { margin-left: auto; font-size: 0.75rem; font-weight: 700; color: #64748b; }
        .ch-dot { width: 6px; height: 6px; background: #ef4444; border-radius: 50%; margin-left: auto; }

        /* ── MAIN FEED ── */
        .feed-main { flex: 1; padding: 2rem 3rem; overflow-y: auto; min-width: 0; max-width: 860px; margin: 0 auto; scrollbar-width: none; }
        .feed-main::-webkit-scrollbar { display: none; }
        
        .feed-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .fh-left h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; }
        .fh-left p { margin: 0; color: #64748b; font-size: 0.95rem; }
        .my-posts-btn { background: #fff; border: 1.5px solid #fecaca; color: #ef4444; padding: 0.6rem 1.25rem; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
        .my-posts-btn:hover { background: #fef2f2; }

        .create-post-box { background: #fff; padding: 1.25rem; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.02); margin-bottom: 2rem; }
        .cp-row { display: flex; align-items: center; gap: 1rem; }
        .user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .cp-row input { flex: 1; background: transparent; border: none; font-size: 1rem; color: #0f172a; outline: none; padding: 0.5rem; }
        .cp-tools { display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 0.5rem; border-radius: 12px; }
        .cp-tools button { background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; transition: 0.2s; }
        .cp-tools button:hover { color: #64748b; }
        .send-btn { width: 44px; height: 44px; background: #ef4444; border: none; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex-shrink: 0; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .send-btn:hover:not(:disabled) { background: #dc2626; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .feed-filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .ff-tabs { display: flex; gap: 0.5rem; }
        .ff-tab { background: #fff; border: 1px solid #f1f5f9; padding: 0.6rem 1.25rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: 0.2s; }
        .ff-tab:hover { background: #f8fafc; }
        .ff-tab.active { background: #ef4444; color: #fff; border-color: #ef4444; }
        .flame-icon { display: flex; align-items: center; }
        .ff-filter-btn { background: transparent; border: 1px solid #e2e8f0; color: #475569; padding: 0.6rem 1.25rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }

        .posts-list { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 2rem; }
        .post-card { background: #fff; border-radius: 20px; padding: 1.5rem; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .pinned-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 1rem; }
        
        .post-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
        .p-avatar { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; }
        .p-meta { flex: 1; }
        .p-user-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
        .p-name { font-weight: 700; color: #0f172a; font-size: 1.05rem; }
        .p-role { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        .p-role.admin { background: #fee2e2; color: #ef4444; }
        .p-role.founder { background: #e0e7ff; color: #4f46e5; }
        .p-channel { font-size: 0.8rem; color: #64748b; margin-left: 0.25rem; }
        .p-sub-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #94a3b8; }
        .p-ann-badge { display: flex; align-items: center; gap: 0.25rem; color: #ef4444; font-weight: 600; background: #fef2f2; padding: 0.1rem 0.5rem; border-radius: 4px; }
        .more-btn { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; }

        .post-content { margin-bottom: 1.5rem; }
        .pc-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem; }
        .pc-text { font-size: 0.95rem; color: #334155; line-height: 1.6; margin: 0 0 1rem; }
        .pc-tags { display: flex; gap: 0.5rem; }
        .pc-tag { font-size: 0.75rem; font-weight: 600; color: #3b82f6; background: #eff6ff; padding: 0.3rem 0.8rem; border-radius: 20px; }

        .post-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f8fafc; }
        .pf-btn { display: flex; align-items: center; gap: 0.4rem; background: #fff; border: 1px solid #f1f5f9; color: #64748b; font-size: 0.85rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; transition: 0.2s; }
        .pf-btn:hover { background: #f8fafc; color: #0f172a; }
        .pf-btn.liked { color: #ef4444; background: #fef2f2; border-color: #fecaca; }
        .pf-right { display: flex; gap: 0.5rem; }
        .pf-btn.bookmark { padding: 0.5rem; }

        /* Comments Section */
        .comments-section { padding-top: 1.5rem; border-top: 1px dashed #e2e8f0; margin-top: 1.5rem; }
        .comment-item { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .c-avatar { width: 32px; height: 32px; background: #f1f5f9; color: #475569; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }
        .c-bubble { background: #f8fafc; padding: 0.75rem 1rem; border-radius: 0 16px 16px 16px; flex: 1; }
        .c-name { font-size: 0.8rem; font-weight: 700; color: #0f172a; display: block; margin-bottom: 0.25rem; }
        .c-text { font-size: 0.9rem; color: #334155; margin: 0; line-height: 1.4; }
        .add-comment-row { display: flex; gap: 0.75rem; align-items: center; margin-top: 1rem; }
        .add-comment-row input { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem 1.25rem; border-radius: 20px; outline: none; font-size: 0.9rem; }
        .add-comment-row button { background: #ef4444; color: #fff; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        /* ── RIGHT SIDEBAR ── */
        .right-sidebar { width: 320px; padding: 2rem 1.5rem 2rem 0; overflow-y: auto; flex-shrink: 0; display: flex; flex-direction: column; gap: 1.5rem; scrollbar-width: none; }
        .right-sidebar::-webkit-scrollbar { display: none; }
        
        .rs-card { background: #fff; border-radius: 20px; padding: 1.25rem; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .rs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .rs-header h3 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 0.4rem; }
        .view-all-btn { background: none; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        
        /* Trending List */
        .rs-list { display: flex; flex-direction: column; gap: 1rem; }
        .rs-item.trending { display: flex; align-items: center; gap: 1rem; }
        .t-rank { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: #ef4444; background: #fef2f2; }
        .t-rank.orange { color: #f59e0b; background: #fffbeb; }
        .t-rank.blue { color: #3b82f6; background: #eff6ff; }
        .t-rank.gray { color: #64748b; background: #f8fafc; }
        .t-info h4 { font-size: 0.85rem; font-weight: 600; color: #0f172a; margin: 0 0 0.2rem; }
        .t-info p { font-size: 0.75rem; color: #94a3b8; margin: 0; }

        /* Join Banner */
        .rs-banner { background: linear-gradient(135deg, #7f1d1d, #450a0a); border-radius: 20px; padding: 1.5rem; color: #fff; position: relative; overflow: hidden; }
        .rs-banner h3 { margin: 0 0 0.5rem; font-size: 1.05rem; font-weight: 700; }
        .rs-banner p { margin: 0 0 1.25rem; font-size: 0.8rem; color: #fca5a5; line-height: 1.4; width: 70%; }
        .banner-btn { background: #fff; color: #7f1d1d; border: none; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; }

        /* People List */
        .rs-item.people { display: flex; align-items: center; gap: 0.75rem; }
        .rs-item.people img { border-radius: 50%; object-fit: cover; }
        .p-info { flex: 1; }
        .p-info h4 { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0 0 0.1rem; }
        .p-info p { font-size: 0.7rem; color: #64748b; margin: 0; }
        .follow-btn { background: #fef2f2; color: #ef4444; border: none; padding: 0.4rem 0.8rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .follow-btn:hover { background: #ef4444; color: #fff; }

        /* Guidelines */
        .guidelines { position: relative; }
        .gl-list { list-style: none; padding: 0; margin: 1rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .gl-list li { font-size: 0.8rem; color: #475569; display: flex; align-items: center; gap: 0.4rem; font-weight: 500; }
        .gl-list li svg { color: #ef4444; flex-shrink: 0; }
        .gl-read-more { background: none; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 0.2rem; }
        .gl-shield { position: absolute; right: 20px; bottom: 20px; width: 40px; height: 40px; background: #fef2f2; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1024px) {
          .channels-sidebar, .right-sidebar { display: none; }
          .feed-main { padding: 1.5rem; max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
