const express = require('express');
const router = express.Router();
const controller = require('../controllers/preferencesController');

router.post('/set', controller.setPreferences);
router.post('/reset/:user_id', controller.reinitialiserPreferences);
router.get('/get/:user_id', controller.getPreferences);

module.exports = router;
