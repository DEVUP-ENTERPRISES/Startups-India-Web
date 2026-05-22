const express = require('express');
const router = express.Router();
const investorsController = require('./investors.controller');
const { auth } = require('../../middleware/auth');

router.post('/request', auth, investorsController.submitRequest);
router.post('/explore', auth, investorsController.exploreRequest);

module.exports = router;
