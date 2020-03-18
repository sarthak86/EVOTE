const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CompanyDetail = require('../models/question'); 
const CompanyDetail1 = require('../models/voting');


const companyDetailRouter = express.Router();

companyDetailRouter.use(bodyParser.json());



//////////////////////////////////////// VOTING /////////////////////////////




///************Main Dashboard **************///

///************Add New Company **************///

companyDetailRouter.route('/:companyName/add/:questionID')
.get(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
    var b = mongoose.model(req.params.companyName+"Voting" , CompanyDetail1);
    // a.find(function(err, user) {
        b.findById(req.params.questionID,function(err, voting){
            if (err)
                res.send(err);
            console.log(voting);
            res.render("question/addNewQuestion.ejs", { Voting: voting , name: req.params.companyName, Voting: voting });
        // })
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
})
.post(function(req,res){
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
    var b = mongoose.model(req.params.companyName+"Voting" , CompanyDetail1);
    b.findById(req.params.questionID,function(err, result){
        if(err){
        }
            else{
                a.create({
                    votingQuestion: req.body.votingQuestion,
                    votingId: req.params.questionID

                }, function(err, result1){
                    
                    if(err){
                        res.send(err);
                    }        
                    else{
                    console.log("R1"+result1+"R1");
                    // console.log("R"+result+"R");
                        result.question.push(result1);
                        result.save();  
                    }
                    res.redirect("/voting/"+req.params.companyName);
                    
                });
            }
            
        })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
        

        
    });



////View questions

companyDetailRouter.route('/:companyName/view/:questionID/:votingName')
    .get(function(req, res) {
        if(req.session.count){
    
        var b = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
        b.find({votingId:req.params.questionID}, function (err, user) {
            console.log(user.votingQuestion);
            res.render("question/questionManagement.ejs", { Voting: user, name: req.params.companyName, postName: req.params.votingName });
        })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
    });


    ///************Edit All Companies **************///

companyDetailRouter.route('/:companyName/edit')
.get(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail1);
    console.log("!");
    a.find({}, function (err, user) {
        res.render("voting/editAllVoting.ejs", { Voting: user, name: req.params.companyName });
    })
}
else{
    res.redirect("/c/"+req.params.companyName+"/login")
}
});


///************Edit Companies according to ID **************///

companyDetailRouter.route('/:companyName/edit/:questionID')
.get(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
    a.findById(req.params.questionID, function (err, user) {
        if(err){
            console.log(err);
            res.send(err);
        }
            console.log("EDIT QIESTIOM");
        res.render("question/editQuestion.ejs", { Voting: user , name: req.params.companyName });
    })
}
else{
    res.redirect("/c/"+req.params.companyName+"/login")
}
})
.post(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);

    a.findById(req.params.questionID, function(err, company) {

        if (err)
            res.send(err);

        company.votingQuestion= req.body.votingQuestion;
        company.save(function(err) {
            if (err){
                console.log(err);
                res.send(err);
            }
                

            res.redirect("/voting/"+req.params.companyName);
        });

    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});

///************Delete Company **************///

companyDetailRouter.route('/:companyName/delete/:questionID') 
.get(function(req, res) {
    if(req.session.count){
    var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
    var b = mongoose.model(req.params.companyName+"Voting" , CompanyDetail1);
    
    a.remove({
        _id: req.params.questionID
    }, function(err, user) {
        if (err)
            res.send(err);
        
        b.find(function(err, vote){
            console.log(vote.candidates);
        })
            res.redirect("/voting/"+req.params.companyName);
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});




module.exports = companyDetailRouter;