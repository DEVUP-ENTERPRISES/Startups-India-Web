'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiGet, apiPost } from '@/lib/api';
import '@/styles/source-new.css';

export default function SingleArticlePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [engagements, setEngagements] = useState({ liked: false, bookmarked: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await apiGet(`/api/v1/articles/${slug}`);
        setArticle(data.article);
        setRelated(data.related || []);
        setEngagements(data.userEngagements || { liked: false, bookmarked: false });
        
        // Record View
        if (data.article) {
          apiPost(`/api/v1/articles/${data.article._id}/view`, {}).catch(console.error);
        }
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!article) return;
    try {
      const { liked } = await apiPost(`/api/v1/articles/${article._id}/like`);
      setEngagements(prev => ({ ...prev, liked }));
      setArticle(prev => ({ ...prev, metrics: { ...prev.metrics, likesCount: prev.metrics.likesCount + (liked ? 1 : -1) }}));
    } catch (err) {
      if (err.response?.status === 401) alert("Please login to like this article.");
    }
  };

  const handleBookmark = async () => {
    if (!article) return;
    try {
      const { bookmarked } = await apiPost(`/api/v1/articles/${article._id}/bookmark`);
      setEngagements(prev => ({ ...prev, bookmarked }));
      setArticle(prev => ({ ...prev, metrics: { ...prev.metrics, savesCount: prev.metrics.savesCount + (bookmarked ? 1 : -1) }}));
    } catch (err) {
      if (err.response?.status === 401) alert("Please login to bookmark this article.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#0a0a0f' }}>Loading...</div>;
  if (!article) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#0a0a0f' }}>Article not found.</div>;

  return (
    <div className="single-article-page" style={{ background: '#0a0a0f', color: '#f1f5f9', minHeight: '100vh', paddingTop: '80px' }}>
      
      {/* Top Section */}
      <section className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
              {article.category}
            </span>
            <span style={{ color: '#64748b', fontSize: 14 }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{article.readTime} MIN READ</span>
            <span style={{ color: '#64748b', fontSize: 14 }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: '#f8fafc' }}>
            {article.title}
          </h1>
          
          <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>
            {article.subtitle}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {article.author?.profileImage ? (
                <img src={article.author.profileImage} alt={article.author.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>
                  {article.author?.name?.charAt(0) || 'D'}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{article.author?.name || 'DevUp Editorial'}</div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>
                  {article.author?.role} {article.author?.company && `at ${article.author.company}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleLike} style={{ width: 40, height: 40, borderRadius: '50%', background: engagements.liked ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', color: engagements.liked ? '#ef4444' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                ❤️
              </button>
              <button onClick={handleBookmark} style={{ width: 40, height: 40, borderRadius: '50%', background: engagements.bookmarked ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', color: engagements.bookmarked ? '#3b82f6' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                🔖
              </button>
              <button onClick={handleShare} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                🔗
              </button>
            </div>
          </div>
        </motion.div>

        {article.coverImage && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <img src={article.coverImage} alt="Cover" style={{ width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover', borderRadius: 16, marginBottom: 48 }} />
          </motion.div>
        )}

        {article.keyPoints?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: 16,
              padding: '24px 28px',
              marginBottom: 48,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Key Takeaways
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {article.keyPoints.map((point, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < article.keyPoints.length - 1 ? 12 : 0 }}>
                  <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: 18, lineHeight: '26px', flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.65 }}>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.article
          className="tiptap-content-render"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontSize: 18, lineHeight: 1.8, color: '#cbd5e1' }}
        />
        
        {/* Basic CSS for the HTML content rendered from Tiptap */}
        <style dangerouslySetInnerHTML={{__html: `
          .tiptap-content-render p { margin-bottom: 1.5em; }
          .tiptap-content-render h1 { font-size: 38px; margin-top: 2em; margin-bottom: 0.8em; color: #f8fafc; font-weight: 800; }
          .tiptap-content-render h2 { font-size: 30px; margin-top: 2em; margin-bottom: 0.8em; color: #f8fafc; font-weight: 700; }
          .tiptap-content-render h3 { font-size: 22px; margin-top: 1.5em; margin-bottom: 0.6em; color: #e2e8f0; font-weight: 600; }
          .tiptap-content-render img { max-width: 100%; border-radius: 12px; margin: 2em auto; display: block; }
          .tiptap-content-render iframe { width: 100%; aspect-ratio: 16/9; border-radius: 12px; margin: 2em 0; border: none; }
          .tiptap-content-render blockquote { border-left: 4px solid #3b82f6; padding-left: 20px; font-style: italic; color: #94a3b8; font-size: 20px; margin: 2em 0; background: rgba(59,130,246,0.05); padding: 16px 20px; border-radius: 0 8px 8px 0; }
          .tiptap-content-render a { color: #60a5fa; text-decoration: underline; text-underline-offset: 4px; }
          .tiptap-content-render ul { list-style-type: disc; padding-left: 1.8em; margin-bottom: 1.5em; }
          .tiptap-content-render ol { list-style-type: decimal; padding-left: 1.8em; margin-bottom: 1.5em; }
          .tiptap-content-render li { margin-bottom: 0.6em; line-height: 1.7; }
          .tiptap-content-render li p { margin-bottom: 0.2em; }
          .tiptap-content-render ul ul { list-style-type: circle; margin-top: 0.4em; margin-bottom: 0.4em; }
          .tiptap-content-render pre { background: rgba(255,255,255,0.05); padding: 1.2em; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 14px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5em; }
          .tiptap-content-render code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #93c5fd; }
          .tiptap-content-render strong { color: #f1f5f9; font-weight: 700; }
          .tiptap-content-render em { color: #cbd5e1; }
        `}} />

        <div style={{ marginTop: 60, padding: 30, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: 20, marginBottom: 16, color: '#f8fafc' }}>About the Author</h3>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {article.author?.profileImage && (
              <img src={article.author.profileImage} alt={article.author.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{article.author?.name}</div>
              <div style={{ color: '#94a3b8', marginBottom: 12 }}>{article.author?.role} {article.author?.company && `at ${article.author.company}`}</div>
              {article.author?.bio && <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{article.author.bio}</p>}
            </div>
          </div>
        </div>

      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section style={{ background: '#111118', padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, marginBottom: 40, fontWeight: 700 }}>Read Next</h2>
            <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 30 }}>
              {related.map((rel) => (
                <div key={rel._id} className="article-card" onClick={() => router.push(`/source/${rel.slug}`)} style={{ cursor: 'pointer', background: '#1e1e2d', borderRadius: 16, overflow: 'hidden' }}>
                  <img src={rel.thumbnailImage || rel.coverImage} alt={rel.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div style={{ padding: 24 }}>
                    <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{rel.category}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, lineHeight: 1.4 }}>{rel.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rel.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
