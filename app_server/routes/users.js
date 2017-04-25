var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/review');

/* GET users listing. */
router.get('/', ctrlMain.listApplications);
// open a single application
router.get('/applications/:referenceNumber', ctrlMain.openApplication);

//report generation
//router.get('/reports', ctrlMain.generateReport);

/**
 * Login - logout
 */
router.get('/login', ctrlMain.login);
router.post('/login', ctrlMain.doLogin);


module.exports = router;
