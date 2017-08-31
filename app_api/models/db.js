/**
 * Created by aman1 on 13/04/2017.
 */


/**
 * Create the database connection and listen for errors
 * @type {*}
 */

var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/VAPS';
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'production'){
   dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
   console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
   console.log('Mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function () {
   console.log('Mongoose disconnected');
});

/**
 * Import the applications and users collections
 */

require('./applications');
require('./users');