require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const reviewsRoutes = require("./routes/reviewsRoutes");
const guideRatingsRoutes = require("./routes/guideRatingsRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");
const recommendationsRoutes = require("./routes/recommendationsRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ecotrack Backend API" });
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route works');
});

const authRoutes = require('./routes/auth.route');
const messagesRoutes = require('./routes/messages.route');
const toursRoutes = require('./routes/tours.route');
const alertsRoutes = require('./routes/alerts.route');

// TODO: Import and use routes here
app.use('/auth', authRoutes);
app.use('/messages', messagesRoutes);
app.use('/tours', toursRoutes);
app.use('/', alertsRoutes);

app.use("/reviews", reviewsRoutes);
app.use("/guide-ratings", guideRatingsRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/recommendations", recommendationsRoutes);
app.use("/history", activityRoutes);

app.use("/booking", bookingRoutes);
app.use("/payment", paymentRoutes);

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
