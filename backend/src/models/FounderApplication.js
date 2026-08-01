const mongoose = require('mongoose');

const founderApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    
    isStudent: { type: String, default: 'No' },
    designation: { type: String, default: '' },
    startupName: { type: String, default: '' },
    startupStage: { type: String, default: '' },
    industry: { type: String, default: '' },
    yearsOfExperience: { type: String, default: '' },
    previousStartup: { type: String, default: '' },
    previousCompany: { type: String, default: '' },
    domainExpertise: { type: String, default: '' },
    city: { type: String, default: '' },
    bio: { type: String, default: '' },
    lookingFor: [{ type: String }],
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    profilePhoto: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

founderApplicationSchema.index({ email: 1 });
founderApplicationSchema.index({ status: 1 });

const FounderApplication = mongoose.model('FounderApplication', founderApplicationSchema);
module.exports = { FounderApplication };

