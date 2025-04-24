const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.get("/get", paymentController.getAllPayments);


// Route to process a payment
router.post("/process", paymentController.processPaiement);

// Route to check payment status by booking_id
router.get("/status/:booking_id", paymentController.checkStatutPaiement);

// Route to generate PDF invoice by payment_id
router.get("/invoice/:payment_id", paymentController.genererFacture);

module.exports = router;
