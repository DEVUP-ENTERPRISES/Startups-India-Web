const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String },
    userRole: { type: String },
    action: { type: String, required: true },
    resource: { type: String },
    resourceId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestId: { type: String },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    details: { type: mongoose.Schema.Types.Mixed },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ severity: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = { AuditLog };
