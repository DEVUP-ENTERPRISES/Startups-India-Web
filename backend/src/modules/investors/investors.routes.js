const express = require('express');
const router = express.Router();
const investorsController = require('./investors.controller');
const { authRequired } = require('../../middlewares/authMiddleware');

router.post('/request', authRequired, investorsController.submitRequest);
router.post('/explore', authRequired, investorsController.exploreRequest);

module.exports = router;
