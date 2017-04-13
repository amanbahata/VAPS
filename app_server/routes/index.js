var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/home');
var ctrlOthers = require('../controllers/others');


/**
 * Home page
 */
router.get('/', ctrlMain.home);
router.get('/others', ctrlOthers.others);


module.exports = router;
