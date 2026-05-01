const settingsService = require('./settings.service');
const { asyncHandler } = require('../../utils/asyncHandler');

/* ── Profile ── */

exports.getProfile = asyncHandler(async (req, res) => {
  const data = await settingsService.getProfile(req.user.userId);
  res.json({ success: true, data });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const data = await settingsService.updateProfile(req.user.userId, req.body);
  res.json({ success: true, data, message: 'Profile updated successfully' });
});

/* ── Password ── */

exports.updatePassword = asyncHandler(async (req, res) => {
  await settingsService.updatePassword(req.user.userId, req.body);
  res.json({ success: true, message: 'Password updated successfully' });
});

/* ── Notifications ── */

exports.getNotifications = asyncHandler(async (req, res) => {
  const data = await settingsService.getNotificationPrefs(req.user.userId);
  res.json({ success: true, data });
});

exports.updateNotifications = asyncHandler(async (req, res) => {
  const data = await settingsService.updateNotificationPrefs(req.user.userId, req.body);
  res.json({ success: true, data, message: 'Notification preferences updated' });
});

/* ── Privacy ── */

exports.getPrivacy = asyncHandler(async (req, res) => {
  const data = await settingsService.getPrivacySettings(req.user.userId);
  res.json({ success: true, data });
});

exports.updatePrivacy = asyncHandler(async (req, res) => {
  const data = await settingsService.updatePrivacySettings(req.user.userId, req.body);
  res.json({ success: true, data, message: 'Privacy settings updated' });
});

/* ── Account ── */

exports.deleteAccount = asyncHandler(async (req, res) => {
  await settingsService.deleteAccount(req.user.userId);
  res.json({ success: true, message: 'Account deactivated successfully' });
});

/* ── Error middleware helper ──
   Translates service-level errors into proper HTTP responses.
   Must be added AFTER the router in app.js:
     app.use('/api/v1/settings', settingsRouter, settingsErrorHandler);
─────────────────────────────────────────────────── */
exports.settingsErrorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
};
