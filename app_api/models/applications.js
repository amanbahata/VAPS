/**
 * Created by aman1 on 13/04/2017.
 */
var mongoose = require('mongoose');
require('mongoose-type-email');
var moment = require('moment');
var shortId = require('shortid');


/**
 * Mongoose Schema for the visa assessment section
 */

var assessment_Schema = new mongoose.Schema({
    assessor: {type: String, required: true, uppercase: true},
    visaType: {type: String, default: "VISITOR"},
    visaNumber: {type: String, uppercase: true},
    issueDate: {type: Date, default: Date.now},
    validUntil: {type: Date, default: + new Date() + 90*24*60*60*1000},  // sets the valid until date to 3 months from approval
    reason: {type: String, uppercase: true}
});

/**
 * Mongoose schema for the visa application
 */

var applicant_Schema = new mongoose.Schema({
    open: {type: Boolean, default: true},
    reference_number: {type: String, default: shortId.generate, unique: true},
    assessment_status: {type: String, enum: ['SUBMITTED', 'APPROVED', 'DENIED'], default: 'SUBMITTED', uppercase: true},
    application_date: {type: Date, default: Date.now},
    title: {type: String, enum: ['MR', 'MRS', 'MISS'], uppercase: true},
    full_name: {type: String, required: true, uppercase: true},
    date_of_birth: {type: Date, required: true, uppercase: true},
    place_of_birth: {type: String, required: true, uppercase: true},
    country_of_birth: {type: String, required: true, uppercase: true},
    nationality: {type: String, required: true, uppercase: true},
    home_address: {type: String, required: true, uppercase: true},
    city: {type: String, required: true, uppercase: true},
    postcode: {type: String, required: true, uppercase: true},
    country: {type: String, required: true, uppercase: true},
    contact_no: {type: Number, required: true, uppercase: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, uppercase: true},
    occupation: {type: String, required: true, uppercase: true},
    document_type: {type: String,enum: ['PASSPORT', 'TRAVEL DOCUMENT'], required: true, uppercase: true},
    document_number: {type: String, required: true, uppercase: true},
    document_date_of_issue: {type: Date, required: true, uppercase: true},
    document_country_of_issue: {type: String, required: true, uppercase: true},
    document_expiry_date: {type: Date, required: true},
    contact_address_in_ethiopia: {type: String, required: true, uppercase: true},
    assessment: [assessment_Schema]
});

/**
 * Compile the model
 */

mongoose.model('Application', applicant_Schema);