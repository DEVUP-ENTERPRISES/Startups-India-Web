const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    route: { type: String, trim: true, default: '/' }, // site page path e.g. /courses
    status: {
      type: String,
      enum: ['active', 'paused', 'archived'],
      default: 'active',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, createdAt: -1 });

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = { Campaign };
