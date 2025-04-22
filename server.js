require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ecotrack Backend API' });
});

const authRoutes = require('./routes/auth.route');
const messagesRoutes = require('./routes/messages.route');


// TODO: Import and use routes here
app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);
app.use('/messages', messagesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Pour tester la connection de base


(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("Database connection successful:", rows);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();