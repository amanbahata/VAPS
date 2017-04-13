/**
 * Created by aman1 on 13/04/2017.
 */

var express = require('express');
var router = express.Router();
var ctrlApplications = require('../controllers/applications');

router.post('/applications/new', ctrlApplications.applicationsCreate);
router.get('/applications', ctrlApplications.listApplications);
router.get('/applications/:applicantId', ctrlApplications.applicationsReadOne);
// router.put('/applications/applicantId', ctrlApplications.applicationUpdateOne);


module.exports = router;