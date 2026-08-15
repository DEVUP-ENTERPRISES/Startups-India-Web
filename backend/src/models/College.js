const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    type: {
      type: String,
      enum: ['Engineering', 'Medical', 'Arts & Science', 'Management', 'Law', 'Polytechnic', 'Other'],
      default: 'Other',
    },
    isUserAdded: { type: Boolean, default: false }, // true when added by a user during onboarding
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

collegeSchema.index({ name: 1, city: 1 }, { unique: true });
collegeSchema.index({ name: 'text' }); // text search for autocomplete

const College = mongoose.models.College || mongoose.model('College', collegeSchema);
module.exports = { College };
