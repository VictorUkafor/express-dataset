var express = require('express');
var router = express.Router();

const actorsController = require('../controllers/actors');

router.put('/', actorsController.updateActor);
router.get('/', actorsController.getAllActors);
router.get('/streak', actorsController.getStreak);

module.exports = router;