'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PaymentsTable({ enrollments, searchQuery, dateRange, onExport, loading }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let filtered = [...enrollments];

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.payment_status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(e => new Date(e.enrolled_at) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(e => new Date(e.enrolled_at) <= new Date(dateRange.end));
    }

    setFilteredData(filtered);
  }, [enrollments, searchQuery, dateRange]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { class: 'success', label: 'Paid' },
      pending: { class: 'warning', label: 'Pending' },
      failed: { class: 'danger', label: 'Failed' }
    };
    const badge = badges[status] || { class: 'secondary', label: status };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="table-header">
        <div className="table-title">
          <h2>Payments</h2>
          <span className="count-badge">{filteredData.length} records</span>
        </div>
        <button className="export-btn" onClick={onExport}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Course ID</th>
              <th>Status</th>
              <th>Stripe Payment ID</th>
              <th>Enrolled At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((enrollment) => (
              <tr key={enrollment.id}>
                <td><code>{enrollment.user_id?.substring(0, 8)}...</code></td>
                <td><code>{enrollment.course_id?.substring(0, 8)}...</code></td>
                <td>{getStatusBadge(enrollment.payment_status)}</td>
                <td className="stripe-id">{enrollment.stripe_payment_id || 'N/A'}</td>
                <td className="date-cell">{formatDate(enrollment.enrolled_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <p>No payments found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
