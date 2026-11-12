const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

test('a demoted admin loses access immediately, without waiting for token expiry', async () => {
  const admin = await h.makeAdmin(await h.signup());
  const url = `/api/v1/${h.adminSlug()}/settings`;
  assert.equal((await h.api('GET', url, { token: admin.token })).status, 200);

  const { User } = require('../../src/modules/users/user.model');
  await User.updateOne({ _id: admin.id }, { role: 'startup' });
  assert.equal((await h.api('GET', url, { token: admin.token })).status, 403);
});

test('a deactivated or deleted admin loses access immediately', async () => {
  const { User } = require('../../src/modules/users/user.model');
  const url = `/api/v1/${h.adminSlug()}/settings`;

  const a = await h.makeAdmin(await h.signup());
  await User.updateOne({ _id: a.id }, { isActive: false });
  assert.equal((await h.api('GET', url, { token: a.token })).status, 403);

  const b = await h.makeAdmin(await h.signup());
  await User.deleteOne({ _id: b.id });
  assert.equal((await h.api('GET', url, { token: b.token })).status, 403);
  assert.equal((await h.api('GET', '/api/v1/crm/lists', { token: b.token })).status, 403);
  assert.equal((await h.api('GET', `/api/v1/${h.adminSlug()}/grants/settings`, { token: b.token })).status, 403);
});

test('a forged admin claim for a real non-admin user is refused', async () => {
  const user = await h.signup();
  const jwt = require('jsonwebtoken');
  const forged = jwt.sign({ sub: user.id, role: 'admin' }, 'e2e-access-secret');
  assert.equal((await h.api('GET', `/api/v1/${h.adminSlug()}/settings`, { token: forged })).status, 403);
});
