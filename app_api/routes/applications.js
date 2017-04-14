/**
 * Created by aman1 on 13/04/2017.
 */

var express = require('express');
var router = express.Router();
var ctrlApplications = require('../controllers/applications');

router.post('/applications/new', ctrlApplications.applicationsCreate);
router.get('/applications/open', ctrlApplications.listApplicationsOpen);
router.get('/applications/check/:referenceNumber/:documentNumber', ctrlApplications.applicationCheck);
router.get('/applications/:referenceNumber', ctrlApplications.applicationsReadOne);
router.put('/applications/:referenceNumber', ctrlApplications.applicationsUpdateOne);


module.exports = router;