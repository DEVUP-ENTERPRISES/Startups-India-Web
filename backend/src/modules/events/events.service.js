const { Event } = require('../../models/Event');
const { ApiError } = require('../../utils/ApiError');

async function listEvents({ page = 1, limit = 20, category, status = 'upcoming', sort = 'date' }) {
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;

  const total = await Event.countDocuments(query);
  const events = await Event.find(query)
    .populate('createdBy', 'fullName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    events,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

async function getEventById(id) {
  const event = await Event.findById(id).populate('createdBy', 'fullName');
  if (!event) throw new ApiError(404, 'Event not found');
  return event;
}

async function getFeaturedEvents(limit = 6) {
  return Event.find({ status: 'upcoming' })
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
