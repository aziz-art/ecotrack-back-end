const WeatherAlert = require('../models/WeatherAlert.model');
const weatherService = require('../services/weather.service');
const apiResponse = require('../utils/apiResponse');

exports.declencherAlerte = async (req, res) => {
  try {
    const alertId = await weatherService.triggerAlert(req.body);
    return apiResponse.success(res, alertId, 'Alerte créée avec succès');
  } catch (error) {
    return apiResponse.error(res, error, 'Échec de la création de l\'alerte');
  }
};

exports.getAlertesActives = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const alerts = await WeatherAlert.getActiveAlerts(userId);
    return apiResponse.success(res, alerts, 'Alertes actives récupérées avec succès');
  } catch (error) {
    return apiResponse.error(res, error, 'Échec de la récupération des alertes actives');
  }
};

exports.marquerCommeVue = async (req, res) => {
  try {
    const alertId = req.params.alert_id;
    const affectedRows = await WeatherAlert.markAsSeen(alertId);
    if (affectedRows === 0) {
      return apiResponse.error(res, null, 'Alerte non trouvée', 404);
    }
    return apiResponse.success(res, null, 'Alerte marquée comme vue');
  } catch (error) {
    return apiResponse.error(res, error, 'Échec de la mise à jour de l\'alerte');
  }
};

exports.synchroniserAlertesHorsLigne = async (req, res) => {
  try {
    const result = await weatherService.syncAlerts(req.body);
    return apiResponse.success(res, result, 'Alertes synchronisées avec succès');
  } catch (error) {
    return apiResponse.error(res, error, 'Échec de la synchronisation des alertes');
  }
};

exports.supprimerAlerte = async (req, res) => {
  try {
    const alertId = req.params.alert_id;
    const affectedRows = await WeatherAlert.delete(alertId);
    if (affectedRows === 0) {
      return apiResponse.error(res, null, 'Alerte non trouvée', 404);
    }
    return apiResponse.success(res, null, 'Alerte supprimée avec succès');
  } catch (error) {
    return apiResponse.error(res, error, 'Échec de la suppression de l\'alerte');
  }
};
