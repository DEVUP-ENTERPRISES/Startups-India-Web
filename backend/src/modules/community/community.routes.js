const express = require('express');
const controller = require('./community.controller');
const { authRequired } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Discussions
router.get('/discussions', authRequired, controller.getDiscussions);
router.post('/discussions', authRequired, controller.createDiscussion);
router.get('/discussions/:id', authRequired, controller.getDiscussionById);

// Groups
router.get('/groups', authRequired, controller.getGroups);
router.get('/groups/joined', authRequired, controller.getJoinedGroups);
router.post('/groups', authRequired, controller.createGroup);
router.post('/groups/:id/join', authRequired, controller.joinGroup);

// Q&A
router.get('/questions', authRequired, controller.getQuestions);
router.post('/questions', authRequired, controller.createQuestion);
router.get('/questions/:id', authRequired, controller.getQuestionById);
router.post('/questions/:id/answer', authRequired, controller.submitAnswer);
router.patch('/answers/:id/accept', authRequired, controller.acceptAnswer);

module.exports = { communityRouter: router };
