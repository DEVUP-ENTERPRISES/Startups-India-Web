const { User } = require('../users/user.model');
const { Course, Module, Lesson } = require('../courses/course.model');
const { ModuleQuiz } = require('../courses/moduleQuiz.model');
const { Enrollment } = require('../enrollments/enrollment.model');
const { Payment } = require('../payments/payment.model');
const { Certificate } = require('../certificates/certificate.model');
const { Article } = require('../../models/Article');
const { ArticleView, ArticleLike, ArticleBookmark } = require('../../models/ArticleAnalytics');
const { Event } = require('../../models/Event');
const { EventRegistration } = require('../../models/EventRegistration');
const { Lead } = require('../../models/Lead');
const { Testimonial } = require('../../models/Testimonial');
const { Notification } = require('../../models/Notification');
const { Settings } = require('../../models/Settings');
const { ApiError } = require('../../utils/apiError');
const mediaService = require('../media/media.service');
const { Media } = require('../media/media.model');
const { cacheDel, cacheFlushPattern } = require('../../infrastructure/cache/redis');
const { extractS3Key } = require('../../utils/s3');

function normalizeAttachments(attachments = []) {
  if (!Array.isArray(attachments)) return [];

  return attachments
    .filter(Boolean)
    .map(item => ({
      label: item.label || item.originalName || item.fileName || 'Attachment',
      fileUrl: item.fileUrl || item.url || '',
      key: item.key || extractS3Key(item.fileUrl || item.url || ''),
      fileType: item.fileType || item.contentType || 'application/octet-stream',
      size: Number(item.size || 0),
    }))
    .filter(item => item.fileUrl && item.key);
}

function collectLessonMediaKeys(lesson) {
  if (!lesson) return [];

  const keys = [];
  const videoKey = lesson.videoKey || extractS3Key(lesson.videoUrl || '');
  if (videoKey) keys.push(videoKey);

  for (const attachment of normalizeAttachments(lesson.attachments || [])) {
    keys.push(attachment.key);
  }

  return [...new Set(keys)];
}

// ─── ANALYTICS ──────────────────────────────────────────────────
async function getDashboardAnalytics() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    recentUsers,
    recentPayments,
    usersByRole,
    enrollmentTrend,
    revenueTrend,
    totalCertificates,
    totalLeads,
    activeEvents,
    pendingTestimonials,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).select('fullName email role createdAt').lean(),
    Payment.find({ status: 'succeeded' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')
      .lean(),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Enrollment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]),
    Payment.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]),
    Certificate.countDocuments(),
    Lead.countDocuments(),
    Event.countDocuments({ status: { $in: ['upcoming', 'live'] } }),
    Testimonial.countDocuments({ status: 'pending' }),
  ]);

  return {
    overview: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCertificates,
      totalLeads,
      activeEvents,
      pendingTestimonials,
    },
    recentUsers,
    recentPayments,
    usersByRole: usersByRole.reduce((acc, r) => {
      acc[r._id || 'user'] = r.count;
      return acc;
    }, {}),
    enrollmentTrend: enrollmentTrend.reverse(),
    revenueTrend: revenueTrend.reverse(),
  };
}

// ─── USERS ──────────────────────────────────────────────────────
async function listUsers({ page = 1, limit = 20, search, role, sort = '-createdAt' }) {
  const query = {};
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-passwordHash -refreshTokenHash')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return { users, total, page, pages: Math.ceil(total / limit) };
}

async function getUser(id) {
  const user = await User.findById(id).select('-passwordHash -refreshTokenHash');
  if (!user) throw new ApiError(404, 'User not found');
  const enrollments = await Enrollment.find({ userId: id }).populate('courseId', 'title slug');
  const payments = await Payment.find({ userId: id }).sort({ createdAt: -1 }).limit(10);
  return { user, enrollments, payments };
}

async function updateUser(id, updates) {
  const allowed = ['fullName', 'role', 'isActive', 'avatarUrl'];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  const user = await User.findByIdAndUpdate(id, filtered, { new: true }).select(
    '-passwordHash -refreshTokenHash'
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  await Enrollment.deleteMany({ userId: id });
  return { deleted: true };
}

// ─── COURSES ────────────────────────────────────────────────────
async function listCourses({ page = 1, limit = 20, search, status, sort = '-createdAt' }) {
  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (status === 'published') query.isPublished = true;
  if (status === 'draft') query.isPublished = false;

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return { courses, total, page, pages: Math.ceil(total / limit) };
}

async function getCourse(id) {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  const enrollmentCount = await Enrollment.countDocuments({ courseId: id });
  const revenue = await Payment.aggregate([
    { $match: { courseId: course._id, status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return { course, enrollmentCount, revenue: revenue[0]?.total || 0 };
}

async function updateCourse(id, updates) {
  const existingCourse = await Course.findById(id).lean();
  if (!existingCourse) throw new ApiError(404, 'Course not found');

  const allowed = [
    'title',
    'slug',
    'subtitle',
    'description',
    'introCopy',
    'structureDescription',
    'durationWeeks',
    'totalModules',
    'category',
    'level',
    'thumbnailUrl',
    'thumbnailKey',
    'videoIntroUrl',
    'difficultyLevel',
    'language',
    'isPublished',
    'isFeatured',
    'enrollmentStatus',
    'priceInr',
    'originalPriceInr',
    'startDate',
    'endDate',
    'preStartMessage',
  ];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  // Check slug uniqueness if slug is being changed
  if (filtered.slug) {
    const existing = await Course.findOne({ slug: filtered.slug, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'A course with this slug already exists');
  }

  const course = await Course.findByIdAndUpdate(id, filtered, { new: true });

  if (existingCourse.thumbnailKey && existingCourse.thumbnailKey !== course.thumbnailKey) {
    await mediaService.deleteMediaByKey(null, existingCourse.thumbnailKey, {
      courseId: id,
      reason: 'course.thumbnail.replaced',
    });
  }

  // Invalidate course caches
  cacheDel('courses:all', `course:${id}`, `course:${course.slug}`, `course:${id}:modules`).catch(
    () => {}
  );
  return course;
}

async function createCourse(data) {
  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const existing = await Course.findOne({ slug });
  if (existing) throw new ApiError(409, 'A course with this slug already exists');

  const course = await Course.create({
    slug,
    title: data.title,
    subtitle: data.subtitle || '',
    description: data.description || '',
    introCopy: data.introCopy || '',
    durationWeeks: data.durationWeeks || 0,
    totalModules: data.totalModules || 0,
    category: data.category || '',
    level: data.level || '',
    thumbnailUrl: data.thumbnailUrl || '',
    thumbnailKey: data.thumbnailKey || '',
    videoIntroUrl: data.videoIntroUrl || '',
    difficultyLevel: data.difficultyLevel || 'beginner',
    language: data.language || 'English',
    isPublished: data.isPublished || false,
    enrollmentStatus: data.enrollmentStatus || 'open',
    priceInr: data.priceInr || 0,
    originalPriceInr: data.originalPriceInr || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    preStartMessage: data.preStartMessage || '',
  });
  // Invalidate course list cache
  cacheDel('courses:all').catch(() => {});
  return course;
}

async function deleteCourse(id) {
  const course = await Course.findById(id).lean();
  if (!course) throw new ApiError(404, 'Course not found');

  const modules = await Module.find({ courseId: id }).select('_id').lean();
  const moduleIds = modules.map(m => m._id);

  const lessons = moduleIds.length
    ? await Lesson.find({ moduleId: { $in: moduleIds } }).select('videoKey videoUrl attachments').lean()
    : [];

  const lessonMediaKeys = lessons.flatMap(collectLessonMediaKeys);
  const courseMediaKeys = await Media.find({ courseId: id }).select('key fileKey').lean();
  const keysToDelete = [
    course.thumbnailKey,
    ...lessonMediaKeys,
    ...courseMediaKeys.map(item => item.key || item.fileKey),
  ].filter(Boolean);

  if (keysToDelete.length > 0) {
    await mediaService.deleteMediaByKeys(null, keysToDelete, {
      courseId: id,
      reason: 'course.deleted',
    });
  }

  // Cascade: delete modules, lessons, quizzes, and enrollments for this course
  if (moduleIds.length > 0) {
    await Lesson.deleteMany({ moduleId: { $in: moduleIds } });
    await ModuleQuiz.deleteMany({ moduleId: { $in: moduleIds } });
  }
  await Module.deleteMany({ courseId: id });
  await Course.findByIdAndDelete(id);
  // Invalidate course caches
  cacheDel('courses:all', `course:${id}`, `course:${course.slug}`, `course:${id}:modules`).catch(
    () => {}
  );
  // Flush module-lesson caches for deleted modules
  for (const mId of moduleIds) {
    cacheDel(`module:${mId}:lessons`).catch(() => {});
  }
  return { deleted: true };
}

// ─── PAYMENTS ───────────────────────────────────────────────────
async function listPayments({ page = 1, limit = 20, status, sort = '-createdAt' }) {
  const query = {};
  if (status) query.status = status;

  const total = await Payment.countDocuments(query);
  const payments = await Payment.find(query)
    .populate('userId', 'fullName email')
    .populate('courseId', 'title')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return { payments, total, page, pages: Math.ceil(total / limit) };
}

async function refundPayment(id) {
  const payment = await Payment.findById(id);
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status === 'refunded') throw new ApiError(400, 'Already refunded');
  payment.status = 'refunded';
  await payment.save();
  return payment;
}

// ─── ENROLLMENTS ────────────────────────────────────────────────
async function listEnrollments({ page = 1, limit = 20, search, sort = '-createdAt' }) {
  const query = {};
  if (search) {
    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    query.userId = { $in: users.map(u => u._id) };
  }
  const total = await Enrollment.countDocuments(query);
  const enrollments = await Enrollment.find(query)
    .populate('userId', 'fullName email')
    .populate('courseId', 'title slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return { enrollments, total, page, pages: Math.ceil(total / limit) };
}

async function createEnrollment({ userId, courseId }) {
  const existing = await Enrollment.findOne({ userId, courseId });
  if (existing) throw new ApiError(409, 'User already enrolled');
  const enrollment = await Enrollment.create({ userId, courseId, paymentStatus: 'free' });
  // Increment enrolledCount on Course
  await Course.updateOne({ _id: courseId }, { $inc: { enrolledCount: 1 } });
  return enrollment;
}

// ─── CERTIFICATES ───────────────────────────────────────────────
async function listCertificates({ page = 1, limit = 20, sort = '-createdAt' }) {
  const total = await Certificate.countDocuments();
  const certificates = await Certificate.find()
    .populate('userId', 'fullName email')
    .populate('courseId', 'title')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return { certificates, total, page, pages: Math.ceil(total / limit) };
}

async function revokeCertificate(id) {
  const cert = await Certificate.findByIdAndUpdate(id, { isVerified: false }, { new: true });
  if (!cert) throw new ApiError(404, 'Certificate not found');
  return cert;
}

// ─── ARTICLES ───────────────────────────────────────────────────────
async function listArticles({ page = 1, limit = 20, status, category, search, sort = '-createdAt' }) {
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'author.name': { $regex: search, $options: 'i' } }
    ];
  }
  const total = await Article.countDocuments(query);
  const articles = await Article.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  return { articles, total, page, pages: Math.ceil(total / limit) };
}

async function getArticle(id) {
  const article = await Article.findById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  return article;
}

async function createArticle(data) {
  if (!data.slug && data.title) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Calculate reading time roughly if not provided
  if (!data.readTime && data.content) {
    const words = data.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    data.readTime = Math.ceil(words / 200); // 200 words per min
  }
  
  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  const article = await Article.create(data);
  return article;
}

async function updateArticle(id, updates) {
  if (updates.status === 'published' && !updates.publishedAt) {
    updates.publishedAt = new Date();
  }
  if (!updates.readTime && updates.content) {
    const words = updates.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    updates.readTime = Math.ceil(words / 200);
  }
  const article = await Article.findByIdAndUpdate(id, updates, { new: true });
  if (!article) throw new ApiError(404, 'Article not found');
  return article;
}

async function deleteArticle(id) {
  const article = await Article.findByIdAndDelete(id);
  if (!article) throw new ApiError(404, 'Article not found');
  
  // Clean up analytics
  await ArticleView.deleteMany({ articleId: id });
  await ArticleLike.deleteMany({ articleId: id });
  await ArticleBookmark.deleteMany({ articleId: id });

  return { deleted: true };
}

async function duplicateArticle(id) {
  const article = await Article.findById(id).lean();
  if (!article) throw new ApiError(404, 'Article not found');

  delete article._id;
  delete article.createdAt;
  delete article.updatedAt;
  article.title = `${article.title} (Copy)`;
  article.slug = `${article.slug}-copy-${Date.now()}`;
  article.status = 'draft';
  article.publishedAt = null;
  article.metrics = {
    viewsCount: 0,
    uniqueViews: 0,
    likesCount: 0,
    sharesCount: 0,
    savesCount: 0,
    avgReadTime: 0,
    dropOffRate: 0,
  };

  const newArticle = await Article.create(article);
  return newArticle;
}

async function getArticleAnalytics(id) {
  const article = await Article.findById(id).select('title metrics status publishedAt');
  if (!article) throw new ApiError(404, 'Article not found');

  const totalViews = await ArticleView.countDocuments({ articleId: id });
  const uniqueViews = (await ArticleView.distinct('ipAddress', { articleId: id })).length;
  const totalLikes = await ArticleLike.countDocuments({ articleId: id });
  const totalBookmarks = await ArticleBookmark.countDocuments({ articleId: id });

  return {
    article,
    stats: {
      totalViews,
      uniqueViews,
      totalLikes,
      totalBookmarks,
      ...article.metrics
    }
  };
}

// ─── EVENTS ─────────────────────────────────────────────────────
async function listEvents({ page = 1, limit = 20, status, sort = '-date' }) {
  const query = {};
  if (status) query.status = status;
  const total = await Event.countDocuments(query);
  const events = await Event.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  return { events, total, page, pages: Math.ceil(total / limit) };
}

async function createEvent(data) {
  return Event.create(data);
}

async function updateEvent(id, updates) {
  const event = await Event.findByIdAndUpdate(id, updates, { new: true });
  if (!event) throw new ApiError(404, 'Event not found');
  return event;
}

async function deleteEvent(id) {
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new ApiError(404, 'Event not found');
  return { deleted: true };
}

async function duplicateEvent(id, userId) {
  const event = await Event.findById(id).lean();
  if (!event) throw new ApiError(404, 'Event not found');

  const { _id, createdAt, updatedAt, ...eventData } = event;
  eventData.title = `${eventData.title} (Copy)`;
  eventData.status = 'upcoming';
  eventData.registrations = [];
  eventData.attendees = 0;
  eventData.createdBy = userId;

  const newEvent = await Event.create(eventData);
  return newEvent;
}

async function getEventRegistrations(id, { page = 1, limit = 20, search, status, paymentStatus, sort = '-createdAt' }) {
  const query = { event: id };
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) query.attendanceStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const total = await EventRegistration.countDocuments(query);
  const registrations = await EventRegistration.find(query)
    .populate('user', 'fullName email')
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return { registrations, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
}

async function getEventAnalytics(id) {
  const event = await Event.findById(id).select('maxAttendees');
  if (!event) throw new ApiError(404, 'Event not found');

  const registrations = await EventRegistration.find({ event: id });

  const totalRegistrations = registrations.length;
  const remainingSeats = event.maxAttendees > 0 ? Math.max(0, event.maxAttendees - totalRegistrations) : null;
  const attendanceRate = totalRegistrations > 0 ? (registrations.filter(r => r.attendanceStatus === 'Attended').length / totalRegistrations) * 100 : 0;
  const refundCount = registrations.filter(r => r.paymentStatus === 'Refunded').length;

  const paymentStats = registrations.reduce((acc, r) => {
    acc[r.paymentStatus] = (acc[r.paymentStatus] || 0) + 1;
    return acc;
  }, {});

  const attendanceStats = registrations.reduce((acc, r) => {
    acc[r.attendanceStatus] = (acc[r.attendanceStatus] || 0) + 1;
    return acc;
  }, {});

  return {
    totalRegistrations,
    remainingSeats,
    attendanceRate: attendanceRate.toFixed(1),
    refundCount,
    paymentStats,
    attendanceStats
  };
}

// ─── LEADS/CRM ──────────────────────────────────────────────────
async function listLeads({ page = 1, limit = 20, status, sort = '-createdAt' }) {
  const query = {};
  if (status) query.status = status;
  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .populate('assignedTo', 'fullName email')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  return { leads, total, page, pages: Math.ceil(total / limit) };
}

async function createLead(data) {
  return Lead.create(data);
}

async function updateLead(id, updates) {
  const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
  if (!lead) throw new ApiError(404, 'Lead not found');
  return lead;
}

async function deleteLead(id) {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  return { deleted: true };
}

// ─── TESTIMONIALS ───────────────────────────────────────────────
async function listTestimonials({ page = 1, limit = 20, status, sort = '-createdAt' }) {
  const query = {};
  if (status) query.status = status;
  const total = await Testimonial.countDocuments(query);
  const testimonials = await Testimonial.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  return { testimonials, total, page, pages: Math.ceil(total / limit) };
}

async function createTestimonial(data) {
  return Testimonial.create(data);
}

async function updateTestimonial(id, updates) {
  const t = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
  if (!t) throw new ApiError(404, 'Testimonial not found');
  return t;
}

async function deleteTestimonial(id) {
  const t = await Testimonial.findByIdAndDelete(id);
  if (!t) throw new ApiError(404, 'Testimonial not found');
  return { deleted: true };
}

// ─── NOTIFICATIONS ──────────────────────────────────────────────
async function listNotifications({ page = 1, limit = 20, sort = '-createdAt' }) {
  const total = await Notification.countDocuments();
  const notifications = await Notification.find()
    .populate('sentBy', 'fullName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  return { notifications, total, page, pages: Math.ceil(total / limit) };
}

async function createNotification(data) {
  return Notification.create(data);
}

async function deleteNotification(id) {
  const n = await Notification.findByIdAndDelete(id);
  if (!n) throw new ApiError(404, 'Notification not found');
  return { deleted: true };
}

// ─── SETTINGS ───────────────────────────────────────────────────
async function getSettings(category) {
  const query = category ? { category } : {};
  return Settings.find(query).sort({ key: 1 });
}

async function upsertSetting({ key, value, category, description, updatedBy }) {
  return Settings.findOneAndUpdate(
    { key },
    { value, category, description, updatedBy },
    { upsert: true, new: true }
  );
}

async function deleteSetting(key) {
  const s = await Settings.findOneAndDelete({ key });
  if (!s) throw new ApiError(404, 'Setting not found');
  return { deleted: true };
}

// ─── MONITORING ─────────────────────────────────────────────────
async function getMonitoringData() {
  const now = new Date();
  const day1 = new Date(now - 24 * 60 * 60 * 1000);
  const day7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const day30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const day90 = new Date(now - 90 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers24h,
    newUsers7d,
    newUsers30d,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    enrollments24h,
    enrollments7d,
    totalPayments,
    payments24h,
    revenue30d,
    totalCertificates,
    certs7d,
    totalLeads,
    newLeads7d,
    leadsByStatus,
    totalEvents,
    upcomingEvents,
    totalArticles,
    publishedPosts,
    totalNotifications,
    pendingTestimonials,
    approvedTestimonials,
    userGrowth,
    enrollmentGrowth,
    revenueGrowth,
    topCourses,
    usersByRole,
    paymentsByStatus,
    dailySignups,
    dailyEnrollments,
    dailyRevenue,
  ] = await Promise.all([
    // Users
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: day1 } }),
    User.countDocuments({ createdAt: { $gte: day7 } }),
    User.countDocuments({ createdAt: { $gte: day30 } }),
    // Courses
    Course.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    // Enrollments
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ createdAt: { $gte: day1 } }),
    Enrollment.countDocuments({ createdAt: { $gte: day7 } }),
    // Payments
    Payment.countDocuments(),
    Payment.countDocuments({ createdAt: { $gte: day1 } }),
    Payment.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: day30 } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    // Certificates
    Certificate.countDocuments(),
    Certificate.countDocuments({ createdAt: { $gte: day7 } }),
    // Leads
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: day7 } }),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    // Events
    Event.countDocuments(),
    Event.countDocuments({ status: { $in: ['upcoming', 'live'] } }),
    // Blog
    Article.countDocuments(),
    Article.countDocuments({ status: 'published' }),
    // Notifications
    Notification.countDocuments(),
    // Testimonials
    Testimonial.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ status: 'approved' }),
    // Growth — users per month (last 6 months)
    User.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Growth — enrollments per month (last 6 months)
    Enrollment.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Growth — revenue per month (last 6 months)
    Payment.aggregate([
      {
        $match: {
          status: 'succeeded',
          createdAt: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Top courses by enrollment
    Enrollment.aggregate([
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, count: 1, title: '$course.title' } },
    ]),
    // Users by role
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    // Payments by status
    Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } },
    ]),
    // Daily signups (last 30 days)
    User.aggregate([
      { $match: { createdAt: { $gte: day30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Daily enrollments (last 30 days)
    Enrollment.aggregate([
      { $match: { createdAt: { $gte: day30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Daily revenue (last 30 days)
    Payment.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: day30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Conversion rate (enrollments / users)
  const conversionRate = totalUsers > 0 ? ((totalEnrollments / totalUsers) * 100).toFixed(1) : 0;
  // Avg revenue per paying user
  const totalSucceededPayments = paymentsByStatus.find(p => p._id === 'succeeded');
  const avgRevenuePerUser =
    totalSucceededPayments && totalSucceededPayments.count > 0
      ? Math.round(totalSucceededPayments.total / totalSucceededPayments.count)
      : 0;

  return {
    snapshot: {
      totalUsers,
      newUsers24h,
      newUsers7d,
      newUsers30d,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      enrollments24h,
      enrollments7d,
      totalPayments,
      payments24h,
      revenue30d: revenue30d[0]?.total || 0,
      revenue30dCount: revenue30d[0]?.count || 0,
      totalCertificates,
      certs7d,
      totalLeads,
      newLeads7d,
      totalEvents,
      upcomingEvents,
      totalArticles,
      publishedPosts,
      totalNotifications,
      pendingTestimonials,
      approvedTestimonials,
      conversionRate: Number(conversionRate),
      avgRevenuePerUser,
    },
    distributions: {
      usersByRole: usersByRole.reduce((a, r) => {
        a[r._id || 'user'] = r.count;
        return a;
      }, {}),
      paymentsByStatus: paymentsByStatus.reduce((a, p) => {
        a[p._id || 'unknown'] = { count: p.count, total: p.total };
        return a;
      }, {}),
      leadsByStatus: leadsByStatus.reduce((a, l) => {
        a[l._id || 'new'] = l.count;
        return a;
      }, {}),
    },
    trends: {
      userGrowth,
      enrollmentGrowth,
      revenueGrowth,
      dailySignups,
      dailyEnrollments,
      dailyRevenue,
    },
    topCourses,
    serverTime: now.toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
  };
}

// ─── MODULE CRUD ────────────────────────────────────────────────
async function listModules(courseId) {
  return Module.find({ courseId }).sort({ sortOrder: 1 }).lean();
}

async function createModule(data) {
  const course = await Course.findById(data.courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const maxOrder = await Module.findOne({ courseId: data.courseId })
    .sort({ sortOrder: -1 })
    .select('sortOrder')
    .lean();

  const mod = await Module.create({
    courseId: data.courseId,
    moduleNumber: data.moduleNumber || (maxOrder ? maxOrder.sortOrder + 1 : 1),
    weekNumber: data.weekNumber || (maxOrder ? maxOrder.sortOrder + 1 : 1),
    title: data.title,
    description: data.description || '',
    whatYouLearn: data.whatYouLearn || [],
    keyActivities: data.keyActivities || [],
    deliverable: data.deliverable || '',
    deliverableDescription: data.deliverableDescription || '',
    durationHours: data.durationHours || 0,
    isLocked: data.isLocked || false,
    unlockAfterDays: data.unlockAfterDays || 0,
    sortOrder: data.sortOrder != null ? data.sortOrder : maxOrder ? maxOrder.sortOrder + 1 : 1,
  });
  cacheDel(`course:${data.courseId}:modules`).catch(() => {});
  return mod;
}

async function updateModule(id, updates) {
  const allowed = [
    'title',
    'description',
    'weekNumber',
    'moduleNumber',
    'whatYouLearn',
    'keyActivities',
    'deliverable',
    'deliverableDescription',
    'durationHours',
    'isLocked',
    'unlockAfterDays',
    'sortOrder',
  ];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  const mod = await Module.findByIdAndUpdate(id, filtered, { new: true });
  if (!mod) throw new ApiError(404, 'Module not found');
  cacheDel(`course:${mod.courseId}:modules`).catch(() => {});
  return mod;
}

async function deleteModule(id) {
  const mod = await Module.findById(id).lean();
  if (!mod) throw new ApiError(404, 'Module not found');

  const lessons = await Lesson.find({ moduleId: id }).select('videoKey videoUrl attachments').lean();
  const mediaKeys = lessons.flatMap(collectLessonMediaKeys);
  if (mediaKeys.length > 0) {
    await mediaService.deleteMediaByKeys(null, mediaKeys, {
      courseId: mod.courseId,
      moduleId: id,
      reason: 'module.deleted',
    });
  }

  // Delete associated lessons and quiz
  await Lesson.deleteMany({ moduleId: id });
  await ModuleQuiz.deleteMany({ moduleId: id });
  await Module.findByIdAndDelete(id);
  cacheDel(`course:${mod.courseId}:modules`, `module:${id}:lessons`).catch(() => {});
  return { deleted: true };
}

async function reorderModules(courseId, orderedIds) {
  const ops = orderedIds.map((id, index) =>
    Module.updateOne({ _id: id, courseId }, { $set: { sortOrder: index + 1 } })
  );
  await Promise.all(ops);
  return Module.find({ courseId }).sort({ sortOrder: 1 }).lean();
}

// ─── LESSON CRUD ────────────────────────────────────────────────
async function listLessons(moduleId) {
  return Lesson.find({ moduleId }).sort({ sortOrder: 1 }).lean();
}

async function createLesson(data) {
  const mod = await Module.findById(data.moduleId);
  if (!mod) throw new ApiError(404, 'Module not found');

  const maxOrder = await Lesson.findOne({ moduleId: data.moduleId })
    .sort({ sortOrder: -1 })
    .select('sortOrder')
    .lean();

  const lesson = await Lesson.create({
    moduleId: data.moduleId,
    lessonNumber: data.lessonNumber || (maxOrder ? maxOrder.sortOrder + 1 : 1),
    title: data.title,
    description: data.description || '',
    contentType: data.contentType || 'video',
    videoUrl: data.videoUrl || '',
    videoKey: data.videoKey || '',
    videoDurationSeconds: data.videoDurationSeconds || 0,
    readingContent: data.readingContent || '',
    readingTimeMinutes: data.readingTimeMinutes || 0,
    attachments: normalizeAttachments(data.attachments || []),
    isPreview: data.isPreview || false,
    isMandatory: data.isMandatory !== false,
    durationMinutes: data.durationMinutes || 0,
    sortOrder: data.sortOrder != null ? data.sortOrder : maxOrder ? maxOrder.sortOrder + 1 : 1,
  });
  cacheDel(`module:${data.moduleId}:lessons`).catch(() => {});
  return lesson;
}

async function updateLesson(id, updates) {
  const existingLesson = await Lesson.findById(id).lean();
  if (!existingLesson) throw new ApiError(404, 'Lesson not found');

  const allowed = [
    'title',
    'description',
    'contentType',
    'videoUrl',
    'videoKey',
    'videoDurationSeconds',
    'readingContent',
    'readingTimeMinutes',
    'attachments',
    'isPreview',
    'isMandatory',
    'durationMinutes',
    'sortOrder',
    'lessonNumber',
  ];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  if (filtered.attachments !== undefined) {
    filtered.attachments = normalizeAttachments(filtered.attachments);
  }

  const lesson = await Lesson.findByIdAndUpdate(id, filtered, { new: true });

  const previousKeys = collectLessonMediaKeys(existingLesson);
  const nextKeys = collectLessonMediaKeys(lesson);
  const removedKeys = previousKeys.filter(key => !nextKeys.includes(key));

  if (removedKeys.length > 0) {
    const mod = await Module.findById(lesson.moduleId).select('courseId').lean();
    await mediaService.deleteMediaByKeys(null, removedKeys, {
      courseId: mod?.courseId || null,
      moduleId: lesson.moduleId,
      reason: 'lesson.media.replaced',
    });
  }

  cacheDel(`module:${lesson.moduleId}:lessons`).catch(() => {});
  return lesson;
}

async function deleteLesson(id) {
  const lesson = await Lesson.findById(id).lean();
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  const mediaKeys = collectLessonMediaKeys(lesson);
  if (mediaKeys.length > 0) {
    const mod = await Module.findById(lesson.moduleId).select('courseId').lean();
    await mediaService.deleteMediaByKeys(null, mediaKeys, {
      courseId: mod?.courseId || null,
      moduleId: lesson.moduleId,
      reason: 'lesson.deleted',
    });
  }

  await Lesson.findByIdAndDelete(id);
  cacheDel(`module:${lesson.moduleId}:lessons`).catch(() => {});
  return { deleted: true };
}

// ─── QUIZ CRUD ──────────────────────────────────────────────────
async function getModuleQuiz(moduleId) {
  return ModuleQuiz.findOne({ moduleId }).lean();
}

async function upsertModuleQuiz(data) {
  const mod = await Module.findById(data.moduleId);
  if (!mod) throw new ApiError(404, 'Module not found');

  return ModuleQuiz.findOneAndUpdate(
    { moduleId: data.moduleId },
    {
      $set: {
        courseId: mod.courseId,
        title: data.title || 'Module Quiz',
        questions: data.questions || [],
        passingScore: data.passingScore || 70,
        isActive: data.isActive !== false,
      },
    },
    { upsert: true, new: true }
  );
}

async function deleteModuleQuiz(moduleId) {
  const quiz = await ModuleQuiz.findOneAndDelete({ moduleId });
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  return { deleted: true };
}

// ─── S3 UPLOAD URL ──────────────────────────────────────────────
async function getUploadUrl(data, userId = null) {
  // Admin endpoint can create upload URL for any instructor/admin
  return mediaService.requestUploadUrl(userId, data);
}

module.exports = {
  getDashboardAnalytics,
  getMonitoringData,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  // Module CRUD
  listModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  // Lesson CRUD
  listLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  // Quiz CRUD
  getModuleQuiz,
  upsertModuleQuiz,
  deleteModuleQuiz,
  // S3 Upload
  getUploadUrl,
  listPayments,
  refundPayment,
  listEnrollments,
  createEnrollment,
  listCertificates,
  revokeCertificate,
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  duplicateArticle,
  getArticleAnalytics,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  duplicateEvent,
  getEventRegistrations,
  getEventAnalytics,
  listLeads,
  createLead,
  updateLead,
  deleteLead,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  listNotifications,
  createNotification,
  deleteNotification,
  getSettings,
  upsertSetting,
  deleteSetting,
};
