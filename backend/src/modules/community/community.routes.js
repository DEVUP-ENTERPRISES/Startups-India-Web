const express = require('express');
const controller = require('./community.controller');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');

const router = express.Router();

// SSE Stream for real-time channel updates
router.get('/sse', authRequired, controller.sse);

// Channels (Public/Student read, Admin create/update/delete)
router.get('/channels', authRequired, controller.listChannels);
router.post('/channels', authRequired, requireRole('admin'), controller.createChannel);
router.patch('/channels/:id', authRequired, requireRole('admin'), controller.updateChannel);
router.delete('/channels/:id', authRequired, requireRole('admin'), controller.deleteChannel);

// Posts
router.get('/posts', authRequired, controller.listPosts);
router.post('/posts', authRequired, controller.createPost);
router.delete('/posts/:id', authRequired, controller.deletePost);

// Likes & Polls
router.post('/posts/:id/like', authRequired, controller.toggleLike);
router.post('/posts/:id/vote', authRequired, controller.votePoll);

// Comments
router.get('/posts/:id/comments', authRequired, controller.listComments);
router.post('/posts/:id/comments', authRequired, controller.addComment);

// Image Upload Presigned URL
router.post('/upload-image', authRequired, controller.getImageUploadUrl);

// Groups (WhatsApp Style)
router.get('/groups', authRequired, controller.getGroups);
router.get('/groups/joined', authRequired, controller.getJoinedGroups);
router.post('/groups', authRequired, requireRole('admin'), controller.createGroup);
router.delete('/groups/:id', authRequired, requireRole('admin'), controller.deleteGroup);
router.post('/groups/:id/join', authRequired, controller.joinGroup);
router.get('/groups/:id/messages', authRequired, controller.getGroupMessages);
router.post('/groups/:id/messages', authRequired, controller.sendGroupMessage);

// Doubts / Q&A Hub
router.get('/questions', authRequired, controller.getQuestions);
router.post('/questions', authRequired, controller.createQuestion);
router.get('/questions/:id', authRequired, controller.getQuestionById);
router.post('/questions/:id/vote', authRequired, controller.voteQuestion);
router.post('/questions/:id/answer', authRequired, controller.submitAnswer);
router.patch('/answers/:id/accept', authRequired, controller.acceptAnswer);

module.exports = { communityRouter: router };
