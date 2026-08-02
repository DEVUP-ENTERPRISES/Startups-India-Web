'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { AnimatePresence, motion } from 'framer-motion';

export default function DiscussionsPage() {
  const initialPosts = [
    {
      _id: 'post_1',
      content: "Just finalized our Series A pitch deck. The biggest hurdle wasn't the numbers, but articulating the long-term moat. How are you all framing defensibility?",
      authorId: { fullName: 'Aarav Mehta' },
      createdAt: '2024-05-01T10:00:00Z',
      tags: ['STRATEGY'],
      likes: 42,
      replies: [
        {
          _id: 'rep_1',
          content: "Focus on data flywheels. If your model gets better specifically because of unique data, that's a moat that's hard to replicate.",
          authorId: { fullName: 'Sarah Chen' },
          createdAt: '2024-05-01T10:30:00Z'
        },
        {
          _id: 'rep_2',
          content: 'Distribution is the new moat. If you can own the channel, technology becomes secondary.',
          authorId: { fullName: 'Marcus Thorne' },
          createdAt: '2024-05-01T11:15:00Z'
        }
      ]
    },
    {
      _id: 'post_2',
      content: 'Transitioning from Monolith to Microservices. 30% latency increase in cross-service communication. Any recommendations on gRPC vs REST?',
      authorId: { fullName: 'Priya Sharma' },
      createdAt: '2024-05-01T09:15:00Z',
      tags: ['TECH STACK'],
      likes: 18,
      replies: []
    },
    {
      _id: 'post_3',
      content: 'Unit Economics deep dive: CAC spiked 40% on Meta ads. Exploring programmatic SEO as long-term organic play.',
      authorId: { fullName: 'David Miller' },
      createdAt: '2024-04-30T14:20:00Z',
      tags: ['GROWTH'],
      likes: 56,
      replies: []
    }
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [newPostText, setNewPostText] = useState('');
  const [activePostId, setActivePostId] = useState('post_1');
  const [repliesMap, setRepliesMap] = useState({ post_1: initialPosts[0].replies });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [likesMap, setLikesMap] = useState(
    initialPosts.reduce((accumulator, post) => {
      accumulator[post._id] = post.likes;
      return accumulator;
    }, {})
  );

  const createPost = () => {
    if (!newPostText.trim()) return;

    const post = {
      _id: String(Date.now()),
      content: newPostText,
      authorId: { fullName: 'Founder (You)' },
      createdAt: new Date().toISOString(),
      tags: ['GENERAL'],
      likes: 0,
      replies: []
    };

    setPosts([post, ...posts]);
    setNewPostText('');
  };

  const addReply = (postId, value) => {
    if (!value.trim()) return;

    const reply = {
      _id: String(Date.now()),
      content: value,
      authorId: { fullName: 'Founder (You)' },
      createdAt: new Date().toISOString()
    };

    setRepliesMap((current) => ({
      ...current,
      [postId]: [...(current[postId] || []), reply]
    }));
    setReplyDrafts((current) => ({ ...current, [postId]: '' }));
  };

  const handleLike = (postId) => {
    setLikesMap((current) => ({
      ...current,
      [postId]: (current[postId] || 0) + 1
    }));
  };

  return (
    <div style={{ background: 'var(--dashboard-bg)', minHeight: '100vh' }}>
      <motion.div
        aria-hidden
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-140px', right: '-90px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(122,31,43,0.16), rgba(122,31,43,0))', pointerEvents: 'none' }}
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '120px', left: '-100px', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(251,191,36,0.2), rgba(251,191,36,0))', pointerEvents: 'none' }}
      />

      <div className="platform-page" style={{ padding: '0.5rem 1.5rem', position: 'relative', maxWidth: '100%', width: '100%' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em', color: '#111' }}>Community Discussions</h1>
          <p style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>Connect with founders and innovators building the future.</p>
        </header>

        <div style={{ width: '100%', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: '28px', padding: '1.5rem', border: '1.5px solid #F1F5F9', marginBottom: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share your thoughts with the community..."
              style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #F1F5F9', fontSize: '1rem', fontWeight: 700, color: '#111', fontFamily: 'Poppins, sans-serif', resize: 'vertical', minHeight: '100px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setNewPostText('')} style={{ padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#fff', color: '#111', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer' }}>CANCEL</button>
              <button type="button" onClick={createPost} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: '#7A1F2B', color: '#fff', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer' }}>POST</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {posts.map((post) => (
              <div key={post._id} style={{ background: '#fff', borderRadius: '28px', padding: '1.75rem', border: '1.5px solid #F1F5F9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'linear-gradient(135deg, #7A1F2B, #A52A2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 950, fontSize: '1rem' }}>
                    {post.authorId?.fullName?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 950, color: '#111', letterSpacing: '-0.01em' }}>{post.authorId?.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800, marginTop: '4px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ background: '#F8FAFC', padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{post.tags?.[0] || 'GENERAL'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, fontWeight: 600, margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>{post.content}</p>

                <div style={{ display: 'flex', gap: '1.25rem', borderTop: '1.5px solid #F1F5F9', paddingTop: '1rem', alignItems: 'center' }}>
                  <button type="button" onClick={() => handleLike(post._id)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Icon name="heart" size={18} /> {likesMap[post._id] || 0}
                  </button>
                  <button type="button" onClick={() => setActivePostId(activePostId === post._id ? null : post._id)} style={{ background: '#F8FAFC', border: '1.5px solid #F1F5F9', borderRadius: '999px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: activePostId === post._id ? '#7A1F2B' : '#64748B', fontWeight: 950, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Icon name="messageSquare" size={18} /> {repliesMap[post._id]?.length || 0}
                  </button>
                </div>

                <AnimatePresence>
                  {activePostId === post._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden', marginTop: '2rem' }}
                    >
                      <div style={{ borderLeft: '3px solid #FEF2F2', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(repliesMap[post._id] || []).map((reply) => (
                          <div key={reply._id} style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.8rem', color: '#64748B' }}>
                              {reply.authorId?.fullName?.[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 950, fontSize: '0.9rem', color: '#111' }}>{reply.authorId?.fullName}</span>
                                <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, fontWeight: 650 }}>{reply.content}</p>
                            </div>
                          </div>
                        ))}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1.5px solid #F1F5F9' }}>
                          <input
                            type="text"
                            value={replyDrafts[post._id] || ''}
                            onChange={(e) => setReplyDrafts((current) => ({ ...current, [post._id]: e.target.value }))}
                            placeholder="Add a reply..."
                            style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Poppins', outline: 'none', minWidth: 0 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                addReply(post._id, e.currentTarget.value);
                              }
                            }}
                          />
                          <button type="button" onClick={() => addReply(post._id, replyDrafts[post._id] || '')} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: '#7A1F2B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Icon name="send" size={16} stroke={3} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

