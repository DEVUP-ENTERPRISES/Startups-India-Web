const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

citySchema.index({ name: 1, state: 1 }, { unique: true });

const City = mongoose.models.City || mongoose.model('City', citySchema);
module.exports = { City };
