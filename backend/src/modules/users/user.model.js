const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    fullName: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    provider: { type: String, enum: ['email', 'google', 'facebook'], default: 'email' },
    providerIds: {
      google: { type: String },
      facebook: { type: String },
    },
    authProviders: { type: [String], default: ['email'] },
    role: { type: String, enum: ['admin', 'startup', 'mentor', 'investor', 'service_provider', 'other', null], default: null },
    headline: { type: String, trim: true, maxlength: 200 },
    missionStatement: { type: String, trim: true, maxlength: 500 },
    bio: { type: String, trim: true, maxlength: 2000 },
    city: { type: String, trim: true },
    phone: { type: String, trim: true },
    state: { type: String, trim: true },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: [] },
    notificationPrefs: {
      learning: { type: Boolean, default: true },
      assessments: { type: Boolean, default: true },
      community: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true }
    },
    privacySettings: {
      profileVisibility: { type: String, enum: ['public', 'private', 'users'], default: 'public' },
      activityVisibility: { type: String, enum: ['public', 'private', 'users'], default: 'public' },
      showBio: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true },
      showGoals: { type: Boolean, default: true }
    },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    isApproved: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    refreshTokenHash: { type: String, default: null },
    fcmTokens: [{ type: String }], // push notification device tokens (one per device)

    // ─── PHONE / TWO-FACTOR ────────────────────────────────────────────
    // `phone` above stays as-is: a free-text profile field, unverified, and full
    // of junk from before this existed. It is deliberately NOT used for auth.
    // Everything security-relevant hangs off phoneE164, which is canonical and
    // only ever written after an OTP has actually been delivered and echoed back.
    phoneE164: { type: String, default: null, trim: true },
    phoneVerifiedAt: { type: Date, default: null },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorEnabledAt: { type: Date, default: null },
    // bcrypt hashes of single-use recovery codes. Without these, a lost or
    // swapped SIM means a permanently locked account and a support ticket.
    twoFactorBackupCodes: { type: [String], default: [], select: false },

    // ─── ONBOARDING ───────────────────────────────────────────────────
    // Set to true once the user completes the /onboarding flow after signup.
    // Used to redirect new accounts to onboarding instead of the dashboard.
    onboardingCompleted: { type: Boolean, default: false },

    // ─── PASSWORD RESET ────────────────────────────────────────────────
    // Only the SHA-256 hash of the reset token is stored. A DB leak therefore
    // does not hand an attacker usable reset links. `select: false` keeps these
    // out of every incidental User.find() that later gets serialised to a client.
    resetPasswordTokenHash: { type: String, default: null, select: false },
    resetPasswordExpiresAt: { type: Date, default: null, select: false },
    // Timestamp of the last reset email - enforces the resend cooldown.
    resetPasswordSentAt: { type: Date, default: null, select: false },
    // Set on every successful password change. A reset also nulls refreshTokenHash,
    // so long-lived sessions die at once; already-issued access tokens still run out
    // their <=15m TTL (enforcing this per-request would cost a DB read on every
    // authenticated call). Kept for audit + the "changed at" line in security emails.
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ 'providerIds.google': 1 }, { sparse: true, unique: true });
userSchema.index({ 'providerIds.facebook': 1 }, { sparse: true, unique: true });
// Reset lookups are by token hash alone; sparse keeps the index tiny since the
// vast majority of users have no pending reset.
userSchema.index({ resetPasswordTokenHash: 1 }, { sparse: true });

// A *verified* number must belong to exactly one account, or two users could both
// claim it and 2FA would text the wrong person. The partial filter scopes the
// constraint to verified numbers only, so several accounts may still hold the same
// number in an unverified, pending state without tripping a duplicate-key error.
userSchema.index(
  { phoneE164: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneE164: { $type: 'string' },
      phoneVerifiedAt: { $type: 'date' },
    },
  }
);

const User = mongoose.model('User', userSchema);
module.exports = { User };
