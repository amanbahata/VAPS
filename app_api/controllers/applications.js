/**
 * Created by aman1 on 13/04/2017.
 */

var mongoose = require('mongoose');
var Applic = mongoose.model('Application');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.listApplications = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.applicationsReadOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.applicationsCreate= function (req, res) {
    Applic.create({
        title: req.body.title,
        full_name: req.body.fullName ,
        date_of_birth: req.body.dateOfBirth ,
        place_of_birth: req.body.placeOfBirth  ,
        country_of_birth: req.body.countryOfBirth,
        nationality: req.body.nationality,
        home_address: req.body.homeAddress,
        city: req.body.city,
        postcode: req.body.postcode,
        country: req.body.country,
        contact_no: req.body.contactNo,
        email: req.body.email,
        occupation: req.body.occupation,
        document_type: req.body.documentType,
        document_number: req.body.documentNumber,
        document_date_of_issue: req.body.documentDateOfIssue,
        document_country_of_issue: req.body.documentCountryOfIssue,
        document_expiry_date: req.body.documentExpiryDate,
        contact_address_in_ethiopia: req.body.contactAddressInEthiopia
    }, function (err, application) {
        if(err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res, 201, application);
        }
    });
};