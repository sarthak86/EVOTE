var mongoose = require('mongoose')
var passportLocalMongoose     = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    userName :{
        type: String,
        // required: true,
    },
    userEmail : {
        type: String,
        // required: true
    },
    userImage : {
        type: String,
        // required: true
    },
    // companyPassword : String ,
    userPhoneNumber : {
        type: Number,
        // required: true
    },
    userCounter:{
        type: Number,
        default: 0
    }, 
    userPassword:{
        type: String
    }
});
// userSchema.plugin(passportLocalMongoose);
// mongoose.model('User', userSchema);
// module.exports = mongoose.model('User');
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", userSchema);


