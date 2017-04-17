/**
 * Created by aman1 on 13/04/2017.
 */

var request = require('request');
var mv = require('mv');



/*
 Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};


module.exports.home = function (req, res) {
    res.render('index', {
        title: 'WELCOME,',
        information: ' visiting Ethiopia for pleasure has never been easier.' +
                        'Home to vast and diverse natural wild life reserves, blessed with tropical, all year round ' +
                        'summer weather and a diverse cultural heritage.'
    });
};


module.exports.newApplication = function (req, res) {
    res.render('new_application', {
        title: 'New application',
        success: false
    });
};

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



module.exports.manageApplication = function (req, res) {
    res.render('manage_applications', {
        title: 'Manage your application',
        form: true
    });
};


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
            applicationDetailRenderer(req, res, body);
        }
    );
};


/*
 Rendering the single application
 */

var applicationDetailRenderer = function(req, res, responseBody){
    var message;
    if (!responseBody) {
        message = "API lookup error. Please try again." ;
    }else {
        res.render('manage_applications', {
            title: responseBody[0].full_name,
            form: false,
            application: responseBody[0],
            message: responseBody.message
        });
    }
};


module.exports.fileUpload = function (req, res) {
    res.render('file_upload', {
        title: 'Upload documents',
        fileName: req.params.fileName
    });
};

module.exports.doFileUpload = function (req, res) {

    console.log(req.files);



    res.render('file_upload', {
        title: 'Documents uploaded'
    });
};