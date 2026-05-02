'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'quiz',
  courseId: '',
  timeLimit: 30,
  passingScore: 60,
  maxAttempts: 1,
  violationLimit: 3,
  randomizeQuestions: false,
  status: 'draft',
};

const EMPTY_QUESTION = {
  text: '',
  type: 'mcq',
  points: 1,
  explanation: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
};

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('details');

  const load = useCallback(async () => {
    setLoading(true);
    const [aRes, cRes] = await Promise.all([
      apiGet('/api/v1/assessments'),
      apiGet('/api/v1/admin/courses?limit=100'),
    ]);
    if (aRes.data) setAssessments(Array.isArray(aRes.data) ? aRes.data : []);
    if (cRes.data) setCourses(cRes.data.courses || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setQuestions([{ ...EMPTY_QUESTION, options: EMPTY_QUESTION.options.map(o => ({ ...o })) }]);
    setTab('details');
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title || '',
      description: a.description || '',
      type: a.type || 'quiz',
      courseId: a.courseId?._id || a.courseId || '',
      timeLimit: a.timeLimit || 30,
      passingScore: a.passingScore || 60,
      maxAttempts: a.maxAttempts || 1,
      violationLimit: a.violationLimit || 3,
      randomizeQuestions: a.randomizeQuestions || false,
      status: a.status || 'draft',
    });
    setQuestions((a.questions || []).map(q => ({
      ...q,
      options: (q.options || []).map(o => ({ ...o })),
    })));
    setTab('details');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title is required.'); return; }
    if (questions.length === 0) { alert('Add at least one question.'); return; }

    for (const [qi, q] of questions.entries()) {
      if (!q.text.trim()) { alert(`Question ${qi + 1} is missing text.`); return; }
      if (q.options.filter(o => o.text.trim()).length < 2) { alert(`Question ${qi + 1} needs at least 2 option texts.`); return; }
      if (!q.options.some(o => o.isCorrect)) { alert(`Question ${qi + 1} has no correct answer marked.`); return; }
    }

    setSaving(true);
    const payload = {
      ...form,
      questions: questions.map(q => ({
        ...q,
        options: q.options.filter(o => o.text.trim()),
      })),
    };

    let err;
    if (editing) {
      ({ error: err } = await apiPatch(`/api/v1/assessments/${editing._id}`, payload));
    } else {
      ({ error: err } = await apiPost('/api/v1/assessments', payload));
    }

    setSaving(false);
    if (err) { alert(err.message || 'Save failed'); return; }
    setShowForm(false);
    load();
  };

  const handleDelete = async (a) => {
    if (!confirm(`Delete "${a.title}" permanently?`)) return;
    await apiDelete(`/api/v1/assessments/${a._id}`);
    load();
  };

  const handleToggleStatus = async (a) => {
    const next = a.status === 'published' ? 'draft' : 'published';
    await apiPatch(`/api/v1/assessments/${a._id}`, { status: next });
    load();
  };

  // ── Question builder helpers ──────────────────────────────────────────────
  const addQuestion = () => {
    setQuestions([...questions, { ...EMPTY_QUESTION, options: EMPTY_QUESTION.options.map(o => ({ ...o })) }]);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateOption = (qi, oi, field, value) => {
    setQuestions(questions.map((q, i) => {
      if (i !== qi) return q;
      const opts = q.options.map((o, j) => {
        if (j !== oi) return field === 'isCorrect' && q.type === 'mcq' ? { ...o, isCorrect: false } : o;
        return { ...o, [field]: value };
      });
      return { ...q, options: opts };
    }));
  };

  const addOption = (qi) => {
    setQuestions(questions.map((q, i) => i !== qi ? q : { ...q, options: [...q.options, { text: '', isCorrect: false }] }));
  };

  const removeOption = (qi, oi) => {
    setQuestions(questions.map((q, i) => i !== qi ? q : { ...q, options: q.options.filter((_, j) => j !== oi) }));
  };

  const filtered = assessments.filter(a =>
    !filter || a.title.toLowerCase().includes(filter.toLowerCase()) || a.type === filter
  );

  const typeColor = { quiz: '#3B82F6', exam: '#EF4444', assignment: '#F59E0B' };

  return (
    <div style={{ padding: '2rem', fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.03em' }}>Assessments</h1>
          <p style={{ color: '#94A3B8', fontWeight: 600, marginTop: '4px', fontSize: '0.9rem' }}>Manage quizzes, exams, and assignments</p>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: '10px 22px', background: '#7A1F2B', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          + New Assessment
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Search assessments..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
        />
        {['', 'quiz', 'exam', 'assignment'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid', borderColor: filter === t ? '#7A1F2B' : '#E2E8F0', background: filter === t ? 'rgba(122,31,43,0.06)' : '#fff', color: filter === t ? '#7A1F2B' : '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8', fontWeight: 700 }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8', fontWeight: 700 }}>
          No assessments found. Create your first one.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Title', 'Type', 'Questions', 'Time', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1.5px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{a.title}</div>
                    {a.courseId?.title && <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{a.courseId.title}</div>}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', background: `${typeColor[a.type]}15`, color: typeColor[a.type] }}>{a.type}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#475569' }}>{a.questions?.length || 0}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#475569' }}>{a.timeLimit ? `${a.timeLimit}m` : '—'}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <button
                      onClick={() => handleToggleStatus(a)}
                      style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: a.status === 'published' ? '#DCFCE7' : '#FEF9C3', color: a.status === 'published' ? '#16A34A' : '#A16207' }}
                    >
                      {a.status}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(a)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #E2E8F0', background: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', color: '#475569' }}>Edit</button>
                      <button onClick={() => handleDelete(a)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#FEF2F2', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', color: '#EF4444' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div style={{ background: '#fff', borderRadius: '28px', width: '100%', maxWidth: 860, marginBottom: '2rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ padding: '1.75rem 2rem', borderBottom: '1.5px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>
                {editing ? 'Edit Assessment' : 'New Assessment'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94A3B8', lineHeight: 1 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1.5px solid #F1F5F9', padding: '0 2rem' }}>
              {['details', 'questions'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ padding: '1rem 1.25rem', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #7A1F2B' : '2px solid transparent', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', color: tab === t ? '#7A1F2B' : '#94A3B8', textTransform: 'capitalize', marginBottom: '-1px' }}
                >
                  {t === 'questions' ? `Questions (${questions.length})` : 'Details'}
                </button>
              ))}
            </div>

            <div style={{ padding: '2rem' }}>
              {tab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Type selector */}
                  <div>
                    <label style={labelStyle}>Assessment Type</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {[['quiz', 'Quiz', 'Standard quiz — no fullscreen restrictions'], ['exam', 'Exam (Fullscreen)', 'Fullscreen mode with anti-cheat enforcement'], ['assignment', 'Assignment', 'File/text submission with deadline']].map(([val, label, desc]) => (
                        <button
                          key={val}
                          onClick={() => setForm({ ...form, type: val })}
                          style={{ flex: 1, minWidth: 180, padding: '1rem', borderRadius: '14px', border: '2px solid', borderColor: form.type === val ? '#7A1F2B' : '#E2E8F0', background: form.type === val ? 'rgba(122,31,43,0.04)' : '#fff', cursor: 'pointer', textAlign: 'left' }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: form.type === val ? '#7A1F2B' : '#0F172A', marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, lineHeight: 1.4 }}>{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Title *</label>
                      <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Startup Fundamentals Quiz" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Description</label>
                      <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of this assessment..." style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Course</label>
                      <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} style={inputStyle}>
                        <option value="">— None —</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Duration (minutes)</label>
                      <input type="number" min={1} value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: Number(e.target.value) })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Passing Score (%)</label>
                      <input type="number" min={0} max={100} value={form.passingScore} onChange={e => setForm({ ...form, passingScore: Number(e.target.value) })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Max Attempts</label>
                      <input type="number" min={1} value={form.maxAttempts} onChange={e => setForm({ ...form, maxAttempts: Number(e.target.value) })} style={inputStyle} />
                    </div>
                    {form.type === 'exam' && (
                      <div>
                        <label style={labelStyle}>Violation Limit (auto-submit after N violations)</label>
                        <input type="number" min={1} max={10} value={form.violationLimit} onChange={e => setForm({ ...form, violationLimit: Number(e.target.value) })} style={inputStyle} />
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" id="randomize" checked={form.randomizeQuestions} onChange={e => setForm({ ...form, randomizeQuestions: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                      <label htmlFor="randomize" style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem', cursor: 'pointer' }}>Randomize question order</label>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'questions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {questions.map((q, qi) => (
                    <div key={qi} style={{ border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1.5rem', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question {qi + 1}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="number" min={1} value={q.points} onChange={e => updateQuestion(qi, 'points', Number(e.target.value))} style={{ width: 60, padding: '4px 8px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }} title="Points" />
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>pts</span>
                          {questions.length > 1 && (
                            <button onClick={() => removeQuestion(qi)} style={{ padding: '4px 10px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
                          )}
                        </div>
                      </div>

                      <textarea
                        value={q.text}
                        onChange={e => updateQuestion(qi, 'text', e.target.value)}
                        placeholder="Question text..."
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical', marginBottom: '1.25rem' }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type={q.type === 'mcq' ? 'radio' : 'checkbox'}
                              name={`q${qi}_correct`}
                              checked={opt.isCorrect}
                              onChange={e => updateOption(qi, oi, 'isCorrect', e.target.checked)}
                              style={{ width: 18, height: 18, flexShrink: 0, cursor: 'pointer', accentColor: '#7A1F2B' }}
                              title="Mark as correct"
                            />
                            <input
                              value={opt.text}
                              onChange={e => updateOption(qi, oi, 'text', e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                              style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                            />
                            {q.options.length > 2 && (
                              <button onClick={() => removeOption(qi, oi)} style={{ padding: '6px 10px', background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', color: '#94A3B8', fontSize: '0.8rem' }}>✕</button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => addOption(qi)} style={{ alignSelf: 'flex-start', padding: '6px 14px', border: '1.5px dashed #E2E8F0', background: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#94A3B8', cursor: 'pointer' }}>
                          + Add Option
                        </button>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <input
                          value={q.explanation || ''}
                          onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                          placeholder="Explanation (shown after submission, optional)"
                          style={{ ...inputStyle, fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  ))}

                  <button onClick={addQuestion} style={{ padding: '1rem', border: '2px dashed #E2E8F0', background: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '0.9rem', color: '#94A3B8', cursor: 'pointer', width: '100%' }}>
                    + Add Question
                  </button>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1.5px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                {questions.length} question{questions.length !== 1 ? 's' : ''} · {questions.reduce((s, q) => s + (q.points || 1), 0)} total points
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setShowForm(false)} style={{ padding: '10px 22px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', color: '#475569' }}>Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: saving ? '#94A3B8' : '#7A1F2B', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: saving ? 'default' : 'pointer' }}
                >
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px'
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
  fontWeight: 600, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif", marginBottom: 0
};
