require('./setup');
const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const { Payment } = require('../src/modules/payments/payment.model');
const { Enrollment } = require('../src/modules/enrollments/enrollment.model');
const enrollments = require('../src/modules/enrollments/enrollments.service');

afterEach(() => mock.restoreAll());

test('reconciliation uses one aggregation and no per-payment enrollment lookups', async () => {
  const aggregate = mock.method(Payment, 'aggregate', async () => []);
  const findOne = mock.method(Enrollment, 'findOne', () => {
    throw new Error('N+1 lookup');
  });

  await enrollments.reconcileOrphanedPayments();

  assert.equal(aggregate.mock.callCount(), 1);
  assert.equal(findOne.mock.callCount(), 0);
  const pipeline = aggregate.mock.calls[0].arguments[0];
  assert.deepEqual(pipeline[0].$match, { status: 'succeeded', courseId: { $ne: null } });
  assert.equal(pipeline[1].$lookup.from, Enrollment.collection.name);
  assert.deepEqual(pipeline[2].$match, { enrollment: { $size: 0 } });
});

test('reconciliation swallows database errors so boot is not blocked', async () => {
  mock.method(Payment, 'aggregate', async () => {
    throw new Error('db down');
  });
  await assert.doesNotReject(enrollments.reconcileOrphanedPayments());
});
