const mongoose = require('mongoose');

const ecosystemEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['startup', 'corporate', 'partner', 'academia', 'coworking'],
    },
    type: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ecosystemEntrySchema.index({ category: 1, isActive: 1, order: 1 });
ecosystemEntrySchema.index({ isFeatured: -1, createdAt: -1 });

const EcosystemEntry = mongoose.model('EcosystemEntry', ecosystemEntrySchema);
module.exports = { EcosystemEntry };
