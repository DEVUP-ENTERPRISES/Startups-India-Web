require('./setup');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { errorMiddleware } = require('../src/middlewares/errorMiddleware');
const { ApiError } = require('../src/utils/apiError');

async function call(nodeEnv, error) {
  const app = express();
  app.use((req, res, next) => ((req.requestId = 'req-123'), next()));
  app.get('/x', () => {
    throw error;
  });
  app.use(errorMiddleware);
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = nodeEnv;
  const server = app.listen(0);
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/x`);
    return { status: res.status, body: await res.json() };
  } finally {
    process.env.NODE_ENV = previous;
    server.close();
  }
}

test('production 5xx hides internals and returns a support reference', async () => {
  const { status, body } = await call('production', new TypeError("Cannot read properties of undefined (reading 'x')"));
  assert.equal(status, 500);
  assert.match(body.message, /on our side/);
  assert.equal(body.reference, 'req-123');
  assert.ok(!JSON.stringify(body).includes('Cannot read'));
  assert.equal(body.stack, undefined);
});

test('production 4xx keeps the actionable message', async () => {
  const { status, body } = await call('production', new ApiError(403, 'You are not enrolled in this course'));
  assert.equal(status, 403);
  assert.equal(body.message, 'You are not enrolled in this course');
});
