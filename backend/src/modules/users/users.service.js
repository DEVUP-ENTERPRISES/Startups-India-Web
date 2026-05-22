const { User } = require('./user.model');
const { ApiError } = require('../../utils/apiError');

async function updateCurrentUser(userId, input) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Explicit field mapping — no mass assignment
  if (typeof input.full_name === 'string') user.fullName = input.full_name.trim().slice(0, 120);
  if (typeof input.headline === 'string') user.headline = input.headline.trim().slice(0, 200);
  if (typeof input.bio === 'string') user.bio = input.bio.trim().slice(0, 2000);
  if (typeof input.city === 'string') user.city = input.city.trim();
  if (typeof input.phone === 'string') user.phone = input.phone.trim();
  if (typeof input.state === 'string') user.state = input.state.trim();
  if (typeof input.avatarUrl === 'string') user.avatarUrl = input.avatarUrl.trim();

  // Map legacy preference keys to schema fields (notificationPrefs)
  if (typeof input.email_notifications === 'boolean') {
    user.notificationPrefs.learning = input.email_notifications;
    user.notificationPrefs.assessments = input.email_notifications;
  }
  if (typeof input.course_updates === 'boolean') {
    user.notificationPrefs.community = input.course_updates;
  }
  if (typeof input.marketing_emails === 'boolean') {
    user.notificationPrefs.marketing = input.marketing_emails;
  }

  await user.save();

  return {
    id: user._id,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    user_metadata: {
      full_name: user.fullName,
      email_notifications: user.notificationPrefs.learning,
      course_updates: user.notificationPrefs.community,
      marketing_emails: user.notificationPrefs.marketing,
    },
  };
}

async function listUsersForAdmin() {
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return users.map(user => ({
    id: user._id,
    email: user.email,
    provider: 'email',
    emailConfirmed: true,
    emailConfirmedAt: user.createdAt,
    createdAt: user.createdAt,
    lastSignIn: user.updatedAt,
    phone: null,
    metadata: {
      full_name: user.fullName,
      role: user.role,
    },
  }));
}

module.exports = {
  updateCurrentUser,
  listUsersForAdmin,
};
