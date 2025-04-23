const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');

router.post('/submit', controller.soumettreAvis);
router.get('/search', controller.filtrerAvisParMotCle);
router.put('/update-rating/:guide_id', controller.calculerNoteMoyenne);

module.exports = router;
