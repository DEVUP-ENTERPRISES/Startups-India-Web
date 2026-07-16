const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    currentRole: { type: String, required: true },
    company: { type: String, required: true },
    experience: { type: String, required: true },
    linkedin: { type: String },
    expertise: [{ type: String }],
    bio: { type: String, required: true },
    availability: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mentorApplicationSchema.index({ email: 1 });
mentorApplicationSchema.index({ status: 1 });

const MentorApplication = mongoose.model('MentorApplication', mentorApplicationSchema);
module.exports = { MentorApplication };
