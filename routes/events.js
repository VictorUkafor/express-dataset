const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/events');

router.post('/', eventsController.addEvent);
router.get('/', eventsController.getAllEvents);
router.get('/actors/:actorId', eventsController.getByActor);

module.exports = router;