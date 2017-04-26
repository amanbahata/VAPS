/**
 * Created by aman1 on 13/04/2017.
 */

var mongoose = require('mongoose');
var Applic = mongoose.model('Application');
var jwt = require('jsonwebtoken');




var sendJasonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

/**
 * Returns the list of open applications
 * @param req
 * @param res
 */
module.exports.listApplicationsOpen = function (req, res) {
    getUser(req, res, function (req, res, userName) {
        Applic.find({'open': true},
            function (err, applications) {
                if (!applications || applications.length < 1) {
                    sendJasonResponse(res, 400, {"message": "No open applications found"});
                } else if (err) {
                    sendJasonResponse(res, 400, err);
                } else {
                    sendJasonResponse(res, 200, applications);
                }
            });
         });
};


/**
 * Returns a single open application
 * @param req
 * @param res
 */
module.exports.applicationsReadOne = function (req, res) {
    getUser(req, res, function (req, res, userName) {
        if (req.params && req.params.referenceNumber) {
            Applic
                .find({'reference_number': req.params.referenceNumber},
                    function (err, application) {
                        if (!application) {
                            sendJasonResponse(res, 404, {"message": "application not found"});
                        } else if (err) {
                            sendJasonResponse(res, 400, err);
                        } else {
                            sendJasonResponse(res, 200, application);
                        }
                    }
                );
        } else {
            sendJasonResponse(res, 404, {
                "message": "Not found, reference number required"
            });
        }
    });

};

/**
 * Adds assessment of an open application
 * @param req
 * @param res
 */
module.exports.assessmentCreate = function (req, res) {

  //  getUser(req, res, function (req, res, userName) {

        var referenceNumber = req.params.referenceNumber;
        if (referenceNumber) {
            Applic
                .find({'reference_number': referenceNumber})
              //  .select('assessment_status assessment open')
                .exec(
                    function (err, application) {
                        if (err) {
                            sendJasonResponse(res, 400, err);
                        } else {
                            console.log(application);
                            doAddAssessment(req, res, application);
                        }
                    }
                );
        } else {
            sendJasonResponse(res, 404, {
                "message": "Not found, reference number required"
            });
        }
   // });
};


/**
 * Adds the assessment outcome of a singe application
 * @param req
 * @param res
 * @param application
 */
var doAddAssessment = function (req, res, application) {
  if (!application) {
      sendJasonResponse(res, 404, {
          "message" : "application reference number not found"
      });
  }else {
      application[0].assessment.push({
          assessor: req.body.assessor ,
          visaNumber: req.body.visaNumber ,
          reason: req.body.reason
      });
      application[0].assessment_status = req.body.assessmentStatus;
      application[0].open = false;
      application[0].save(function(err, application){
          var thisAssessment;
          if(err){
              sendJasonResponse(res, 400, err);
          }else{
             // thisAssessment = application.assessment[0];
              sendJasonResponse(res, 201, application);
          }
      });
  }
};


/**
 * Creates a new application into the database
 * @param req
 * @param res
 */
module.exports.applicationsCreate= function (req, res) {

    console.log(req.body);

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

/**
 * Returns the information of the status of a single application queried by a user
 * @param req
 * @param res
 */
module.exports.applicationCheck = function (req, res) {
    if (req.params && req.params.referenceNumber && req.params.documentNumber){
        Applic
            .find({'reference_number' : req.params.referenceNumber, 'document_number': req.params.documentNumber},
            function (err, application) {
                    if (application.length < 1){
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
            "message" : "Not found, reference or document number required"
        });
    }
};

/**
 * check if a user performing actions exists in the database and that has performed login
 */

var User = mongoose.model('User');
var getUser = function (req, res, callback) {

    if (req.headers && req.headers.payload){
        var payload = req.headers.payload;
        var decode = jwt.verify(payload, process.env.JWT_SECRET);
        var email = decode.email;
        User
            .findOne({email: email})
            .exec(function (err, user) {
                if(!user){
                    sendJsonResponse(res, 404,{"message" : "User not found"});
                    return;
                }else if (err){
                    console.log(err);
                    sendJsonResponse(res, 404, err);
                    return;
                }
                callback(req, res, user.name);
            });
    }else {
        sendJsonResponse(res, 404, {"message" : "User not found"});
        return;
    }

};


