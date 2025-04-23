const WeatherAlert = require('../models/WeatherAlert.model');
const weatherService = require('../services/weather.service');
const apiResponse = require('../utils/apiResponse');

exports.createAlert = async (req, res) => {
  try {
    const alertId = await WeatherAlert.create(req.body);
    return apiResponse.success(res, { id: alertId }, 'Alert created successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to create alert');
  }
};

exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await WeatherAlert.getActiveAlerts();
    return apiResponse.success(res, alerts, 'Active alerts retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve active alerts');
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await WeatherAlert.update(id, req.body);
    if (affectedRows === 0) {
      return apiResponse.error(res, null, 'Alert not found', 404);
    }
    return apiResponse.success(res, null, 'Alert updated successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to update alert');
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await WeatherAlert.delete(id);
    if (affectedRows === 0) {
      return apiResponse.error(res, null, 'Alert not found', 404);
    }
    return apiResponse.success(res, null, 'Alert deleted successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to delete alert');
  }
};

exports.triggerAlert = async (req, res) => {
  try {
    const result = await weatherService.triggerAlert(req.body);
    return apiResponse.success(res, result, 'Alert triggered successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to trigger alert');
  }
};

exports.syncAlerts = async (req, res) => {
  try {
    const result = await weatherService.syncAlerts(req.body);
    return apiResponse.success(res, result, 'Alerts synced successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to sync alerts');
  }
};

exports.getEmergencyContacts = async (req, res) => {
  try {
    // For demonstration, returning static data. Replace with DB query if needed.
    const contacts = [
      { region: 'Region A', phone: '123-456-7890' },
      { region: 'Region B', phone: '098-765-4321' }
    ];
    return apiResponse.success(res, contacts, 'Emergency contacts retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve emergency contacts');
  }
};

exports.getSafetyTips = async (req, res) => {
  try {
    // For demonstration, returning static data. Replace with DB query if needed.
    const tips = [
      { activity: 'Hiking', weather: 'Rainy', tip: 'Wear waterproof boots and carry a raincoat.' },
      { activity: 'Skiing', weather: 'Snowy', tip: 'Check avalanche warnings before heading out.' }
    ];
    return apiResponse.success(res, tips, 'Safety tips retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve safety tips');
  }
};
