'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function DoubtsPage() {
  const DUMMY_ANSWERS = {
    q_101: {
      mentorName: 'Faizan Mohammed',
      mentorRole: 'Managing Director',
      summary: 'Seed-stage pools usually sit in the 10-15% range. Use a cliff and align the first 5 hires with long-term ownership expectations.',
      detail: 'For a small founding team, keep the pool measured and milestone-driven. A standard approach is to create the option pool before the round, then allocate using role criticality, seniority, and replacement cost. A one-year cliff with monthly vesting is the default in most founder-led teams.',
      recommendation: 'Reserve enough for future key hires, but avoid over-dilution early.'
    },
    q_104: {
      mentorName: 'Jaswanth Reddy',
      mentorRole: 'Strategy Lead',
      summary: 'This is usually acceptable for a strong Series B if growth and retention remain healthy.',
      detail: 'Investors will look at payback period alongside growth rate, retention, margin structure, and the quality of the revenue mix. If you can show improvement in payback trendline and strong cohort retention, the metric set can still be fundable.',
      recommendation: 'Show a clear path to faster payback and isolate the driver of CAC inflation.'
    },
    q_106: {
      mentorName: 'Faizan Mohammed',
      mentorRole: 'Managing Director',
      summary: 'Start simple if you need faster launch velocity, then migrate to usage-based once you understand usage patterns.',
      detail: 'Usage-based pricing works best when the product value scales cleanly with consumption. Tiered pricing is simpler to sell and forecast. For early APIs, many teams launch with a hybrid: a base tier plus overages.',
      recommendation: 'Optimize for clarity first, then tune pricing to usage data.'
    }
  };

  const DUMMY_QUESTIONS = [
    { _id: 'q_101', title: "Equity distribution for first 5 hires", content: "What's the industry standard for equity pool allocation at Seed stage?", authorId: { fullName: "Rahul Kapoor" }, createdAt: "2024-05-01T08:00:00Z", tags: ["EQUITY", "HR"], solved: true },
    { _id: 'q_102', title: "GDPR compliance for US-based SaaS scaling to EU", content: "Do we need a local DPO or can we manage it remotely?", authorId: { fullName: "Elena Rodriguez" }, createdAt: "2024-04-30T16:45:00Z", tags: ["LEGAL", "COMPLIANCE"], solved: false },
    { _id: 'q_103', title: "Multi-cloud vs Single-provider lock-in", content: "Is it worth the overhead to abstract our DB layer for multi-cloud?", authorId: { fullName: "Samir Gupta" }, createdAt: "2024-04-30T11:20:00Z", tags: ["TECH", "DEVOPS"], solved: false },
    { _id: 'q_104', title: "Series B growth metrics for FinTech", content: "LTV/CAC is 4.5x but payback period is 14 months. Will this be a red flag?", authorId: { fullName: "Jessica Wu" }, createdAt: "2024-04-29T14:00:00Z", tags: ["FINANCE", "GROWTH"], solved: true },
    { _id: 'q_105', title: "SOC2 audit for enterprise sales", content: "How long does the audit process take for a team of 15?", authorId: { fullName: "Michael Chen" }, createdAt: "2024-04-29T09:30:00Z", tags: ["SECURITY", "SALES"], solved: false },
    { _id: 'q_106', title: "Pricing: Tiered vs Usage-based for API", content: "Should we start with tiered model or go straight to usage-based pricing?", authorId: { fullName: "Aria Thorne" }, createdAt: "2024-04-28T15:15:00Z", tags: ["STRATEGY", "PRODUCT"], solved: true }
  ];

  const [questions, setQuestions] = useState(DUMMY_QUESTIONS);
  const [filter, setFilter] = useState('all');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [expandedQuestionId, setExpandedQuestionId] = useState('q_101');

  const handleAskQuestion = (e) => {
    e.preventDefault();
    const newQuestion = { _id: 'q_' + Date.now(), title: formData.title, content: formData.content, authorId: { fullName: "Founder (You)" }, createdAt: new Date().toISOString(), tags: formData.tags.split(',').map(t => t.trim()), solved: false };
    setQuestions([newQuestion, ...questions]);
    setShowNewQuestion(false);
    setFormData({ title: '', content: '', tags: '' });
  };

  const filtered = questions.filter(q => filter === 'all' ? true : filter === 'solved' ? q.solved : !q.solved);

  return (
    <div style={{ background: 'var(--dashboard-bg)', minHeight: '100vh' }}>
      <motion.div aria-hidden animate={{ x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-140px', right: '-90px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(122,31,43,0.16), rgba(122,31,43,0))', pointerEvents: 'none' }} />
      <motion.div aria-hidden animate={{ x: [0, -14, 0], y: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '120px', left: '-100px', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(251,191,36,0.2), rgba(251,191,36,0))', pointerEvents: 'none' }} />
      
      <div className="platform-page" style={{ padding: '0.5rem 2.5rem', position: 'relative' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.02em', color: '#111' }}>Q&A Hub</h1>
            <p style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500, margin: 0 }}>Get expert answers to your toughest founder questions.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: '14px', padding: '6px' }}>
              {['all', 'ongoing', 'solved'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: filter === f ? '#7A1F2B' : 'transparent', color: filter === f ? '#fff' : '#94A3B8', fontWeight: 950, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: '0.2s' }}>
                  {f === 'all' ? 'All' : f === 'ongoing' ? 'Active' : 'Solved'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowNewQuestion(true)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#7A1F2B', color: '#fff', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.background = '#5a1f2b'} onMouseLeave={(e) => e.target.style.background = '#7A1F2B'}>
              <Icon name="plus" size={16} /> ASK
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(q => (
            <div key={q._id} style={{ background: '#fff', borderRadius: '24px', padding: '1.25rem 1.5rem', border: '1.5px solid #F1F5F9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.04)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.02)'}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: q.solved ? '#F0FDF4' : '#FEF2F2', color: q.solved ? '#10b981' : '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1.2rem', flexShrink: 0 }}>
                  {q.solved ? '✓' : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#111', letterSpacing: '-0.01em' }}>{q.title}</h3>
                    <span style={{ background: q.solved ? '#F0FDF4' : '#FEF2F2', color: q.solved ? '#10b981' : '#7A1F2B', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {q.solved ? 'SOLVED' : 'ACTIVE'}
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#334155', fontWeight: 600, lineHeight: 1.55 }}>{q.content}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px solid #F1F5F9', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.75rem', color: '#64748B' }}>
                        {q.authorId?.fullName?.[0]}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#111' }}>{q.authorId?.fullName}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800 }}>
                      {q.tags?.map(tag => (
                        <span key={tag} style={{ background: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>
                      ))}
                    </div>
                    <button type="button" onClick={() => setExpandedQuestionId(expandedQuestionId === q._id ? null : q._id)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: '#F8FAFC', color: '#64748B', padding: '10px 14px', borderRadius: '999px', fontWeight: 950, fontSize: '0.75rem', cursor: 'pointer' }}>
                      <Icon name="arrowRight" size={14} /> {expandedQuestionId === q._id ? 'Hide answer' : 'View answer'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedQuestionId === q._id && DUMMY_ANSWERS[q._id] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: '1rem', background: '#F8FAFC', border: '1.5px solid #F1F5F9', borderRadius: '18px', padding: '1rem 1.1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 950, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mentor Answer</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#111', marginTop: '4px' }}>{DUMMY_ANSWERS[q._id].mentorName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800 }}>{DUMMY_ANSWERS[q._id].mentorRole}</div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 800 }}>Detailed response</div>
                          </div>
                          <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600, lineHeight: 1.6 }}>{DUMMY_ANSWERS[q._id].summary}</p>
                          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600, lineHeight: 1.7 }}>{DUMMY_ANSWERS[q._id].detail}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 950, color: '#7A1F2B' }}>
                            <Icon name="arrowRight" size={14} /> {DUMMY_ANSWERS[q._id].recommendation}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showNewQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowNewQuestion(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '28px', padding: '2.5rem', width: '90%', maxWidth: '600px', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#111', marginBottom: '2rem', letterSpacing: '-0.01em' }}>Ask a Question</h2>
              <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 950, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Title</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="What's your question?" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', fontSize: '1rem', fontWeight: 700, color: '#111', outline: 'none', transition: '0.2s' }} onFocus={(e) => e.target.style.borderColor = '#7A1F2B'} onBlur={(e) => e.target.style.borderColor = '#F1F5F9'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 950, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Details</label>
                  <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Provide context and details..." rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', fontSize: '1rem', fontWeight: 700, color: '#111', outline: 'none', resize: 'vertical', transition: '0.2s', fontFamily: 'Poppins' }} onFocus={(e) => e.target.style.borderColor = '#7A1F2B'} onBlur={(e) => e.target.style.borderColor = '#F1F5F9'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 950, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Tags</label>
                  <input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="e.g. Finance, Product, HR (comma separated)" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', fontSize: '1rem', fontWeight: 700, color: '#111', outline: 'none', transition: '0.2s' }} onFocus={(e) => e.target.style.borderColor = '#7A1F2B'} onBlur={(e) => e.target.style.borderColor = '#F1F5F9'} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowNewQuestion(false)} style={{ flex: 1, padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#fff', color: '#111', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.background = '#F8FAFC'} onMouseLeave={(e) => e.target.style.background = '#fff'}>CANCEL</button>
                  <button type="submit" style={{ flex: 1, padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#7A1F2B', color: '#fff', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.background = '#5a1f2b'} onMouseLeave={(e) => e.target.style.background = '#7A1F2B'}>SUBMIT</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
