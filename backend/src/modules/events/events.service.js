const mongoose = require('mongoose');
const { Event } = require('../../models/Event');
const { EventRegistration } = require('../../models/EventRegistration');
const { User } = require('../users/user.model');
const { ApiError } = require('../../utils/apiError');
const { cacheDel } = require('../../infrastructure/cache/redis');

async function listEvents({ page = 1, limit = 20, category, status = 'upcoming', sort = 'date', userId = null }) {
  const query = {};
  if (category) query.category = category;
  if (status) {
    const statuses = status.split(',').map(s => s.trim());
    query.status = { $in: statuses };
  }

  const total = await Event.countDocuments(query);
  const events = await Event.find(query)
    .populate('createdBy', 'fullName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  events.forEach(event => {
    const isRegistered =
      userId != null &&
      event.registrations != null &&
      event.registrations.some(r => r.toString() === userId.toString());
    event.isRegistered = !!isRegistered;
    if (!isRegistered) {
      delete event.meetingLink;
    }
  });

  return {
    events,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

async function getEventById(id, userId = null) {
  const event = await Event.findById(id).populate('createdBy', 'fullName');
  if (!event) throw new ApiError(404, 'Event not found');

  const eventObj = event.toObject();
  
  // Check if user is registered
  const isRegistered = userId && event.registrations.some(r => r.toString() === userId.toString());
  eventObj.isRegistered = !!isRegistered;

  // Hide sensitive link if not registered
  if (!isRegistered) {
    delete eventObj.meetingLink;
  }

  return eventObj;
}

async function getFeaturedEvents(limit = 6) {
  return Event.find({ status: { $in: ['upcoming', 'live'] } })
    .sort('-createdAt')
    .limit(limit)
    .populate('createdBy', 'fullName')
    .lean();
}

async function registerForEvent(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  if (event.registrations.includes(userId)) {
    throw new ApiError(400, 'Already registered for this event');
  }

  if (event.maxAttendees > 0 && event.registrations.length >= event.maxAttendees) {
    throw new ApiError(400, 'Event is full');
  }

  event.registrations.push(userId);
  await event.save();

  // Create official registration record for Admin Panel
  try {
    const user = await User.findById(userId).select('fullName email phoneNumber');
    if (user) {
      await EventRegistration.create({
        event: eventId,
        user: userId,
        fullName: user.fullName || 'Unknown User',
        email: user.email || 'unknown@user.com',
        phoneNumber: user.phoneNumber || '',
        paymentStatus: event.isPaid ? 'Completed' : 'Free',
        attendanceStatus: 'Registered'
      });
    }
  } catch (err) {
    console.error('Failed to create EventRegistration document:', err.message);
    // Non-blocking: we still have the userId in the event.registrations array
  }

  // Invalidate cache for this user so they see "Registered" status immediately
  cacheDel(`event:${eventId}:${userId}`).catch(() => {});

  return { message: 'Successfully registered for event' };
}

async function unregisterFromEvent(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const index = event.registrations.indexOf(userId);
  if (index === -1) {
    throw new ApiError(400, 'Not registered for this event');
  }

  event.registrations.splice(index, 1);
  await event.save();

  return { message: 'Successfully unregistered from event' };
}

async function getUserEvents(userId) {
  return Event.find({
    registrations: userId,
    status: { $in: ['upcoming', 'live'] },
  })
    .sort('date')
    .populate('createdBy', 'fullName')
    .lean();
}

module.exports = {
  listEvents,
  getEventById,
  getFeaturedEvents,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
};
