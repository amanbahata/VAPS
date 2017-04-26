/**
 * Created by aman1 on 18/04/2017.
 */
var request = require('request');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var mailer = require('../communication/change_notification_mailer');
/*
 Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};



module.exports.listApplications = function (req, res) {

    if (req.session && req.session.token) {
        var requestOptions, path;
        path = '/api/applications/open';
        requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            headers: {
                "payload": req.session.token
            }

        };
        request(requestOptions,
            function (err, response, body) {
                listApplicationsRenderer(req, res, body, response);
            }
        );
    }else{
        res.redirect('/users/login');
    }
};

var listApplicationsRenderer = function(req, res,responseBody) {
        var message;
        var response = false;
        var payload = req.session.token;
        var decode = jwt.verify(payload, process.env.JWT_SECRET);
        var username = decode.name;
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
            message: message,
            token: req.query.token,
            userName: username
        });
};


module.exports.openApplication = function (req, res) {

    if (req.session && req.session.token) {

        var requestOptions, path;
        path = '/api/applications/' + req.params.referenceNumber;
        requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            headers: {
                "payload": req.session.token
            }
        };
        request(requestOptions,
            function (err, response, body) {
                renderApplication(req, res, body, response);
            }
        );
    }else {
        res.redirect('/users/login');
    }
};

var renderApplication = function(req, res, responseBody) {
    var message;
    var response = false;
    var payload = req.session.token;
    var decode = jwt.verify(payload, process.env.JWT_SECRET);
    var username = decode.name;

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
                        photoMessage: response,
                        token: req.query.token,
                        userName: username
                    });
                }else {
                        response = true;
                        res.render('application_detail', {
                            title: 'VAPS',
                            application: responseBody[0],
                            photoMessage: response,
                            token: req.query.token,
                            userName: username
                        });
                    }
            });
        }
    }
};


module.exports.doAssessment = function (req, res) {
    var payload = req.session.token;
    var decode = jwt.verify(payload, process.env.JWT_SECRET);
    var username = decode.name;
    var requestOptions, path, postData;
    path = '/api/applications/' + req.params.referenceNumber;
    postData = {
        assessor: username,
        visaNumber: req.body.visaNumber,
        reason: req.body.reason,
        assessmentStatus: req.body.outcome
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "PUT",
        json: postData
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 201){
                mailer.sendEmail(response.body.email, response.body.full_name, response.body.reference_number);
                res.redirect('/users');

            }else{
                res.redirect('/users');
            }
        }
    );
};


module.exports.login = function (req, res) {
    var requestOptions, path, postData;
    path = '/api/login';
    postData = {
        email: req.body.email,
        password: req.body.password
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json: postData
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 200){
                var token = response.body.token;
                req.session.token = token;
                setTimeout(function(){res.redirect('/users')}, 3000);
            }else{
                res.render('login',{
                    title:'Login',
                    pageHeader: {title: 'Login'},
                    message : 'invalid email or password.'
                });
            }
        }
    );
};




module.exports.doLogin = function (req, res) {
    var requestOptions, path, postData;
    path = '/api/login';
    postData = {
        email: req.body.email,
        password: req.body.password
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json: postData
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 200){
                var token = response.body.token;
                req.session.token = token;
                setTimeout(function(){res.redirect('/users')}, 3000);
            }else{
                res.render('login',{
                    title:'Login',
                    pageHeader: {title: 'Login'},
                    message : 'invalid email or password.'
                });
            }
        }
    );
};


module.exports.doLogout = function (req, res) {
    if (req.session && req.session.token){
        req.session.destroy();
        res.redirect('/users/login');
    }else{
        res.redirect('/users/login');
    }
};