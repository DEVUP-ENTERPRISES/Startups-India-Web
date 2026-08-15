const { State } = require('../../models/State');
const { City } = require('../../models/City');
const { College } = require('../../models/College');
const { Industry } = require('../../models/Industry');
const { ApiError } = require('../../utils/ApiError');

/** GET /api/v1/location/states */
async function getStates(req, res) {
  // isActive: false is an explicit soft-delete - omitting the filter includes
  // docs inserted without the field (seeded before the schema default existed).
  const states = await State.find({ isActive: { $ne: false } }).select('_id name code').sort('name').lean();
  res.json({ success: true, data: states });
}

/** GET /api/v1/location/cities?stateId= */
async function getCities(req, res) {
  const { stateId } = req.query;
  if (!stateId) throw new ApiError(400, 'stateId query param is required');
  const cities = await City.find({ state: stateId, isActive: { $ne: false } })
    .select('_id name')
    .sort('name')
    .lean();
  res.json({ success: true, data: cities });
}

/** GET /api/v1/location/colleges?cityId=&q= */
async function getColleges(req, res) {
  const { cityId, q } = req.query;
  if (!cityId) throw new ApiError(400, 'cityId query param is required');

  const filter = { city: cityId, isActive: { $ne: false } };
  if (q && q.trim()) {
    filter.name = { $regex: q.trim(), $options: 'i' };
  }

  const colleges = await College.find(filter)
    .select('_id name type isUserAdded')
    .sort('name')
    .limit(50)
    .lean();
  res.json({ success: true, data: colleges });
}

/** POST /api/v1/location/colleges - add a college not in the list */
async function addCollege(req, res) {
  const { name, cityId, stateId, type } = req.body;
  if (!name || !cityId || !stateId) {
    throw new ApiError(400, 'name, cityId, and stateId are required');
  }

  // Prevent duplicates (case-insensitive check)
  const existing = await College.findOne({
    name: { $regex: `^${name.trim()}$`, $options: 'i' },
    city: cityId,
  }).lean();

  if (existing) {
    return res.json({ success: true, data: existing, message: 'College already exists' });
  }

  const college = await College.create({
    name: name.trim(),
    city: cityId,
    state: stateId,
    type: type || 'Other',
    isUserAdded: true,
  });

  res.status(201).json({ success: true, data: college });
}

/** GET /api/v1/location/industries */
async function getIndustries(req, res) {
  const industries = await Industry.find({ isActive: true })
    .select('_id name category')
    .sort('name')
    .lean();
  res.json({ success: true, data: industries });
}

module.exports = { getStates, getCities, getColleges, addCollege, getIndustries };
