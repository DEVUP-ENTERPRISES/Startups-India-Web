'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import '@/styles/admin-panel.css';

export default function ArticleAnalyticsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await apiGet(`/api/v1/admin/articles/${id}/analytics`);
        if (data) setData(data);
      } catch (err) {
        alert('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnalytics();
  }, [id]);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;
  if (!data) return <div className="admin-empty">Analytics not found</div>;

  const { article, stats } = data;

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ marginBottom: 32 }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', marginBottom: 8 }}>
          ← Back to Articles
        </button>
        <h1 className="admin-page-title">Analytics: {article.title}</h1>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
          <span style={{ padding: '4px 12px', background: article.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.1)', color: article.status === 'published' ? '#4ade80' : '#ccc', borderRadius: 20, fontSize: 12 }}>
            {article.status.toUpperCase()}
          </span>
          <span style={{ color: '#888', fontSize: 14 }}>
            Published: {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        
        <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.05))', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ fontSize: 14, color: '#93c5fd', marginBottom: 8, fontWeight: 600 }}>Total Views</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{stats.totalViews}</div>
        </div>

        <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(147,51,234,0.05))', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div style={{ fontSize: 14, color: '#d8b4fe', marginBottom: 8, fontWeight: 600 }}>Unique Views (IPs)</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{stats.uniqueViews}</div>
        </div>

        <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.05))', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontSize: 14, color: '#fca5a5', marginBottom: 8, fontWeight: 600 }}>Total Likes</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{stats.totalLikes}</div>
        </div>

        <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(22,163,74,0.05))', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div style={{ fontSize: 14, color: '#86efac', marginBottom: 8, fontWeight: 600 }}>Total Bookmarks</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{stats.totalBookmarks}</div>
        </div>

      </div>
      
      <div className="admin-card" style={{ padding: 32, borderRadius: 12, background: '#1e1e2d', textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, color: '#f8fafc', marginBottom: 12 }}>Engagement Metrics</h3>
        <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>
          Detailed time-series graphs for daily views, scroll depth, and avg read duration will be displayed here in the future iterations using Recharts.
        </p>
      </div>

    </div>
  );
}
