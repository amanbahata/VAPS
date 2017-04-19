/**
 * Created by aman1 on 18/04/2017.
 */
var request = require('request');
var fs = require('fs');


/*
 Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};



module.exports.listApplications = function (req, res) {
    var requestOptions, path;
    path = '/api/applications/open';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json: {}
    };
    request (requestOptions,
        function(err, response, body){
            listApplicationsRenderer(req, res, body, response);
        }
    );
};

var listApplicationsRenderer = function(req, res, responseBody) {
    var message;


    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
    } else {
        if (!responseBody.length > 0) {
            message = "No open visa applications found";
        }
    }
    res.render('users_home', {
        title: 'VAPS',
        applications: responseBody,
        message:message
    });
};


module.exports.openApplication = function (req, res) {
    var requestOptions, path;
    path = '/api/applications/' + req.params.referenceNumber;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json: {}
    };
    request (requestOptions,
        function(err, response, body){
            renderApplication(req, res, body, response);
        }
    );
};

var renderApplication = function(req, res, responseBody) {
    var message;
    var response = false;

    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
    } else {
        if (!responseBody.length > 0) {
            message = "No open visa applications found";
        } else {
                var foldName = (responseBody[0].full_name).replace(/ +/g, "") + responseBody[0].document_number;
                fs.stat("public/uploads/" + foldName, function (err, stats) {
                    if (err) {
                    // Directory doesn't exist or something.
                    console.log('Folder doesn\'t exist');
                    response = false;
                    res.render('application_detail', {
                        title: 'VAPS',
                        application: responseBody[0],
                        photoMessage: response
                    });
                }
                if (!stats.isDirectory()) {
                    // This isn't a directory!
                    callback(new Error('uploads is not a directory!'));
                }else{
                    response = true;
                    res.render('application_detail', {
                        title: 'VAPS',
                        application: responseBody[0],
                        photoMessage: response
                    });

                }
            });
        }
    }

    // res.render('application_detail', {
    //     title: 'VAPS',
    //     application: responseBody[0],
    //     photoMessage: response
    // });
};