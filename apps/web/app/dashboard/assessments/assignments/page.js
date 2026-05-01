'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Assignments');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // list | detail
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
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
        
        if (taskJson.success) setAssignments(taskJson.data);
        if (resultJson.success) setResults(resultJson.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const tasksWithStatus = useMemo(() => {
    return assignments.map(task => {
      const submission = results.find(r => r.assessmentId?._id === task._id || r.assessmentId === task._id);
      return {
        ...task,
        submissionStatus: submission ? submission.status : 'Pending',
        score: submission ? submission.score : null,
        feedback: submission ? submission.feedback : null,
        submittedAt: submission ? submission.submittedAt : null,
        submissionId: submission ? submission._id : null
      };
    });
  }, [assignments, results]);

  const filteredTasks = useMemo(() => {
    return tasksWithStatus.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      if (activeTab === 'Pending') return matchSearch && t.submissionStatus === 'Pending';
      if (activeTab === 'Submitted') return matchSearch && t.submissionStatus === 'submitted';
      if (activeTab === 'Graded') return matchSearch && t.submissionStatus === 'graded';
      return matchSearch;
    });
  }, [tasksWithStatus, search, activeTab]);

  const handleSubmit = async () => {
    if (!submissionContent.trim()) return alert('Please provide submission content or a file link.');
    setIsSubmitting(true);
    try {
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
        setSubmissionContent('');
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
      <div className="platform-page" style={{ padding: '2.5rem' }}>
        <button onClick={() => setView('list')} style={{ background:'none', border:'none', color:'#94A3B8', fontWeight:800, fontSize:'0.85rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', marginBottom:'2.5rem' }}>
          <Icon name="chevronLeft" size={18} /> BACK TO HUB
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
               <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem' }}>{selectedTask.title}</h1>
               <p style={{ color: '#7A1F2B', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '2rem' }}>Phase Critical Task</p>
               
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>Instructions</h3>
               <div style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.8, marginBottom: '2.5rem', whiteSpace: 'pre-line' }}>
                 {selectedTask.description}
               </div>

               {selectedTask.submissionStatus === 'graded' && (
                 <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '16px', padding: '2rem', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22C55E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Icon name="check" size={20} />
                          </div>
                          <div>
                             <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#166534' }}>Evaluation Complete</h4>
                             <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803d' }}>Review by Founder Faculty</p>
                          </div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>{selectedTask.score || 0}</span>
                          <span style={{ fontSize: '1rem', color: '#15803d', fontWeight: 800 }}>/100</span>
                       </div>
                    </div>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                       <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
                          <strong>Feedback:</strong> {selectedTask.feedback || 'No specific feedback provided.'}
                       </p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '1.5rem' }}>Submission</h3>
              
              {selectedTask.submissionStatus === 'Pending' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                    <Icon name="upload" size={32} color="#94A3B8" />
                    <p style={{ margin: '1rem 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Submit your work link</p>
                  </div>
                  <textarea 
                    placeholder="Provide your solution URL (Google Drive, Notion, GitHub...)"
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '12px', border: '1.5px solid #F1F5F9', outline: 'none', fontSize: '0.9rem' }}
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-brand-primary" 
                    style={{ width: '100%', padding: '1.1rem' }}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ASSIGNMENT'}
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 60, height: 60, background: '#F0FDF4', color: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Icon name="fileText" size={24} />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Work Submitted</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8' }}>Submitted on {new Date(selectedTask.submittedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
               <h4 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 900, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deadlines</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#7A1F2B' }}>
                  <Icon name="clock" size={20} />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'No Deadline'}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>CRITICAL CUTOFF</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-page" style={{ padding: '2.5rem', background: '#ffffff' }}>
      <header className="platform-page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="platform-page-title">Critical Assignments</h1>
        <p className="platform-page-subtitle">Apply your learning to real-world scenarios and receive personalized founder feedback.</p>
      </header>

      <div className="quiz-hub-layout">
        <aside className="quiz-sidebar">
          <SidebarItem label="All Tasks" icon="books" active={activeTab === 'All Assignments'} onClick={() => setActiveTab('All Assignments')} />
          <SidebarItem label="Pending" icon="clock" active={activeTab === 'Pending'} onClick={() => setActiveTab('Pending')} />
          <SidebarItem label="Submitted" icon="fileText" active={activeTab === 'Submitted'} onClick={() => setActiveTab('Submitted')} />
          <SidebarItem label="Graded" icon="award" active={activeTab === 'Graded'} onClick={() => setActiveTab('Graded')} />
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search assignments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px', border: '1.5px solid #E5E7EB', fontSize: '0.95rem', outline: 'none' }}
            />
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <Icon name="search" size={18} />
            </div>
          </div>

          {isLoading ? (
            <div className="platform-grid">
              {[1, 2].map(i => (
                <div key={i} style={{ height: 280, background: '#F9FAFB', borderRadius: 20 }} className="animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="platform-grid">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onSelect={(t) => { setSelectedTask(t); setView('detail'); }} />
                )) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#ffffff', borderRadius: '24px', border: '2px dashed #E5E7EB' }}
                  >
                    <Icon name="pencil" size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#64748B' }}>No tasks found</h3>
                    <p style={{ color: '#94A3B8' }}>Check back later for new module assignments.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem',
        fontWeight: active ? 700 : 500,
        background: active ? '#7A1F2B' : 'transparent',
        color: active ? '#fff' : '#64748B',
        transition: '0.2s', textAlign: 'left'
      }}
    >
      <Icon name={icon} size={18} color={active ? '#fff' : '#94A3B8'} />
      {label}
    </button>
  );
}

function TaskCard({ task, onSelect }) {
  const status = task.submissionStatus;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="assessment-card-v"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5975B' }}>PHASE CRITICAL</span>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111', marginBottom: '8px' }}>{task.title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
          {task.description?.slice(0, 100)}...
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', marginTop: 'auto' }}>
        <Icon name="clock" size={14} color="#94A3B8" />
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
          Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Flexible'}
        </span>
      </div>

      <button onClick={() => onSelect(task)} className="btn-brand-primary" style={{ width: '100%' }}>
        {status === 'Pending' ? 'Start Assignment' : 'View Details'}
      </button>
    </motion.div>
  );
}

