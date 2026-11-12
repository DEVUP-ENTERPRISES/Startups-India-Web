const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

const draft = user => ({
  founder: { fullName: user.fullName, email: user.email },
  startup: {
    name: 'Acme Agritech',
    stage: 'Idea',
    category: 'AgriTech',
    problemStatement: 'Farmers lose 30% of produce post-harvest.',
    solution: 'Solar cold storage rented per crate.',
  },
});

async function createDraft(user) {
  const res = await h.api('POST', '/api/v1/grants/applications', { token: user.token, body: draft(user) });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.data._id || res.body.data.id;
}

test('founder journey: draft -> order at server price -> verify -> paid, idempotent replay', async () => {
  const user = await h.signup();
  const appId = await createDraft(user);

  const order = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: user.token });
  assert.equal(order.status, 201, JSON.stringify(order.body));
  assert.equal(order.body.data.totalAmount, 176882);
  assert.equal(h.orders.at(-1).amount, 176882, 'Razorpay order must carry the server-computed amount');

  const orderId = order.body.data.orderId;
  const forged = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/verify`, {
    token: user.token,
    body: { orderId, paymentId: 'pay_x', signature: 'f'.repeat(64) },
  });
  assert.equal(forged.status, 400);

  const body = { orderId, paymentId: 'pay_e2e_1', signature: h.checkoutSignature(orderId, 'pay_e2e_1') };
  const paid = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/verify`, { token: user.token, body });
  assert.equal(paid.status, 200, JSON.stringify(paid.body));
  assert.equal(paid.body.data.alreadyPaid, false);
  assert.ok(paid.body.data.invoiceNumber);

  const replay = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/verify`, { token: user.token, body });
  assert.equal(replay.body.data.alreadyPaid, true);

  const again = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: user.token });
  assert.equal(again.status, 409, 'must not take the fee twice');

  const app = await h.api('GET', `/api/v1/grants/applications/${appId}`, { token: user.token });
  assert.ok(JSON.stringify(app.body).includes('idea_evaluation_paid'));

  const invoice = await h.api('GET', `/api/v1/grants/applications/${appId}/invoice`, { token: user.token });
  assert.equal(invoice.status, 200);
  assert.equal(invoice.body.data.totalAmount, 176882);
});

test("another founder cannot read, pay for or invoice someone else's application", async () => {
  const owner = await h.signup();
  const intruder = await h.signup();
  const appId = await createDraft(owner);

  assert.equal((await h.api('GET', `/api/v1/grants/applications/${appId}`, { token: intruder.token })).status, 404);
  assert.equal(
    (await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: intruder.token })).status,
    404
  );
  assert.equal((await h.api('GET', `/api/v1/grants/applications/${appId}/invoice`, { token: intruder.token })).status, 404);

  const order = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: owner.token });
  const orderId = order.body.data.orderId;
  const steal = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/verify`, {
    token: intruder.token,
    body: { orderId, paymentId: 'pay_i', signature: h.checkoutSignature(orderId, 'pay_i') },
  });
  assert.equal(steal.status, 404, "an intruder must not settle another user's order");
});

test('founder who closes the tab is settled by the signed webhook', async () => {
  const user = await h.signup();
  const appId = await createDraft(user);
  const order = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: user.token });
  const { orderId, totalAmount } = order.body.data;

  const short = h.signWebhook({
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_short', order_id: orderId, amount: 100, currency: 'INR' } } },
  });
  await h.api('POST', '/api/v1/payments/razorpay/webhook', {
    raw: short.raw,
    headers: { 'x-razorpay-signature': short.sig },
  });
  let summary = await h.api('GET', `/api/v1/grants/applications/${appId}/evaluation`, { token: user.token });
  assert.equal(summary.body.data.paid, false, 'an underpaid capture must not settle');

  const hook = h.signWebhook({
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_hook', order_id: orderId, amount: totalAmount, currency: 'INR' } } },
  });
  const res = await h.api('POST', '/api/v1/payments/razorpay/webhook', {
    raw: hook.raw,
    headers: { 'x-razorpay-signature': hook.sig },
  });
  assert.equal(res.status, 200);

  summary = await h.api('GET', `/api/v1/grants/applications/${appId}/evaluation`, { token: user.token });
  assert.equal(summary.body.data.paid, true);
  assert.equal(summary.body.data.status, 'idea_evaluation_paid');
});

test('admin fee entered as text through the generic settings page prices checkout correctly', async () => {
  const admin = await h.makeAdmin(await h.signup());
  const slug = h.adminSlug();

  const bad = await h.api('POST', `/api/v1/${slug}/settings`, {
    token: admin.token,
    body: { key: 'grant.evaluation.fee', value: 'twelve', category: 'grant' },
  });
  assert.equal(bad.status, 400);

  const set = await h.api('POST', `/api/v1/${slug}/settings`, {
    token: admin.token,
    body: { key: 'grant.evaluation.fee', value: '99900', category: 'grant' },
  });
  assert.equal(set.status, 200, JSON.stringify(set.body));

  const user = await h.signup();
  const appId = await createDraft(user);
  const order = await h.api('POST', `/api/v1/grants/applications/${appId}/evaluation/order`, { token: user.token });
  assert.equal(order.body.data.totalAmount, 117882);
  assert.equal(typeof order.body.data.totalAmount, 'number');

  await h.api('POST', `/api/v1/${slug}/settings`, {
    token: admin.token,
    body: { key: 'grant.evaluation.fee', value: '149900', category: 'grant' },
  });
});
