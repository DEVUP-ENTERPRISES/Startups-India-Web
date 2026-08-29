const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    collegeCompany: { type: String },
    roleProfession: { type: String },
    city: { type: String },
    // Razorpay order id for paid registrations - used as an idempotency key so
    // the client-verify, webhook, and reconcile paths register a payment exactly
    // once even when they race. Sparse+unique: only enforced when present.
    paymentOrderId: { type: String, index: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Free'], default: 'Free' },
    ticketType: { type: String, default: 'General' },       // legacy label
    ticketTypeName: { type: String, default: 'General' },   // matches ticketTypes[].name
    ticketPrice: { type: Number, default: 0 },              // paise actually charged (after coupon/early-bird)
    couponUsed: { type: String, default: '' },              // coupon code applied, if any
    attendanceStatus: { type: String, enum: ['Registered', 'Attended', 'Missed', 'Cancelled'], default: 'Registered' },
    checkInStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ user: 1 });
eventRegistrationSchema.index({ email: 1 });
// Idempotency for paid registrations: at most one registration per Razorpay order.
// Sparse so the many free/legacy registrations without an orderId are unaffected.
eventRegistrationSchema.index({ paymentOrderId: 1 }, { unique: true, sparse: true });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
module.exports = { EventRegistration };
