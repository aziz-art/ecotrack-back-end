const WeatherAlert = require('../models/WeatherAlert.model');

module.exports = {
  triggerAlert: async (alertData) => {
    // Example implementation: create a new alert automatically based on rules
    // In real case, add logic to evaluate rules and trigger alerts accordingly
    const alertId = await WeatherAlert.create(alertData);
    return { alertId, message: 'Alert triggered automatically' };
  },

  syncAlerts: async (alerts) => {
    // Example implementation: sync alerts from offline mode
    // alerts is expected to be an array of alert objects
    const results = [];
    for (const alert of alerts) {
      if (alert.id) {
        // Update existing alert
        const affectedRows = await WeatherAlert.update(alert.id, alert);
        results.push({ id: alert.id, updated: affectedRows > 0 });
      } else {
        // Create new alert
        const newId = await WeatherAlert.create(alert);
        results.push({ id: newId, created: true });
      }
    }
    return results;
  }
};
