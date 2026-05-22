const mongoose = require('mongoose');

const investorRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String, required: true, trim: true },
    organization_name: { type: String, trim: true },
    investor_type: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    linkedin_url: { type: String, trim: true },
    website_url: { type: String, trim: true },
    investment_focus: [{ type: String }],
    preferred_stages: [{ type: String }],
    ticket_size: { type: String, trim: true },
    bio: { type: String },
    location: { type: String, trim: true },
    years_of_experience: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

investorRequestSchema.index({ status: 1 });
investorRequestSchema.index({ user: 1 });

const InvestorRequest = mongoose.model('InvestorRequest', investorRequestSchema);
module.exports = { InvestorRequest };
