const mongoose = require('mongoose');

const articleViewSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Optional if logged in
    ipAddress: { type: String }, // Used to calculate unique views for non-logged-in
    sessionId: { type: String },
    readDuration: { type: Number, default: 0 }, // Time spent on page in seconds
    scrollDepth: { type: Number, default: 0 }, // Percentage of page scrolled (0-100)
    source: { type: String, default: 'direct' }, // Referral source
  },
  { timestamps: true }
);

const articleLikeSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Likes require login
  },
  { timestamps: true }
);
// Ensure a user can only like an article once
articleLikeSchema.index({ articleId: 1, userId: 1 }, { unique: true });

const articleBookmarkSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Saves require login
  },
  { timestamps: true }
);
// Ensure a user can only save an article once
articleBookmarkSchema.index({ articleId: 1, userId: 1 }, { unique: true });

const ArticleView = mongoose.model('ArticleView', articleViewSchema);
const ArticleLike = mongoose.model('ArticleLike', articleLikeSchema);
const ArticleBookmark = mongoose.model('ArticleBookmark', articleBookmarkSchema);

module.exports = { ArticleView, ArticleLike, ArticleBookmark };
