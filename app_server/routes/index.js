var express = require('express');
var router = express.Router();
var multer = require('multer');
var ctrlMain = require('../controllers/home');
var ctrlOthers = require('../controllers/others');


var uploading = multer({
    dest: './public/temp',
    limits: {fileSize: 10000000, files:2}
});

/**
 * Home page
 */
router.get('/', ctrlMain.home);
router.get('/application/new', ctrlMain.newApplication);
router.post('/application/new', ctrlMain.addNewApplication);
router.get('/manage', ctrlMain.manageApplication);
router.post('/manage', ctrlMain.doManageApplication);
router.get('/upload/:fileName', ctrlMain.fileUpload);
router.post('/upload/:fileName', uploading.any() ,ctrlMain.doFileUpload);





router.get('/others', ctrlOthers.others);


module.exports = router;
