const express = require('express');
const router = express.Router();
const guideRatingsController = require('../controllers/guideRatingsController');

router.get('/top', guideRatingsController.getTopGuides);

module.exports = router;
