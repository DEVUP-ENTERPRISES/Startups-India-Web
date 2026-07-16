const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ['general', 'email', 'payment', 'seo', 'appearance', 'security', 'grant'],
      default: 'general',
    },
    description: { type: String, trim: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

settingsSchema.index({ category: 1 });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = { Settings };
