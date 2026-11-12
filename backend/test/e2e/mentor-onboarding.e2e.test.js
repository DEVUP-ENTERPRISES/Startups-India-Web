const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

test('mentor journey: apply -> admin sees no password hash -> approve -> mentor signs in', async () => {
  const admin = await h.makeAdmin(await h.signup());
  const email = `mentor${Date.now()}@example.com`;
  const password = 'Ment0r!Passw0rd';

  const apply = await h.api('POST', '/api/v1/mentors/apply', {
    body: {
      fullName: 'Asha Mentor',
      email,
      password,
      phone: '9876543210',
      profileImage: 'https://bucket.s3.ap-south-1.amazonaws.com/mentors/asha.jpg',
      currentRole: 'Founder',
      company: 'Acme',
      expertise: ['Fundraising'],
      bio: 'Built and sold two startups.',
      status: 'approved',
    },
  });
  assert.ok(apply.status < 300, JSON.stringify(apply.body));

  const { MentorApplication } = require('../../src/models/MentorApplication');
  const stored = await MentorApplication.findOne({ email }).lean();
  assert.notEqual(stored.status, 'approved', 'a client must not self-approve');

  const list = await h.api('GET', '/api/v1/mentors/applications', { token: admin.token });
  assert.equal(list.status, 200);
  const raw = JSON.stringify(list.body);
  assert.ok(raw.includes(email));
  assert.ok(!/\$2[aby]\$/.test(raw), 'bcrypt hashes must not reach the admin UI');

  const approve = await h.api('PATCH', `/api/v1/mentors/applications/${stored._id}/approve`, { token: admin.token, body: {} });
  assert.equal(approve.status, 200, JSON.stringify(approve.body));

  const login = await h.api('POST', '/api/v1/auth/login', { body: { email, password } });
  assert.equal(login.status, 200, JSON.stringify(login.body));
  assert.equal(login.body.data.user.role, 'mentor');

  const dash = await h.api('GET', '/api/v1/mentors/me/profile', { token: login.body.data.session.access_token });
  assert.equal(dash.status, 200);
});

test('the welcome mailer cannot be triggered anonymously or by non-admins', async () => {
  const body = { email: 'victim@example.com', fullName: '<a href="https://evil">Claim prize</a>' };
  assert.equal((await h.api('POST', '/api/v1/mentors/welcome', { body })).status, 401);
  const user = await h.signup();
  assert.equal((await h.api('POST', '/api/v1/mentors/welcome', { token: user.token, body })).status, 403);
});
