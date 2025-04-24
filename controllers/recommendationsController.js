const pool = require('../config/db');

exports.generateRecommendations = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Simulated recommendation logic: find 5 tours not yet recommended
    const [recommendations] = await pool.execute(
      `SELECT id FROM ec_tours 
       WHERE id NOT IN (
         SELECT recommended_tour_id FROM ec_recommendations WHERE user_id = ?
       ) 
       LIMIT 5`,
      [user_id]
    );

    const now = new Date();
    for (let rec of recommendations) {
      await pool.execute(
        `INSERT INTO ec_recommendations (user_id, recommended_tour_id, created_at) VALUES (?, ?, ?)`,
        [user_id, rec.id, now]
      );
    }

    res.status(200).json({ message: 'Recommandations générées.', recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, t.* 
       FROM ec_recommendations r 
       JOIN ec_tours t ON r.recommended_tour_id = t.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.mettreAJourRecommandations = async (req, res) => {
  const { user_id } = req.body;

  try {
    // 1. Delete old recommendations
    await pool.execute('DELETE FROM ec_recommendations WHERE user_id = ?', [user_id]);

    // 2. Get user preferences
    const [prefsRows] = await pool.execute(
      `SELECT activity_type, budget_range, duration_preference
       FROM ec_user_preferences WHERE user_id = ?`,
      [user_id]
    );

    if (prefsRows.length === 0) {
      return res.status(404).json({ message: "Aucune préférence trouvée pour cet utilisateur." });
    }

    const prefs = prefsRows[0];

    // 3. Get tours that match preferences and are not already completed or recommended
    const [tours] = await pool.execute(
      `SELECT id FROM ec_tours 
       WHERE activity_type = ? OR budget_range = ? OR duration <= ?
       AND id NOT IN (
         SELECT recommended_tour_id FROM ec_recommendations WHERE user_id = ?
         UNION
         SELECT tour_id FROM ec_activity_history WHERE user_id = ?
       )
       ORDER BY RAND()
       LIMIT 5`,
      [prefs.activity_type, prefs.budget_range, prefs.duration_preference, user_id, user_id]
    );

    if (tours.length === 0) {
      return res.status(200).json({ message: 'Aucune nouvelle recommandation possible selon les préférences actuelles.' });
    }

    const now = new Date();
    for (let tour of tours) {
      await pool.execute(
        `INSERT INTO ec_recommendations (user_id, recommended_tour_id, created_at)
         VALUES (?, ?, ?)`,
        [user_id, tour.id, now]
      );
    }

    res.status(200).json({ message: 'Recommandations mises à jour selon les préférences.', recommendations: tours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
