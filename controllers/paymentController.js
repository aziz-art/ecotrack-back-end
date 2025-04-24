const pool = require("../config/db");
const pdf = require("pdfkit");
const fs = require("fs");

// Process Payment
exports.processPaiement = async (req, res) => {
  const { booking_id, amount, payment_method } = req.body;

  if (!booking_id || !amount || !payment_method) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const status = "completed"; // For bookings table only
    const payment_date = new Date();

    // Insert into ec_payments table
    const [result] = await pool.query(
      `INSERT INTO ec_payments (booking_id, amount, method, payment_date)
       VALUES (?, ?, ?, ?)`,
      [booking_id, amount, payment_method, payment_date]
    );

    // Update ec_bookings with payment_status
    await pool.query(`UPDATE ec_bookings SET payment_status = ? WHERE id = ?`, [
      status,
      booking_id,
    ]);

    res.status(201).json({
      message: "Payment processed successfully",
      payment_id: result.insertId,
      status,
    });
  } catch (err) {
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
};

// Check Payment Status
exports.checkStatutPaiement = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT payment_status FROM ec_bookings WHERE id = ?`,
      [booking_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.json({ status: rows[0].payment_status });
  } catch (err) {
    res.status(500).json({
      error: "Error checking payment status",
      details: err.message,
    });
  }
};

// Generate Invoice
exports.genererFacture = async (req, res) => {
  const { payment_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT p.*, b.booking_date, u.display_name AS user_name
       FROM ec_payments p
       JOIN ec_bookings b ON p.booking_id = b.id
       JOIN wp_users u ON b.user_id = u.ID
       WHERE p.id = ?`,
      [payment_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found." });
    }

    const data = rows[0];
    const filename = `invoice-${payment_id}.pdf`;
    const filePath = `./invoices/${filename}`;

    const doc = new pdf();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Payment", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Payment #: ${payment_id}`);
    doc.text(`User: ${data.user_name}`);
    doc.text(`Amount: $${data.amount}`);
    doc.text(`Method: ${data.method}`);
    doc.text(`Date: ${new Date(data.payment_date).toLocaleString()}`);
    doc.end();

    res.download(filePath, filename);
  } catch (err) {
    res.status(500).json({
      error: "Error generating invoice",
      details: err.message,
    });
  }
};

// Show all payments
exports.getAllPayments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id, p.booking_id, p.amount, p.method, p.payment_date,
        b.user_id, b.tour_id, b.guide_id, b.booking_date,
        b.payment_status
      FROM ec_payments p
      JOIN ec_bookings b ON p.booking_id = b.id
    `);

    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching payments", details: err.message });
  }
};
