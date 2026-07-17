const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    // Uploaded to S3 during the (short) application; stored as a URL only.
    profileImage: { type: String, default: null },
    currentRole: { type: String, required: true },
    company: { type: String, required: true },
    // Optional: the shortened application no longer collects these. The mentor
    // fills experience/availability in on their profile page after approval.
    experience: { type: String, default: '' },
    linkedin: { type: String, default: null },
    expertise: [{ type: String }],
    bio: { type: String, required: true },
    availability: { type: String, default: '' },
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
