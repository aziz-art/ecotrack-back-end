const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/submit', reviewsController.soumettreAvis);
router.get('/search', reviewsController.filtrerAvisParMotCle);

module.exports = router;
