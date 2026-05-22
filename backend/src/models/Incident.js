const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    note: { type: String },
    byEmail: { type: String },
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], required: true },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open',
    },
    type: {
      type: String,
      enum: ['security', 'infrastructure', 'performance', 'data', 'availability'],
      required: true,
    },
    affectedServices: [{ type: String }],
    timeline: [timelineEntrySchema],
    resolvedAt: { type: Date },
    createdByEmail: { type: String },
    assignedToEmail: { type: String },
  },
  { timestamps: true }
);

incidentSchema.index({ status: 1, createdAt: -1 });
incidentSchema.index({ severity: 1, status: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = { Incident };
