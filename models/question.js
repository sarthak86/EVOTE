var mongoose = require('mongoose')

var questionSchema = new mongoose.Schema({
    votingQuestion : String,
    candidates: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Candidates"
        }
     ],
     votingId: String,
     
    // companyPassword : String ,
});

module.exports = questionSchema;
