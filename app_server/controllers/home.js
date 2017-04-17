/**
 * Created by aman1 on 13/04/2017.
 */

var request = require('request');

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
        seccess: false
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
                res.render('new_application', {
                        title: 'New application',
                        success: true
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