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
    role: { type: String, enum: ['admin', 'user', 'mentor', 'investor'], default: 'user' },
    headline: { type: String, trim: true },
    missionStatement: { type: String, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    phone: { type: String, trim: true },
    timezone: { type: String, default: 'IST (UTC+5:30)' },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      github: { type: String },
      website: { type: String }
    },
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
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    refreshTokenHash: { type: String, default: null },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ 'providerIds.google': 1 }, { sparse: true, unique: true });
userSchema.index({ 'providerIds.facebook': 1 }, { sparse: true, unique: true });

const User = mongoose.model('User', userSchema);
module.exports = { User };
