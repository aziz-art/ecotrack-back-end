const pool = require('../config/db');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ec_messages');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get message by id
exports.getMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM ec_messages WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching message by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  const { senderId, receiverId, contenu, date } = req.body;

  if (!senderId || !receiverId || !contenu || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const sql = 'INSERT INTO ec_messages (senderId, receiverId, contenu, date) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [senderId, receiverId, contenu, date]);
    res.status(201).json({ message: 'Message created', messageId: result.insertId });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
