const pool = require('../config/db');
const apiResponse = require('../utils/apiResponse');

exports.getAllTours = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.wp_post_id, t.title, t.description, t.location_point, t.duration, t.price, p.post_title, p.post_content
      FROM ec_tours t
      LEFT JOIN wp_posts p ON t.wp_post_id = p.ID
      WHERE p.post_type = 'tour' AND p.post_status = 'publish'
    `);
    return apiResponse.success(res, rows, 'Tours retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve tours');
  }
};

exports.createTour = async (req, res) => {
  // TODO: Implement logic to create a new tour
  res.json({ message: 'Create tour - not implemented yet' });
};

exports.getTourById = async (req, res) => {
  const tourId = req.params.id;
  console.log(`Fetching tour with id: ${tourId}`); // Added logging
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.wp_post_id, t.title, t.description, t.location_point, t.duration, t.price, p.post_title, p.post_content
      FROM ec_tours t
      LEFT JOIN wp_posts p ON t.wp_post_id = p.ID
      WHERE t.id = ? AND p.post_type = 'tour' AND p.post_status = 'publish'
    `, [tourId]);
    console.log('Query result:', rows); // Added logging
    if (rows.length === 0) {
      return apiResponse.error(res, null, 'Tour not found', 404);
    }
    return apiResponse.success(res, rows[0], 'Tour retrieved successfully');
  } catch (error) {
    console.error('Error retrieving tour:', error); // Added logging
    return apiResponse.error(res, error, 'Failed to retrieve tour');
  }
};

exports.getTourGuides = async (req, res) => {
  const tourId = req.params.id;
  try {
    const [rows] = await pool.query(`
      SELECT u.ID as guide_id, u.display_name, u.user_email, um.meta_key, um.meta_value
      FROM ec_tour_guides tg
      JOIN wp_users u ON tg.guide_id = u.ID
      LEFT JOIN wp_usermeta um ON u.ID = um.user_id
      WHERE tg.tour_id = ?
    `, [tourId]);
    if (rows.length === 0) {
      return apiResponse.error(res, null, 'No guides found for this tour', 404);
    }
    // Group usermeta by guide
    const guides = {};
    rows.forEach(row => {
      if (!guides[row.guide_id]) {
        guides[row.guide_id] = {
          guide_id: row.guide_id,
          display_name: row.display_name,
          user_email: row.user_email,
          meta: {}
        };
      }
      if (row.meta_key) {
        guides[row.guide_id].meta[row.meta_key] = row.meta_value;
      }
    });
    return apiResponse.success(res, Object.values(guides), 'Guides retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve guides for tour');
  }
};

exports.filterTours = async (req, res) => {
  const { langue } = req.query;
  try {
    let query = `
      SELECT DISTINCT t.id, t.wp_post_id, t.title, t.description, t.location_point, t.duration, t.price, p.post_title, p.post_content
      FROM ec_tours t
      LEFT JOIN wp_posts p ON t.wp_post_id = p.ID
      LEFT JOIN ec_tour_guides tg ON t.id = tg.tour_id
      LEFT JOIN wp_usermeta um ON tg.guide_id = um.user_id AND um.meta_key = 'langue'
      WHERE p.post_type = 'tour' AND p.post_status = 'publish'
    `;
    const params = [];
    if (langue) {
      query += ' AND um.meta_value = ?';
      params.push(langue);
    }
    const [rows] = await pool.query(query, params);
    return apiResponse.success(res, rows, 'Filtered tours retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to filter tours');
  }
};

exports.getTourMap = async (req, res) => {
  const tourId = req.params.id;
  try {
    // First get the wp_post_id for the tour
    const [tourRows] = await pool.query(`
      SELECT wp_post_id FROM ec_tours WHERE id = ?
    `, [tourId]);
    if (tourRows.length === 0) {
      return apiResponse.error(res, null, 'Tour not found', 404);
    }
    const wpPostId = tourRows[0].wp_post_id;
    // Get the map file URL from wp_postmeta
    const [metaRows] = await pool.query(`
      SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = 'tour_map_file'
    `, [wpPostId]);
    if (metaRows.length === 0) {
      return apiResponse.error(res, null, 'Map file not found for this tour', 404);
    }
    const mapUrl = metaRows[0].meta_value;
    // Redirect to the map file URL or send the URL in response
    return apiResponse.success(res, { mapUrl }, 'Tour map file retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve tour map file');
  }
};

exports.getTourReviews = async (req, res) => {
  const tourId = req.params.id;
  try {
    // Get wp_post_id for the tour
    const [tourRows] = await pool.query(`
      SELECT wp_post_id FROM ec_tours WHERE id = ?
    `, [tourId]);
    if (tourRows.length === 0) {
      return apiResponse.error(res, null, 'Tour not found', 404);
    }
    const wpPostId = tourRows[0].wp_post_id;
    // Get comments for the tour from wp_comments
    const [comments] = await pool.query(`
      SELECT comment_author, comment_content, comment_date
      FROM wp_comments
      WHERE comment_post_ID = ?
      ORDER BY comment_date DESC
    `, [wpPostId]);
    return apiResponse.success(res, comments, 'Tour reviews retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, error, 'Failed to retrieve tour reviews');
  }
};
