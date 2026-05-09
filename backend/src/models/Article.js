const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },

    // Embedded Author Details
    author: {
      name: { type: String, required: true, trim: true },
      role: { type: String, trim: true },
      company: { type: String, trim: true },
      profileImage: { type: String, default: '' },
      linkedinUrl: { type: String, trim: true },
      bio: { type: String, trim: true },
    },

    // Article Content
    content: { type: String, required: true }, // Rich HTML from Tiptap
    keyPoints: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    thumbnailImage: { type: String, default: '' },
    galleryImages: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },

    // Categorization
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },

    // SEO
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: { type: [String], default: [] },
      ogImage: { type: String, default: '' },
    },

    // Publishing
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'unpublished'],
      default: 'draft',
    },
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },

    // Reading Settings
    readTime: { type: Number, default: 5 }, // in minutes
    isFeatured: { type: Boolean, default: false },
    visibility: {
      type: String,
      enum: ['public', 'members', 'admin'],
      default: 'public',
    },

    // Analytics Aggregates (Updated via worker or pre-save hooks/APIs)
    metrics: {
      viewsCount: { type: Number, default: 0 },
      uniqueViews: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 },
      sharesCount: { type: Number, default: 0 },
      savesCount: { type: Number, default: 0 },
      avgReadTime: { type: Number, default: 0 },
      dropOffRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for faster querying on public listing
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ 'metrics.viewsCount': -1 });
articleSchema.index({ isFeatured: 1 });

const Article = mongoose.model('Article', articleSchema);
module.exports = { Article };
