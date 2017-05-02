/**
 * Created by aman1 on 13/04/2017.
 */

var request = require('request');
var mv = require('mv');
var mailer = require('../communication/application_notification_mailer');
var fs = require('fs');




/**
 *Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};

/**
 * Compile and render the home page
 * @param req
 * @param res
 */

module.exports.home = function (req, res) {
    res.render('index', {
        title: 'WELCOME,',
        information: ' visiting Ethiopia for pleasure has never been easier.' +
                        'Home to vast and diverse natural wild life reserves, blessed with tropical, all year round ' +
                        'summer weather and a diverse cultural heritage.'
    });
};

/**
 * Compile and render the start new application page
 * @param req
 * @param res
 */

module.exports.newApplication = function (req, res) {
    res.render('new_application', {
        title: 'New application',
        success: false
    });
};

/**
 * Process the submitted visa application form
 * @param req
 * @param res
 */

module.exports.addNewApplication = function (req, res) {
    var requestOptions, path, postData;
    path = '/api/applications/new';
    postData = {
        title: req.body.title,
        fullName: req.body.fullName ,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        countryOfBirth: req.body.countryOfBirth,
        nationality: req.body.nationality,
        homeAddress: req.body.homeAddress,
        city: req.body.city,
        postcode: req.body.postcode,
        country: req.body.country,
        contactNo: req.body.contactNo,
        email: req.body.email,
        occupation: req.body.occupation,
        documentType: req.body.documentType,
        documentNumber: req.body.documentNumber,
        documentDateOfIssue: req.body.documentDateOfIssue,
        documentCountryOfIssue: req.body.documentCountryOfIssue,
        documentExpiryDate: req.body.documentExpiryDate,
        contactAddressInEthiopia: req.body.contactAddressInEthiopia
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json: postData
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 201){
                console.log(response);
                mailer.sendEmail(response.body.email, req.body.fullName, response.body.reference_number);
                var fileName = req.body.fullName.toUpperCase() + req.body.documentNumber.toUpperCase();
                fileName = fileName.replace(/\s+/g, '');
                res.render('new_application', {
                        title: 'New application',
                        success: true,
                        fileName: fileName
                    });
            }else{
                res.render('new_application', {
                        title: 'New application',
                        success: false,
                        message: true
                    }
                );
            }
        }
    );
};


/**
 * Compile and render manage applications page
 * @param req
 * @param res
 */

module.exports.manageApplication = function (req, res) {
    res.render('manage_applications', {
        title: 'Manage your application',
        form: true
    });
};


/**
 * Process the submitted reference number and document number
 * @param req
 * @param res
 */

module.exports.doManageApplication = function (req, res) {
    var requestOptions, path;
   path = '/api/applications/check/' + req.body.referenceNumber + '/' + req.body.documentNumber;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json: {}
    };
    request (requestOptions,
        function(err, response, body){
            applicationDetailRenderer(req, res, body, response);
        }
    );
};


/**
 * Name function for rendering the single application
 */

var applicationDetailRenderer = function(req, res, responseBody, response){
    var message;
    console.log(responseBody);
    if (!responseBody[0] || response.statusCode === 404) {
        message = "API lookup error. Please try again." ;
        res.render('manage_applications', {
            form: false,
            message: message
        });
    }else {
        res.render('manage_applications', {
            title: responseBody[0].full_name,
            form: false,
            application: responseBody[0]
        });
    }
};


/**
 * Render the file uploads page
 * @param req
 * @param res
 */

module.exports.fileUpload = function (req, res) {
    res.render('file_upload', {
        title: 'Upload documents',
        fileName: req.params.fileName
    });
};

/**
 * Process the uploaded files
 * @param req
 * @param res
 */

module.exports.doFileUpload = function (req, res) {
    var success = true;

    for (var i = 0; i < req.files.length; i++) {
        var sourceFile =  req.files[i].path;
        var destFile = 'public/uploads/' + req.params.fileName + '/' + req.files[i].fieldname+'.png';
        mv(sourceFile, destFile, {mkdirp: true}, function (err) {
            console.log(err);
            if (err){
                success = false;
            }
        });
    }
    if (!success){
        res.render('file_upload', {
            title: 'Upload documents',
            message: true
        });
    }else{
        res.redirect('/');
    }
};