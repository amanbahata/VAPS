/**
 * Created by aman1 on 13/04/2017.
 */

var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/VAPS';
mongoose.Promise = global.Promise;
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

require('./applications');