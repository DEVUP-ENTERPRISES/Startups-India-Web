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
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Free'], default: 'Free' },
    ticketType: { type: String, default: 'General' },
    attendanceStatus: { type: String, enum: ['Registered', 'Attended', 'Missed', 'Cancelled'], default: 'Registered' },
    checkInStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ user: 1 });
eventRegistrationSchema.index({ email: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
module.exports = { EventRegistration };
