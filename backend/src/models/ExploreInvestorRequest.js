const mongoose = require('mongoose');

const exploreInvestorRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    startup_name: { type: String, required: true, trim: true },
    sector: { type: String, required: true },
    funding_amount: { type: String, required: true },
    pitch: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'matched', 'closed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

exploreInvestorRequestSchema.index({ status: 1 });
exploreInvestorRequestSchema.index({ user: 1 });

const ExploreInvestorRequest = mongoose.model('ExploreInvestorRequest', exploreInvestorRequestSchema);
module.exports = { ExploreInvestorRequest };
