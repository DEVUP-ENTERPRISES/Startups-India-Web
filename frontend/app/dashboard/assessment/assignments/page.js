'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [documents, setDocuments] = useState([{ title: '', url: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [taskRes, resultRes] = await Promise.all([
          fetch('/api/v1/assessments?type=assignment'),
          fetch('/api/v1/assessments/results/all')
        ]);
        
        const taskJson = await taskRes.json();
        const resultJson = await resultRes.json();
        
        const fetchedTasks = taskJson.success && Array.isArray(taskJson.data) ? taskJson.data : [];
        setAssignments(fetchedTasks);
        if (resultJson.success && Array.isArray(resultJson.data)) setResults(resultJson.data);
      } catch (err) {
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingTasks = useMemo(() => {
    return assignments.filter(task => {
      const submission = results.find(r => r.assessmentId?._id === task._id || r.assessmentId === task._id);
      return !submission;
    });
  }, [assignments, results]);

  const filteredTasks = useMemo(() => {
    return pendingTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [pendingTasks, search]);

  const addDocumentSlot = () => setDocuments([...documents, { title: '', url: '' }]);
  
  const updateDocument = (idx, field, val) => {
    const newDocs = [...documents];
    newDocs[idx][field] = val;
    setDocuments(newDocs);
  };

  const removeDocument = (idx) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async () => {
    const validDocs = documents.filter(d => d.url.trim());
    if (validDocs.length === 0) return alert('Please provide at least one document URL.');
    
    setIsSubmitting(true);
    try {
      const submissionContent = validDocs.map(d => `${d.title || 'Untitled Document'}: ${d.url}`).join('\n');
      const res = await fetch(`/api/v1/assessments/${selectedTask._id}/assignment-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionContent })
      });
      const json = await res.json();
      if (json.success) {
        alert('Assignment submitted successfully!');
        setResults([...results, json.data]);
        setView('list');
        setDocuments([{ title: '', url: '' }]);
      } else {
        alert(json.message);
      }
    } catch (err) {
      alert('Failed to submit assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === 'detail' && selectedTask) {
    return (
      <div className="platform-page" style={{ padding: '1rem 2.5rem' }}>
        <button onClick={() => setView('list')} style={{ background:'none', border:'none', color:'#94A3B8', fontWeight:800, fontSize:'0.75rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', marginBottom:'2rem' }}>
          <Icon name="chevronLeft" size={16} /> BACK TO LIST
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
               <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Required Assessment</span>
               <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{selectedTask.title}</h1>
               
               <div style={{ marginTop: '2rem' }}>
                 <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>Executive Briefing</h3>
                 <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
                   {selectedTask.description}
                 </p>
               </div>

               <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem', borderTop: '1px solid #F1F5F9', paddingTop: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>SUBMISSION DEADLINE</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#111' }}>{new Date(selectedTask.deadline).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>REVIEW STATUS</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F59E0B' }}>Pending Submission</span>
                  </div>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111', marginBottom: '2rem' }}>Evidence Vault</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {documents.map((doc, idx) => (
                  <div key={idx} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8' }}>DOC #{idx + 1}</span>
                       {documents.length > 1 && (
                         <button onClick={() => removeDocument(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                           <Icon name="trash" size={14} />
                         </button>
                       )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input 
                        type="text" placeholder="Document Title (e.g. Financial Sheet)" value={doc.title}
                        onChange={(e) => updateDocument(idx, 'title', e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      <input 
                        type="text" placeholder="Public Access Link (Google Drive / Notion)" value={doc.url}
                        onChange={(e) => updateDocument(idx, 'url', e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                ))}
                
                <button onClick={addDocumentSlot} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '2px dashed #E2E8F0', background: 'none', color: '#64748B', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}>
                  + Attach Additional Evidence
                </button>
                
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="btn-brand-primary" 
                  style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontSize: '1rem', borderRadius: '16px', fontWeight: 900 }}
                >
                  {isSubmitting ? 'SECURELY UPLOADING...' : 'CONFIRM SUBMISSION'}
                </button>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'rgba(122,31,43,0.03)', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.08)' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                 <Icon name="info" size={16} color="#7A1F2B" />
                 <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#111' }}>Submission Guide</span>
               </div>
               <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', lineHeight: 1.6, fontWeight: 500 }}>
                 Ensure all shared links have 'Anyone with the link can view' permissions enabled for the Board of Evaluators.
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem' }}>
      <header className="platform-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="platform-page-title" style={{ fontSize: '2rem', marginBottom: '4px' }}>Assignments</h1>
        <p className="platform-page-subtitle" style={{ fontSize: '0.9rem', color: '#64748B' }}>Submit required assignment work for review and evaluation.</p>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <SummaryCard label="Required Evidence" count={pendingTasks.length} icon="fileText" color="#7A1F2B" trend="Pending Mastery" />
      </div>

      <div style={{ marginBottom: '2.5rem', position: 'relative', maxWidth: '440px' }}>
        <input 
          type="text" 
          placeholder="Filter your required assessments..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 18px 14px 46px', borderRadius: '16px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', outline: 'none', background: '#fff', fontWeight: 600 }}
        />
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
          <Icon name="search" size={18} />
        </div>
      </div>

      <main>
        {isLoading ? (
          <div className="platform-grid">
            {[1, 2].map(i => (
              <div key={i} style={{ height: 320, background: '#fff', borderRadius: 32, border: '1px solid #F1F5F9' }} className="animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="platform-grid">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onSelect={(t) => { setSelectedTask(t); setView('detail'); }} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0' }}
                >
                  {assignments.length === 0 ? (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="pencil" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>No Assignments Found</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>New project assessments will appear here shortly.</p>
                    </>
                  ) : pendingTasks.length === 0 ? (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="check" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>Queue Cleared</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>All required assessments have been submitted for review.</p>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Icon name="search" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>No Matches Found</h3>
                      <p style={{ color: '#94A3B8', fontWeight: 600 }}>Try adjusting your search terms.</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, count, icon, color, trend }) {
  return (
    <div style={{ background: '#fff', padding: '1.25rem 2rem', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
           <span style={{ fontSize: '1.75rem', fontWeight: 950, color: '#111' }}>{count}</span>
           <span style={{ fontSize: '0.75rem', fontWeight: 850, color: color }}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onSelect }) {
  const isLocked = task.isLocked;

  return (
    <motion.div 
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`assessment-card-v ${isLocked ? 'locked' : ''}`}
      style={{ 
        padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '320px', borderRadius: '32px',
        opacity: isLocked ? 0.7 : 1,
        position: 'relative',
        filter: isLocked ? 'grayscale(0.5)' : 'none'
      }}
    >
      {isLocked && (
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#F1F5F9', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
          <Icon name="lock" size={16} />
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#111', marginBottom: '12px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{task.title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
          {isLocked ? `This project assessment is currently locked. ${task.lockReason || ''}` : task.description?.slice(0, 140) + '...'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem', marginTop: 'auto', marginBottom: '1.5rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={isLocked ? 'lock' : 'calendar'} size={18} color="#94A3B8" />
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 900, display: 'block', lineHeight: 1 }}>{isLocked ? 'STATUS' : 'DEADLINE'}</span>
          <span style={{ fontSize: '0.9rem', color: '#111', fontWeight: 900 }}>{isLocked ? 'Locked' : (task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Rolling')}</span>
        </div>
      </div>

      <button 
        onClick={() => onSelect(task)} 
        disabled={isLocked}
        className={isLocked ? 'btn-locked' : 'btn-brand-primary'} 
        style={{ 
          width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900,
          background: isLocked ? '#E2E8F0' : '#7A1F2B',
          color: isLocked ? '#94A3B8' : '#fff',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: 'none'
        }}
      >
        {isLocked ? 'ACCESS RESTRICTED' : 'Launch Assessment'}
      </button>
    </motion.div>
  );
}

