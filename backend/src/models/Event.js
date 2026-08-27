const mongoose = require('mongoose');

// Converts any string into a URL-safe slug.
// "Startup Hackathon 2026!" → "startup-hackathon-2026"
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars except hyphens
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphens
    .replace(/-+/g, '-')        // collapse consecutive hyphens
    .replace(/^-|-$/g, '');     // trim leading/trailing hyphens
}

const eventSchema = new mongoose.Schema(
  {
    // Human-readable URL identifier. Auto-generated from title on create,
    // admin-editable afterwards. Used as /events/<slug> on the public site.
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,  // allows null on old records that pre-date this field
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    mode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
    type: {
      type: String,
      enum: ['webinar', 'workshop', 'meetup', 'conference', 'networking', 'entertainment', 'other', 'hackathon', 'startup pitch', 'tech talk', 'competition'],
      default: 'webinar',
    },
    category: {
      type: String,
      enum: ['workshops', 'networking', 'conferences', 'webinars', 'meetups', 'meetup', 'entertainment', 'workshop', 'hackathon', 'startup pitch', 'tech talk', 'competition', 'other'],
      default: 'workshops',
    },
    date: { type: Date, required: true }, // Legacy/compat
    endDate: { type: Date }, // Legacy/compat
    registrationStartDate: { type: Date },
    registrationEndDate: { type: Date },
    eventStartDate: { type: Date },
    eventEndDate: { type: Date },
    time: { type: String, trim: true },
    duration: { type: String, trim: true },
    
    // Offline Fields
    venue: { type: String, trim: true, default: 'Online' }, // legacy
    venueName: { type: String, trim: true },
    fullAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    location: { type: String, trim: true },
    locationUrl: { type: String, trim: true },
    googleMapsLink: { type: String, trim: true },
    
    // Online Fields
    meetingPlatform: { type: String, trim: true },
    meetingLink: { type: String, trim: true },
    
    coverImage: { type: String, default: '' },
    images: [{ type: String }],
    
    // Pricing - all numeric amounts are stored in paise (minor units). e.g. ₹499 → 49900
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },          // paise - legacy/compat: lowest active ticket price
    originalPrice: { type: Number },              // paise, pre-discount "was" price
    discountedPrice: { type: Number },            // paise, explicit sale price
    earlyBirdPrice: { type: Number },             // paise
    couponCode: { type: String, trim: true },
    priceLabel: { type: String },
    registrationType: {
      type: String,
      enum: ['login', 'guest'],
      default: 'login',
    },

    // Multi-ticket pricing. Each event can define any number of ticket types
    // (e.g. Student, Professional, Early Bird Student, Disability).
    // All monetary fields are in paise. Legacy single-price fields above are
    // kept for backward compat and are auto-derived from ticketTypes when present.
    ticketTypes: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, default: 0 },      // paise
        originalPrice: { type: Number, default: 0 },              // paise
        earlyBirdPrice: { type: Number, default: 0 },             // paise - 0 = no early bird
        earlyBirdDeadline: { type: Date, default: null },
        quota: { type: Number, default: 0 },                       // 0 = unlimited
        sold: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
      },
    ],

    // Event-level coupon library. Each coupon applies to one or more ticket types
    // by name. Discount can be a flat paise amount or a percentage.
    coupons: [
      {
        code: { type: String, required: true, trim: true, uppercase: true },
        discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
        // percent: 0–100. flat: paise off.
        discountValue: { type: Number, required: true, default: 0 },
        maxUses: { type: Number, default: 0 },       // 0 = unlimited
        usedCount: { type: Number, default: 0 },
        validFrom: { type: Date, default: null },
        validUntil: { type: Date, default: null },
        // Empty array = applies to ALL ticket types on this event
        applicableTickets: [{ type: String, trim: true }],
        isActive: { type: Boolean, default: true },
      },
    ],
    
    // Capacity Control
    maxAttendees: { type: Number, default: 0 },
    waitlistEnabled: { type: Boolean, default: false },
    autoCloseRegistration: { type: Boolean, default: false },
    
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    guestRegistrations: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    // Legacy plain-string organizer - kept for backward compat with old records.
    // New records should use organizedBy (ObjectId ref to EventPartner).
    organizer: { type: String, default: 'StartupsIndia' },

    // ── Organizer & Partners (refs to the EventPartner library) ──────────
    // Each field is an ObjectId that the API populates on read so the name,
    // logo and website come through automatically without duplication.
    organizedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventPartner' }],
    supportingPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventPartner' }],
    academicPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventPartner' }],
    sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventPartner' }],
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
        speaker: { type: String },
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
    speakers: [
      {
        photo: { type: String },
        name: { type: String },
        role: { type: String },
        company: { type: String },
        linkedinProfile: { type: String },
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
eventSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event, generateSlug };
