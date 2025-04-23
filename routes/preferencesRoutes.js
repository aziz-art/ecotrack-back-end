const express = require('express');
const router = express.Router();
const controller = require('../controllers/preferencesController');

router.post('/', controller.setPreferences);
router.post('/reset', controller.reinitialiserPreferences);
router.get('/:user_id', controller.getPreferences);

module.exports = router;
