const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');

// GET all bookings
router.get('/', bookingsController.getAllBookings);

// POST create a new booking
router.post('/', bookingsController.createBooking);

module.exports = router;
