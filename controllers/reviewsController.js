const pool = require('../config/db');

exports.soumettreAvis = async (req, res) => {
  const { comment_id, rating, guide_id } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO ec_reviews (comment_id, rating, review_date) VALUES (?, ?, NOW())',
      [comment_id, rating]
    );

    await pool.execute(
      `UPDATE ec_guide_ratings 
       SET average_rating = (SELECT AVG(rating) FROM ec_reviews WHERE comment_id IN 
         (SELECT comment_ID FROM wp_comments WHERE user_id = ?)),
           number_of_reviews = number_of_reviews + 1
       WHERE guide_id = ?`,
      [req.user_id || 1, guide_id] // assuming a user_id for testing
    );

    res.status(201).json({ message: 'Avis soumis avec succès', reviewId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
