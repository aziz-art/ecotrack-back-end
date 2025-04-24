const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');

// Create a new alert (manual or automatic)
router.post('/api/alertes', alertsController.declencherAlerte);

// Get active alerts for a user
router.get('/api/alertes/actives/:user_id', alertsController.getAlertesActives);

// Mark an alert as seen by the user
router.patch('/api/alertes/:alert_id/seen', alertsController.marquerCommeVue);

// Synchronize offline cached alerts
router.post('/api/alertes/sync', alertsController.synchroniserAlertesHorsLigne);

// Delete or cancel an alert (admin or automatic)
router.delete('/api/alertes/:alert_id', alertsController.supprimerAlerte);

module.exports = router;
