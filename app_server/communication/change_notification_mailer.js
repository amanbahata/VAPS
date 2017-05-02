/**
 * Created by aman1 on 26/04/2017.
 */
const nodemailer = require('nodemailer');


/**
 * get the data from environment variables
 * Make sure the access credentials for the email provider are set up in the .env file
 *
 */
var user_email = process.env.SENDER_EMAIL;
var pass = process.env.SENDER_EMAIL_PASSWORD;

module.exports.sendEmail = function(email, applicantName, applicationRefNumber) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',                               //default mail provider
        auth: {
            user: user_email,
            pass: pass
        }
    });

    var html = '  APPLICANT NAME:' + applicantName + '  APPLICATION REFERENCE CODE: ' + applicationRefNumber + "  .There " +
        "has been change in your visa application status please go online and check. ";

    var mailOptions = {
        from:  user_email,                                                //Senders' email
        to: email,                                                        // receivers email
        subject: 'Please do not reply, VISA APPLICATION',      // Subject line
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};
