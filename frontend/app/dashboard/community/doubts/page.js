'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { getCurrentUser } from '@/lib/auth';
import { getQuestions, createQuestion, voteQuestion, submitAnswer } from '@/lib/community';
import '@/styles/community-discussions.css';
const DEFAULT_QUESTIONS = [
  {
    _id: 'q1',
    title: 'How to choose the right machine learning model for my startup?',
    content: 'I am working on a predictive analytics product and confused between using Random Forest, XGBoost or Neural Networks. What factors should I consider?',
    authorId: { fullName: 'Rohit Sharma', avatarUrl: '' },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['AI/ML'],
    votes: 23,
    voterIds: [],
    answersCount: 4,
    status: 'solved',
    solvedBy: { name: 'Arjun Verma', role: 'AI Expert' },
    answers: [
      {
        _id: 'a1',
        authorId: { fullName: 'Arjun Verma', role: 'AI Expert' },
        content: 'Start with XGBoost or Random Forest for tabular data. Neural Networks excel when handling unstructured data (text, images, audio). XGBoost gives higher explainability and requires less hyperparameter tuning for early MVPs.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isAccepted: true,
      },
    ],
  },
  {
    _id: 'q2',
    title: 'What are the best platforms to raise pre-seed funding in India?',
    content: 'Looking for platforms or networks where I can pitch my pre-seed stage startup. Any suggestions or experiences with Indian angel networks?',
    authorId: { fullName: 'Neha Iyer', avatarUrl: '' },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    tags: ['FUNDING'],
    votes: 15,
    voterIds: [],
    answersCount: 3,
    status: 'active',
    answers: [
      {
        _id: 'a2',
        authorId: { fullName: 'Karan Mehta', role: 'Product Strategist' },
        content: 'Check Indian Angel Network (IAN), Inflection Point Ventures (IPV), and LetsVenture. Also target micro-VCs like Blume Ventures and India Quotient.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        isAccepted: false,
      },
    ],
  },
  {
    _id: 'q3',
    title: 'How do I validate my MVP idea with minimum cost?',
    content: 'What are the leanest ways to validate an MVP idea before investing too much time and money into full stack engineering?',
    authorId: { fullName: 'Karan Mehta', avatarUrl: '' },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    tags: ['PRODUCT'],
    votes: 9,
    voterIds: [],
    answersCount: 0,
    status: 'unanswered',
    answers: [],
  },
  {
    _id: 'q4',
    title: 'What growth strategies worked for your early user acquisition?',
    content: 'Would love to hear what channels and tactics worked for your early days to acquire your first 1,000 users without ad spend.',
    authorId: { fullName: 'Riya Sharma', avatarUrl: '' },
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    tags: ['GROWTH'],
    votes: 31,
    voterIds: [],
    answersCount: 8,
    status: 'solved',
    solvedBy: { name: 'Riya Sharma', role: 'Growth Advisor' },
    answers: [
      {
        _id: 'a3',
        authorId: { fullName: 'Riya Sharma', role: 'Growth Advisor' },
        content: 'Community-led growth (ProductHunt launch + Reddit niche subreddits) and targeted cold outreach on LinkedIn converted our first 1k users.',
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
        isAccepted: true,
      },
    ],
  },
];

const TOP_EXPERTS = [
  { rank: 1, name: 'Arjun Verma', title: 'AI Expert', pts: '156 pts', color: '#EAB308' },
  { rank: 2, name: 'Riya Sharma', title: 'Growth Advisor', pts: '142 pts', color: '#94A3B8' },
  { rank: 3, name: 'Karan Mehta', title: 'Product Strategist', pts: '98 pts', color: '#B45309' },
  { rank: 4, name: 'Neha Iyer', title: 'Marketing Expert', pts: '76 pts', color: '#64748B' },
  { rank: 5, name: 'Vikram Rao', title: 'Tech Mentor', pts: '65 pts', color: '#64748B' },
];

const TRENDING_TOPICS = [
  { name: 'AI / Machine Learning', count: 122 },
  { name: 'Funding & Investment', count: 86 },
  { name: 'Product Strategy', count: 84 },
  { name: 'Marketing Growth', count: 74 },
  { name: 'Team & Hiring', count: 62 },
];

export default function ExpertQAHubPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [filter, setFilter] = useState('recent'); // 'recent' | 'unanswered' | 'solved'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states for Ask Question Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalTopic, setModalTopic] = useState('AI/ML');

  // Answer states
  const [expandedQId, setExpandedQId] = useState(null);
  const [answerDraft, setAnswerDraft] = useState('');

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

  // Fetch questions from backend
  useEffect(() => {
    setLoading(true);
    getQuestions(filter)
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setQuestions(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const canAnswer = currentUser?.role === 'admin' || currentUser?.role === 'mentor' || currentUser?.role === 'expert';

  const handleVote = async (questionId) => {
    const userId = currentUser?._id || currentUser?.userId;
    if (!userId) return;

    setQuestions((prev) =>
      prev.map((q) => {
        if (q._id !== questionId) return q;
        const voterList = q.voterIds || [];
        const hasVoted = voterList.some((id) => (typeof id === 'object' ? id._id : id) === userId);
        const updatedVoters = hasVoted
          ? voterList.filter((id) => (typeof id === 'object' ? id._id : id) !== userId)
          : [...voterList, userId];
        const updatedScore = hasVoted ? Math.max(0, (q.votes || 0) - 1) : (q.votes || 0) + 1;

        return { ...q, votes: updatedScore, voterIds: updatedVoters };
      })
    );

    try {
      await voteQuestion(questionId);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handleCreateQuestion = async (e) => {
    if (e) e.preventDefault();
    const title = modalTitle.trim();
    if (!title) return;

    const tempQ = {
      _id: 'q_' + Date.now(),
      title,
      content: modalContent.trim() || title,
      authorId: { fullName: currentUser?.fullName || 'You', avatarUrl: '' },
      createdAt: new Date().toISOString(),
      tags: [modalTopic],
      votes: 1,
      voterIds: [currentUser?._id || currentUser?.userId],
      answersCount: 0,
      status: 'unanswered',
      answers: [],
    };

    setQuestions((prev) => [tempQ, ...prev]);
    setModalTitle('');
    setModalContent('');
    setShowModal(false);

    try {
      const res = await createQuestion({
        title: tempQ.title,
        content: tempQ.content,
        tags: tempQ.tags,
      });
      if (res?.data) {
        setQuestions((prev) => prev.map((q) => (q._id === tempQ._id ? res.data : q)));
      }
    } catch (err) {
      alert(err.message || 'Error submitting question');
    }
  };

  const handleAddAnswer = async (questionId) => {
    const text = answerDraft.trim();
    if (!text || !canAnswer) return;

    const newAnswer = {
      _id: 'a_' + Date.now(),
      authorId: { fullName: currentUser?.fullName || 'You', role: currentUser?.role || 'mentor' },
      content: text,
      createdAt: new Date().toISOString(),
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId
          ? {
              ...q,
              answersCount: (q.answersCount || 0) + 1,
              answers: [...(q.answers || []), newAnswer],
            }
          : q
      )
    );

    setAnswerDraft('');

    try {
      await submitAnswer(questionId, text);
    } catch (err) {
      alert(err.message || 'Error submitting answer');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'unanswered') return q.status === 'unanswered' || q.answersCount === 0;
    if (filter === 'solved') return q.status === 'solved';
    return true;
  });

  return (
    <div className="qa-root">
      {/* ── TOP HEADER ── */}
      <div className="qa-top-header">
        <div className="qa-header-left">
          <h1 className="qa-main-title">Expert Q&A Hub</h1>
          <p className="qa-main-sub">Get expert answers. Share knowledge. Grow together.</p>
        </div>

        <div className="qa-header-right">
          <div className="qa-stat-pill">
            <span>All Tickets</span> <strong>{questions.length * 8}</strong>
          </div>
          <div className="qa-stat-pill qa-stat-active">
            <span>Active</span> <strong>{questions.filter((q) => q.status !== 'solved').length}</strong>
          </div>
          <div className="qa-stat-pill qa-stat-solved">
            <span>Solved</span> <strong>{questions.filter((q) => q.status === 'solved').length}</strong>
          </div>
          <button className="qa-ask-btn" onClick={() => setShowModal(true)}>
            + Ask New Question
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="qa-search-bar-wrap">
        <div className="qa-search-box">
          <Icon name="search" size={18} color="#64748B" />
          <input
            type="text"
            className="qa-search-input"
            placeholder="Search existing questions & answers before asking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="qa-clear-btn" onClick={() => setSearchQuery('')}>
              <Icon name="x" size={14} color="#94A3B8" />
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT & SIDEBAR ── */}
      <div className="qa-body-grid">
        {/* LEFT COLUMN: FILTERS & QUESTIONS LIST */}
        <div className="qa-main-col">
          {/* FILTER BAR */}
          <div className="qa-filter-bar">
            <div className="qa-filter-pills">
              <button
                className={`qa-filter-pill${filter === 'recent' ? ' active' : ''}`}
                onClick={() => setFilter('recent')}
              >
                Most Recent
              </button>
              <button
                className={`qa-filter-pill${filter === 'unanswered' ? ' active' : ''}`}
                onClick={() => setFilter('unanswered')}
              >
                Unanswered
              </button>
              <button
                className={`qa-filter-pill${filter === 'solved' ? ' active' : ''}`}
                onClick={() => setFilter('solved')}
              >
                Solved Questions
              </button>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="qa-questions-list">
            {loading ? (
              <div className="qa-empty-state">Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="qa-empty-state">
                <Icon name="search" size={32} color="#94A3B8" />
                <p style={{ marginTop: 8 }}>No questions found matching your criteria.</p>
                <button
                  className="qa-ask-btn"
                  style={{ marginTop: 12 }}
                  onClick={() => setShowModal(true)}
                >
                  Ask a New Question
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const authorName = q.authorId?.fullName || 'Community Member';
                const tag = q.tags?.[0] || 'GENERAL';
                const isExpanded = expandedQId === q._id;

                const userId = currentUser?._id || currentUser?.userId;
                const hasVoted = (q.voterIds || []).some(
                  (id) => (typeof id === 'object' ? id._id : id) === userId
                );

                return (
                  <div key={q._id} className="qa-q-card">
                    {/* VOTE BOX */}
                    <div className="qa-vote-box">
                      <button
                        className={`qa-vote-btn${hasVoted ? ' voted' : ''}`}
                        onClick={() => handleVote(q._id)}
                        title={hasVoted ? 'Cancel vote' : 'Upvote question'}
                      >
                        ▲
                      </button>
                      <span className="qa-vote-count">{q.votes || 0}</span>
                      <span className="qa-vote-lbl">votes</span>
                    </div>

                    {/* MAIN CARD CONTENT */}
                    <div className="qa-q-content">
                      <div className="qa-q-top-row">
                        <span className={`qa-tag-badge qa-tag-${tag.toLowerCase().replace('/', '')}`}>
                          {tag}
                        </span>
                        {q.status === 'solved' ? (
                          <span className="qa-status-badge qa-status-solved">
                            ✓ Resolved
                          </span>
                        ) : q.answersCount > 0 ? (
                          <span className="qa-status-badge qa-status-active">
                            Active
                          </span>
                        ) : (
                          <span className="qa-status-badge qa-status-unanswered">
                            Unanswered
                          </span>
                        )}
                      </div>

                      <h3 className="qa-q-title">{q.title}</h3>
                      <p className="qa-q-excerpt">{q.content}</p>

                      <div className="qa-q-footer">
                        <div className="qa-q-author">
                          <div className="qa-author-avatar">{authorName[0]}</div>
                          <span className="qa-author-name">{authorName}</span>
                          <span className="qa-dot">•</span>
                          <span className="qa-q-time">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'recently'}
                          </span>
                        </div>

                        <div className="qa-q-meta">
                          <button
                            className="qa-meta-btn"
                            onClick={() => setExpandedQId(isExpanded ? null : q._id)}
                          >
                            <Icon name="messageSquare" size={14} color="#64748B" />
                            {q.answersCount || q.answers?.length || 0} Answers
                          </button>
                          <button className="qa-meta-btn" title="Bookmark">
                            <Icon name="bookmark" size={14} color="#64748B" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDABLE ANSWERS SECTION */}
                      {isExpanded && (
                        <div className="qa-answers-box">
                          <h4 className="qa-answers-title">Expert Answers & Responses</h4>
                          {q.answers && q.answers.length > 0 ? (
                            q.answers.map((a) => (
                              <div key={a._id} className="qa-answer-item">
                                <div className="qa-answer-header">
                                  <div className="qa-author-avatar">
                                    {a.authorId?.fullName?.[0] || 'M'}
                                  </div>
                                  <div>
                                    <span className="qa-answer-name">{a.authorId?.fullName || 'Mentor'}</span>
                                    {a.authorId?.role && <span className="qa-role-badge">{a.authorId.role}</span>}
                                  </div>
                                  {a.isAccepted && <span className="qa-accepted-tag">✓ Best Answer</span>}
                                </div>
                                <p className="qa-answer-text">{a.content}</p>
                              </div>
                            ))
                          ) : (
                            <p className="qa-no-ans">No expert responses yet.</p>
                          )}

                          {/* ADD ANSWER INPUT (RESTRICTED TO MENTORS & ADMINS) */}
                          {canAnswer ? (
                            <div className="qa-answer-input-row">
                              <input
                                type="text"
                                className="qa-ans-input"
                                placeholder="Write your expert response..."
                                value={answerDraft}
                                onChange={(e) => setAnswerDraft(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddAnswer(q._id);
                                }}
                              />
                              <button
                                className="qa-ans-submit"
                                onClick={() => handleAddAnswer(q._id)}
                                disabled={!answerDraft.trim()}
                              >
                                Submit Answer
                              </button>
                            </div>
                          ) : (
                            <div className="qa-restricted-note">
                              🔒 Only verified mentors and admins can answer questions.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* RIGHT COLUMN: IMPACT & TOP EXPERTS SIDEBAR */}
        <div className="qa-sidebar-col">
          {/* IMPACT CARD */}
          <div className="qa-sidebar-card qa-impact-card">
            <div className="qa-card-header">
              <span className="qa-card-title">Your Impact This Month</span>
            </div>

            <div className="qa-impact-stats">
              <div className="qa-stat-item">
                <div className="qa-stat-num">14</div>
                <div className="qa-stat-lbl">Questions Asked</div>
              </div>
              <div className="qa-stat-item">
                <div className="qa-stat-num">28</div>
                <div className="qa-stat-lbl">Answers Given</div>
              </div>
              <div className="qa-stat-item">
                <div className="qa-stat-num">96</div>
                <div className="qa-stat-lbl">People Helped</div>
              </div>
            </div>

            <div className="qa-impact-banner">
              You are in the top <strong>10%</strong> of active contributors!
            </div>
          </div>

          {/* TOP EXPERTS THIS MONTH */}
          <div className="qa-sidebar-card">
            <div className="qa-card-header">
              <span className="qa-card-title">Top Experts This Month</span>
            </div>

            <div className="qa-experts-list">
              {TOP_EXPERTS.map((exp) => (
                <div key={exp.rank} className="qa-expert-item">
                  <div className="qa-expert-rank" style={{ color: exp.color }}>
                    #{exp.rank}
                  </div>
                  <div className="qa-author-avatar">{exp.name[0]}</div>
                  <div className="qa-expert-info">
                    <div className="qa-expert-name">{exp.name}</div>
                    <div className="qa-expert-title">{exp.title}</div>
                  </div>
                  <div className="qa-expert-pts">{exp.pts}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING TOPICS */}
          <div className="qa-sidebar-card">
            <div className="qa-card-header">
              <span className="qa-card-title">Trending Topics</span>
            </div>

            <div className="qa-topics-list">
              {TRENDING_TOPICS.map((topic) => (
                <div key={topic.name} className="qa-topic-item">
                  <span className="qa-topic-name">{topic.name}</span>
                  <span className="qa-topic-count">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ASK QUESTION MODAL ── */}
      {showModal && (
        <div className="cd-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="cd-modal" style={{ maxWidth: 560 }}>
            <div className="cd-modal-header">
              <span className="cd-modal-title">Ask a Question</span>
              <button className="cd-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion}>
              <div className="cd-modal-field">
                <label className="cd-modal-label">Question Title</label>
                <input
                  type="text"
                  required
                  className="cd-modal-input"
                  placeholder="e.g. How to structure early ESOP pools for seed stage?"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                />
              </div>

              <div className="cd-modal-field">
                <label className="cd-modal-label">Details & Context</label>
                <textarea
                  rows={4}
                  className="cd-modal-input"
                  placeholder="Provide context so mentors can give accurate advice..."
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="cd-modal-field">
                <label className="cd-modal-label">Topic Category</label>
                <select
                  className="cd-modal-input"
                  value={modalTopic}
                  onChange={(e) => setModalTopic(e.target.value)}
                  style={{ background: '#fff' }}
                >
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="FUNDING">Funding & Investors</option>
                  <option value="PRODUCT">Product Strategy</option>
                  <option value="GROWTH">Marketing & Growth</option>
                  <option value="TECH">Engineering & Tech</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="cd-modal-btn cd-modal-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cd-modal-btn">
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .qa-root {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #0f172a;
        }

        /* Top Header */
        .qa-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .qa-main-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .qa-main-sub {
          font-size: 14px;
          color: #64748b;
          margin: 4px 0 0;
        }

        .qa-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .qa-stat-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 13px;
          color: #475569;
        }
        .qa-stat-pill strong {
          color: #0f172a;
          margin-left: 4px;
        }
        .qa-stat-active strong {
          color: #16A34A;
        }
        .qa-stat-solved strong {
          color: #2563EB;
        }

        .qa-ask-btn {
          background: #7A1F2B;
          color: #ffffff;
          border: none;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .qa-ask-btn:hover {
          transform: translateY(-2px);
        }

        /* Search Bar Wrap */
        .qa-search-bar-wrap {
          margin-bottom: 24px;
        }
        .qa-search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 18px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.02);
        }
        .qa-search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #0f172a;
        }
        .qa-clear-btn {
          border: none;
          background: transparent;
          cursor: pointer;
        }

        /* Body Grid */
        .qa-body-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        /* Filter Bar */
        .qa-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .qa-filter-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .qa-filter-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }
        .qa-filter-pill.active {
          background: #7A1F2B;
          color: #ffffff;
          border-color: #7A1F2B;
        }

        /* Questions List */
        .qa-questions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .qa-empty-state {
          text-align: center;
          padding: 40px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qa-q-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          gap: 20px;
          transition: box-shadow 0.2s ease;
        }
        .qa-q-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.04);
        }

        .qa-vote-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px 14px;
          width: 54px;
          flex-shrink: 0;
        }
        .qa-vote-btn {
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 12px;
          cursor: pointer;
          padding: 2px;
        }
        .qa-vote-btn.voted {
          color: #7A1F2B;
          font-weight: 800;
        }
        .qa-vote-count {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .qa-vote-lbl {
          font-size: 10px;
          color: #94a3b8;
        }

        .qa-q-content {
          flex: 1;
          min-width: 0;
        }
        .qa-q-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .qa-tag-badge {
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .qa-tag-aiml { background: #FCE7F3; color: #BE185D; }
        .qa-tag-funding { background: #E0F2FE; color: #0369A1; }
        .qa-tag-product { background: #F3E8FF; color: #6B21A8; }
        .qa-tag-growth { background: #DCFCE7; color: #15803D; }

        .qa-status-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 99px;
        }
        .qa-status-solved { background: #F0FDF4; color: #16A34A; }
        .qa-status-active { background: #FFFBEB; color: #B45309; }
        .qa-status-unanswered { background: #F1F5F9; color: #64748B; }

        .qa-q-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          line-height: 1.4;
        }
        .qa-q-excerpt {
          font-size: 13.5px;
          color: #475569;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .qa-q-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }
        .qa-q-author {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
        }
        .qa-author-avatar {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #7A1F2B;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qa-author-name {
          font-weight: 700;
          color: #1e293b;
        }
        .qa-dot { color: #cbd5e1; }

        .qa-q-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .qa-meta-btn {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Answers Box */
        .qa-answers-box {
          margin-top: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
        }
        .qa-answers-title {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
        }
        .qa-answer-item {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
        }
        .qa-answer-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .qa-answer-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .qa-role-badge {
          font-size: 10px;
          background: #e2e8f0;
          color: #475569;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }
        .qa-accepted-tag {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          color: #16A34A;
          background: #F0FDF4;
          padding: 2px 8px;
          border-radius: 99px;
        }
        .qa-answer-text {
          font-size: 13px;
          color: #334155;
          margin: 0;
          line-height: 1.45;
        }
        .qa-no-ans {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .qa-restricted-note {
          background: #FEF2F2;
          color: #7A1F2B;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }

        .qa-answer-input-row {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .qa-ans-input {
          flex: 1;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          outline: none;
        }
        .qa-ans-submit {
          background: #7A1F2B;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Sidebar Column */
        .qa-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .qa-sidebar-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .qa-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .qa-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .qa-impact-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          text-align: center;
          margin-bottom: 16px;
        }
        .qa-stat-num {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }
        .qa-stat-lbl {
          font-size: 10px;
          color: #64748b;
          margin-top: 2px;
        }

        .qa-impact-banner {
          background: #FEF2F2;
          color: #7A1F2B;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        /* Experts List */
        .qa-experts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .qa-expert-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qa-expert-rank {
          font-size: 14px;
          font-weight: 800;
          width: 20px;
        }
        .qa-expert-info {
          flex: 1;
        }
        .qa-expert-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .qa-expert-title {
          font-size: 11px;
          color: #64748b;
        }
        .qa-expert-pts {
          font-size: 12px;
          font-weight: 700;
          color: #16A34A;
        }

        /* Topics List */
        .qa-topics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .qa-topic-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #334155;
          font-weight: 600;
        }
        .qa-topic-count {
          color: #94a3b8;
          font-weight: 700;
        }

        @media (max-width: 1060px) {
          .qa-body-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
