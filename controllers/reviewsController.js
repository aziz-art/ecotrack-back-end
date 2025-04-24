const pool = require('../config/db');

// Soumettre un avis
exports.soumettreAvis = async (req, res) => {
  const { comment_id, rating, guide_id } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO ec_reviews (comment_id, rating, review_date) VALUES (?, ?, NOW())',
      [comment_id, rating]
    );

    // Optionally call calculerNoteMoyenne after submission
    await module.exports.calculerNoteMoyenneInternal(guide_id);

    res.status(201).json({ message: 'Avis soumis avec succès', reviewId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculer et mettre à jour la note moyenne pour un guide
exports.calculerNoteMoyenne = async (req, res) => {
  const { guide_id } = req.params;

  try {
    const result = await module.exports.calculerNoteMoyenneInternal(guide_id);
    res.status(200).json({ message: 'Note moyenne mise à jour.', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Internal function (reusable) les avis de guide
exports.calculerNoteMoyenneInternal = async (guide_id) => {
  const [rows] = await pool.execute(
    `SELECT r.rating
     FROM ec_reviews r
     JOIN wp_comments c ON r.comment_id = c.comment_ID
     JOIN ec_bookings b ON c.user_id = b.user_id
     WHERE b.guide_id = ?`,
    [guide_id]
  );

  if (rows.length === 0) {
    await pool.execute(
      'UPDATE ec_guide_ratings SET average_rating = 0, number_of_reviews = 0 WHERE guide_id = ?',
      [guide_id]
    );
    return { average_rating: 0, number_of_reviews: 0 };
  }

  const total = rows.reduce((sum, row) => sum + row.rating, 0);
  const average = total / rows.length;

  await pool.execute(
    'UPDATE ec_guide_ratings SET average_rating = ?, number_of_reviews = ? WHERE guide_id = ?',
    [average, rows.length, guide_id]
  );

  return { average_rating: average, number_of_reviews: rows.length };
};

// Filtrer les avis par mot-clé
exports.filtrerAvisParMotCle = async (req, res) => {
  const { keyword } = req.query;

  try {
    const [rows] = await pool.execute(
      `SELECT r.*, c.comment_content 
       FROM ec_reviews r
       JOIN wp_comments c ON r.comment_id = c.comment_ID
       WHERE c.comment_content LIKE ?`,
      [`%${keyword}%`]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
