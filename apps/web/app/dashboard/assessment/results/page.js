'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/assessments-v2.css';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/v1/assessments/results/all');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setResults(json.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter(r => r.assessmentId?.type === activeTab);
  }, [results, activeTab]);

  if (selectedResult) {
    return <ReviewView result={selectedResult} onClose={() => setSelectedResult(null)} />;
  }

  return (
    <div className="platform-page" style={{ padding: '0.5rem 2.5rem' }}>
      <header className="platform-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="platform-page-title" style={{ fontSize: '2rem', marginBottom: '4px' }}>Intelligence Reports</h1>
        <p className="platform-page-subtitle" style={{ fontSize: '0.9rem', color: '#64748B' }}>In-depth performance analytics and tactical evaluations.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: '#fff', padding: '6px', borderRadius: '16px', border: '1px solid #F1F5F9', width: 'fit-content' }}>
        {['quiz', 'assignment', 'exam'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '10px 24px', borderRadius: '12px', border: 'none', fontSize: '0.85rem', fontWeight: 850, cursor: 'pointer', transition: '0.2s',
              background: activeTab === tab ? '#7A1F2B' : 'transparent',
              color: activeTab === tab ? '#fff' : '#64748B',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'assignment' ? 'Assessments' : tab + 's'}
          </button>
        ))}
      </div>

      <main className="platform-grid">
        <AnimatePresence mode="popLayout">
          {filteredResults.length > 0 ? (
            filteredResults.map((res) => (
              <motion.div 
                key={res._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedResult(res)}
                className="assessment-card-v"
                style={{ padding: '2.5rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#111', lineHeight: 1.2, flex: 1, marginRight: '1rem' }}>{res.assessmentId?.title}</h3>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '1.5rem', fontWeight: 950, color: res.score >= 80 ? '#059669' : '#DC2626' }}>{res.score}%</div>
                     <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8' }}>SCORE</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem', marginTop: 'auto' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="calendar" size={14} color="#94A3B8" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>{new Date(res.submittedAt).toLocaleDateString()}</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="clock" size={14} color="#94A3B8" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>{Math.round(res.timeTaken / 60)}m</span>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0' }}
            >
              {results.length === 0 ? (
                <>
                  <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Icon name="inbox" size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>Intelligence Vault Empty</h3>
                  <p style={{ color: '#94A3B8', fontWeight: 600 }}>Complete your first strategic assessment to see your report.</p>
                </>
              ) : (
                <>
                  <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Icon name="barChart" size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111' }}>No {activeTab}s Logged</h3>
                  <p style={{ color: '#94A3B8', fontWeight: 600 }}>You haven't completed any {activeTab}s in this category yet.</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ReviewView({ result, onClose }) {
  return (
    <div className="platform-page" style={{ padding: '1rem 2.5rem' }}>
      <button onClick={onClose} style={{ background:'none', border:'none', color:'#94A3B8', fontWeight:800, fontSize:'0.75rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', marginBottom:'2rem' }}>
        <Icon name="chevronLeft" size={16} /> BACK TO REPORTS
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Tactical Briefing Header */}
          <div style={{ background: '#fff', padding: '3rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
               <div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Intelligence Report</span>
                 <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#111', letterSpacing: '-0.02em', margin: 0 }}>{result.assessmentId?.title}</h1>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 950, color: result.score >= 80 ? '#059669' : '#DC2626', lineHeight: 1 }}>{result.score}%</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', marginTop: '4px' }}>ACCURACY SCORE</div>
               </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', borderTop: '1px solid #F1F5F9', paddingTop: '2rem' }}>
                <Metric label="VELOCITY" value={`${Math.round(result.timeTaken / 60)}m`} sub="Completion Time" icon="clock" />
                <Metric label="STATUS" value={result.score >= 80 ? 'GRADED' : 'SUBMITTED'} sub={result.score >= 80 ? 'Certified' : 'Pending Mastery'} icon="award" />
                <Metric label="ATTEMPT" value="#1" sub={new Date(result.submittedAt).toLocaleDateString()} icon="calendar" />
             </div>
          </div>

          {/* Performance Ledger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#111', marginLeft: '12px' }}>Evaluation Ledger</h3>
             {result.reviewData?.map((q, idx) => (
               <div key={idx} style={{ background: '#fff', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                     <div style={{ minWidth: '40px', height: '40px', borderRadius: '12px', background: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900 }}>
                       {idx + 1}
                     </div>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', lineHeight: 1.5, margin: 0 }}>{q.q}</h4>
                  </div>

                  {q.options ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        const isSelected = optIdx === q.selected;
                        const isWrongSelection = isSelected && !isCorrect;

                        return (
                          <div key={optIdx} style={{ 
                            padding: '1.25rem', borderRadius: '18px', border: '1.5px solid', 
                            borderColor: isCorrect ? '#059669' : (isWrongSelection ? '#DC2626' : '#F1F5F9'),
                            background: isCorrect ? '#ECFDF5' : (isWrongSelection ? '#FEF2F2' : '#fff'),
                            position: 'relative', transition: '0.2s'
                          }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isCorrect ? '#065F46' : (isWrongSelection ? '#991B1B' : '#475569') }}>
                              {opt}
                            </div>
                            {(isCorrect || isSelected) && (
                              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                <Icon name={isCorrect ? 'check' : 'x'} size={16} color={isCorrect ? '#059669' : '#DC2626'} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Submitted Response</span>
                       <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>{q.a}</p>
                    </div>
                  )}

                  {q.feedback && (
                    <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '20px', fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, fontWeight: 500 }}>
                       <span style={{ fontWeight: 800, color: '#111', marginRight: '8px' }}>RATIONALE:</span>
                       {q.feedback}
                    </div>
                  )}
               </div>
             ))}
          </div>
        </div>

        {/* Expert Critique Sidebar */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ background: '#111', padding: '2.5rem', borderRadius: '32px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="messageSquare" size={20} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Board Critique</h3>
             </div>

             <div style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontStyle: 'italic', marginBottom: '2.5rem' }}>
                "{result.facultyNotes || (result.score >= 80 ? "Outstanding performance. Your tactical understanding of market dynamics is exceptional. Proceed to next phase." : "While you've demonstrated core competence, we recommend revisiting the market validation modules.")}"
             </div>

             <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Tactical Recommendations</h4>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {[
                     'Refine financial assumptions in unit economics.',
                     'Improve customer discovery data points.',
                     'Tighten competitive analysis modeling.'
                   ].map((item, i) => (
                     <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span style={{ color: '#059669' }}>•</span> {item}
                     </li>
                   ))}
                </ul>
             </div>

             <button style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', background: '#7A1F2B', border: 'none', color: '#fff', fontWeight: 900, marginTop: '3rem', cursor: 'pointer' }}>
               DOWNLOAD FULL AUDIT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, icon }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
       <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F8FAFC', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} />
       </div>
       <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>{label}</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 950, color: '#111', display: 'block' }}>{value}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>{sub}</span>
       </div>
    </div>
  );
}
