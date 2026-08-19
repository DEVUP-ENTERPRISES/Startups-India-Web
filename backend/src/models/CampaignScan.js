const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * One document per scan/click.
 * IPs are one-way hashed so we can count uniques without storing PII.
 */
const campaignScanSchema = new mongoose.Schema(
  {
    trackingLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrackingLink',
      required: true,
      index: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },

    // Anonymised visitor fingerprint (SHA-256 of IP + UA, NOT raw IP)
    visitorHash: { type: String },

    // Device / browser info parsed from user-agent
    deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop', 'bot', 'unknown'], default: 'unknown' },
    browser: { type: String, trim: true },
    os: { type: String, trim: true },

    // Geo (populated if a geo-lookup service is wired up; left empty otherwise)
    country: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, trim: true },

    referrer: { type: String, trim: true },
  },
  {
    timestamps: true, // createdAt === scan timestamp
  }
);

campaignScanSchema.index({ campaign: 1, createdAt: -1 });
campaignScanSchema.index({ trackingLink: 1, createdAt: -1 });

const CampaignScan = mongoose.model('CampaignScan', campaignScanSchema);
module.exports = { CampaignScan };
