/**
 * Created by aman1 on 20/04/2017.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


/**
 * Configure passport local strategy for encryption
 */
passport.use(new LocalStrategy({
        usernameField: 'email'},
    function (username, password, done) {
        User.findOne({email: username}, function (err, user) {
            if (err){
                return done(err);
            }
            if (!user){
                return done(null, false, {
                    "message" : 'Incorrect username.'
                });
            }
            if (!user.validatePassword(password)){
                return done(null, false, {
                    "message" : "Incorrect password."
                });
            }
            return done(null, user);
        });
    }));
