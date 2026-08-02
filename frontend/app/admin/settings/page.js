'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', category: 'general', description: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const params = category ? `?category=${category}` : '';
    const { data } = await apiGet(`/api/v1/admin/settings${params}`);
    if (data) setSettings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!form.key) return;
    await apiPost('/api/v1/admin/settings', form);
    setShowModal(false);
    setForm({ key: '', value: '', category: 'general', description: '' });
    load();
  };

  const handleDelete = async key => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    await apiDelete(`/api/v1/admin/settings/${encodeURIComponent(key)}`);
    load();
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
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}
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
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setForm({
                            key: s.key,
                            value:
                              typeof s.value === 'object'
                                ? JSON.stringify(s.value)
                                : String(s.value),
                            category: s.category,
                            description: s.description || '',
                          });
                          setShowModal(true);
                        }}
                      >
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
