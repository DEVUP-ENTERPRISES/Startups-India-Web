const { leanResult } = require('./setup');
const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const { Settings } = require('../src/models/Settings');
const { computeEvaluationFee } = require('../src/modules/grants/grant.settings');
const adminService = require('../src/modules/admin/admin.service');

const { cacheDel } = require('../src/infrastructure/cache/redis');
const { GRANT_SETTINGS_CACHE_KEY } = require('../src/modules/grants/grant.settings');

afterEach(async () => {
  mock.restoreAll();
  await cacheDel(GRANT_SETTINGS_CACHE_KEY);
});

test('fee stored as a string is summed numerically, not concatenated', async () => {
  mock.method(Settings, 'find', () => leanResult([{ key: 'grant.evaluation.fee', value: '149900' }]));
  const fee = await computeEvaluationFee();
  assert.equal(fee.baseAmount, 149900);
  assert.equal(fee.gstAmount, 26982);
  assert.equal(fee.totalAmount, 176882);
  assert.equal(typeof fee.totalAmount, 'number');
});

test('defaults apply when no override exists', async () => {
  mock.method(Settings, 'find', () => leanResult([]));
  const fee = await computeEvaluationFee();
  assert.equal(fee.totalAmount, 176882);
  assert.equal(fee.currency, 'INR');
});

test('non-numeric stored fee fails closed instead of quoting a bogus amount', async () => {
  mock.method(Settings, 'find', () => leanResult([{ key: 'grant.evaluation.fee', value: 'abc' }]));
  await assert.rejects(computeEvaluationFee(), err => err.statusCode === 500 || err.status === 500);
});

test('generic admin settings route validates grant keys and stores numbers', async () => {
  const writes = [];
  mock.method(Settings, 'findOneAndUpdate', async (filter, update) => {
    writes.push({ filter, update });
    return { key: filter.key, ...update };
  });
  mock.method(Settings, 'find', () => leanResult([]));
  mock.method(Settings, 'findOne', async filter => ({ key: filter.key }));

  await adminService.upsertSetting({ key: 'grant.evaluation.fee', value: '149900', category: 'grant', updatedBy: 'u1' });

  assert.equal(writes.length, 1);
  assert.equal(writes[0].update.value, 149900);
  assert.equal(writes[0].update.category, 'grant');
});

test('generic admin settings route rejects an invalid grant fee without writing', async () => {
  const write = mock.method(Settings, 'findOneAndUpdate', async () => ({}));
  await assert.rejects(
    adminService.upsertSetting({ key: 'grant.evaluation.fee', value: 'twelve', category: 'grant', updatedBy: 'u1' }),
    err => err.statusCode === 400 || err.status === 400
  );
  assert.equal(write.mock.callCount(), 0);
});

test('generic admin settings route rejects unknown grant keys', async () => {
  const write = mock.method(Settings, 'findOneAndUpdate', async () => ({}));
  await assert.rejects(
    adminService.upsertSetting({ key: 'grant.evaluation.discount', value: 1, category: 'general', updatedBy: 'u1' }),
    err => err.statusCode === 400 || err.status === 400
  );
  assert.equal(write.mock.callCount(), 0);
});

test('non-grant settings keep the original free-form behaviour', async () => {
  const write = mock.method(Settings, 'findOneAndUpdate', async (filter, update) => ({ key: filter.key, ...update }));
  const saved = await adminService.upsertSetting({ key: 'seo.title', value: 'Hello', category: 'seo', updatedBy: 'u1' });
  assert.equal(write.mock.callCount(), 1);
  assert.equal(saved.value, 'Hello');
});
