const mongoose = require('mongoose');

/**
 * Question Schema (MCQ / Multiple Choice)
 */
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'multiple'], default: 'mcq' },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  points: { type: Number, default: 1 },
  explanation: { type: String }
});

/**
 * Assessment Schema (Base for Quizzes, Exams)
 */
const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['quiz', 'exam', 'assignment'], required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', index: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  
  // Quiz/Exam Config
  questions: [questionSchema],
  timeLimit: { type: Number }, // in minutes
  passingScore: { type: Number, default: 0 },
  randomizeQuestions: { type: Boolean, default: false },
  maxAttempts: { type: Number, default: 1 },
  violationLimit: { type: Number, default: 3 },
  
  // Assignment Config
  deadline: { type: Date },
  allowLateSubmission: { type: Boolean, default: false },
  
  // Status
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

/**
 * Submission Schema (Results / Attempts)
 */
const submissionSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Quiz/Exam Data
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    selectedOptions: [Number], // indices of selected options
    isCorrect: { type: Boolean }
  }],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  
  // Assignment Data
  submissionContent: { type: String }, // text or URL to file
  fileUrl: { type: String },
  
  // Timing
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeTaken: { type: Number }, // in seconds
  
  // Grading
  status: { type: String, enum: ['in-progress', 'submitted', 'graded'], default: 'in-progress' },
  grade: { type: String },
  feedback: { type: String },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date }
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = {
  Assessment,
  Submission
};
