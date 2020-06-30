var express = require('express');
var router = express.Router();

const actorsController = require('../controllers/actors');

router.put('/', actorsController.updateActor);


module.exports = router;