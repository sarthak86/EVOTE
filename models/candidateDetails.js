var mongoose = require('mongoose')

var candidateSchema = new mongoose.Schema({
    candidateName :{
        type: String,
        required: true,
        
    },
    candidateQualification : {
        type: String,
        required: true
    },
    candidateAbout : {
        type: String,
        required: true
    },
    candidateImage : {
        type: String,
    },
    // companyPassword : String ,
    candidateCount : {
        default: 0,
        type: Number,
    },
    questionId:{
        type: String
    }
});

module.exports = candidateSchema;
