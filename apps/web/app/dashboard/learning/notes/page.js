'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/learning-experience.css';

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', class: '' });
  const [editingId, setEditingId] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch('/api/v1/learning/notes');
        const json = await res.json();
        if (json.success) setNotes(json.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotes();
  }, []);

  const deleteNote = async (id) => {
    if (!confirm('Archive this startup insight?')) return;
    try {
      const res = await fetch(`/api/v1/learning/notes/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      alert('Failed to archive insight.');
    }
  };

  const handleSaveNote = async () => {
    const content = editorRef.current ? editorRef.current.innerHTML : currentNote.content;
    if (!content || content === '<br>') return;
    
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/v1/learning/notes/${editingId}` : '/api/v1/learning/notes';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: currentNote.title })
      });
      const json = await res.json();
      
      if (json.success) {
        if (editingId) {
          setNotes(notes.map(n => n._id === editingId ? json.data : n));
        } else {
          setNotes([json.data, ...notes]);
        }
        setShowForm(false);
        setCurrentNote({ title: '', content: '', class: '' });
        setEditingId(null);
      }
    } catch (err) {
      alert('Failed to save note.');
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.content.toLowerCase().includes(search.toLowerCase()) || 
      (n.title && n.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [notes, search]);

  return (
    <div className="platform-page" style={{ padding: '2.5rem' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Insight Repository</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Your private hub for high-signal observations and strategic breakthroughs.</p>
        </div>

        <div style={{ position: 'relative', width: '350px' }}>
          <input
            type="text"
            placeholder="Query your insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #f1f5f9', padding: '12px 16px 12px 42px', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', background: 'var(--dashboard-bg)' }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            <Icon name="search" size={18} />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {['notes', 'bookmarks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 800 : 600,
                color: activeTab === tab ? '#111' : '#94A3B8',
                borderBottom: activeTab === tab ? '3px solid #7A1F2B' : '3px solid transparent',
                textTransform: 'capitalize',
                transition: '0.2s'
              }}
            >
              My {tab}
            </button>
          ))}
        </div>

        {activeTab === 'notes' && (
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setCurrentNote({ title: '', content: '', class: '' }); }}
            style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}
          >
            <Icon name="plus" size={16} /> New Insight
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notes' ? (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
                <div style={{ background: 'var(--dashboard-bg)', padding: '2rem', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                   <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Insight Title (e.g. Unit Economics)" 
                        value={currentNote.title}
                        onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
                        style={{ width:'100%', border:'1px solid #f1f5f9', padding:'12px 16px', borderRadius:'10px', fontSize:'1rem', fontWeight:600, outline:'none' }}
                      />
                      <div style={{ border:'1px solid #f1f5f9', borderRadius:'10px', overflow:'hidden' }}>
                        <div 
                          ref={editorRef}
                          contentEditable
                          style={{ minHeight:'120px', padding:'16px', outline:'none', fontSize:'1rem', color:'#333', lineHeight:1.6 }}
                          dangerouslySetInnerHTML={{ __html: currentNote.content }}
                        />
                      </div>
                      <div style={{ display:'flex', gap:'12px' }}>
                        <button onClick={() => setShowForm(false)} style={{ padding:'10px 20px', borderRadius:'10px', border:'1px solid #f1f5f9', background:'var(--dashboard-bg)', fontWeight:700, cursor:'pointer' }}>Cancel</button>
                        <button onClick={handleSaveNote} style={{ padding:'10px 24px', borderRadius:'10px', border:'none', background:'#7A1F2B', color:'#fff', fontWeight:700, cursor:'pointer' }}>Save Insight</button>
                      </div>
                   </div>
                </div>
              </motion.div>
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
                     <button onClick={() => { setEditingId(note._id); setCurrentNote(note); setShowForm(true); }} style={{ background:'none', border:'none', color:'#7A1F2B', fontWeight:800, fontSize:'0.85rem', cursor:'pointer' }}>Edit</button>
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
        ) : (
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
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

