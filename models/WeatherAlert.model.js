const pool = require('../config/db');

const WeatherAlert = {
  create: async (alert) => {
    const { tour_id, alert_message, severity_level, issued_at, is_seen = false, is_offline_cached = false, zone = null } = alert;
    const [result] = await pool.query(
      "INSERT INTO ec_weather_alerts (tour_id, alert_message, severity_level, issued_at, is_seen, is_offline_cached, zone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tour_id, alert_message, severity_level, issued_at, is_seen, is_offline_cached, zone]
    );
    return result.insertId;
  },

  getActiveAlerts: async (user_id) => {
    // Assuming ec_tours table has user_id field to link tours to users
    const [rows] = await pool.query(
      "SELECT a.* FROM ec_weather_alerts a JOIN ec_tours t ON a.tour_id = t.id WHERE t.user_id = ? AND a.issued_at <= NOW() AND a.is_seen = false",
      [user_id]
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM ec_weather_alerts WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  update: async (id, alert) => {
    const { alert_message, severity_level, issued_at, is_seen, is_offline_cached, zone } = alert;
    const [result] = await pool.query(
      "UPDATE ec_weather_alerts SET alert_message = ?, severity_level = ?, issued_at = ?, is_seen = ?, is_offline_cached = ?, zone = ? WHERE id = ?",
      [alert_message, severity_level, issued_at, is_seen, is_offline_cached, zone, id]
    );
    return result.affectedRows;
  },

  markAsSeen: async (id) => {
    const [result] = await pool.query(
      "UPDATE ec_weather_alerts SET is_seen = true WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM ec_weather_alerts WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = WeatherAlert;
