require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

/**
 * Require passport and the database
 */

require('./app_api/models/db');
require('./app_api/config/passport');

/**
 * Define the routes
 */

var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/applications');

var users = require('./app_server/routes/users');

var app = express();

/**
 * Setup the preferred view engine
 */
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

/**
 * Register the servises
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Register the session service
 */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
/**
 * Use the registered touts services
 */
app.use('/', routes);
app.use(passport.initialize());
app.use('/api', routesApi);

app.use('/users', users);

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 *error handler
 */
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});


/**
 * error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
