'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';

const ADMIN_BASE = `/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}`;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentAdminEmail(payload.email || '');
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    const { data } = await apiGet(`/api/v1/admin/users?${params}`);
    if (data) {
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleActive = async user => {
    await apiPatch(`/api/v1/admin/users/${user._id}`, { isActive: !user.isActive });
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this user and all their enrollments? This cannot be undone.')) return;
    await apiDelete(`/api/v1/admin/users/${id}`);
    load();
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
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>User Management</h1>
        <span style={{ fontSize: 13, color: '#64748b' }}>{total} total users</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            width: 280,
            outline: 'none',
          }}
        />
        <select
          value={roleFilter}
          onChange={e => {
            setRoleFilter(e.target.value);
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
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="investor">Investor</option>
          <option value="startup">Startup</option>
          <option value="founder">Founder</option>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u._id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`${ADMIN_BASE}/users/${u._id}`)}
                >
                  <td style={{ fontWeight: 600 }}>{u.fullName || '-'}</td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-red'
                          : u.role === 'mentor'
                            ? 'badge-purple'
                            : u.role === 'investor'
                              ? 'badge-yellow'
                              : u.role === 'startup'
                                ? 'badge-green'
                                : u.role === 'founder'
                                  ? 'badge-blue'
                                  : 'badge-gray'
                      }`}
                    >
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive !== false ? 'badge-green' : 'badge-gray'}`}>
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => router.push(`${ADMIN_BASE}/users/${u._id}`)}
                      >
                        View Profile
                      </button>
                      {u.email === currentAdminEmail ? (
                        <span style={{ fontSize: 12, color: '#94a3b8', padding: '4px 8px' }}>
                          You
                        </span>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: u.isActive !== false ? '#fef3c7' : '#d1fae5',
                              color: u.isActive !== false ? '#b45309' : '#059669',
                            }}
                            onClick={() => handleToggleActive(u)}
                          >
                            {u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No users found
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
    </div>
  );
}
