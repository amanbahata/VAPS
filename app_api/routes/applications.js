/**
 * Created by aman1 on 13/04/2017.
 */

var express = require('express');
var router = express.Router();
// var jwt = require('express-jwt');
// var auth = jwt({
//     secret: process.env.JWT_SECRET,
//     userProperty: 'payload'
// });


var ctrlApplications = require('../controllers/applications');
var ctrlAuth = require('../controllers/authentication');

router.post('/applications/new', ctrlApplications.applicationsCreate);
router.get('/applications/open' ,ctrlApplications.listApplicationsOpen);
router.get('/applications/check/:referenceNumber/:documentNumber', ctrlApplications.applicationCheck);
router.get('/applications/:referenceNumber' ,ctrlApplications.applicationsReadOne);
router.post('/applications/:referenceNumber' ,ctrlApplications.assessmentCreate);


router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


module.exports = router;