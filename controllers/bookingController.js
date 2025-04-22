const pool = require('../config/db');

// Book a tour
exports.reserverTour = async (req, res) => {
  const { user_id, tour_id, guide_id, booking_date, payment_status } = req.body;

  if (!user_id || !tour_id || !guide_id || !booking_date || !payment_status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO ec_bookings (user_id, tour_id, guide_id, booking_date, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, tour_id, guide_id, booking_date, payment_status]
    );

    res.status(201).json({
      message: 'Tour booked successfully',
      booking_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error booking tour', details: err.message });
  }
};

// Cancel a booking
exports.annulerReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM ec_bookings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling booking', details: err.message });
  }
};

// Get all bookings for a user
exports.getReservationsUtilisateur = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [bookings] = await pool.query(
      `SELECT b.*, u.display_name AS guide_name, t.title AS tour_title
       FROM ec_bookings b
       JOIN wp_users u ON b.guide_id = u.ID
       JOIN ec_tours t ON b.tour_id = t.id
       WHERE b.user_id = ?`,
      [user_id]
    );

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving bookings', details: err.message });
  }
};
