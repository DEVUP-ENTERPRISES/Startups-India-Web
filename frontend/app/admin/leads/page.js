'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    interest: '',
    notes: '',
    status: 'new',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const { data } = await apiGet(`/api/v1/admin/leads?${params}`);
    if (data) {
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditLead(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      source: 'website',
      interest: '',
      notes: '',
      status: 'new',
    });
    setShowModal(true);
  };

  const openEdit = lead => {
    setEditLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      source: lead.source,
      interest: lead.interest || '',
      notes: lead.notes || '',
      status: lead.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    if (editLead) {
      await apiPatch(`/api/v1/admin/leads/${editLead._id}`, form);
    } else {
      await apiPost('/api/v1/admin/leads', form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this lead?')) return;
    await apiDelete(`/api/v1/admin/leads/${id}`);
    load();
  };

  const statusColors = {
    new: 'badge-blue',
    contacted: 'badge-yellow',
    qualified: 'badge-purple',
    converted: 'badge-green',
    lost: 'badge-red',
  };

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
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Leads / CRM</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Lead
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
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
                <th style={{ whiteSpace: 'nowrap', width: '15%' }}>Name</th>
                <th style={{ width: '20%' }}>Email</th>
                <th style={{ whiteSpace: 'nowrap', width: '10%' }}>Phone</th>
                <th style={{ whiteSpace: 'nowrap', width: '10%' }}>Source</th>
                <th style={{ width: '15%' }}>Interest</th>
                <th style={{ whiteSpace: 'nowrap', width: '10%' }}>Status</th>
                <th style={{ whiteSpace: 'nowrap', width: '10%' }}>Added</th>
                <th style={{ whiteSpace: 'nowrap', width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{l.name}</td>
                  <td style={{ color: '#64748b', wordBreak: 'break-all' }}>{l.email}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.phone || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="badge badge-gray">{l.source}</span>
                  </td>
                  <td
                    style={{
                      color: '#64748b',
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.interest || '-'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${statusColors[l.status] || 'badge-gray'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>
                Page {page} of {pages}
              </span>
              <div className="pagination-btns">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editLead ? 'Edit Lead' : 'New Lead'}</h2>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Source</label>
                  <select
                    value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })}
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social</option>
                    <option value="event">Event</option>
                    <option value="manual">Manual</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Interest</label>
                <input
                  value={form.interest}
                  onChange={e => setForm({ ...form, interest: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editLead ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
