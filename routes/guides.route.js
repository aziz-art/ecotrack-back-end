const express = require('express');
const router = express.Router();
const guidesController = require('../controllers/guides.controller');

// GET all guides
router.get('/', guidesController.getAllGuides);

// POST create a new guide
router.post('/', guidesController.createGuide);

module.exports = router;
