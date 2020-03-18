const express = require('express');
var app = express();
app.use(require("express-session")({
    secret: "once again GOOGLE wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const VotingDetail = require('../models/voting');
const QuestionDetail = require('../models/question');
const CandidateDetail = require('../models/candidateDetails');


var User = require('../models/user');
var expresssession = require("express-session");
app.use(expresssession({
    secret: "once again GOOGLE wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));





const companyDetailRouter = express.Router();

companyDetailRouter.use(bodyParser.json());

companyDetailRouter.route("/info/:companyName")
.get(function(req, res){
    console.log("HI")
    res.render("info.ejs",{name: req.params.companyName})
})

companyDetailRouter.route('/:companyName/logout')
.get(function (req, res) {
    // window.alert("Voting has ended!!!");
    req.session.destroy();
    res.redirect("/s/"+req.params.companyName+"/login");
  })



companyDetailRouter.route('/:companyName/login')
.get(function (req, res) {
    res.render("userLogin.ejs", {name: req.params.companyName });
  })
.post(function (req, res) {
    
    var a = mongoose.model(req.params.companyName+"Users" , User);        
          a.findOne({ userEmail: req.body.email }, function(err, user) {
            if(!user ){
                res.redirect("/s/"+req.params.companyName+"/login")
            }       
            
            else if (user.userPassword != req.body.password) {
                res.redirect("/s/"+req.params.companyName+"/login")
            }else{
                req.session.count = 1;
                
                // res.redirect("/s/info/"+req.params.companyName)
                res.render("info.ejs",{name: req.params.companyName})
            }
            
          });
})

companyDetailRouter.route('/:companyName/:votingName/:num')
.get(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Voting" , VotingDetail);
    var b = mongoose.model(req.params.companyName+"Question" , QuestionDetail);
    var c = mongoose.model(req.params.companyName+"Candidate" , CandidateDetail);
    a.find({votingName : req.params.votingName},function(err, user) {
        // console.log("user "+ user);
        if (err)
            res.send(err);
        // console.log(user[0]._id);
        b.find({votingId: user[0]._id}, function(err, result){
            if(err){

            }
            // console.log();
            c.find({questionId: result[req.params.num]._id}, function(err, result1){
                if(err){
    
                }
                // console.log(result1);
                if( parseInt(req.params.num) == (result.length - 1) ){
                    // console.log("YES")
                    res.render("test.ejs", { Voting: result1 , name: req.params.companyName, votingName: req.params.votingName, end : "true", num: req.params.num, time:user[0].votingEndDate , question: result[req.params.num].votingQuestion });
                    
                }    
                else{
                    // console.log("NO")
                    res.render("test.ejs", { Voting: result1 , name: req.params.companyName, votingName: req.params.votingName, end : "false", num: req.params.num , time:user[0].votingEndDate,  question: result[req.params.num].votingQuestion});
                }
                
            })
    
        })
        
    });
}
    else{
        res.redirect("/s/"+req.params.companyName+"/login")
    }
});



///************Main Dashboard **************///

companyDetailRouter.route('/:companyName/:votingName/:num/c/:candidateId')
.get(function(req, res) {
    console.log("I")
    if(req.session.count){
        var c = mongoose.model(req.params.companyName+"Candidate" , CandidateDetail);
            c.findById(req.params.candidateId, function(err, result1){
                if(err){
                    
                }
                // console.log(result1);
                result1.candidateCount= result1.candidateCount + 1;
                result1.save(function(err) {
                if (err){
                    console.log(err);
                    res.send(err);
                }
                
                res.redirect("/s/"+req.params.companyName+"/"+req.params.votingName+"/"+req.params.num );

            })
        })
    }
    else{
        res.redirect("/s/"+req.params.companyName+"/login")
    }
    
});

companyDetailRouter.route('/:companyName/:votingName/:num/final/:candidateId')
.get(function(req, res) {
    var c = mongoose.model(req.params.companyName+"Candidate" , CandidateDetail);
            c.findById(req.params.candidateId, function(err, result1){
                if(err){
                    
                }
                // console.log(result1);
                result1.candidateCount= result1.candidateCount + 1;
                result1.save(function(err) {
                if (err){
                    console.log(err);
                    res.send(err);
                }
                
                res.render("test1.ejs",{name: req.params.name});

            })
        })
        
    // });
})







// companyDetailRouter.route('/:companyName/:votingName/:votingId')
// .get(function(req, res) {
//     var a = mongoose.model(req.params.companyName+"Voting" , VotingDetail);
//     var b = mongoose.model(req.params.companyName+"Question" , QuestionDetail);
//     var c = mongoose.model(req.params.companyName+"Candidate" , CandidateDetail);
//     b.findById(req.params.votingId,function(err, user) {
//         if (err)
//             res.send(err);
//         // console.log(user._id);
//         c.find({questionId: user._id}, function(err, result){
//             if(err){

//             }
//             console.log(result);
//             res.render("test1.ejs", { Voting: result , name: req.params.companyName, votingName: req.params.votingName });
//         })
        
//     });
// });


///************Add New Company **************///

companyDetailRouter.route('/:companyName/add')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.find(function(err, user) {
        if (err)
            res.send(err); 
            
        res.render("voting/addNewVote.ejs", { VotingDetail: user , name: req.params.companyName });
    });
})
    .post(function(req,res){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
        var user = new a();
        var companyStatus = "";


        a.create({
            votingName: req.body.votingName,
            votingStartDate: req.body.votingStartDate,
            votingEndDate: req.body.votingEndDate,
            // votingStartTime: req.body.votingStartTime,
            // votingEndTime: req.body.votingEndTime
        }, function(req, res, err){
            if(err){
                res.send(err);
            }        });

        res.redirect("/voting/"+req.params.companyName);
    });

///************Edit All Companies **************///

companyDetailRouter.route('/:companyName/edit')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    console.log("!");
    a.find({}, function (err, user) {
        res.render("voting/editAllVoting.ejs", { Voting: user, name: req.params.companyName });
    })
});


///************Edit Companies according to ID **************///

companyDetailRouter.route('/:companyName/edit/:companyID')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.findById(req.params.companyID, function (err, user) {
        if(err){
            console.log(err);
            res.send(err);
        }
            
        res.render("voting/editVote.ejs", { Voting: user , name: req.params.companyName });
    })
})
.post(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);

    a.findById(req.params.companyID, function(err, company) {

        if (err)
            res.send(err);

        company.votingName= req.body.votingName;
        company.votingStartDate= req.body.votingStartDate;
        company.votingEndDate= req.body.votingEndDate;
        company.votingStartTime= req.body.votingStartTime;
        company.votingEndTime = req.body.votingEndTime;
        
        company.save(function(err) {
            if (err){
                console.log(err);
                res.send(err);
            }
                

            res.redirect("/voting/"+req.params.companyName);
        });

    });
});

///************Delete Company **************///

companyDetailRouter.route('/:companyName/delete/:companyID')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.remove({
        _id: req.params.companyID
    }, function(err, user) {
        if (err)
            res.send(err);

        res.redirect("/voting/"+req.params.companyName);
    });
});


// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect("/s/manas");
//   }
  


module.exports = companyDetailRouter;

