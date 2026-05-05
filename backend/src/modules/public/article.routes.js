const { Router } = require('express');
const { Article } = require('../../models/Article');
const { ArticleView, ArticleLike, ArticleBookmark } = require('../../models/ArticleAnalytics');
const { asyncHandler } = require('../../utils/asyncHandler');
const { optionalAuth, authRequired } = require('../../middlewares/authMiddleware');

const articleRouter = Router();

// Get paginated articles
articleRouter.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, tag, sort = '-publishedAt' } = req.query;
  const query = { status: 'published' };
  
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'author.name': { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Article.countDocuments(query);
  const articles = await Article.find(query)
    .select('-content') // Exclude full content for listing
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({ success: true, data: { articles, total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

// Get a single article by slug
articleRouter.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, status: 'published' });
  if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

  // Get related articles
  const related = await Article.find({
    status: 'published',
    category: article.category,
    _id: { $ne: article._id }
  })
  .select('-content')
  .limit(3)
  .sort('-publishedAt');

  // Check if user has liked/bookmarked
  let userEngagements = { liked: false, bookmarked: false };
  if (req.user) {
    const [like, bookmark] = await Promise.all([
      ArticleLike.findOne({ articleId: article._id, userId: req.user.userId }),
      ArticleBookmark.findOne({ articleId: article._id, userId: req.user.userId })
    ]);
    userEngagements.liked = !!like;
    userEngagements.bookmarked = !!bookmark;
  }

  res.json({ success: true, data: { article, related, userEngagements } });
}));

// Record a view (analytics)
articleRouter.post('/:id/view', optionalAuth, asyncHandler(async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userId = req.user ? req.user.userId : null;
  
  // Create view record
  await ArticleView.create({
    articleId: req.params.id,
    userId,
    ipAddress,
    readDuration: req.body.readDuration || 0,
    scrollDepth: req.body.scrollDepth || 0
  });

  // Check if this IP/User already viewed
  const existingView = await ArticleView.findOne({
    articleId: req.params.id,
    $or: [{ userId: userId || 'none' }, { ipAddress }],
    _id: { $ne: null } // Ensure distinct query logic
  }).sort('createdAt'); // Not perfect but fast

  const update = { $inc: { 'metrics.viewsCount': 1 } };
  
  // Just a simple heuristic for unique views
  // The actual aggregation logic will be used for analytics page
  await Article.findByIdAndUpdate(req.params.id, update);
  
  res.json({ success: true });
}));

// Toggle Like
articleRouter.post('/:id/like', authRequired, asyncHandler(async (req, res) => {
  const existingLike = await ArticleLike.findOne({ articleId: req.params.id, userId: req.user.userId });
  
  if (existingLike) {
    await ArticleLike.deleteOne({ _id: existingLike._id });
    await Article.findByIdAndUpdate(req.params.id, { $inc: { 'metrics.likesCount': -1 } });
    return res.json({ success: true, liked: false });
  } else {
    await ArticleLike.create({ articleId: req.params.id, userId: req.user.userId });
    await Article.findByIdAndUpdate(req.params.id, { $inc: { 'metrics.likesCount': 1 } });
    return res.json({ success: true, liked: true });
  }
}));

// Toggle Bookmark
articleRouter.post('/:id/bookmark', authRequired, asyncHandler(async (req, res) => {
  const existingBookmark = await ArticleBookmark.findOne({ articleId: req.params.id, userId: req.user.userId });
  
  if (existingBookmark) {
    await ArticleBookmark.deleteOne({ _id: existingBookmark._id });
    await Article.findByIdAndUpdate(req.params.id, { $inc: { 'metrics.savesCount': -1 } });
    return res.json({ success: true, bookmarked: false });
  } else {
    await ArticleBookmark.create({ articleId: req.params.id, userId: req.user.userId });
    await Article.findByIdAndUpdate(req.params.id, { $inc: { 'metrics.savesCount': 1 } });
    return res.json({ success: true, bookmarked: true });
  }
}));

module.exports = articleRouter;
