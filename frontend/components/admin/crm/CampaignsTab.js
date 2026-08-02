'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Play, Pause, Ban, X, Send } from 'lucide-react';
import {
  listCampaigns, createCampaign, startCampaign, pauseCampaign, cancelCampaign,
  listLeadLists, listTemplates,
} from '@/lib/crm';
import { s } from './crmStyles';

const STATUS_STYLE = {
  draft: { bg: '#f1f5f9', c: '#475569' },
  sending: { bg: '#dbeafe', c: '#1d4ed8' },
  paused: { bg: '#fef3c7', c: '#b45309' },
  completed: { bg: '#dcfce7', c: '#166534' },
  cancelled: { bg: '#fee2e2', c: '#991b1b' },
};

export default function CampaignsTab() {
  const [items, setItems] = useState(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const pollRef = useRef(null);

  const show = (m, t = 'success') => { setToast({ message: m, type: t }); setTimeout(() => setToast(null), 3500); };

  const load = async () => { const { data } = await listCampaigns(); setItems(Array.isArray(data) ? data : []); };

  useEffect(() => {
    load();
    // Poll while any campaign is sending, so progress updates live.
    pollRef.current = setInterval(async () => {
      const { data } = await listCampaigns();
      if (Array.isArray(data)) setItems(data);
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  const act = async (fn, id, okMsg) => {
    const { error } = await fn(id);
    if (error) show(error.message, 'error'); else { show(okMsg); load(); }
  };

  return (
    <div>
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: '#64748b' }}>Sends throttle to the daily cap; the rest queue for the next day automatically.</p>
        <button style={s.btnPrimary} onClick={() => setCreating(true)}><Plus size={15} style={{ verticalAlign: -2, marginRight: 6 }} />New Campaign</button>
      </div>

      {items === null ? <div style={s.empty}>Loading…</div>
        : items.length === 0 ? <div style={{ ...s.card, ...s.empty }}><Send size={38} color="#cbd5e1" style={{ margin: '0 auto 12px' }} /><p style={{ fontWeight: 700, color: '#475569', margin: 0 }}>No campaigns yet</p></div>
          : (
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map(c => {
                const st = STATUS_STYLE[c.status] || STATUS_STYLE.draft;
                const total = c.stats?.total || 0;
                const sent = c.stats?.sent || 0;
                const pct = total ? Math.round((sent / total) * 100) : 0;
                return (
                  <div key={c._id} style={s.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <strong style={{ fontSize: 15.5, color: '#0f172a' }}>{c.name}</strong>
                          <span style={{ padding: '3px 10px', borderRadius: 100, background: st.bg, color: st.c, fontSize: 11.5, fontWeight: 700 }}>{c.status}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8' }}>
                          {c.listId?.name || 'list'} · {c.templateId?.name || 'template'} · cap {c.dailyCap}/day
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {(c.status === 'draft' || c.status === 'paused') && <button style={s.btnPrimary} onClick={() => act(startCampaign, c._id, c.status === 'draft' ? 'Campaign started.' : 'Resumed.')}><Play size={13} style={{ verticalAlign: -2 }} /> {c.status === 'draft' ? 'Start' : 'Resume'}</button>}
                        {c.status === 'sending' && <button style={s.btnGhost} onClick={() => act(pauseCampaign, c._id, 'Paused.')}><Pause size={13} style={{ verticalAlign: -2 }} /> Pause</button>}
                        {!['completed', 'cancelled'].includes(c.status) && <button style={s.btnDanger} onClick={() => { if (window.confirm('Cancel this campaign?')) act(cancelCampaign, c._id, 'Cancelled.'); }}><Ban size={13} style={{ verticalAlign: -2 }} /></button>}
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#e63946,#ff6b6b)', transition: 'width .4s' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap', fontSize: 12.5 }}>
                        <Stat label="Sent" v={`${sent}/${total}`} />
                        <Stat label="Opened" v={c.stats?.opened || 0} color="#1d4ed8" />
                        <Stat label="Clicked" v={c.stats?.clicked || 0} color="#7c3aed" />
                        <Stat label="Failed" v={c.stats?.failed || 0} color="#b91c1c" />
                        <Stat label="Unsub" v={c.stats?.unsubscribed || 0} color="#b45309" />
                        {c.stats?.skipped ? <Stat label="Skipped" v={c.stats.skipped} color="#94a3b8" /> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

      {creating && <NewCampaign onClose={() => setCreating(false)} onCreated={() => { setCreating(false); load(); show('Campaign created - press Start to send.'); }} onError={m => show(m, 'error')} />}
    </div>
  );
}

function Stat({ label, v, color = '#334155' }) {
  return <span><strong style={{ color }}>{v}</strong> <span style={{ color: '#94a3b8' }}>{label}</span></span>;
}

function NewCampaign({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [listId, setListId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [dailyCap, setDailyCap] = useState('');
  const [lists, setLists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: t }] = await Promise.all([listLeadLists(), listTemplates()]);
      setLists(Array.isArray(l) ? l : []);
      setTemplates(Array.isArray(t) ? t : []);
    })();
  }, []);

  const create = async () => {
    if (!name.trim() || !listId || !templateId) { setError('Name, list and template are required.'); return; }
    setBusy(true); setError('');
    const payload = { name, listId, templateId };
    if (dailyCap) payload.dailyCap = Number(dailyCap);
    const { error: err } = await createCampaign(payload);
    setBusy(false);
    if (err) { setError(err.message || 'Could not create campaign.'); return; }
    onCreated();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>New Campaign</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
        </div>
        {error && <div style={s.err}>{error}</div>}

        <label style={s.label}>Campaign name</label>
        <input style={{ ...s.input, marginBottom: 14 }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Campus Drive - Batch 1" />

        <label style={s.label}>Lead list</label>
        <select style={{ ...s.input, marginBottom: 14 }} value={listId} onChange={e => setListId(e.target.value)}>
          <option value="">Select a list…</option>
          {lists.map(l => <option key={l._id} value={l._id}>{l.name} ({l.contactCount})</option>)}
        </select>

        <label style={s.label}>Template</label>
        <select style={{ ...s.input, marginBottom: 14 }} value={templateId} onChange={e => setTemplateId(e.target.value)}>
          <option value="">Select a template…</option>
          {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <label style={s.label}>Daily cap <span style={{ color: '#94a3b8', fontWeight: 400 }}>(leave blank for default 100)</span></label>
        <input type="number" min="1" style={{ ...s.input, marginBottom: 18 }} value={dailyCap} onChange={e => setDailyCap(e.target.value)} placeholder="100" />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={s.btnGhost} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create Campaign'}</button>
        </div>
        {lists.length === 0 && <p style={{ fontSize: 12.5, color: '#b45309', marginTop: 12 }}>Import a lead list first (Lead Lists tab).</p>}
        {templates.length === 0 && <p style={{ fontSize: 12.5, color: '#b45309', marginTop: 4 }}>Create a template first (Templates tab).</p>}
      </div>
    </div>
  );
}
