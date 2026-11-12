const { leanResult } = require('./setup');
const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const { Payment } = require('../src/modules/payments/payment.model');
const { EvaluationPayment, GrantApplication } = require('../src/modules/grants/grant.models');
const payments = require('../src/modules/payments/payments.service');
const grantPayments = require('../src/modules/grants/grant.payment.service');

afterEach(() => mock.restoreAll());

function checkoutSignature(orderId, paymentId) {
  return crypto.createHmac('sha256', 'test-razorpay-secret').update(`${orderId}|${paymentId}`).digest('hex');
}

function signedWebhook(event) {
  const raw = Buffer.from(JSON.stringify(event));
  const sig = crypto.createHmac('sha256', 'test-webhook-secret').update(raw).digest('hex');
  return { raw, sig };
}

function capturedEvent(orderId, amount, currency = 'INR') {
  return {
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_1', order_id: orderId, amount, currency } } },
  };
}

test('checkout signature: valid accepted, wrong/short/non-string rejected without throwing', () => {
  const good = checkoutSignature('order_1', 'pay_1');
  assert.equal(payments.verifyRazorpaySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: good }), true);
  assert.equal(payments.verifyRazorpaySignature({ orderId: 'order_1', paymentId: 'pay_2', signature: good }), false);
  assert.equal(payments.verifyRazorpaySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: 'abc' }), false);
  assert.equal(payments.verifyRazorpaySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: undefined }), false);
});

test('webhook with a bad signature is acknowledged but not processed', async () => {
  const find = mock.method(Payment, 'findOne', () => leanResult(null));
  const { raw } = signedWebhook(capturedEvent('order_x', 100));
  const result = await payments.processRazorpayWebhook(raw, 'deadbeef');
  assert.equal(result.error, 'invalid_signature');
  assert.equal(find.mock.callCount(), 0);
});

test('webhook settles a grant evaluation order when no course/event payment exists', async () => {
  mock.method(Payment, 'findOne', () => leanResult(null));
  const order = { _id: 'ep1', userId: 'u1', applicationId: 'a1', status: 'failed', totalAmount: 176882, currency: 'INR' };
  mock.method(EvaluationPayment, 'findOne', () => leanResult(order));
  const settle = mock.method(EvaluationPayment, 'findOneAndUpdate', async (filter, update) => ({
    ...order,
    ...update.$set,
    save: async () => {},
  }));
  // Non-payable status keeps the test on the record-and-alert branch (no email/push side effects).
  mock.method(GrantApplication, 'findById', async () => ({ applicationId: 'GRANT-2026-000001', status: 'idea_evaluation_paid' }));

  const { raw, sig } = signedWebhook(capturedEvent('order_grant', 176882));
  const result = await payments.processRazorpayWebhook(raw, sig);

  assert.equal(result.grant, true);
  assert.equal(result.error, undefined);
  assert.equal(settle.mock.callCount(), 1);
  const [filter, update] = settle.mock.calls[0].arguments;
  assert.deepEqual(filter.status, { $in: ['created', 'failed', 'expired'] });
  assert.equal(update.$set.status, 'paid');
  assert.equal(update.$set.paymentId, 'pay_1');
});

test('webhook refuses to settle a grant order when the captured amount differs', async () => {
  mock.method(Payment, 'findOne', () => leanResult(null));
  mock.method(EvaluationPayment, 'findOne', () =>
    leanResult({ _id: 'ep1', status: 'created', totalAmount: 176882, currency: 'INR' })
  );
  const settle = mock.method(EvaluationPayment, 'findOneAndUpdate', async () => ({}));

  const { raw, sig } = signedWebhook(capturedEvent('order_grant', 118));
  const result = await payments.processRazorpayWebhook(raw, sig);

  assert.equal(result.error, 'amount_mismatch');
  assert.equal(settle.mock.callCount(), 0);
});

test('webhook for an unknown order is ignored', async () => {
  mock.method(Payment, 'findOne', () => leanResult(null));
  mock.method(EvaluationPayment, 'findOne', () => leanResult(null));
  const { raw, sig } = signedWebhook(capturedEvent('order_unknown', 100));
  const result = await payments.processRazorpayWebhook(raw, sig);
  assert.equal(result.ignored, true);
});

test('client verify with a bad signature rejects and leaves the order untouched', async () => {
  const save = mock.fn(async () => {});
  const order = { _id: 'ep1', userId: 'u1', status: 'created', save };
  mock.method(EvaluationPayment, 'findOne', async () => order);
  const settle = mock.method(EvaluationPayment, 'findOneAndUpdate', async () => ({}));

  await assert.rejects(
    grantPayments.verifyEvaluationPayment('u1', { orderId: 'order_1', paymentId: 'pay_1', signature: 'bad' }),
    err => err.statusCode === 400
  );
  assert.equal(order.status, 'created');
  assert.equal(save.mock.callCount(), 0);
  assert.equal(settle.mock.callCount(), 0);
});
