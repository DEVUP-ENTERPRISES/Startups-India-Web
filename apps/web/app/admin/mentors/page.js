'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMentorsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorsData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const appsRes = await fetch(`${apiUrl}/api/v1/mentors/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData.data || []);
        }

        const reqsRes = await fetch(`${apiUrl}/api/v1/mentors/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (reqsRes.ok) {
          const reqsData = await reqsRes.json();
          setRequests(reqsData.data || []);
        }
      } catch (err) {
        console.error('Error fetching admin mentors data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>Mentor Management</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('applications')}
          style={{ padding: '8px 16px', background: activeTab === 'applications' ? '#2563eb' : '#e5e7eb', color: activeTab === 'applications' ? 'white' : 'black', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
        >
          Become Mentor Applications
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          style={{ padding: '8px 16px', background: activeTab === 'requests' ? '#2563eb' : '#e5e7eb', color: activeTab === 'requests' ? 'white' : 'black', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
        >
          Find Mentor Requests
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : activeTab === 'applications' ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '12px' }}>Company</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ color: '#334155' }}>
            {applications.map(app => (
              <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{app.fullName}</td>
                <td style={{ padding: '12px' }}>{app.email}</td>
                <td style={{ padding: '12px' }}>{app.currentRole}</td>
                <td style={{ padding: '12px' }}>{app.company}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '12px', background: app.status === 'pending' ? '#fef3c7' : '#dcfce3', color: app.status === 'pending' ? '#d97706' : '#166534' }}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No applications found.</td></tr>
            )}
          </tbody>
        </table>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px' }}>User Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Area of Interest</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ color: '#334155' }}>
            {requests.map(req => (
              <tr key={req._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{req.name}</td>
                <td style={{ padding: '12px' }}>{req.email}</td>
                <td style={{ padding: '12px' }}>{req.area}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '12px', background: req.status === 'pending' ? '#fef3c7' : '#dcfce3', color: req.status === 'pending' ? '#d97706' : '#166534' }}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No requests found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
