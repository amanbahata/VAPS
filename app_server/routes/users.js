var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/review');

/* GET users listing. */
router.get('/', ctrlMain.listApplications);
router.get('/applications/:referenceNumber', ctrlMain.openApplication);

router.get('/login', ctrlMain.login);
router.post('/login', ctrlMain.doLogin);


module.exports = router;
