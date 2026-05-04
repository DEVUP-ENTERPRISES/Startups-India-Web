const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['webinar', 'workshop', 'meetup', 'conference', 'networking', 'entertainment', 'other'],
      default: 'webinar',
    },
    category: {
      type: String,
      enum: ['workshops', 'networking', 'conferences', 'webinars', 'meetups', 'entertainment'],
      default: 'workshops',
    },
    date: { type: Date, required: true },
    endDate: { type: Date },
    time: { type: String, trim: true },
    duration: { type: String, trim: true },
    venue: { type: String, trim: true, default: 'Online' },
    location: { type: String, trim: true },
    locationUrl: { type: String, trim: true },
    meetingLink: { type: String, trim: true },
    coverImage: { type: String, default: '' },
    images: [{ type: String }],
    price: { type: Number, default: 0 },
    originalPrice: { type: Number },
    priceLabel: { type: String },
    maxAttendees: { type: Number, default: 0 },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    organizer: { type: String, default: 'StartupsIndia' },
    attendees: { type: Number, default: 0 },
    ageLimit: { type: String, default: '18yrs +' },
    language: { type: String, default: 'English' },
    genre: { type: String },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    highlights: [{ type: String }],
    outcomes: [{ type: String }],
    timeline: [
      {
        time: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    artists: [
      {
        name: { type: String },
        role: { type: String },
        image: { type: String },
        bio: { type: String },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: -1 });
eventSchema.index({ category: 1, date: -1 });
eventSchema.index({ featured: -1, date: -1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
