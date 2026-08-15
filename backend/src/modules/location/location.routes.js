const express = require('express');
const { asyncHandler } = require('../../utils/asyncHandler');
const ctrl = require('./location.controller');

const router = express.Router();

// All public - no auth needed during onboarding
router.get('/states', asyncHandler(ctrl.getStates));
router.get('/cities', asyncHandler(ctrl.getCities));
router.get('/colleges', asyncHandler(ctrl.getColleges));
router.post('/colleges', asyncHandler(ctrl.addCollege));
router.get('/industries', asyncHandler(ctrl.getIndustries));

module.exports = { locationRouter: router };
