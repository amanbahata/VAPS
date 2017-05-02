/**
 * Created by aman1 on 19/04/2017.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


/**
 * Schema for storing users access credentials
 */

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true

    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});


/**
 Encryption of user passwords by first salting and hash afterwards users' password input
 */
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};


/**
 Password validation when users log in to website.
 Returns true if the hashed version of the entered password is equal to the saved hashed version
 of the password and if the user has completed the email verification
 */

userSchema.methods.validatePassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash ;
};


/**
 Generation of a jason web token that expires every seven days
 */

userSchema.methods.generateJWT = function(){
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiryDate.getTime()/1000)}, process.env.JWT_SECRET);   //sends this secret word for the use of the hashing algorithm
};

/**
 * Compile the model
 */
mongoose.model('User', userSchema);