const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    area: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'matched', 'closed'],
      default: 'pending',
    },
    matchedMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

mentorRequestSchema.index({ status: 1 });
mentorRequestSchema.index({ user: 1 });

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);
module.exports = { MentorRequest };
