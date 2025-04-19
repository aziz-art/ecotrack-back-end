const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');

// GET all messages
router.get('/', messagesController.getAllMessages);

// POST create a new message
router.post('/', messagesController.createMessage);

module.exports = router;
