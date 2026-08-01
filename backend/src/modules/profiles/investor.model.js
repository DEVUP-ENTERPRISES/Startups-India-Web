const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema(
  {
    // Links the approved profile to its login account (set on approval), so the
    // investor dashboard can look the profile up by the signed-in user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    fullName: { type: String, required: true },
    organizationName: { type: String, default: null },
    investorType: { type: String, required: true },
    profileImage: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
    investmentFocus: { type: [String], default: [] },
    preferredStages: { type: [String], default: [] },
    ticketSize: { type: String, default: null },
    portfolioCount: { type: Number, default: 0 },
    totalInvestments: { type: Number, default: 0 },
    bio: { type: String, default: null },
    location: { type: String, default: null },
    yearsOfExperience: { type: Number, default: null },
    geography: { type: String, default: null },
    numberOfInvestments: { type: String, default: null },
    portfolioWebsite: { type: String, default: null },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    totalStartupsSupported: { type: Number, default: 0 },
    programsParticipated: { type: Number, default: 0 },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Investor = mongoose.model('Investor', investorSchema);
module.exports = { Investor };
