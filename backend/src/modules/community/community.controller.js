const communityService = require('./community.service');
const { asyncHandler } = require('../../utils/asyncHandler');

/**
 * Discussions
 */
exports.getDiscussions = asyncHandler(async (req, res) => {
  const data = await communityService.getDiscussions(req.query);
  res.json({ success: true, data });
});

exports.createDiscussion = asyncHandler(async (req, res) => {
  const data = await communityService.createDiscussion({ ...req.body, authorId: req.user.userId });
  res.status(201).json({ success: true, data });
});

exports.getDiscussionById = asyncHandler(async (req, res) => {
  const data = await communityService.getDiscussionDetails(req.params.id);
  res.json({ success: true, data });
});

/**
 * Groups
 */
exports.getGroups = asyncHandler(async (req, res) => {
  const data = await communityService.getGroups();
  res.json({ success: true, data });
});

exports.createGroup = asyncHandler(async (req, res) => {
  const data = await communityService.createGroup(req.body, req.user.userId);
  res.status(201).json({ success: true, data });
});

exports.joinGroup = asyncHandler(async (req, res) => {
  const data = await communityService.joinGroup(req.params.id, req.user.userId);
  res.json({ success: true, data });
});

exports.getJoinedGroups = asyncHandler(async (req, res) => {
  const data = await communityService.getJoinedGroups(req.user.userId);
  res.json({ success: true, data });
});

/**
 * Q&A
 */
exports.getQuestions = asyncHandler(async (req, res) => {
  const data = await communityService.getQuestions();
  res.json({ success: true, data });
});

exports.createQuestion = asyncHandler(async (req, res) => {
  const data = await communityService.createQuestion({ ...req.body, authorId: req.user.userId });
  res.status(201).json({ success: true, data });
});

exports.getQuestionById = asyncHandler(async (req, res) => {
  const data = await communityService.getQuestionDetails(req.params.id);
  res.json({ success: true, data });
});

exports.submitAnswer = asyncHandler(async (req, res) => {
  const data = await communityService.submitAnswer({ 
    ...req.body, 
    questionId: req.params.id, 
    authorId: req.user.userId 
  });
  res.status(201).json({ success: true, data });
});

exports.acceptAnswer = asyncHandler(async (req, res) => {
  const data = await communityService.acceptAnswer(
    req.params.id, 
    req.body.questionId, 
    req.user.userId
  );
  res.json({ success: true, data });
});
