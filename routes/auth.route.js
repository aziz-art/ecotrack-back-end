const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth');


// POST login
router.post("/login", authController.login);

// POST logout
router.post("/logout", authController.logout);

router.get("/getuser", authController.getAll);

// GET user profile (protected)
router.get('/user', authMiddleware, authController.getUserProfile);

module.exports = router;
