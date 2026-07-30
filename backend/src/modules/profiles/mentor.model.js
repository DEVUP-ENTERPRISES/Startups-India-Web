const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: null },
    profileImage: { type: String, default: null },
    currentRole: { type: String, required: true },
    company: { type: String, required: true },
    // Optional: the shortened application doesn't collect this; mentor adds it
    // on their profile after approval. Was required, which would reject the
    // approval of any mentor who applied via the short form.
    experience: { type: String, default: '' },
    linkedinUrl: { type: String, default: null },
    previousCompanies: { type: [String], default: [] },
    expertise: { type: [String], default: [] },
    bio: { type: String, default: null },
    availability: { type: String, default: null },
    achievements: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isActive: { type: Boolean, default: true },
    totalMentees: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = { Mentor };
