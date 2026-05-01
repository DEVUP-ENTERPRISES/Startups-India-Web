const { User } = require('../users/user.model');
const bcrypt = require('bcryptjs');

// Fields the user is allowed to update on their profile
const PROFILE_WHITELIST = [
  'fullName', 'headline', 'missionStatement', 'bio',
  'location', 'phone', 'timezone', 'socialLinks',
];

// Minimum required password strength (must pass all four checks)
function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

class SettingsService {
  /* ── Profile ── */

  async getProfile(userId) {
    const user = await User.findById(userId).select(
      '-passwordHash -refreshTokenHash'
    );
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return user;
  }

  async updateProfile(userId, data) {
    // Strip out any fields that are not in the whitelist
    const safe = {};
    for (const key of PROFILE_WHITELIST) {
      if (data[key] !== undefined) safe[key] = data[key];
    }

    if (Object.keys(safe).length === 0) {
      throw Object.assign(new Error('No valid fields provided'), { status: 400 });
    }

    // Enforce bio length limit
    if (safe.bio && safe.bio.length > 300) {
      throw Object.assign(new Error('Bio must be 300 characters or less'), { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: safe },
      { new: true, runValidators: true }
    ).select('-passwordHash -refreshTokenHash');

    if (!updated) throw Object.assign(new Error('User not found'), { status: 404 });
    return updated;
  }

  /* ── Password ── */

  async updatePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw Object.assign(new Error('Both current and new passwords are required'), { status: 400 });
    }

    if (!isStrongPassword(newPassword)) {
      throw Object.assign(
        new Error(
          'New password must be at least 8 characters and contain an uppercase letter, a number, and a special character'
        ),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

    if (!user.passwordHash) {
      throw Object.assign(
        new Error('No password set for this account. Use social login or contact support.'),
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw Object.assign(new Error('Current password is incorrect'), { status: 401 });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    // Invalidate all refresh tokens so other sessions are logged out
    user.refreshTokenHash = undefined;
    await user.save();
    return true;
  }

  /* ── Notifications ── */

  async getNotificationPrefs(userId) {
    const user = await User.findById(userId).select('notificationPrefs');
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

    // Return defaults if not yet set
    return user.notificationPrefs || {
      learning: true,
      assessments: true,
      community: true,
      payments: true,
      marketing: false,
    };
  }

  async updateNotificationPrefs(userId, prefs) {
    const ALLOWED_KEYS = ['learning', 'assessments', 'community', 'payments', 'marketing'];
    const safe = {};
    for (const key of ALLOWED_KEYS) {
      if (typeof prefs[key] === 'boolean') safe[key] = prefs[key];
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { notificationPrefs: safe } },
      { new: true }
    ).select('notificationPrefs');

    if (!updated) throw Object.assign(new Error('User not found'), { status: 404 });
    return updated.notificationPrefs;
  }

  /* ── Privacy ── */

  async getPrivacySettings(userId) {
    const user = await User.findById(userId).select('privacySettings');
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

    return user.privacySettings || {
      profileVisibility: 'public',
      activityVisibility: 'public',
      showBio: true,
      showStats: true,
      showGoals: true,
    };
  }

  async updatePrivacySettings(userId, settings) {
    const VISIBILITY = ['public', 'users', 'private'];
    const safe = {};

    if (settings.profileVisibility && VISIBILITY.includes(settings.profileVisibility)) {
      safe.profileVisibility = settings.profileVisibility;
    }
    if (settings.activityVisibility && VISIBILITY.includes(settings.activityVisibility)) {
      safe.activityVisibility = settings.activityVisibility;
    }
    for (const key of ['showBio', 'showStats', 'showGoals']) {
      if (typeof settings[key] === 'boolean') safe[key] = settings[key];
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { privacySettings: safe } },
      { new: true }
    ).select('privacySettings');

    if (!updated) throw Object.assign(new Error('User not found'), { status: 404 });
    return updated.privacySettings;
  }

  /* ── Account ── */

  async deleteAccount(userId) {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false, refreshTokenHash: undefined } },
      { new: true }
    ).select('_id isActive');
    if (!updated) throw Object.assign(new Error('User not found'), { status: 404 });
    return updated;
  }
}

module.exports = new SettingsService();
