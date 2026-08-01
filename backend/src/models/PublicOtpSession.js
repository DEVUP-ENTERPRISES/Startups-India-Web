const mongoose = require('mongoose');

const publicOtpSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-delete expired sessions from DB
publicOtpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PublicOtpSession = mongoose.models.PublicOtpSession || mongoose.model('PublicOtpSession', publicOtpSessionSchema);

module.exports = { PublicOtpSession };
