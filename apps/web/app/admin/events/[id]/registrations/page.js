'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api';
import Link from 'next/link';

export default function AdminEventRegistrationsPage({ params }) {
  const id = params.id;
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [event, setEvent] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const searchParams = new URLSearchParams({ page, limit: 50 });
    if (search) searchParams.set('search', search);
    if (paymentFilter) searchParams.set('paymentStatus', paymentFilter);

    const [{ data: regData }, { data: eventData }] = await Promise.all([
      apiGet(`/api/v1/admin/events/${id}/registrations?${searchParams}`),
      apiGet(`/api/v1/events/${id}`)
    ]);

    if (regData) {
      setRegistrations(regData.registrations || []);
      setTotal(regData.total || 0);
      setPages(regData.pages || 1);
    }
    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [id, page, search, paymentFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Full Name', 'Email', 'Phone', 'College/Company', 'Role', 'City', 'Payment Status', 'Ticket Type', 'Attendance', 'Reg Date'];
    const rows = registrations.map(r => [
      `"${r.fullName || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phoneNumber || ''}"`,
      `"${r.collegeCompany || ''}"`,
      `"${r.roleProfession || ''}"`,
      `"${r.city || ''}"`,
      `"${r.paymentStatus || ''}"`,
      `"${r.ticketType || ''}"`,
      `"${r.attendanceStatus || ''}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `event_registrations_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = () => {
    alert('Email feature will open email composer or trigger backend job.');
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
        <div>
          <Link href="/admin/events" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', marginBottom: 4, display: 'inline-block' }}>
            ← Back to Events
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
            Registrations: {event ? event.title : 'Loading...'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-primary" onClick={handleSendEmail}>Email All</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input 
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setPage(1)}
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, flex: 1, maxWidth: 300 }}
        />
        <select
          value={paymentFilter}
          onChange={e => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
        >
          <option value="">All Payment Status</option>
          <option value="Free">Free</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <button className="btn btn-secondary" onClick={() => setPage(1)}>Apply Filters</button>
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
                <th>Registrant</th>
                <th>Contact</th>
                <th>Company/College</th>
                <th>Payment</th>
                <th>Ticket</th>
                <th>Attendance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{reg.fullName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.roleProfession || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{reg.email}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.phoneNumber || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{reg.collegeCompany || '-'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{reg.city || '-'}</div>
                  </td>
                  <td>
                    <span className={`badge ${reg.paymentStatus === 'Completed' ? 'badge-green' : reg.paymentStatus === 'Free' ? 'badge-blue' : 'badge-orange'}`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td>{reg.ticketType}</td>
                  <td>
                    <span className={`badge ${reg.attendanceStatus === 'Attended' ? 'badge-green' : 'badge-gray'}`}>
                      {reg.attendanceStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>
                Page {page} of {pages} ({total} total)
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
