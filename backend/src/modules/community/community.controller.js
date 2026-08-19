const svc = require('./community.service');
const { asyncHandler } = require('../../utils/asyncHandler');

// ─── SSE ─────────────────────────────────────────────────────────────────────
exports.sse = require('./community.sse').sseHandler;

// ─── Channels ─────────────────────────────────────────────────────────────────
exports.listChannels = asyncHandler(async (req, res) => {
  const data = await svc.listChannels(req.user?.role || 'student');
  res.json({ success: true, data });
});

exports.createChannel = asyncHandler(async (req, res) => {
  const data = await svc.createChannel(req.body, req.user.userId);
  res.status(201).json({ success: true, data });
});

exports.updateChannel = asyncHandler(async (req, res) => {
  const data = await svc.updateChannel(req.params.id, req.body);
  res.json({ success: true, data });
});

exports.deleteChannel = asyncHandler(async (req, res) => {
  const data = await svc.deleteChannel(req.params.id);
  res.json({ success: true, data });
});

// ─── Posts ────────────────────────────────────────────────────────────────────
exports.listPosts = asyncHandler(async (req, res) => {
  const { channelId, cursor, limit } = req.query;
  const data = await svc.listPosts({ channelId, userRole: req.user?.role || 'student', cursor, limit });
  res.json({ success: true, ...data });
});

exports.createPost = asyncHandler(async (req, res) => {
  const { channelId, body, imageKey, imageUrl, poll } = req.body;
  const data = await svc.createPost({
    channelId,
    authorId: req.user.userId,
    userRole: req.user.role,
    body,
    imageKey,
    imageUrl,
    poll,
  });
  res.status(201).json({ success: true, data });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const data = await svc.deletePost(req.params.id, req.user.userId, req.user.role);
  res.json({ success: true, data });
});

// ─── Likes ────────────────────────────────────────────────────────────────────
exports.toggleLike = asyncHandler(async (req, res) => {
  const data = await svc.toggleLike(req.params.id, req.user.userId);
  res.json({ success: true, data });
});

// ─── Comments ─────────────────────────────────────────────────────────────────
exports.listComments = asyncHandler(async (req, res) => {
  const data = await svc.listComments(req.params.id);
  res.json({ success: true, data });
});

exports.addComment = asyncHandler(async (req, res) => {
  const data = await svc.addComment({
    postId: req.params.id,
    authorId: req.user.userId,
    body: req.body.body,
  });
  res.status(201).json({ success: true, data });
});

// ─── Poll ─────────────────────────────────────────────────────────────────────
exports.votePoll = asyncHandler(async (req, res) => {
  const data = await svc.votePoll(req.params.id, req.body.optionId, req.user.userId);
  res.json({ success: true, data });
});

// ─── Image upload ─────────────────────────────────────────────────────────────
exports.getImageUploadUrl = asyncHandler(async (req, res) => {
  const data = await svc.getImageUploadUrl(req.body);
  res.json({ success: true, data });
});

// ─── Groups ───────────────────────────────────────────────────────────────────
exports.getGroups = asyncHandler(async (req, res) => {
  const data = await svc.getGroups();
  res.json({ success: true, data });
});

exports.createGroup = asyncHandler(async (req, res) => {
  const data = await svc.createGroup(req.body, req.user.userId);
  res.status(201).json({ success: true, data });
});

exports.joinGroup = asyncHandler(async (req, res) => {
  const data = await svc.joinGroup(req.params.id, req.user.userId);
  res.json({ success: true, data });
});

exports.getJoinedGroups = asyncHandler(async (req, res) => {
  const data = await svc.getJoinedGroups(req.user.userId);
  res.json({ success: true, data });
});

exports.getGroupMessages = asyncHandler(async (req, res) => {
  const data = await svc.getGroupMessages(req.params.id);
  res.json({ success: true, data });
});

exports.sendGroupMessage = asyncHandler(async (req, res) => {
  const data = await svc.sendGroupMessage({
    groupId: req.params.id,
    authorId: req.user.userId,
    userRole: req.user.role,
    content: req.body.content,
  });
  res.status(201).json({ success: true, data });
});

// ─── Q&A Hub ──────────────────────────────────────────────────────────────────
exports.getQuestions = asyncHandler(async (req, res) => {
  const data = await svc.getQuestions(req.query);
  res.json({ success: true, data });
});

exports.createQuestion = asyncHandler(async (req, res) => {
  const data = await svc.createQuestion({ ...req.body, authorId: req.user.userId });
  res.status(201).json({ success: true, data });
});

exports.getQuestionById = asyncHandler(async (req, res) => {
  const data = await svc.getQuestionDetails(req.params.id);
  res.json({ success: true, data });
});

exports.voteQuestion = asyncHandler(async (req, res) => {
  const data = await svc.voteQuestion(req.params.id, req.user.userId);
  res.json({ success: true, data });
});

exports.submitAnswer = asyncHandler(async (req, res) => {
  const data = await svc.submitAnswer(
    { ...req.body, questionId: req.params.id, authorId: req.user.userId },
    req.user.role
  );
  res.status(201).json({ success: true, data });
});

exports.acceptAnswer = asyncHandler(async (req, res) => {
  const data = await svc.acceptAnswer(req.params.id, req.body.questionId, req.user.userId);
  res.json({ success: true, data });
});

exports.deleteGroup = asyncHandler(async (req, res) => {
  const data = await svc.deleteGroup(req.params.id);
  res.json({ success: true, data });
});
