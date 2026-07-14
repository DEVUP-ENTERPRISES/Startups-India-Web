const mongoose = require('mongoose');

const SECURITY_EVENT_TYPES = [
  'failed_login',
  'brute_force',
  'rate_limit',
  'suspicious_ip',
  'token_abuse',
  'invalid_token',
  'account_locked',
  'permission_denied',
  'suspicious_request',
  'anomaly_detected',
  'password_reset_requested',
  'password_reset_completed',
  'password_reset_failed',
  'two_factor_challenged',
  'two_factor_success',
  'two_factor_failed',
  'two_factor_enabled',
  'two_factor_disabled',
  'phone_verified',
];

const securityEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: SECURITY_EVENT_TYPES },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    endpoint: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

securityEventSchema.index({ createdAt: -1 });
securityEventSchema.index({ type: 1, createdAt: -1 });
securityEventSchema.index({ ipAddress: 1, createdAt: -1 });
securityEventSchema.index({ resolved: 1, createdAt: -1 });
securityEventSchema.index({ severity: 1, resolved: 1, createdAt: -1 });

const SecurityEvent = mongoose.model('SecurityEvent', securityEventSchema);
module.exports = { SecurityEvent, SECURITY_EVENT_TYPES };
