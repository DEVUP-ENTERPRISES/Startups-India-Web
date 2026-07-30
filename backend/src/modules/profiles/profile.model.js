const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    dynamicProfileData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    profileCompleted: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

module.exports = { Profile };
