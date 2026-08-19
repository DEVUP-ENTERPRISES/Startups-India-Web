'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '@/styles/community-discussions.css';
import {
  getChannels,
  getPosts,
  createPost,
  toggleLike,
  addComment,
  getComments,
  votePoll,
  uploadPostImage,
  connectCommunitySSE,
  deletePost,
} from '@/lib/community';
import { getCurrentUser } from '@/lib/auth';

const FALLBACK_CHANNELS = [
  {
    _id: 'main',
    id: 'main',
    name: 'Main Feed',
    slug: 'main',
    type: 'open',
    targetAudience: 'all',
    iconName: 'feed',
    description: 'All discussions from across the community',
  },
  {
    _id: 'announcements',
    id: 'announcements',
    name: 'Announcements',
    slug: 'announcements',
    type: 'announce',
    targetAudience: 'all',
    dot: true,
    iconName: 'bell',
    description: 'Official updates from the team',
  },
];

function getChannelIcon(iconName) {
  switch (iconName) {
    case 'feed':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'star':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'code':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'trending':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'dollar':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'users':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'bell':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
}

function roleBadge(role) {
  const map = {
    admin: { label: 'Admin', cls: 'cd-badge-admin' },
    founder: { label: 'Founder', cls: 'cd-badge-founder' },
    cofounder: { label: 'Co-founder', cls: 'cd-badge-cofounder' },
    mentor: { label: 'Mentor', cls: 'cd-badge-mentor' },
    investor: { label: 'Investor', cls: 'cd-badge-investor' },
    student: { label: 'Student', cls: 'cd-badge-student' },
  };
  const r = map[role] || map.student;
  return <span className={`cd-badge ${r.cls}`}>{r.label}</span>;
}

function isPostAuthor(post, currentUser) {
  if (!post || !currentUser) return false;
  const authorObj = post.authorId || post.author;
  const authorId = typeof authorObj === 'object' && authorObj
    ? (authorObj._id || authorObj.id)
    : authorObj;
  const currentId = currentUser._id || currentUser.id || currentUser.userId;
  if (!authorId || !currentId) return false;
  return String(authorId) === String(currentId);
}

const Icons = {
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  heart: (filled) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#7A1F2B' : 'none'} stroke={filled ? '#7A1F2B' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  comment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  image: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  poll: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  trash: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
};

/* ─── Image Upload Modal ─────────────────────────────────── */
function ImageModal({ onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl, key } = await uploadPostImage(file);
      onSubmit({ publicUrl, key });
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cd-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cd-modal">
        <div className="cd-modal-header">
          <span className="cd-modal-title">Attach Image</span>
          <button className="cd-modal-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>

        <div className="cd-modal-field">
          <label className="cd-modal-label">Choose Image File</label>
          <button className="cd-modal-btn cd-modal-btn-secondary" onClick={() => fileRef.current?.click()}>
            {file ? file.name : 'Select image file...'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>

        <button
          className="cd-modal-btn"
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ opacity: !file || uploading ? 0.5 : 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload & Attach'}
        </button>
      </div>
    </div>
  );
}

/* ─── Poll Builder Modal ─────────────────────────────────── */
function PollModal({ onClose, onSubmit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => setOptions((prev) => [...prev, '']);
  const removeOption = (idx) => setOptions((prev) => prev.filter((_, i) => i !== idx));
  const updateOption = (idx, val) => setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));

  const handle = () => {
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleaned.length < 2) return;
    onSubmit({ question: question.trim(), options: cleaned });
  };

  const valid = question.trim() && options.filter((o) => o.trim()).length >= 2;

  return (
    <div className="cd-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cd-modal">
        <div className="cd-modal-header">
          <span className="cd-modal-title">Create Poll</span>
          <button className="cd-modal-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        <div className="cd-modal-field">
          <label className="cd-modal-label">Question</label>
          <input
            className="cd-modal-input"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="cd-modal-field">
          <label className="cd-modal-label">Options</label>
          {options.map((opt, idx) => (
            <div key={idx} className="cd-poll-edit-option">
              <input
                className="cd-modal-input"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
              />
              {options.length > 2 && (
                <button className="cd-poll-remove-option" onClick={() => removeOption(idx)}>
                  {Icons.close}
                </button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <button
              className="cd-modal-btn cd-modal-btn-secondary"
              onClick={addOption}
              style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
            >
              {Icons.plus} Add Option
            </button>
          )}
        </div>
        <button className="cd-modal-btn" onClick={handle} disabled={!valid} style={{ opacity: !valid ? 0.5 : 1 }}>
          Create Poll
        </button>
      </div>
    </div>
  );
}

/* ─── Post Composer ─────────────────────────────────────── */
function PostComposer({ activeChannelObj, currentUser, onPost }) {
  const [text, setText] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingPoll, setPendingPoll] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  let canUserPostInChannel = false;
  if (activeChannelObj) {
    if (activeChannelObj.type === 'announce') {
      canUserPostInChannel = (currentUser?.role === 'admin');
    } else if (activeChannelObj.type === 'restricted') {
      canUserPostInChannel = (currentUser?.role === 'admin' || currentUser?.role === 'founder' || currentUser?.role === 'cofounder' || currentUser?.role === 'startup');
    } else {
      canUserPostInChannel = true; // open
    }
  }

  if (!canUserPostInChannel) {
    return null;
  }

  const canPost = (text.trim() || pendingImage || pendingPoll) && !submitting;

  const submit = async () => {
    if (!canPost) return;
    setSubmitting(true);
    try {
      await onPost({
        text,
        imageKey: pendingImage?.key,
        imageUrl: pendingImage?.publicUrl,
        poll: pendingPoll,
      });
      setText('');
      setPendingImage(null);
      setPendingPoll(null);
    } catch (err) {
      alert(err.message || 'Error creating post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="cd-composer">
        <div className="cd-composer-row">
          <div className="cd-composer-avatar">
            {currentUser?.fullName?.[0] || 'U'}
          </div>
          <div className="cd-composer-input-wrap">
            <textarea
              className="cd-composer-textarea"
              placeholder={`Share thoughts in #${activeChannelObj?.name || 'feed'}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canPost) submit();
                }
              }}
              rows={3}
            />

            {/* image preview */}
            {pendingImage && (
              <div style={{ position: 'relative', marginTop: 10 }}>
                <img src={pendingImage.publicUrl} alt="preview" className="cd-post-image" style={{ maxHeight: 160 }} />
                <button
                  onClick={() => setPendingImage(null)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: 'none',
                    background: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {Icons.close}
                </button>
              </div>
            )}

            {/* poll preview */}
            {pendingPoll && (
              <div
                style={{
                  marginTop: 10,
                  background: '#F8F9FA',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1.5px solid #E8ECF0',
                  position: 'relative',
                }}
              >
                <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#111' }}>
                  {pendingPoll.question}
                </p>
                {pendingPoll.options.map((o, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      border: '1.5px solid #E8ECF0',
                      borderRadius: 8,
                      padding: '7px 12px',
                      marginBottom: 6,
                      fontSize: 13,
                      color: '#334155',
                      fontWeight: 600,
                    }}
                  >
                    {o}
                  </div>
                ))}
                <button
                  onClick={() => setPendingPoll(null)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    border: 'none',
                    background: '#FEF2F2',
                    color: '#7A1F2B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {Icons.close}
                </button>
              </div>
            )}

            <div className="cd-composer-actions">
              <div className="cd-composer-tools">
                <button
                  className="cd-composer-tool"
                  title="Add image"
                  onClick={() => {
                    setPendingPoll(null);
                    setShowImageModal(true);
                  }}
                  disabled={!!pendingPoll}
                  style={{ opacity: pendingPoll ? 0.4 : 1 }}
                >
                  {Icons.image}
                </button>
                <button
                  className="cd-composer-tool"
                  title="Create poll"
                  onClick={() => {
                    setPendingImage(null);
                    setShowPollModal(true);
                  }}
                  disabled={!!pendingImage}
                  style={{ opacity: pendingImage ? 0.4 : 1 }}
                >
                  {Icons.poll}
                </button>
              </div>
              <button className="cd-composer-submit" onClick={submit} disabled={!canPost}>
                {Icons.send}
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          onClose={() => setShowImageModal(false)}
          onSubmit={(img) => {
            setPendingImage(img);
            setShowImageModal(false);
          }}
        />
      )}
      {showPollModal && (
        <PollModal
          onClose={() => setShowPollModal(false)}
          onSubmit={(poll) => {
            setPendingPoll(poll);
            setShowPollModal(false);
          }}
        />
      )}
    </>
  );
}

/* ─── Poll widget ─────────────────────────────────────── */
function PollWidget({ poll, currentUserId, onVote }) {
  if (!poll || !poll.question || !poll.options || poll.options.length === 0) return null;

  const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const userVotedOption = poll.options.find((o) =>
    o.voterIds?.some((v) => (typeof v === 'object' ? v._id : v) === currentUserId)
  );

  return (
    <div className="cd-poll">
      <div className="cd-poll-question">{poll.question}</div>
      {poll.options.map((opt) => {
        const votes = opt.votes || 0;
        const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const isVoted = userVotedOption?._id === opt._id;

        return (
          <div
            key={opt._id}
            className={`cd-poll-option${isVoted ? ' voted' : ''}`}
            onClick={() => !userVotedOption && onVote(opt._id)}
            style={{ cursor: userVotedOption ? 'default' : 'pointer' }}
          >
            {userVotedOption && (
              <div
                className="cd-poll-option-bar"
                style={{
                  width: `${pct}%`,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  background: 'rgba(122,31,43,0.09)',
                  borderRadius: 9,
                  pointerEvents: 'none',
                }}
              />
            )}
            <div className="cd-poll-option-inner">
              <span>{opt.label}</span>
              {userVotedOption && <span className="cd-poll-option-pct">{pct}%</span>}
            </div>
          </div>
        );
      })}
      {userVotedOption && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </p>
      )}
    </div>
  );
}

/* ─── Post card ─────────────────────────────────────────── */
function PostCard({ post, currentUser, onLike, onVote, onDelete }) {
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const authorName = post.authorId?.fullName || post.author?.name || 'Community Member';
  const authorRole = post.authorId?.role || post.author?.role || 'student';
  const authorCompany = post.authorId?.company || post.author?.company || '';
  const authorInitials = authorName[0] || 'U';

  const currentUserId = currentUser?._id || currentUser?.userId;
  const isAuthor = isPostAuthor(post, currentUser);
  const isAdmin = currentUser?.role === 'admin';
  const canDelete = isAuthor || isAdmin;

  const isLiked = post.liked || post.likerIds?.some((id) => {
    const lid = typeof id === 'object' && id ? (id._id || id.id) : id;
    return String(lid) === String(currentUserId);
  });
  const likeCount = post.likeCount ?? post.likes ?? 0;

  const toggleCommentsView = async () => {
    const nextState = !openComments;
    setOpenComments(nextState);
    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await getComments(post._id);
        if (res?.data) setComments(res.data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async () => {
    const t = draft.trim();
    if (!t) return;
    try {
      const res = await addComment(post._id, t);
      if (res?.data) {
        setComments((prev) => [...prev, res.data]);
        setDraft('');
      }
    } catch (err) {
      alert('Error adding comment');
    }
  };

  return (
    <div className="cd-post">
      <div className="cd-post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="cd-post-avatar">{authorInitials}</div>
          <div className="cd-post-meta">
            <div className="cd-post-name-row">
              <span className="cd-post-name">{authorName}</span>
              {roleBadge(authorRole)}
            </div>
            <div className="cd-post-subrow">
              {authorCompany && <span className="cd-post-company">{authorCompany}</span>}
              {authorCompany && <span className="cd-post-dot" />}
              <span className="cd-post-time">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.time || 'recently'}
              </span>
            </div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(post._id)}
            className="cd-post-delete-btn"
            title="Delete post"
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {Icons.trash}
          </button>
        )}
      </div>

      <p className="cd-post-body">{post.body}</p>

      {post.imageUrl && (
        <div className="cd-post-image-container">
          <img src={post.imageUrl} alt="post media" className="cd-post-image" />
        </div>
      )}

      {post.poll && (
        <PollWidget poll={post.poll} currentUserId={currentUserId} onVote={(optId) => onVote(post._id, optId)} />
      )}

      <div className="cd-post-footer">
        <button className={`cd-action-btn${isLiked ? ' liked' : ''}`} onClick={() => onLike(post._id)} title="Like">
          {Icons.heart(isLiked)}
          {likeCount}
        </button>
        <button
          className={`cd-action-btn${openComments ? ' comment-open' : ''}`}
          onClick={toggleCommentsView}
          title="Comments"
        >
          {Icons.comment}
          {post.commentCount ?? comments.length ?? 0} Comments
        </button>
      </div>

      {openComments && (
        <div className="cd-comments">
          {loadingComments ? (
            <p style={{ fontSize: 13, color: '#94A3B8' }}>Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="cd-comments-list">
              {comments.map((c) => (
                <div key={c._id} className="cd-comment">
                  <div className="cd-comment-avatar">{c.authorId?.fullName?.[0] || 'U'}</div>
                  <div className="cd-comment-bubble">
                    <div className="cd-comment-name-row">
                      <span className="cd-comment-name">{c.authorId?.fullName || 'User'}</span>
                      {roleBadge(c.authorId?.role || 'student')}
                      <span className="cd-comment-time">
                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="cd-comment-text">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#B0B9C8', fontWeight: 600 }}>
              No comments yet. Be the first to reply.
            </p>
          )}

          <div className="cd-comment-input-row">
            <input
              ref={inputRef}
              className="cd-comment-input"
              placeholder="Write a comment..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitComment();
                }
              }}
            />
            <button
              className="cd-comment-send"
              onClick={submitComment}
              disabled={!draft.trim()}
              title="Send comment"
            >
              {Icons.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Discussions Page ─────────────────────────────────────────── */
export default function DiscussionsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [channels, setChannels] = useState(FALLBACK_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('main');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showOnlyMyPosts, setShowOnlyMyPosts] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Fetch channels list from API
  useEffect(() => {
    getChannels().then((res) => {
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        // Ensure Main Feed is always first in sidebar
        const mainChannel = { _id: 'main', id: 'main', name: 'Main Feed', slug: 'main', type: 'open', targetAudience: 'all', iconName: 'feed' };
        const otherChannels = res.data.filter(c => c.slug !== 'main');
        setChannels([mainChannel, ...otherChannels]);
      }
    });
  }, []);

  // Load posts for active channel
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPosts([]); // Clear posts list immediately to prevent cross-channel leak on UI
    try {
      const { data } = await getPosts(activeChannelId);
      if (data?.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [activeChannelId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    setShowOnlyMyPosts(false);
  }, [activeChannelId]);

  // Connect SSE for live updates
  useEffect(() => {
    const sse = connectCommunitySSE('all', (evt) => {
      if (evt.event === 'new_post') {
        const postChannelId = evt.payload.channelId?._id || evt.payload.channelId;
        if (
          String(postChannelId) === String(activeChannelId) ||
          (activeChannelId === 'main' && evt.payload.channelId?.slug === 'main')
        ) {
          setPosts((prev) => [evt.payload, ...prev.filter(p => p._id !== evt.payload._id)]);
        }
      } else if (evt.event === 'like') {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === evt.payload.postId
              ? { ...p, likeCount: evt.payload.likeCount }
              : p
          )
        );
      }
    });

    return () => {
      if (sse) sse.close();
    };
  }, [activeChannelId]);

  const activeChannelObj = channels.find((c) => c._id === activeChannelId || c.id === activeChannelId || c.slug === activeChannelId) || channels[0];

  const isAnnounce = activeChannelObj?.type === 'announce';
  const isRestricted = activeChannelObj?.type === 'restricted';
  let canUserPostInActiveChannel = false;
  if (activeChannelObj) {
    if (isAnnounce) {
      canUserPostInActiveChannel = (currentUser?.role === 'admin');
    } else if (isRestricted) {
      canUserPostInActiveChannel = (currentUser?.role === 'admin' || currentUser?.role === 'founder' || currentUser?.role === 'cofounder' || currentUser?.role === 'startup');
    } else {
      canUserPostInActiveChannel = true; // open
    }
  }

  const handleDeletePost = (postId) => {
    setDeletingPostId(postId);
  };

  const executeDeletePost = async () => {
    if (!deletingPostId) return;
    try {
      const res = await deletePost(deletingPostId);
      if (res?.success || !res?.error) {
        setPosts((prev) => prev.filter((p) => p._id !== deletingPostId));
      } else {
        alert(res?.error?.message || 'Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleCreatePost = async ({ text, imageKey, imageUrl, poll }) => {
    const targetChannelId = (activeChannelId === 'main' || activeChannelObj?.slug === 'main')
      ? 'main'
      : (activeChannelObj?._id || activeChannelObj?.slug || activeChannelId);

    const res = await createPost({
      channelId: targetChannelId,
      body: text,
      imageKey,
      imageUrl,
      poll,
    });

    if (res?.error) {
      alert(res.error.message || 'Failed to post in this channel');
      return;
    }

    if (res?.data) {
      setPosts((prev) => [res.data, ...prev.filter(p => p._id !== res.data._id)]);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      if (res?.data) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  liked: res.data.liked,
                  likeCount: res.data.likeCount,
                  likerIds: res.data.likerIds || p.likerIds,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleVote = async (postId, optionId) => {
    try {
      const res = await votePoll(postId, optionId);
      if (res?.data?.options) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  poll: { ...p.poll, options: res.data.options },
                }
              : p
          )
        );
      }
    } catch (err) {
      alert(err.message || 'Could not register vote');
    }
  };

  const renderDeleteModal = () => {
    if (!deletingPostId) return null;
    const modalContent = (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={() => setDeletingPostId(null)}
      >
        <div 
          style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '28px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            borderTop: '4px solid #ef4444',
            zIndex: 100000000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 10px', fontFamily: 'Inter, sans-serif' }}>Delete Post?</h3>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: '0 0 24px', fontFamily: 'Inter, sans-serif' }}>
            Are you sure you want to delete this post? This action is permanent and cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="cd-modal-btn cd-modal-btn-secondary"
              onClick={() => setDeletingPostId(null)}
              style={{ margin: 0, flex: 1, height: '42px', padding: '0 16px' }}
            >
              Cancel
            </button>
            <button
              className="cd-modal-btn"
              onClick={executeDeletePost}
              style={{ margin: 0, flex: 1, background: '#ef4444', height: '42px', padding: '0 16px' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
  };

  return (
    <div className="cd-root">
      {/* Left Channels Sidebar */}
      <aside className="cd-sidebar">
        <div className="cd-sidebar-header">
          <span className="cd-sidebar-title">Channels</span>
        </div>
        <ul className="cd-channel-list">
          {channels.map((ch) => {
            const chId = ch._id || ch.slug || ch.id;
            const isActive = activeChannelId === chId || activeChannelId === ch.slug;
            return (
              <li
                key={chId}
                className={`cd-channel-item${isActive ? ' active' : ''}`}
                onClick={() => setActiveChannelId(chId)}
              >
                <span className="cd-channel-icon">{getChannelIcon(ch.iconName || ch.icon)}</span>
                <span className="cd-channel-name">{ch.name}</span>
                {ch.badge != null && <span className="cd-channel-badge">{ch.badge}</span>}
                {ch.dot && <span className="cd-channel-dot" />}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Feed */}
      <main className="cd-feed">
        {/* Mobile Channels Scroll Pills */}
        <div className="cd-mobile-channels">
          {channels.map((ch) => {
            const chId = ch._id || ch.slug || ch.id;
            const isActive = activeChannelId === chId || activeChannelId === ch.slug;
            return (
              <button
                key={chId}
                className={`cd-mobile-channel-pill${isActive ? ' active' : ''}`}
                onClick={() => setActiveChannelId(chId)}
              >
                <span>{ch.name}</span>
              </button>
            );
          })}
        </div>

        <div className="cd-feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="cd-feed-title">{activeChannelObj?.name}</h1>
            <p className="cd-feed-sub">
              {activeChannelId === 'main' || activeChannelObj?.slug === 'main'
                ? 'All discussions from across the community.'
                : activeChannelObj?.description || ''}
            </p>
          </div>
          {canUserPostInActiveChannel && (
            <button
              onClick={() => setShowOnlyMyPosts(!showOnlyMyPosts)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.16s ease',
                background: showOnlyMyPosts ? '#FFF0F0' : '#fff',
                border: showOnlyMyPosts ? '1.5px solid #7A1F2B' : '1.5px solid #E2E8F0',
                color: showOnlyMyPosts ? '#7A1F2B' : '#4B5563',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Posts
            </button>
          )}
        </div>

        {/* Post Composer */}
        <PostComposer
          activeChannelObj={activeChannelObj}
          currentUser={currentUser}
          onPost={handleCreatePost}
        />

        {/* Feed Posts */}
        {loadingPosts ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            Loading discussions...
          </div>
        ) : (() => {
          const displayedPosts = showOnlyMyPosts
            ? posts.filter((p) => isPostAuthor(p, currentUser))
            : posts;

          if (displayedPosts.length === 0) {
            return (
              <div className="cd-empty">
                <div className="cd-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p>No posts found.</p>
              </div>
            );
          }

          return (
            <div className="cd-posts">
              {displayedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onVote={handleVote}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          );
        })()}
      </main>

      {renderDeleteModal()}
    </div>
  );
}
