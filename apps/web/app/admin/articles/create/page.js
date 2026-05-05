'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import TiptapEditor from '@/components/TiptapEditor';
import '@/styles/admin-panel.css';

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    author: {
      name: '',
      role: '',
      company: '',
      profileImage: '',
      linkedinUrl: '',
      bio: '',
    },
    content: '',
    coverImage: '',
    thumbnailImage: '',
    category: 'Startup',
    tags: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
    status: 'draft',
    visibility: 'public',
    readTime: '',
    isFeatured: false,
  });

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const { data } = await apiPost('/api/v1/admin/upload-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'articles'
      });

      if (!data || !data.uploadUrl) throw new Error('Failed to get upload URL');

      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (uploadResponse.ok) {
        return data.fileUrl || data.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload image.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
        },
        readTime: Number(form.readTime) || 0,
      };

      await apiPost('/api/v1/admin/articles', payload);
      router.push('/admin/articles');
    } catch (err) {
      console.error(err);
      alert('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', marginBottom: 8 }}>
          ← Back to Articles
        </button>
        <h1 className="admin-page-title">Create Article</h1>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24, alignItems: 'start' }}>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Basic Information</h3>
            
            <div className="admin-form-group">
              <label>Article Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter article title" />
            </div>

            <div className="admin-form-group">
              <label>Subtitle / Short Summary *</label>
              <textarea required rows={2} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="A brief summary of the article..." />
            </div>

            <div className="admin-form-group">
              <label>Slug (Optional, auto-generated if empty)</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-awesome-article" />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Article Content *</h3>
            <TiptapEditor 
              content={form.content} 
              onChange={content => setForm({ ...form, content })} 
              onImageUpload={handleImageUpload} 
            />
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Author Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label>Author Name *</label>
                <input required value={form.author.name} onChange={e => setForm({ ...form, author: { ...form.author, name: e.target.value }})} placeholder="Dr. Priya Sharma" />
              </div>
              <div className="admin-form-group">
                <label>Role / Designation</label>
                <input value={form.author.role} onChange={e => setForm({ ...form, author: { ...form.author, role: e.target.value }})} placeholder="Founder & CEO" />
              </div>
              <div className="admin-form-group">
                <label>Company / Organization</label>
                <input value={form.author.company} onChange={e => setForm({ ...form, author: { ...form.author, company: e.target.value }})} placeholder="DevUp" />
              </div>
              <div className="admin-form-group">
                <label>LinkedIn URL</label>
                <input value={form.author.linkedinUrl} onChange={e => setForm({ ...form, author: { ...form.author, linkedinUrl: e.target.value }})} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 16 }}>
              <label>Author Profile Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="file" accept="image/*" disabled={uploadingImage} onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = await handleImageUpload(e.target.files[0]);
                    if (url) setForm({ ...form, author: { ...form.author, profileImage: url } });
                  }
                }} style={{ flex: 1 }} />
                {form.author.profileImage && (
                  <img src={form.author.profileImage} alt="Preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
                )}
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 16 }}>
              <label>Author Bio</label>
              <textarea rows={2} value={form.author.bio} onChange={e => setForm({ ...form, author: { ...form.author, bio: e.target.value }})} placeholder="Short bio..." />
            </div>
          </div>
          
          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>SEO Optimization</h3>
            <div className="admin-form-group">
              <label>Meta Title</label>
              <input value={form.seo.metaTitle} onChange={e => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value }})} placeholder="Title for search engines" />
            </div>
            <div className="admin-form-group">
              <label>Meta Description</label>
              <textarea rows={2} value={form.seo.metaDescription} onChange={e => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value }})} placeholder="Description for search engines" />
            </div>
            <div className="admin-form-group">
              <label>Keywords (comma separated)</label>
              <input value={form.seo.keywords} onChange={e => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value }})} placeholder="startup, funding, devup" />
            </div>
          </div>

        </div>

        {/* Sidebar Settings Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Publishing</h3>
            
            <div className="admin-form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="admin-btn-primary" style={{ width: '100%', padding: '12px', fontSize: 16, marginTop: 16 }}>
              {loading ? 'Saving...' : 'Save Article'}
            </button>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Media</h3>
            
            <div className="admin-form-group">
              <label>Cover Image (Hero)</label>
              <input type="file" accept="image/*" disabled={uploadingImage} onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const url = await handleImageUpload(e.target.files[0]);
                  if (url) setForm({ ...form, coverImage: url });
                }
              }} />
              {form.coverImage && <img src={form.coverImage} alt="Cover" style={{ width: '100%', height: 120, objectFit: 'cover', marginTop: 8, borderRadius: 8 }} />}
            </div>

            <div className="admin-form-group">
              <label>Thumbnail Image (Cards)</label>
              <input type="file" accept="image/*" disabled={uploadingImage} onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const url = await handleImageUpload(e.target.files[0]);
                  if (url) setForm({ ...form, thumbnailImage: url });
                }
              }} />
              {form.thumbnailImage && <img src={form.thumbnailImage} alt="Thumb" style={{ width: '100%', height: 120, objectFit: 'cover', marginTop: 8, borderRadius: 8 }} />}
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Categorization</h3>
            
            <div className="admin-form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Startup">Startup</option>
                <option value="AI">AI</option>
                <option value="Technology">Technology</option>
                <option value="Funding">Funding</option>
                <option value="Leadership">Leadership</option>
                <option value="Career">Career</option>
                <option value="Product Development">Product Development</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Founder, Tech, B2B" />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Reading Settings</h3>
            
            <div className="admin-form-group">
              <label>Visibility</label>
              <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}>
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Read Time (minutes)</label>
              <input type="number" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="Auto-calculated if empty" />
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} style={{ width: 18, height: 18 }} />
              <label htmlFor="isFeatured" style={{ margin: 0 }}>Mark as Featured</label>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
