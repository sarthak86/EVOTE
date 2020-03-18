var mongoose = require('mongoose')
var passportLocalMongoose     = require("passport-local-mongoose");

var companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        // required: true,
        // unique: true
    },
    companyEmail: {
        type: String,
        // required: true,
    },
    companyPassword: {
        type: String,
        // required: true,
    },
    companyPhoneNumber: {
        type: Number,
        // required: true,
    },
    companyStampID: {
        type: String,
        // required: true,
        // unique: true
    },
    companyImage: {
        type: String,
        // required: true,
    },
    companyLogo: {
        type: String,
        // required: true,
    },
    companyCity: {
        type: String,
        // required: true,
    },
    companyStatus:  { 
        type: String, 
        // default: 'Inactive' 
    }
});



module.exports = mongoose.model('CompanyDetails', companySchema);
