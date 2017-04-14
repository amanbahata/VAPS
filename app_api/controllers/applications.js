/**
 * Created by aman1 on 13/04/2017.
 */

var mongoose = require('mongoose');
var Applic = mongoose.model('Application');

var sendJasonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.listApplicationsOpen = function (req, res) {
    Applic.find({'open': true},
        function (err, applications) {
            if (!applications || applications.length < 1 ){
                sendJasonResponse(res, 400, {"message" : "No open applications found"});
            }else if (err) {
                sendJasonResponse(res, 400, err);
            }else{
                sendJasonResponse(res, 200, applications);
            }

        });

};

module.exports.applicationsReadOne = function (req, res) {
    if (req.params && req.params.referenceNumber){
        Applic
            .find({'reference_number' : req.params.referenceNumber},
                function (err, application) {
                    if (!application){
                        sendJasonResponse(res, 404, {"message" : "application not found"});
                    }else if (err) {
                        sendJasonResponse(res, 400, err);
                    }else{
                        sendJasonResponse(res, 200, application);
                    }
                }
            );
    }else{
        sendJasonResponse(res, 404, {
            "message" : "Not found, reference number required"
        });
    }

};


module.exports.applicationsUpdateOne = function (req, res) {
    if (req.params && req.params.referenceNumber){
        Applic
            .find({'reference_number' : req.params.referenceNumber},
                function (err, application) {
                    if (!application){
                        sendJasonResponse(res, 404, {"message" : "application not found"});
                    }else if (err) {
                        sendJasonResponse(res, 400, err);
                    }else{
                        sendJasonResponse(res, 200, application);
                    }
                }
            );
    }else{
        sendJasonResponse(res, 404, {
            "message" : "Not found, reference number required"
        });
    }

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
            sendJasonResponse(res, 400, err);
        }else{
            sendJasonResponse(res, 201, application);
        }
    });
};


module.exports.applicationCheck = function (req, res) {

    console.log(req.params);

    if (req.params && req.params.referenceNumber && req.params.documentNumber){
        Applic
            .find({'reference_number' : req.params.referenceNumber, 'document_number': req.params.documentNumber},
            function (err, application) {
                var response;
                    if (!application){
                        sendJasonResponse(res, 404, {"message" : "application not found"});
                    }else if (err) {
                        sendJasonResponse(res, 400, err);
                    }else{
                        sendJasonResponse(res, 200, application);
                    }
                }
            );
    }else{
        sendJasonResponse(res, 404, {
            "message" : "Not found, reference number required"
        });
    }

};