const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');

// GET all messages
router.get('/', messagesController.getAllMessages);

// GET message by id
router.get('/:id', messagesController.getMessageById);

// POST create a new message
router.post('/', messagesController.createMessage);

module.exports = router;
