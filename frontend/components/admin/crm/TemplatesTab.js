'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Pencil, X, Eye } from 'lucide-react';
import {
  listTemplates, createTemplate, updateTemplate, deleteTemplate, previewTemplate,
  seedDefaultTemplates, MERGE_FIELDS,
} from '@/lib/crm';
import { s } from './crmStyles';

const STARTER = `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
  <p>Hi {{name}},</p>
  <p>We noticed you're at {{collegeName}} and thought you'd be a great fit for our program.</p>
  <p><a href="https://startupsindia.in/apply">Apply here</a></p>
  <p>Best,<br/>Startups India Team</p>
</div>`;

export default function TemplatesTab() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // template object or {}
  const [toast, setToast] = useState(null);
  const show = (m, t = 'success') => { setToast({ message: m, type: t }); setTimeout(() => setToast(null), 3500); };

  const load = async () => { const { data } = await listTemplates(); setItems(Array.isArray(data) ? data : []); };
  useEffect(() => { load(); }, []);

  const remove = async (t) => {
    if (!window.confirm(`Delete template "${t.name}"?`)) return;
    const { error } = await deleteTemplate(t._id);
    if (error) show(error.message, 'error'); else { show('Template deleted.'); load(); }
  };

  return (
    <div>
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: '#64748b' }}>Ready-made emails - pick one and send, or edit/create your own. {'{{merge}}'} tags personalise each one.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.btnGhost} onClick={async () => { const { data, error } = await seedDefaultTemplates(); if (error) show(error.message, 'error'); else { show(data?.created ? `Restored ${data.created} starter templates.` : 'Starter templates already present.'); load(); } }}>Restore starters</button>
          <button style={s.btnPrimary} onClick={() => setEditing({ name: '', subject: '', htmlBody: STARTER })}><Plus size={15} style={{ verticalAlign: -2, marginRight: 6 }} />New Template</button>
        </div>
      </div>

      {items === null ? <div style={s.empty}>Loading…</div>
        : items.length === 0 ? <div style={{ ...s.card, ...s.empty }}><p style={{ fontWeight: 700, color: '#475569', margin: 0 }}>No templates yet</p></div>
          : (
            <table style={s.table}>
              <thead><tr><th style={s.th}>Name</th><th style={s.th}>Subject</th><th style={s.th}></th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t._id}>
                    <td style={s.td}><strong>{t.name}</strong></td>
                    <td style={s.td}>{t.subject}</td>
                    <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button style={{ ...s.btnGhost, marginRight: 8 }} onClick={() => setEditing(t)}><Pencil size={13} style={{ verticalAlign: -2 }} /> Edit</button>
                      <button style={s.btnDanger} onClick={() => remove(t)}><Trash2 size={13} style={{ verticalAlign: -2 }} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

      {editing && <TemplateEditor tpl={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); show('Template saved.'); }} onError={m => show(m, 'error')} />}
    </div>
  );
}

function TemplateEditor({ tpl, onClose, onSaved, onError }) {
  const [name, setName] = useState(tpl.name || '');
  const [subject, setSubject] = useState(tpl.subject || '');
  const [html, setHtml] = useState(tpl.htmlBody || '');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bodyRef = useRef(null);

  const insertTag = (tag) => {
    const el = bodyRef.current;
    const token = `{{${tag}}}`;
    if (!el) { setHtml(h => h + token); return; }
    const start = el.selectionStart ?? html.length;
    const end = el.selectionEnd ?? html.length;
    setHtml(html.slice(0, start) + token + html.slice(end));
  };

  const runPreview = async () => {
    const { data, error: err } = await previewTemplate(subject, html);
    if (err) { setError(err.message); return; }
    setPreview(data);
  };

  const save = async () => {
    if (!name.trim() || !subject.trim() || !html.trim()) { setError('Name, subject and body are all required.'); return; }
    setBusy(true); setError('');
    const { error: err } = tpl._id
      ? await updateTemplate(tpl._id, { name, subject, htmlBody: html })
      : await createTemplate({ name, subject, htmlBody: html });
    setBusy(false);
    if (err) { setError(err.message || 'Save failed.'); return; }
    onSaved();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{tpl._id ? 'Edit' : 'New'} Template</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
        </div>

        {error && <div style={s.err}>{error}</div>}

        <label style={s.label}>Template name</label>
        <input style={{ ...s.input, marginBottom: 14 }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Campus Invite" />

        <label style={s.label}>Subject</label>
        <input style={{ ...s.input, marginBottom: 14 }} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Hi {{name}}, an invite for you" />

        <label style={s.label}>Merge tags <span style={{ color: '#94a3b8', fontWeight: 400 }}>(click to insert)</span></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {MERGE_FIELDS.map(f => (
            <button key={f} type="button" onClick={() => insertTag(f)} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>{`{{${f}}}`}</button>
          ))}
        </div>

        <label style={s.label}>HTML body</label>
        <textarea ref={bodyRef} rows={10} style={{ ...s.input, fontFamily: 'monospace', fontSize: 12.5, resize: 'vertical', marginBottom: 12 }} value={html} onChange={e => setHtml(e.target.value)} />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <button style={s.btnGhost} onClick={runPreview}><Eye size={14} style={{ verticalAlign: -2, marginRight: 4 }} />Preview</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.btnGhost} onClick={onClose}>Cancel</button>
            <button style={s.btnPrimary} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save Template'}</button>
          </div>
        </div>

        {preview && (
          <div style={{ marginTop: 16, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 12.5, color: '#475569' }}>
              <strong>Subject:</strong> {preview.subject}
            </div>
            <div style={{ padding: 14, background: '#fff' }} dangerouslySetInnerHTML={{ __html: preview.html }} />
            <div style={{ padding: '6px 12px', background: '#f8fafc', fontSize: 11.5, color: '#94a3b8' }}>Rendered with sample data (Priya Sharma, IIT Delhi…).</div>
          </div>
        )}
      </div>
    </div>
  );
}
