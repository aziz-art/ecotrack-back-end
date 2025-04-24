const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Book a tour
router.post('/add', bookingController.reserverTour);

// Cancel a booking
router.delete('/cancel/:id', bookingController.annulerReservation);

// Get bookings by user ID
router.get('/get/user/:user_id', bookingController.getReservationsUtilisateur);

module.exports = router;
