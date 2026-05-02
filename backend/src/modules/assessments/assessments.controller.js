const assessmentsService = require('./assessments.service');
const { asyncHandler } = require('../../utils/asyncHandler');

/**
 * Assessment Controller
 */
exports.createAssessment = asyncHandler(async (req, res) => {
  const assessment = await assessmentsService.createAssessment({
    ...req.body,
    createdBy: req.user.userId
  });
  res.json({
    success: true,
    message: 'Assessment created successfully',
    data: assessment
  });
});

exports.getAssessments = asyncHandler(async (req, res) => {
  const { type, courseId } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (courseId) filter.courseId = courseId;
  
  const assessments = await assessmentsService.getAssessments(filter, req.user.userId, req.user.role);
  res.json({
    success: true,
    data: assessments
  });
});

exports.updateAssessment = asyncHandler(async (req, res) => {
  const assessment = await assessmentsService.updateAssessment(req.params.id, req.body);
  if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
  res.json({ success: true, data: assessment });
});

exports.deleteAssessment = asyncHandler(async (req, res) => {
  await assessmentsService.deleteAssessment(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

exports.getAssessmentById = asyncHandler(async (req, res) => {
  const assessment = await assessmentsService.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ success: false, message: 'Assessment not found' });
  }
  res.json({
    success: true,
    data: assessment
  });
});

/**
 * Quiz/Exam Logic
 */
exports.startAttempt = asyncHandler(async (req, res) => {
  const attempt = await assessmentsService.startAttempt(req.user.userId, req.params.id);
  res.json({
    success: true,
    message: 'Attempt started',
    data: attempt
  });
});

exports.submitQuiz = asyncHandler(async (req, res) => {
  const { submissionId, answers } = req.body;
  const result = await assessmentsService.submitQuiz(req.user.userId, submissionId, answers);
  res.json({
    success: true,
    message: 'Quiz submitted successfully',
    data: result
  });
});

/**
 * Assignment Logic
 */
exports.submitAssignment = asyncHandler(async (req, res) => {
  const result = await assessmentsService.submitAssignment(req.user.userId, req.params.id, req.body);
  res.json({
    success: true,
    message: 'Assignment submitted',
    data: result
  });
});

exports.gradeSubmission = asyncHandler(async (req, res) => {
  const result = await assessmentsService.gradeSubmission(req.params.id, req.user.userId, req.body);
  res.json({
    success: true,
    message: 'Submission graded',
    data: result
  });
});

/**
 * Results
 */
exports.getResults = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
    filter.userId = req.user.userId;
  } else if (req.query.userId) {
    filter.userId = req.query.userId;
  }
  
  if (req.params.assessmentId) filter.assessmentId = req.params.assessmentId;
  
  const results = await assessmentsService.getResults(filter);
  res.json({
    success: true,
    data: results
  });
});
