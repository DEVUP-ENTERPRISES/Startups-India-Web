'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import '@/styles/learning-experience.css';

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const editorRef = useRef(null);

  // Course materials
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsSearch, setMaterialsSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data } = await apiGet('/api/v1/learning/notes');
      if (data) setNotes(Array.isArray(data) ? data : []);
      setIsLoading(false);
      
      // Fetch materials as well
      await fetchMaterials();
    }
    
    async function fetchMaterials() {
      setMaterialsLoading(true);
      try {
        const { data: enrolledData } = await apiGet('/api/v1/enrollments');
        const allEnrollments = Array.isArray(enrolledData) ? enrolledData : (enrolledData?.enrollments || enrolledData?.data || []);
        
        // Filter for valid enrollments only
        const enrolled = allEnrollments.filter(e => 
          ['enrolled', 'active', 'completed'].includes(e.status) && 
          !['failed', 'pending'].includes(e.paymentStatus)
        );

        if (!enrolled.length) { setMaterialsLoading(false); return; }

        const results = await Promise.all(
          enrolled.map(async e => {
            const courseId = (typeof e.courseId === 'object' && e.courseId !== null)
              ? (e.courseId._id || e.courseId)
              : e.courseId;
            if (!courseId) return [];
            const { data } = await apiGet(`/api/v1/courses/${courseId}/materials`);
            const title = data?.courseTitle || 'Course';
            return (data?.materials || []).map(m => ({ ...m, courseTitle: title, courseId }));
          })
        );
        setMaterials(results.flat().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
      } catch (err) {
        console.error('Failed to fetch materials', err);
      } finally {
        setMaterialsLoading(false);
      }
    }

    fetchData();
  }, []);

  const deleteNote = async (id) => {
    if (!confirm('Archive this insight?')) return;
    const { data } = await apiDelete(`/api/v1/learning/notes/${id}`);
    if (data !== undefined) setNotes(notes.filter(n => n._id !== id));
  };

  const handleSaveNote = async () => {
    const content = editorRef.current ? editorRef.current.innerHTML : currentNote.content;
    if (!content || content === '<br>') return;
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/v1/learning/notes/${editingId}` : '/api/v1/learning/notes';
    const fn = editingId ? (path, body) => apiPatch(path, body) : (path, body) => apiPost(path, body);
    const { data } = await fn(url, { content, title: currentNote.title });
    if (data) {
      if (editingId) {
        setNotes(notes.map(n => n._id === editingId ? data : n));
      } else {
        setNotes([data, ...notes]);
      }
      setShowForm(false);
      setCurrentNote({ title: '', content: '' });
      setEditingId(null);
    }
  };

  const filteredNotes = useMemo(() =>
    notes.filter(n =>
      n.content?.toLowerCase().includes(search.toLowerCase()) ||
      (n.title && n.title.toLowerCase().includes(search.toLowerCase()))
    ), [notes, search]);

  const filteredMaterials = useMemo(() =>
    materials.filter(m =>
      !materialsSearch ||
      m.title?.toLowerCase().includes(materialsSearch.toLowerCase()) ||
      m.courseTitle?.toLowerCase().includes(materialsSearch.toLowerCase())
    ), [materials, materialsSearch]);

  const formatSize = b => {
    if (!b) return '';
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIcon = fileType => {
    if (!fileType) return '📋';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📋';
  };

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Insight Repository</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Your private notes and admin-uploaded course materials.</p>
        </div>

        <div style={{ position: 'relative', width: '350px' }}>
          <input
            type="text"
            placeholder={activeTab === 'materials' ? 'Search materials...' : 'Query your insights...'}
            value={activeTab === 'materials' ? materialsSearch : search}
            onChange={e => activeTab === 'materials' ? setMaterialsSearch(e.target.value) : setSearch(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #f1f5f9', padding: '12px 16px 12px 42px', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', background: 'var(--dashboard-bg)' }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            <Icon name="search" size={18} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {[
            { key: 'notes', label: 'My Notes', count: notes.length },
            { key: 'bookmarks', label: 'Bookmarks', count: notes.filter(n => n.timestamp).length },
            { key: 'materials', label: 'Course Materials', count: materials.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', fontWeight: activeTab === tab.key ? 800 : 600,
                color: activeTab === tab.key ? '#111' : '#94A3B8',
                borderBottom: activeTab === tab.key ? '3px solid #7A1F2B' : '3px solid transparent',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  background: activeTab === tab.key ? '#7A1F2B' : '#F1F5F9', 
                  color: activeTab === tab.key ? '#fff' : '#64748B', 
                  padding: '2px 8px', 
                  borderRadius: '20px',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'notes' && (
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setCurrentNote({ title: '', content: '' }); }}
            style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}
          >
            <Icon name="plus" size={16} /> New Insight
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
                <div style={{ background: 'var(--dashboard-bg)', padding: '2rem', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="Insight Title (e.g. Unit Economics)"
                      value={currentNote.title}
                      onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
                      style={{ width: '100%', border: '1px solid #f1f5f9', padding: '12px 16px', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                    />
                    <div style={{ border: '1px solid #f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        ref={editorRef}
                        contentEditable
                        style={{ minHeight: '120px', padding: '16px', outline: 'none', fontSize: '1rem', color: '#333', lineHeight: 1.6 }}
                        dangerouslySetInnerHTML={{ __html: currentNote.content }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #f1f5f9', background: 'var(--dashboard-bg)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={handleSaveNote} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#7A1F2B', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Insight</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {materials.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Course Materials</h4>
                  <button onClick={() => setActiveTab('materials')} style={{ background: 'none', border: 'none', color: '#7A1F2B', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>View All Materials</button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                  {materials.slice(0, 3).map(m => (
                    <a 
                      key={m._id} 
                      href={m.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        flex: '0 0 280px', background: '#fff', padding: '1rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none'
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        {fileIcon(m.fileType)}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{m.courseTitle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="platform-grid">
              {filteredNotes.map((note) => (
                <div key={note._id} className="platform-card-v" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: 'rgba(122, 31, 43, 0.08)', color: '#7A1F2B', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {note.timestamp ? `${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}` : 'GENERAL'}
                      </span>
                      <span style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Strategic Insight</span>
                    </div>
                    <button onClick={() => deleteNote(note._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3 }} title="Archive">
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>{note.title || 'Untitled Insight'}</h3>
                  <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7, flex: 1, marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: note.content }} />
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => { setEditingId(note._id); setCurrentNote(note); setShowForm(true); }} style={{ background: 'none', border: 'none', color: '#7A1F2B', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && filteredNotes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: 24, border: '2px dashed #e2e8f0' }}>
                <Icon name="fileText" size={48} color="#cbd5e1" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B', marginTop: '1.5rem' }}>No insights found</h2>
                <p style={{ color: '#94A3B8' }}>Start capturing strategic observations from your learning journey.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'bookmarks' && (
          <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notes.filter(n => n.timestamp).map((b) => (
                <div key={b._id} style={{ padding: '1.5rem 2rem', borderRadius: '16px', background: 'var(--dashboard-bg)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="recorded" size={20} color="#7A1F2B" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#111' }}>{b.title || 'Timestamped Bookmark'}</h4>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>Timestamp: {Math.floor(b.timestamp / 60)}:{(b.timestamp % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <button style={{ background: 'var(--dashboard-bg)', border: '1px solid #f1f5f9', padding: '8px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, color: '#111', cursor: 'pointer' }}>View</button>
                </div>
              ))}
              {notes.filter(n => n.timestamp).length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: 24, border: '2px dashed #e2e8f0' }}>
                  <Icon name="bookmark" size={40} color="#cbd5e1" />
                  <p style={{ color: '#94A3B8', marginTop: '1rem', fontWeight: 700 }}>No bookmarks yet. Timestamp a moment in a video to save it here.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'materials' && (
          <motion.div key="materials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {materialsLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8', fontWeight: 700 }}>
                Loading course materials...
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: 24, border: '2px dashed #e2e8f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📎</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B' }}>No materials found</h2>
                <p style={{ color: '#94A3B8' }}>
                  {materials.length === 0
                    ? 'Your instructors haven\'t uploaded any course materials yet.'
                    : 'No materials match your search.'}
                </p>
              </div>
            ) : (
              <>
                {/* Group by course */}
                {Array.from(new Set(filteredMaterials.map(m => m.courseTitle))).map(courseTitle => {
                  const courseMaterials = filteredMaterials.filter(m => m.courseTitle === courseTitle);
                  return (
                    <div key={courseTitle} style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: 'rgba(122,31,43,0.08)', color: '#7A1F2B', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>COURSE</span>
                        {courseTitle}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {courseMaterials.map(m => (
                          <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderRadius: '16px', background: 'var(--dashboard-bg)', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                {fileIcon(m.fileType)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>{m.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                                  {formatSize(m.size)}{m.uploadedAt ? ` • ${new Date(m.uploadedAt).toLocaleDateString()}` : ''}
                                </div>
                              </div>
                            </div>
                            <a
                              href={m.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'var(--dashboard-bg)', fontWeight: 800, fontSize: '0.85rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                            >
                              <Icon name="download" size={14} /> Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
