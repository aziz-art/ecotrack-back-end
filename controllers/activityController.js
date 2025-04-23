const pool = require('../config/db');

exports.getHistory = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT h.*, t.* 
       FROM ec_activity_history h 
       JOIN ec_tours t ON h.tour_id = t.id 
       WHERE h.user_id = ?
       ORDER BY h.completed_at DESC`,
      [user_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteHistoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM ec_activity_history WHERE id = ?', [id]);
    res.status(200).json({ message: 'Activité supprimée de l’historique.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
