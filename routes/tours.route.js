const express = require('express');
const router = express.Router();
const toursController = require('../controllers/tours.controller');

// GET all tours
router.get('/', toursController.getAllTours);

// POST create a new tour
router.post('/', toursController.createTour);

module.exports = router;
