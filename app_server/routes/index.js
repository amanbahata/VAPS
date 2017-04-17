var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/home');
var ctrlOthers = require('../controllers/others');


/**
 * Home page
 */
router.get('/', ctrlMain.home);
router.get('/application/new', ctrlMain.newApplication);
router.post('/application/new', ctrlMain.addNewApplication);
router.get('/manage', ctrlMain.manageApplication);
router.post('/manage', ctrlMain.doManageApplication);





router.get('/others', ctrlOthers.others);


module.exports = router;
