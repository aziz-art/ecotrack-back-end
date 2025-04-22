const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/payments', paymentController.processPaiement);
router.get('/payments/status/:booking_id', paymentController.checkStatutPaiement);
router.get('/payments/invoice/:payment_id', paymentController.genererFacture);

module.exports = router;
