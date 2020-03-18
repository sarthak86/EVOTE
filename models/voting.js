var mongoose = require('mongoose')

var votingSchema = new mongoose.Schema({
    votingName : String,
    votingStartDate : Date , // will include Time
    votingEndDate : Date,  // will include Time
    // votingStartTime : String , // will include Time
    // votingEndTime : String,
    question: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Questions"
        }
     ],
    // companyPassword : String ,
});

module.exports = votingSchema;






