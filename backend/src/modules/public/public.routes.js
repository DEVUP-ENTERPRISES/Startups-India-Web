const { Router } = require('express');
const { asyncHandler } = require('../../utils/asyncHandler');
const ctrl = require('./public.controller');

const publicRouter = Router();

/**
 * @route POST /api/v1/public/inquiry
 * @desc Create a new inquiry/lead from the website
 * @access Public
 */
publicRouter.post('/inquiry', asyncHandler(ctrl.createInquiry));

module.exports = { publicRouter };
