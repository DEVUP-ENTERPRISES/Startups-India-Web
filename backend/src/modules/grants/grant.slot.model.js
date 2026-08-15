const mongoose = require('mongoose');

/**
 * Represents a single 1-hour slot in the admin's availability window (11:00-18:00).
 * Admin marks slots as unavailable; what's left is bookable by users.
 * Slots can be booked as online or offline. No Sundays.
 * One document per calendar day.
 */
const slotSchema = new mongoose.Schema(
  {
    // ISO date string YYYY-MM-DD
    date: { type: String, required: true, unique: true, index: true },

    slots: [
      {
        time: { type: String, required: true },        // e.g. "11:00"
        blocked: { type: Boolean, default: false },    // admin marked busy
        mode: { type: String, enum: ['online', 'offline', null], default: null },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
          index: true,
        },
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'GrantApplication',
          default: null,
        },
        bookedAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

const SlotDay = mongoose.model('SlotDay', slotSchema);
module.exports = { SlotDay };
