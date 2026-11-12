const crypto = require('crypto');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'e2e-access-secret';
process.env.JWT_REFRESH_SECRET = 'e2e-refresh-secret';
process.env.RAZORPAY_KEY_ID = 'rzp_test_e2e';
process.env.RAZORPAY_KEY_SECRET = 'e2e-razorpay-secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'e2e-webhook-secret';
process.env.REDIS_URL = 'redis://127.0.0.1:1';
process.env.SMTP_HOST = '';
process.env.ADMIN_EMAIL = '';
process.env.TWO_FACTOR_ENABLED = 'false';
process.env.SMS_PROVIDER = 'console';
process.env.LOG_LEVEL = 'error';

const orders = [];

// Razorpay SDK stand-in so no real order, money or network call is ever involved.
class FakeRazorpay {
  constructor() {
    this.orders = {
      create: async ({ amount, currency, receipt, notes }) => {
        const order = { id: `order_e2e_${orders.length + 1}`, amount, currency, receipt, notes, status: 'created' };
        orders.push(order);
        return order;
      },
    };
    this.payments = { fetch: async id => ({ id, status: 'captured' }) };
  }
}
const razorpayPath = require.resolve('razorpay', { paths: [path.join(__dirname, '..', '..')] });
require.cache[razorpayPath] = { id: razorpayPath, filename: razorpayPath, loaded: true, exports: FakeRazorpay };

let mongo;
let server;
let base;

async function start() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('e2e');

  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  const { app } = require('../../src/app');
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
}

async function stop() {
  const mongoose = require('mongoose');
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}

async function api(method, url, { token, body, raw, headers = {} } = {}) {
  const res = await fetch(base + url, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(raw ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
    redirect: 'manual',
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, body: json, headers: res.headers };
}

let seq = 0;
async function signup(overrides = {}) {
  seq += 1;
  const creds = {
    email: `founder${seq}-${Date.now()}@example.com`,
    password: 'Str0ng!Passw0rd',
    fullName: `Founder ${seq}`,
    ...overrides,
  };
  const res = await api('POST', '/api/v1/auth/signup', { body: creds });
  if (res.status !== 201) throw new Error(`signup failed ${res.status} ${JSON.stringify(res.body)}`);
  const { access_token: token, refresh_token: refresh } = res.body.data.session;
  return { ...creds, id: res.body.data.user.id, token, refresh, res };
}

async function makeAdmin(user) {
  const { User } = require('../../src/modules/users/user.model');
  await User.updateOne({ _id: user.id }, { role: 'admin' });
  const login = await api('POST', '/api/v1/auth/login', { body: { email: user.email, password: user.password } });
  return { ...user, token: login.body.data.session.access_token };
}

function checkoutSignature(orderId, paymentId) {
  return crypto.createHmac('sha256', 'e2e-razorpay-secret').update(`${orderId}|${paymentId}`).digest('hex');
}

function signWebhook(event) {
  const raw = JSON.stringify(event);
  const sig = crypto.createHmac('sha256', 'e2e-webhook-secret').update(raw).digest('hex');
  return { raw, sig };
}

module.exports = {
  start,
  stop,
  api,
  signup,
  makeAdmin,
  checkoutSignature,
  signWebhook,
  orders,
  adminSlug: () => require('../../src/config/env').ADMIN_SLUG,
};
