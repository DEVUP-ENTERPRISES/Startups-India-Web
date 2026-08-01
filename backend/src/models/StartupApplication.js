const mongoose = require('mongoose');

const startupApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    
    startupName: { type: String, default: '', trim: true },
    startupStage: { type: String, default: '' },
    startupLogo: { type: String, default: null },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    yearFounded: { type: String, default: '' },
    teamSize: { type: String, default: '' },
    city: { type: String, default: '' },
    isRegistered: { type: String, default: '' },
    problemStatement: { type: String, default: '' },
    description: { type: String, default: '' },
    fundingStage: { type: String, default: '' },
    revenueRange: { type: String, default: '' },
    startupNeeds: [{ type: String }],

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

startupApplicationSchema.index({ email: 1 });
startupApplicationSchema.index({ status: 1 });

const StartupApplication = mongoose.model('StartupApplication', startupApplicationSchema);
module.exports = { StartupApplication };

