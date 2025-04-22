const express = require('express');
const router = express.Router();
const toursController = require('../controllers/tours.controller');

// GET all tours
router.get('/', toursController.getAllTours);

// GET filtered tours by query params
router.get('/filter', toursController.filterTours);

// GET a tour by id
router.get('/:id', toursController.getTourById);

// GET guides for a tour by id
router.get('/:id/guides', toursController.getTourGuides);

// GET tour map file by tour id
router.get('/:id/map', toursController.getTourMap);

// POST create a new tour
router.post('/', toursController.createTour);

// GET reviews for a tour
router.get('/:id/reviews', toursController.getTourReviews);

module.exports = router;
