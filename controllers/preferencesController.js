const pool = require('../config/db');

exports.setPreferences = async (req, res) => {
  const { user_id, activity_type, budget_range, duration_preference } = req.body;
  try {
    await pool.execute(
      `REPLACE INTO ec_user_preferences (user_id, activity_type, budget_range, duration_preference)
       VALUES (?, ?, ?, ?)`,
      [user_id, activity_type, budget_range, duration_preference]
    );
    res.status(200).json({ message: 'Préférences enregistrées.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPreferences = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM ec_user_preferences WHERE user_id = ?',
      [user_id]
    );
    res.status(200).json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reinitialiserPreferences = async (req, res) => {
  const { user_id } = req.body;

  try {
    await pool.execute('DELETE FROM ec_user_preferences WHERE user_id = ?', [user_id]);
    res.status(200).json({ message: 'Préférences utilisateur réinitialisées.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};