const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

let seq = 0;
async function seedEvent(overrides = {}) {
  const { Event } = require('../../src/models/Event');
  seq += 1;
  return Event.create({
    title: `Founder Summit ${seq}`,
    slug: `founder-summit-${seq}`,
    date: new Date(Date.now() + 7 * 864e5),
    status: 'upcoming',
    isPaid: true,
    price: 99900,
    ticketTypes: [
      { name: 'General', price: 99900 },
      { name: 'VIP', price: 499900 },
    ],
    coupons: [
      { code: 'HALF', discountType: 'percent', discountValue: 50 },
      { code: 'FREEPASS', discountType: 'percent', discountValue: 100 },
    ],
    ...overrides,
  });
}

test('a paid event cannot be joined through the free registration endpoint', async () => {
  const event = await seedEvent();
  const user = await h.signup();
  const res = await h.api('POST', `/api/v1/events/${event._id}/register`, {
    token: user.token,
    body: { ticketTypeName: 'VIP', fromVerifiedPayment: true, ticketPrice: 0 },
  });
  assert.equal(res.status, 400);
});

test('ticket and coupon prices are computed server-side', async () => {
  const event = await seedEvent();
  const user = await h.signup();

  await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { eventId: String(event._id), ticketTypeName: 'VIP', amount: 100 },
  });
  assert.equal(h.orders.at(-1).amount, 499900);

  await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { eventId: String(event._id), ticketTypeName: 'VIP', couponCode: 'half', amount: 100 },
  });
  assert.equal(h.orders.at(-1).amount, 249950);

  await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { eventId: String(event._id), ticketTypeName: 'VIP', couponCode: 'BOGUS', amount: 100 },
  });
  assert.equal(h.orders.at(-1).amount, 499900, 'an invalid coupon must not discount');
});

test('paid registration: order -> verify -> registered once, coupon counted once', async () => {
  const event = await seedEvent();
  const user = await h.signup();
  const order = await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { eventId: String(event._id), ticketTypeName: 'General', couponCode: 'HALF' },
  });
  assert.equal(order.status, 201, JSON.stringify(order.body));
  const orderId = h.orders.at(-1).id;
  const body = { orderId, paymentId: 'pay_evt_1', signature: h.checkoutSignature(orderId, 'pay_evt_1'), eventId: String(event._id) };

  const first = await h.api('POST', '/api/v1/payments/razorpay/verify', { token: user.token, body });
  assert.equal(first.status, 200, JSON.stringify(first.body));
  const replay = await h.api('POST', '/api/v1/payments/razorpay/verify', { token: user.token, body });
  assert.ok(replay.status < 500);

  const { EventRegistration } = require('../../src/models/EventRegistration');
  const { Event } = require('../../src/models/Event');
  assert.equal(await EventRegistration.countDocuments({ event: event._id }), 1);
  const fresh = await Event.findById(event._id).lean();
  assert.equal(fresh.coupons.find(c => c.code === 'HALF').usedCount, 1);
});

test('a 100% coupon registers for free without payment', async () => {
  const event = await seedEvent();
  const user = await h.signup();
  const res = await h.api('POST', `/api/v1/events/${event._id}/register`, {
    token: user.token,
    body: { ticketTypeName: 'General', couponCode: 'FREEPASS' },
  });
  assert.equal(res.status, 200, JSON.stringify(res.body));
});

test('guest checkout: price from server, registration created by verify', async () => {
  const event = await seedEvent({ registrationType: 'guest' });
  const guest = { fullName: 'Guest One', email: `guest${Date.now()}@example.com`, phoneNumber: '9876543210' };
  const order = await h.api('POST', '/api/v1/payments/razorpay/guest/order', {
    body: { eventId: String(event._id), ticketTypeName: 'General', amount: 1, guest, metadata: { isGuest: false } },
  });
  assert.equal(order.status, 201, JSON.stringify(order.body));
  assert.equal(h.orders.at(-1).amount, 99900);

  const orderId = h.orders.at(-1).id;
  const verify = await h.api('POST', '/api/v1/payments/razorpay/guest/verify', {
    body: { orderId, paymentId: 'pay_guest_1', signature: h.checkoutSignature(orderId, 'pay_guest_1') },
  });
  assert.equal(verify.status, 200, JSON.stringify(verify.body));

  const { EventRegistration } = require('../../src/models/EventRegistration');
  assert.equal(await EventRegistration.countDocuments({ event: event._id, email: guest.email }), 1);
});
