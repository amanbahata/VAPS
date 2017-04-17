/**
 * Created by aman1 on 25/03/2017.
 */

const nodemailer = require('nodemailer');


// get the data from environment variables
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

    var html = 'Thank yo for applying for a TOURIST visa at the Ethiopian consulate.' +
        'We have included the following information for you to check your visa status.' +
        'APPLICANT NAME:' + applicantName +
        'APPLICATION REFERENCE CODE: ' + applicationRefNumber;

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

