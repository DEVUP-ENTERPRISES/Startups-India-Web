const mongoose = require('mongoose');
const { Event } = require('./src/models/Event');
const { EventRegistration } = require('./src/models/EventRegistration');
const { User } = require('./src/modules/users/user.model');
require('dotenv').config();

async function syncRegistrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const events = await Event.find({ registrations: { $exists: true, $ne: [] } });
    console.log(`Found ${events.length} events with registrations`);

    for (const event of events) {
      console.log(`Processing event: ${event.title}`);
      for (const userId of event.registrations) {
        // Check if registration already exists
        const exists = await EventRegistration.findOne({ event: event._id, user: userId });
        if (!exists) {
          const user = await User.findById(userId);
          if (user) {
            await EventRegistration.create({
              event: event._id,
              user: userId,
              fullName: user.fullName || 'Unknown User',
              email: user.email || 'unknown@user.com',
              phoneNumber: user.phoneNumber || '',
              paymentStatus: event.isPaid ? 'Completed' : 'Free',
              attendanceStatus: 'Registered'
            });
            console.log(`Created registration for user: ${user.email}`);
          }
        } else {
          console.log(`Registration already exists for user: ${userId}`);
        }
      }
    }

    console.log('Sync complete');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

syncRegistrations();
