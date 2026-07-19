'use client';

import { useEffect, useState } from 'react';
import { Upload, Trash2, FileSpreadsheet, X } from 'lucide-react';
import {
  listLeadLists, createLeadList, deleteLeadList, suggestMapping, parseSpreadsheetFile,
} from '@/lib/crm';
import { s, FIELD_LABELS } from './crmStyles';

const MAP_FIELDS = ['email', 'name', 'phone', 'collegeName', 'additional1', 'additional2', 'additional3'];

export default function ListsTab() {
  const [lists, setLists] = useState(null);
  const [wizard, setWizard] = useState(false);
  const [toast, setToast] = useState(null);

  const show = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3500); };

  const load = async () => {
    const { data } = await listLeadLists();
    setLists(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (list) => {
    if (!window.confirm(`Delete "${list.name}" and its ${list.contactCount} contacts? This cannot be undone.`)) return;
    const { error } = await deleteLeadList(list._id);
    if (error) show(error.message, 'error');
    else { show('List deleted.'); load(); }
  };

  return (
    <div>
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: '#64748b' }}>Your saved lists — re-select any for a follow-up campaign.</p>
        <button style={s.btnPrimary} onClick={() => setWizard(true)}><Upload size={15} style={{ verticalAlign: -2, marginRight: 6 }} />Import List</button>
      </div>

      {lists === null ? (
        <div style={s.empty}>Loading…</div>
      ) : lists.length === 0 ? (
        <div style={{ ...s.card, ...s.empty }}>
          <FileSpreadsheet size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 700, color: '#475569', margin: 0 }}>No lists yet</p>
          <p style={{ fontSize: 13.5, margin: '4px 0 0' }}>Import an Excel/CSV file to create your first list.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead><tr><th style={s.th}>List</th><th style={s.th}>Contacts</th><th style={s.th}>Imported</th><th style={s.th}></th></tr></thead>
          <tbody>
            {lists.map(l => (
              <tr key={l._id}>
                <td style={s.td}><strong>{l.name}</strong>{l.description ? <div style={{ fontSize: 12, color: '#94a3b8' }}>{l.description}</div> : null}</td>
                <td style={s.td}>{l.contactCount}</td>
                <td style={s.td}>{new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td style={{ ...s.td, textAlign: 'right' }}>
                  <button style={s.btnDanger} onClick={() => remove(l)}><Trash2 size={13} style={{ verticalAlign: -2 }} /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {wizard && <ImportWizard onClose={() => setWizard(false)} onDone={() => { setWizard(false); load(); show('List imported.'); }} onError={m => show(m, 'error')} />}
    </div>
  );
}

function ImportWizard({ onClose, onDone, onError }) {
  const [step, setStep] = useState('file'); // file | map
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const { headers: h, rows: r } = await parseSpreadsheetFile(file);
      setHeaders(h); setRows(r); setFileName(file.name);
      if (!name) setName(file.name.replace(/\.(xlsx|xls|csv)$/i, ''));
      const { data } = await suggestMapping(h);
      setMapping(data?.mapping || {});
      setStep('map');
    } catch (err) {
      setError(err.message || 'Could not read that file.');
    }
  };

  const save = async () => {
    if (!name.trim()) { setError('Please name the list.'); return; }
    if (!mapping.email) { setError('Map a column to Email.'); return; }
    setBusy(true); setError('');
    const { data, error: err } = await createLeadList({ name, sourceFileName: fileName, mapping, rows });
    setBusy(false);
    if (err) { setError(err.message || 'Import failed.'); return; }
    onDone(data);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Import Lead List</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
        </div>

        {error && <div style={s.err}>{error}</div>}

        {step === 'file' && (
          <div>
            <label style={s.label}>List name</label>
            <input style={{ ...s.input, marginBottom: 16 }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Campus Drive 2026" />
            <label style={s.label}>Spreadsheet file (.xlsx or .csv)</label>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={onFile} style={{ display: 'block', marginTop: 6 }} />
            <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 10 }}>The file is read in your browser — only the rows are sent when you confirm the mapping.</p>
          </div>
        )}

        {step === 'map' && (
          <div>
            <p style={{ fontSize: 13.5, color: '#475569', margin: '0 0 14px' }}>
              <strong>{rows.length}</strong> rows in <strong>{fileName}</strong>. Map each field to a column:
            </p>
            <label style={s.label}>List name</label>
            <input style={{ ...s.input, marginBottom: 16 }} value={name} onChange={e => setName(e.target.value)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {MAP_FIELDS.map(f => (
                <div key={f}>
                  <label style={s.label}>{FIELD_LABELS[f]}</label>
                  <select style={s.input} value={mapping[f] || ''} onChange={e => setMapping(m => ({ ...m, [f]: e.target.value || undefined }))}>
                    <option value="">— not mapped —</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={s.btnGhost} onClick={() => setStep('file')}>Back</button>
              <button style={s.btnPrimary} onClick={save} disabled={busy}>{busy ? 'Importing…' : `Import ${rows.length} rows`}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
