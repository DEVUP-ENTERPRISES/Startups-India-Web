# Vercel Blob Storage - Video Upload Guide

## 🎯 Quick Steps

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: **Startup India Incubation**
3. Click **Storage** tab
4. Click **Create Database** → Select **Blob**
5. Name: `startup-videos`
6. Click **Create**

---

### 2. Upload Videos Manually

**Option A: Via Dashboard (Recommended)**
1. In Blob storage, click **Upload**
2. Select your video files
3. Wait for upload
4. Copy the generated URLs

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Upload file
vercel blob upload demo-1.mp4 --token YOUR_TOKEN
```

---

### 3. Get Your Video URLs

After upload, each video gets a URL like:
```
https://xxxxxx.public.blob.vercel-storage.com/demo-1-xxxxx.mp4
https://xxxxxx.public.blob.vercel-storage.com/demo-2-xxxxx.mp4
https://xxxxxx.public.blob.vercel-storage.com/demo-3-xxxxx.mp4
```

---

### 4. Update Your Code

Open `components/DemoClassesSection.js` and replace the URLs:

**Before:**
```javascript
videoUrl: '/videos/demo-1.mp4',
thumbnail: '/thumbnails/demo-1.jpg',
```

**After:**
```javascript
videoUrl: 'https://xxxxxx.public.blob.vercel-storage.com/demo-1-xxxxx.mp4',
thumbnail: 'https://xxxxxx.public.blob.vercel-storage.com/thumb-1-xxxxx.jpg',
```

---

### 5. Example Update

```javascript
const demoClasses = [
  {
    id: 1,
    title: 'Why Pre incubation is important',
    instructor: 'Ravi Tilekar',
    videoUrl: 'https://YOUR-BLOB-URL.public.blob.vercel-storage.com/demo-1.mp4',
    thumbnail: 'https://YOUR-BLOB-URL.public.blob.vercel-storage.com/thumb-1.jpg',
    topics: ['Clarity', 'Mindset', 'Entrepreneurship'],
    views: '12.5K',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🚀'
  },
  // ... more videos
];
```

---

## 📊 Vercel Blob Free Tier

- **Storage:** 1 GB free
- **Bandwidth:** 100 GB/month free
- **Files:** Unlimited
- **Max file size:** 500 MB per file

**Estimated capacity:**
- 1 GB = ~3-5 videos (200-300 MB each)
- If videos are larger, compress them first

---

## 🎬 Video Compression (Optional)

If your videos are too large, compress them:

**Using HandBrake (Free):**
1. Download: https://handbrake.fr/
2. Open video file
3. Preset: **Fast 1080p30** or **Fast 720p30**
4. Format: **MP4**
5. Click **Start Encode**

**Using FFmpeg (Command line):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4
```

**Target sizes:**
- 5 min video: ~15-25 MB
- 30 min video: ~90-150 MB
- 60 min video: ~180-300 MB

---

## ✅ Complete Workflow

1. **Compress videos** (if needed)
2. **Upload to Vercel Blob** via dashboard
3. **Copy URLs** from Vercel
4. **Update** `DemoClassesSection.js` with new URLs
5. **Upload thumbnails** to Vercel Blob too
6. **Update** thumbnail URLs
7. **Commit and push** to GitHub
8. **Deploy** automatically on Vercel

---

## 🔗 Alternative: Use YouTube

If you prefer, you can also upload to YouTube (unlisted) and embed:

```javascript
videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
```

But Vercel Blob gives you more control and better performance.

---

## 📝 After Upload Checklist

- [ ] All videos uploaded to Vercel Blob
- [ ] All thumbnails uploaded to Vercel Blob
- [ ] URLs copied from Vercel dashboard
- [ ] `DemoClassesSection.js` updated with new URLs
- [ ] Tested video playback locally
- [ ] Committed and pushed to GitHub
- [ ] Verified on production site

---

## 🆘 Troubleshooting

**Video not playing?**
- Check URL is correct and public
- Verify file format is MP4
- Check browser console for errors

**Upload failed?**
- File too large (max 500 MB)
- Compress video first
- Try smaller chunks

**Exceeded free tier?**
- Delete old/unused files
- Compress videos more
- Consider YouTube for some videos

---

**Need help?** Check Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob
