const crypto = require('crypto');
const mongoose = require('mongoose');
const { Channel, Post, Comment, Group, GroupMember, Question, Answer } = require('./community.model');
const { cacheGet, cacheSet, cacheDel } = require('../../infrastructure/cache/redis');
const { broadcast } = require('./community.sse');
const { ApiError } = require('../../utils/apiError');
const { generateUploadUrl, buildS3FileUrl } = require('../../utils/s3');
const { logger } = require('../../infrastructure/observability/logger');

const CHANNEL_CACHE_KEY = 'community:channels';
const CHANNEL_CACHE_TTL = 300; // 5 min
const PAGE_SIZE = 20;

const DEFAULT_SEEDED_CHANNELS = [
  {
    name: 'Main Feed',
    slug: 'main',
    description: 'All discussions from across the community',
    icon: 'feed',
    type: 'open',
    targetAudience: 'all',
    order: 1,
  },
  {
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official announcements and updates from the team',
    icon: 'bell',
    type: 'announce',
    targetAudience: 'all',
    order: 2,
  },
  {
    name: 'Incubation',
    slug: 'incubation',
    description: 'Cohort news, application updates, and incubation discussions',
    icon: 'star',
    type: 'open',
    targetAudience: 'all',
    order: 3,
  },
  {
    name: 'Tech Stack',
    slug: 'tech-stack',
    description: 'Architecture, dev tools, cloud, and engineering practices',
    icon: 'code',
    type: 'open',
    targetAudience: 'all',
    order: 4,
  },
  {
    name: 'Growth',
    slug: 'growth',
    description: 'Customer acquisition, GTM strategies, and growth hacks',
    icon: 'trending',
    type: 'open',
    targetAudience: 'all',
    order: 5,
  },
  {
    name: 'Funding & Investors',
    slug: 'funding',
    description: 'Pitch decks, fundraising, VC insights, and investor connections',
    icon: 'dollar',
    type: 'open',
    targetAudience: 'all',
    order: 6,
  },
  {
    name: 'Hiring & Team',
    slug: 'hiring',
    description: 'Job openings, co-founder search, and team building',
    icon: 'users',
    type: 'open',
    targetAudience: 'all',
    order: 7,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function isAudienceAllowed(targetAudience, userRole) {
  if (!targetAudience || targetAudience === 'all') return true;
  if (userRole === 'admin') return true;
  if (targetAudience === 'founders' && (userRole === 'founder' || userRole === 'cofounder' || userRole === 'startup')) return true;
  if (targetAudience === 'students' && (userRole === 'student' || userRole === 'user')) return true;
  if (targetAudience === 'investors' && userRole === 'investor') return true;
  if (targetAudience === 'mentors' && userRole === 'mentor') return true;
  return false;
}

function userCanPost(channel, userRole) {
  if (userRole === 'admin') return true;
  if (channel.type === 'announce') return false;
  if (channel.type === 'restricted') {
    return userRole === 'founder' || userRole === 'cofounder' || userRole === 'startup';
  }
  return true; // open
}

// Ensure default channels exist in database
async function ensureSeededChannels() {
  let seeded = false;
  for (const ch of DEFAULT_SEEDED_CHANNELS) {
    const exists = await Channel.findOne({ slug: ch.slug });
    if (!exists) {
      await Channel.create({ ...ch, isActive: true });
      seeded = true;
    } else if (!exists.isActive) {
      exists.isActive = true;
      await exists.save();
      seeded = true;
    }
  }
  if (seeded) {
    await cacheDel(CHANNEL_CACHE_KEY);
  }
}

// Find channel by ID or slug
async function resolveChannel(channelIdentifier) {
  await ensureSeededChannels();
  if (!channelIdentifier) {
    return null;
  }
  if (mongoose.isValidObjectId(channelIdentifier)) {
    return Channel.findOne({ _id: channelIdentifier, isActive: true });
  }
  return Channel.findOne({ slug: String(channelIdentifier).toLowerCase(), isActive: true });
}

const AUTHOR_SELECT = 'fullName avatarUrl role company';

// ─── Channels API ────────────────────────────────────────────────────────────
async function listChannels(userRole = 'student') {
  await ensureSeededChannels();
  
  let channels;
  const cached = await cacheGet(CHANNEL_CACHE_KEY);
  if (cached) {
    channels = cached;
  } else {
    channels = await Channel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    await cacheSet(CHANNEL_CACHE_KEY, channels, CHANNEL_CACHE_TTL);
  }

  // Filter channels based on target audience for user's role
  return channels.filter(ch => isAudienceAllowed(ch.targetAudience, userRole));
}

async function createChannel(data, adminUserId) {
  const slug = slugify(data.name);
  const existing = await Channel.findOne({ slug });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      existing.name = data.name.trim();
      existing.description = data.description || '';
      existing.type = data.type || 'open';
      existing.targetAudience = data.targetAudience || 'all';
      existing.order = data.order ?? 99;
      await existing.save();
      await cacheDel(CHANNEL_CACHE_KEY);
      broadcast('*', 'channel_update', { action: 'updated', channel: existing });
      return existing;
    }
    throw new ApiError(409, 'A channel with this name already exists');
  }

  const highestOrderCh = await Channel.findOne().sort({ order: -1 }).lean();
  const nextOrder = (highestOrderCh?.order || 0) + 1;

  const channel = await Channel.create({
    name: data.name.trim(),
    slug,
    description: data.description || '',
    icon: data.icon || 'message-circle',
    type: data.type || 'open',
    targetAudience: data.targetAudience || 'all',
    order: data.order !== undefined && data.order !== null ? Number(data.order) : nextOrder,
    createdBy: adminUserId,
  });

  await cacheDel(CHANNEL_CACHE_KEY);
  broadcast('*', 'channel_update', { action: 'created', channel });
  return channel;
}

async function updateChannel(channelId, data) {
  if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, 'Invalid channel id');

  const update = {};
  if (data.name) {
    update.name = data.name.trim();
    update.slug = slugify(data.name);
  }
  if (data.description !== undefined) update.description = data.description;
  if (data.icon) update.icon = data.icon;
  if (data.type) update.type = data.type;
  if (data.targetAudience) update.targetAudience = data.targetAudience;
  if (data.order !== undefined && data.order !== null) update.order = Number(data.order);
  if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);

  const channel = await Channel.findByIdAndUpdate(channelId, { $set: update }, { new: true });
  if (!channel) throw new ApiError(404, 'Channel not found');

  await cacheDel(CHANNEL_CACHE_KEY);
  broadcast('*', 'channel_update', { action: 'updated', channel });
  return channel;
}

async function deleteChannel(channelId) {
  if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, 'Invalid channel id');
  const channel = await Channel.findByIdAndUpdate(channelId, { isActive: false }, { new: true });
  if (!channel) throw new ApiError(404, 'Channel not found');
  await cacheDel(CHANNEL_CACHE_KEY);
  broadcast('*', 'channel_update', { action: 'deleted', channelId });
  return { deleted: true };
}

// ─── Posts API ───────────────────────────────────────────────────────────────
async function listPosts({ channelId, userRole = 'student', cursor, limit = PAGE_SIZE }) {
  await ensureSeededChannels();
  const query = { isDeleted: false };

  logger.info('listPosts parameters', { channelId, userRole });

  if (channelId) {
    const channel = await resolveChannel(channelId);
    logger.info('listPosts resolved channel', { channelId, resolved: channel ? { _id: channel._id, slug: channel.slug } : null });
    if (channel) {
      if (!isAudienceAllowed(channel.targetAudience, userRole)) {
        throw new ApiError(403, 'Access denied to this channel');
      }
      query.channelId = channel._id;
    } else {
      return { posts: [], nextCursor: null };
    }
  }

  if (cursor) {
    if (mongoose.isValidObjectId(cursor)) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }
  }

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(Math.min(Number(limit), 50))
    .populate('authorId', AUTHOR_SELECT)
    .populate('channelId', 'name slug type targetAudience')
    .lean();

  const nextCursor = posts.length === limit ? String(posts[posts.length - 1]._id) : null;
  return { posts, nextCursor };
}

async function createPost({ channelId, authorId, userRole, body, imageKey, imageUrl, poll }) {
  await ensureSeededChannels();
  
  let targetChannel = null;
  if (!channelId || channelId === 'main' || channelId === 'all') {
    targetChannel = await Channel.findOne({ slug: 'main', isActive: true });
    if (!targetChannel) {
      targetChannel = await Channel.create({
        name: 'Main Feed',
        slug: 'main',
        description: 'All discussions from across the community',
        icon: 'feed',
        type: 'open',
        targetAudience: 'all',
        order: 1,
        isActive: true,
      });
    }
  } else {
    targetChannel = await resolveChannel(channelId);
    if (!targetChannel) {
      throw new ApiError(404, 'Specified channel was not found');
    }
  }

  if (!isAudienceAllowed(targetChannel.targetAudience, userRole)) {
    throw new ApiError(403, 'You do not have access to view or post in this channel');
  }

  if (!userCanPost(targetChannel, userRole)) {
    throw new ApiError(403, 'You do not have permission to post in this channel');
  }

  if (!body?.trim() && !imageKey && !poll?.question) {
    throw new ApiError(400, 'Post must contain text, an image, or a poll');
  }

  const pollData = poll?.question
    ? {
        question: poll.question,
        options: (poll.options || []).map(label => ({ label, votes: 0, voterIds: [] })),
      }
    : undefined;

  const post = await Post.create({
    channelId: targetChannel._id,
    authorId,
    body: body?.trim() || '',
    imageKey: imageKey || null,
    imageUrl: imageUrl || null,
    poll: pollData,
  });

  // Increment channel post count asynchronously
  Channel.findByIdAndUpdate(targetChannel._id, { $inc: { postCount: 1 } }).catch(() => {});

  const populated = await Post.findById(post._id)
    .populate('authorId', AUTHOR_SELECT)
    .populate('channelId', 'name slug type targetAudience')
    .lean();

  broadcast(String(targetChannel._id), 'new_post', populated);
  broadcast('main', 'new_post', populated);
  return populated;
}

async function deletePost(postId, userId, userRole) {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post || post.isDeleted) throw new ApiError(404, 'Post not found');
  if (String(post.authorId) !== String(userId) && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorised');
  }
  post.isDeleted = true;
  await post.save();
  broadcast(String(post.channelId), 'delete_post', { postId });
  return { deleted: true };
}

// ─── Likes API ───────────────────────────────────────────────────────────────
async function toggleLike(postId, userId) {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post || post.isDeleted) throw new ApiError(404, 'Post not found');

  const oid = new mongoose.Types.ObjectId(userId);
  const hasLiked = post.likerIds.some(id => id.equals(oid));

  if (hasLiked) {
    post.likerIds.pull(oid);
    post.likeCount = Math.max(0, post.likeCount - 1);
  } else {
    post.likerIds.push(oid);
    post.likeCount += 1;
  }
  await post.save();

  broadcast(String(post.channelId), 'like', {
    postId,
    likeCount: post.likeCount,
    liked: !hasLiked,
    userId: String(userId),
  });

  return { liked: !hasLiked, likeCount: post.likeCount };
}

// ─── Comments API ────────────────────────────────────────────────────────────
async function listComments(postId) {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, 'Invalid post id');
  return Comment.find({ postId, isDeleted: false })
    .sort({ createdAt: 1 })
    .populate('authorId', AUTHOR_SELECT)
    .lean();
}

async function addComment({ postId, authorId, body }) {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, 'Invalid post id');
  if (!body?.trim()) throw new ApiError(400, 'Comment body is required');

  const post = await Post.findById(postId);
  if (!post || post.isDeleted) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({ postId, authorId, body: body.trim() });
  post.commentCount += 1;
  await post.save();

  const populated = await Comment.findById(comment._id)
    .populate('authorId', AUTHOR_SELECT)
    .lean();

  broadcast(String(post.channelId), 'new_comment', { postId, comment: populated });
  return populated;
}

// ─── Poll Voting API ─────────────────────────────────────────────────────────
async function votePoll(postId, optionId, userId) {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post || post.isDeleted || !post.poll?.question) throw new ApiError(404, 'Post or poll not found');

  const hasVoted = post.poll.options.some(o => o.voterIds.some(v => String(v) === String(userId)));
  if (hasVoted) throw new ApiError(409, 'Already voted');

  const option = post.poll.options.id(optionId);
  if (!option) throw new ApiError(404, 'Poll option not found');

  option.votes += 1;
  option.voterIds.push(userId);
  await post.save();

  broadcast(String(post.channelId), 'poll_vote', {
    postId,
    optionId,
    options: post.poll.options.map(o => ({ _id: o._id, votes: o.votes, label: o.label })),
  });

  return { options: post.poll.options.map(o => ({ _id: o._id, label: o.label, votes: o.votes })) };
}

// ─── Image Upload (S3 Presigned URL) ─────────────────────────────────────────
async function getImageUploadUrl({ fileName, fileType, fileSize }) {
  const MB = 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(fileType)) throw new ApiError(400, 'Unsupported image type');
  if (!fileSize || fileSize > 10 * MB) throw new ApiError(413, 'Image must be under 10 MB');

  const ext = fileName.split('.').pop().replace(/[^a-z0-9]/gi, '').toLowerCase();
  const key = `community/images/${crypto.randomUUID()}.${ext}`;

  const { uploadUrl } = await generateUploadUrl({ key, contentType: fileType, expiresIn: 300 });
  const publicUrl = buildS3FileUrl(key);

  return { uploadUrl, key, publicUrl };
}

// ─── Q&A Hub Service ────────────────────────────────────────────────────────
async function getQuestions(query = {}) {
  const filter = {};
  if (query.status === 'solved') filter.acceptedAnswerId = { $ne: null };
  if (query.status === 'unanswered') filter.acceptedAnswerId = null;

  return Question.find(filter)
    .populate('authorId', AUTHOR_SELECT)
    .populate('acceptedAnswerId')
    .sort({ createdAt: -1 });
}

async function createQuestion(data) {
  return Question.create(data);
}

async function getQuestionDetails(id) {
  const question = await Question.findById(id).populate('authorId', AUTHOR_SELECT);
  const answers = await Answer.find({ questionId: id }).populate('authorId', AUTHOR_SELECT).sort({ votes: -1 });
  return { ...question._doc, answers };
}

async function voteQuestion(questionId, userId) {
  if (!mongoose.isValidObjectId(questionId)) throw new ApiError(400, 'Invalid question id');
  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, 'Question not found');

  if (!question.voterIds) question.voterIds = [];

  const oid = new mongoose.Types.ObjectId(userId);
  const hasVoted = question.voterIds.some(id => id.equals(oid));

  if (hasVoted) {
    question.voterIds.pull(oid);
    question.votes = Math.max(0, (question.votes || 0) - 1);
  } else {
    question.voterIds.push(oid);
    question.votes = (question.votes || 0) + 1;
  }

  await question.save();
  return question;
}

async function submitAnswer(data, userRole = 'student') {
  if (userRole !== 'admin' && userRole !== 'mentor' && userRole !== 'expert') {
    throw new ApiError(403, 'Only mentors and admins can answer questions');
  }

  const answer = await Answer.create(data);
  broadcast(`question_${data.questionId}`, 'new_answer', answer);
  return answer;
}

async function acceptAnswer(answerId, questionId, userId) {
  const question = await Question.findOne({ _id: questionId, authorId: userId });
  if (!question) throw new ApiError(403, 'Unauthorized or question not found');
  await Answer.updateMany({ questionId }, { isAccepted: false });
  const answer = await Answer.findByIdAndUpdate(answerId, { isAccepted: true }, { new: true });
  await Question.findByIdAndUpdate(questionId, { acceptedAnswerId: answerId });
  return answer;
}

// ─── WhatsApp Groups Service ──────────────────────────────────────────────────
async function ensureSeededGroups() {
  const { Group } = require('./community.model');
  const dummyNames = ['SaaS Pioneers', 'FinTech Mavericks', 'DeepTech Council', 'Growth Alchemists', 'Official Announcements'];
  await Group.deleteMany({ name: { $in: dummyNames } });

  const hasMain = await Group.findOne({ name: 'Main Community Group' });
  if (!hasMain) {
    await Group.create({
      name: 'Main Community Group',
      description: 'Official WhatsApp-style chat group for all Startups India members.',
      privacy: 'public',
    });
  }
}

async function getGroups() {
  await ensureSeededGroups();
  return Group.find().sort({ createdAt: -1 });
}

async function createGroup(data, creatorId) {
  const group = await Group.create({ ...data, creatorId });
  await GroupMember.create({ groupId: group._id, userId: creatorId, role: 'admin' });
  return group;
}

async function joinGroup(groupId, userId) {
  return GroupMember.create({ groupId, userId });
}

async function getJoinedGroups(userId) {
  const memberships = await GroupMember.find({ userId, status: 'active' }).populate('groupId');
  return memberships.map(m => m.groupId);
}

async function getGroupMessages(groupId) {
  if (!mongoose.isValidObjectId(groupId)) throw new ApiError(400, 'Invalid group id');
  const { GroupMessage } = require('./community.model');
  return GroupMessage.find({ groupId })
    .sort({ createdAt: 1 })
    .populate('authorId', AUTHOR_SELECT)
    .lean();
}

async function sendGroupMessage({ groupId, authorId, userRole, content }) {
  if (!mongoose.isValidObjectId(groupId)) throw new ApiError(400, 'Invalid group id');
  if (!content?.trim()) throw new ApiError(400, 'Content is required');

  const group = await Group.findById(groupId);
  if (!group) throw new ApiError(404, 'Group not found');

  if (group.privacy === 'admin-only' && userRole !== 'admin') {
    throw new ApiError(403, 'Only admins can send messages in this group');
  }

  const { GroupMessage } = require('./community.model');
  const msg = await GroupMessage.create({
    groupId,
    authorId,
    content: content.trim(),
  });

  const populated = await GroupMessage.findById(msg._id).populate('authorId', AUTHOR_SELECT).lean();
  broadcast(`group_${groupId}`, 'new_group_message', populated);
  return populated;
}

async function deleteGroup(groupId) {
  if (!mongoose.isValidObjectId(groupId)) throw new ApiError(400, 'Invalid group id');
  const { GroupMember, GroupMessage } = require('./community.model');
  const group = await Group.findById(groupId);
  if (!group) throw new ApiError(404, 'Group not found');

  await Group.findByIdAndDelete(groupId);
  await GroupMember.deleteMany({ groupId });
  await GroupMessage.deleteMany({ groupId });
  return { success: true };
}

module.exports = {
  // Channels
  listChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  // Posts
  listPosts,
  createPost,
  deletePost,
  // Likes
  toggleLike,
  // Comments
  listComments,
  addComment,
  // Poll
  votePoll,
  // Image upload
  getImageUploadUrl,
  // Q&A Hub
  getQuestions,
  createQuestion,
  getQuestionDetails,
  voteQuestion,
  submitAnswer,
  acceptAnswer,
  // WhatsApp Groups
  getGroups,
  createGroup,
  joinGroup,
  getJoinedGroups,
  getGroupMessages,
  sendGroupMessage,
  deleteGroup,
};
