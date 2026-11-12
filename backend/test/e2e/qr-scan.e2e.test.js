const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

async function seedCampaign(name) {
  const { Campaign } = require('../../src/models/Campaign');
  const { TrackingLink } = require('../../src/models/TrackingLink');
  const campaign = await Campaign.create({ name, route: '/programs' });
  const link = await TrackingLink.create({ campaign: campaign._id, destinationUrl: 'https://startupsindia.in/programs' });
  return { campaign, link };
}

const scan = (utmCampaign, ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile') =>
  h.api('POST', '/api/v1/campaigns/scan', { body: { utmCampaign, ip: '1.2.3.4' }, headers: { 'User-Agent': ua } });

test('a QR landing is counted once per visitor, from the printed slug format', async () => {
  const { campaign, link } = await seedCampaign('Diwali Founder Fest');
  const { TrackingLink } = require('../../src/models/TrackingLink');
  const { CampaignScan } = require('../../src/models/CampaignScan');

  const first = await scan('diwali_founder_fest');
  assert.equal(first.status, 200);
  assert.equal(first.body.tracked, true);

  const reload = await scan('diwali_founder_fest');
  assert.equal(reload.body.tracked, false, 'a reload by the same visitor must not inflate scans');

  const other = await scan('diwali_founder_fest', 'Mozilla/5.0 (Windows NT 10.0) Chrome/120');
  assert.equal(other.body.tracked, true);

  assert.equal((await TrackingLink.findById(link._id).lean()).scanCount, 2);
  const rows = await CampaignScan.find({ campaign: campaign._id }).lean();
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(r => r.deviceType).sort(), ['desktop', 'mobile']);
});

test('the visitor identity ignores an IP supplied in the body', async () => {
  const { campaign } = await seedCampaign('Spoof Check');
  const { CampaignScan } = require('../../src/models/CampaignScan');
  await h.api('POST', '/api/v1/campaigns/scan', { body: { utmCampaign: 'spoof_check', ip: '9.9.9.9' } });
  await h.api('POST', '/api/v1/campaigns/scan', { body: { utmCampaign: 'spoof_check', ip: '8.8.8.8' } });
  assert.equal(await CampaignScan.countDocuments({ campaign: campaign._id }), 1);
});

test('unknown campaigns and junk input are ignored safely', async () => {
  assert.equal((await scan('no_such_campaign')).body.tracked, false);
  const junk = await h.api('POST', '/api/v1/campaigns/scan', { body: { utmCampaign: { $ne: null } } });
  assert.equal(junk.status, 200);
  assert.equal(junk.body.tracked, false);
});
