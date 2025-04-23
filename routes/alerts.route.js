const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');

// Create a new alert
router.post('/alerts/create', alertsController.createAlert);

// Get active alerts
router.get('/alerts/active', alertsController.getActiveAlerts);

// Update an alert by id
router.put('/alerts/:id', alertsController.updateAlert);

// Delete an alert by id
router.delete('/alerts/:id', alertsController.deleteAlert);

// Trigger an alert automatically
router.post('/alerts/trigger', alertsController.triggerAlert);

// Sync alerts for offline mode
router.post('/alerts/sync', alertsController.syncAlerts);

// Get emergency contacts by region
router.get('/emergency-contacts', alertsController.getEmergencyContacts);

// Get safety tips by activity and weather
router.get('/safety-tips', alertsController.getSafetyTips);

module.exports = router;
