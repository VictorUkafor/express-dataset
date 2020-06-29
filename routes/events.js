const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/events');

router.post('/', eventsController.addEvent);

module.exports = router;