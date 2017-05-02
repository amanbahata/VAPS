var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/review');

/**
 * List visa applications with 'open status'
 */
router.get('/', ctrlMain.listApplications);
/**
 * Open the details of a single visa application
 */
router.get('/applications/:referenceNumber', ctrlMain.openApplication);
router.post('/applications/:referenceNumber', ctrlMain.doAssessment);

/**
 * Generate report
 */
router.get('/reports', ctrlMain.showStats);

/**
 * Login - logout
 */
router.get('/login', ctrlMain.login);
router.post('/login', ctrlMain.doLogin);
router.get('/logout', ctrlMain.doLogout);



module.exports = router;
