/**
 * Created by aman1 on 18/04/2017.
 */
var request = require('request');

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

    var date = responseBody[0].date_of_birth;
    date = date.substring(0,10);
    console.log(date);


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
    path = '/api/applications/' + req.params.reference_number;
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

    console.log(responseBody);


    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
    } else {
        if (!responseBody.length > 0) {
            message = "No open visa applications found";
        }
    }
    res.render('users_home', {
        title: 'VAPS'
    });
};