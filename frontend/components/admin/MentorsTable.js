'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MentorsTable({ mentors, searchQuery, dateRange, onExport, loading }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let filtered = [...mentors];

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(mentor => new Date(mentor.created_at) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(mentor => new Date(mentor.created_at) <= new Date(dateRange.end));
    }

    setFilteredData(filtered);
  }, [mentors, searchQuery, dateRange]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading mentors...</p>
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
          <h2>Mentors</h2>
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
              <th>Name</th>
              <th>Email</th>
              <th>Expertise</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((mentor) => (
              <tr key={mentor.id}>
                <td className="name-cell">{mentor.full_name}</td>
                <td className="email-cell">{mentor.email}</td>
                <td>
                  <div className="expertise-tags">
                    {mentor.expertise_areas?.slice(0, 2).map((exp, idx) => (
                      <span key={idx} className="badge info">{exp}</span>
                    ))}
                  </div>
                </td>
                <td>
                  {mentor.status === 'approved' ? (
                    <span className="badge success">Approved</span>
                  ) : mentor.status === 'pending' ? (
                    <span className="badge warning">Pending</span>
                  ) : (
                    <span className="badge danger">Rejected</span>
                  )}
                </td>
                <td>
                  {mentor.is_verified ? (
                    <span className="badge success">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  ) : (
                    <span className="badge warning">✗</span>
                  )}
                </td>
                <td className="date-cell">{formatDate(mentor.created_at)}</td>
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
            <p>No mentors found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
