'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPatch, apiPost } from '@/lib/api';
import TiptapEditor from '@/components/TiptapEditor';
import '@/styles/admin-panel.css';

function ImageUploadField({ label, storedUrl, previewUrl, uploading, onFileChange, onRemove }) {
  const displayUrl = previewUrl || storedUrl;

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={onFileChange}
      />
      {uploading && (
        <div style={{ fontSize: 13, color: '#60a5fa', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #60a5fa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Uploading to S3...
        </div>
      )}
      {displayUrl && !uploading && (
        <div style={{ position: 'relative', marginTop: 8 }}>
          <img
            src={displayUrl}
            alt="Preview"
            style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, display: 'block', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            type="button"
            onClick={onRemove}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.75)', border: 'none', color: '#fff', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}
          >
            Remove
          </button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </div>
  );
}

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingFields, setUploadingFields] = useState({});
  const [previews, setPreviews] = useState({ cover: '', thumbnail: '', authorProfile: '' });
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await apiGet(`/api/v1/admin/articles/${id}`);
        if (!data) throw new Error('No data');
        setForm({
          ...data,
          tags: data.tags?.join(', ') || '',
          keyPoints: data.keyPoints?.join('\n') || '',
          seo: {
            ...data.seo,
            keywords: data.seo?.keywords?.join(', ') || '',
          }
        });
      } catch (err) {
        alert('Failed to load article');
        router.push('/admin/articles');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchArticle();
  }, [id, router]);

  const handleImageUpload = async (file, fieldKey) => {
    // Immediate local preview via blob URL
    const blobUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [fieldKey]: blobUrl }));

    try {
      setUploadingFields(prev => ({ ...prev, [fieldKey]: true }));
      const { data, error } = await apiPost('/api/v1/admin/upload-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'articles'
      });

      if (error || !data?.uploadUrl) throw new Error(error?.message || 'Failed to get upload URL');

      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error(`S3 upload failed (${uploadResponse.status})`);
      // Switch preview from blob URL to live S3 URL
      setPreviews(prev => ({ ...prev, [fieldKey]: data.fileUrl }));
      return data.fileUrl;
    } catch (error) {
      console.error('Upload Error:', error);
      alert(`Image upload failed: ${error.message}`);
      setPreviews(prev => ({ ...prev, [fieldKey]: '' }));
      return null;
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        keyPoints: form.keyPoints.split('\n').map(k => k.trim()).filter(Boolean),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
        },
        readTime: Number(form.readTime) || 0,
      };

      await apiPatch(`/api/v1/admin/articles/${id}`, payload);
      router.push('/admin/articles');
    } catch (err) {
      console.error(err);
      alert('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  const isAnyUploading = Object.values(uploadingFields).some(Boolean);

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', marginBottom: 8 }}>
          ← Back to Articles
        </button>
        <h1 className="admin-page-title">Edit Article</h1>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24, alignItems: 'start' }}>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Basic Information</h3>

            <div className="admin-form-group">
              <label>Article Title *</label>
              <input required value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>

            <div className="admin-form-group">
              <label>Subtitle / Short Summary *</label>
              <textarea required rows={2} value={form.subtitle} onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))} />
            </div>

            <div className="admin-form-group">
              <label>Slug</label>
              <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Article Content *</h3>
            <TiptapEditor
              content={form.content}
              onChange={content => setForm(prev => ({ ...prev, content }))}
              onImageUpload={async (file) => {
                const blobUrl = URL.createObjectURL(file);
                try {
                  setUploadingFields(prev => ({ ...prev, content: true }));
                  const { data, error } = await apiPost('/api/v1/admin/upload-url', {
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    folder: 'articles'
                  });
                  if (error || !data?.uploadUrl) throw new Error(error?.message || 'Failed to get upload URL');
                  const res = await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                  if (!res.ok) throw new Error(`S3 upload failed (${res.status})`);
                  return data.fileUrl;
                } catch (err) {
                  alert(`Image upload failed: ${err.message}`);
                  return blobUrl;
                } finally {
                  setUploadingFields(prev => ({ ...prev, content: false }));
                }
              }}
            />
            {uploadingFields.content && <p style={{ fontSize: 13, color: '#60a5fa', marginTop: 8 }}>Uploading image to content...</p>}
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Key Takeaways</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>
              Add bullet points shown as a highlighted box on the article. One point per line.
            </p>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Key Points (one per line)</label>
              <textarea
                rows={5}
                value={form.keyPoints}
                onChange={e => setForm(prev => ({ ...prev, keyPoints: e.target.value }))}
                placeholder={"Startups can apply for DPIIT recognition online\nFunding schemes available up to ₹10 crore"}
                style={{ fontFamily: 'inherit', lineHeight: 1.6 }}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Author Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label>Author Name *</label>
                <input required value={form.author?.name} onChange={e => setForm(prev => ({ ...prev, author: { ...prev.author, name: e.target.value }}))} />
              </div>
              <div className="admin-form-group">
                <label>Role / Designation</label>
                <input value={form.author?.role} onChange={e => setForm(prev => ({ ...prev, author: { ...prev.author, role: e.target.value }}))} />
              </div>
              <div className="admin-form-group">
                <label>Company / Organization</label>
                <input value={form.author?.company} onChange={e => setForm(prev => ({ ...prev, author: { ...prev.author, company: e.target.value }}))} />
              </div>
              <div className="admin-form-group">
                <label>LinkedIn URL</label>
                <input value={form.author?.linkedinUrl} onChange={e => setForm(prev => ({ ...prev, author: { ...prev.author, linkedinUrl: e.target.value }}))} />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 16 }}>
              <label>Author Profile Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isAnyUploading}
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await handleImageUpload(e.target.files[0], 'authorProfile');
                        if (url) setForm(prev => ({ ...prev, author: { ...prev.author, profileImage: url } }));
                      }
                    }}
                    style={{ width: '100%' }}
                  />
                  {uploadingFields.authorProfile && <span style={{ fontSize: 12, color: '#60a5fa' }}>Uploading...</span>}
                </div>
                {(previews.authorProfile || form.author?.profileImage) && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={previews.authorProfile || form.author?.profileImage}
                      alt="Preview"
                      style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: '50%', border: '2px solid #3b82f6', display: 'block' }}
                      onError={e => { e.target.style.background = '#1e3a5f'; e.target.src = ''; }}
                    />
                    <button type="button"
                      onClick={() => { setForm(prev => ({ ...prev, author: { ...prev.author, profileImage: '' } })); setPreviews(prev => ({ ...prev, authorProfile: '' })); }}
                      style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 16 }}>
              <label>Author Bio</label>
              <textarea rows={2} value={form.author?.bio} onChange={e => setForm(prev => ({ ...prev, author: { ...prev.author, bio: e.target.value }}))} />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>SEO Optimization</h3>
            <div className="admin-form-group">
              <label>Meta Title</label>
              <input value={form.seo?.metaTitle} onChange={e => setForm(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value }}))} />
            </div>
            <div className="admin-form-group">
              <label>Meta Description</label>
              <textarea rows={2} value={form.seo?.metaDescription} onChange={e => setForm(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value }}))} />
            </div>
            <div className="admin-form-group">
              <label>Keywords (comma separated)</label>
              <input value={form.seo?.keywords} onChange={e => setForm(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value }}))} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Publishing</h3>

            <div className="admin-form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            <button type="submit" disabled={loading || isAnyUploading} className="admin-btn-primary" style={{ width: '100%', padding: '12px', fontSize: 16, marginTop: 16 }}>
              {loading ? 'Saving...' : isAnyUploading ? 'Uploading image...' : 'Update Article'}
            </button>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Media</h3>

            <ImageUploadField
              label="Cover Image (Hero)"
              storedUrl={form.coverImage}
              previewUrl={previews.cover}
              uploading={uploadingFields.cover}
              onFileChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await handleImageUpload(e.target.files[0], 'cover');
                  if (url) setForm(prev => ({ ...prev, coverImage: url }));
                }
              }}
              onRemove={() => { setForm(prev => ({ ...prev, coverImage: '' })); setPreviews(prev => ({ ...prev, cover: '' })); }}
            />

            <ImageUploadField
              label="Thumbnail Image (Cards)"
              storedUrl={form.thumbnailImage}
              previewUrl={previews.thumbnail}
              uploading={uploadingFields.thumbnail}
              onFileChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await handleImageUpload(e.target.files[0], 'thumbnail');
                  if (url) setForm(prev => ({ ...prev, thumbnailImage: url }));
                }
              }}
              onRemove={() => { setForm(prev => ({ ...prev, thumbnailImage: '' })); setPreviews(prev => ({ ...prev, thumbnail: '' })); }}
            />
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Categorization</h3>

            <div className="admin-form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
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
              <input value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24, borderRadius: 12, background: 'var(--admin-card-bg)' }}>
            <h3 style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Reading Settings</h3>

            <div className="admin-form-group">
              <label>Visibility</label>
              <select value={form.visibility} onChange={e => setForm(prev => ({ ...prev, visibility: e.target.value }))}>
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Read Time (minutes)</label>
              <input type="number" value={form.readTime} onChange={e => setForm(prev => ({ ...prev, readTime: e.target.value }))} />
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))} style={{ width: 18, height: 18 }} />
              <label htmlFor="isFeatured" style={{ margin: 0 }}>Mark as Featured</label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
