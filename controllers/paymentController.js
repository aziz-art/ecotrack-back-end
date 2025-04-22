const pool = require('../config/db');
const pdf = require('pdfkit'); // for genererFacture()
const fs = require('fs');

// Process Payment
exports.processPaiement = async (req, res) => {
  const { booking_id, user_id, amount, payment_method } = req.body;

  if (!booking_id || !user_id || !amount || !payment_method) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Simulate payment gateway (Stripe/PayPal)
    const status = 'completed'; // Mocked as successful

    // Insert into payments table
    const [result] = await pool.query(
      `INSERT INTO ec_payments (booking_id, user_id, amount, status, payment_method)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, user_id, amount, status, payment_method]
    );

    // Update booking payment_status
    await pool.query(
      `UPDATE ec_bookings SET payment_status = ? WHERE id = ?`,
      [status, booking_id]
    );

    res.status(201).json({
      message: 'Payment processed successfully',
      payment_id: result.insertId,
      status
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', details: err.message });
  }
};

// Check Payment Status
exports.checkStatutPaiement = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT status FROM ec_payments WHERE booking_id = ?`,
      [booking_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.json({ status: rows[0].status });
  } catch (err) {
    res.status(500).json({ error: 'Error checking payment status', details: err.message });
  }
};

// Generate Invoice (as PDF)
exports.genererFacture = async (req, res) => {
  const { payment_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT p.*, b.booking_date, u.display_name AS user_name
       FROM ec_payments p
       JOIN ec_bookings b ON p.booking_id = b.id
       JOIN wp_users u ON p.user_id = u.ID
       WHERE p.id = ?`,
      [payment_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    const data = rows[0];

    const doc = new pdf();
    const filename = `invoice-${payment_id}.pdf`;
    const filePath = `./invoices/${filename}`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice #: ${payment_id}`);
    doc.text(`User: ${data.user_name}`);
    doc.text(`Amount: $${data.amount}`);
    doc.text(`Method: ${data.payment_method}`);
    doc.text(`Date: ${data.created_at}`);
    doc.end();

    res.download(filePath, filename);
  } catch (err) {
    res.status(500).json({ error: 'Error generating invoice', details: err.message });
  }
};
