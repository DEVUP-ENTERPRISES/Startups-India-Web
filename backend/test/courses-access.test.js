const { leanResult } = require('./setup');
const { test, before, after, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { Lesson, Course } = require('../src/modules/courses/course.model');
const { Enrollment } = require('../src/modules/enrollments/enrollment.model');
const coursesService = require('../src/modules/courses/courses.service');
const env = require('../src/config/env');

let server;
let base;
const token = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'user' }, 'test-access-secret');
const COURSE = '507f1f77bcf86cd799439012';

before(async () => {
  const { app } = require('../src/app');
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise(resolve => server.close(resolve)));
afterEach(() => mock.restoreAll());

function chain(value) {
  const q = { select: () => q, sort: () => q, lean: async () => value };
  return q;
}

test('public lesson listing strips paid content from non-preview lessons', async () => {
  mock.method(Lesson, 'find', () =>
    chain([
      { title: 'Intro', isPreview: true, sortOrder: 1, videoUrl: 'https://cdn/intro.mp4', readingContent: 'free' },
      { title: 'Paid', isPreview: false, sortOrder: 2, videoUrl: 'https://cdn/paid.mp4', readingContent: 'secret' },
    ])
  );
  const lessons = await coursesService.listLessonsByModule('m1');
  assert.equal(lessons[0].videoUrl, 'https://cdn/intro.mp4');
  assert.equal(lessons[1].videoUrl, undefined);
  assert.equal(lessons[1].readingContent, undefined);
  assert.equal(lessons[1].title, 'Paid');
});

test('public lesson listing never selects quiz answers or attachments', async () => {
  const find = mock.method(Lesson, 'find', () => {
    const q = chain([]);
    q.select = fields => {
      q.fields = fields;
      return q;
    };
    find.lastQuery = q;
    return q;
  });
  await coursesService.listLessonsByModule('m1');
  const fields = find.lastQuery.fields.split(' ');
  for (const hidden of ['quizQuestions', 'attachments', 'videoKey', 'assignmentInstructions']) {
    assert.ok(!fields.includes(hidden), `${hidden} must not be selected`);
  }
});

test('course materials require authentication', async () => {
  const res = await fetch(`${base}/api/v1/courses/${COURSE}/materials`);
  assert.equal(res.status, 401);
});

test('course materials are refused to a signed-in user who is not enrolled', async () => {
  mock.method(Enrollment, 'findOne', () => leanResult(null));
  const res = await fetch(`${base}/api/v1/courses/${COURSE}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 403);
});

test('course materials are served to an enrolled user', async () => {
  mock.method(Enrollment, 'findOne', () => leanResult({ status: 'active' }));
  mock.method(Course, 'findById', () => chain({ title: 'C', materials: [{ title: 'Deck' }] }));
  const res = await fetch(`${base}/api/v1/courses/${COURSE}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.data.materials[0].title, 'Deck');
});

test('admin routes get the stricter admin rate limit', async () => {
  const res = await fetch(`${base}/api/v1/${env.ADMIN_SLUG}/users`);
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('ratelimit-limit'), '120');
});
