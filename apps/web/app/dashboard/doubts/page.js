'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';

// --- SVGs & Icons ---
const Icons = {
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  chevronUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>,
  chevronDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  message: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  bookmark: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  flame: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  trending: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
};

// --- Dummy Data Fallbacks ---
const TOP_EXPERTS = [
  { id: 1, name: 'Arjun Verma', role: 'AI Expert', points: 156, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: 2, name: 'Riya Sharma', role: 'Growth Advisor', points: 142, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 3, name: 'Karan Mehta', role: 'Product Strategist', points: 98, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: 4, name: 'Neha Iyer', role: 'Marketing Expert', points: 76, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 5, name: 'Vikram Rao', role: 'Tech Mentor', points: 65, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
];

const TRENDING_TOPICS = [
  { id: 1, name: 'AI / Machine Learning', count: 122, color: '#6366f1' },
  { id: 2, name: 'Funding & Investment', count: 86, color: '#f59e0b' },
  { id: 3, name: 'Product Strategy', count: 84, color: '#d946ef' },
  { id: 4, name: 'Marketing Growth', count: 74, color: '#0ea5e9' },
  { id: 5, name: 'Team & Hiring', count: 42, color: '#ef4444' }
];

// --- Components ---
const QuestionModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({ title: '', content: '', tags: '', topic: 'General' });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ask a Question</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="form-group">
            <label>Question Title *</label>
            <input 
              required 
              placeholder="e.g., How to choose the right machine learning model?" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              required 
              rows="5" 
              placeholder="Provide more context and details..." 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
            />
          </div>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Topic</label>
              <select value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}>
                <option value="AI/ML">AI/ML</option>
                <option value="Funding">Funding</option>
                <option value="Product">Product</option>
                <option value="Growth">Growth</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="form-group flex-2">
              <label>Tags (comma separated)</label>
              <input 
                placeholder="e.g., machine-learning, seed-round" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewQuestionModal = ({ question, isOpen, onClose, onPostAnswer, postingAnswer }) => {
  const [answerContent, setAnswerContent] = useState('');

  if (!isOpen || !question) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="q-category">{question.tags?.[0] || 'General'}</div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="q-body">
          <h2 className="q-title">{question.title}</h2>
          <p className="q-desc">{question.content || question.description}</p>
          <div className="q-author">
            <div className="avatar">{question.authorId?.fullName?.[0] || 'U'}</div>
            <span>{question.authorId?.fullName || 'Anonymous'} • {new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="answers-section">
          <h3>Answers ({question.answers?.length || 0})</h3>
          
          <div className="answers-list">
            {question.answers?.length > 0 ? (
              question.answers.map((ans, idx) => (
                <div key={idx} className="answer-card">
                  <div className="ans-author">
                    <div className="avatar sm">{ans.authorId?.fullName?.[0] || 'U'}</div>
                    <div className="ans-meta">
                      <span className="name">{ans.authorId?.fullName || 'User'}</span>
                      <span className="time">{new Date(ans.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="ans-content">{ans.content}</p>
                </div>
              ))
            ) : (
              <div className="empty-answers">
                <p>No answers yet. Be the first to answer!</p>
              </div>
            )}
          </div>

          <form className="answer-form" onSubmit={(e) => {
            e.preventDefault();
            if(answerContent.trim()){
              onPostAnswer(question._id, answerContent);
              setAnswerContent('');
            }
          }}>
            <textarea 
              placeholder="Write your answer..." 
              required 
              rows="3"
              value={answerContent}
              onChange={e => setAnswerContent(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={postingAnswer}>
              {postingAnswer ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function DoubtsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Most Recent');
  const [isAskModalOpen, setAskModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [postingAnswer, setPostingAnswer] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Stats
  const stats = {
    active: questions.filter(q => !q.acceptedAnswerId && (q.answers?.length || 0) > 0).length,
    solved: questions.filter(q => q.acceptedAnswerId).length,
    total: questions.length
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/community/questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/community/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: [formData.topic, ...formData.tags.split(',').map(t => t.trim()).filter(Boolean)]
        })
      });
      const data = await res.json();
      if (data.success) {
        setAskModalOpen(false);
        fetchQuestions(); // refresh
      } else {
        alert(data.message || 'Failed to post question');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostAnswer = async (questionId, content) => {
    try {
      setPostingAnswer(true);
      const res = await fetch(`/api/v1/community/questions/${questionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh question list or specific question
        fetchQuestions();
        // Optimistically update selected question
        if (selectedQuestion) {
          setSelectedQuestion({
            ...selectedQuestion,
            answers: [...(selectedQuestion.answers || []), data.data]
          });
        }
      } else {
        alert(data.message || 'Failed to post answer');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setPostingAnswer(false);
    }
  };

  const openQuestion = async (q) => {
    setSelectedQuestion(q);
    // Optionally fetch full question details if not populated
    try {
      const res = await fetch(`/api/v1/community/questions/${q._id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedQuestion(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = useMemo(() => {
    let result = [...questions];
    if (filter === 'Unanswered') {
      result = result.filter(q => !q.answers || q.answers.length === 0);
    } else if (filter === 'Solved') {
      result = result.filter(q => q.acceptedAnswerId);
    }
    // Most recent is default
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [questions, filter]);

  return (
    <div className="doubts-container">
      {/* HEADER SECTION */}
      <div className="header-wrapper">
        <div className="header-top">
          <div className="header-text">
            <h1>Expert <span className="gradient-text">Q&A Hub</span></h1>
            <p>Get expert answers. Share knowledge. Grow together.</p>
          </div>
          <div className="header-actions">
            <div className="pill-group">
              <div className="pill dark">All Tickets <span className="count">{stats.total || 328}</span></div>
              <div className="pill light">Active <span className="count">{stats.active || 72}</span></div>
              <div className="pill light">Solved <span className="count">{stats.solved || 256}</span></div>
            </div>
            <button className="btn-red" onClick={() => setAskModalOpen(true)}>
              {Icons.plus} Ask New Question
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon yellow">{Icons.flame}</div>
            <div className="stat-info">
              <h3>2.4h</h3>
              <p>Avg. Response Time</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><div className="dot" /></div>
            <div className="stat-info">
              <h3>24</h3>
              <p>Experts Online</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">{Icons.flame}</div>
            <div className="stat-info">
              <h3>98%</h3>
              <p>Questions Answered</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal">{Icons.check}</div>
            <div className="stat-info">
              <h3>12k+</h3>
              <p>Total Resolved</p>
            </div>
          </div>
          <div className="illustration-box">
             <div className="gradient-cube">?</div>
          </div>
        </div>
      </div>

      <div className="main-content-wrapper">
        {/* LEFT COLUMN: Q&A FEED */}
        <div className="feed-column">
          {/* ASK INPUT BAR */}
          <div className="ask-input-card">
            <div className="input-row" onClick={() => setAskModalOpen(true)}>
              <div className="user-avatar-small">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop" alt="User" />
              </div>
              <input type="text" placeholder="What's your question? Be specific and get better answers." readOnly />
            </div>
            <div className="ask-actions">
              <div className="action-buttons">
                <button type="button" onClick={() => alert('Image upload coming soon!')}>{Icons.image} Add Image</button>
                <button type="button" onClick={() => alert('Code snippets coming soon!')}>{Icons.code} Add Code</button>
                <button type="button" onClick={() => alert('Document upload coming soon!')}>{Icons.file} Add Document</button>
              </div>
              <div className="submit-group">
                <div className="topic-select">
                  Select Topic {Icons.chevronDown}
                </div>
                <button className="btn-red small" onClick={() => setAskModalOpen(true)}>
                  {Icons.send} Ask Question
                </button>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="feed-filters">
            <div className="filter-tabs">
              <button className={`tab ${filter === 'Most Recent' ? 'active' : ''}`} onClick={() => setFilter('Most Recent')}>
                <span className="icon red">{Icons.flame}</span> Most Recent
              </button>
              <button className={`tab ${filter === 'Unanswered' ? 'active' : ''}`} onClick={() => setFilter('Unanswered')}>
                {Icons.message} Unanswered <span className="badge">12</span>
              </button>
              <button className={`tab ${filter === 'Following' ? 'active' : ''}`} onClick={() => setFilter('Following')}>
                {Icons.bookmark} Following
              </button>
              <button className={`tab ${filter === 'My Questions' ? 'active' : ''}`} onClick={() => setFilter('My Questions')}>
                {Icons.bookmark} My Questions
              </button>
              <button className={`tab ${filter === 'Trending' ? 'active' : ''}`} onClick={() => setFilter('Trending')}>
                {Icons.trending} Trending
              </button>
            </div>
            <div className="filter-dropdowns">
              <button className="dropdown-btn">All Topics {Icons.chevronDown}</button>
              <button className="dropdown-btn">{Icons.filter} Filters {Icons.chevronDown}</button>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="questions-list">
            {loading ? (
               <div className="loading-state">
                 <div className="spinner"></div>
               </div>
            ) : filteredQuestions.length === 0 ? (
               <div className="empty-state">
                 <h3>No questions found</h3>
                 <p>Try adjusting your filters or be the first to ask!</p>
               </div>
            ) : (
              filteredQuestions.map(q => {
                const answerCount = q.answers?.length || 0;
                const isSolved = !!q.acceptedAnswerId;
                const isUnanswered = answerCount === 0;

                return (
                  <div key={q._id} className="question-card" onClick={() => openQuestion(q)}>
                    <div className="vote-column">
                      <button className="vote-btn up">{Icons.chevronUp}</button>
                      <span className="vote-count">{Math.floor(Math.random() * 30) + 5}</span>
                      <span className="vote-label">votes</span>
                      <button className="vote-btn down">{Icons.chevronDown}</button>
                    </div>

                    <div className="q-content">
                      <div className="q-category-pill">{q.tags?.[0] || 'GENERAL'}</div>
                      <h3 className="q-title">{q.title}</h3>
                      <p className="q-desc">{q.content || q.description || 'Looking for suggestions and best practices...'}</p>
                      
                      <div className="q-meta">
                        <div className="q-author">
                           <div className="avatar xs">{q.authorId?.fullName?.[0] || 'U'}</div>
                           <span>{q.authorId?.fullName || 'User'}</span>
                           <span className="dot">•</span>
                           <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="q-stats">
                          <span className="stat"><IconWrapper>{Icons.message}</IconWrapper> {answerCount} Answers</span>
                          <span className="stat"><IconWrapper>{Icons.eye}</IconWrapper> {Math.floor(Math.random()*200)+20} Views</span>
                          <button className="bookmark-btn">{Icons.bookmark}</button>
                        </div>
                      </div>
                    </div>

                    <div className="q-status-column">
                      <button className="more-btn">...</button>
                      
                      {isSolved ? (
                        <div className="status-box solved">
                          <div className="status-badge"><IconWrapper>{Icons.check}</IconWrapper> Resolved</div>
                          <div className="solver-info">
                            <span className="solved-by-text">Solved by</span>
                            <div className="solver-profile">
                              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop" alt="Solver" />
                              <div className="solver-names">
                                <span className="s-name">Arjun Verma</span>
                                <span className="s-role">AI Expert</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : isUnanswered ? (
                        <div className="status-box unanswered">
                           <div className="status-badge"><IconWrapper>{Icons.clock}</IconWrapper> Unanswered</div>
                           <span className="unanswered-text">Be the first to answer</span>
                        </div>
                      ) : (
                        <div className="status-box active">
                           <div className="status-badge"><IconWrapper>{Icons.flame}</IconWrapper> Active</div>
                           <span className="active-text">{answerCount} new answers</span>
                           <div className="answer-avatars">
                             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=30&h=30&fit=crop" alt="User" />
                             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=30&h=30&fit=crop" alt="User" />
                             <div className="more-avatars">+2</div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="sidebar-column">
          {/* Your Impact */}
          <div className="side-card impact-card">
            <div className="card-header">
              <h3>Your Impact This Month</h3>
              <span className="dropdown">This Month {Icons.chevronDown}</span>
            </div>
            <div className="impact-stats">
              <div className="i-stat">
                <div className="icon-box orange">{Icons.message}</div>
                <h4>14</h4>
                <p>Questions Asked</p>
              </div>
              <div className="i-stat">
                <div className="icon-box blue">{Icons.check}</div>
                <h4>28</h4>
                <p>Answers Given</p>
              </div>
              <div className="i-stat">
                <div className="icon-box purple">{Icons.eye}</div>
                <h4>96</h4>
                <p>People Helped</p>
              </div>
            </div>
            <p className="impact-cheer">You're in the top <strong>10%</strong> of contributors! 🎉</p>
            <div className="impact-chart">
               {/* Decorative sine wave SVG */}
               <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{width:'100%', height:'40px'}}>
                 <path d="M0 20 Q 25 0, 50 20 T 100 20 T 150 20 T 200 20" fill="none" stroke="#d946ef" strokeWidth="2" />
                 <path d="M0 30 Q 30 10, 60 30 T 120 30 T 180 30 T 200 25" fill="none" stroke="#e9d5ff" strokeWidth="2" opacity="0.5" />
               </svg>
            </div>
            <button className="btn-outline-full" onClick={() => alert('Impact report coming soon!')}>View My Impact</button>
          </div>

          {/* Top Experts */}
          <div className="side-card experts-card">
            <div className="card-header">
              <h3>Top Experts This Month</h3>
              <button className="link-btn" onClick={() => alert('Full directory coming soon!')}>View All</button>
            </div>
            <div className="experts-list">
              {TOP_EXPERTS.map((ex, i) => (
                <div key={ex.id} className="expert-item">
                  <div className={`rank r-${i+1}`}>{ex.id}</div>
                  <img src={ex.avatar} alt={ex.name} />
                  <div className="ex-info">
                    <span className="ex-name">{ex.name}</span>
                    <span className="ex-role">{ex.role}</span>
                  </div>
                  <div className="ex-points">{ex.points} pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="side-card trending-card">
            <div className="card-header">
              <h3>Trending Topics</h3>
              <button className="link-btn" onClick={() => alert('Topics directory coming soon!')}>View All</button>
            </div>
            <div className="topics-list">
              {TRENDING_TOPICS.map(topic => (
                <div key={topic.id} className="topic-item">
                  <div className="topic-icon" style={{color: topic.color, background: `${topic.color}15`}}>{Icons.flame}</div>
                  <span className="topic-name">{topic.name}</span>
                  <div className="topic-sparkline">
                     <svg width="40" height="15" viewBox="0 0 40 15">
                       <path d="M0 10 Q 10 5, 20 12 T 40 5" fill="none" stroke={topic.color} strokeWidth="1.5" />
                     </svg>
                  </div>
                  <span className="topic-count">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QuestionModal 
        isOpen={isAskModalOpen} 
        onClose={() => setAskModalOpen(false)} 
        onSubmit={handleAskSubmit} 
        submitting={submitting} 
      />

      <ViewQuestionModal 
        question={selectedQuestion} 
        isOpen={!!selectedQuestion} 
        onClose={() => setSelectedQuestion(null)} 
        onPostAnswer={handlePostAnswer}
        postingAnswer={postingAnswer}
      />

      {/* --- STYLES --- */}
      <style jsx global>{`
        .doubts-container {
          padding: 2rem 3rem;
          background: #fdfdfd;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Helpers */
        .btn-red {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }
        .btn-red:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35); }
        .btn-red.small { padding: 0.6rem 1.25rem; font-size: 0.85rem; border-radius: 8px; box-shadow: none; }
        
        .btn-outline-full {
          width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 12px; background: white; color: #475569; font-weight: 600; cursor: pointer; transition: 0.2s;
        }
        .btn-outline-full:hover { background: #f8fafc; border-color: #cbd5e1; }

        .link-btn { background: none; border: none; color: #8b5cf6; font-size: 0.85rem; font-weight: 600; cursor: pointer; }

        /* Header */
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .header-text h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
        .gradient-text { color: #1e1b4b; }
        .header-text p { color: #64748b; margin: 0; font-size: 1.05rem; }
        
        .header-actions { display: flex; gap: 1.5rem; align-items: center; }
        .pill-group { display: flex; background: white; padding: 0.4rem; border-radius: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
        .pill { padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .pill.dark { background: #0f172a; color: white; }
        .pill.light { color: #64748b; }
        .pill .count { background: rgba(255,255,255,0.15); padding: 0.1rem 0.4rem; border-radius: 8px; font-size: 0.75rem; }
        .pill.light .count { background: #f1f5f9; color: #475569; }

        .stats-row { display: flex; gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { flex: 1; background: white; padding: 1.25rem; border-radius: 20px; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f8fafc; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.yellow { background: #fef9c3; color: #eab308; }
        .stat-icon.green { background: #dcfce7; color: #22c55e; }
        .stat-icon.orange { background: #ffedd5; color: #f97316; }
        .stat-icon.teal { background: #ccfbf1; color: #14b8a6; }
        .dot { width: 10px; height: 10px; background: currentColor; border-radius: 50%; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2); }
        .stat-info h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .stat-info p { margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 500; }
        .illustration-box { width: 180px; background: linear-gradient(135deg, #f3e8ff, #e0e7ff); border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .gradient-cube { width: 50px; height: 50px; background: linear-gradient(135deg, #d946ef, #8b5cf6); border-radius: 12px; transform: rotate(-15deg); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3); }

        /* Main Grid */
        .main-content-wrapper { display: flex; gap: 2rem; align-items: flex-start; }
        .feed-column { flex: 1; min-width: 0; }
        .sidebar-column { width: 340px; display: flex; flex-direction: column; gap: 1.5rem; flex-shrink: 0; }

        /* Ask Input Card */
        .ask-input-card { background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; margin-bottom: 2rem; border-left: 4px solid #8b5cf6; }
        .input-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; cursor: pointer; }
        .user-avatar-small img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .input-row input { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem 1.5rem; border-radius: 30px; font-size: 0.95rem; color: #0f172a; cursor: pointer; transition: 0.2s; }
        .input-row input:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .ask-actions { display: flex; justify-content: space-between; align-items: center; }
        .action-buttons { display: flex; gap: 1rem; }
        .action-buttons button { background: none; border: none; display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .action-buttons button:hover { color: #8b5cf6; }
        .submit-group { display: flex; gap: 1rem; align-items: center; }
        .topic-select { font-size: 0.85rem; color: #475569; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }

        /* Filters */
        .feed-filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
        .filter-tabs { display: flex; gap: 0.5rem; }
        .filter-tabs .tab { background: white; border: 1px solid transparent; padding: 0.6rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; }
        .filter-tabs .tab:hover { background: #f8fafc; border-color: #e2e8f0; }
        .filter-tabs .tab.active { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
        .filter-tabs .tab .icon.red { color: #ef4444; }
        .filter-tabs .tab .badge { background: #e2e8f0; padding: 0.1rem 0.4rem; border-radius: 8px; font-size: 0.7rem; color: #475569; }
        
        .filter-dropdowns { display: flex; gap: 0.5rem; }
        .dropdown-btn { background: white; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; }

        /* Questions List */
        .questions-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .question-card { background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; display: flex; gap: 1.5rem; cursor: pointer; transition: 0.2s; position: relative; }
        .question-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        
        .vote-column { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 40px; }
        .vote-btn { background: #f8fafc; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .vote-btn:hover { background: #e2e8f0; color: #0f172a; }
        .vote-count { font-weight: 800; font-size: 1.1rem; color: #0f172a; margin: 0.25rem 0; }
        .vote-label { font-size: 0.65rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; }

        .q-content { flex: 1; min-width: 0; }
        .q-category-pill { display: inline-block; background: #e0e7ff; color: #4f46e5; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; padding: 0.25rem 0.6rem; border-radius: 6px; margin-bottom: 0.75rem; text-transform: uppercase; }
        .q-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem; line-height: 1.4; }
        .q-desc { font-size: 0.9rem; color: #64748b; margin: 0 0 1.25rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .q-meta { display: flex; justify-content: space-between; align-items: center; }
        .q-author { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 500; color: #64748b; }
        .avatar { background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; border-radius: 50%; }
        .avatar.xs { width: 24px; height: 24px; font-size: 0.75rem; }
        .dot { opacity: 0.5; }
        .q-stats { display: flex; align-items: center; gap: 1rem; }
        .stat { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #64748b; font-weight: 500; }
        .bookmark-btn { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; display: flex; transition: 0.2s; }
        .bookmark-btn:hover { color: #8b5cf6; }

        .q-status-column { width: 180px; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
        .more-btn { background: none; border: none; color: #cbd5e1; font-size: 1.25rem; cursor: pointer; height: 24px; line-height: 1; }
        .status-box { padding: 1rem; border-radius: 16px; width: 100%; border: 1px solid transparent; }
        .status-badge { font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.5rem; }
        
        .status-box.solved { background: #f0fdf4; border-color: #dcfce7; }
        .status-box.solved .status-badge { color: #16a34a; }
        .solved-by-text { font-size: 0.65rem; color: #64748b; font-weight: 500; margin-bottom: 0.25rem; display: block; }
        .solver-profile { display: flex; align-items: center; gap: 0.5rem; }
        .solver-profile img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
        .solver-names { display: flex; flex-direction: column; }
        .s-name { font-size: 0.75rem; font-weight: 700; color: #0f172a; }
        .s-role { font-size: 0.65rem; color: #64748b; }

        .status-box.active { background: #fffbeb; border-color: #fef3c7; }
        .status-box.active .status-badge { color: #d97706; }
        .active-text { font-size: 0.7rem; color: #64748b; display: block; margin-bottom: 0.5rem; }
        .answer-avatars { display: flex; align-items: center; }
        .answer-avatars img { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fffbeb; margin-right: -8px; }
        .more-avatars { width: 24px; height: 24px; border-radius: 50%; background: #fef3c7; color: #d97706; font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fffbeb; z-index: 1; }

        .status-box.unanswered { background: #f8fafc; border-color: #e2e8f0; }
        .status-box.unanswered .status-badge { color: #64748b; }
        .unanswered-text { font-size: 0.7rem; color: #94a3b8; }

        /* Sidebar Cards */
        .side-card { background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .card-header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #0f172a; }
        .dropdown { font-size: 0.75rem; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; }

        .impact-stats { display: flex; justify-content: space-between; margin-bottom: 1rem; }
        .i-stat { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .icon-box { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
        .icon-box.orange { background: #ffedd5; color: #f97316; }
        .icon-box.blue { background: #dbeafe; color: #3b82f6; }
        .icon-box.purple { background: #f3e8ff; color: #a855f7; }
        .i-stat h4 { margin: 0 0 0.25rem; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
        .i-stat p { margin: 0; font-size: 0.65rem; color: #64748b; font-weight: 500; }
        .impact-cheer { font-size: 0.8rem; color: #475569; text-align: center; margin-bottom: 1rem; }
        .impact-chart { margin-bottom: 1rem; }

        .experts-list { display: flex; flex-direction: column; gap: 1rem; }
        .expert-item { display: flex; align-items: center; gap: 0.75rem; }
        .rank { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: white; }
        .r-1 { background: #f59e0b; } .r-2 { background: #94a3b8; } .r-3 { background: #d97706; } .r-4, .r-5 { background: #f1f5f9; color: #64748b; }
        .expert-item img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
        .ex-info { flex: 1; display: flex; flex-direction: column; }
        .ex-name { font-size: 0.85rem; font-weight: 700; color: #0f172a; }
        .ex-role { font-size: 0.7rem; color: #64748b; }
        .ex-points { font-size: 0.8rem; font-weight: 700; color: #22c55e; }

        .topics-list { display: flex; flex-direction: column; gap: 1rem; }
        .topic-item { display: flex; align-items: center; gap: 0.75rem; }
        .topic-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .topic-name { flex: 1; font-size: 0.85rem; font-weight: 600; color: #0f172a; }
        .topic-sparkline { width: 40px; height: 15px; }
        .topic-count { font-size: 0.8rem; font-weight: 700; color: #64748b; width: 30px; text-align: right; }

        /* Modals */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 24px; width: 100%; max-width: 600px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .view-modal { max-width: 800px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h2 { margin: 0; font-size: 1.5rem; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; transition: 0.2s; }
        .close-btn:hover { color: #0f172a; }
        
        .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-row { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; } .flex-2 { flex: 2; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
        .form-group input, .form-group textarea, .form-group select { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.95rem; font-family: inherit; transition: 0.2s; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .btn-secondary { background: white; border: 1px solid #cbd5e1; color: #475569; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #f8fafc; }
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #1e293b; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .q-category { display: inline-block; background: #e0e7ff; color: #4f46e5; font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.8rem; border-radius: 8px; }
        .q-body { border-bottom: 1px solid #f1f5f9; padding-bottom: 2rem; margin-bottom: 2rem; }
        .answers-section h3 { font-size: 1.25rem; color: #0f172a; margin: 0 0 1.5rem; }
        .answer-card { background: #f8fafc; padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 1px solid #e2e8f0; }
        .ans-author { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .avatar.sm { width: 32px; height: 32px; font-size: 0.9rem; }
        .ans-meta { display: flex; flex-direction: column; }
        .ans-meta .name { font-weight: 600; font-size: 0.9rem; color: #0f172a; }
        .ans-meta .time { font-size: 0.75rem; color: #64748b; }
        .ans-content { font-size: 0.95rem; color: #334155; line-height: 1.6; margin: 0; }
        .empty-answers { text-align: center; padding: 2rem; color: #64748b; font-style: italic; }
        .answer-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .answer-form textarea { padding: 1rem; border: 1px solid #cbd5e1; border-radius: 16px; font-size: 0.95rem; font-family: inherit; resize: vertical; }

        .loading-state { padding: 4rem; display: flex; justify-content: center; }
        .spinner { width: 40px; height: 40px; border: 3px solid #f1f5f9; border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const IconWrapper = ({ children }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </span>
);
