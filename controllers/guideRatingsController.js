const pool = require('../config/db');

exports.getTopGuides = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM ec_guide_ratings ORDER BY average_rating DESC LIMIT 10'
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
