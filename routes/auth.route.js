const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// POST login
router.post("/login", authController.login);

// POST logout
router.post("/logout", authController.logout);

router.get("/getuser", authController.getAll);

module.exports = router;
