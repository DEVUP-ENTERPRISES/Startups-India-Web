const mongoose = require('mongoose');

// Mirrors MentorApplication: a pending investor application that holds the
// applicant's chosen (hashed) password until an admin approves it. The login
// account (User with role='investor') and the public Investor profile are only
// created on approval - so the password lives here, not on User, until then.
const investorApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    // Uploaded to S3 during the application; stored as a URL only.
    profileImage: { type: String, default: null },

    investorType: { type: String, required: true },
    organizationName: { type: String, default: null },
    // Investor equivalent of a mentor's expertise: what sectors they invest in.
    investmentFocus: { type: [String], default: [] },
    preferredStages: { type: [String], default: [] },
    ticketSize: { type: String, default: null },
    bio: { type: String, required: true },

    // Optional: filled in on the investor profile after approval.
    linkedin: { type: String, default: null },
    websiteUrl: { type: String, default: null },
    location: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: null },
    geography: { type: String, default: '' },
    numberOfInvestments: { type: String, default: '' },
    portfolioWebsite: { type: String, default: '' },

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

investorApplicationSchema.index({ email: 1 });
investorApplicationSchema.index({ status: 1 });

const InvestorApplication = mongoose.model('InvestorApplication', investorApplicationSchema);
module.exports = { InvestorApplication };
