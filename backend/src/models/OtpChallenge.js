const mongoose = require('mongoose');

// One pending OTP. Kept in its own collection rather than on the User document so
// that a challenge is cheap to expire, index, and reason about - and so a leaked
// User read can never expose a live code.
const OTP_PURPOSES = [
  'login_2fa', // second factor after a correct password
  'phone_verify', // proving ownership of a number being added to an account
];

const otpChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    purpose: { type: String, enum: OTP_PURPOSES, required: true },
    phoneE164: { type: String, required: true },

    // HMAC-SHA256 of the code, never the code itself. A plain SHA-256 would be
    // pointless here: a 6-digit code has only ~1M possible values, so an attacker
    // with the database could brute-force the digest instantly. The server-side
    // pepper is what makes the stored value useless on its own.
    codeHash: { type: String, required: true },

    attempts: { type: Number, default: 0 },
    sendCount: { type: Number, default: 1 },
    lastSentAt: { type: Date, default: Date.now },

    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Mongo reaps expired challenges on its own - no cron, no unbounded growth.
// (This only deletes the row; single-use is enforced by consumedAt, not by TTL.)
otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// A user has at most one live challenge per purpose; re-requesting replaces it.
otpChallengeSchema.index({ userId: 1, purpose: 1, consumedAt: 1 });

const OtpChallenge = mongoose.model('OtpChallenge', otpChallengeSchema);
module.exports = { OtpChallenge, OTP_PURPOSES };
