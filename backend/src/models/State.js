const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const State = mongoose.models.State || mongoose.model('State', stateSchema);
module.exports = { State };
