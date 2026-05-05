'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import '@/styles/source-new.css';

export default function SourcePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All Articles' },
    { id: 'Startup', label: 'Startup' },
    { id: 'AI', label: 'AI' },
    { id: 'Technology', label: 'Technology' },
    { id: 'Funding', label: 'Funding' },
    { id: 'Leadership', label: 'Leadership' },
    { id: 'Career', label: 'Career' },
    { id: 'Product Development', label: 'Product' },
    { id: 'Marketing', label: 'Marketing' }
  ];

  const loadArticles = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/articles?page=${page}&limit=12`;
      if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const { data } = await apiGet(url);
      setArticles(data?.articles || []);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [activeCategory, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadArticles();
  };

  return (
    <div className="source-page">
      {/* Hero Section */}
      <section className="source-hero">
        <div className="hero-gradient-bg"></div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Your Startup <br/>
              <span className="title-highlight">Knowledge Center</span>
            </h1>
            <p className="hero-description">
              Curated insights, practical guides, and ecosystem learnings for students, founders, and startups.
            </p>
            
            <form onSubmit={handleSearch} style={{ marginTop: 32, display: 'flex', gap: 12, maxWidth: 500 }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, authors, or topics..." 
                style={{ flex: 1, padding: '16px 24px', borderRadius: 30, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16 }}
              />
              <button type="submit" style={{ padding: '0 32px', borderRadius: 30, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Header Section */}
        <header className="section-header-group">
          <motion.div 
            className="status-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="status-dot"></span>
            EDITORIAL INTELLIGENCE
          </motion.div>
          <motion.h1 
            className="section-title-large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {searchQuery ? 'Search Results' : 'Latest Articles'}
          </motion.h1>
        </header>

        {/* Categories Bar */}
        <section className="category-section">
          <div className="categories-scroll">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat.id); setPage(1); setSearchQuery(''); }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
              >
                <span className="chip-label">
                  {cat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <main className="articles-section">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Loading articles...</div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>No articles found. Try another category or search term.</div>
          ) : (
            <div className="articles-grid">
              {articles.map((article, idx) => (
                <motion.article
                  key={article._id}
                  className="article-card"
                  onClick={() => router.push(`/source/${article.slug}`)}
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + (idx % 4) * 0.1 }}
                >
                  <div className="card-image-wrap">
                    {article.thumbnailImage || article.coverImage ? (
                      <img 
                        src={article.thumbnailImage || article.coverImage} 
                        alt={article.title} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80";
                        }}
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80" 
                        alt={article.title} 
                      />
                    )}
                    <div className="card-image-overlay"></div>
                    <span className={`category-badge-floating ${article.isFeatured ? 'highlight' : ''}`}>
                      {article.category}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-meta-row">
                      <span>{article.author?.name || 'DevUp Editorial'}</span>
                      <span className="meta-dot">•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="meta-dot">•</span>
                      <span>{article.metrics?.viewsCount || 0} VIEWS</span>
                    </div>

                    <h3 className="card-content-title">{article.title}</h3>
                    <p className="card-excerpt-text">{article.subtitle}</p>

                    <div className="card-footer-flex">
                      <span className="read-time-bottom">{article.readTime} MIN READ</span>
                      
                      <div className="interaction-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 48 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', border: 'none',
                    background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                    color: '#fff', fontWeight: 600, cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
