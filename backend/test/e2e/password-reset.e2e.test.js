const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

before(h.start);
after(h.stop);

async function plantResetToken(userId) {
  const { User } = require('../../src/modules/users/user.model');
  const raw = crypto.randomBytes(32).toString('hex');
  await User.updateOne(
    { _id: userId },
    {
      resetPasswordTokenHash: crypto.createHash('sha256').update(raw).digest('hex'),
      resetPasswordExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }
  );
  return raw;
}

test('forgot-password answers identically for known and unknown emails', async () => {
  const user = await h.signup();
  const known = await h.api('POST', '/api/v1/auth/forgot-password', { body: { email: user.email } });
  const unknown = await h.api('POST', '/api/v1/auth/forgot-password', { body: { email: 'ghost@example.com' } });
  assert.equal(known.status, unknown.status);
  assert.deepEqual(known.body, unknown.body);
});

test('reset is single-use, changes the password and revokes existing sessions', async () => {
  const user = await h.signup();
  const login = await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: user.password } });
  const oldRefresh = login.body.data.session.refresh_token;

  const token = await plantResetToken(user.id);
  const newPassword = 'N3w!Passw0rd-reset';
  const reset = await h.api('POST', '/api/v1/auth/reset-password', { body: { token, password: newPassword } });
  assert.equal(reset.status, 200, JSON.stringify(reset.body));

  const reuse = await h.api('POST', '/api/v1/auth/reset-password', { body: { token, password: 'An0ther!Passw0rd' } });
  assert.equal(reuse.status, 400);

  assert.equal((await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: user.password } })).status, 401);
  assert.equal((await h.api('POST', '/api/v1/auth/login', { body: { email: user.email, password: newPassword } })).status, 200);

  const stale = await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: oldRefresh, refresh_token: oldRefresh } });
  assert.equal(stale.status, 401, 'sessions from before the reset must be dead');
});

test('a guessed or expired reset token is rejected', async () => {
  const user = await h.signup();
  const { User } = require('../../src/modules/users/user.model');
  const guess = await h.api('POST', '/api/v1/auth/reset-password', {
    body: { token: crypto.randomBytes(32).toString('hex'), password: 'N3w!Passw0rd-x' },
  });
  assert.equal(guess.status, 400);

  const token = await plantResetToken(user.id);
  await User.updateOne({ _id: user.id }, { resetPasswordExpiresAt: new Date(Date.now() - 1000) });
  const expired = await h.api('POST', '/api/v1/auth/reset-password', { body: { token, password: 'N3w!Passw0rd-y' } });
  assert.equal(expired.status, 400);
});

test('refresh tokens rotate with a short reuse window for concurrent tabs', async () => {
  const { User } = require('../../src/modules/users/user.model');
  const user = await h.signup();
  const r1 = user.refresh;
  const refresh = t => h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: t } });

  const first = await refresh(r1);
  assert.equal(first.status, 200);
  const r2 = first.body.data.session.refresh_token;
  assert.notEqual(r2, r1);

  assert.equal((await refresh(r1)).status, 200, 'a second tab racing with the old token is tolerated');

  await User.updateOne({ _id: user.id }, { refreshTokenRotatedAt: new Date(Date.now() - 5 * 60 * 1000) });
  assert.equal((await refresh(r1)).status, 401, 'outside the window the old token is dead');
  assert.equal((await refresh(r2)).status, 401, 'a token two rotations old is dead');
});

test('logout ends the session even inside the reuse window', async () => {
  const user = await h.signup();
  const { refresh: r1, token: access } = user;
  const rotated = await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: r1 } });
  const r2 = rotated.body.data.session.refresh_token;

  await h.api('POST', '/api/v1/auth/logout', { token: access, body: {} });
  assert.equal((await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: r1 } })).status, 401);
  assert.equal((await h.api('POST', '/api/v1/auth/refresh', { body: { refreshToken: r2 } })).status, 401);
});
