'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

const CATEGORIES = [
  { value: 'startup',   label: 'Startup' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'partner',   label: 'Partner' },
  { value: 'academia',  label: 'Academia' },
  { value: 'coworking', label: 'Co-Working' },
];

const CAT_COLORS = {
  startup:   { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  corporate: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  partner:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  academia:  { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  coworking: { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
};

const EMPTY_FORM = {
  name: '',
  description: '',
  logo: '',
  website: '',
  category: 'startup',
  tags: '',
  isFeatured: false,
  isActive: true,
  order: 0,
};

export default function AdminEcosystemPage() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState(searchParams.get('cat') || '');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [allCounts, setAllCounts] = useState({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  // Sync filter when sidebar navigation changes the ?cat= param
  useEffect(() => {
    const cat = searchParams.get('cat') || '';
    setFilterCat(cat);
    setSearch('');
  }, [searchParams]);

  // Always fetch total counts per category for the stats cards
  useEffect(() => {
    apiGet('/api/v1/admin/ecosystem?limit=1000').then(({ data }) => {
      if (!data) return;
      const counts = {};
      CATEGORIES.forEach(c => { counts[c.value] = 0; });
      (data.items || []).forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });
      setAllCounts(counts);
    });
  }, [entries]); // re-run after any CRUD

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filterCat) params.set('category', filterCat);
      if (search) params.set('search', search);
      const { data } = await apiGet(`/api/v1/admin/ecosystem?${params}`);
      if (data) {
        setEntries(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterCat, search]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  function openAdd() {
    setEditEntry(null);
    // Pre-select current category filter when adding from a filtered view
    setForm({ ...EMPTY_FORM, category: filterCat || 'startup' });
    setShowModal(true);
  }

  function openEdit(entry) {
    setEditEntry(entry);
    setForm({
      name: entry.name || '',
      description: entry.description || '',
      logo: entry.logo || '',
      website: entry.website || '',
      category: entry.category || 'startup',
      tags: (entry.tags || []).join(', '),
      isFeatured: !!entry.isFeatured,
      isActive: entry.isActive !== false,
      order: entry.order || 0,
    });
    setShowModal(true);
  }

  async function handleLogoUpload(file) {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { data, error } = await apiPost('/api/v1/admin/upload-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'images',
      });
      if (error || !data?.uploadUrl) throw new Error(error?.message || 'Failed to get upload URL');
      const res = await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      if (!res.ok) throw new Error('Upload to S3 failed');
      setForm(p => ({ ...p, logo: data.fileUrl || data.url }));
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Logo upload failed: ' + (err.message || 'Unknown error. Check you are logged in and file is JPG/PNG/WebP under 10MB.'));
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
      alert('Website URL must start with http:// or https:// and be a valid URL.');
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        order: Number(form.order) || 0,
      };
      const { error } = editEntry
        ? await apiPatch(`/api/v1/admin/ecosystem/${editEntry._id}`, body)
        : await apiPost('/api/v1/admin/ecosystem', body);
      if (error) {
        alert(error.message || 'Save failed');
      } else {
        setShowModal(false);
        fetchEntries();
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      const { error } = await apiDelete(`/api/v1/admin/ecosystem/${id}`);
      if (error) alert(error.message || 'Delete failed');
      else { setDeleteTarget(null); fetchEntries(); }
    } catch (err) {
      alert('An error occurred');
    }
  }

  async function toggleActive(entry) {
    try {
      await apiPatch(`/api/v1/admin/ecosystem/${entry._id}`, { isActive: !entry.isActive });
      fetchEntries();
    } catch (err) { console.error(err); }
  }

  async function toggleFeatured(entry) {
    try {
      await apiPatch(`/api/v1/admin/ecosystem/${entry._id}`, { isFeatured: !entry.isFeatured });
      fetchEntries();
    } catch (err) { console.error(err); }
  }

  const s = {
    page: { padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
    sub: { fontSize: '13px', color: '#64748b', marginTop: '2px' },
    addBtn: { padding: '10px 20px', background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    toolbar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    input: { padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a', background: '#fff', minWidth: '200px' },
    select: { padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a', background: '#fff', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    th: { padding: '13px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '14px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
    badge: (cat) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', background: CAT_COLORS[cat]?.bg || '#f1f5f9', color: CAT_COLORS[cat]?.text || '#334155', border: `1px solid ${CAT_COLORS[cat]?.border || '#e2e8f0'}` }),
    toggle: (active) => ({ width: '36px', height: '20px', borderRadius: '100px', background: active ? '#22c55e' : '#e2e8f0', cursor: 'pointer', border: 'none', position: 'relative', transition: 'background 0.2s' }),
    toggleDot: (active) => ({ position: 'absolute', top: '3px', left: active ? '19px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }),
    editBtn: { padding: '6px 12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    delBtn: { padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modal: { background: '#fff', borderRadius: '20px', padding: '36px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
    modalTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    formInput: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a' },
    formTextarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', resize: 'vertical', minHeight: '80px' },
    formSelect: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', background: '#fff' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    saveBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
    cancelBtn: { width: '100%', padding: '13px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '8px' },
    closeBtn: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' },
    checkRow: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    spin: { animation: 'spin 0.7s linear infinite' },
    checkLabel: { fontSize: '14px', color: '#374151', fontWeight: '500', cursor: 'pointer' },
    statsRow: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    statCard: (bg, text) => ({ padding: '14px 20px', background: bg, borderRadius: '10px', flex: '1', minWidth: '120px' }),
    statNum: { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
    statLbl: { fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' },
  };

  const catCounts = CATEGORIES.reduce((acc, c) => {
    acc[c.value] = entries.filter(e => e.category === c.value).length;
    return acc;
  }, {});

  const activeCatLabel = CATEGORIES.find(c => c.value === filterCat)?.label || null;

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            {activeCatLabel ? `${activeCatLabel} — Ecosystem` : 'Ecosystem Management'}
          </h1>
          <p style={s.sub}>
            {filterCat
              ? `${total} ${activeCatLabel?.toLowerCase()} entries`
              : `${total} total entries across all categories`}
          </p>
        </div>
        <button style={s.addBtn} onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Entry
        </button>
      </div>

      {/* Stats — always show all-category counts */}
      <div style={s.statsRow}>
        {CATEGORIES.map(c => (
          <div
            key={c.value}
            onClick={() => setFilterCat(filterCat === c.value ? '' : c.value)}
            style={{ ...s.statCard(CAT_COLORS[c.value]?.bg || '#f8fafc', CAT_COLORS[c.value]?.text || '#334155'), cursor: 'pointer', outline: filterCat === c.value ? `2px solid ${CAT_COLORS[c.value]?.text}` : 'none', outlineOffset: '2px' }}
          >
            <div style={s.statNum}>{allCounts[c.value] ?? catCounts[c.value]}</div>
            <div style={s.statLbl}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <input
          style={s.input}
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={s.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading...</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {['Logo', 'Name', 'Category', 'Tags', 'Featured', 'Active', 'Order', 'Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                  No entries yet. Click "Add Entry" to get started.
                </td>
              </tr>
            ) : entries.map(entry => (
              <tr key={entry._id} style={{ background: entry.isActive ? '#fff' : '#fafafa' }}>
                <td style={s.td}>
                  {entry.logo ? (
                    <img src={entry.logo} alt={entry.name} style={{ width: 60, height: 60, borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0', display: 'block' }} />
                  ) : (
                    <div style={{ width: 60, height: 60, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                      {entry.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td style={s.td}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{entry.name}</div>
                  {entry.website && (
                    <a
                      href={entry.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11px', color: '#2563eb', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: '500' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Visit Website
                    </a>
                  )}
                </td>
                <td style={s.td}><span style={s.badge(entry.category)}>{entry.category}</span></td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(entry.tags || []).slice(0, 3).map((t, i) => (
                      <span key={i} style={{ fontSize: '11px', padding: '2px 8px', background: '#f1f5f9', borderRadius: '100px', color: '#64748b' }}>{t}</span>
                    ))}
                  </div>
                </td>
                <td style={s.td}>
                  <button style={{ ...s.toggle(entry.isFeatured), width: 'unset', height: 'unset', padding: 0 }} onClick={() => toggleFeatured(entry)} title="Toggle featured">
                    <div style={s.toggleDot(entry.isFeatured)} />
                  </button>
                </td>
                <td style={s.td}>
                  <button style={{ ...s.toggle(entry.isActive), width: 'unset', height: 'unset', padding: 0 }} onClick={() => toggleActive(entry)} title="Toggle active">
                    <div style={s.toggleDot(entry.isActive)} />
                  </button>
                </td>
                <td style={s.td}>{entry.order}</td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={s.editBtn} onClick={() => openEdit(entry)}>Edit</button>
                    <button style={s.delBtn} onClick={() => setDeleteTarget(entry)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setShowModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 style={s.modalTitle}>{editEntry ? 'Edit Entry' : 'Add Ecosystem Entry'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={s.label}>Name *</label>
                <input style={s.formInput} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Google for Startups" />
              </div>
              <div>
                <label style={s.label}>Category *</label>
                <select style={s.formSelect} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Description</label>
                <textarea style={s.formTextarea} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
              </div>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Logo</label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={e => handleLogoUpload(e.target.files[0])}
                  />
                  <div
                    onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                    style={{ border: '1.5px dashed #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: uploadingLogo ? 'wait' : 'pointer', background: '#fafafa', minHeight: '56px' }}
                  >
                    {form.logo ? (
                      <>
                        <img src={form.logo} alt="logo" style={{ width: 48, height: 48, borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>Logo uploaded</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Click to replace</div>
                        </div>
                        <button type="button" onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, logo: '' })); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {uploadingLogo ? (
                            <div style={{ width: 16, height: 16, border: '2px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          )}
                        </div>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                          {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label style={s.label}>Website URL</label>
                  <input
                    style={s.formInput}
                    type="url"
                    value={form.website}
                    onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div>
                <label style={s.label}>Tags <span style={{ fontWeight: '400', color: '#94a3b8' }}>(comma-separated)</span></label>
                <input style={s.formInput} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. FinTech, SaaS, B2B" />
              </div>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Display Order</label>
                  <input style={s.formInput} type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} min={0} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={s.checkRow}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} />
                  <span style={s.checkLabel}>Featured</span>
                </label>
                <label style={s.checkRow}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
                  <span style={s.checkLabel}>Active (visible on site)</span>
                </label>
              </div>
              <button type="submit" style={s.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : editEntry ? 'Save Changes' : 'Add Entry'}
              </button>
              <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div style={s.overlay} onClick={() => setDeleteTarget(null)}>
          <div style={{ ...s.modal, maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '16px', color: '#dc2626' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Entry</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={{ ...s.cancelBtn, width: 'auto', marginTop: 0, padding: '10px 24px' }} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                style={{ ...s.editBtn, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}
                onClick={() => handleDelete(deleteTarget._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
