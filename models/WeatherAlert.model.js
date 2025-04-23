const pool = require('../config/db');

const WeatherAlert = {
  create: async (alert) => {
    const { tour_id, alert_message, severity_level, issued_at } = alert;
    const [result] = await pool.query(
      `INSERT INTO ec_weather_alerts (tour_id, alert_message, severity_level, issued_at)
       VALUES (?, ?, ?, ?)`,
      [tour_id, alert_message, severity_level, issued_at]
    );
    return result.insertId;
  },

  getActiveAlerts: async () => {
    const [rows] = await pool.query(
      `SELECT * FROM ec_weather_alerts WHERE issued_at <= NOW()`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      `SELECT * FROM ec_weather_alerts WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  update: async (id, alert) => {
    const { alert_message, severity_level, issued_at } = alert;
    const [result] = await pool.query(
      `UPDATE ec_weather_alerts SET alert_message = ?, severity_level = ?, issued_at = ? WHERE id = ?`,
      [alert_message, severity_level, issued_at, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM ec_weather_alerts WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = WeatherAlert;
