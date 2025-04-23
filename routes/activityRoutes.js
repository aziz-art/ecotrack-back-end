const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityController');

router.get('/get/:user_id', controller.getHistory);
router.delete('/:id', controller.deleteHistoryItem);

module.exports = router;
