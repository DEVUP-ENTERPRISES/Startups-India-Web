const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true }, // e.g. "Technology", "Healthcare"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Industry = mongoose.models.Industry || mongoose.model('Industry', industrySchema);
module.exports = { Industry };
