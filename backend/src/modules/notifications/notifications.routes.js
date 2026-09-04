const express = require('express');
const { z } = require('zod');
const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired } = require('../../middlewares/authMiddleware');
const { validateBody } = require('../../middlewares/validateBody');
const { Notification } = require('../../models/Notification');

const router = express.Router();

// Everything here is the caller's own notification feed.
router.use(authRequired);

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

/**
 * Build the Mongo filter for the notifications a given user should see:
 *  - specific notifications addressed to them (recipients includes their id), OR
 *  - broadcasts to everyone / all logged-in users / their role bucket.
 * Only active, non-expired notifications count.
 */
function feedFilter(user) {
  const now = new Date();
  const roleTargets = ['all', 'users'];
  // Map the user's role to the broadcast bucket used by the admin notification tool.
  if (user.role === 'mentor') roleTargets.push('mentors');
  if (user.role === 'investor') roleTargets.push('investors');

  return {
    isActive: true,
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      {
        $or: [
          { target: { $in: roleTargets } },
          { target: 'specific', recipients: user.userId },
        ],
      },
    ],
  };
}

function shape(doc, userId) {
  return {
    id: String(doc._id),
    title: doc.title,
    message: doc.message,
    type: doc.type,
    createdAt: doc.createdAt,
    // Unread when this user's id isn't in readBy.
    isUnread: !(doc.readBy || []).some(r => String(r) === String(userId)),
  };
}

// ─── LIST (own feed) + unread count ─────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const filter = feedFilter(req.user);

    const docs = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const items = docs.map(d => shape(d, req.user.userId));
    const unreadCount = items.filter(i => i.isUnread).length;

    res.json({ success: true, data: { items, unreadCount } });
  })
);

// ─── MARK ALL READ ──────────────────────────────────────────────────────
router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      feedFilter(req.user),
      { $addToSet: { readBy: req.user.userId } }
    );
    res.json({ success: true });
  })
);

// ─── MARK ONE READ ──────────────────────────────────────────────────────
router.patch(
  '/:id/read',
  validateBody(z.object({}).passthrough()),
  asyncHandler(async (req, res) => {
    const parsed = objectId.safeParse(req.params.id);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }
    await Notification.updateOne(
      { _id: req.params.id },
      { $addToSet: { readBy: req.user.userId } }
    );
    res.json({ success: true });
  })
);

module.exports = { notificationsRouter: router };
