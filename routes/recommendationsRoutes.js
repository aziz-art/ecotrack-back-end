const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationsController');

router.post('/generate', controller.generateRecommendations);
router.post('/update', controller.mettreAJourRecommandations);
router.get('/:user_id', controller.getRecommendations);

module.exports = router;
