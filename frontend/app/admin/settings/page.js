'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

// Grant fees and limits have one editor (Grant Settings) with typed, validated fields.
function isGrantKey(key) {
  return String(key || '').startsWith('grant.');
}

function formatValue(value) {
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', category: 'general', description: '' });
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = category ? `?category=${category}` : '';
    const { data } = await apiGet(`/api/v1/admin/settings${params}`);
    if (data)
      setSettings(
        (Array.isArray(data) ? data : []).filter(s => !isGrantKey(s.key) && s.category !== 'grant')
      );
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!form.key) return;
    if (isGrantKey(form.key)) {
      setFormError('Grant settings are edited under Grants → Settings.');
      return;
    }
    const { error } = await apiPost('/api/v1/admin/settings', form);
    if (error) {
      setFormError(error.message || 'Could not save setting');
      return;
    }
    setFormError('');
    setShowModal(false);
    setForm({ key: '', value: '', category: 'general', description: '' });
    load();
  };

  const handleDelete = async key => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    await apiDelete(`/api/v1/admin/settings/${encodeURIComponent(key)}`);
    load();
  };

  const openEdit = s => {
    const displayValue = typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value);
    setForm({
      key: s.key,
      value: displayValue,
      category: s.category,
      description: s.description || '',
    });
    setShowModal(true);
  };

  const categories = ['general', 'email', 'payment', 'seo', 'appearance', 'security'];

  return (
    <div className="admin-page">
      <div
        className="admin-topbar"
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Settings</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Setting
        </button>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#4b5563' }}>
        Grant fees, limits and labels are managed in{' '}
        <a href={`/${ADMIN_SLUG}/grants/settings`} style={{ fontWeight: 600 }}>
          Grants → Settings
        </a>
        .
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          className={`btn ${!category ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setCategory('')}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c}
            className={`btn ${category === c ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setCategory(c)}
            style={{ textTransform: 'capitalize' }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Category</th>
                <th>Description</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(s => (
                <tr key={s._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600 }}>
                    {s.key}
                  </td>
                  <td
                    style={{
                      maxWidth: 220,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatValue(s.value)}
                  </td>
                  <td>
                    <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                      {s.category}
                    </span>
                  </td>
                  <td
                    style={{
                      color: '#64748b',
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.description || '-'}
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.key)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {settings.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No settings configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Add / Update Setting</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Key</label>
                <input
                  value={form.key}
                  onChange={e => setForm({ ...form, key: e.target.value })}
                  placeholder="e.g. site_name"
                />
              </div>
              <div className="admin-form-group">
                <label>Value</label>
                <textarea
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  placeholder=""
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c} value={c} style={{ textTransform: 'capitalize' }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <input
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            {formError && (
              <p role="alert" style={{ margin: '0 24px 12px', fontSize: 13, color: '#b91c1c' }}>
                {formError}
              </p>
            )}
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
