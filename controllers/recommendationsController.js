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
    // Simple logic: delete old recs and regenerate
    await pool.execute('DELETE FROM ec_recommendations WHERE user_id = ?', [user_id]);

    const [tours] = await pool.execute(
      'SELECT id FROM ec_tours ORDER BY RAND() LIMIT 5'
    );

    const now = new Date();
    for (let tour of tours) {
      await pool.execute(
        'INSERT INTO ec_recommendations (user_id, recommended_tour_id, created_at) VALUES (?, ?, ?)',
        [user_id, tour.id, now]
      );
    }

    res.status(200).json({ message: 'Recommandations mises à jour.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};