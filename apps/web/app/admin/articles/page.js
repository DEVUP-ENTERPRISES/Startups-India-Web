'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPatch, apiDelete, apiPost } from '@/lib/api';
import { BarChart, Eye, Upload, Download, Edit2, Copy, Trash2 } from 'lucide-react';
import '@/styles/admin-panel.css';

const ADMIN_BASE = `/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}`;

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiGet(`/api/v1/admin/articles?page=${page}&limit=10&search=${search}`);
      setArticles(data?.articles || []);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await apiDelete(`/api/v1/admin/articles/${id}`);
      load();
    } catch (err) {
      alert('Error deleting article');
    }
  };

  const handleDuplicate = async (id) => {
    if (!confirm('Duplicate this article?')) return;
    try {
      await apiPost(`/api/v1/admin/articles/${id}/duplicate`);
      load();
    } catch (err) {
      alert('Error duplicating article');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    try {
      await apiPatch(`/api/v1/admin/articles/${id}`, { status: newStatus });
      load();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Articles & Sources</h1>
          <p className="admin-page-subtitle">Manage DevUp startup ecosystem articles, resources, and insights.</p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={() => router.push(`${ADMIN_BASE}/articles/create`)}
        >
          Add Article
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search articles by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search-input"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
        />
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : articles.length === 0 ? (
          <div className="admin-empty">No articles found. Create your first piece of content!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Author</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Published Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: '#333', overflow: 'hidden' }}>
                        {article.thumbnailImage || article.coverImage ? (
                          <img 
                            src={article.thumbnailImage || article.coverImage} 
                            alt="Cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1557683316-973673baf926?w=100&q=80";
                            }}
                          />
                        ) : (
                          <img 
                            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=100&q=80" 
                            alt="Cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{article.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{article.readTime} min read</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 14 }}>{article.author?.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{article.author?.role}</div>
                  </td>
                  <td>
                    <span style={{ padding: '4px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', fontSize: 12 }}>
                      {article.category}
                    </span>
                  </td>
                  <td>{article.metrics?.viewsCount || 0}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 12, 
                      fontSize: 12,
                      background: article.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.1)',
                      color: article.status === 'published' ? '#4ade80' : '#ccc'
                    }}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => router.push(`${ADMIN_BASE}/articles/${article._id}/analytics`)} className="admin-btn-icon" title="Analytics">
                        <BarChart size={16} />
                      </button>
                      <button onClick={() => window.open(`/source/${article.slug}`, '_blank')} className="admin-btn-icon" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => toggleStatus(article._id, article.status)} className="admin-btn-icon" title={article.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {article.status === 'published' ? <Download size={16} /> : <Upload size={16} />}
                      </button>
                      <button onClick={() => router.push(`${ADMIN_BASE}/articles/${article._id}/edit`)} className="admin-btn-icon" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDuplicate(article._id)} className="admin-btn-icon" title="Duplicate">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => handleDelete(article._id)} className="admin-btn-icon" style={{ color: '#ef4444' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                border: 'none',
                background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
