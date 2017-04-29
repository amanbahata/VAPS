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


module.exports.showStats = function (req, res) {

    var requestOptions, path;
    path = '/api/reports';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        // headers: {
        //     "payload": req.session.token
        // }

    };
    request(requestOptions,
        function (err, response, body) {
            getReports(req, res, body, response);
        }
    );
};

/**
 * Returns the report of the visa processing activity
 * @param req
 * @param res
 * @param responseBody
 */

var getReports = function (req, res, responseBody) {
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
    }else {
        if (!responseBody.length > 0) {
            message = "No data found for this period";
        }
    }
    var jan = 0;
    var feb = 0;
    var mar = 0;
    var apr = 0;
    var may = 0;
    var jun = 0;
    var jul = 0;
    var aug = 0;
    var sep = 0;
    var oct = 0;
    var nov = 0;
    var dec = 0;

    for (var i=0; i<responseBody.length; i++){
        var d = new Date(responseBody[i].application_date);
        var month = parseInt((d.getMonth() + 1), 10);
        console.log(responseBody);
        if (month === 1) {
            jan = jan + 1;
        }else if (month === 2) {
            feb = feb + 1;
        }else if (month === 3) {
            mar = mar + 1;
        }else if (month === 4) {
            apr = apr + 1;
        }else if (month === 5) {
            may = may  + 1;
        }else if (month === 6) {
            jun = jun + 1;
        }else if (month === 7) {
            jul = jul + 1;
        }else if (month === 8) {
            aug = aug + 1;
        }else if (month === 9) {
            sep = sep + 1;
        }else if (month === 10) {
            oct = oct + 1;
        }else if (month === 11) {
            nov = nov + 1;
        }else if (month === 12) {
            dec = dec + 1;
        }
    }
    res.render('stats', {
        title: 'VAPS',
        message: message,
        jan: jan,
        feb: feb,
        mar: mar,
        apr: apr,
        may: may,
        jun: jun,
        jul: jul,
        aug: aug,
        sep: sep,
        oct: oct,
        nov: nov,
        dec: dec
    });
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