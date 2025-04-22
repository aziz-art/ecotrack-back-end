require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ecotrack Backend API' });
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route works');
});

const authRoutes = require('./routes/auth.route');
const messagesRoutes = require('./routes/messages.route');
const toursRoutes = require('./routes/tours.route');

// TODO: Import and use routes here
app.use('/auth', authRoutes);
app.use('/messages', messagesRoutes);
app.use('/tours', toursRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
