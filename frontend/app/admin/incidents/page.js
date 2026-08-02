'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

const SEV_COLOR = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' };
const SEV_BG    = { critical:'rgba(239,68,68,.12)', high:'rgba(249,115,22,.12)', medium:'rgba(234,179,8,.12)', low:'rgba(34,197,94,.12)' };
const STATUS_COLOR = { open:'#ef4444', investigating:'#f97316', resolved:'#22c55e', closed:'#64748b' };
const STATUS_BG    = { open:'rgba(239,68,68,.1)', investigating:'rgba(249,115,22,.1)', resolved:'rgba(34,197,94,.1)', closed:'rgba(100,116,139,.1)' };

function Badge({ text, color, bg }) {
  return (
    <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, color, background:bg, textTransform:'uppercase', letterSpacing:'.5px' }}>
      {text}
    </span>
  );
}

const EMPTY_FORM = { title:'', description:'', severity:'high', type:'infrastructure', affectedServices:'' };

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [summary,   setSummary]   = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState({ status:'', severity:'' });
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [noteText,  setNoteText]  = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchData = useCallback(async (p=1) => {
    const params = new URLSearchParams({ page:p, limit:20 });
    if (filter.status)   params.set('status',   filter.status);
    if (filter.severity) params.set('severity', filter.severity);
    const res = await apiGet(`/api/v1/admin/observability/incidents?${params}`);
    if (res.data) { setIncidents(res.data.incidents||[]); setTotal(res.data.total||0); setSummary(res.data.summary||[]); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  const handleCreate = async () => {
    if (!form.title || !form.severity || !form.type) return;
    setSaving(true);
    await apiPost('/api/v1/admin/observability/incidents', {
      ...form,
      affectedServices: form.affectedServices.split(',').map(s=>s.trim()).filter(Boolean),
    });
    setShowForm(false); setForm(EMPTY_FORM); setSaving(false);
    fetchData(1);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    await apiPatch(`/api/v1/admin/observability/incidents/${selected._id}`, {
      status: newStatus || undefined,
      note: noteText || undefined,
    });
    setSelected(null); setNoteText(''); setNewStatus(''); setSaving(false);
    fetchData(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    await apiDelete(`/api/v1/admin/observability/incidents/${id}`);
    fetchData(page);
  };

  // Summarize open/investigating counts
  const openCount = summary.filter(s=>s._id?.status==='open').reduce((a,s)=>a+s.count,0);
  const invCount  = summary.filter(s=>s._id?.status==='investigating').reduce((a,s)=>a+s.count,0);
  const resolvedCount = summary.filter(s=>s._id?.status==='resolved').reduce((a,s)=>a+s.count,0);
  const criticalOpen  = summary.filter(s=>s._id?.severity==='critical'&&s._id?.status!=='closed'&&s._id?.status!=='resolved').reduce((a,s)=>a+s.count,0);

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f1a', padding:'28px 32px', fontFamily:'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(249,115,22,.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', margin:0 }}>Incident Response Center</h1>
            <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Track, triage, and resolve system &amp; security incidents</p>
          </div>
        </div>
        <button onClick={()=>setShowForm(true)} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          + Create Incident
        </button>
      </div>

      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Open', value:openCount,  color:'#ef4444' },
          { label:'Investigating', value:invCount,  color:'#f97316' },
          { label:'Resolved', value:resolvedCount, color:'#22c55e' },
          { label:'Critical Open', value:criticalOpen, color:'#a855f7' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'#1e1e2e', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'18px 22px' }}>
            <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', color:'#64748b', padding:80 }}>Loading incidents…</div>
      ) : (
        <div style={{ background:'#1e1e2e', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:24 }}>
          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            <h3 style={{ fontSize:13, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.8px', margin:0, flex:1 }}>Incidents</h3>
            {[
              { key:'status', opts:['','open','investigating','resolved','closed'], labels:['All Status','Open','Investigating','Resolved','Closed'] },
              { key:'severity', opts:['','critical','high','medium','low'], labels:['All Severity','Critical','High','Medium','Low'] },
            ].map(f=>(
              <select key={f.key} value={filter[f.key]} onChange={e=>{setFilter(v=>({...v,[f.key]:e.target.value}));setPage(1);}}
                style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:12, cursor:'pointer' }}>
                {f.opts.map((o,i)=><option key={o} value={o}>{f.labels[i]}</option>)}
              </select>
            ))}
          </div>

          {incidents.length===0 ? (
            <div style={{ textAlign:'center', color:'#64748b', padding:48 }}>No incidents found. The system looks healthy.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {incidents.map(inc=>(
                <div key={inc._id} style={{ background:'rgba(255,255,255,.02)', border:`1px solid ${SEV_COLOR[inc.severity]}30`, borderRadius:12, padding:'18px 20px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <Badge text={inc.severity} color={SEV_COLOR[inc.severity]} bg={SEV_BG[inc.severity]} />
                        <Badge text={inc.status} color={STATUS_COLOR[inc.status]} bg={STATUS_BG[inc.status]} />
                        <span style={{ fontSize:11, color:'#475569', background:'rgba(255,255,255,.05)', padding:'2px 9px', borderRadius:99 }}>{inc.type}</span>
                      </div>
                      <h4 style={{ fontSize:15, fontWeight:700, color:'#f1f5f9', margin:'0 0 6px' }}>{inc.title}</h4>
                      {inc.description && <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 10px', lineHeight:1.5 }}>{inc.description}</p>}
                      {inc.affectedServices?.length>0 && (
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {inc.affectedServices.map(s=>(
                            <span key={s} style={{ fontSize:11, color:'#64748b', background:'rgba(255,255,255,.05)', padding:'2px 9px', borderRadius:99, border:'1px solid rgba(255,255,255,.07)' }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:11, color:'#475569', marginBottom:8 }}>{new Date(inc.createdAt).toLocaleDateString()}</div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>{setSelected(inc);setNewStatus(inc.status);}}
                          style={{ padding:'5px 12px', borderRadius:7, border:'1px solid rgba(99,102,241,.3)', background:'rgba(99,102,241,.08)', color:'#818cf8', fontSize:11, cursor:'pointer' }}>
                          Update
                        </button>
                        <button onClick={()=>handleDelete(inc._id)}
                          style={{ padding:'5px 12px', borderRadius:7, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', fontSize:11, cursor:'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {inc.timeline?.length>0 && (
                    <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.05)' }}>
                      <div style={{ fontSize:11, color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8 }}>Timeline</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {inc.timeline.slice().reverse().slice(0,4).map((t,i)=>(
                          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                            <div style={{ width:6, height:6, borderRadius:'50%', background:'#475569', marginTop:4, flexShrink:0 }} />
                            <div>
                              <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{t.action}</span>
                              {t.note && <span style={{ fontSize:11, color:'#64748b' }}> - {t.note}</span>}
                              <span style={{ fontSize:10, color:'#475569', marginLeft:8 }}>{t.byEmail} · {new Date(t.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {total>20 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
              <span style={{ fontSize:12, color:'#64748b' }}>{total} total incidents</span>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ padding:'6px 14px', borderRadius:7, border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#94a3b8', fontSize:12, cursor:'pointer', opacity:page===1?.4:1 }}>Prev</button>
                <span style={{ padding:'6px 14px', color:'#94a3b8', fontSize:12 }}>Page {page}</span>
                <button onClick={()=>setPage(p=>p+1)} disabled={page*20>=total}
                  style={{ padding:'6px 14px', borderRadius:7, border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#94a3b8', fontSize:12, cursor:'pointer', opacity:page*20>=total?.4:1 }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={()=>setShowForm(false)}>
          <div style={{ background:'#1e1e2e', borderRadius:16, padding:'32px', width:500, maxWidth:'95vw', border:'1px solid rgba(255,255,255,.1)' }}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', margin:'0 0 24px' }}>Create Incident</h3>
            {[
              { label:'Title *', key:'title', type:'text', placeholder:'Incident title' },
              { label:'Description', key:'description', type:'textarea', placeholder:'What happened?' },
              { label:'Affected Services (comma-separated)', key:'affectedServices', type:'text', placeholder:'api, redis, mongodb' },
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{f.label}</label>
                {f.type==='textarea' ? (
                  <textarea value={form[f.key]} onChange={e=>setForm(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:13, resize:'vertical', minHeight:80, boxSizing:'border-box', outline:'none', fontFamily:'inherit' }} />
                ) : (
                  <input type="text" value={form[f.key]} onChange={e=>setForm(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:13, boxSizing:'border-box', outline:'none' }} />
                )}
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }}>
              {[
                { label:'Severity *', key:'severity', opts:['critical','high','medium','low'] },
                { label:'Type *', key:'type', opts:['security','infrastructure','performance','data','availability'] },
              ].map(f=>(
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{f.label}</label>
                  <select value={form[f.key]} onChange={e=>setForm(v=>({...v,[f.key]:e.target.value}))}
                    style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:13, cursor:'pointer' }}>
                    {f.opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:'11px', borderRadius:9, border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#94a3b8', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} style={{ flex:1, padding:'11px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Creating…' : 'Create Incident'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={()=>setSelected(null)}>
          <div style={{ background:'#1e1e2e', borderRadius:16, padding:'32px', width:440, maxWidth:'95vw', border:'1px solid rgba(255,255,255,.1)' }}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', margin:'0 0 8px' }}>Update Incident</h3>
            <p style={{ fontSize:13, color:'#64748b', margin:'0 0 24px' }}>{selected.title}</p>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>Status</label>
              <select value={newStatus} onChange={e=>setNewStatus(e.target.value)}
                style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:13, cursor:'pointer' }}>
                {['open','investigating','resolved','closed'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>Update Note (optional)</label>
              <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Add a timeline note…"
                style={{ width:'100%', padding:'9px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,.1)', background:'#0f0f1a', color:'#cbd5e1', fontSize:13, resize:'vertical', minHeight:70, boxSizing:'border-box', outline:'none', fontFamily:'inherit' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setSelected(null)} style={{ flex:1, padding:'11px', borderRadius:9, border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#94a3b8', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleUpdate} disabled={saving} style={{ flex:1, padding:'11px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Saving…' : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
