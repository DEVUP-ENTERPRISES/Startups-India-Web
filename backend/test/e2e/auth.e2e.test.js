const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

test('signup issues a session and never returns the password hash', async () => {
  const user = await h.signup();
  assert.ok(user.token);
  assert.ok(!JSON.stringify(user.res.body).includes('passwordHash'));
  assert.ok(!JSON.stringify(user.res.body).match(/\$2[aby]\$/), 'bcrypt hash leaked');
});

test('duplicate signup is rejected', async () => {
  const user = await h.signup();
  const again = await h.api('POST', '/api/v1/auth/signup', {
    body: { email: user.email, password: 'An0ther!Passw0rd', fullName: 'X' },
  });
  assert.ok([400, 409].includes(again.status), `got ${again.status}`);
});

test('login: wrong password fails, correct password succeeds, /me works', async () => {
  const user = await h.signup();
  const bad = await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: 'wrong-password' } });
  assert.equal(bad.status, 401);

  const unknown = await h.api('POST', '/api/v1/auth/login', {
    body: { email: 'nobody@example.com', password: 'wrong-password' },
  });
  assert.equal(unknown.status, bad.status, 'unknown email must look identical to a wrong password');

  const ok = await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: user.password } });
  assert.equal(ok.status, 200);
  const me = await h.api('GET', '/api/v1/auth/me', { token: ok.body.data.session.access_token });
  assert.equal(me.status, 200);
  assert.ok(JSON.stringify(me.body).includes(user.email));
  assert.ok(!JSON.stringify(me.body).includes('passwordHash'));
});

test('refresh token yields a new access token; access token is not accepted as refresh', async () => {
  const user = await h.signup();
  const login = await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: user.password } });
  const { refresh_token: refresh, access_token: access } = login.body.data.session;

  const refreshed = await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: refresh, refresh_token: refresh } });
  assert.equal(refreshed.status, 200, JSON.stringify(refreshed.body));

  const misuse = await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: access, refresh_token: access } });
  assert.equal(misuse.status, 401);
});

test('protected and admin routes reject anonymous and non-admin callers', async () => {
  const user = await h.signup();
  assert.equal((await h.api('GET', '/api/v1/grants/applications')).status, 401);
  assert.equal((await h.api('GET', `/api/v1/${h.adminSlug()}/users`, { token: user.token })).status, 403);
  assert.equal((await h.api('GET', '/api/v1/crm/lists', { token: user.token })).status, 403);
  assert.equal((await h.api('GET', '/api/v1/admin/users', { token: user.token })).status, 404);
});

test('forged token signed with another secret is rejected', async () => {
  const jwt = require('jsonwebtoken');
  const forged = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'admin' }, 'not-the-secret');
  assert.equal((await h.api('GET', `/api/v1/${h.adminSlug()}/users`, { token: forged })).status, 401);
});

test('NoSQL operator injection in login is neutralised', async () => {
  const res = await h.api('POST', '/api/v1/auth/login', {
    body: { email: { $gt: '' }, password: { $gt: '' } },
  });
  assert.ok([400, 401].includes(res.status), `got ${res.status}`);
});
